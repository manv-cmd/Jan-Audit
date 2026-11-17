"""
Pydantic schemas for request validation and response serialisation.
Field names deliberately use camelCase to match the frontend's JSON convention.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

from app.models import FindingSeverity, ProjectStatus, UserRole


# ─────────────────────────── Auth ────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str
    remember: bool = False


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    title: Optional[str] = None
    department: Optional[str] = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


# ─────────────────────────── Projects ────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=120)
    description: str = Field(..., max_length=800)
    village: str = Field(..., max_length=80)
    block: str = Field(..., max_length=80)
    district: str = Field(..., max_length=80)
    budget: int = Field(..., gt=0)
    startDate: str = Field(..., alias="startDate", pattern=r"^\d{4}-\d{2}-\d{2}$")
    expectedDate: str = Field(..., alias="expectedDate", pattern=r"^\d{4}-\d{2}-\d{2}$")
    status: ProjectStatus = ProjectStatus.Pending

    model_config = {"populate_by_name": True}

    @field_validator("expectedDate")
    @classmethod
    def expected_after_start(cls, v: str, info) -> str:
        start = info.data.get("startDate")
        if start and v < start:
            raise ValueError("expectedDate must be on or after startDate")
        return v


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=120)
    description: Optional[str] = Field(None, max_length=800)
    village: Optional[str] = Field(None, max_length=80)
    block: Optional[str] = Field(None, max_length=80)
    district: Optional[str] = Field(None, max_length=80)
    budget: Optional[int] = Field(None, gt=0)
    startDate: Optional[str] = Field(None, alias="startDate", pattern=r"^\d{4}-\d{2}-\d{2}$")
    expectedDate: Optional[str] = Field(None, alias="expectedDate", pattern=r"^\d{4}-\d{2}-\d{2}$")
    status: Optional[ProjectStatus] = None

    model_config = {"populate_by_name": True}


class ProjectOut(BaseModel):
    id: str
    name: str
    description: str
    village: str
    block: str
    district: str
    budget: int
    startDate: str
    expectedDate: str
    status: ProjectStatus
    sample: bool
    createdAt: datetime
    updatedAt: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, p) -> "ProjectOut":
        return cls(
            id=p.id,
            name=p.name,
            description=p.description,
            village=p.village,
            block=p.block,
            district=p.district,
            budget=p.budget,
            startDate=p.start_date,
            expectedDate=p.expected_date,
            status=p.status,
            sample=p.sample,
            createdAt=p.created_at,
            updatedAt=p.updated_at,
        )


# ─────────────────────────── Findings ────────────────────────────────────────

class FindingCreate(BaseModel):
    projectId: str = Field(..., alias="projectId")
    description: str = Field(..., max_length=1000)
    auditor: str = Field(..., max_length=100)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    severity: FindingSeverity = FindingSeverity.Medium

    model_config = {"populate_by_name": True}


class FindingOut(BaseModel):
    id: str
    projectId: str
    description: str
    auditor: str
    date: str
    severity: FindingSeverity
    sample: bool
    createdAt: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, f) -> "FindingOut":
        return cls(
            id=f.id,
            projectId=f.project_id,
            description=f.description,
            auditor=f.auditor,
            date=f.date,
            severity=f.severity,
            sample=f.sample,
            createdAt=f.created_at,
        )
