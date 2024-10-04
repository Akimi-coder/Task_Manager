from connector import DatabaseConnector
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from task import TaskBase

app = FastAPI()
database = DatabaseConnector()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tasks")
def read_root():
    tasks = database.get_tasks()
    return tasks

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

@app.post("/tasks")
def create_user(task:TaskBase):
    new_task = database.add_new_task(task.title,task.description,task.status)
    task_dict = {
        "id": new_task.id,
        "title": new_task.title,
        "description": new_task.description,
        "status": new_task.status,
        "created_at": new_task.created_at,
        "updated_at": new_task.updated_at,
    }
    return task_dict

@app.put("/tasks/{task_id}")
def update_task(task_id: int,task:TaskBase):
    updated_task = database.update_task(task_id,task.title,task.description,task.status)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    return updated_task
