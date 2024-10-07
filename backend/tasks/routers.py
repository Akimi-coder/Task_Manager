from fastapi import APIRouter,FastAPI, HTTPException,Depends
from tasks.controller import *
from baseModels.models import TaskBase
from db.database import SessionMaker

router = APIRouter()

def get_db():
    db = SessionMaker()
    try:
        yield db
    finally:
        db.close()

@router.get("/tasks")
def read_root(db: Session = Depends(get_db)):
    tasks = get_tasks(db)
    return tasks

@router.get("/tasks/{task_id}")
def get_task(task_id: int,db: Session = Depends(get_db)):
    task = get_task_by_id(db,task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/tasks/{task_id}", response_model=dict)
def delete_task_api(task_id: int,db: Session = Depends(get_db)):
    db_task = delete_task(db,task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"detail": "Task deleted"}

@router.post("/tasks")
def create_task_api(task:TaskBase,db: Session = Depends(get_db)):
    new_task = create_task(db,task)
    task_dict = {
        "id": new_task.id,
        "title": new_task.title,
        "description": new_task.description,
        "status": new_task.status,
        "created_at": new_task.created_at,
        "updated_at": new_task.updated_at,
    }
    return task_dict

@router.put("/tasks/{task_id}")
def update_task_api(task_id: int,task:TaskBase,db: Session = Depends(get_db)):
    updated_task = update_task(db,task_id,task)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    return updated_task

