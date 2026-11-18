"""
JAN Audit — FastAPI backend entry point.

Start with:
    uvicorn main:app --reload --host 127.0.0.1 --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import Base, engine
from app.routers import auth, findings, projects
from app.seed import seed

# ── Create tables & seed on first run ────────────────────────────────────────
Base.metadata.create_all(bind=engine)
seed()

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="JAN Audit API",
    description="Backend for the Jan Audit social audit portal.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# In development the frontend is served as a local file (file://) or a
# different port, so we allow all origins.  Lock this down in production.
origins = (
    ["*"]
    if settings.ALLOWED_ORIGINS.strip() == "*"
    else [o.strip() for o in settings.ALLOWED_ORIGINS.split(",")]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(findings.router)

import os
from fastapi.staticfiles import StaticFiles

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(frontend_dir):
    app.mount("/portal", StaticFiles(directory=frontend_dir, html=True), name="portal")


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "app": "JAN Audit API", "version": "1.0.0"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
