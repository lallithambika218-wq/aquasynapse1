"""
AquaSynapse - Synthetic Disaster Dataset Generator
Generates 10,000 rows of realistic flood/disaster risk data
Based on Indian geography and historical patterns
"""
import pandas as pd
import numpy as np
import os

SEED = 42
np.random.seed(SEED)
N = 10000

states = [
    ("Bihar", 25.5, 85.1, 12, 90),
    ("Assam", 26.2, 92.9, 8, 70),
    ("Odisha", 20.9, 85.1, 10, 10),
    ("West Bengal", 22.9, 87.9, 5, 8),
    ("Jharkhand", 23.6, 85.3, 35, 80),
    ("Maharashtra", 19.7, 75.7, 30, 5),
    ("Karnataka", 15.3, 75.7, 42, 15),
    ("Tamil Nadu", 11.1, 78.7, 15, 5),
    ("Kerala", 10.8, 76.3, 35, 3),
    ("Rajasthan", 27.0, 74.2, 25, 92),
    ("Gujarat", 22.3, 72.6, 18, 4),
    ("UP", 26.9, 80.9, 15, 85),
    ("MP", 22.9, 78.7, 40, 88),
    ("Andhra Pradesh", 15.9, 79.7, 20, 6),
    ("Telangana", 17.1, 79.0, 28, 75),
]

state_names = [s[0] for s in states]
base_elevation = {s[0]: s[3] for s in states}
base_coastal = {s[0]: s[4] for s in states}

def generate_risk_label(rainfall, elevation, population, coastal_dist, hist_idx):
    score = (
        min(rainfall, 100) * 0.30 +
        max(0, 100 - min(elevation, 100)) * 0.25 +
        min(population, 100) * 0.20 +
        max(0, 100 - min(coastal_dist, 100)) * 0.15 +
        min(hist_idx, 100) * 0.10
    )
    if score >= 70: return "critical"
    elif score >= 50: return "high"
    elif score >= 30: return "medium"
    else: return "low"

records = []
for i in range(N):
    state = state_names[np.random.randint(0, len(state_names))]
    rainfall = float(np.clip(np.random.normal(55, 25), 0, 100))
    elevation = float(np.clip(np.random.normal(base_elevation[state], 15), 0, 100))
    population = float(np.clip(np.random.normal(65, 20), 0, 100))
    coastal_dist = float(np.clip(np.random.normal(base_coastal[state], 20), 0, 100))
    hist_idx = float(np.clip(np.random.normal(50, 25), 0, 100))
    
    risk_label = generate_risk_label(rainfall, elevation, population, coastal_dist, hist_idx)
    records.append({
        "state": state,
        "rainfall": round(rainfall, 2),
        "elevation": round(elevation, 2),
        "population_density": round(population, 2),
        "coastal_distance": round(coastal_dist, 2),
        "historical_index": round(hist_idx, 2),
        "risk_level": risk_label,
    })

df = pd.DataFrame(records)
out_path = os.path.join(os.path.dirname(__file__), "flood_dataset.csv")
df.to_csv(out_path, index=False)
print(f"[AquaSynapse] Generated {len(df)} rows -> {out_path}")
print(df["risk_level"].value_counts())
