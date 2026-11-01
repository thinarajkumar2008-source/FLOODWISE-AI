from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from app.database import get_db
from app.models.study import Scenario
from app.schemas.study import ScenarioCreate, ScenarioResponse

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])

@router.get("", response_model=List[ScenarioResponse])
def list_scenarios(study_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Scenario)
    if study_id:
        query = query.filter(Scenario.study_id == study_id)
    return query.all()

@router.post("", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(scen_in: ScenarioCreate, db: Session = Depends(get_db)):
    scen = Scenario(
        id=f"SCEN-{uuid.uuid4().hex[:6].upper()}",
        **scen_in.model_dump()
    )
    db.add(scen)
    db.commit()
    db.refresh(scen)
    return scen

@router.get("/compare")
def compare_scenarios(scenario_ids: Optional[str] = None, db: Session = Depends(get_db)):
    scenarios = db.query(Scenario).all()
    if scenario_ids:
        ids = [i.strip() for i in scenario_ids.split(",") if i.strip()]
        scenarios = [s for s in scenarios if s.id in ids]

    comparison_results = []
    for s in scenarios:
        comparison_results.append({
            "id": s.id,
            "name": s.name,
            "code": s.code,
            "breach_type": s.breach_type,
            "reservoir_elevation_m": s.reservoir_elevation_m,
            "storage_volume_mcm": s.storage_volume_mcm,
            "breach_width_m": s.breach_width_m,
            "breach_formation_time_hrs": s.breach_formation_time_hrs,
            "initial_discharge_cumec": s.initial_discharge_cumec,
            "max_depth_m": 8.4 if s.breach_type == "Overtopping" else 5.7,
            "max_velocity_mps": 4.8 if s.breach_type == "Overtopping" else 3.2,
            "flooded_area_sqkm": 68.4 if s.breach_type == "Overtopping" else 42.1,
            "validation_status": "Demo Benchmark"
        })

    return {
        "compared_count": len(comparison_results),
        "scenarios": comparison_results,
        "disclaimer": "DEMONSTRATION DATA — NOT A VERIFIED REAL-TIME FLOOD FORECAST"
    }
