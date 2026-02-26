"use client"

import { useState } from "react"
import { Truck, Stethoscope, Package, Ship } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Resource } from "@/lib/dashboard-store"

interface ResourcePanelProps {
  resources: Resource[]
  onAutoOptimize: () => void
  t: Record<string, string>
}

const iconMap: Record<string, React.ElementType> = {
  boat: Ship,
  ambulance: Truck,
  food: Package,
  medical: Stethoscope,
}

export function ResourcePanel({ resources, onAutoOptimize, t }: ResourcePanelProps) {
  const [optimizing, setOptimizing] = useState(false)

  const handleOptimize = () => {
    setOptimizing(true)
    setTimeout(() => {
      onAutoOptimize()
      setOptimizing(false)
    }, 1500)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{t.resourceAllocation}</h3>
        <button
          onClick={handleOptimize}
          disabled={optimizing}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            optimizing
              ? "bg-primary/10 text-primary border-primary/30 cursor-wait"
              : "bg-secondary text-foreground border-border hover:bg-muted"
          )}
        >
          {optimizing ? "Optimizing..." : t.autoOptimize}
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => {
          const Icon = iconMap[resource.icon] || Package
          const percentage = resource.total > 0 ? (resource.current / resource.total) * 100 : 0
          const barColor =
            percentage >= 70 ? "bg-success" : percentage >= 40 ? "bg-warning" : "bg-destructive"

          return (
            <div key={resource.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground font-medium">{resource.name}:</span>
                  <span className="text-xs text-muted-foreground">
                    {resource.current}
                    {resource.total > 0 && ` / ${resource.total}`}
                  </span>
                </div>
                {resource.total > 0 && (
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", barColor)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
