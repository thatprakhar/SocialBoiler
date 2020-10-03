import hashlib
import pandas as pd
import datetime as dt
import os
import sys
import re
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import update_table, fetch_rows,update_authentication_token
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

def emailIsValid(email):
    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
    if(re.search(regex,email)):
        return True
    else:
        return False

def insert_user_credentials(name, surname, email, password):
    #check if email is already present in the database
    df = fetch_rows(User_Credentials)
    df = df["email"]

    #if email is already present, don't upload the info to table
    if email in df.values:
        return False

    # if email format is invalid, don't upload info
    if not emailIsValid(email):
        return False

    # else, hash the password, and append the credentials to the related table
    hashed_password = hash_password(password)

    data = {"name": [name], 'surname': [surname], "email": [email], "password":[hashed_password]}
    new_df = pd.DataFrame(data)

    update_table(new_df, User_Credentials)
    return True


def check_login_credentials(email, password):
    df = fetch_rows(User_Credentials)
    dfemail = df["email"] #load the email values into dfemail

    hashed_password = hash_password(password) #hash the password that is inputted

    dfpass = df["password"] #load the password values into dfpass

    #check if the email and the password exist in the database
    if email in dfemail.values and hashed_password in dfpass.values:
        #check if the corresponding email has the corresponding password
        if ((df['email'] == email) & (df['password'] == hashed_password)).any():
            return True

    return False


def create_auth_token(email):
    #append email with datetime
    time = dt.datetime.utcnow().strftime("%m/%d/%Y, %H:%M:%S")
    auth_string = email + time
    #hash the resulting string
    encrypted_auth_string = hash_password(auth_string)

    #update the authentication token of user
    update_authentication_token(User_Credentials, email, encrypted_auth_string)

    #return the encrypted string
    return encrypted_auth_string


def reset_auth_token(email, auth_token):
    df = fetch_rows(User_Credentials)

    df = df.loc[df['email'] == email]
    auth_db = "\"" + df.iloc[0]['auth_token'] + "\""

    if (auth_token == auth_db):
        update_authentication_token(User_Credentials, email, "")
        return True
    else:
        return False