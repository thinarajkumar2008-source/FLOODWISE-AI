from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.features import InfrastructureFeature
from app.schemas.gis import InfrastructureFeatureResponse

router = APIRouter(prefix="/infrastructure", tags=["Infrastructure"])

@router.get("", response_model=List[InfrastructureFeatureResponse])
def list_infrastructure(
    category: Optional[str] = None,
    exposure: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(InfrastructureFeature)
    if category and category != "all":
        query = query.filter(InfrastructureFeature.category == category)
    if exposure and exposure != "all":
        query = query.filter(InfrastructureFeature.exposure_status == exposure)
    return query.all()
