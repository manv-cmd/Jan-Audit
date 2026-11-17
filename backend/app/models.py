"""
SQLAlchemy ORM models — User, Project, Finding.
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, String, Text,
)
from sqlalchemy.orm import relationship
from app.database import Base

import enum


class UserRole(str, enum.Enum):
    Administrator = "Administrator"
    Auditor = "Auditor"
    Official = "Official"


class ProjectStatus(str, enum.Enum):
    Pending = "Pending"
    InProgress = "In Progress"
    Completed = "Completed"


class FindingSeverity(str, enum.Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    hashed_password = Column(String(200), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.Official)
    title = Column(String(120), nullable=True)
    department = Column(String(120), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)

    findings = relationship("Finding", back_populates="auditor_user", foreign_keys="Finding.auditor_id")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(20), primary_key=True)          # e.g. JA-2025-001
    name = Column(String(120), nullable=False)
    description = Column(String(800), nullable=False)
    village = Column(String(80), nullable=False, index=True)
    block = Column(String(80), nullable=False)
    district = Column(String(80), nullable=False)
    budget = Column(Integer, nullable=False)             # INR, integer
    start_date = Column(String(10), nullable=False)      # YYYY-MM-DD
    expected_date = Column(String(10), nullable=False)   # YYYY-MM-DD
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.Pending)
    sample = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now, nullable=False)

    findings = relationship("Finding", back_populates="project", cascade="all, delete-orphan")


class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(20), primary_key=True)           # e.g. AF-2025-001
    project_id = Column(String(20), ForeignKey("projects.id"), nullable=False, index=True)
    description = Column(String(1000), nullable=False)
    # Stored as a display name string for display; auditor_id links to users table
    auditor = Column(String(100), nullable=False)
    auditor_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    date = Column(String(10), nullable=False)            # YYYY-MM-DD
    severity = Column(Enum(FindingSeverity), nullable=False, default=FindingSeverity.Medium)
    sample = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)

    project = relationship("Project", back_populates="findings")
    auditor_user = relationship("User", back_populates="findings", foreign_keys=[auditor_id])
