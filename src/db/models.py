from sqlalchemy.ext.declarative import declarative_base
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
    user_id = Column(Integer, primary_key=True, autoincrement = True)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)


if __name__ == "__main__":
    pass