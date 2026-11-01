from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class StudyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    river_name: str = Field(..., min_length=2, max_length=100)
    study_area: str = Field(..., min_length=2, max_length=100)
    dam_name: str = Field(..., min_length=2, max_length=100)
    dam_lat: float = Field(..., ge=-90.0, le=90.0)
    dam_lng: float = Field(..., ge=-180.0, le=180.0)
    downstream_boundary_km: float = Field(default=45.0, gt=0)
    description: Optional[str] = ""
    data_source: Optional[str] = "SIH Benchmark"
    status: Optional[str] = "Active"

class StudyCreate(StudyBase):
    pass

class StudyResponse(StudyBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime

class ScenarioBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = ""
    reservoir_elevation_m: float = Field(..., gt=0)
    storage_volume_mcm: float = Field(..., gt=0)
    dam_height_m: float = Field(default=50.0, gt=0)
    dam_crest_length_m: float = Field(default=1000.0, gt=0)
    breach_type: str = Field(default="Overtopping")
    breach_width_m: float = Field(default=100.0, gt=0)
    breach_side_slope_z: float = Field(default=1.0, ge=0)
    breach_formation_time_hrs: float = Field(default=1.5, gt=0, le=48.0)
    initial_discharge_cumec: float = Field(default=10000.0, ge=0)
    manning_n_river: float = Field(default=0.035, gt=0)
    manning_n_floodplain: float = Field(default=0.065, gt=0)
    computational_domain_km2: float = Field(default=100.0, gt=0)
    output_interval_mins: int = Field(default=15, gt=0)
    modelling_engine: Optional[str] = "HEC-RAS 2D Adapter"
    engine_version: Optional[str] = "6.4.1"
    is_reference: Optional[bool] = False

class ScenarioCreate(ScenarioBase):
    study_id: str

class ScenarioResponse(ScenarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    study_id: str
    created_at: datetime
