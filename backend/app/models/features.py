from sqlalchemy import Column, String, Float, Integer, Text, ForeignKey, JSON
from app.database import Base

class ObservationPoint(Base):
    __tablename__ = "observation_points"

    id = Column(String, primary_key=True, index=True)
    scenario_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    chainage_km = Column(Float, default=0.0)
    peak_water_depth_m = Column(Float, default=0.0)
    peak_velocity_mps = Column(Float, default=0.0)
    flood_arrival_hrs = Column(Float, default=0.0)
    recession_time_hrs = Column(Float, default=24.0)
    data_source = Column(String, default="HEC-RAS 2D Simulated Cross Section")
    validation_status = Column(String, default="Demo Scenario - Synthetically Modelled")

class InfrastructureFeature(Base):
    __tablename__ = "infrastructure_features"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # settlement, bridge, hospital, school, power_grid
    study_area = Column(String, default="Tawa River Basin")
    scenario_code = Column(String, default="SCEN-A")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    exposure_status = Column(String, default="Exposed")  # Exposed, High Risk, Safe
    water_depth_m = Column(Float, default=0.0)
    arrival_time_hrs = Column(Float, default=0.0)
    distance_from_river_m = Column(Float, default=0.0)
    population_at_risk = Column(Integer, default=0)
    data_source = Column(String, default="Survey Vector Data")
    validation_status = Column(String, default="Demo Modelled")

class EvacuationRoute(Base):
    __tablename__ = "evacuation_routes"

    id = Column(String, primary_key=True, index=True)
    origin_settlement = Column(String, nullable=False)
    destination_shelter = Column(String, nullable=False)
    distance_km = Column(Float, default=0.0)
    estimated_time_mins = Column(Integer, default=0)
    status = Column(String, default="Proposed — Requires Official Validation")
    flood_crossing_count = Column(Integer, default=0)
    safe_departure_window_hrs = Column(Float, default=0.5)
    path_coordinates = Column(JSON, default=list)
    planning_notes = Column(Text, default="")
