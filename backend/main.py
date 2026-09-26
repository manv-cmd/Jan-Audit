import logging

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from models import Base, User, Project, Finding
from schemas import AuthIn, ProjectIn, FindingIn
from auth import hash_password, verify_password, create_access_token, get_current_user, security
from middleware import request_logging_middleware

DATABASE_URL = "sqlite:///./social_audit.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Social Audit API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(request_logging_middleware)
logging.basicConfig(level=logging.INFO)


def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(db),
):
    return get_current_user(credentials, session)


@app.get("/")
def root():
    return {"message": "Social Audit API is running"}


@app.post("/register")
def register(data: AuthIn, session: Session = Depends(db)):
    if session.query(User).filter(User.username == data.username).first():
        raise HTTPException(400, "Username already exists")

    user = User(username=data.username, hashed_password=hash_password(data.password))
    session.add(user)
    session.commit()
    return {"message": "Registration successful"}


@app.post("/login")
def login(data: AuthIn, session: Session = Depends(db)):
    user = session.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid username or password")

    return {"access_token": create_access_token(user.username), "token_type": "bearer"}


@app.get("/projects")
def get_projects(_: User = Depends(current_user), session: Session = Depends(db)):
    projects = session.query(Project).all()
    if not projects:
        projects = [
            Project(name="Rural Road Development", village="Rampur", budget=1850000, status="Completed"),
            Project(name="Water Supply Scheme", village="Lakshmipur", budget=1220000, status="In Progress"),
            Project(name="Community Health Center", village="Shivpur", budget=2500000, status="Audit Pending"),
        ]
        session.add_all(projects)
        session.commit()
    return session.query(Project).all()


@app.get("/projects/{project_id}")
def get_project(project_id: int, _: User = Depends(current_user), session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project


@app.post("/projects")
def create_project(data: ProjectIn, _: User = Depends(current_user), session: Session = Depends(db)):
    project = Project(**data.model_dump())
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@app.put("/projects/{project_id}")
def update_project(project_id: int, data: ProjectIn, _: User = Depends(current_user), session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    for key, value in data.model_dump().items():
        setattr(project, key, value)
    session.commit()
    session.refresh(project)
    return project


@app.delete("/projects/{project_id}")
def delete_project(project_id: int, _: User = Depends(current_user), session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    session.delete(project)
    session.commit()
    return {"message": "Project deleted"}


@app.get("/findings")
def get_findings(_: User = Depends(current_user), session: Session = Depends(db)):
    return session.query(Finding).order_by(Finding.id.desc()).all()


@app.post("/findings")
def create_finding(data: FindingIn, _: User = Depends(current_user), session: Session = Depends(db)):
    finding = Finding(**data.model_dump())
    session.add(finding)
    session.commit()
    session.refresh(finding)
    return finding
