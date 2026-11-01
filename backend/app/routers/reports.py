from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.study import Study, Scenario
from app.reports.generator import report_generator

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("")
def list_reports(db: Session = Depends(get_db)):
    studies = db.query(Study).all()
    return {
        "generated_reports_count": len(studies),
        "available_formats": ["CSV", "JSON", "PRINT_PDF"],
        "disclaimer": "DEMONSTRATION DATA — NOT A REAL-TIME FLOOD FORECAST"
    }

@router.get("/csv")
def download_csv_report(study_id: str = "STUDY-DEMO-001", db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first() or {
        "id": "STUDY-DEMO-001",
        "name": "Tawa River Basin Dam-Break Study",
        "river_name": "Tawa River",
        "dam_name": "Tawa Masonry Dam"
    }
    scenario = db.query(Scenario).first() or {
        "reservoir_elevation_m": 358.5,
        "storage_volume_mcm": 2312,
        "breach_type": "Overtopping"
    }
    
    csv_text = report_generator.generate_csv_summary(
        study if isinstance(study, dict) else study.__dict__,
        scenario if isinstance(scenario, dict) else scenario.__dict__,
        {"peak_outflow_discharge_cumec": 14200, "flooded_area_sqkm": 68.4, "max_water_depth_m": 8.4, "max_velocity_mps": 4.8}
    )

    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=floodwise_{study_id}_report.csv"}
    )
