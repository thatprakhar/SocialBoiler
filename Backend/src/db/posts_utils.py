import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import Posts, Likes
from src.db.crud import update_table, fetch_post, update_post_likes


def insert_post_details(username, title, description, image, topics):
    data = {"username": [username], "title": [title], "description": [description], "image":[image], "likes": 0, "dislikes": 0, 
    "date_created": dt.datetime.utcnow(), "topics": [topics]}

    new_df = pd.DataFrame(data)
    update_table(new_df, Posts)


def vote_post(post_id, username, liked, disliked):
    data = {"post_id": post_id, "username": [username], "liked": liked, "disliked": disliked}
    new_df = pd.DataFrame(data)
    update_table(new_df, Likes)
    
    post_df = fetch_post(Posts, post_id)
    if liked:
        post_df["likes"] += 1
    else:
        post_df["dislikes"] += 1

    update_post_likes(post_id, post_df["likes"], post_df["dislikes"])