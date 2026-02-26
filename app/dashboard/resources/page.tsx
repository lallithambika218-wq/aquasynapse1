"use client"

import { useState, useCallback } from "react"
import { useDashboard } from "../layout"
import { initialResources } from "@/lib/dashboard-store"
import type { Resource } from "@/lib/dashboard-store"
import { Package, Ship, Truck, Stethoscope, Plus, Minus, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  boat: Ship,
  ambulance: Truck,
  food: Package,
  medical: Stethoscope,
}

const zoneAllocations = [
  { zone: "Zone A - Bihar", boats: 12, ambulances: 8, food: 150, medical: 5 },
  { zone: "Zone B - Assam", boats: 10, ambulances: 6, food: 120, medical: 4 },
  { zone: "Zone C - Odisha", boats: 8, ambulances: 5, food: 80, medical: 3 },
  { zone: "Zone D - Maharashtra", boats: 6, ambulances: 3, food: 60, medical: 3 },
]

export default function ResourcesPage() {
  const { t } = useDashboard()
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [optimizing, setOptimizing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleOptimize = useCallback(() => {
    setOptimizing(true)
    setTimeout(() => {
      setResources((prev) =>
        prev.map((r) => ({
          ...r,
          current: Math.min(r.total, r.current + Math.floor(Math.random() * 5) + 2),
        }))
      )
      setOptimizing(false)
    }, 1500)
  }, [])

  const handleAdjust = useCallback((name: string, delta: number) => {
    setResources((prev) =>
      prev.map((r) =>
        r.name === name
          ? { ...r, current: Math.max(0, Math.min(r.total, r.current + delta)) }
          : r
      )
    )
  }, [])

  const totalAllocated = resources.reduce((sum, r) => sum + r.current, 0)
  const totalCapacity = resources.reduce((sum, r) => sum + r.total, 0)
  const overallPercentage = Math.round((totalAllocated / totalCapacity) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t.resources}</h1>
            <p className="text-xs text-muted-foreground">Manage and optimize disaster response resource allocation</p>
          </div>
        </div>
        <button
          onClick={handleOptimize}
          disabled={optimizing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-semibold border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-50"
        >
          {optimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          {t.autoOptimize}
        </button>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Overall Utilization</h3>
          <span className={cn(
            "text-sm font-bold",
            overallPercentage >= 80 ? "text-success" : overallPercentage >= 50 ? "text-warning" : "text-destructive"
          )}>
            {overallPercentage}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${overallPercentage}%`,
              backgroundColor: overallPercentage >= 80 ? "#22c55e" : overallPercentage >= 50 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{totalAllocated} of {totalCapacity} total resources deployed</p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource) => {
          const Icon = iconMap[resource.icon] || Package
          const percentage = resource.total > 0 ? (resource.current / resource.total) * 100 : 0
          const color = percentage >= 70 ? "#22c55e" : percentage >= 40 ? "#f59e0b" : "#ef4444"

          return (
            <div key={resource.name} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{resource.name}</span>
                </div>
                {percentage < 40 && <AlertTriangle className="w-4 h-4 text-destructive" />}
              </div>

              <div className="text-center mb-4">
                <p className="text-3xl font-bold" style={{ color }}>{resource.current}</p>
                <p className="text-xs text-muted-foreground">of {resource.total} available</p>
              </div>

              <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAdjust(resource.name, -1)}
                  className="flex-1 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAdjust(resource.name, 1)}
                  className="flex-1 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Zone Allocation Table */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Zone-wise Allocation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 text-muted-foreground font-medium">Zone</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Boats</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Ambulances</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Food Kits</th>
                <th className="text-center py-2.5 text-muted-foreground font-medium">Medical</th>
              </tr>
            </thead>
            <tbody>
              {zoneAllocations.map((zone) => (
                <tr key={zone.zone} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-foreground font-medium">{zone.zone}</td>
                  <td className="py-3 text-center text-accent">{zone.boats}</td>
                  <td className="py-3 text-center text-warning">{zone.ambulances}</td>
                  <td className="py-3 text-center text-primary">{zone.food}</td>
                  <td className="py-3 text-center text-success">{zone.medical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
