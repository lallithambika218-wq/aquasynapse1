from fastapi import APIRouter
from datetime import datetime
from models.schemas import AnalysisInput, AnalysisResult
from ml_engine.predict import predict

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_risk(data: AnalysisInput):
    """
    Core Risk Engine — Uses trained RandomForest ML model.
    Falls back to rule-based engine if model unavailable.
    """
    result = predict(
        rainfall=data.rainfall,
        elevation=data.elevation,
        population_density=data.population_density,
        coastal_distance=data.coastal_distance,
        historical_index=data.historical_index,
        area=data.area,
    )
    return result

@router.get("/risk-overview")
async def risk_overview():
    """Full India risk overview — all states with score"""
    states = [
        {"name": "Bihar", "risk_level": "critical", "risk_score": 89, "lat": 25.5, "lng": 85.1, "rainfall": 85},
        {"name": "Assam", "risk_level": "critical", "risk_score": 85, "lat": 26.2, "lng": 92.9, "rainfall": 90},
        {"name": "Odisha", "risk_level": "critical", "risk_score": 82, "lat": 20.9, "lng": 85.1, "rainfall": 80},
        {"name": "West Bengal", "risk_level": "high", "risk_score": 75, "lat": 22.9, "lng": 87.9, "rainfall": 70},
        {"name": "Jharkhand", "risk_level": "high", "risk_score": 73, "lat": 23.6, "lng": 85.3, "rainfall": 62},
        {"name": "J&K", "risk_level": "high", "risk_score": 72, "lat": 33.7, "lng": 76.9, "rainfall": 60},
        {"name": "Maharashtra", "risk_level": "high", "risk_score": 70, "lat": 19.7, "lng": 75.7, "rainfall": 65},
        {"name": "UP", "risk_level": "high", "risk_score": 68, "lat": 26.9, "lng": 80.9, "rainfall": 55},
        {"name": "Andhra Pradesh", "risk_level": "high", "risk_score": 65, "lat": 15.9, "lng": 79.7, "rainfall": 60},
        {"name": "Meghalaya", "risk_level": "medium", "risk_score": 52, "lat": 25.5, "lng": 91.4, "rainfall": 88},
        {"name": "Telangana", "risk_level": "medium", "risk_score": 50, "lat": 17.1, "lng": 79.0, "rainfall": 48},
        {"name": "Tamil Nadu", "risk_level": "medium", "risk_score": 48, "lat": 11.1, "lng": 78.7, "rainfall": 50},
        {"name": "Gujarat", "risk_level": "medium", "risk_score": 45, "lat": 22.3, "lng": 72.6, "rainfall": 35},
        {"name": "Chhattisgarh", "risk_level": "medium", "risk_score": 44, "lat": 21.3, "lng": 81.9, "rainfall": 42},
        {"name": "Karnataka", "risk_level": "medium", "risk_score": 38, "lat": 15.3, "lng": 75.7, "rainfall": 45},
        {"name": "Rajasthan", "risk_level": "low", "risk_score": 20, "lat": 27.0, "lng": 74.2, "rainfall": 10},
        {"name": "Kerala", "risk_level": "low", "risk_score": 30, "lat": 10.8, "lng": 76.3, "rainfall": 75},
        {"name": "Punjab", "risk_level": "low", "risk_score": 25, "lat": 31.1, "lng": 75.3, "rainfall": 20},
    ]
    return {
        "states": states,
        "summary": {
            "total": len(states),
            "critical": sum(1 for s in states if s["risk_level"] == "critical"),
            "high": sum(1 for s in states if s["risk_level"] == "high"),
            "medium": sum(1 for s in states if s["risk_level"] == "medium"),
            "low": sum(1 for s in states if s["risk_level"] == "low"),
        },
        "timestamp": datetime.utcnow().isoformat(),
    }
