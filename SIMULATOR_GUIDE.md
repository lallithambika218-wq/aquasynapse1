# 📊 AquaSynapse Data Simulation System

## Overview

The AquaSynapse **Data Simulation System** automatically generates realistic, diverse data across all modules every **2-3 minutes**. This feature allows you to:

- **Demonstrate real-time functionality** without waiting for actual disaster data
- **Test system reactions** to varying risk scenarios
- **Visualize data patterns** across all Indian states
- **Monitor WebSocket broadcasts** in real-time
- **Control simulation cycles** manually or automatically

## Features

### 1. **Automatic Background Simulation**
- Runs continuously in the background every 2-3 minutes (randomized)
- Generates new data for all modules simultaneously
- Broadcasts updates via WebSocket to all connected clients

### 2. **Simulated Data Types**

#### **Risk Scores & Analysis**
- Random risk scores (0-100) for all 18 Indian states/regions
- Confidence levels (75-99%)
- Risk classifications: Critical, High, Medium, Low
- Rainfall, elevation, population density, and coastal distance factors

#### **Weather Data**
- Temperature variations (15-40°C)
- Humidity levels (40-95%)
- Rainfall amounts (0-100 mm)
- Wind speeds (5-60 km/h)
- Dynamic weather conditions (Clear, Rain, Storm, Cyclonic, etc.)

#### **SOS Alerts**
- 1-3 random SOS alerts per cycle
- Variable severity levels (low, medium, high, critical)
- Realistic alert messages (flood warnings, mudslides, evacuations)
- Location data (latitude, longitude)
- Unique case IDs for tracking

#### **Resource Allocation**
- 8 resource types with dynamic allocation:
  - Rescue Boats, Ambulances, Food Kits, Medical Teams
  - Helicopters, Evacuation Buses, Water Tankers, Generators
- Allocation scales based on average risk score

#### **Shelter Status**
- 6 major shelters with updated occupancy
- Real-time capacity tracking
- Safety status (Safe, At Risk, Full)
- Facility availability

### 3. **Real-Time WebSocket Broadcasting**
- All simulated data broadcast to WebSocket clients
- Individual SOS alerts trigger separate notifications
- Heartbeat messages keep connections alive

## How to Use

### **Via Frontend UI**

1. **Open the Quick Actions Menu**
   - Click the `+` button (bottom-right corner of dashboard)
   - Scroll to "📊 Data Simulator"

2. **Simulation Panel Features**
   - **Risk Score Trend**: Line chart of risk scores over time
   - **SOS Alerts**: Pie chart and list of active alerts
   - **Resource Allocation**: Visual grid of deployed resources
   - **Shelter Capacity**: Bar chart of shelter occupancy
   - **Control Buttons**:
     - 🔄 **Trigger Now**: Run simulation immediately
     - ▶️ **Running/Pause**: Toggle auto-simulation

### **Via API Endpoints**

#### **Get Current Simulation State**
```bash
curl http://localhost:8000/api/simulation/status
```

Response:
```json
{
  "timestamp": "2026-02-27T10:30:45.123456",
  "average_risk_score": 65.3,
  "risk_overview": {
    "Bihar - Patna": {"risk_score": 89, "risk_level": "critical", ...},
    ...
  },
  "sos_alerts": [
    {"case_id": "SOS-20260227...", "severity": "critical", ...},
    ...
  ],
  "resources": {"resources": [...]},
  "shelters": [...]
}
```

#### **Trigger a Simulation Cycle**
```bash
curl -X POST http://localhost:8000/api/simulation/trigger
```

#### **Toggle Automatic Simulation**
```bash
# Enable (default on startup)
curl "http://localhost:8000/api/simulation/toggle?enabled=true"

# Disable auto-simulation
curl "http://localhost:8000/api/simulation/toggle?enabled=false"
```

## WebSocket Events

The simulator broadcasts events to `/ws` and `/ws/updates`:

### **simulation_update**
Comprehensive update with all simulated data:
```json
{
  "type": "simulation_update",
  "timestamp": "2026-02-27T10:30:45.123456",
  "average_risk_score": 65.3,
  "sos_alerts": [...],
  "resource_allocation": {...},
  "shelter_status": [...]
}
```

