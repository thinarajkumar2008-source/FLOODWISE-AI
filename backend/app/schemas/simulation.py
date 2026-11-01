from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class SimulationJobCreate(BaseModel):
    scenario_id: str
    study_id: str

class SimulationLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    job_id: str
    timestamp: datetime
    level: str
    message: str

class SimulationJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    study_id: str
    scenario_id: str
    scenario_name: str
    status: str
    progress_percent: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    max_depth_m: float
    max_velocity_mps: float
    flooded_area_sqkm: float
    exposed_settlement_count: int
    exposed_infrastructure_count: int
    data_source: str
    validation_status: str
    is_demo: bool
