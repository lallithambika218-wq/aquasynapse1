"use client"

import { cn } from "@/lib/utils"
import type { Shelter } from "@/lib/dashboard-store"

interface ShelterTableProps {
  shelters: Shelter[]
  t: Record<string, string>
}

export function ShelterTable({ shelters, t }: ShelterTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{t.shelterRecommendation}</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          {t.viewAll}
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">{t.shelterName}</th>
              <th className="text-center py-2 text-muted-foreground font-medium">{t.capacity}</th>
              <th className="text-center py-2 text-muted-foreground font-medium">{t.safety}</th>
              <th className="text-right py-2 text-muted-foreground font-medium">{t.distance}</th>
            </tr>
          </thead>
          <tbody>
            {shelters.map((shelter, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <td className="py-2.5 text-primary font-medium">{shelter.name}</td>
                <td className="py-2.5 text-center text-warning font-medium">{shelter.capacity}</td>
                <td className="py-2.5 text-center">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-semibold",
                      shelter.safety === "Safe"
                        ? "bg-success/20 text-success"
                        : shelter.safety === "At Risk"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {shelter.safety}
                  </span>
                </td>
                <td className="py-2.5 text-right text-muted-foreground">{shelter.distance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
