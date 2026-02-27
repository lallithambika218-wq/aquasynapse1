"""
AquaSynapse — Data Simulator Service
Generates realistic random data for all modules every 2-3 minutes.
"""
import random
from datetime import datetime, timedelta
import uuid
from typing import Dict, List

# ─── State Storage ─────────────────────────────────────────────────────────

simulation_state = {
    "risk_scores": {},
    "weather_data": {},
    "resources": {},
    "shelters": {},
    "sos_alerts": [],
}

# ─── Constants ─────────────────────────────────────────────────────────────

INDIAN_AREAS = [
    "Bihar - Patna",
    "Assam - Guwahati",
    "Odisha - Bhubaneswar",
    "West Bengal - Kolkata",
    "Jharkhand - Ranchi",
    "J&K - Srinagar",
    "Maharashtra - Mumbai",
    "UP - Lucknow",
    "Andhra Pradesh - Visakhapatnam",
    "Meghalaya - Shillong",
    "Telangana - Hyderabad",
    "Tamil Nadu - Chennai",
    "Gujarat - Surat",
    "Chhattisgarh - Raipur",
    "Karnataka - Bangalore",
    "Rajasthan - Jaipur",
    "Kerala - Kochi",
    "Punjab - Amritsar",
]

WEATHER_CONDITIONS = [
    "Clear Sky",
    "Light Rain",
    "Moderate Rain",
    "Heavy Rain",
    "Stormy",
    "Cyclonic",
    "Thunderstorm",
    "Cloudy",
]

SOS_ZONES = [
    "Zone A - Low Elevation",
    "Zone B - River Basin",
    "Zone C - Coastal Area",
    "Zone D - Urban Center",
    "Zone E - Agricultural Land",
]

# ─── Simulation Functions ──────────────────────────────────────────────────

def generate_risk_data() -> Dict:
    """Generate random risk analysis data for all areas."""
    areas_data = {}
    for area in INDIAN_AREAS:
        base_score = random.randint(20, 95)
        areas_data[area] = {
            "risk_score": base_score,
            "confidence": round(random.uniform(75, 99), 1),
            "rainfall": round(random.uniform(10, 100), 1),
            "elevation": random.randint(10, 2500),
            "population_density": random.randint(50, 1000),
            "coastal_distance": round(random.uniform(0, 500), 1),
            "risk_level": (
                "critical" if base_score >= 75
                else "high" if base_score >= 50
                else "medium" if base_score >= 30
                else "low"
            ),
            "timestamp": datetime.utcnow().isoformat(),
        }
    
    simulation_state["risk_scores"] = areas_data
    return areas_data


def generate_weather_data() -> Dict:
    """Generate random weather data for all areas."""
    weather_data = {}
    for area in INDIAN_AREAS:
        weather_data[area] = {
            "area": area,
            "temperature": random.randint(15, 40),
            "humidity": random.randint(40, 95),
            "rainfall": round(random.uniform(0, 100), 1),
            "wind_speed": random.randint(5, 60),
            "condition": random.choice(WEATHER_CONDITIONS),
            "source": "simulator",
            "updated_at": datetime.utcnow().isoformat(),
        }
    
    simulation_state["weather_data"] = weather_data
    return weather_data


def generate_sos_alerts(count: int = 2) -> List[Dict]:
    """Generate random SOS alerts."""
    alerts = []
    for _ in range(random.randint(1, count)):
        case_id = f"SOS-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:4].upper()}"
        area = random.choice(INDIAN_AREAS)
        
        alerts.append({
            "case_id": case_id,
            "zone": random.choice(SOS_ZONES),
            "area": area,
            "latitude": round(random.uniform(8, 35), 4),
            "longitude": round(random.uniform(68, 97), 4),
            "severity": random.choice(["low", "medium", "high", "critical"]),
            "message": random.choice([
                "Flash flood warning activated",
                "Water level rising rapidly",
                "Mudslide detected on hillside",
                "River overflow imminent",
                "Population at risk - evacuation needed",
                "Infrastructure damage reported",
            ]),
            "timestamp": datetime.utcnow().isoformat(),
            "status": "active",
        })
    
    simulation_state["sos_alerts"] = alerts
    return alerts


