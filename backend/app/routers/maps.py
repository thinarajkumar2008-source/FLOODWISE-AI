from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json
import os
from app.config import settings
from app.database import get_db
from app.models.features import ObservationPoint
from app.schemas.gis import ObservationPointResponse

router = APIRouter(prefix="/maps", tags=["Maps"])

@router.get("/layers")
def get_map_layers():
    """Returns the primary GeoJSON feature collection for 2D map visualization."""
    if os.path.exists(settings.DEMO_DATA_FILE):
        with open(settings.DEMO_DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "type": "FeatureCollection",
        "metadata": {
            "disclaimer": "DEMONSTRATION DATA — NOT A REAL-TIME FLOOD FORECAST"
        },
        "features": []
    }

@router.get("/features", response_model=List[ObservationPointResponse])
def get_observation_points(db: Session = Depends(get_db)):
    return db.query(ObservationPoint).all()
