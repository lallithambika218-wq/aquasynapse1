"use client"

import { useState, useCallback } from "react"
import { useDashboard } from "../layout"
import { initialAlerts } from "@/lib/dashboard-store"
import type { Alert } from "@/lib/dashboard-store"
import { Bell, CloudRain, Zap, AlertTriangle, Mountain, Send, Filter, Check, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const alertIcons: Record<string, React.ElementType> = {
  flood: CloudRain,
  evacuation: Zap,
  resource: AlertTriangle,
  earthquake: Mountain,
  cyclone: CloudRain,
}

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#0ea5e9",
  low: "#22c55e",
}

export default function AlertsPage() {
  const { t } = useDashboard()
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [showSendModal, setShowSendModal] = useState(false)
  const [sendingAlert, setSendingAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({ title: "", location: "", severity: "high" as Alert["severity"], type: "flood" as Alert["type"] })

  const filtered = filterSeverity === "all"
    ? alerts
    : alerts.filter((a) => a.severity === filterSeverity)

  const unreadCount = alerts.filter((a) => !a.read).length

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
  }, [])

  const markRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }, [])

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const sendAlert = useCallback(() => {
    setSendingAlert(true)
    setTimeout(() => {
      const alert: Alert = {
        id: `new-${Date.now()}`,
        type: newAlert.type,
        title: newAlert.title || "Manual Alert",
        location: newAlert.location || "All Zones",
        detail: "",
        time: "Just now",
        severity: newAlert.severity,
        read: false,
      }
      setAlerts((prev) => [alert, ...prev])
      setSendingAlert(false)
      setShowSendModal(false)
      setNewAlert({ title: "", location: "", severity: "high", type: "flood" })
    }, 1200)
  }, [newAlert])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t.alerts}</h1>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""} - Manage and send emergency notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:bg-muted transition-all"
          >
            <Check className="w-3.5 h-3.5" /> Mark All Read
          </button>
          <button
            onClick={() => setShowSendModal(!showSendModal)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 text-destructive text-xs font-semibold border border-destructive/30 hover:bg-destructive/30 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> {t.sendAlert}
          </button>
        </div>
      </div>

      {/* Send Alert Panel */}
      {showSendModal && (
        <div className="rounded-xl border border-destructive/30 bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Send New Alert</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Alert Title</label>
              <input
                type="text"
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                placeholder="e.g. Flood Warning"
                className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Location</label>
              <input
                type="text"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                placeholder="e.g. Bihar - Zone A"
                className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Severity</label>
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as Alert["severity"] })}
                className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Type</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert["type"] })}
                className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="flood">Flood</option>
                <option value="cyclone">Cyclone</option>
                <option value="earthquake">Earthquake</option>
                <option value="evacuation">Evacuation</option>
                <option value="resource">Resource</option>
              </select>
            </div>
          </div>
          <button
            onClick={sendAlert}
            disabled={sendingAlert}
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-destructive text-foreground text-xs font-semibold hover:bg-destructive/90 transition-all disabled:opacity-50"
          >
            {sendingAlert ? "Sending..." : "Send Alert to Registered Users"}
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "critical", "high", "medium", "low"].map((level) => (
          <button
            key={level}
            onClick={() => setFilterSeverity(level)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
              filterSeverity === level
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {level === "all" ? `All (${alerts.length})` : `${level} (${alerts.filter((a) => a.severity === level).length})`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {filtered.map((alert) => {
          const Icon = alertIcons[alert.type] || Bell
          const color = severityColors[alert.severity]

          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border transition-all",
                !alert.read ? "bg-card border-border" : "bg-card/50 border-border/50"
              )}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold capitalize"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {alert.severity}
                  </span>
                  {!alert.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {alert.location}{alert.detail && ` - ${alert.detail}`}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {!alert.read && (
                  <button
                    onClick={() => markRead(alert.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center gap-3">
            <Bell className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No alerts matching the current filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
