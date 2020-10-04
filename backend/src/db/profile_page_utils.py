import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import update_table, fetch_rows, update_authentication_token, update_user_profile, delete_rows
from src.db.models import User_Credentials,Profile_Page

def insert_profile_details(email, name, surname):
    data = {"email": [email], 'name': [name], 'surname': surname}

    new_df = pd.DataFrame(data)
    update_table(new_df,Profile_Page)


def get_profile_details(email):
    """
        param email: the email associated with the user
        returns: name, surname, email, phone number, age, and about info of the user
    """
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the email parameter
        user_credentials_df = user_credentials_df.loc[user_credentials_df['email'] == email]

        # get the required parameters from the row.
        name = user_credentials_df.iloc[0]['name'] 
        surname = user_credentials_df.iloc[0]['surname'] 

        # fetch data in the profile page table
        profile_page_df = fetch_rows(Profile_Page)

        # get the row associated with the email parameter
        profile_page_df = profile_page_df.loc[profile_page_df['email'] == email]

        #get the required parameters
        phone_number = profile_page_df.iloc[0]['phone_number']
        age = profile_page_df.iloc[0]['age']
        about = profile_page_df.iloc[0]['about']
    except Exception as inst:
        return {"error": "can not get profile"}

    return {"email": email, "name": name, "surname": surname, "phone_number": phone_number, "age": age, "about": about}


def update_profile_details(email, phone_number, age, about):
    """
        param email: String, email associated with user
        param phone_number: String, phone number associated with user
        param age: String, age associated with user
        param about: String, description associated with user
    """

    update_user_profile(Profile_Page, email, phone_number, age, about)


def delete_user_account(email):
    delete_rows(User_Credentials, email)
    delete_rows(Profile_Page, email)



