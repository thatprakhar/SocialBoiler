import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import fetch_rows, fetch_comments_by_user, update_table, fetch_post
from src.db.models import Comments, Posts

def save_comment(username, post_id, comment, bookmarked):
    #check for an empty comment
    if len(comment) == 0:
        return False

    #duplicate comments are allowed

    data = {
        "username": [username],
        "post_id": [post_id],
        "comment": [comment],
        "post_time": dt.datetime.utcnow(),
    }

    new_df = pd.DataFrame(data)
    update_table(new_df, Comments)


def get_commented_posts_by_username(username):
    df = fetch_rows(Comments).to_dict("records")
   
    for record in df:
        if record['username'] != username:
            df.remove(record)

    if len(df) == 0:
        return []

    result = []
    for record in df:
        post_df = fetch_post(Posts, record['post_id']).to_dict('records')
        result += post_df

    return result
    

def get_commented_posts_by_id(post_id):
    df = fetch_rows(Comments).to_dict("records")
    result = []
    for record in df:
        if record['post_id'] == post_id:
            result.append(record)
    
    return result


#print(get_commented_posts_by_id(1))
#print(get_commented_posts_by_username("prakhar"))
#save_comment("prakhar", 38, "ananinki yorumu", False)