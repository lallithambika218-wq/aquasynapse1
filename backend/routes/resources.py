from fastapi import APIRouter, Query
from datetime import datetime

router = APIRouter()

@router.get("/resources")
async def get_resources(risk_score: float = Query(default=65.0, ge=0, le=100)):
    """
    Resource Allocation Service — independent from ML engine.
    Scales resources based on risk_score parameter.
    """
    m = risk_score / 100
    resources = [
        {"name": "Rescue Boats", "icon": "⛵", "current": round(50 * m), "total": 50, "unit": ""},
        {"name": "Ambulances", "icon": "🚑", "current": round(30 * m), "total": 30, "unit": ""},
        {"name": "Food Kits", "icon": "📦", "current": round(500 * m), "total": 500, "unit": ""},
        {"name": "Medical Teams", "icon": "⚕️", "current": round(20 * m), "total": 20, "unit": ""},
        {"name": "Helicopters", "icon": "🚁", "current": round(5 * m), "total": 5, "unit": ""},
        {"name": "Evacuation Buses", "icon": "🚌", "current": round(15 * m), "total": 15, "unit": ""},
    ]
    return {
        "resources": resources,
        "risk_score": risk_score,
        "timestamp": datetime.utcnow().isoformat(),
    }
