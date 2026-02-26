"""
AquaSynapse ML Engine - Prediction Service
Loads trained model and provides predict() function.
Falls back to rule-based engine if model unavailable.
"""
import os, math
import numpy as np
from typing import Optional

ENGINE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(ENGINE_DIR, "model.pkl")
SCALER_PATH = os.path.join(ENGINE_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(ENGINE_DIR, "label_encoder.pkl")

FEATURE_COLS = ["rainfall", "elevation", "population_density", "coastal_distance", "historical_index"]

_model = None
_scaler = None
_label_encoder = None
_model_loaded = False

def load_model():
    global _model, _scaler, _label_encoder, _model_loaded
    try:
        import joblib
        if not os.path.exists(MODEL_PATH):
            print("[ML] model.pkl not found. Training now...")
            from ml_engine.train import train
            _model, _scaler, _label_encoder, _ = train()
        else:
            _model = joblib.load(MODEL_PATH)
            _scaler = joblib.load(SCALER_PATH)
            _label_encoder = joblib.load(ENCODER_PATH)
        _model_loaded = True
        print("[ML] Model loaded successfully ✅")
    except Exception as e:
        print(f"[ML] Failed to load model: {e}. Using rule-based fallback.")
        _model_loaded = False

def _rule_based_predict(rainfall, elevation, population_density, coastal_distance, historical_index):
    """Deterministic rule-based fallback"""
    score = (
        min(rainfall, 100) * 0.30 +
        max(0, 100 - min(elevation, 100)) * 0.25 +
        min(population_density, 100) * 0.20 +
        max(0, 100 - min(coastal_distance, 100)) * 0.15 +
        min(historical_index, 100) * 0.10
    )
    score = max(0, min(100, round(score)))
    if score >= 70: risk_level = "critical"
    elif score >= 50: risk_level = "high"
    elif score >= 30: risk_level = "medium"
    else: risk_level = "low"
    return score, risk_level, 75.0  # confidence is lower for fallback

def _compute_risk_score(risk_level: str, proba: np.ndarray, classes) -> float:
    """Convert ML output to 0-100 risk score"""
    level_weights = {"low": 15, "medium": 45, "high": 70, "critical": 90}
    score = 0.0
    for i, cls in enumerate(classes):
        score += proba[i] * level_weights.get(cls, 50)
    return round(min(100, max(0, score)), 1)

def _golden_hour(risk_score: float, rainfall: float) -> dict:
    """Compute golden hour index from risk + rainfall trend"""
    urgency = risk_score * 0.6 + rainfall * 0.4
    if urgency >= 70:
        return {"status": "Critical", "time_window_hours": 0, "message": "Immediate Action Required", "color": "critical"}
    elif urgency >= 45:
        hours = round(max(0.5, (100 - urgency) / 20), 1)
        return {"status": "Warning", "time_window_hours": hours, "message": f"Act within {hours} hours", "color": "warning"}
    else:
        hours = round((100 - urgency) / 15, 1)
        return {"status": "Safe", "time_window_hours": min(hours, 8.0), "message": f"{hours}h safe window", "color": "safe"}

def _recommended_resources(risk_score: float) -> dict:
    """Return resource allocation based on risk score"""
    multiplier = risk_score / 100
    return {
        "boats": max(0, round(50 * multiplier)),
        "ambulances": max(0, round(30 * multiplier)),
        "food_kits": max(0, round(500 * multiplier)),
        "medical_teams": max(0, round(20 * multiplier)),
        "evacuation_buses": max(0, round(15 * multiplier)),
        "helicopters": max(0, round(5 * multiplier)),
    }

def _suggested_shelters(risk_score: float, area: str) -> list:
    """Return shelter suggestions based on risk score"""
    shelters = [
        {"name": "Green Valley School", "capacity": 1200, "safety": "Safe", "distance_km": 2.3},
        {"name": "City Hall Shelter", "capacity": 800, "safety": "At Risk" if risk_score > 60 else "Safe", "distance_km": 5.1},
        {"name": "Hilltop Complex", "capacity": 1500, "safety": "Safe", "distance_km": 7.8},
        {"name": "Stadium Shelter", "capacity": 3000, "safety": "Safe", "distance_km": 12.4},
        {"name": "Community Center", "capacity": 600, "safety": "Full" if risk_score > 75 else "Safe", "distance_km": 3.2},
    ]
    # Return only safe shelters for high-risk
    if risk_score > 70:
        return [s for s in shelters if s["safety"] == "Safe"]
    return shelters

def predict(
    rainfall: float,
    elevation: float,
    population_density: float,
    coastal_distance: float,
    historical_index: float,
    area: str = "Unknown"
) -> dict:
    """
    Main prediction function.
    Returns full analysis payload with risk score, XAI, golden hour index,
    recommended resources, and shelter suggestions.
    """
    global _model_loaded

    if _model_loaded and _model is not None:
        try:
            features = np.array([[rainfall, elevation, population_density, coastal_distance, historical_index]])
            X_scaled = _scaler.transform(features)
            proba = _model.predict_proba(X_scaled)[0]
            pred_class_idx = np.argmax(proba)
            risk_level = _label_encoder.classes_[pred_class_idx]
            confidence = round(float(proba[pred_class_idx]) * 100, 1)
            risk_score = _compute_risk_score(risk_level, proba, _label_encoder.classes_)
            
            # Feature importance
            importances = _model.feature_importances_
            feature_importance = {col: round(float(importances[i]) * 100, 2) for i, col in enumerate(FEATURE_COLS)}
            model_source = "RandomForestClassifier"
        except Exception as e:
            print(f"[ML] Prediction error: {e}. Using rule-based fallback.")
            risk_score, risk_level, confidence = _rule_based_predict(rainfall, elevation, population_density, coastal_distance, historical_index)
            feature_importance = {col: 20.0 for col in FEATURE_COLS}
            model_source = "rule_based_fallback"
    else:
        risk_score, risk_level, confidence = _rule_based_predict(rainfall, elevation, population_density, coastal_distance, historical_index)
        feature_importance = {col: 20.0 for col in FEATURE_COLS}
        model_source = "rule_based_fallback"

    return {
        "area": area,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": confidence,
        "feature_importance": feature_importance,
        "golden_hour_index": _golden_hour(risk_score, rainfall),
        "recommended_resources": _recommended_resources(risk_score),
        "suggested_shelters": _suggested_shelters(risk_score, area),
        "model_source": model_source,
        "inputs": {
            "rainfall": rainfall,
            "elevation": elevation,
            "population_density": population_density,
            "coastal_distance": coastal_distance,
            "historical_index": historical_index,
        }
    }
