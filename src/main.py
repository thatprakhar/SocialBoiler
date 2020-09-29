from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template

import os
import sys
sys.path.append(os.getcwd())
print(os.getcwd())
from db.utils import check_login_credentials, insert_user_credentials

def make_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/sign_up")
    def create_account():
        name = request.headers.get("name")
        surname = request.headers.get("surname")
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = insert_user_credentials(name,surname, email,password)
        return jsonify(status)

    @app.route("/login")
    def check_login():
        email = request.headers.get("email")
        password = request.headers.get("password")
        status = check_login_credentials(email,password)
        return jsonify(status)

    return app
