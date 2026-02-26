import os, random
from fastapi import APIRouter
from datetime import datetime
import httpx

router = APIRouter()

OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY", "")
_weather_cache: dict = {}

AREA_FALLBACK = {
    "Bihar - Patna": {"temperature": 34, "humidity": 82, "rainfall": 65, "wind_speed": 22, "condition": "Heavy Rain"},
    "Assam - Guwahati": {"temperature": 30, "humidity": 90, "rainfall": 75, "wind_speed": 18, "condition": "Stormy"},
    "Odisha - Bhubaneswar": {"temperature": 36, "humidity": 75, "rainfall": 55, "wind_speed": 35, "condition": "Cyclonic"},
    "Maharashtra - Mumbai": {"temperature": 32, "humidity": 80, "rainfall": 50, "wind_speed": 28, "condition": "Heavy Rain"},
}

@router.get("/weather/{area}")
async def get_weather(area: str):
    """
    Weather service — tries OpenWeather API first.
    Falls back to dataset-derived averages if API unavailable.
    """
    cache_key = f"{area}_{datetime.utcnow().strftime('%Y%m%d%H')}"
    if cache_key in _weather_cache:
        return {**_weather_cache[cache_key], "source": "cache"}

    result = None
    if OPENWEATHER_KEY:
        try:
            city = area.split(" - ")[-1] if " - " in area else area
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={"q": f"{city},IN", "appid": OPENWEATHER_KEY, "units": "metric"}
                )
                if resp.status_code == 200:
                    d = resp.json()
                    result = {
                        "area": area,
                        "temperature": round(d["main"]["temp"]),
                        "humidity": d["main"]["humidity"],
                        "rainfall": round(d.get("rain", {}).get("1h", 0) * 10, 1),
                        "wind_speed": round(d["wind"]["speed"] * 3.6),
                        "condition": d["weather"][0]["description"].title(),
                        "source": "openweather",
                        "updated_at": datetime.utcnow().isoformat(),
                    }
        except Exception:
            pass

    if not result:
        # Fallback to dataset averages with slight randomness
        base = AREA_FALLBACK.get(area, {"temperature": 33, "humidity": 75, "rainfall": 50, "wind_speed": 25, "condition": "Moderate Rain"})
        result = {
            "area": area,
            "temperature": base["temperature"] + random.randint(-2, 2),
            "humidity": min(100, base["humidity"] + random.randint(-5, 5)),
            "rainfall": round(base["rainfall"] + random.uniform(-5, 5), 1),
            "wind_speed": base["wind_speed"] + random.randint(-5, 5),
            "condition": base["condition"],
            "source": "dataset_fallback",
            "updated_at": datetime.utcnow().isoformat(),
        }

    _weather_cache[cache_key] = result
    return result
