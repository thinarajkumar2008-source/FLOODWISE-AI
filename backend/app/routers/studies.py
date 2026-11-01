from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database import get_db
from app.models.study import Study
from app.schemas.study import StudyCreate, StudyResponse

router = APIRouter(prefix="/studies", tags=["Studies"])

@router.get("", response_model=List[StudyResponse])
def list_studies(db: Session = Depends(get_db)):
    return db.query(Study).all()

@router.post("", response_model=StudyResponse, status_code=status.HTTP_201_CREATED)
def create_study(study_in: StudyCreate, db: Session = Depends(get_db)):
    study = Study(
        id=f"STUDY-{uuid.uuid4().hex[:6].upper()}",
        **study_in.model_dump()
    )
    db.add(study)
    db.commit()
    db.refresh(study)
    return study

@router.get("/{study_id}", response_model=StudyResponse)
def get_study(study_id: str, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study

@router.delete("/{study_id}")
def delete_study(study_id: str, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    db.delete(study)
    db.commit()
    return {"message": f"Study {study_id} deleted successfully"}
