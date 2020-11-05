import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import update_table, fetch_rows, update_authentication_token, update_user_profile, delete_rows, update_user_credentials, update_profile_avatar, delete_account_likes, delete_topics_data, update_post_likes, delete_post_likes_or_comments

from src.db.following_utils import remove_deleted_followings
from src.db.posts_utils import get_posts, get_downvoted_posts_by_user, get_upvoted_posts_by_user
from src.db.models import User_Credentials,Profile_Page,Posts, Topics, Likes, Comments


# def insert_profile_details(email, name, surname):
def insert_profile_details(email, username):
    data = {"email": [email], "username": [username]}

    new_df = pd.DataFrame(data)
    update_table(new_df,Profile_Page)


# def get_profile_details(email):
def get_profile_details(username):
    """
        param email: the email associated with the user
        returns: name, surname, email, phone number, age, and about info of the user
    """
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_credentials_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the required parameters from the row.

        email=user_credentials_df.iloc[0]['email']

        # fetch data in the profile page table
        profile_page_df = fetch_rows(Profile_Page)

        # get the row associated with the email parameter
        profile_page_df = profile_page_df.loc[profile_page_df['username'] == username]

        #get the required parameters
        phone_number = profile_page_df.iloc[0]['phone_number']
        age = profile_page_df.iloc[0]['age']
        about = profile_page_df.iloc[0]['about']

        image=profile_page_df.iloc[0]['image']
    except Exception as inst:
        return {"error": "can not get profile"}

    return {"email": email, "username": username, "phone_number": phone_number, "age": age, "about": about, "image": image}


def update_profile_details(username, email, phone_number, age, about):
    """
        param email: String, email associated with user
        param phone_number: String, phone number associated with user
        param age: String, age associated with user
        param about: String, description associated with user
    """
    # Check if email already exists in the database and it is not the user's
    df = fetch_rows(User_Credentials)
    email_df = df["email"]
    user_email=df.loc[df['username']==username].iloc[0]["email"]

    if email in email_df.values and email!=user_email:
        return False

    update_user_profile(Profile_Page, username, email, phone_number, age, about)
    update_user_credentials(User_Credentials, username, email)

    return True

# Update user's profile avatar
def update_profile_image(username, image):

    # print("in utils: ", image)

    update_profile_avatar(Profile_Page, username, image)
    return True

def delete_user_comments(username):
    delete_rows(Comments, username)

def delete_user_posts_votes_and_comments(username):
    userPosts = get_posts(username)
    for post in userPosts:
        delete_post_likes_or_comments(Likes, post['post_id'])
        delete_post_likes_or_comments(Comments, post['post_id'])
    delete_rows(Comments, username)

def delete_user_votes(username):
    upvotedPosts = get_upvoted_posts_by_user(username)
    for post in upvotedPosts:
        likes = post["likes"]
        dislikes = post["dislikes"]
        likes -= 1
        update_post_likes(post["post_id"], likes, dislikes)

    downvotedPosts = get_downvoted_posts_by_user(username)
    for post in downvotedPosts:
        likes = post["likes"]
        dislikes = post["dislikes"]
        dislikes -= 1
        update_post_likes(post["post_id"], likes, dislikes)
    delete_rows(Likes, username)
    # print(upvoted)

def delete_user_account(username):
    delete_user_votes(username)
    delete_user_posts_votes_and_comments(username)
    delete_user_comments(username)
    remove_deleted_followings(username)
    delete_rows(User_Credentials, username)
    delete_rows(Profile_Page, username)

    posts_to_deleted = get_posts(username)
    if not posts_to_deleted:
        return

    #delete the posts that user posted
    delete_rows(Posts, username)

    post_ids = []
    #delete each entry with the post id in likes
    for post in posts_to_deleted:
        post_ids.append(post['post_id'])
        delete_account_likes(post['post_id'])

    #extract the post_ids from topics too
    topics_df = fetch_rows(Topics)

    if topics_df.empty:
        return

    topics_dict = topics_df.to_dict('records')
    #iterate through lsit of dictionaries and delete the id if there is the post id in that dict
    for entry in topics_dict:
        if entry['posts_ids']:
            set_entry_ids = set(entry['posts_ids'])
            removed_topics_list = set_entry_ids - set(post_ids)
            entry['posts_ids'] = list(removed_topics_list)

    updated_df = pd.DataFrame(topics_dict)
    delete_topics_data()
    update_table(updated_df, Topics)