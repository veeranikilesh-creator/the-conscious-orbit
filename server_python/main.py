import os
import time
import random
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import Base, engine, get_db, DB_TYPE
from models import ReportModel, DomainModel

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("conscious_orbit_api")

app = FastAPI(
    title="The Conscious Orbit - Python FastAPI Backend",
    description="Python FastAPI REST API Service with PostgreSQL Database Integration",
    version="2.5.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ReportCreateSchema(BaseModel):
    name: str
    vertical: Optional[str] = "startups"
    tags: Optional[List[str]] = []
    tracks: Optional[List[str]] = []
    customModules: Optional[List[str]] = []
    clusters: Optional[Dict[str, Any]] = {}
    client: Optional[Dict[str, Any]] = {}

class CustomDomainSchema(BaseModel):
    name: str
    description: Optional[str] = ""

# Seed initial default reports if database table is empty
def seed_initial_reports(db: Session):
    if db.query(ReportModel).count() == 0:
        seed_data = [
            {
                "id": "r1", "name": "Aether Dynamics", "vertical": "startups",
                "tags": ["Aerospace", "DeepTech"], "status": "PUBLISHED", "score": 92,
                "brief": {"company": "Aether Dynamics", "industry": "Aerospace", "stage": "Series A", "ask": "$2.5M"}
            },
            {
                "id": "r2", "name": "Lumina Health AI", "vertical": "startups",
                "tags": ["MedTech", "AI"], "status": "PROCESSED", "score": 87,
                "brief": {"company": "Lumina Health AI", "industry": "HealthTech", "stage": "Seed", "ask": "$1.5M"}
            },
            {
                "id": "r3", "name": "Pulse Energy Grid", "vertical": "msmes",
                "tags": ["CleanTech", "Grid"], "status": "PENDING", "score": 79,
                "brief": {"company": "Pulse Energy Grid", "industry": "CleanEnergy", "stage": "Growth", "ask": "$800K"}
            },
            {
                "id": "r4", "name": "OmniFreight Robotics", "vertical": "industries",
                "tags": ["Logistics", "Robotics"], "status": "RECEIVED", "score": 84,
                "brief": {"company": "OmniFreight Robotics", "industry": "Logistics & Supply Chain", "stage": "Seed", "ask": "$1.2M"}
            }
        ]
        for r in seed_data:
            db.add(ReportModel(
                id=r["id"],
                name=r["name"],
                vertical=r["vertical"],
                tags=r["tags"],
                status=r["status"],
                score=r["score"],
                brief=r["brief"],
                metrics=[
                    {"k": "Market Demand", "v": 88},
                    {"k": "Tech Feasibility", "v": 82},
                    {"k": "Unit Economics", "v": 85}
                ]
            ))
        db.commit()

# Root Route
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "The Conscious Orbit - Python FastAPI Backend",
        "db_type": DB_TYPE,
        "docs_url": "/docs",
        "api_health": "/api/health"
    }

# Health Endpoint
@app.get("/api/health")
def api_health():
    return {
        "status": "ok",
        "service": "Python FastAPI + PostgreSQL Backend",
        "db": DB_TYPE,
        "timestamp": time.time()
    }

# Reports Endpoints
@app.get("/api/reports")
def list_reports(limit: int = Query(100), db: Session = Depends(get_db)):
    seed_initial_reports(db)
    reports = db.query(ReportModel).order_by(ReportModel.created_at.desc()).limit(limit).all()
    return {"reports": [
        {
            "id": r.id,
            "name": r.name,
            "vertical": r.vertical,
            "tags": r.tags or [],
            "status": r.status,
            "score": r.score,
            "decision": r.decision,
            "brief": r.brief or {},
            "metrics": r.metrics or [],
            "completedModules": r.completed_modules or []
        } for r in reports
    ]}

@app.get("/api/reports/{report_id}")
def get_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    return {
        "report": {
            "id": r.id,
            "name": r.name,
            "vertical": r.vertical,
            "tags": r.tags or [],
            "status": r.status,
            "score": r.score,
            "decision": r.decision,
            "brief": r.brief or {},
            "metrics": r.metrics or [],
            "completedModules": r.completed_modules or []
        }
    }

@app.post("/api/reports")
def create_report(payload: ReportCreateSchema, db: Session = Depends(get_db)):
    report_id = f"r{int(time.time() * 1000)}"
    client_info = payload.client or {}
    
    brief = {
        "company": client_info.get("company", payload.name),
        "industry": client_info.get("industry", "Technology"),
        "stage": client_info.get("stage", "Seed"),
        "geography": client_info.get("geography", "Global"),
        "model": client_info.get("businessModel", "B2B Enterprise"),
        "contact": client_info.get("contact", "founder@venture.io"),
        "ask": "$1.2M Seed"
    }
    
    score = random.randint(80, 95)
    
    db_report = ReportModel(
        id=report_id,
        name=payload.name,
        vertical=payload.vertical or "startups",
        tags=payload.tags or [brief["industry"], brief["model"]],
        status="RECEIVED",
        score=score,
        decision=1,
        brief=brief,
        metrics=[
            {"k": "Market Demand", "v": random.randint(85, 95)},
            {"k": "Tech Feasibility", "v": random.randint(75, 90)},
            {"k": "Unit Economics", "v": random.randint(80, 92)}
        ],
        completed_modules=[]
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return {
        "report": {
            "id": db_report.id,
            "name": db_report.name,
            "vertical": db_report.vertical,
            "tags": db_report.tags,
            "status": db_report.status,
            "score": db_report.score,
            "decision": db_report.decision,
            "brief": db_report.brief,
            "metrics": db_report.metrics
        }
    }

STAGE_FLOW = ["RECEIVED", "PENDING", "PROCESSED", "PUBLISHED"]

@app.post("/api/reports/{report_id}/advance")
def advance_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    
    try:
        curr_idx = STAGE_FLOW.index(r.status)
        if curr_idx < len(STAGE_FLOW) - 1:
            r.status = STAGE_FLOW[curr_idx + 1]
            db.commit()
    except ValueError:
        r.status = "PENDING"
        db.commit()
        
    return {"status": r.status}

@app.post("/api/reports/{report_id}/revert")
def revert_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    
    try:
        curr_idx = STAGE_FLOW.index(r.status)
        if curr_idx > 0:
            r.status = STAGE_FLOW[curr_idx - 1]
            db.commit()
    except ValueError:
        r.status = "RECEIVED"
        db.commit()
        
    return {"status": r.status}

@app.post("/api/reports/{report_id}/modules/{module_key}")
def run_module(report_id: str, module_key: str, body: Dict[str, Any] = {}, db: Session = Depends(get_db)):
    r = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    
    completed = r.completed_modules or []
    if module_key not in completed:
        completed.append(module_key)
        r.completed_modules = completed
        db.commit()
        
    return {"ok": True, "module": module_key, "reportId": report_id}

# Custom Domain Creation Endpoints
@app.get("/api/domains")
def list_domains(db: Session = Depends(get_db)):
    domains = db.query(DomainModel).all()
    return {"domains": [{"id": d.id, "name": d.name, "description": d.description} for d in domains]}

@app.post("/api/domains")
def create_domain(payload: CustomDomainSchema, db: Session = Depends(get_db)):
    domain_id = f"domain_{int(time.time() * 1000)}"
    d = DomainModel(id=domain_id, name=payload.name, description=payload.description)
    db.add(d)
    db.commit()
    return {"domain": {"id": d.id, "name": d.name, "description": d.description}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
