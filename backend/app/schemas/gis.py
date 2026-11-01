from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class ObservationPointResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    scenario_id: str
    name: str
    latitude: float
    longitude: float
    chainage_km: float
    peak_water_depth_m: float
    peak_velocity_mps: float
    flood_arrival_hrs: float
    recession_time_hrs: float
    data_source: str
    validation_status: str

class InfrastructureFeatureResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    category: str
    study_area: str
    scenario_code: str
    latitude: float
    longitude: float
    exposure_status: str
    water_depth_m: float
    arrival_time_hrs: float
    distance_from_river_m: float
    population_at_risk: int
    data_source: str
    validation_status: str

class EvacuationRouteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    origin_settlement: str
    destination_shelter: str
    distance_km: float
    estimated_time_mins: int
    status: str
    flood_crossing_count: int
    safe_departure_window_hrs: float
    path_coordinates: List[Any]
    planning_notes: str

class DatasetCreate(BaseModel):
    name: str
    file_type: str
    source: Optional[str] = ""
    coordinate_system: Optional[str] = "EPSG:4326 - WGS 84"
    spatial_extent: Optional[str] = ""
    feature_count: Optional[int] = 0
    file_size_kb: Optional[int] = 0
    description: Optional[str] = ""

class DatasetResponse(DatasetCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    upload_date: datetime
    validation_status: str
