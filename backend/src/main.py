from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template

import os
import sys
sys.path.append(os.getcwd())
from db.authentication_utils import check_login_credentials, insert_user_credentials, create_auth_token, reset_auth_token,token_validation
from db.profile_page_utils import get_profile_details, update_profile_details, insert_profile_details, delete_user_account

def make_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/sign_up", methods=["POST"])
    def create_account():
        name = request.headers.get("name")
        surname = request.headers.get("surname")
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = insert_user_credentials(name,surname, email,password)
        if status is False:
            return jsonify("Email already exists!")

        auth_token = create_auth_token(email)
        #insert email and names to profile_table
        insert_profile_details(email, name, surname)

        return jsonify(auth_token)

    @app.route("/login", methods=["POST"])
    def check_login():
        email = request.headers.get("email")
        password = request.headers.get("password")
        status = check_login_credentials(email,password)

        if status is False:
            return jsonify("Incorrect Password or Email!")

        auth_token = create_auth_token(email)
        #print(auth_token)
        return jsonify(auth_token)

    @app.route("/logout", methods=["POST"])
    def log_out():
        email = request.headers.get("email")
        auth_token = request.headers.get("auth_token")
        #reset authentication token associated with the email once user logs out
        if reset_auth_token(email, auth_token):
            return jsonify("success")
        else:
            return jsonify("failed")


    @app.route("/get_profile_page", methods=["POST"])
    def get_user_profile():
        # This is the user's email
        email = request.headers.get("email")
        # This is the email of the profile we want to get
        profile_email=request.headers.get("profile_email")
        #fetch email, tel, age, about, name  and send it to frontend
        auth_token=request.headers.get("auth_token")

        if email=="null" or profile_email=="null" or auth_token=="null":
            return jsonify("failed")


        status=token_validation(email, auth_token)
        if status:
            profile_details = get_profile_details(profile_email)
            return jsonify(profile_details)
        else:
            return jsonify("failed")


    @app.route("/update_profile_page", methods=["POST"])
    def update_profile():
        email = request.headers.get("email")
        auth_token = request.headers.get("auth_token")
        phone_number = request.headers.get("tel")
        age = request.headers.get("age")
        about = request.headers.get("about")

        #check if the authentication token is valid
        status = token_validation(email, auth_token)
        if status:
            #update database with the related fields. 
            update_profile_details(email, phone_number, age, about)
            return jsonify("success")

        else:
            return jsonify("failed")


    @app.route("/delete", methods=["POST"])
    def delete_user():
        email = request.headers.get("email")
        auth_token = request.headers.get("auth_token")

        #check if the authentication token is valid
        status = token_validation(email, auth_token)
        if status:
            delete_user_account(email) 
            return jsonify("success")

        else:
            return jsonify("failed")


    return app
