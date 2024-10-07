from passlib.context import CryptContext
from sqlalchemy.orm import Session

from baseModels.models import UserBase
from db.model import User
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, Enum, TIMESTAMP, func, DateTime

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

def get_user_by_username(db: Session,username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserBase):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username,password=hashed_password)
    db.add(db_user)
    db.commit()
    return "complete"

def authenticate_user(db: Session, username: str, password: str):
    user =  db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not pwd_context.verify(password,user.password):
        return False
    return user



