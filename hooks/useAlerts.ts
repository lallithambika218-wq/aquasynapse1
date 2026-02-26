import { useState, useEffect } from 'react'

interface Alert {
  id: string
  title: string
  description: string
  location: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  alert_type: string
  status: 'active' | 'acknowledged' | 'resolved'
  created_by: string | null
  created_at: string
}

export function useAlerts(status?: string, severity?: string) {
  const [data, setData] = useState<Alert[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (severity) params.append('severity', severity)

        const url = `/api/alerts${params.size > 0 ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch alerts')
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

    fetchAlerts()
  }, [status, severity])

  return { data, loading, error }
}
