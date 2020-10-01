from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template

import os
import sys
sys.path.append(os.getcwd())
print(os.getcwd())
from db.utils import check_login_credentials, insert_user_credentials, create_auth_token, reset_auth_token

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
            return jsonify("The email is not in correct format or it already exists!")

        auth_token = create_auth_token(email)
        #print(auth_token)
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
        
        #check if authentication token correpsonds to the one in database
        #reset authentication token associated with the email once user logs out
        if reset_auth_token(email,auth_token):
            return jsonify("Logout succesful")
        else:
            return jsonify("Logout failed")


    return app
