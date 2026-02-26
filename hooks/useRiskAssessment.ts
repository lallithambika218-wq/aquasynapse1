import { useState, useEffect } from 'react'

interface RiskAssessment {
  id: string
  state: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  confidence_level: number
  analysis_text: string
  created_by: string | null
  created_at: string
}

export function useRiskAssessment(state?: string) {
  const [data, setData] = useState<RiskAssessment | RiskAssessment[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRiskAssessment = async () => {
      try {
        setLoading(true)
        const url = state ? `/api/analyze?state=${state}` : '/api/analyze'
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch risk assessment')
        }

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRiskAssessment()
  }, [state])

  return { data, loading, error }
}