### **SOS_ALERT**
Individual alert broadcast:
```json
{
  "type": "SOS_ALERT",
  "case_id": "SOS-20260227143045-X4Y9",
  "zone": "Zone C - Coastal Area",
  "severity": "critical",
  "message": "Mudslide detected on hillside",
  "location": {"lat": 28.6321, "lng": 77.2156},
  "timestamp": "2026-02-27T10:30:45.123456"
}
```

## Configuration

The simulator is configured in `backend/services/simulator.py`:

### **Simulation Areas**
18 Indian states/regions are simulated:
```python
INDIAN_AREAS = [
    "Bihar - Patna", "Assam - Guwahati", "Odisha - Bhubaneswar",
    "West Bengal - Kolkata", "Jharkhand - Ranchi", "J&K - Srinagar",
    ...
]
```

### **Frequency**
Default: 2-3 minutes (120-180 seconds)
Change in `main.py` lifespan → `background_simulation_loop()`:
```python
await asyncio.sleep(random.randint(120, 180))  # Change 120 & 180 to desired seconds
```

### **Alert Count**
Default: 1-3 SOS alerts per cycle
In `simulator.py` → `run_simulation_cycle()`:
```python
generate_sos_alerts(count=3)  # Max alerts per cycle
```

## Integration with Existing Modules

The simulated data automatically updates:

| Module | Data Updated | Endpoint |
|--------|-------------|----------|
| **Risk Analysis** | Risk scores, confidence, factors | `/api/analyze` |
| **Weather** | Temperature, humidity, conditions | `/api/weather/{area}` |
| **Resources** | Allocation, availability | `/api/resources` |
| **Shelters** | Occupancy, safety status | `/api/shelters` |
| **SOS** | Active alerts, case histories | `/api/sos/*` |
| **History** | Risk event records | `/api/history` |

## Testing the System

### **Quick Test Flow**

1. **Start Backend**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Open Dashboard**:
   - Navigate to http://localhost:5173
   - Verify WebSocket and data loading

4. **Trigger First Simulation**:
   - Open Quick Actions (+ button)
   - Click "📊 Data Simulator"
   - Click "Trigger Now"
   - Observe data updates in real-time

5. **Enable Auto-Simulation**:
   - Toggle "Running" button
   - Wait 2-3 minutes
   - Observe automatic updates

## Monitoring

### **Backend Logs**
```
✅ Simulation complete — Average Risk: 65.3, SOS Alerts: 2, Shelters: 6
📊 Running simulation cycle...
Broadcasting simulation_update to 4 clients
```

### **WebSocket Activity**
View in browser DevTools:
```javascript
// Open console on /ws connection
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);
  console.log('Received:', msg.type, msg);
});
```

## Advanced Usage

### **Integrate with External System**
```python
# In your custom service
from backend.services.simulator import get_all_simulated_data

data = get_all_simulated_data()
print(data['average_risk_score'])  # Get current simulated data
```

### **Custom Simulation Preset**
Modify `PRESETS` in `SimulationPage.tsx`:
```typescript
{ 
  label: '🌊 Custom Scenario', 
  color: '#00ff00',
  payload: { 
    rainfall: 75, elevation: 30, population_density: 60,
    coastal_distance: 45, historical_index: 55 
  } 
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **No data updates** | Check WebSocket connection in Dev Tools → Network tab |
| **Simulation not running** | Verify backend is on port 8000 (`curl localhost:8000/health`) |
| **Old data showing** | Click "Trigger Now" to force immediate simulation |
| **Frontend shows 0 alerts** | This is normal in early cycles; some cycles generate no alerts |
| **Port 8000 already in use** | `lsof -i :8000` (Mac/Linux) or use different port |

## Performance Notes

- **Backend**: Simulation cycle takes ~50-100ms
- **Processing**: WebSocket broadcasts to all clients in parallel
- **Memory**: ~5MB for storing simulated data
- **Network**: Minimal overhead with event-based broadcasting

## Future Enhancements

- [ ] Custom simulation schedules (cron-based)
- [ ] Replay recorded simulation data
- [ ] Geographic clustering of alerts
- [ ] Machine learning-based data generation
- [ ] Integration with external weather APIs
- [ ] Multi-region simulation coordination

---

**Version**: 1.0.0  
**Last Updated**: February 27, 2026  
**Maintainer**: AquaSynapse Development Team
