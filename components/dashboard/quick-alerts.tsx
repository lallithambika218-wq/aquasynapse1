"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle, Bell, Zap, CloudRain, Mountain } from "lucide-react"
import type { Alert } from "@/lib/dashboard-store"

interface QuickAlertsProps {
  alerts: Alert[]
  onMarkRead: (id: string) => void
  t: Record<string, string>
}

const alertIcons: Record<string, React.ElementType> = {
  flood: CloudRain,
  evacuation: Zap,
  resource: AlertTriangle,
  earthquake: Mountain,
  cyclone: CloudRain,
}

const severityStyles: Record<string, { border: string; bg: string; text: string }> = {
  critical: {
    border: "border-destructive/40",
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
  high: {
    border: "border-warning/40",
    bg: "bg-warning/10",
    text: "text-warning",
  },
  medium: {
    border: "border-accent/40",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  low: {
    border: "border-success/40",
    bg: "bg-success/10",
    text: "text-success",
  },
}

export function QuickAlerts({ alerts, onMarkRead, t }: QuickAlertsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{t.quickAlerts}</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          {t.viewAll}
        </button>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
        {alerts.slice(0, 5).map((alert) => {
          const Icon = alertIcons[alert.type] || Bell
          const styles = severityStyles[alert.severity]

          return (
            <button
              key={alert.id}
              onClick={() => onMarkRead(alert.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                styles.border,
                styles.bg,
                !alert.read && "ring-1 ring-inset",
                alert.severity === "critical" && "ring-destructive/20",
                alert.severity === "high" && "ring-warning/20"
              )}
            >
              <div className={cn("mt-0.5 shrink-0", styles.text)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-semibold", styles.text)}>{alert.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {alert.location}
                  {alert.detail && (
                    <>
                      {" "}
                      <span className="text-foreground/70">{"·"}</span> {alert.detail}
                    </>
                  )}
                  <span className="ml-2 text-muted-foreground">{alert.time}</span>
                </p>
              </div>
              {!alert.read && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
