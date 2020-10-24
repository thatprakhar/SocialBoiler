from db.authentication_utils import check_login_credentials, insert_user_credentials, create_auth_token, reset_auth_token, token_validation, get_username
from db.posts_utils import insert_post_details, vote_post_db, get_posts, get_posts_with_topic, get_voted_posts
from db.profile_page_utils import get_profile_details, update_profile_details, insert_profile_details, delete_user_account, update_profile_image
from db.following_utils import add_follower, remove_follower, get_following, get_followers,get_user_topics, follow_topic, unfollow_topic
from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template

import os
import sys
sys.path.append(os.getcwd())


def make_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/sign_up", methods=["POST"])
    def create_account():

        username = request.headers.get("username")
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = insert_user_credentials(username, email, password)

        if status is False:
            return jsonify("Email or Username already exists!")
        elif status == "Invalid Email":
            return jsonify("Invalid Email!")

        auth_token = create_auth_token(username)
        # insert email and username to profile_table
        insert_profile_details(email, username)

        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/login", methods=["POST"])
    def check_login():
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = check_login_credentials(email, password)

        if status is False:
            return jsonify("Incorrect Password or Email!")

        # Get username based on the email
        username = get_username(email)

        # Create auth token based on username
        auth_token = create_auth_token(username)

        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/logout", methods=["POST"])
    def log_out():

        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        # reset authentication token associated with the username once user logs out
        try:
            if reset_auth_token(username, auth_token):
                return jsonify("success")
            else:
                return jsonify("failed")
        except Exception as e:
            print("logout exception")
            return jsonify("failed")

    @app.route("/get_profile_page", methods=["POST"])
    def get_user_profile():
        # This is the user's username
        username = request.headers.get("username")
        # This is the username of the profile we want to get
        profile_user = request.headers.get("profile_user")
        print("profile_user:"+profile_user)
        # This is auth token front frontedn
        auth_token = request.headers.get("auth_token")

        # if username=="null" or profile_user=="null" or auth_token=="null":
        #     return jsonify("failed")

        # Check if the user is logged in, check the auth token
        if username != "null":
            # verify the token with username
            status = token_validation(username, auth_token)
            # print(status)
            if status:
                profile_details = get_profile_details(profile_user)
                return jsonify(profile_details)
            else:
                return jsonify("failed")
        # If the user is not logged in and it requests other user's profile
        else:
            profile_details = get_profile_details(profile_user)
            return jsonify(profile_details)

    @app.route("/update_profile_page", methods=["POST"])
    def update_profile():
        email = request.headers.get("email")
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        phone_number = request.headers.get("tel")
        age = request.headers.get("age")
        about = request.headers.get("about")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if status:
            # update database with the related fields.
            update_status = update_profile_details(
                username, email, phone_number, age, about)
            if update_status == False:
                return jsonify("This email already used!")

            return jsonify("success")

        else:
            return jsonify("failed")

    # Update user's profile image

    @app.route("/update_profile_avatar", methods=["POST"])
    def update_profile_avatar():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        image = request.headers.get("image")

        # print("image is", image)

        status = token_validation(username, auth_token)
        if status:
            update_profile_image(username, image)

            return jsonify("success")

        else:
            return jsonify("failed")

    @app.route("/delete", methods=["POST"])
    def delete_user():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        status = True
        if status:
            delete_user_account(username)
            return jsonify("success")

        else:
            return jsonify("failed")

    @app.route('/insert_post', methods=["POST"])
    def insert_new_post():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        title = request.headers.get("title")
        description = request.headers.get("description")
        image = request.headers.get("image")
        topics = request.headers.get("topics")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)

        if not status:
            return jsonify("failed")
        else:
            insert_post_details(username, title, description, image, topics)

        return jsonify("success")

    @app.route('/vote', methods=["POST"])
    def vote_post():
        auth_token = request.headers.get("auth_token")
        # check if the authentication token is valid
        post_id = request.headers.get("post_id")
        username = request.headers.get("username")
        liked = request.headers.get("liked")
        disliked = request.headers.get("disliked")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        if (liked and disliked) or (not liked and not disliked):
            return jsonify("failed")

        vote_post_db(post_id, username, liked, disliked)
        return jsonify("success")

    @app.route('/follow', methods=["POST"])
    def follow_user():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        followed = request.headers.get("followed")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)

        if not status:
            return jsonify("failed")
        else:
            status = add_follower(username, followed)

        if not status:
            return jsonify("Error following")

        return jsonify("success")

    @app.route('/unfollow', methods=["POST"])
    def unfollow_user():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        followed = request.headers.get("followed")
        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")
        else:
            status = remove_follower(username, followed)

        if not status:
            return jsonify("Error: No such Account")

        return jsonify("success")

    @app.route('/followers', methods=["GET"])
    def user_followers():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        # This is the profile user name and we get followers of that user
        profile_user=request.headers.get("profile_user")

        return jsonify(get_followers(profile_user))


    @app.route('/following', methods=["GET"])
    def user_following():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        # This is the profile user name and we get followering of that user
        profile_user=request.headers.get("profile_user")

        return jsonify(get_following(profile_user))

    @app.route("/follow_topic", methods=["POST"])
    def topic_follow():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        topic = request.headers.get("topic")
        status = token_validation(username, auth_token)
        # status = True
        if not status:
            return jsonify("failed")
        else:
            status = follow_topic(username, topic)

        if status:
            return jsonify('success')
        return jsonify("failed")

    @app.route("/unfollow_topic", methods=["POST"])
    def topic_unfollow():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        topic = request.headers.get("topic")
        status = token_validation(username, auth_token)
        # status = True
        if not status:
            return jsonify("failed")
        else:
            status = unfollow_topic(username, topic)

        if status:
            return jsonify('success')
        return jsonify("failed")

    @app.route("/user_topics", methods=["GET"])
    def user_topics():
        # profile_user = request.headers.get("username")
        profile_user = request.headers.get("profile_user")
        return jsonify(get_user_topics(profile_user))

    @app.route('/get_own_posts', methods=["GET"])
    def get_user_posts():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        #returns an empty list or list of dictionaries including posts
        return jsonify(get_posts(username))

    @app.route('/get_posts_by_topic', methods=["GET"])
    def get_user_posts_by_topic():
        username = request.headers.get("username")
        topic = request.headers.get("topic")
        auth_token = request.headers.get("auth_token")
        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        #returns an empty list or list of dictionaries including posts by topic
        return jsonify(get_posts_with_topic(topic))


    @app.route('/get_voted_posts', methods=["GET"])
    def get_user_voted_posts():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        #returns an empty list or list of dictionaries including posts by topic
        return jsonify(get_voted_posts(username))


    return app
