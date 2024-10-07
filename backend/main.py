from sqlalchemy.orm import Session

from fastapi import FastAPI, HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware

from auth.routers import router as user_routers
from tasks.routers import router as tasks_routers
from db.database import SessionMaker, engine

app = FastAPI()
app.include_router(user_routers, prefix="/api", tags=["users"])
app.include_router(tasks_routers, prefix="/api", tags=["tasks"])


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

