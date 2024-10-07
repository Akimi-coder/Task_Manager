
from sqlalchemy import Column, Integer, String, Text, Enum, TIMESTAMP, func, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from db.database import Base,engine

class Task(Base):
    __tablename__ = 'Tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum('Pending', 'In progress', 'Completed'), default='Pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class User(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255),unique=True, index=True)
    password = Column(String(255))

Task.metadata.create_all(engine)
User.metadata.create_all(engine)