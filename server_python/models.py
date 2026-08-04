from sqlalchemy import Column, String, Integer, DateTime, JSON, Text
from datetime import datetime
from database import Base

class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    vertical = Column(String, default="startups")
    tags = Column(JSON, default=list)
    status = Column(String, default="RECEIVED")
    score = Column(Integer, default=85)
    decision = Column(Integer, default=1)
    brief = Column(JSON, default=dict)
    metrics = Column(JSON, default=list)
    completed_modules = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class DomainModel(Base):
    __tablename__ = "custom_domains"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, default="Building2")
    created_at = Column(DateTime, default=datetime.utcnow)
