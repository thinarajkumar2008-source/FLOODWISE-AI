from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database import get_db
from app.models.study import Dataset
from app.schemas.gis import DatasetCreate, DatasetResponse

router = APIRouter(prefix="/datasets", tags=["Datasets"])

@router.get("", response_model=List[DatasetResponse])
def list_datasets(db: Session = Depends(get_db)):
    return db.query(Dataset).all()

@router.post("", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
def import_dataset(ds_in: DatasetCreate, db: Session = Depends(get_db)):
    # Validate extension safety
    allowed_exts = [".json", ".geojson", ".csv", ".tif", ".tiff", ".hdf", ".h5"]
    if not any(ds_in.name.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported extensions: {', '.join(allowed_exts)}"
        )

    ds = Dataset(
        id=f"DATA-{uuid.uuid4().hex[:6].upper()}",
        validation_status="Validated",
        **ds_in.model_dump()
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return ds
