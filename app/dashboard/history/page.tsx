"use client"

import { useState, useCallback } from "react"
import { useDashboard } from "../layout"
import { initialHistory } from "@/lib/dashboard-store"
import type { HistoryEntry } from "@/lib/dashboard-store"
import { Clock, RotateCcw, Trash2, Download, Search, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const riskColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

export default function HistoryPage() {
  const { t } = useDashboard()
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [restoredId, setRestoredId] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null)

  const filtered = history.filter(
    (h) =>
      h.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.riskLevel.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRestore = useCallback((entry: HistoryEntry) => {
    setRestoredId(entry.id)
    setSelectedEntry(entry)
    setTimeout(() => setRestoredId(null), 2000)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
    if (selectedEntry?.id === id) setSelectedEntry(null)
  }, [selectedEntry])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t.history}</h1>
            <p className="text-xs text-muted-foreground">{history.length} saved analyses - Restore or review past results</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium text-muted-foreground border border-border hover:text-foreground hover:bg-muted transition-all">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by area or risk level..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* History List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                selectedEntry?.id === entry.id
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border hover:bg-secondary/30",
                restoredId === entry.id && "ring-2 ring-success/50"
              )}
              onClick={() => setSelectedEntry(entry)}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: riskColors[entry.riskLevel] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{entry.area}</h4>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold capitalize"
                    style={{
                      backgroundColor: `${riskColors[entry.riskLevel]}20`,
                      color: riskColors[entry.riskLevel],
                    }}
                  >
                    {entry.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right mr-3">
                  <p className="text-lg font-bold" style={{ color: riskColors[entry.riskLevel] }}>
                    {entry.riskScore}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{entry.confidence}% conf.</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRestore(entry)
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    restoredId === entry.id
                      ? "bg-success/20 text-success"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  )}
                  title="Restore this analysis"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(entry.id)
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center gap-3">
              <Clock className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No history entries found</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div>
          {selectedEntry ? (
            <div className="rounded-xl border border-border bg-card p-4 space-y-4 sticky top-4">
              <h3 className="text-sm font-semibold text-foreground">Analysis Detail</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="text-sm font-bold text-foreground">{selectedEntry.area}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm text-foreground">{selectedEntry.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                  <p className="text-3xl font-bold" style={{ color: riskColors[selectedEntry.riskLevel] }}>
                    {selectedEntry.riskScore}
                  </p>
                  <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${selectedEntry.riskScore}%`,
                        backgroundColor: riskColors[selectedEntry.riskLevel],
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className="text-sm font-bold capitalize" style={{ color: riskColors[selectedEntry.riskLevel] }}>
                      {selectedEntry.riskLevel}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-sm font-bold text-success">{selectedEntry.confidence}%</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRestore(selectedEntry)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold border border-primary/30 hover:bg-primary/30 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore This Analysis
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center gap-3">
              <Eye className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground text-center">Select an entry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
