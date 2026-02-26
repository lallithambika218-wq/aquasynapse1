import io, csv, json
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse, JSONResponse
from datetime import datetime

router = APIRouter()

def _build_report(area: str, risk_score: float, confidence: float, rainfall: float) -> dict:
    return {
        "generated_by": "AquaSynapse AI v3.0",
        "timestamp": datetime.utcnow().isoformat(),
        "analysis_area": area,
        "risk_metrics": {"risk_score": risk_score, "confidence": confidence, "rainfall": rainfall},
        "resources": {"boats": 36, "ambulances": 22, "food_kits": 410, "medical_teams": 15},
        "shelters": {"available": 3, "total_capacity": 5200},
        "sdg_alignment": "SDG 13 - Climate Action",
    }

@router.get("/export/json")
async def export_json(
    area: str = Query(default="India Overview"),
    risk_score: float = Query(default=75.0),
    confidence: float = Query(default=92.0),
    rainfall: float = Query(default=65.0),
):
    report = _build_report(area, risk_score, confidence, rainfall)
    return JSONResponse(
        content=report,
        headers={"Content-Disposition": f"attachment; filename=aquasynapse-{datetime.utcnow().strftime('%Y%m%d-%H%M')}.json"},
    )

@router.get("/export/csv")
async def export_csv(
    area: str = Query(default="India Overview"),
    risk_score: float = Query(default=75.0),
    confidence: float = Query(default=92.0),
    rainfall: float = Query(default=65.0),
):
    report = _build_report(area, risk_score, confidence, rainfall)
    rows = [["Field", "Value"]]
    for k, v in report.items():
        if isinstance(v, dict):
            for k2, v2 in v.items():
                rows.append([f"{k}.{k2}", str(v2)])
        else:
            rows.append([k, str(v)])

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerows(rows)
    buf.seek(0)

    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=aquasynapse-{datetime.utcnow().strftime('%Y%m%d-%H%M')}.csv"},
    )