def generate_resources_data(risk_score: float) -> Dict:
    """Generate resource allocation based on current risk score."""
    m = risk_score / 100
    resources = [
        {"name": "Rescue Boats", "icon": "⛵", "current": max(1, round(50 * m + random.randint(-5, 5))), "total": 50},
        {"name": "Ambulances", "icon": "🚑", "current": max(1, round(30 * m + random.randint(-3, 3))), "total": 30},
        {"name": "Food Kits", "icon": "📦", "current": max(10, round(500 * m + random.randint(-20, 20))), "total": 500},
        {"name": "Medical Teams", "icon": "⚕️", "current": max(1, round(20 * m + random.randint(-2, 2))), "total": 20},
        {"name": "Helicopters", "icon": "🚁", "current": max(0, round(5 * m + random.randint(-1, 1))), "total": 5},
        {"name": "Evacuation Buses", "icon": "🚌", "current": max(1, round(15 * m + random.randint(-2, 2))), "total": 15},
        {"name": "Water Tankers", "icon": "💧", "current": max(2, round(25 * m + random.randint(-3, 3))), "total": 25},
        {"name": "Generators", "icon": "⚡", "current": max(2, round(20 * m + random.randint(-3, 3))), "total": 20},
    ]
    
    simulation_state["resources"] = {
        "risk_score": risk_score,
        "resources": resources,
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    return resources


def generate_shelters_data() -> Dict:
    """Generate random shelter occupancy and status updates."""
    shelters = [
        {"id": "s1", "name": "Green Valley School", "capacity": 1200, "facilities": ["Medical", "Food", "Water"]},
        {"id": "s2", "name": "City Hall Shelter", "capacity": 800, "facilities": ["Food", "Water"]},
        {"id": "s3", "name": "Hilltop Complex", "capacity": 1500, "facilities": ["Medical", "Food", "Water", "Power"]},
        {"id": "s4", "name": "District Stadium", "capacity": 3000, "facilities": ["Medical", "Food", "Water", "Power", "Comms"]},
        {"id": "s5", "name": "Community Center", "capacity": 600, "facilities": ["Food", "Water"]},
        {"id": "s6", "name": "Railway Station Hall", "capacity": 2000, "facilities": ["Medical", "Food"]},
    ]
    
    for shelter in shelters:
        capacity = shelter["capacity"]
        shelter["current_occupancy"] = random.randint(int(capacity * 0.1), int(capacity * 0.95))
        occupancy_rate = shelter["current_occupancy"] / capacity
        
        if occupancy_rate > 0.95:
            shelter["safety"] = "Full"
        elif occupancy_rate > 0.80:
            shelter["safety"] = "At Risk"
        else:
            shelter["safety"] = "Safe"
        
        shelter["distance_km"] = round(random.uniform(1, 15), 1)
    
    simulation_state["shelters"] = shelters
    return shelters


def get_all_simulated_data() -> Dict:
    """Get all current simulated data."""
    avg_risk = sum(d["risk_score"] for d in simulation_state["risk_scores"].values()) / len(simulation_state["risk_scores"]) if simulation_state["risk_scores"] else 50
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "average_risk_score": round(avg_risk, 1),
        "risk_overview": simulation_state["risk_scores"],
        "weather_data": simulation_state["weather_data"],
        "sos_alerts": simulation_state["sos_alerts"],
        "resources": simulation_state["resources"],
        "shelters": simulation_state["shelters"],
    }


def run_simulation_cycle():
    """Execute one complete simulation cycle — updates all modules."""
    print("\n📊 Running simulation cycle...")
    
    # Generate all data
    generate_risk_data()
    generate_weather_data()
    generate_sos_alerts(count=3)
    shelters = generate_shelters_data()
    
    avg_risk = sum(d["risk_score"] for d in simulation_state["risk_scores"].values()) / len(simulation_state["risk_scores"])
    generate_resources_data(avg_risk)
    
    data = get_all_simulated_data()
    
    print(f"✅ Simulation complete — Average Risk: {data['average_risk_score']}, SOS Alerts: {len(data['sos_alerts'])}, Shelters: {len(shelters)}")
    
    return data
