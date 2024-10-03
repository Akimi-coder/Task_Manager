from enum import Enum

from pydantic import BaseModel

from connector import DatabaseConnector
from fastapi import FastAPI, HTTPException

app = FastAPI()
database = DatabaseConnector()

class Status(str, Enum):
    pending = 'pending'
    in_progress = 'in_progress'
    completed = 'completed'

class TaskBase(BaseModel):
    title: str
    description: str
    status: Status = Status.pending

@app.get("/tasks")
def read_root():
    tasks = database.get_tasks()
    return tasks

# Get a task by id
@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    task = database.get_task_by_id(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task(task_id: int):
    db_task = database.delete_task(task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"detail": "Task deleted"}

@app.post("/tasks/")
def create_user(task:TaskBase):
    new_task = database.add_new_task(task.title,task.description,task.status)
    return new_task

@app.put("/tasks/{task_id}")
def update_task(task_id: int,task:TaskBase):
    updated_task = database.update_task(task_id,task.title,task.description,task.status)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    return updated_task
