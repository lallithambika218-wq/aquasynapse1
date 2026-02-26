'use client'

import { useState, useEffect, useCallback, createContext, useContext } from "react"
import { useUser } from "@clerk/nextjs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { LanguageSetter } from "@/components/language-setter"
import { translations, initialAlerts } from "@/lib/dashboard-store"
import type { Alert } from "@/lib/dashboard-store"
import { cn } from "@/lib/utils"

interface DashboardContextValue {
  language: string
  setLanguage: (lang: string) => void
  isOnline: boolean
  alerts: Alert[]
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
  t: Record<string, string>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardLayout")
  return ctx
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [language, setLanguage] = useState("en")
  const [isOnline, setIsOnline] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  const t = translations[language] || translations.en

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleMarkAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }, [])

  return (
    <DashboardContext.Provider value={{ language, setLanguage, isOnline, alerts, setAlerts, t }}>
      <LanguageSetter language={language} />
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "lg:relative fixed inset-y-0 left-0 z-50 transition-transform duration-300",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            t={t}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav
            language={language}
            onLanguageChange={setLanguage}
            isOnline={isOnline}
            alerts={alerts}
            onMarkAlertRead={handleMarkAlertRead}
            onSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            t={t}
            user={user}
          />

          {/* Offline Banner */}
          {!isOnline && (
            <div className="px-4 py-2 bg-warning/20 border-b border-warning/30">
              <p className="text-xs text-warning font-medium text-center">
                Offline Mode - Showing cached data
              </p>
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}
