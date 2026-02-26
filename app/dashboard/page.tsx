"use client"

import { useState, useCallback, useEffect } from "react"
import { useDashboard } from "./layout"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { IndiaHeatmap } from "@/components/dashboard/india-heatmap"
import { ResourcePanel } from "@/components/dashboard/resource-panel"
import { ShelterTable } from "@/components/dashboard/shelter-table"
import { QuickAlerts } from "@/components/dashboard/quick-alerts"
import { ActionPlan } from "@/components/dashboard/action-plan"
import { WhatIfSimulation } from "@/components/dashboard/what-if-simulation"
import { useAlerts } from "@/hooks/useAlerts"
import { useResources } from "@/hooks/useResources"
import { useShelters } from "@/hooks/useShelters"
import { useActionPlans } from "@/hooks/useActionPlans"
import { useRiskAssessment } from "@/hooks/useRiskAssessment"
import {
  initialResources,
  initialShelters,
  initialActionPlan,
  stateRisks,
  simulationData,
} from "@/lib/dashboard-store"
import type { Resource, ActionStep } from "@/lib/dashboard-store"

export default function DashboardPage() {
  const { t, alerts, setAlerts } = useDashboard()

  // Fetch live data from APIs
  const { data: allAlerts, loading: alertsLoading } = useAlerts('active')
  const { data: resources, loading: resourcesLoading } = useResources()
  const { data: shelters, loading: sheltersLoading } = useShelters()
  const { data: actionPlans, loading: plansLoading } = useActionPlans('in_progress')
  const { data: riskAssessments } = useRiskAssessment()

  const [actionSteps, setActionSteps] = useState<ActionStep[]>(initialActionPlan)
  const [simulationPercentage, setSimulationPercentage] = useState(20)
  const [selectedState, setSelectedState] = useState<string | null>("Bihar")
  const [riskScore, setRiskScore] = useState(78)
  const [confidence, setConfidence] = useState(92)

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScore((prev) => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(0, Math.min(100, prev + change))
      })
      setConfidence((prev) => {
        const change = Math.floor(Math.random() * 3) - 1
        return Math.max(80, Math.min(99, prev + change))
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }, [setAlerts])

  const handleAutoOptimize = useCallback(() => {
    setResources((prev) =>
      prev.map((r) => ({
        ...r,
        current: Math.min(r.total, r.current + Math.floor(Math.random() * 5) + 2),
      }))
    )
  }, [])

  const handleToggleStep = useCallback((id: number) => {
    setActionSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }, [])

  const handleExecutePlan = useCallback(() => {
    setActionSteps((prev) => prev.map((s) => ({ ...s, completed: true })))
  }, [])

  // Calculate statistics from live data
  const safeZones = Array.isArray(riskAssessments)
    ? riskAssessments.filter((r) => r.risk_level === "low").length
    : stateRisks.filter((s) => s.riskLevel === "low").length
  
  const highRiskZones = Array.isArray(riskAssessments)
    ? riskAssessments.filter((r) => r.risk_level === "high" || r.risk_level === "critical").length
    : stateRisks.filter((s) => s.riskLevel === "high" || s.riskLevel === "critical").length
  
  const totalZones = Array.isArray(riskAssessments)
    ? riskAssessments.length
    : stateRisks.length

  return (
    <div className="flex gap-4">
      {/* Left + Center Content */}
      <div className="flex-1 min-w-0 space-y-4">
        <KpiCards
          riskScore={riskScore}
          confidence={confidence}
          safeZones={safeZones}
          totalZones={totalZones}
          highRiskZones={highRiskZones}
          t={t}
        />

        <IndiaHeatmap
          states={stateRisks}
          selectedState={selectedState}
          onStateSelect={(state) => setSelectedState((prev) => (prev === state ? null : state))}
          t={t}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResourcePanel
            resources={(resources as Resource[] | null) || initialResources}
            onAutoOptimize={handleAutoOptimize}
            t={t}
          />
          <ShelterTable shelters={shelters || initialShelters} t={t} />
          <ActionPlan
            steps={actionSteps}
            onToggleStep={handleToggleStep}
            onExecutePlan={handleExecutePlan}
            t={t}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:flex flex-col gap-4 w-[300px] shrink-0">
        <QuickAlerts alerts={alerts} onMarkRead={handleMarkAlertRead} t={t} />
        <ActionPlan
          steps={actionSteps}
          onToggleStep={handleToggleStep}
          onExecutePlan={handleExecutePlan}
          t={t}
        />
        <WhatIfSimulation
          simulationPercentage={simulationPercentage}
          onPercentageChange={setSimulationPercentage}
          data={simulationData}
          t={t}
        />
      </div>

      {/* Mobile: Right sidebar items */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 hidden">
        {/* Intentionally hidden - shown inline below on smaller screens */}
      </div>
    </div>
  )
}
