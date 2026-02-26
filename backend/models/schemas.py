from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AnalysisInput(BaseModel):
    area: str = Field(default="Bihar - Patna", description="Geographic area name")
    rainfall: float = Field(default=65.0, ge=0, le=100, description="Rainfall intensity 0-100")
    elevation: float = Field(default=12.0, ge=0, le=100, description="Elevation in normalized 0-100 scale")
    population_density: float = Field(default=95.0, ge=0, le=100, description="Population density 0-100")
    coastal_distance: float = Field(default=90.0, ge=0, le=100, description="Coastal distance 0-100 (100=far inland)")
    historical_index: float = Field(default=50.0, ge=0, le=100, description="Historical disaster index 0-100")

class AnalysisResult(BaseModel):
    area: str
    risk_score: float
    risk_level: str
    confidence: float
    feature_importance: Dict[str, float]
    golden_hour_index: Dict[str, Any]
    recommended_resources: Dict[str, int]
    suggested_shelters: List[Dict[str, Any]]
    model_source: str
    inputs: Dict[str, float]

class SOSRequest(BaseModel):
    zone: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact: Optional[str] = None
    message: Optional[str] = None
    severity: str = "critical"

class SOSResponse(BaseModel):
    status: str
    case_id: str
    zone: str
    message: str
    nearest_teams: List[str]
    eta_minutes: int

class HistoryEntry(BaseModel):
    id: str
    timestamp: str
    area: str
    risk_level: str
    risk_score: float
    confidence: float
    rainfall: float
