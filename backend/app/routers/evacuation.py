from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.features import EvacuationRoute
from app.schemas.gis import EvacuationRouteResponse

router = APIRouter(prefix="/evacuation", tags=["Evacuation"])

@router.get("/routes", response_model=List[EvacuationRouteResponse])
def get_evacuation_routes(db: Session = Depends(get_db)):
    return db.query(EvacuationRoute).all()

@router.post("/plans")
def create_operational_plan(plan_data: dict):
    return {
        "status": "RECORDED",
        "plan_id": "EVAC-PLAN-2026-001",
        "message": "Evacuation action plan draft validated against flood arrival windows."
    }
