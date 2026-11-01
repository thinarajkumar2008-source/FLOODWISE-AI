from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
from app.database import get_db
from app.models.alerts import Alert
from app.schemas.alerts import AlertCreate, AlertResponse
from app.notifications.dispatcher import notification_dispatcher

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.created_at.desc()).all()

@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    alert = Alert(
        id=f"ALERT-{uuid.uuid4().hex[:6].upper()}",
        **alert_in.model_dump()
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.post("/{alert_id}/review", response_model=AlertResponse)
def submit_for_review(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "REVIEW"
    db.commit()
    db.refresh(alert)
    return alert

@router.post("/{alert_id}/approved", response_model=AlertResponse)
def approve_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "APPROVED"
    alert.approved_at = datetime.utcnow()
    alert.approved_by = "SDMA Chief Hydro-Engineer (In-App Auth)"
    db.commit()
    db.refresh(alert)
    return alert

@router.post("/{alert_id}/sent", response_model=AlertResponse)
def send_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Dispatch through notification provider
    res = notification_dispatcher.dispatch_alert(
        alert.id,
        alert.title,
        alert.message,
        alert.affected_villages or []
    )
    alert.status = "SENT"
    alert.delivery_status = "Simulated In-App Broadcast"
    db.commit()
    db.refresh(alert)
    return alert
