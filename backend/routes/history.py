import uuid
from fastapi import APIRouter
from datetime import datetime
from typing import List

router = APIRouter()

_history: List[dict] = [
    {"id": "h1", "timestamp": "2026-02-26T14:30:00", "area": "Bihar - Patna", "risk_level": "critical", "risk_score": 89.0, "confidence": 92.0, "rainfall": 85.0},
    {"id": "h2", "timestamp": "2026-02-26T12:15:00", "area": "Assam - Guwahati", "risk_level": "critical", "risk_score": 85.0, "confidence": 88.0, "rainfall": 90.0},
    {"id": "h3", "timestamp": "2026-02-25T09:45:00", "area": "Odisha - Bhubaneswar", "risk_level": "high", "risk_score": 72.0, "confidence": 90.0, "rainfall": 70.0},
    {"id": "h4", "timestamp": "2026-02-24T16:20:00", "area": "Maharashtra - Mumbai", "risk_level": "high", "risk_score": 70.0, "confidence": 85.0, "rainfall": 65.0},
    {"id": "h5", "timestamp": "2026-02-23T11:00:00", "area": "Gujarat - Surat", "risk_level": "medium", "risk_score": 45.0, "confidence": 94.0, "rainfall": 35.0},
]

@router.get("/history")
async def get_history(limit: int = 20):
    return {"history": _history[:limit], "total": len(_history)}

@router.post("/history")
async def add_history(entry: dict):
    entry["id"] = str(uuid.uuid4())[:8]
    entry["timestamp"] = datetime.utcnow().isoformat()
    _history.insert(0, entry)
    if len(_history) > 100:
        _history.pop()
    return entry

@router.delete("/history/{entry_id}")
async def delete_history(entry_id: str):
    global _history
    _history = [h for h in _history if h["id"] != entry_id]
    return {"status": "deleted"}
