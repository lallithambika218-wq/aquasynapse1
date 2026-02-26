"""
AquaSynapse — Upgraded SOS Route
Twilio SMS + WebSocket broadcast on every SOS event.
"""
import uuid
import logging
from fastapi import APIRouter
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory SOS event store
_sos_events: List[dict] = []


# ─── Request / Response Schemas ────────────────────────────────────────────────

class SOSLocation(BaseModel):
    lat: float = Field(default=28.6139, description="Latitude")
    lng: float = Field(default=77.2090, description="Longitude")
    address: Optional[str] = Field(default=None, description="Human-readable address")


class SOSRequest(BaseModel):
    zone: Optional[str] = Field(default="Unknown Zone")
    numbers: Optional[List[str]] = Field(
        default=[],
        description="Phone numbers to SMS (E.164 format: +91XXXXXXXXXX)"
    )
    location: Optional[SOSLocation] = Field(default=None)
    message: Optional[str] = Field(default=None)
    severity: str = Field(default="critical")
    # Legacy compat fields
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact: Optional[str] = None


class SOSResponse(BaseModel):
    status: str
    case_id: str
    zone: str
    message: str
    nearest_teams: List[str]
    eta_minutes: int
    sms_results: List[dict] = []
    ws_broadcast: bool = False


# ─── Route ─────────────────────────────────────────────────────────────────────

@router.post("/sos", response_model=SOSResponse)
async def send_sos(data: SOSRequest):
    """
    SOS Alert — sends SMS via Twilio + broadcasts WebSocket alert to all clients.
    Never crashes: SMS errors are logged and skipped, WS errors are caught.
    """
    case_id = f"SOS-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:4].upper()}"

    # Resolve location
    loc = data.location or SOSLocation(
        lat=data.latitude or 28.6139,
        lng=data.longitude or 77.2090,
    )
    zone = data.zone or "Unknown Zone"
    user_msg = data.message or f"Emergency alert in {zone}. Case: {case_id}"
    sms_text = f"🚨 AquaSynapse SOS | {zone} | Lat:{loc.lat:.4f} Lng:{loc.lng:.4f} | Case:{case_id} | {user_msg}"

    # ── SMS ───────────────────────────────────────────────────────────────────
    sms_results: List[dict] = []
    numbers = list(data.numbers or [])
    if data.contact:
        numbers.append(data.contact)

    if numbers:
        try:
            from services.sms_service import send_bulk_sms
            sms_results = send_bulk_sms(numbers, sms_text)
        except Exception as e:
            logger.error(f"[SOS] SMS service error: {e}")
            sms_results = [{"status": "error", "error": str(e)}]
    else:
        logger.info("[SOS] No phone numbers provided — skipping SMS")

    # ── WebSocket Broadcast ───────────────────────────────────────────────────
    ws_broadcast = False
    try:
        from services.connection_manager import manager
        await manager.broadcast({
            "type": "SOS_ALERT",
            "case_id": case_id,
            "zone": zone,
            "location": {"lat": loc.lat, "lng": loc.lng, "address": loc.address},
            "severity": data.severity,
            "message": f"🚨 Emergency Alert Nearby! — {zone}",
            "detail": user_msg,
            "timestamp": datetime.utcnow().isoformat(),
            "sms_count": len(numbers),
        })
        ws_broadcast = True
        logger.info(f"[SOS] WS broadcast sent for {case_id}")
    except Exception as e:
        logger.error(f"[SOS] WebSocket broadcast failed: {e}")

    # ── Persist ───────────────────────────────────────────────────────────────
    event = {
        "case_id": case_id,
        "zone": zone,
        "latitude": loc.lat,
        "longitude": loc.lng,
        "severity": data.severity,
        "status": "dispatched",
        "sms_count": len(numbers),
        "ws_broadcast": ws_broadcast,
        "timestamp": datetime.utcnow().isoformat(),
    }
    _sos_events.append(event)

    return SOSResponse(
        status="SOS_DISPATCHED",
        case_id=case_id,
        zone=zone,
        message=f"Emergency teams dispatched for {zone}. Track: {case_id}",
        nearest_teams=["NDRF Alpha", "Medical Unit Bravo", "Rescue Unit Charlie"],
        eta_minutes=12,
        sms_results=sms_results,
        ws_broadcast=ws_broadcast,
    )


@router.get("/sos/history")
async def sos_history():
    """Return all SOS events (newest first)."""
    return {"events": list(reversed(_sos_events)), "total": len(_sos_events)}
