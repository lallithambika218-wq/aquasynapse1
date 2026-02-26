from fastapi import APIRouter, Query

router = APIRouter()

SHELTERS = [
    {"id": "s1", "name": "Green Valley School", "capacity": 1200, "current_occupancy": 340, "safety": "Safe", "distance_km": 2.3, "facilities": ["Medical", "Food", "Water"]},
    {"id": "s2", "name": "City Hall Shelter", "capacity": 800, "current_occupancy": 620, "safety": "At Risk", "distance_km": 5.1, "facilities": ["Food", "Water"]},
    {"id": "s3", "name": "Hilltop Complex", "capacity": 1500, "current_occupancy": 200, "safety": "Safe", "distance_km": 7.8, "facilities": ["Medical", "Food", "Water", "Power"]},
    {"id": "s4", "name": "District Stadium", "capacity": 3000, "current_occupancy": 450, "safety": "Safe", "distance_km": 12.4, "facilities": ["Medical", "Food", "Water", "Power", "Comms"]},
    {"id": "s5", "name": "Community Center", "capacity": 600, "current_occupancy": 600, "safety": "Full", "distance_km": 3.2, "facilities": ["Food", "Water"]},
    {"id": "s6", "name": "Railway Station Hall", "capacity": 2000, "current_occupancy": 800, "safety": "Safe", "distance_km": 6.5, "facilities": ["Medical", "Food"]},
]

@router.get("/shelters")
async def get_shelters(risk_score: float = Query(default=65.0)):
    """
    Shelter recommendation service — filters by safety.
    For critical risk, only returns Safe shelters.
    Independent from ML engine.
    """
    if risk_score >= 75:
        filtered = [s for s in SHELTERS if s["safety"] == "Safe"]
    elif risk_score >= 50:
        filtered = [s for s in SHELTERS if s["safety"] in ("Safe", "At Risk")]
    else:
        filtered = SHELTERS

    # Sort by distance
    filtered = sorted(filtered, key=lambda x: x["distance_km"])
    
    return {
        "shelters": filtered,
        "total_capacity": sum(s["capacity"] for s in filtered),
        "available_capacity": sum(s["capacity"] - s["current_occupancy"] for s in filtered),
        "risk_score": risk_score,
    }
