"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import type { SimulationPoint } from "@/lib/dashboard-store"

interface WhatIfSimulationProps {
  simulationPercentage: number
  onPercentageChange: (value: number) => void
  data: SimulationPoint[]
  t: Record<string, string>
}

export function WhatIfSimulation({
  simulationPercentage,
  onPercentageChange,
  data,
  t,
}: WhatIfSimulationProps) {
  const adjustedData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      after: Math.min(100, Math.round(point.after * (1 + simulationPercentage / 100))),
    }))
  }, [data, simulationPercentage])

  const maxAfter = Math.max(...adjustedData.map((d) => d.after))
  const percentIncrease = simulationPercentage > 0 ? `+${simulationPercentage}%` : `${simulationPercentage}%`

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{t.whatIfSimulation}</h3>
        <span
          className="text-lg font-bold"
          style={{
            color: simulationPercentage >= 15 ? "#ef4444" : simulationPercentage >= 5 ? "#f59e0b" : "#22c55e",
          }}
        >
          {percentIncrease}
        </span>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{t.riskProjection}</span>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-[10px] text-muted-foreground">{t.current}</span>
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-[10px] text-muted-foreground">{t.after} {percentIncrease}</span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          value={simulationPercentage}
          onChange={(e) => onPercentageChange(parseInt(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00d4aa ${(simulationPercentage / 30) * 100}%, #1e293b ${(simulationPercentage / 30) * 100}%)`,
          }}
        />
      </div>

      {/* Chart */}
      <div className="-mx-2" style={{ width: "calc(100% + 16px)", height: 150 }}>
        <ResponsiveContainer width="100%" height={150} minWidth={100} minHeight={100}>
          <AreaChart data={adjustedData}>
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="afterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              domain={[50, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f1823",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#currentGrad)"
              dot={{ r: 3, fill: "#22c55e" }}
            />
            <Area
              type="monotone"
              dataKey="after"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#afterGrad)"
              dot={{ r: 3, fill: "#ef4444" }}
              strokeDasharray="5 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
