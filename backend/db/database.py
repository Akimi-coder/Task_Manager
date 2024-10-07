from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine('mysql+pymysql://root:root@mysql:3306/db')
SessionMaker = sessionmaker(bind=engine)
session = SessionMaker()
Base = declarative_base()