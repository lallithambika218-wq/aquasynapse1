"""
AquaSynapse — SMS Service (Twilio)
Graceful degradation if Twilio is not configured.
"""
import os
import logging
from typing import Optional
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Load Twilio credentials from env
_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
_AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN", "")
_FROM_NUMBER = os.getenv("TWILIO_PHONE", "")

_twilio_enabled = bool(_ACCOUNT_SID and _AUTH_TOKEN and _FROM_NUMBER)

if _twilio_enabled:
    try:
        from twilio.rest import Client as TwilioClient
        _client = TwilioClient(_ACCOUNT_SID, _AUTH_TOKEN)
        logger.info("✅ Twilio SMS service initialized")
    except ImportError:
        _twilio_enabled = False
        logger.warning("⚠️  twilio package not installed — SMS disabled. Run: pip install twilio")
    except Exception as e:
        _twilio_enabled = False
        logger.error(f"⚠️  Twilio client init failed: {e}")
else:
    logger.info("ℹ️  Twilio credentials not set — SMS in simulation mode")


def send_sms(to_number: str, message: str) -> dict:
    """
    Send an SMS via Twilio.
    Returns a result dict. Never raises — errors are caught and logged.
    """
    if not _twilio_enabled:
        logger.info(f"[SMS SIM] → {to_number}: {message}")
        return {"status": "simulated", "to": to_number, "message": message}

    try:
        msg = _client.messages.create(
            body=message,
            from_=_FROM_NUMBER,
            to=to_number,
        )
        logger.info(f"[SMS SENT] SID={msg.sid} → {to_number}")
        return {"status": "sent", "sid": msg.sid, "to": to_number}
    except Exception as e:
        logger.error(f"[SMS ERROR] Failed to send to {to_number}: {e}")
        return {"status": "failed", "to": to_number, "error": str(e)}


def send_bulk_sms(numbers: list[str], message: str) -> list[dict]:
    """
    Send SMS to multiple numbers. Always completes all, never stops on failure.
    """
    results = []
    for number in numbers:
        result = send_sms(number, message)
        results.append(result)
    return results
