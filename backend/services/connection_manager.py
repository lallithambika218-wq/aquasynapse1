"""
AquaSynapse — WebSocket Connection Manager (shared singleton)
Imported by main.py and routes that need to broadcast.
"""
import json
import logging
from typing import List
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Thread-safe WebSocket connection pool with broadcast support."""

    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        logger.info(f"[WS] Client connected. Total: {len(self.active)}")

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)
            logger.info(f"[WS] Client disconnected. Total: {len(self.active)}")

    async def broadcast(self, data: dict):
        """Broadcast JSON to all connected clients. Dead sockets are cleaned up."""
        if not self.active:
            return
        msg = json.dumps(data)
        dead: List[WebSocket] = []
        for ws in self.active:
            try:
                await ws.send_text(msg)
            except Exception as e:
                logger.warning(f"[WS] Send failed, queuing removal: {e}")
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    async def send_personal(self, ws: WebSocket, data: dict):
        """Send a message to a single specific WebSocket client."""
        try:
            await ws.send_text(json.dumps(data))
        except Exception as e:
            logger.warning(f"[WS] Personal send failed: {e}")
            self.disconnect(ws)

    @property
    def connection_count(self) -> int:
        return len(self.active)


# Singleton — imported by main.py and SOS route
manager = ConnectionManager()
