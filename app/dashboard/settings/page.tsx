"use client"

import { useState } from "react"
import { useDashboard } from "../layout"
import { Settings, Globe, Bell, Shield, Moon, Database, Wifi, Save, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { t, language, setLanguage } = useDashboard()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    soundAlerts: true,
    autoRefresh: true,
    refreshInterval: 30,
    darkMode: true,
    offlineCache: true,
    twoFactor: false,
    smsAlerts: true,
    emailAlerts: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors",
        enabled ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform",
          enabled ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  )

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t.settings}</h1>
            <p className="text-xs text-muted-foreground">Configure system preferences and notifications</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            saved
              ? "bg-success/20 text-success border border-success/30"
              : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
          )}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* Language */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Language & Region</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Display Language</p>
              <p className="text-xs text-muted-foreground">Changes all UI text immediately</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: "notifications", label: "Push Notifications", desc: "Receive browser push alerts for new incidents" },
            { key: "soundAlerts", label: "Sound Alerts", desc: "Play alert sounds for critical notifications" },
            { key: "smsAlerts", label: "SMS Alerts", desc: "Send SMS to registered users for high-risk events" },
            { key: "emailAlerts", label: "Email Digests", desc: "Daily email summary of system activity" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Toggle
                enabled={settings[item.key as keyof typeof settings] as boolean}
                onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* System */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">System</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Auto-Refresh Data</p>
              <p className="text-xs text-muted-foreground">Automatically refresh risk data at intervals</p>
            </div>
            <Toggle
              enabled={settings.autoRefresh}
              onChange={() => setSettings({ ...settings, autoRefresh: !settings.autoRefresh })}
            />
          </div>
          {settings.autoRefresh && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Refresh Interval</p>
                <p className="text-xs text-muted-foreground">Time between data refreshes (seconds)</p>
              </div>
              <select
                value={settings.refreshInterval}
                onChange={(e) => setSettings({ ...settings, refreshInterval: Number(e.target.value) })}
                className="px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={120}>120s</option>
              </select>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Offline Data Cache</p>
              <p className="text-xs text-muted-foreground">Cache data locally for offline access</p>
            </div>
            <Toggle
              enabled={settings.offlineCache}
              onChange={() => setSettings({ ...settings, offlineCache: !settings.offlineCache })}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add extra security to your account</p>
            </div>
            <Toggle
              enabled={settings.twoFactor}
              onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
