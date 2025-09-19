from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid
import os

# Use environment variable for database path in production, fallback to local path
DATABASE_PATH = os.getenv("DATABASE_PATH", "./calculator.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    result = Column(Float, nullable=False)
    operation = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()