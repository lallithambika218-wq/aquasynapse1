import { useState, useEffect } from 'react'

interface Resource {
  id: string
  name: string
  category: string
  total_quantity: number
  current_quantity: number
  location: string
  status: 'available' | 'deployed' | 'maintenance' | 'unavailable'
  created_at: string
}

export function useResources(category?: string, status?: string) {
  const [data, setData] = useState<Resource[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (category) params.append('category', category)
        if (status) params.append('status', status)

        const url = `/api/resources${params.size > 0 ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch resources')
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

    fetchResources()
  }, [category, status])

  return { data, loading, error }
}
