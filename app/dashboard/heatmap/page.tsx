"use client"

import { useState } from "react"
import { useDashboard } from "../layout"
import { IndiaHeatmap } from "@/components/dashboard/india-heatmap"
import { stateRisks } from "@/lib/dashboard-store"
import type { StateRisk } from "@/lib/dashboard-store"
import { Map, Filter, BarChart3, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const riskColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

export default function HeatmapPage() {
  const { t } = useDashboard()
  const [selectedState, setSelectedState] = useState<string | null>("Bihar")
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all"
    ? stateRisks
    : stateRisks.filter((s) => s.riskLevel === filter)

  const selectedData = stateRisks.find((s) => s.name === selectedState)

  const statsByLevel = {
    critical: stateRisks.filter((s) => s.riskLevel === "critical").length,
    high: stateRisks.filter((s) => s.riskLevel === "high").length,
    medium: stateRisks.filter((s) => s.riskLevel === "medium").length,
    low: stateRisks.filter((s) => s.riskLevel === "low").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Map className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{t.heatmap}</h1>
          <p className="text-xs text-muted-foreground">Interactive India risk heatmap with zone-level details</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["critical", "high", "medium", "low"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(filter === level ? "all" : level)}
            className={cn(
              "rounded-xl border p-4 transition-all",
              filter === level ? "ring-2" : "hover:bg-secondary/50",
              level === "critical" ? "border-destructive/30 ring-destructive/50" :
              level === "high" ? "border-[#f97316]/30 ring-[#f97316]/50" :
              level === "medium" ? "border-warning/30 ring-warning/50" :
              "border-success/30 ring-success/50"
            )}
            style={{ backgroundColor: `${riskColors[level]}10` }}
          >
            <p className="text-2xl font-bold" style={{ color: riskColors[level] }}>
              {statsByLevel[level]}
            </p>
            <p className="text-xs text-muted-foreground capitalize mt-1">{t[level]} Risk Zones</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Heatmap */}
        <div className="lg:col-span-2">
          <IndiaHeatmap
            states={filtered}
            selectedState={selectedState}
            onStateSelect={(state) => setSelectedState((prev) => (prev === state ? null : state))}
            t={t}
          />
        </div>

        {/* State Details Panel */}
        <div className="space-y-4">
          {selectedData ? (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">{selectedData.name}</h3>
                <span
                  className="px-2.5 py-1 rounded text-xs font-bold capitalize"
                  style={{
                    backgroundColor: `${riskColors[selectedData.riskLevel]}20`,
                    color: riskColors[selectedData.riskLevel],
                  }}
                >
                  {selectedData.riskLevel}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold" style={{ color: riskColors[selectedData.riskLevel] }}>
                      {selectedData.riskScore}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${selectedData.riskScore}%`,
                        backgroundColor: riskColors[selectedData.riskLevel],
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground mb-2">Threat Assessment</p>
                  <div className="space-y-2">
                    {["Flood Risk", "Infrastructure", "Population Density", "Response Time"].map((factor, i) => {
                      const value = Math.max(20, selectedData.riskScore + (i * 5 - 10) + Math.floor(Math.random() * 10))
                      return (
                        <div key={factor} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground w-28">{factor}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, value)}%`,
                                backgroundColor: value >= 70 ? "#ef4444" : value >= 40 ? "#f59e0b" : "#22c55e",
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
                  <div className="space-y-2">
                    <button className="w-full py-2 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-colors">
                      View Detailed Report
                    </button>
                    <button className="w-full py-2 rounded-lg bg-destructive/20 text-destructive text-xs font-semibold hover:bg-destructive/30 transition-colors">
                      Send Alert for Zone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center gap-3">
              <Eye className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground text-center">Select a state on the heatmap to view details</p>
            </div>
          )}

          {/* Zone List */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">All Zones ({filtered.length})</h3>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-thin">
              {filtered
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((state) => (
                  <button
                    key={state.name}
                    onClick={() => setSelectedState(state.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all",
                      selectedState === state.name
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: riskColors[state.riskLevel] }}
                      />
                      <span>{state.name}</span>
                    </div>
                    <span className="font-bold" style={{ color: riskColors[state.riskLevel] }}>
                      {state.riskScore}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
