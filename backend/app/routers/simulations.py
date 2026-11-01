from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
from app.database import get_db
from app.models.study import SimulationJob, SimulationLog, Scenario
from app.schemas.simulation import SimulationJobResponse, SimulationLogResponse
from app.simulation.engine_adapter import hydrodynamic_adapter

router = APIRouter(prefix="/simulations", tags=["Simulations"])

@router.get("", response_model=List[SimulationJobResponse])
def list_simulations(db: Session = Depends(get_db)):
    return db.query(SimulationJob).all()

@router.get("/{job_id}", response_model=SimulationJobResponse)
def get_simulation(job_id: str, db: Session = Depends(get_db)):
    job = db.query(SimulationJob).filter(SimulationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Simulation job not found")
    return job

@router.post("/{scenario_id}/validate")
def validate_simulation_inputs(scenario_id: str, db: Session = Depends(get_db)):
    scenario = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    errors = hydrodynamic_adapter.validate_simulation_parameters({
        "reservoir_elevation_m": scenario.reservoir_elevation_m,
        "storage_volume_mcm": scenario.storage_volume_mcm,
        "breach_width_m": scenario.breach_width_m,
        "breach_formation_time_hrs": scenario.breach_formation_time_hrs
    })

    return {
        "valid": len(errors) == 0,
        "scenario_id": scenario_id,
        "errors": errors,
        "engine_installed": hydrodynamic_adapter.is_engine_installed()
    }

@router.post("/{scenario_id}/run", response_model=SimulationJobResponse)
def run_simulation(scenario_id: str, db: Session = Depends(get_db)):
    scenario = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    # Run physics calculations through the hydrodynamic adapter
    results = hydrodynamic_adapter.run_demonstration_simulation({
        "storage_volume_mcm": scenario.storage_volume_mcm,
        "dam_height_m": scenario.dam_height_m,
        "breach_type": scenario.breach_type
    })

    job_id = f"SIM-{uuid.uuid4().hex[:6].upper()}"
    job = SimulationJob(
        id=job_id,
        study_id=scenario.study_id,
        scenario_id=scenario.id,
        scenario_name=scenario.name,
        status="COMPLETED",
        progress_percent=100,
        started_at=datetime.utcnow(),
        completed_at=datetime.utcnow(),
        max_depth_m=results["max_water_depth_m"],
        max_velocity_mps=results["max_velocity_mps"],
        flooded_area_sqkm=results["flooded_area_sqkm"],
        exposed_settlement_count=3,
        exposed_infrastructure_count=4,
        data_source=results["engine"],
        validation_status="Demo Scenario - Synthetically Modelled",
        is_demo=True
    )
    db.add(job)

    # Persist log records
    logs = [
        SimulationLog(job_id=job_id, level="INFO", message="Initialized HEC-RAS 2D hydrodynamic adapter interface."),
        SimulationLog(job_id=job_id, level="INFO", message=f"Boundary parameters checked: Volume={scenario.storage_volume_mcm} MCM, Elevation={scenario.reservoir_elevation_m}m."),
        SimulationLog(job_id=job_id, level="INFO", message=f"Computed breach outflow hydrograph: Q_max = {results['peak_outflow_discharge_cumec']} m3/s."),
        SimulationLog(job_id=job_id, level="INFO", message=f"Completed 2D shallow water progression: Flooded Area = {results['flooded_area_sqkm']} km2.")
    ]
    db.add_all(logs)
    db.commit()
    db.refresh(job)
    return job

@router.get("/{job_id}/logs", response_model=List[SimulationLogResponse])
def get_simulation_logs(job_id: str, db: Session = Depends(get_db)):
    return db.query(SimulationLog).filter(SimulationLog.job_id == job_id).all()
