"""
AquaSynapse - FastAPI Main Application
Production-grade modular architecture
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import asyncio, json, random
from datetime import datetime

from ml_engine.predict import load_model
import routes.analyze as analyze_router
import routes.weather as weather_router
import routes.sos as sos_router
import routes.resources as resources_router
import routes.shelters as shelters_router
import routes.history as history_router
import routes.export as export_router

# ─── Shared WebSocket Manager (singleton from services) ───────────────────────
from services.connection_manager import manager

# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n🚀 AquaSynapse API starting up...")
    print("📦 Loading ML model...")
    load_model()
    print("✅ API ready!\n")
    yield
    print("🛑 AquaSynapse API shutting down...")

# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="AquaSynapse AI",
    description="Intelligent Disaster Response Platform — Production API",
    version="3.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────────────────────────

app.include_router(analyze_router.router,   prefix="/api", tags=["Risk Engine"])
app.include_router(weather_router.router,   prefix="/api", tags=["Weather"])
app.include_router(sos_router.router,       prefix="/api", tags=["SOS"])
app.include_router(resources_router.router, prefix="/api", tags=["Resources"])
app.include_router(shelters_router.router,  prefix="/api", tags=["Shelters"])
app.include_router(history_router.router,   prefix="/api", tags=["History"])
app.include_router(export_router.router,    prefix="/api", tags=["Export"])

# ─── Root & Health ────────────────────────────────────────────────────────────

@app.get("/", tags=["System"])
async def root():
    return {
        "system": "AquaSynapse AI",
        "version": "3.1.0",
        "status": "operational",
        "docs": "/docs",
        "websocket_updates": "ws://localhost:8000/ws/updates",
        "websocket_sos": "ws://localhost:8000/ws",
        "active_connections": manager.connection_count,
    }

@app.get("/health", tags=["System"])
async def health():
    from ml_engine.predict import _model_loaded
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "ml_model": "loaded" if _model_loaded else "fallback",
        "ws_connections": manager.connection_count,
        "services": {
            "analyze": "ok", "weather": "ok", "sos": "ok",
            "resources": "ok", "shelters": "ok", "history": "ok",
            "sms": "twilio_or_sim",
        }
    }

# ─── WebSocket: Primary SOS / Alert feed (/ws) ────────────────────────────────

@app.websocket("/ws")
async def websocket_sos(ws: WebSocket):
    """
    Primary SOS WebSocket endpoint.
    Clients connect here to receive real-time SOS_ALERT and risk_update messages.
    Reconnect logic should be implemented client-side.
    """
    await manager.connect(ws)
    try:
        # Send immediate welcome ping so client knows the connection is live
        await manager.send_personal(ws, {
            "type": "connected",
            "message": "AquaSynapse real-time feed active",
            "timestamp": datetime.utcnow().isoformat(),
        })
        # Keep connection alive — wait for disconnect
        while True:
            try:
                # Accept any ping/pong from client; timeout keeps connection warm
                data = await asyncio.wait_for(ws.receive_text(), timeout=30)
                # Echo pings
                if data == "ping":
                    await manager.send_personal(ws, {"type": "pong"})
            except asyncio.TimeoutError:
                # Send keepalive heartbeat every 30s
                await manager.send_personal(ws, {
                    "type": "heartbeat",
                    "timestamp": datetime.utcnow().isoformat(),
                    "connections": manager.connection_count,
                })
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)

# ─── WebSocket: Live risk feed (/ws/updates) ──────────────────────────────────

@app.websocket("/ws/updates")
async def websocket_updates(ws: WebSocket):
    """
    Secondary WebSocket — sends periodic risk_update ticks every 5 seconds.
    SOS alerts are also broadcast here because manager is shared.
    """
    await manager.connect(ws)
    try:
        while True:
            await asyncio.sleep(5)
            await manager.broadcast({
                "type": "risk_update",
                "timestamp": datetime.utcnow().isoformat(),
                "risk_delta": random.randint(-3, 3),
                "active_alerts": random.randint(3, 8),
                "weather_update": {
                    "rainfall": round(random.uniform(20, 80), 1),
                    "wind_speed": random.randint(10, 45),
                }
            })
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)

# ─── Global Exception Handler ────────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "message": "Internal server error. Fallback mode active."}
    )
