from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.config import settings
from app.gis.spatial_analyzer import spatial_analyzer
import os

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])

@router.get("/exposure")
def get_spatial_exposure(
    scenario_id: str = "SCEN-001",
    depth_threshold: float = Query(0.0, ge=0.0)
):
    """
    Performs spatial vector intersection between inundation polygons
    and geographic infrastructure / settlements.
    """
    if not os.path.exists(settings.DEMO_DATA_FILE):
        return {
            "error": "Demo GeoJSON layer file not found",
            "scenario_id": scenario_id,
            "exposed_features": []
        }

    features = spatial_analyzer.load_geojson_features(str(settings.DEMO_DATA_FILE))
    analysis = spatial_analyzer.analyze_exposure(features, scenario_id, depth_threshold)
    return analysis
