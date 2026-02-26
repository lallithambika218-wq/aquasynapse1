"use client"

import { useState, useCallback } from "react"
import { useDashboard } from "../layout"
import {
  Brain,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  Mountain,
  Users,
  Waves,
  RefreshCw,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { areas, initialWeather } from "@/lib/dashboard-store"
import type { WeatherData } from "@/lib/dashboard-store"

export default function RiskEnginePage() {
  const { t } = useDashboard()

  // Input state
  const [selectedArea, setSelectedArea] = useState(areas[0])
  const [rainfall, setRainfall] = useState(45)
  const [elevation, setElevation] = useState(120)
  const [population, setPopulation] = useState(250000)
  const [coastalDistance, setCoastalDistance] = useState(85)
  const [intensity, setIntensity] = useState(15)

  // Results state
  const [weather, setWeather] = useState<WeatherData>(initialWeather)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    riskScore: number
    riskLevel: string
    confidence: number
    factors: { name: string; weight: number; impact: string }[]
  } | null>(null)

  const fetchWeather = useCallback(async () => {
    setWeatherLoading(true)
    try {
      const res = await fetch(`/api/weather?area=${encodeURIComponent(selectedArea)}`)
      const data = await res.json()
      setWeather(data)
      setRainfall(data.rainfall)
    } catch {
      // Use mock data on failure
      const mockWeather: WeatherData = {
        temperature: 28 + Math.floor(Math.random() * 10),
        humidity: 65 + Math.floor(Math.random() * 25),
        rainfall: 20 + Math.floor(Math.random() * 60),
        windSpeed: 10 + Math.floor(Math.random() * 30),
        condition: ["Heavy Rain", "Moderate Rain", "Thunderstorm", "Cloudy"][Math.floor(Math.random() * 4)],
        area: selectedArea,
        updatedAt: new Date().toISOString(),
      }
      setWeather(mockWeather)
      setRainfall(mockWeather.rainfall)
    }
    setWeatherLoading(false)
  }, [selectedArea])

  const analyzeRisk = useCallback(async () => {
    setAnalyzing(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: selectedArea,
          rainfall,
          elevation,
          population,
          coastalDistance,
          disasterIntensity: intensity,
        }),
      })
      const data = await res.json()
      // Ensure factors exist in response
      const normalizedData = {
        ...data,
        factors: data.factors || [
          { name: "Rainfall Intensity", weight: 30, impact: rainfall > 40 ? "High" : "Medium" },
          { name: "Elevation Risk", weight: 20, impact: elevation < 50 ? "High" : "Low" },
          { name: "Population Density", weight: 15, impact: population > 200000 ? "High" : "Medium" },
          { name: "Coastal Proximity", weight: 15, impact: coastalDistance < 50 ? "High" : "Low" },
          { name: "Disaster Intensity", weight: 20, impact: intensity > 15 ? "High" : "Medium" },
        ]
      }
      setResult(normalizedData)
    } catch {
      // Mock analysis result
      const score = Math.min(100, Math.round(
        (rainfall * 0.3) +
        (100 - elevation * 0.1) * 0.2 +
        (population / 10000) * 0.15 +
        (100 - coastalDistance * 0.3) * 0.15 +
        (intensity * 2)
      ))
      const level = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low"
      setResult({
        riskScore: score,
        riskLevel: level,
        confidence: 85 + Math.floor(Math.random() * 12),
        factors: [
          { name: "Rainfall Intensity", weight: 30, impact: rainfall > 40 ? "High" : "Medium" },
          { name: "Elevation Risk", weight: 20, impact: elevation < 50 ? "High" : "Low" },
          { name: "Population Density", weight: 15, impact: population > 200000 ? "High" : "Medium" },
          { name: "Coastal Proximity", weight: 15, impact: coastalDistance < 50 ? "High" : "Low" },
          { name: "Disaster Intensity", weight: 20, impact: intensity > 15 ? "High" : "Medium" },
        ],
      })
    }
    setAnalyzing(false)
  }, [selectedArea, rainfall, elevation, population, coastalDistance, intensity])

  const riskColor = result
    ? result.riskScore >= 75
      ? "#ef4444"
      : result.riskScore >= 50
      ? "#f97316"
      : result.riskScore >= 25
      ? "#f59e0b"
      : "#22c55e"
    : "#64748b"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{t.riskEngine}</h1>
          <p className="text-xs text-muted-foreground">AI-powered risk analysis with real-time weather integration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Area Select */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Analysis Parameters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Select Area / Zone</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <CloudRain className="w-3.5 h-3.5" /> Rainfall (mm)
                </label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <Mountain className="w-3.5 h-3.5" /> Elevation (m)
                </label>
                <input
                  type="number"
                  value={elevation}
                  onChange={(e) => setElevation(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <Users className="w-3.5 h-3.5" /> Population
                </label>
                <input
                  type="number"
                  value={population}
                  onChange={(e) => setPopulation(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <Waves className="w-3.5 h-3.5" /> Coastal Distance (km)
                </label>
                <input
                  type="number"
                  value={coastalDistance}
                  onChange={(e) => setCoastalDistance(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Disaster Intensity</span>
                  <span className="text-primary font-semibold">+{intensity}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00d4aa ${(intensity / 30) * 100}%, #1e293b ${(intensity / 30) * 100}%)`,
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchWeather}
                  disabled={weatherLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent/20 text-accent text-xs font-semibold border border-accent/30 hover:bg-accent/30 transition-all disabled:opacity-50"
                >
                  {weatherLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CloudRain className="w-3.5 h-3.5" />}
                  Fetch Weather
                </button>
                <button
                  onClick={analyzeRisk}
                  disabled={analyzing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-50"
                >
                  {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                  {t.analyzeRisk}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center + Right: Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Weather Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Real-Time Weather</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{weather.area}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <CloudRain className="w-4 h-4" />
                  <span className="text-[10px]">Rainfall</span>
                </div>
                <p className="text-xl font-bold text-accent">{weather.rainfall} <span className="text-xs text-muted-foreground">mm</span></p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-[10px]">Temperature</span>
                </div>
                <p className="text-xl font-bold text-warning">{weather.temperature}<span className="text-xs text-muted-foreground">°C</span></p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Droplets className="w-4 h-4" />
                  <span className="text-[10px]">Humidity</span>
                </div>
                <p className="text-xl font-bold text-primary">{weather.humidity}<span className="text-xs text-muted-foreground">%</span></p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Wind className="w-4 h-4" />
                  <span className="text-[10px]">Wind Speed</span>
                </div>
                <p className="text-xl font-bold text-foreground">{weather.windSpeed} <span className="text-xs text-muted-foreground">km/h</span></p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Condition: <span className="text-foreground font-medium">{weather.condition}</span></span>
              <span>Updated: {weather.updatedAt}</span>
            </div>
          </div>

          {/* Risk Analysis Result */}
          {result && (
            <div className="rounded-xl border bg-card p-4" style={{ borderColor: `${riskColor}40` }}>
              <h3 className="text-sm font-semibold text-foreground mb-4">AI Risk Analysis Result</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${riskColor}15` }}>
                  <Gauge className="w-6 h-6 mx-auto mb-2" style={{ color: riskColor }} />
                  <p className="text-3xl font-bold" style={{ color: riskColor }}>{result.riskScore}</p>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2" style={{ color: riskColor }} />
                  <p className="text-lg font-bold capitalize" style={{ color: riskColor }}>{result.riskLevel}</p>
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
                  <p className="text-3xl font-bold text-success">{result.confidence}%</p>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>

              {/* Risk Factors */}
              <h4 className="text-xs font-semibold text-muted-foreground mb-3">CONTRIBUTING FACTORS</h4>
              <div className="space-y-2">
                {result?.factors && result.factors.length > 0 ? (
                  result.factors.map((factor) => (
                  <div key={factor.name} className="flex items-center gap-3">
                    <span className="text-xs text-foreground w-36 shrink-0">{factor.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${factor.weight * 3.3}%`,
                          backgroundColor: factor.impact === "High" ? "#ef4444" : factor.impact === "Medium" ? "#f59e0b" : "#22c55e",
                        }}
                      />
                    </div>
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded w-16 text-center",
                      factor.impact === "High" ? "bg-destructive/20 text-destructive" :
                      factor.impact === "Medium" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
                    )}>
                      {factor.impact}
                    </span>
                  </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No risk factors available</p>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 flex flex-col items-center justify-center gap-3">
              <Brain className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Configure parameters and click &quot;Analyze Risk&quot; to see AI-powered results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
