import hashlib
import pandas as pd

import os 
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import update_table, fetch_rows
from src.db.models import User_Credentials

def hash_password(password):
    """
        param password: password to be encoded
        returns: the encoded function to be uploaded to database
    """
    #convert string to byte equivalent
    password = password.encode()
    #feed the byte format to hash function 
    result = hashlib.sha256(password)
    #hexadecimal equivalent of encoded string
    result = result.hexdigest()

    return result

def insert_user_credentials(name, surname, email, password):
    #check if email is already present in the database
    df = fetch_rows(User_Credentials)
    df = df["email"]

    #if email is already present, don't upload the info to table
    if email in df.values:
        return False

    # else, hash the password, and append the credentials to the related table
    hashed_password = hash_password(password)

    data = {"name": [name], 'surname': [surname], "email": [email], "password":[hashed_password]}
    new_df = pd.DataFrame(data)

    update_table(new_df, User_Credentials)
    return True


#def check_login_credentials(email, password):


insert_user_credentials("Onur","onen", "onur.onen20@gmail.com","hahahahhahaah")


