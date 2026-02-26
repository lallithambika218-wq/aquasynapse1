import { useState, useEffect } from 'react'

interface ActionPlan {
  id: string
  title: string
  description: string
  state: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  created_by: string | null
  created_at: string
}

export function useActionPlans(status?: string, priority?: string, state?: string) {
  const [data, setData] = useState<ActionPlan[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActionPlans = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (priority) params.append('priority', priority)
        if (state) params.append('state', state)

        const url = `/api/action-plans${params.size > 0 ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch action plans')
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

    fetchActionPlans()
  }, [status, priority, state])

  return { data, loading, error }
}
