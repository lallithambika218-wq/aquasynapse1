import { useState, useEffect } from 'react'

interface WeatherData {
  id: string
  state: string
  temperature: number
  humidity: number
  wind_speed: number
  rainfall: number
  alert_level: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}

export function useWeather(state?: string) {
  const [data, setData] = useState<WeatherData | WeatherData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const url = state ? `/api/weather?state=${state}` : '/api/weather'
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
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

    fetchWeather()
  }, [state])

  return { data, loading, error }
}
