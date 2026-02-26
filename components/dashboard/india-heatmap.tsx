"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { StateRisk } from "@/lib/dashboard-store"

interface IndiaHeatmapProps {
  states: StateRisk[]
  selectedState: string | null
  onStateSelect: (state: string) => void
  t: Record<string, string>
}

const riskColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

const riskBgColors: Record<string, string> = {
  low: "bg-success/20",
  medium: "bg-warning/20",
  high: "bg-[#f97316]/20",
  critical: "bg-destructive/20",
}

export function IndiaHeatmap({ states, selectedState, onStateSelect, t }: IndiaHeatmapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent, stateName: string) => {
    const rect = e.currentTarget.closest(".heatmap-container")?.getBoundingClientRect()
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 60,
      })
    }
    setHoveredState(stateName)
  }

  const hoveredStateData = states.find((s) => s.name === hoveredState)

  return (
    <div className="rounded-xl border border-border bg-card p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{t.indiaRiskHeatmap}</h3>
        <div className="flex items-center gap-4">
          {(["low", "medium", "high", "critical"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: riskColors[level] }}
              />
              <span className="text-[10px] text-muted-foreground capitalize">{t[level]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="heatmap-container relative w-full" style={{ aspectRatio: "1 / 1", maxHeight: "400px" }}>
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* India outline approximation using SVG */}
        <svg viewBox="0 0 100 85" className="absolute inset-0 w-full h-full opacity-10">
          <path
            d="M 30 5 Q 25 8 22 15 Q 18 22 15 30 Q 12 38 10 45 Q 12 52 15 58 Q 18 62 20 68 Q 22 72 25 75 Q 28 78 32 78 Q 35 76 38 72 Q 40 68 42 65 Q 45 60 48 55 Q 52 50 55 48 Q 58 45 62 42 Q 65 38 68 35 Q 72 30 75 25 Q 78 22 80 18 Q 78 15 75 12 Q 70 10 65 8 Q 58 5 50 4 Q 42 3 35 4 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>

        {/* State markers */}
        {states.map((state) => {
          const isSelected = selectedState === state.name
          const isHovered = hoveredState === state.name
          const color = riskColors[state.riskLevel]

          return (
            <button
              key={state.name}
              onClick={() => onStateSelect(state.name)}
              onMouseEnter={(e) => handleMouseMove(e, state.name)}
              onMouseMove={(e) => handleMouseMove(e, state.name)}
              onMouseLeave={() => setHoveredState(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${state.x}%`,
                top: `${state.y}%`,
              }}
            >
              {/* Pulse ring for critical */}
              {state.riskLevel === "critical" && (
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{
                    backgroundColor: color,
                    width: "28px",
                    height: "28px",
                    margin: "-6px",
                  }}
                />
              )}

              {/* Marker */}
              <span
                className={cn(
                  "relative flex items-center justify-center rounded-full transition-all duration-200 border-2",
                  isSelected ? "w-8 h-8 border-foreground" : "w-5 h-5 border-transparent",
                  isHovered && !isSelected && "w-7 h-7",
                  !isSelected && !isHovered && "w-5 h-5"
                )}
                style={{
                  backgroundColor: `${color}40`,
                  borderColor: isSelected ? color : "transparent",
                  boxShadow: isSelected || isHovered ? `0 0 12px ${color}60` : "none",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </span>

              {/* Label */}
              <span
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-full mt-1 text-[9px] font-medium whitespace-nowrap transition-opacity",
                  isSelected || isHovered ? "opacity-100" : "opacity-70"
                )}
                style={{ color }}
              >
                {state.abbr}
              </span>
            </button>
          )
        })}

        {/* Tooltip */}
        {hoveredState && hoveredStateData && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="bg-card border border-border rounded-lg shadow-xl px-3 py-2 -translate-x-1/2">
              <p className="text-xs font-semibold text-foreground">{hoveredStateData.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: riskColors[hoveredStateData.riskLevel] }}
                />
                <span className="text-[10px] text-muted-foreground capitalize">
                  {t[hoveredStateData.riskLevel]}
                </span>
                <span className="text-[10px] font-bold" style={{ color: riskColors[hoveredStateData.riskLevel] }}>
                  {hoveredStateData.riskScore}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
