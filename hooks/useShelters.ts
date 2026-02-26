import { useState, useEffect } from 'react'

interface Coordinates {
  lat: number
  lng: number
}

interface Shelter {
  id: string
  name: string
  location: string
  state: string
  capacity: number
  current_occupancy: number
  status: 'operational' | 'full' | 'closed'
  coordinates: Coordinates
  created_at: string
}

export function useShelters(state?: string, status?: string) {
  const [data, setData] = useState<Shelter[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (state) params.append('state', state)
        if (status) params.append('status', status)

        const url = `/api/shelters${params.size > 0 ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch shelters')
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

    fetchShelters()
  }, [state, status])

  return { data, loading, error }
}
