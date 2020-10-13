import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import Posts
from src.db.crud import update_table


def insert_post_details(username, title, description, image, topics):
    data = {"username": [username], "title": [title], "description": [description], "image":[image], "likes": 0, "dislikes": 0, 
    "date_created": dt.datetime.utcnow(), "topics": [topics]}

    new_df = pd.DataFrame(data)
    update_table(new_df, Posts)

