import pandas as pd
import datetime as dt
import os
import sys

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
from src.db.crud import (
    update_table,
    fetch_rows,
    fetch_post,
    update_post_likes,
    delete_row_likes,
    fetch_user_post,
    fetch_posts_with_topic,
    fetch_users_following,
    fetch_topics_following,
    fetch_votes_by_user,
    update_post_bookmarked
)
from src.db.models import Posts, Likes, Topics


def insert_post_details(username, title, description, image, topics, anonymous):
    data = {
        "username": [username],
        "title": [title],
        "description": [description],
        "image": [image],
        "likes": 0,
        "dislikes": 0,
        "date_created": dt.datetime.utcnow(),
        "topics": [topics],
        "anonymous": [anonymous]
    }

    new_df = pd.DataFrame(data)
    update_table(new_df, Posts)


def check_repeated_vote(post_id, username, liked, disliked):
    # fetch likes in likes table with post id
    post_id_likes_df = fetch_post(Likes, post_id)

    # if there is no data with the post id return false
    if post_id_likes_df.empty:
        return False

    # filter to specified username
    post_id_likes_df = post_id_likes_df.loc[post_id_likes_df["username"] == username]

    # if there is no data about the post id with specified user return false
    if post_id_likes_df.empty:
        return False

    # if the user is trying to repeat same voting
    if liked and post_id_likes_df["liked"].bool():
        return True
    elif disliked and post_id_likes_df["disliked"].bool():
        return True

    # delete the row in likes
    delete_row_likes(Likes, post_id, username)

    post_df = fetch_post(Posts, post_id)
    likes = post_df.iloc[0]["likes"].item()
    dislikes = post_df.iloc[0]["dislikes"].item()

    if liked:
        dislikes -= 1
        update_post_likes(post_id, likes, dislikes)
    elif disliked:
        likes -= 1
        update_post_likes(post_id, likes, dislikes)

    return False


def vote_post_db(post_id, username, liked, disliked):
    if check_repeated_vote(post_id, username, liked, disliked):
        return

    data = {
        "post_id": post_id,
        "username": [username],
        "liked": liked,
        "disliked": disliked,
    }

    new_df = pd.DataFrame(data)

    update_table(new_df, Likes)

    post_df = fetch_post(Posts, post_id)
    likes = post_df.iloc[0]["likes"].item()
    dislikes = post_df.iloc[0]["dislikes"].item()

    if liked:
        likes += 1
    else:
        dislikes += 1

    update_post_likes(post_id, likes, dislikes)


def get_posts(username):
    user_df = fetch_user_post(username).to_dict("records")
    return user_df


def get_posts_with_topic(topic):
    posts_df = fetch_posts_with_topic(topic).to_dict("records")
    return posts_df


def get_voted_posts(username):
    user_posts = fetch_user_post(username)

    df = user_posts.loc[(user_posts["likes"] > 0) | (user_posts["dislikes"] > 0)]
    # Check of the dataframe get back is empty, if empty we return empty array
    if df.empty:
        return []
    else:
        return df


def get_followings_posts(username):
    users_following = fetch_users_following(username)
    users_following = users_following.iloc[0]['following']
    result = []


    #if the user is following anyone fetch records
    if users_following:
        for user in users_following:
            result += fetch_user_post(user).to_dict("records")


    topics_following = fetch_topics_following(username)
    topics_following = topics_following.iloc[0]['topics_following']

    #if the user is following anyone fetch topics
    if topics_following:
        #fetch posts associated with the topics
        for topic in topics_following:
            result += fetch_posts_with_topic(topic).to_dict("records")

    #convert to dataframe to easily drop duplicates from combined df
    result = pd.DataFrame(result).drop_duplicates(subset='date_created', keep='first')
    return result.to_dict('records')


def get_voted_posts_by_user(username):
    user_votes = fetch_votes_by_user(username)

    if user_votes.empty:
        return []

    result = []

    post_ids = user_votes['post_id'].to_dict()
    for postid in post_ids:
        post_df = fetch_post(Posts, post_ids[postid]).to_dict("records")
        result += post_df

    return result


def get_upvoted_posts_by_user(username):
    user_votes = fetch_votes_by_user(username)

    if user_votes.empty:
        return []

    result = []

    upvotes = user_votes.loc[(user_votes['liked'] == True)]

    if upvotes.empty:
        return []

    post_ids = upvotes['post_id'].to_dict()

    for postid in post_ids:
        post_df = fetch_post(Posts, post_ids[postid]).to_dict("records")
        result += post_df

    return result

def get_downvoted_posts_by_user(username):
    user_votes = fetch_votes_by_user(username)

    if user_votes.empty:
        return []

    result = []

    downvotes = user_votes.loc[(user_votes['disliked'] == True)]

    if downvotes.empty:
        return []

    post_ids = downvotes['post_id'].to_dict()

    for postid in post_ids:
        post_df = fetch_post(Posts, post_ids[postid]).to_dict("records")
        result += post_df

    return result

def get_post_by_id(post_id):
    return fetch_post(Posts, post_id).to_dict("records")

def get_all_topics():
    df = fetch_rows(Topics)
    if not df:
        return {}

    df = df['topic_title']
    return df.to_dict()

def bookmark_or_debookmark_post(post_id, username):
    # get the post associated with the post id
    df = get_post_by_id(post_id)

    if df[0]['bookmarked'] is None:
        df[0]['bookmarked'] = []
        df[0]['bookmarked'].append(username)

    # if the username is already bookmarked, remove the username, (the user wants to remove bookmark)
    elif username in df[0]['bookmarked']:
        df[0]['bookmarked'].remove(username)
    else:
        df[0]['bookmarked'].append(username)

    update_post_bookmarked(post_id, df[0]['bookmarked'])


def get_bookmarked_posts_by_user(username):
    df = fetch_rows(Posts)
    if df is None or df.empty:
        return []

    df = df.to_dict("records")
    filtered_dict = []

    for record in df:
        if record['bookmarked'] is not None and username in record['bookmarked']:
            filtered_dict.append(record)

    return filtered_dict


def remove_user_from_bookmared(username):
    df = fetch_rows(Posts)
    if df is None or df.empty:
        return

    # if the username is already bookmarked, remove the username, (the user wants to remove bookmark)
    for _, row in df.iterrows():
        if row['bookmarked'] is not None:
            if username in row['bookmarked']:
                row['bookmarked'].remove(username)
                update_post_bookmarked(row['post_id'], row['bookmarked'])