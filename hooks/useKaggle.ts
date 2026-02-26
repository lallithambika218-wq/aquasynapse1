import { useState, useEffect, useCallback } from 'react'
import type { KaggleDataset, DataPoint } from '@/lib/kaggle-service'

interface SimulationResult {
  originalData: DataPoint[]
  projectedData: DataPoint[]
  statistics: {
    avgOriginal: number
    avgProjected: number
    difference: number
    percentageChange: number
  }
}

interface SimulationResponse {
  success: boolean
  simulation: SimulationResult
  correlations: Record<string, number>
  timestamp: string
}

export function useKaggleDatasets() {
  const [datasets, setDatasets] = useState<KaggleDataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/datasets')
        const data = await response.json()
        
        if (data.success) {
          setDatasets(data.datasets)
          setError(null)
        } else {
          setError(data.error || 'Failed to fetch datasets')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  return { datasets, loading, error }
}

export function useKaggleDataset(datasetId: string) {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDataset = useCallback(async () => {
    if (!datasetId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/datasets?action=fetch&datasetId=${datasetId}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch dataset')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [datasetId])

  return { data, loading, error, fetchDataset }
}

export function useSimulation() {
  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState<SimulationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const runSimulation = useCallback(
    async (datasetId: string, percentage: number, scenario: string) => {
      try {
        setSimulating(true)
        setError(null)
        setProgress(0)

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const next = prev + Math.random() * 30
            return Math.min(next, 90)
          })
        }, 300)

        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ datasetId, percentage, scenario }),
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          throw new Error('Simulation failed')
        }

        const data: SimulationResponse = await response.json()
        setResult(data)
        setProgress(100)

        // Reset progress after a delay
        setTimeout(() => setProgress(0), 1000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Simulation failed')
        setProgress(0)
      } finally {
        setSimulating(false)
      }
    },
    []
  )

  return { runSimulation, simulating, result, error, progress }
}

export function useRealTimeSimulation(datasetId: string, percentage: number, scenario: string) {
  const [data, setData] = useState<SimulationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!datasetId) return

    const runSim = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ datasetId, percentage, scenario }),
        })

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    // Run simulation on mount and when dependencies change
    const timeout = setTimeout(() => {
      runSim()
    }, 500)

    return () => clearTimeout(timeout)
  }, [datasetId, percentage, scenario])

  return { data, loading, error }
}
