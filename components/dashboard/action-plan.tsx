"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, Play } from "lucide-react"
import type { ActionStep } from "@/lib/dashboard-store"

interface ActionPlanProps {
  steps: ActionStep[]
  onToggleStep: (id: number) => void
  onExecutePlan: () => void
  t: Record<string, string>
}

export function ActionPlan({ steps, onToggleStep, onExecutePlan, t }: ActionPlanProps) {
  const [executing, setExecuting] = useState(false)

  const handleExecute = () => {
    setExecuting(true)
    // Sequentially complete steps with animation
    steps.forEach((step, index) => {
      setTimeout(() => {
        onToggleStep(step.id)
        if (index === steps.length - 1) {
          setTimeout(() => setExecuting(false), 500)
        }
      }, (index + 1) * 800)
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{t.actionPlan}</h3>

      <div className="space-y-2">
        {steps.map((step) => {
          const parts = step.text.split(step.highlight)
          return (
            <button
              key={step.id}
              onClick={() => onToggleStep(step.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                step.completed
                  ? "border-success/30 bg-success/10"
                  : "border-border bg-secondary/50 hover:bg-secondary"
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                  step.completed
                    ? "bg-success border-success text-success-foreground"
                    : "border-primary/50 text-primary"
                )}
              >
                {step.completed ? <Check className="w-3.5 h-3.5" /> : step.id}
              </span>
              <p className="text-xs text-foreground flex-1">
                {parts[0]}
                <span className="text-primary font-semibold">{step.highlight}</span>
                {parts[1]}
              </p>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleExecute}
        disabled={executing || steps.every((s) => s.completed)}
        className={cn(
          "mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all",
          steps.every((s) => s.completed)
            ? "bg-success/20 text-success cursor-default"
            : executing
            ? "bg-primary/20 text-primary cursor-wait"
            : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
        )}
      >
        {steps.every((s) => s.completed) ? (
          <>
            <Check className="w-4 h-4" /> Plan Executed
          </>
        ) : executing ? (
          "Executing..."
        ) : (
          <>
            <Play className="w-3.5 h-3.5" /> {t.executePlan}
          </>
        )}
      </button>
    </div>
  )
}
