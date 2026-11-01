from fastapi import APIRouter
from app.config import settings
from app.simulation.engine_adapter import hydrodynamic_adapter

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "sqlite_connected",
        "hydrodynamic_engine": {
            "hec_ras_detected": hydrodynamic_adapter.is_engine_installed(),
            "mode": "Demonstration Synthetic Physics Adapter" if not hydrodynamic_adapter.is_engine_installed() else "Physical HEC-RAS 2D Executable",
            "crs_supported": ["EPSG:4326", "EPSG:32643", "EPSG:32644"]
        }
    }
