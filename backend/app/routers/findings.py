"""
Findings router.

Role rules (mirror the frontend):
  GET  /findings          → any authenticated user
  GET  /findings/{id}     → any authenticated user
  POST /findings          → Auditor or Administrator
  DELETE /findings/{id}   → Auditor or Administrator
    (DELETE is localStorage-only in the current frontend build;
     the backend supports it so the UI can be updated later)
"""
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_auditor_or_admin
from app.id_gen import next_finding_id
from app.models import Finding, Project, User
from app.schemas import FindingCreate, FindingOut

router = APIRouter(prefix="/findings", tags=["findings"])


def _to_out(f: Finding) -> FindingOut:
    return FindingOut.from_orm_model(f)


@router.get("", response_model=List[FindingOut])
def list_findings(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Return all findings ordered by most recently created."""
    findings = db.query(Finding).order_by(Finding.created_at.desc()).all()
    return [_to_out(f) for f in findings]


@router.get("/{finding_id}", response_model=FindingOut)
def get_finding(
    finding_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    f = db.get(Finding, finding_id)
    if not f:
        raise HTTPException(status_code=404, detail="Finding not found.")
    return _to_out(f)


@router.post("", response_model=FindingOut, status_code=status.HTTP_201_CREATED)
def create_finding(
    body: FindingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auditor_or_admin),
):
    project = db.get(Project, body.projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Select an existing project for this finding.")

    finding = Finding(
        id=next_finding_id(db),
        project_id=body.projectId,
        description=body.description,
        auditor=body.auditor,
        auditor_id=current_user.id,
        date=body.date,
        severity=body.severity,
        sample=False,
        created_at=datetime.now(timezone.utc),
    )
    db.add(finding)
    db.commit()
    db.refresh(finding)
    return _to_out(finding)


@router.delete("/{finding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_finding(
    finding_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_auditor_or_admin),
):
    f = db.get(Finding, finding_id)
    if not f:
        raise HTTPException(status_code=404, detail="Finding not found.")
    db.delete(f)
    db.commit()
