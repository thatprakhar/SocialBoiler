import pandas as pd
import datetime as dt
import os
import sys

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
from src.db.crud import (
    update_table,
    fetch_post,
    update_post_likes,
    delete_row_likes,
    fetch_user_post,
    fetch_posts_with_topic,
    fetch_users_following
)
from src.db.models import Posts, Likes


def insert_post_details(username, title, description, image, topics):
    data = {
        "username": [username],
        "title": [title],
        "description": [description],
        "image": [image],
        "likes": 0,
        "dislikes": 0,
        "date_created": dt.datetime.utcnow(),
        "topics": [topics],
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
  
    #if the user is not following anyone return empty list
    if not users_following:
        return []
    
    result = []
    for user in users_following:
        result += (fetch_user_post(user).to_dict("records"))

    return result
    
