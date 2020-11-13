import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(_file_)))))
from src.db.crud import fetch_rows, fetch_comments_by_user, update_table
from src.db.models import Comments

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
        "bookmarked": [bookmarked],
    }

    new_df = pd.DataFrame(data)
    update_table(new_df, Comments)


#save_comment("prakhar", 38, "ananinki yorumu", False)