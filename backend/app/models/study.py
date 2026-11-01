from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Study(Base):
    __tablename__ = "studies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    river_name = Column(String, nullable=False)
    study_area = Column(String, nullable=False)
    dam_name = Column(String, nullable=False)
    dam_lat = Column(Float, nullable=False)
    dam_lng = Column(Float, nullable=False)
    downstream_boundary_km = Column(Float, default=45.0)
    description = Column(Text, default="")
    data_source = Column(String, default="SIH Benchmark")
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    scenarios = relationship("Scenario", back_populates="study", cascade="all, delete-orphan")
    simulations = relationship("SimulationJob", back_populates="study", cascade="all, delete-orphan")

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True, index=True)
    study_id = Column(String, ForeignKey("studies.id"), nullable=False)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    description = Column(Text, default="")
    reservoir_elevation_m = Column(Float, nullable=False)
    storage_volume_mcm = Column(Float, nullable=False)
    dam_height_m = Column(Float, default=50.0)
    dam_crest_length_m = Column(Float, default=1000.0)
    breach_type = Column(String, default="Overtopping")
    breach_width_m = Column(Float, default=100.0)
    breach_side_slope_z = Column(Float, default=1.0)
    breach_formation_time_hrs = Column(Float, default=1.5)
    initial_discharge_cumec = Column(Float, default=10000.0)
    manning_n_river = Column(Float, default=0.035)
    manning_n_floodplain = Column(Float, default=0.065)
    computational_domain_km2 = Column(Float, default=100.0)
    output_interval_mins = Column(Integer, default=15)
    modelling_engine = Column(String, default="HEC-RAS 2D Adapter")
    engine_version = Column(String, default="6.4.1")
    is_reference = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    study = relationship("Study", back_populates="scenarios")
    simulations = relationship("SimulationJob", back_populates="scenario")

class SimulationJob(Base):
    __tablename__ = "simulation_jobs"

    id = Column(String, primary_key=True, index=True)
    study_id = Column(String, ForeignKey("studies.id"), nullable=False)
    scenario_id = Column(String, ForeignKey("scenarios.id"), nullable=False)
    scenario_name = Column(String, nullable=False)
    status = Column(String, default="DRAFT")  # DRAFT, VALIDATING, QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
    progress_percent = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    max_depth_m = Column(Float, default=0.0)
    max_velocity_mps = Column(Float, default=0.0)
    flooded_area_sqkm = Column(Float, default=0.0)
    exposed_settlement_count = Column(Integer, default=0)
    exposed_infrastructure_count = Column(Integer, default=0)
    data_source = Column(String, default="Synthetically Modelled Hydrodynamic Benchmark")
    validation_status = Column(String, default="Demo Scenario - Synthetically Modelled")
    is_demo = Column(Boolean, default=True)

    study = relationship("Study", back_populates="simulations")
    scenario = relationship("Scenario", back_populates="simulations")
    logs = relationship("SimulationLog", back_populates="job", cascade="all, delete-orphan")

class SimulationLog(Base):
    __tablename__ = "simulation_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(String, ForeignKey("simulation_jobs.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    level = Column(String, default="INFO")
    message = Column(Text, nullable=False)

    job = relationship("SimulationJob", back_populates="logs")

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    source = Column(String, default="")
    coordinate_system = Column(String, default="EPSG:4326 - WGS 84")
    spatial_extent = Column(String, default="")
    feature_count = Column(Integer, default=0)
    file_size_kb = Column(Integer, default=0)
    upload_date = Column(DateTime, default=datetime.utcnow)
    validation_status = Column(String, default="Validated")
    description = Column(Text, default="")
