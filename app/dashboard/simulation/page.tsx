"use client"

import { useState, useMemo } from "react"
import { useDashboard } from "../layout"
import { simulationData, stateRisks } from "@/lib/dashboard-store"
import { useKaggleDatasets, useSimulation } from "@/hooks/useKaggle"
import { Activity, TrendingUp, AlertTriangle, Shield, Database, Zap, Download } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"
import { cn } from "@/lib/utils"

const riskColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

export default function SimulationPage() {
  const { t } = useDashboard()
  const [percentage, setPercentage] = useState(20)
  const [selectedScenario, setSelectedScenario] = useState("flood")
  const [selectedDataset, setSelectedDataset] = useState("")
  const [useKaggleData, setUseKaggleData] = useState(false)
  
  // Load Kaggle datasets
  const { datasets, loading: datasetsLoading } = useKaggleDatasets()
  
  // Run simulation with selected dataset
  const { runSimulation, simulating, result: simulationResult, progress } = useSimulation()

  const scenarios = [
    { key: "flood", label: "Flood Scenario", icon: "water" },
    { key: "cyclone", label: "Cyclone Scenario", icon: "wind" },
    { key: "earthquake", label: "Earthquake Scenario", icon: "seismic" },
    { key: "drought", label: "Drought Scenario", icon: "sun" },
  ]

  // Use Kaggle data if available, otherwise use mock data
  const adjustedData = useMemo(() => {
    if (useKaggleData && simulationResult?.simulation) {
      // Transform Kaggle simulation data for charting
      return simulationResult.simulation.originalData.slice(0, 20).map((point, idx) => ({
        time: `${idx + 1}`,
        current: typeof point[Object.keys(point)[1]] === 'number' ? (point[Object.keys(point)[1]] as number) % 100 : 50,
        after: Math.min(100, Math.round((typeof point[Object.keys(point)[1]] === 'number' ? (point[Object.keys(point)[1]] as number) : 50) * (1 + percentage / 100))),
      }))
    }

    return simulationData.map((point) => ({
      ...point,
      after: Math.min(100, Math.round(point.after * (1 + percentage / 100))),
    }))
  }, [percentage, useKaggleData, simulationResult])

  const impactedStates = useMemo(() => {
    return stateRisks.map((state) => ({
      ...state,
      projectedScore: Math.min(100, Math.round(state.riskScore * (1 + percentage / 100))),
    })).sort((a, b) => b.projectedScore - a.projectedScore)
  }, [percentage])

  const barData = impactedStates.slice(0, 8).map((s) => ({
    name: s.abbr,
    current: s.riskScore,
    projected: s.projectedScore,
  }))

  const percentIncrease = percentage > 0 ? `+${percentage}%` : `${percentage}%`

  // Handle Kaggle simulation
  const handleRunKaggleSimulation = async () => {
    if (selectedDataset) {
      await runSimulation(selectedDataset, percentage, selectedScenario)
    }
  }

  // Correlation visualization data
  const correlationData = simulationResult?.correlations 
    ? Object.entries(simulationResult.correlations).map(([name, value]) => ({
        name,
        correlation: Math.round(value * 100),
      }))
    : []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{t.simulation}</h1>
          <p className="text-xs text-muted-foreground">What-if disaster simulation with real-time Kaggle dataset analysis</p>
        </div>
      </div>

      {/* Kaggle Dataset Selector */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Kaggle Datasets</h3>
        </div>
        
        <div className="flex gap-2 items-center flex-wrap mb-3">
          {datasetsLoading ? (
            <p className="text-xs text-muted-foreground">Loading datasets...</p>
          ) : datasets.length > 0 ? (
            <>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">Select a dataset...</option>
                {datasets.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name} ({ds.rows} rows)
                  </option>
                ))}
              </select>

              <button
                onClick={handleRunKaggleSimulation}
                disabled={!selectedDataset || simulating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-semibold border border-primary/30 hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Zap className="w-4 h-4" />
                {simulating ? `Running... ${progress}%` : "Run Simulation"}
              </button>

              <button
                onClick={() => setUseKaggleData(!useKaggleData)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold border transition-colors",
                  useKaggleData
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                )}
              >
                <Download className="w-4 h-4 inline mr-2" />
                {useKaggleData ? "Using Kaggle Data" : "Use Kaggle Data"}
              </button>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No datasets available</p>
          )}
        </div>

        {simulationResult && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="text-[10px] text-muted-foreground">Original Avg</p>
              <p className="text-sm font-bold text-foreground">{simulationResult.simulation.statistics.avgOriginal}</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="text-[10px] text-muted-foreground">Projected Avg</p>
              <p className="text-sm font-bold text-primary">{simulationResult.simulation.statistics.avgProjected}</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="text-[10px] text-muted-foreground">Difference</p>
              <p className="text-sm font-bold" style={{ color: simulationResult.simulation.statistics.difference > 0 ? '#ef4444' : '#22c55e' }}>
                {simulationResult.simulation.statistics.difference > 0 ? '+' : ''}{simulationResult.simulation.statistics.difference}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="text-[10px] text-muted-foreground">Change</p>
              <p className="text-sm font-bold text-warning">{simulationResult.simulation.statistics.percentageChange}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Scenario Selector */}
      <div className="flex gap-2 flex-wrap">
        {scenarios.map((s) => (
          <button
            key={s.key}
            onClick={() => setSelectedScenario(s.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold border transition-all",
              selectedScenario === s.key
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-muted"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Simulation Control */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Disaster Intensity Modifier</h3>
          <span
            className="text-2xl font-bold"
            style={{
              color: percentage >= 20 ? "#ef4444" : percentage >= 10 ? "#f59e0b" : "#22c55e",
            }}
          >
            {percentIncrease}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={30}
          value={percentage}
          onChange={(e) => setPercentage(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer mb-4"
          style={{
            background: `linear-gradient(to right, #00d4aa 0%, #f59e0b 50%, #ef4444 ${(percentage / 30) * 100}%, #1e293b ${(percentage / 30) * 100}%)`,
          }}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0% (Current State)</span>
          <span>+15% (Moderate)</span>
          <span>+30% (Severe)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Projection Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">{t.riskProjection}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="text-[10px] text-muted-foreground">{t.current}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                <span className="text-[10px] text-muted-foreground">{t.after} {percentIncrease}</span>
              </div>
            </div>
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300} minWidth={100} minHeight={100}>
              <AreaChart data={adjustedData}>
                <defs>
                  <linearGradient id="simCurrentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="simAfterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#1e293b" }} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f1823", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="current" stroke="#22c55e" strokeWidth={2} fill="url(#simCurrentGrad)" dot={{ r: 4, fill: "#22c55e" }} />
                <Area type="monotone" dataKey="after" stroke="#ef4444" strokeWidth={2} fill="url(#simAfterGrad)" dot={{ r: 4, fill: "#ef4444" }} strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Impact Comparison */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">State Impact Comparison (Top 8)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300} minWidth={100} minHeight={100}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "#1e293b" }} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f1823", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="current" fill="#22c55e" radius={[4, 4, 0, 0]} name="Current" />
                <Bar dataKey="projected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Projected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Correlation Analysis Chart */}
      {correlationData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Factor Correlations (Kaggle Analysis)</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height={250} minWidth={100} minHeight={100}>
              <BarChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b", angle: -45, textAnchor: "end", height: 80 }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f1823", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="correlation" fill="#00d4aa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Impacted States Table */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">All State Projections</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 text-muted-foreground font-medium">State</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Current Score</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Projected Score</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Change</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {impactedStates.map((state) => {
                const projectedLevel = state.projectedScore >= 75 ? "critical" : state.projectedScore >= 50 ? "high" : state.projectedScore >= 25 ? "medium" : "low"
                const change = state.projectedScore - state.riskScore
                return (
                  <tr key={state.name} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 text-foreground font-medium">{state.name}</td>
                    <td className="py-2.5 text-center" style={{ color: riskColors[state.riskLevel] }}>{state.riskScore}</td>
                    <td className="py-2.5 text-center font-bold" style={{ color: riskColors[projectedLevel] }}>{state.projectedScore}</td>
                    <td className="py-2.5 text-center text-destructive">+{change}</td>
                    <td className="py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize" style={{ backgroundColor: `${riskColors[projectedLevel]}20`, color: riskColors[projectedLevel] }}>
                        {projectedLevel}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
