from enum import Enum
from pydantic import BaseModel

class Status(str, Enum):
    pending = 'Pending'
    in_progress = 'In progress'
    completed = 'Completed'

class TaskBase(BaseModel):
    title: str
    description: str
    status: Status = Status.pending

class UserBase(BaseModel):
    username: str
    password: str

