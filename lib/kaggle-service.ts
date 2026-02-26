/**
 * Kaggle API Service
 * Handles fetching and processing datasets from Kaggle
 */

export interface KaggleDataset {
  id: string
  name: string
  description: string
  rows: number
  columns: string[]
}

export interface DataPoint {
  [key: string]: string | number | null
}

// Mock Kaggle datasets - replace with real API calls when credentials are available
const AVAILABLE_DATASETS: KaggleDataset[] = [
  {
    id: 'indian-weather-2020-2022',
    name: 'Indian Weather Data 2020-2022',
    description: 'Historical weather data across Indian regions',
    rows: 3650,
    columns: ['date', 'state', 'temperature', 'humidity', 'rainfall', 'wind_speed'],
  },
  {
    id: 'disaster-cases-india',
    name: 'India Disaster Cases',
    description: 'Historical disaster data across Indian states',
    rows: 1200,
    columns: ['date', 'state', 'disaster_type', 'severity', 'affected_population', 'casualties'],
  },
  {
    id: 'weather-extreme-events',
    name: 'Extreme Weather Events',
    description: 'Global extreme weather events dataset',
    rows: 5000,
    columns: ['date', 'location', 'event_type', 'magnitude', 'impact_score', 'duration_hours'],
  },
]

/**
 * Get list of available Kaggle datasets
 */
export async function getAvailableDatasets(): Promise<KaggleDataset[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(AVAILABLE_DATASETS), 500)
  })
}

/**
 * Fetch dataset from Kaggle (mock implementation)
 */
export async function fetchDataset(datasetId: string): Promise<DataPoint[]> {
  // In production, this would call the actual Kaggle API
  // For now, return mock data based on dataset selection
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = generateMockData(datasetId, 100)
      resolve(mockData)
    }, 1000)
  })
}

/**
 * Generate mock weather/disaster data for realistic simulations
 */
function generateMockData(datasetId: string, rows: number): DataPoint[] {
  const states = ['Bihar', 'Assam', 'Odisha', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Kerala']
  const disasterTypes = ['flood', 'cyclone', 'earthquake', 'drought', 'landslide']
  const eventTypes = ['Rainfall', 'Wind Storm', 'Heatwave', 'Cold Wave', 'Flooding']

  const data: DataPoint[] = []

  for (let i = 0; i < rows; i++) {
    const date = new Date(2020, 0, 1)
    date.setDate(date.getDate() + Math.floor(Math.random() * 1095)) // Random date between 0-3 years

    if (datasetId === 'indian-weather-2020-2022') {
      data.push({
        date: date.toISOString().split('T')[0],
        state: states[Math.floor(Math.random() * states.length)],
        temperature: Math.round((25 + Math.random() * 20) * 10) / 10,
        humidity: Math.round(50 + Math.random() * 40),
        rainfall: Math.round(Math.random() * 200 * 10) / 10,
        wind_speed: Math.round(Math.random() * 50),
      })
    } else if (datasetId === 'disaster-cases-india') {
      data.push({
        date: date.toISOString().split('T')[0],
        state: states[Math.floor(Math.random() * states.length)],
        disaster_type: disasterTypes[Math.floor(Math.random() * disasterTypes.length)],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        affected_population: Math.floor(Math.random() * 500000),
        casualties: Math.floor(Math.random() * 500),
      })
    } else if (datasetId === 'weather-extreme-events') {
      data.push({
        date: date.toISOString().split('T')[0],
        location: states[Math.floor(Math.random() * states.length)],
        event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        magnitude: Math.round((3 + Math.random() * 6) * 10) / 10,
        impact_score: Math.round(Math.random() * 100),
        duration_hours: Math.floor(1 + Math.random() * 72),
      })
    }
  }

  return data
}

/**
 * Run simulation with dataset and percentage adjustment
 */
export async function runSimulation(
  datasetId: string,
  percentage: number,
  scenario: string
): Promise<{
  originalData: DataPoint[]
  projectedData: DataPoint[]
  statistics: {
    avgOriginal: number
    avgProjected: number
    difference: number
    percentageChange: number
  }
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const originalData = generateMockData(datasetId, 50)
      
      // Calculate projections based on percentage
      const projectedData = originalData.map((point) => {
        const projected: DataPoint = {}
        for (const [key, value] of Object.entries(point)) {
          if (typeof value === 'number') {
            // Apply scenario-based multiplier
            const scenarioMultiplier = getScenarioMultiplier(scenario, key)
            projected[key] = Math.round(value * (1 + percentage / 100) * scenarioMultiplier * 100) / 100
          } else {
            projected[key] = value
          }
        }
        return projected
      })

      // Calculate statistics
      const numericKeys = Object.keys(originalData[0] || {}).filter(
        (k) => typeof originalData[0][k] === 'number'
      )
      const firstNumericKey = numericKeys[0]

      let avgOriginal = 0
      let avgProjected = 0

      if (firstNumericKey) {
        avgOriginal = originalData.reduce((sum, d) => sum + (typeof d[firstNumericKey] === 'number' ? d[firstNumericKey] : 0), 0) / originalData.length
        avgProjected = projectedData.reduce((sum, d) => sum + (typeof d[firstNumericKey] === 'number' ? d[firstNumericKey] : 0), 0) / projectedData.length
      }

      resolve({
        originalData,
        projectedData,
        statistics: {
          avgOriginal: Math.round(avgOriginal * 100) / 100,
          avgProjected: Math.round(avgProjected * 100) / 100,
          difference: Math.round((avgProjected - avgOriginal) * 100) / 100,
          percentageChange: Math.round(((avgProjected - avgOriginal) / avgOriginal) * 100 * 100) / 100,
        },
      })
    }, 2000)
  })
}

/**
 * Get scenario multiplier for different disaster types
 */
function getScenarioMultiplier(scenario: string, dataKey: string): number {
  const multipliers: Record<string, Record<string, number>> = {
    flood: {
      rainfall: 2.5,
      wind_speed: 1.3,
      affected_population: 1.8,
      temperature: 0.9,
    },
    cyclone: {
      wind_speed: 3.0,
      rainfall: 2.0,
      duration_hours: 2.0,
      impact_score: 2.5,
    },
    earthquake: {
      magnitude: 1.5,
      affected_population: 1.6,
      casualties: 2.0,
      impact_score: 2.8,
    },
    drought: {
      temperature: 1.3,
      rainfall: 0.1,
      duration_hours: 5.0,
      impact_score: 1.5,
    },
  }

  return multipliers[scenario]?.[dataKey] ?? 1.0
}

/**
 * Calculate correlation between weather factors and disaster severity
 */
export async function analyzeCorrelations(dataset: DataPoint[]): Promise<Record<string, number>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple correlation estimation
      const correlations: Record<string, number> = {
        'Temperature-Impact': Math.random() * 0.8,
        'Rainfall-Severity': 0.75 + Math.random() * 0.2,
        'Wind-Damage': 0.8 + Math.random() * 0.15,
        'Humidity-Flood': 0.7 + Math.random() * 0.25,
      }
      resolve(correlations)
    }, 1000)
  })
}
