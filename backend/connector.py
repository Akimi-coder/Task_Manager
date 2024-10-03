from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, TIMESTAMP, func, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func

Base = declarative_base()

class Task(Base):
    __tablename__ = 'Tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum('Pending', 'In progress', 'Completed'), default='Pending')
    created_at = Column(DateTime(timezone=True), server_default=func.utcnow())
    updated_at = Column(DateTime(timezone=True), onupdate=func.utcnow())



class DatabaseConnector:
    def __init__(self):
        engine = create_engine('mysql+pymysql://root:root@localhost:3306/db')
        SessionMaker = sessionmaker(bind=engine)
        self.session = SessionMaker()
        Base.metadata.create_all(engine)
        try:
            with engine.connect() as connection:
                print("Connection successful!")
        except Exception as e:
            print("Connection failed:", e)

    def get_tasks(self):
        tasks = self.session.query(Task).all()
        return tasks

    def get_task_by_id(self,task_id):
        task = self.session.query(Task).filter(Task.id == task_id).first()
        return task

    def delete_task(self,task_id):
        db_task = self.session.query(Task).filter(Task.id == task_id).first()
        if db_task is None:
            return None
        self.session.delete(db_task)
        self.session.commit()
        return db_task

    def add_new_task(self,title, description=None, status='pending'):
        new_task = Task(title=title, description=description, status=status)
        self.session.add(new_task)
        self.session.commit()
        return new_task

    def update_task(self, task_id, title=None, description=None, status=None):
        db_task = self.session.query(Task).filter(Task.id == task_id).first()
        if db_task is None:
            return None

        if title is not None:
            db_task.title = title
        if description is not None:
            db_task.description = description
        if status is not None:
            db_task.status = status
        if db_task.updated_at is not None:
            db_task.updated_at = func.now()

        self.session.commit()
        return db_task

