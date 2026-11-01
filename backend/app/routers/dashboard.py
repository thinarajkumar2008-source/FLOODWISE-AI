from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.study import Study, SimulationJob
from app.models.features import InfrastructureFeature

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_studies = db.query(Study).count()
    completed_sims = db.query(SimulationJob).filter(SimulationJob.status == "COMPLETED").count()
    running_jobs = db.query(SimulationJob).filter(SimulationJob.status == "RUNNING").count()
    pending_jobs = db.query(SimulationJob).filter(SimulationJob.status.in_(["QUEUED", "VALIDATING"])).count()
    exposed_infra = db.query(InfrastructureFeature).filter(InfrastructureFeature.exposure_status != "Safe").count()

    return {
        "total_studies": max(total_studies, 2),
        "completed_simulations": max(completed_sims, 2),
        "running_jobs": running_jobs,
        "pending_jobs": pending_jobs,
        "exposed_infrastructure": max(exposed_infra, 4),
        "exposed_population": 10410,
        "peak_depth_recorded": 8.4,
        "total_inundated_sqkm": 68.4,
        "disclaimer": "DEMONSTRATION DATA — NOT A REAL-TIME FLOOD FORECAST"
    }
