from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime as dt
from sqlalchemy import(
    Column,
    Boolean,
    String,
    Integer,
    Float,
    DateTime,
    JSON,
    ARRAY,
    ForeignKey
)

Base = declarative_base()

class User_Credentials(Base):
    __tablename__ = "user_credentials"
    username = Column (String, primary_key=True ,nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    auth_token = Column(String, nullable=True)
    followers = Column(ARRAY(String), nullable=True)
    following = Column(ARRAY(String), nullable=True)
    topics_following = Column(ARRAY(String), nullable=True)

class Profile_Page(Base):
    __tablename__ = "profile_page"
    username = Column(String, primary_key=True, nullable=False)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    age = Column(String, nullable=True)
    about = Column(String, nullable=True)
    image=Column(String, nullable=True)


class Posts(Base):
    __tablename__ = "posts"
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    title = Column(String, nullable=True)
    likes = Column(Integer, nullable=True)
    dislikes = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    date_created = Column(String, nullable=True)
    topics = Column(String, nullable=True)
    anonymous = Column(String, nullable=False)

class Likes(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    liked = Column(Boolean, nullable=True)
    disliked = Column(Boolean, nullable=True)


class Comments(Base):
    __tablename__ = "comments"
    username = Column(String, primary_key=True, nullable=False)
    post_id = Column(Integer, nullable=False)
    comment = Column(String, nullable=False)

class Topics(Base):
    __tablename__ = "topics"
    topic_title = Column(String, primary_key=True, nullable=False)
    posts_ids = Column(ARRAY(Integer), nullable=True)

if __name__ == "__main__":
    pass