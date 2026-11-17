"""
Projects router — full CRUD.

Role rules (mirror the frontend):
  GET  /projects          → any authenticated user
  GET  /projects/{id}     → any authenticated user
  POST /projects          → Administrator only
  PUT  /projects/{id}     → Administrator only
  DELETE /projects/{id}   → Administrator only  (blocked if findings exist)
"""
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.id_gen import next_project_id
from app.models import Finding, Project, User
from app.schemas import ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])


def _to_out(p: Project) -> ProjectOut:
    return ProjectOut.from_orm_model(p)


@router.get("", response_model=List[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Return all projects ordered by most recently updated."""
    projects = db.query(Project).order_by(Project.updated_at.desc()).all()
    return [_to_out(p) for p in projects]


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found.")
    return _to_out(p)


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    now = datetime.now(timezone.utc)
    project = Project(
        id=next_project_id(db),
        name=body.name,
        description=body.description,
        village=body.village,
        block=body.block,
        district=body.district,
        budget=body.budget,
        start_date=body.startDate,
        expected_date=body.expectedDate,
        status=body.status,
        sample=False,
        created_at=now,
        updated_at=now,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return _to_out(project)


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    body: ProjectUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found.")

    update_data = body.model_dump(exclude_unset=True, by_alias=True)
    if "startDate" in update_data:
        p.start_date = update_data.pop("startDate")
    if "expectedDate" in update_data:
        p.expected_date = update_data.pop("expectedDate")
    for field, value in update_data.items():
        setattr(p, field, value)

    p.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(p)
    return _to_out(p)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found.")

    has_findings = db.query(Finding).filter(Finding.project_id == project_id).first()
    if has_findings:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This project has audit findings. Resolve or remove those findings before deleting the project.",
        )

    db.delete(p)
    db.commit()
