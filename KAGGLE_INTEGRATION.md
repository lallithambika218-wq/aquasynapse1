# Kaggle Integration Guide

## Overview
AquaSynapse now includes real-time simulation capabilities powered by Kaggle datasets. This allows you to run disaster simulations using real-world data.

## Features

### 1. **Dataset Selection**
- Browse available Kaggle datasets
- Select datasets based on your analysis needs
- Currently available datasets:
  - Indian Weather Data 2020-2022 (3,650 rows)
  - India Disaster Cases (1,200 rows)
  - Extreme Weather Events (5,000 rows)

### 2. **Real-Time Simulation**
- Run simulations with selected datasets
- Adjust disaster intensity modifier (0-30%)
- Choose disaster scenarios (Flood, Cyclone, Earthquake, Drought)
- Real-time progress tracking

### 3. **Advanced Analysis**
- Compare original vs. projected data
- View factor correlations
- Analyze state-level impact projections
- Export simulation results

## Setup

### Installation (Optional - For Real Kaggle API)
If you want to connect real Kaggle API:

1. Install Kaggle Python package:
```bash
pip install kaggle
```

2. Get your API credentials from Kaggle:
   - Go to https://www.kaggle.com/settings/account
   - Click "Create New API Token"
   - Place `kaggle.json` in `~/.kaggle/`

3. Set environment variables:
```env
KAGGLE_API_KEY=your_api_key
KAGGLE_USERNAME=your_username
NEXT_PUBLIC_KAGGLE_ENABLED=true
```

### Mock Data (Default)
The system comes with built-in mock data generators for:
- Weather simulations
- Disaster impact modeling
- Population risk analysis
- Resource allocation patterns

## Usage

### Running a Simulation

1. Navigate to Dashboard → Simulation
2. Select a Kaggle dataset from the dropdown
3. Click "Run Simulation"
4. Adjust the disaster intensity slider (0-30%)
5. Select your scenario type
6. Toggle "Use Kaggle Data" to apply real data to calculations

### Understanding Results

**Simulation Statistics:**
- **Original Avg**: Average value from raw dataset
- **Projected Avg**: Forecasted value after disaster impact
- **Difference**: Absolute change in values
- **Change %**: Percentage change relative to original

**Correlation Analysis:**
- Shows relationship between weather factors and disaster severity
- Values range from 0 (no correlation) to 1 (perfect correlation)

## API Endpoints

### Fetch Available Datasets
```
GET /api/datasets
```

Response:
```json
{
  "success": true,
  "datasets": [...],
  "count": 3
}
```

### Fetch Specific Dataset
```
GET /api/datasets?action=fetch&datasetId=indian-weather-2020-2022
```

### Run Simulation
```
POST /api/simulate
Content-Type: application/json

{
  "datasetId": "indian-weather-2020-2022",
  "percentage": 20,
  "scenario": "flood"
}
```

Response:
```json
{
  "success": true,
  "simulation": {
    "originalData": [...],
    "projectedData": [...],
    "statistics": {
      "avgOriginal": 35.5,
      "avgProjected": 42.6,
      "difference": 7.1,
      "percentageChange": 20
    }
  },
  "correlations": {
    "Temperature-Impact": 0.75,
    "Rainfall-Severity": 0.85,
    ...
  }
}
```

## Scenario Multipliers

Each scenario applies different multipliers to data points:

### Flood Scenario
- Rainfall: 2.5x
- Wind Speed: 1.3x
- Affected Population: 1.8x

### Cyclone Scenario
- Wind Speed: 3.0x
- Rainfall: 2.0x
- Duration: 2.0x

### Earthquake Scenario
- Magnitude: 1.5x
- Affected Population: 1.6x
- Casualties: 2.0x

### Drought Scenario
- Temperature: 1.3x
- Rainfall: 0.1x (reduction)
- Duration: 5.0x

## Data Privacy & Security

- Mock data is generated locally
- Real Kaggle API access requires authentication
- All analysis is performed on-server
- No data is stored permanently

## Future Enhancements

- [ ] Real-time Kaggle API integration
- [ ] Custom dataset uploads
- [ ] Historical simulation comparisons
- [ ] Machine learning predictions
- [ ] Automated alert generation
- [ ] Dataset caching for faster loads

## Troubleshooting

**Issue: "No datasets available"**
- Check if `/api/datasets` endpoint is accessible
- Verify server is running
- Clear browser cache

**Issue: Simulation running slow**
- Reduce dataset size selection
- Check server logs for performance issues
- Consider splitting large datasets

**Issue: Missing data in results**
- Ensure dataset is properly formatted
- Check console for errors
- Verify data types match expected schema

## Contact & Support
For issues or feature requests, please contact the AquaSynapse team.
