"""
Helper to generate sequential IDs matching the frontend convention:
  Projects  → JA-{year}-{seq:03d}
  Findings  → AF-{year}-{seq:03d}
"""
import re
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models import Finding, Project


def _next_seq(existing_ids: list[str]) -> int:
    """Return max trailing sequence number + 1 (minimum 1)."""
    nums = [int(m.group(1)) for s in existing_ids if (m := re.search(r"(\d+)$", s))]
    return (max(nums) + 1) if nums else 1


def next_project_id(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    ids = [row[0] for row in db.query(Project.id).all()]
    seq = _next_seq(ids)
    return f"JA-{year}-{seq:03d}"


def next_finding_id(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    ids = [row[0] for row in db.query(Finding.id).all()]
    seq = _next_seq(ids)
    return f"AF-{year}-{seq:03d}"
