from pydantic import BaseModel, Field


class AuthIn(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=6)


class ProjectIn(BaseModel):
    name: str = Field(min_length=2)
    village: str = Field(min_length=2)
    budget: float = Field(ge=0)
    status: str = "Audit Pending"


class FindingIn(BaseModel):
    description: str = Field(min_length=3)
    project_name: str = Field(min_length=2)
