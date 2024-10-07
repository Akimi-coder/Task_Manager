from sqlalchemy import func
from sqlalchemy.orm import Session

from baseModels.models import TaskBase
from db.model import Task

def get_tasks(db: Session):
    tasks = db.query(Task).all()
    return tasks

def get_task_by_id(db: Session,task_id):
    task = db.query(Task).filter(Task.id == task_id).first()
    return task

def delete_task(db: Session,task_id):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        return None
    db.delete(db_task)
    db.commit()
    return db_task

def create_task(db: Session, task: TaskBase):
    db_task = Task(title=task.title, description=task.description, status=task.status)
    db.add(db_task)
    db.commit()
    return db_task

def update_task(db: Session, task_id, task: TaskBase):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        return None
    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    db_task.updated_at = func.now()
    db.commit()
    return db_task
