import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, Play, Pause, RefreshCw, Zap } from 'lucide-react'

interface SimulationData {
  timestamp: string
  average_risk_score: number
  sos_alerts: Array<{
    case_id: string
    zone: string
    severity: string
    message: string
    latitude: number
    longitude: number
  }>
  resource_allocation: any
  shelter_status: Array<{
    id: string
    name: string
    current_occupancy: number
    capacity: number
    safety: string
  }>
}

export const SimulationPanel: React.FC = () => {
  const [simData, setSimData] = useState<SimulationData | null>(null)
  const [isRunning, setIsRunning] = useState(true)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Array<{ timestamp: string; risk: number }>>([])

  // Fetch simulation data
  const fetchSimData = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/simulation/status')
      const data = await res.json()
      setSimData(data)
      
      // Add to history
      setHistory(prev => [...prev.slice(-19), { 
        timestamp: new Date().toLocaleTimeString(), 
        risk: data.average_risk_score 
      }])
    } catch (error) {
      console.error('Failed to fetch simulation data:', error)
    }
  }

  // Trigger manual simulation
  const triggerSimulation = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/simulation/trigger', { method: 'POST' })
      const data = await res.json()
      setSimData(data.data)
      setHistory(prev => [...prev.slice(-19), { 
        timestamp: new Date().toLocaleTimeString(), 
        risk: data.data.average_risk_score 
      }])
    } catch (error) {
      console.error('Failed to trigger simulation:', error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle simulation
  const toggleSimulation = async () => {
    try {
      await fetch(`http://localhost:8000/api/simulation/toggle?enabled=${!isRunning}`, { method: 'GET' })
      setIsRunning(!isRunning)
    } catch (error) {
      console.error('Failed to toggle simulation:', error)
    }
  }

  // Initial fetch and WebSocket subscription
  useEffect(() => {
    fetchSimData()

    const ws = new WebSocket('ws://localhost:8000/ws/updates')
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === 'simulation_update') {
          setSimData(prev => prev ? {
            ...prev,
            average_risk_score: message.average_risk_score,
            sos_alerts: message.sos_alerts,
            resource_allocation: message.resource_allocation,
            shelter_status: message.shelter_status,
            timestamp: message.timestamp,
          } : null)
          setHistory(prev => [...prev.slice(-19), {
            timestamp: new Date().toLocaleTimeString(),
            risk: message.average_risk_score
          }])
        }
      } catch { }
    }

    return () => ws.close()
  }, [])

  if (!simData) return <div className="p-4 text-gray-500">Loading simulation data...</div>

  const sosData = [
    { name: 'Critical', value: simData.sos_alerts.filter(a => a.severity === 'critical').length, fill: '#dc2626' },
    { name: 'High', value: simData.sos_alerts.filter(a => a.severity === 'high').length, fill: '#f97316' },
    { name: 'Medium', value: simData.sos_alerts.filter(a => a.severity === 'medium').length, fill: '#eab308' },
    { name: 'Low', value: simData.sos_alerts.filter(a => a.severity === 'low').length, fill: '#22c55e' },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">Data Simulation Control</h2>
            <p className="text-sm opacity-90">Auto-updates every 2-3 minutes</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{simData.average_risk_score.toFixed(1)}</p>
          <p className="text-sm opacity-90">Avg Risk Score</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={triggerSimulation}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          Trigger Now
        </button>
        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Running
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Paused
            </>
          )}
        </button>
      </div>

      {/* Risk Score Trend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-4">Risk Score Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SOS Alerts Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-4">SOS Alerts by Severity ({simData.sos_alerts.length})</h3>
          {sosData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No SOS alerts active</p>
          )}
        </div>

        {/* Active SOS Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-4">Active SOS Alerts</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {simData.sos_alerts.length > 0 ? (
              simData.sos_alerts.map(alert => (
                <div key={alert.case_id} className="p-2 bg-gray-50 rounded border-l-4 border-red-500 text-sm">
                  <p className="font-semibold">{alert.case_id}</p>
                  <p className="text-gray-600">{alert.zone} - {alert.severity.toUpperCase()}</p>
                  <p className="text-gray-500 text-xs">{alert.message}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-4">Resource Allocation</h3>
        {simData.resource_allocation?.resources?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {simData.resource_allocation.resources.map((res: any) => (
              <div key={res.name} className="p-3 bg-gray-50 rounded text-center">
                <p className="text-2xl">{res.icon}</p>
                <p className="font-semibold text-sm">{res.current}/{res.total}</p>
                <p className="text-xs text-gray-600">{res.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No resource data available</p>
        )}
      </div>

      {/* Shelter Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-4">Shelter Capacity</h3>
        {simData.shelter_status?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={simData.shelter_status}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current_occupancy" fill="#3b82f6" name="Current" />
              <Bar dataKey="capacity" fill="#10b981" name="Capacity" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No shelter data available</p>
        )}
      </div>

      {/* Update Info */}
      <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600">
        <p>Last update: {new Date(simData.timestamp).toLocaleString()}</p>
        <p>Status: {isRunning ? '🟢 Running (updates every 2-3 min)' : '🔴 Paused'}</p>
      </div>
    </div>
  )
}
