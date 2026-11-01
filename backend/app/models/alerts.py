from sqlalchemy import Column, String, Text, DateTime, JSON
from datetime import datetime
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    severity = Column(String, default="WARNING")  # CRITICAL, WARNING, ADVISORY, INFO
    study_area = Column(String, default="Tawa River Basin")
    scenario_name = Column(String, default="Scenario A")
    message = Column(Text, nullable=False)
    affected_villages = Column(JSON, default=list)
    status = Column(String, default="DRAFT")  # DRAFT, REVIEW, APPROVED, SENT, REJECTED, CANCELLED
    delivery_status = Column(String, default="Pending Dispatch")
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(String, nullable=True)
