"use client"

import { useState } from "react"
import { useDashboard } from "../layout"
import { initialShelters } from "@/lib/dashboard-store"
import type { Shelter } from "@/lib/dashboard-store"
import { Home, MapPin, Users, Shield, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const extendedShelters: (Shelter & { elevation: number; contact: string; amenities: string[] })[] = [
  { ...initialShelters[0], elevation: 45, contact: "+91 9876543210", amenities: ["Water", "Power", "Medical"] },
  { ...initialShelters[1], elevation: 12, contact: "+91 9876543211", amenities: ["Water", "Power"] },
  { ...initialShelters[2], elevation: 85, contact: "+91 9876543212", amenities: ["Water", "Power", "Medical", "Food"] },
  { ...initialShelters[3], elevation: 120, contact: "+91 9876543213", amenities: ["Water", "Power", "Medical", "Food", "Communication"] },
  { ...initialShelters[4], elevation: 30, contact: "+91 9876543214", amenities: ["Water"] },
]

export default function SheltersPage() {
  const { t } = useDashboard()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShelter, setSelectedShelter] = useState<string | null>(null)
  const [filterSafety, setFilterSafety] = useState<string>("all")

  const filtered = extendedShelters.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterSafety === "all" || s.safety === filterSafety
    return matchesSearch && matchesFilter
  })

  const selected = extendedShelters.find((s) => s.name === selectedShelter)

  const totalCapacity = extendedShelters.reduce((sum, s) => sum + s.capacity, 0)
  const safeCount = extendedShelters.filter((s) => s.safety === "Safe").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t.shelters}</h1>
            <p className="text-xs text-muted-foreground">Emergency shelter management and recommendations</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-semibold border border-primary/30 hover:bg-primary/30 transition-all">
          <Plus className="w-4 h-4" /> Add Shelter
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Shelters</p>
          <p className="text-2xl font-bold text-foreground mt-1">{extendedShelters.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Capacity</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalCapacity.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Safe Shelters</p>
          <p className="text-2xl font-bold text-success mt-1">{safeCount} / {extendedShelters.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Shelter List */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shelters..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
            </div>
            <select
              value={filterSafety}
              onChange={(e) => setFilterSafety(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="Safe">Safe</option>
              <option value="At Risk">At Risk</option>
              <option value="Full">Full</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 text-muted-foreground font-medium">{t.shelterName}</th>
                  <th className="text-center py-2.5 text-muted-foreground font-medium">{t.capacity}</th>
                  <th className="text-center py-2.5 text-muted-foreground font-medium">Elevation</th>
                  <th className="text-center py-2.5 text-muted-foreground font-medium">{t.safety}</th>
                  <th className="text-right py-2.5 text-muted-foreground font-medium">{t.distance}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((shelter) => (
                  <tr
                    key={shelter.name}
                    onClick={() => setSelectedShelter(shelter.name)}
                    className={cn(
                      "border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer",
                      selectedShelter === shelter.name && "bg-primary/5"
                    )}
                  >
                    <td className="py-3 text-primary font-medium">{shelter.name}</td>
                    <td className="py-3 text-center text-warning font-medium">{shelter.capacity.toLocaleString()}</td>
                    <td className="py-3 text-center text-muted-foreground">{shelter.elevation}m</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-semibold",
                        shelter.safety === "Safe" ? "bg-success/20 text-success" :
                        shelter.safety === "At Risk" ? "bg-destructive/20 text-destructive" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {shelter.safety}
                      </span>
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{shelter.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shelter Detail */}
        <div>
          {selected ? (
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">{selected.name}</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="text-sm font-bold text-foreground">{selected.capacity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-bold text-foreground">{selected.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Safety Status</p>
                    <p className={cn(
                      "text-sm font-bold",
                      selected.safety === "Safe" ? "text-success" : selected.safety === "At Risk" ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {selected.safety}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.amenities.map((a) => (
                    <span key={a} className="px-2 py-1 rounded-lg bg-secondary text-xs text-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Contact</p>
                <p className="text-sm font-medium text-accent">{selected.contact}</p>
              </div>

              <button className="w-full py-2.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-colors border border-primary/30">
                Activate Shelter
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center gap-3">
              <Home className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground text-center">Select a shelter to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
