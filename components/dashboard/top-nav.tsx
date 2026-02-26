"use client"

import { useState, useRef, useEffect } from "react"
import { useClerk } from "@clerk/nextjs"
import {
  Search,
  Globe,
  Bell,
  ChevronDown,
  Menu,
  Shield,
  X,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Alert } from "@/lib/dashboard-store"
import { User } from "@clerk/nextjs/server"

interface TopNavProps {
  language: string
  onLanguageChange: (lang: string) => void
  isOnline: boolean
  alerts: Alert[]
  onMarkAlertRead: (id: string) => void
  onSidebarToggle: () => void
  t: Record<string, string>
  user?: User | null
}

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
]

export function TopNav({
  language,
  onLanguageChange,
  isOnline,
  alerts,
  onMarkAlertRead,
  onSidebarToggle,
  t,
  user,
}: TopNavProps) {
  const { signOut } = useClerk()
  const [searchQuery, setSearchQuery] = useState("")
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const unreadCount = alerts.filter((a) => !a.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card gap-4">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border hover:bg-muted transition-colors"
          >
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onLanguageChange(l.code)
                    setShowLangDropdown(false)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors",
                    language === l.code ? "text-primary font-medium" : "text-foreground"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-secondary text-foreground border border-border hover:bg-muted transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-destructive text-[10px] font-bold text-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-lg shadow-xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{t.alerts}</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {alerts.map((alert) => (
                  <button
                    key={alert.id}
                    onClick={() => onMarkAlertRead(alert.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0",
                      !alert.read && "bg-secondary/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        alert.severity === "critical"
                          ? "bg-destructive"
                          : alert.severity === "high"
                          ? "bg-warning"
                          : "bg-accent"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.location}
                        {alert.detail && ` - ${alert.detail}`}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Online Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg">
          <span
            className={cn("w-2 h-2 rounded-full", isOnline ? "bg-success animate-pulse" : "bg-destructive")}
          />
          <span className={cn("text-xs font-medium", isOnline ? "text-success" : "text-destructive")}>
            {isOnline ? t.online : t.offline}
          </span>
        </div>

        {/* Command Center */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Shield className="w-4 h-4 text-primary" />
          <span>{t.commandCenter}</span>
        </button>

        {/* User Menu */}
        {user && (
          <div ref={userRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border hover:bg-muted transition-colors"
            >
              {user.imageUrl && (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || 'User'} 
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="hidden sm:inline">{user.firstName || 'User'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <button
                  onClick={() => signOut({ redirectUrl: '/login' })}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
