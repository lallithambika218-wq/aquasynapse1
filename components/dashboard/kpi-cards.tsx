"use client"

import { useEffect, useState, useRef } from "react"
import { RefreshCw, AlertTriangle, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardsProps {
  riskScore: number
  confidence: number
  safeZones: number
  totalZones: number
  highRiskZones: number
  t: Record<string, string>
}

function CircularProgress({
  value,
  max,
  size = 100,
  strokeWidth = 8,
  color,
  bgColor = "#1e293b",
}: {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color: string
  bgColor?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - animatedProgress}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  )
}

function GoldenHourTimer() {
  const [time, setTime] = useState({ hours: 1, minutes: 47, seconds: 23 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="flex items-center gap-1 font-mono text-2xl font-bold text-foreground tracking-wider">
      <span>{pad(time.hours)}</span>
      <span className="text-destructive animate-pulse">:</span>
      <span>{pad(time.minutes)}</span>
      <span className="text-destructive animate-pulse">:</span>
      <span>{pad(time.seconds)}</span>
    </div>
  )
}

export function KpiCards({ riskScore, confidence, safeZones, totalZones, highRiskZones, t }: KpiCardsProps) {
  const riskColor =
    riskScore >= 75 ? "#ef4444" : riskScore >= 50 ? "#f59e0b" : riskScore >= 25 ? "#eab308" : "#22c55e"
  const riskLabel =
    riskScore >= 75 ? "HIGH" : riskScore >= 50 ? "MEDIUM" : riskScore >= 25 ? "LOW" : "SAFE"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {/* Overall Risk Score */}
      <div className="relative rounded-xl border border-border bg-card p-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${riskColor}, transparent 70%)`,
          }}
        />
        <p className="text-xs text-muted-foreground mb-3 relative z-10">{t.overallRiskScore}</p>
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <CircularProgress value={riskScore} max={100} size={80} strokeWidth={6} color={riskColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">{riskScore}</span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>
          <span
            className="px-2.5 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
          >
            {riskLabel}
          </span>
        </div>
      </div>

      {/* Decision Confidence */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-3">{t.decisionConfidence}</p>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-success">{confidence}</span>
          <span className="text-lg text-muted-foreground mb-1">%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-success transition-all duration-1000"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Golden Hour Index */}
      <div className="rounded-xl border border-destructive/30 bg-card p-4 animate-countdown-pulse">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-destructive">{t.goldenHourIndex}</p>
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-destructive" />
          <GoldenHourTimer />
        </div>
        <button className="mt-3 w-full py-1.5 rounded-lg bg-destructive/20 text-destructive text-xs font-semibold hover:bg-destructive/30 transition-colors">
          {t.actNow}
        </button>
      </div>

      {/* Safe Zones */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-2">{t.safeZones}</p>
        <div className="flex items-end gap-1 mb-3">
          <span className="text-3xl font-bold text-foreground">{safeZones}</span>
          <span className="text-sm text-muted-foreground mb-1">/ {totalZones}</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <p className="text-xs text-muted-foreground">{t.highRiskZones}</p>
        </div>
        <div className="flex items-end gap-1 mt-1">
          <span className="text-2xl font-bold text-warning">{highRiskZones}</span>
          <span className="text-sm text-muted-foreground mb-0.5">/ {totalZones}</span>
        </div>
      </div>
    </div>
  )
}
