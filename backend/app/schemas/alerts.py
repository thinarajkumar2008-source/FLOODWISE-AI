from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class AlertCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    severity: str = Field(default="WARNING")
    study_area: Optional[str] = "Tawa River Basin"
    scenario_name: Optional[str] = "Scenario A"
    message: str = Field(..., min_length=10)
    affected_villages: Optional[List[str]] = []
    status: Optional[str] = "DRAFT"
    delivery_status: Optional[str] = "Pending Dispatch"

class AlertResponse(AlertCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
