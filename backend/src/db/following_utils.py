import hashlib
import pandas as pd
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import fetch_rows, update_followers, update_topic, update_user_topics
from src.db.models import User_Credentials, Topics

def add_follower(username, user_followed):
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the followed user credentials
        followed_df = user_credentials_df.loc[user_credentials_df['username'] == user_followed]

        # get the user's following list
        user_following = user_df['following'].values[0]

        # get the followed user followers list
        followed_followers  = followed_df['followers'].values[0]

        # add User_followed to the user's following list
        if user_following is None:
            user_following = [user_followed]
        else:
            if user_followed not in user_following:
                user_following.append(user_followed)
            else:
                return False

        # add User to the user_followed's followers list
        if followed_followers is None:
            followed_followers = [username]
        else:
            if username not in followed_followers:
                followed_followers.append(username)
            else:
                return False

        # call databse to make changes
        update_followers(User_Credentials,username, user_followed,
                                user_following, followed_followers)

    except Exception as inst:
        return False
    return True

def remove_follower(username, user_followed):
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the followed user credentials
        followed_df = user_credentials_df.loc[user_credentials_df['username'] == user_followed]

        # get the user's following list
        user_following = user_df['following'].values[0]

        # get the followed user followers list
        followed_followers  = followed_df['followers'].values[0]

        # remove user_followed the user's following list
        if user_following is None:
            return False
        else:
            user_following.remove(user_followed)

        # remove user from the user_followed's followers list
        if followed_followers is None:
            return False
        else:
            followed_followers.remove(username)

        # call databse to make changes
        update_followers(User_Credentials,username, user_followed,
                                user_following, followed_followers)

    except Exception as inst:
        return False
    return True

def get_followers(username):
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the user's following list
        followers = user_df['followers'].values[0]
        return followers

    except Exception as inst:
        return None


def get_following(username):
    try:
    # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the user's following list
        following = user_df['following'].values[0]
        return following

    except Exception as inst:
        return None

def mass_remove_followings(user_credentials_df, username, user_followed):
    # this function does not retreive the user_credentials table, it is passed to it
    # by the function that removes a user's followers/following when deleting the account

    try:
        # get the row associated with the user parameter
        user_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the followed user credentials
        followed_df = user_credentials_df.loc[user_credentials_df['username'] == user_followed]

        # get the followed user followers list
        followed_followers  = followed_df['followers'].values[0]

        # if no followers, then the call failed.
        if followed_followers is None:
            return False
        else:
            # update the user's followers list
            followed_followers.remove(username)

        # since we don't care about the deleted user anymore, just pass an empty
        # list. The list fo deletion is already returieved
        user_following = []

        #make the call to the database to make changes
        update_followers(User_Credentials,username, user_followed,
                                user_following, followed_followers)
    except Exception as inst:
        return False
    return True


def remove_deleted_followings(username):
    user_credentials_df = fetch_rows(User_Credentials)

    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    # get the user's following list
    user_following = user_df['following'].values[0]

    # get the followed user followers list
    user_followers = user_df['followers'].values[0]

    # remove the the user from ther "followers" list in other accounts
    if user_following is not None:
        user_following_copy = user_following[:]
        for user in user_following_copy:
            print(user)
            mass_remove_followings(user_credentials_df, username, user)


    # remove the the user from ther "following" list in other accounts
    if user_followers is not None:
        user_followers_copy = user_followers[:]
        for user in user_followers_copy:
            print(user)
            mass_remove_followings(user_credentials_df, user, username)

def follow_topic(username, topic):
    user_credentials_df = fetch_rows(User_Credentials)
    topics_df = fetch_rows(Topics)

    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    # get the user's topics list
    user_topics = user_df['topics_following'].values[0]

    topic_df = topics_df.loc[topics_df['topic_title'] == topic]
    if len(topic_df.index) == 0:
        return False

    if user_topics is None:
            user_topics = [topic]
    else:
        if topic not in user_topics:
            user_topics.append(topic)
        else:
            return False
    update_user_topics(User_Credentials, username, user_topics)
    return True

def unfollow_topic(username, topic):
    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    # get the user's topics list
    user_topics = user_df['topics_following'].values[0]

    if user_topics is None:
            return False
    else:
        if topic not in user_topics:
            return False
        else:
            user_topics.remove(topic)
    update_user_topics(User_Credentials, username, user_topics)
    return True

def add_post_to_topic(topic, postID):
    topics_df = fetch_rows(Topics)

    topic_df = topics_df.loc[topics_df['topic_title'] == topic]
    if len(topic_df.index) == 0:
        update_topic(Topics, topic, [int(postID)])
    else:
        posts = topic_df['posts_ids'].values[0]
        if postID not in posts:
            posts.append(postID)
        update_topic(Topics, topic, posts)

def remove_post_from_topic(topic, postID):
    topics_df = fetch_rows(Topics)

    topic_df = topics_df.loc[topics_df['topic_title'] == topic]
    if len(topic_df.index) == 0:
        return False
    else:
        posts = topic_df['posts_ids'].values[0]
        if postID not in posts:
            return False
        else:
            posts.remove(postID)
            update_topic(Topics, topic, posts)
    return True

def get_user_topics(username):
    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    # get the user's topics list
    user_topics = user_df['topics_following'].values[0]
    if user_topics is None:
        user_topics = []
    return user_topics