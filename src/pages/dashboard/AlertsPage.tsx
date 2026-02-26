import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { staggerContainer, fadeUp } from '../../animations/variants'

const N = {
    cyan: '#00fff5', green: '#39ff14', pink: '#ff2d78', orange: '#ff6b00',
    bgCard: '#080f1e', bgRaised: '#0c1428',
    border: 'rgba(0,255,245,0.12)', text: '#e0f4ff', textMid: '#7ec8d4', textDim: '#2d5c6e',
    glowC: '0 0 8px rgba(0,255,245,0.5)',
}

const INITIAL_ALERTS = [
    { id: '1', type: 'flood', title: 'Flood Warning — Level 4', location: 'Bihar - Patna District', detail: 'Water level at Ganga river crossing 52m danger mark. Immediate evacuation of Zone A required. ~12,000 residents affected.', time: '5 mins ago', severity: 'critical', read: false, lat: 25.5, lng: 85.1, affectedPop: 12000 },
    { id: '2', type: 'cyclone', title: 'Cyclone Alert — Cat 2', location: 'Odisha - Puri Coastline', detail: 'Cyclone "Bulbul-II" approaching Odisha coast. Wind speed 140 km/h. ETA 18 hrs. NDRf teams deployed.', time: '22 mins ago', severity: 'high', read: false, lat: 20.9, lng: 85.8, affectedPop: 45000 },
    { id: '3', type: 'evacuation', title: 'Evacuation Order Issued', location: 'Assam - Brahmaputra Zones', detail: '2,300 residents along Brahmaputra floodplain to be evacuated. 3 state buses en route to Zone 3 Guwahati.', time: '1 hr ago', severity: 'critical', read: false, lat: 26.1, lng: 91.7, affectedPop: 2300 },
    { id: '4', type: 'resource', title: 'Resource Shortage', location: 'Maharashtra - Kolhapur', detail: 'Rescue boat supply at 30% of required capacity. State requesting 8 additional units from neighboring districts.', time: '2 hrs ago', severity: 'medium', read: true, lat: 16.7, lng: 74.2, affectedPop: 800 },
    { id: '5', type: 'earthquake', title: 'Seismic Activity', location: 'J&K - Srinagar Region', detail: 'Magnitude 4.2 seismic event detected near Srinagar. Monitoring for aftershocks. Structural inspection advisory issued.', time: '3 hrs ago', severity: 'medium', read: true, lat: 34.0, lng: 74.8, affectedPop: 0 },
    { id: '6', type: 'sos', title: 'SOS Received — Fishing Vessels', location: 'West Bengal - Sundarbans Delta', detail: 'Emergency SOS from 3 fishing vessels. Coast Guard dispatched. Last GPS: 21.8°N 89.1°E. Sea state rough.', time: '4 hrs ago', severity: 'high', read: true, lat: 21.9, lng: 89.1, affectedPop: 18 },
    { id: '7', type: 'flood', title: 'Flash Flood Warning', location: 'Jharkhand - Ranchi Outskirts', detail: 'Heavy rainfall (180mm in 24hrs) forecast for Ranchi. Pre-position rescue boats at Harmu river embankment.', time: '5 hrs ago', severity: 'high', read: true, lat: 23.3, lng: 85.3, affectedPop: 6500 },
]

const TIMELINE_DATA = [
    { month: 'Aug', alerts: 12 }, { month: 'Sep', alerts: 19 }, { month: 'Oct', alerts: 8 },
    { month: 'Nov', alerts: 6 }, { month: 'Dec', alerts: 4 }, { month: 'Jan', alerts: 9 },
    { month: 'Feb', alerts: 7 },
]

const TYPE_ICONS: Record<string, string> = { flood: '🌊', cyclone: '🌀', evacuation: '🚌', resource: '📦', earthquake: '🏔️', sos: '🚨' }
const SEV_COLORS: Record<string, string> = { critical: '#ff2d78', high: '#ff6b00', medium: '#f0c040', low: '#39ff14' }

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
            <div style={{ color: N.textMid, marginBottom: 4 }}>{label}</div>
            <div style={{ color: N.cyan, fontWeight: 700 }}>{payload[0].value} alerts</div>
        </div>
    )
}

export function AlertsPage() {
    const { t } = useStore()
    const [alerts, setAlerts] = useState(INITIAL_ALERTS)
    const [filter, setFilter] = useState<string>('all')
    const [selected, setSelected] = useState<string | null>(null)
    const [ticker, setTicker] = useState(0)

    // Live ticker animation
    useEffect(() => {
        const interval = setInterval(() => setTicker(p => p + 1), 3500)
        return () => clearInterval(interval)
    }, [])

    const markRead = (id: string) => setAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a))
    const markAllRead = () => setAlerts(p => p.map(a => ({ ...a, read: true })))
    const dismiss = (id: string) => setAlerts(p => p.filter(a => a.id !== id))

    const filters = ['all', 'critical', 'high', 'medium', 'unread']
    const filtered = alerts.filter(a => {
        if (filter === 'all') return true
        if (filter === 'unread') return !a.read
        return a.severity === filter
    })

    const unreadCount = alerts.filter(a => !a.read).length
    const selectedAlert = alerts.find(a => a.id === selected)

    const summaryStats = [
        { label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length, color: '#ff2d78' },
        { label: 'High', count: alerts.filter(a => a.severity === 'high').length, color: '#ff6b00' },
        { label: 'Medium', count: alerts.filter(a => a.severity === 'medium').length, color: '#f0c040' },
        { label: 'Unread', count: unreadCount, color: N.cyan },
    ]

    // Live ticker messages
    const tickerMessages = [
        '🌊 Flood level rising in Patna — NDRF deployed',
        '🌀 Cyclone Bulbul-II tracking NNE at 12 km/h',
        '🚌 Evacuation convoy moving to Guwahati Zone 3',
        '📦 Resource request approved — 8 boats en route to Kolhapur',
        '✅ Rescue successful — Sundarban fishermen recovered',
    ]

    return (
        <div style={{ padding: 24, overflowY: 'auto', height: '100%', background: 'transparent' }}>

            {/* Live Ticker */}
            <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: 10, padding: '8px 16px', marginBottom: 18, display: 'flex', gap: 12, alignItems: 'center', overflow: 'hidden' }}>
                <span style={{ color: '#ff2d78', fontFamily: 'Orbitron, monospace', fontSize: 10, fontWeight: 900, letterSpacing: 2, flexShrink: 0 }}>LIVE</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff2d78', boxShadow: '0 0 8px #ff2d78', flexShrink: 0, animation: 'pulse 1s infinite' }} />
                <AnimatePresence mode="wait">
                    <motion.span key={ticker} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        style={{ fontSize: 12, color: N.text }}>
                        {tickerMessages[ticker % tickerMessages.length]}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 2, marginBottom: 4, textShadow: N.glowC }}>
                        🔔 ACTIVE ALERTS
                    </h1>
                    <p style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>
                        {unreadCount} UNREAD · {alerts.length} TOTAL · TRACKING INDIA-WIDE
                    </p>
                </div>
                <button onClick={markAllRead}
                    style={{ padding: '8px 18px', background: 'rgba(0,255,245,0.06)', border: '1px solid rgba(0,255,245,0.25)', borderRadius: 9, color: N.cyan, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textShadow: N.glowC }}>
                    ✓ MARK ALL READ
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {summaryStats.map(s => (
                    <div key={s.label} onClick={() => setFilter(s.label.toLowerCase())}
                        style={{ background: N.bgCard, border: `1px solid ${filter === s.label.toLowerCase() ? s.color : N.border}`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer', transition: 'border 0.2s', boxShadow: filter === s.label.toLowerCase() ? `0 0 12px ${s.color}30` : 'none' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: s.color, textShadow: `0 0 10px ${s.color}60` }}>{s.count}</div>
                        <div style={{ fontSize: 11, color: N.textDim, letterSpacing: 1, marginTop: 2 }}>{s.label.toUpperCase()}</div>
                    </div>
                ))}
            </div>

            {/* Timeline Chart */}
            <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 18, marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>
                    📊 ALERT FREQUENCY — LAST 7 MONTHS
                </div>
                <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={TIMELINE_DATA} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,245,0.04)" />
                        <XAxis dataKey="month" tick={{ fill: N.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="alerts" radius={[4, 4, 0, 0]}>
                            {TIMELINE_DATA.map((_, index) => (
                                <Cell key={index} fill={index === TIMELINE_DATA.length - 1 ? N.pink : 'rgba(0,255,245,0.3)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                {filters.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{ padding: '5px 14px', borderRadius: 20, border: `1px solid ${filter === f ? N.cyan : N.border}`, background: filter === f ? 'rgba(0,255,245,0.1)' : 'transparent', color: filter === f ? N.cyan : N.textDim, fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Alerts List + Detail */}
            <div style={{ display: 'flex', gap: 18 }}>
                <div style={{ flex: 1 }}>
                    <AnimatePresence>
                        {filtered.map(a => (
                            <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                onClick={() => { setSelected(a.id); markRead(a.id) }}
                                style={{
                                    padding: '14px 18px', marginBottom: 10, background: selected === a.id ? `${SEV_COLORS[a.severity]}08` : N.bgCard,
                                    border: `1px solid ${selected === a.id ? SEV_COLORS[a.severity] : a.read ? N.border : `${SEV_COLORS[a.severity]}40`}`,
                                    borderLeft: `4px solid ${SEV_COLORS[a.severity]}`, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.2s',
                                    boxShadow: selected === a.id ? `0 0 16px ${SEV_COLORS[a.severity]}20` : 'none'
                                }}>
                                <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{TYPE_ICONS[a.type] || '🔔'}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: a.read ? N.textMid : N.text }}>{a.title}</div>
                                        {!a.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_COLORS[a.severity], boxShadow: `0 0 6px ${SEV_COLORS[a.severity]}`, flexShrink: 0 }} />}
                                    </div>
                                    <div style={{ fontSize: 12, color: N.textDim }}>📍 {a.location} · {a.time}</div>
                                    {a.affectedPop > 0 && <div style={{ fontSize: 10, color: N.textDim, marginTop: 3 }}>👥 ~{a.affectedPop.toLocaleString()} people affected</div>}
                                </div>
                                <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: `${SEV_COLORS[a.severity]}15`, color: SEV_COLORS[a.severity], letterSpacing: 1, flexShrink: 0, alignSelf: 'center' }}>
                                    {a.severity.toUpperCase()}
                                </span>
                                <button onClick={e => { e.stopPropagation(); dismiss(a.id) }}
                                    style={{ background: 'none', border: 'none', color: N.textDim, cursor: 'pointer', fontSize: 18, padding: '0 4px', flexShrink: 0 }}>×</button>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ padding: 40, textAlign: 'center', color: N.textDim, fontSize: 13, letterSpacing: 1 }}>
                                ✅ NO ALERTS MATCHING THIS FILTER
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Detail panel */}
                <AnimatePresence>
                    {selectedAlert && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            style={{ width: 300, background: N.bgCard, border: `1px solid ${SEV_COLORS[selectedAlert.severity]}40`, boxShadow: `0 0 20px ${SEV_COLORS[selectedAlert.severity]}15`, borderRadius: 14, padding: 22, flexShrink: 0, alignSelf: 'flex-start' }}>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>{TYPE_ICONS[selectedAlert.type]}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: N.text, marginBottom: 6 }}>{selectedAlert.title}</div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${SEV_COLORS[selectedAlert.severity]}20`, color: SEV_COLORS[selectedAlert.severity], textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {selectedAlert.severity}
                                </span>
                                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(0,255,245,0.08)', color: N.cyan, border: `1px solid ${N.border}` }}>
                                    {selectedAlert.type}
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: N.textDim, marginBottom: 14 }}>📍 {selectedAlert.location} · {selectedAlert.time}</div>
                            {selectedAlert.affectedPop > 0 && (
                                <div style={{ background: N.bgRaised, borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 12 }}>
                                    <span style={{ color: N.textDim }}>👥 Affected: </span>
                                    <span style={{ color: SEV_COLORS[selectedAlert.severity], fontWeight: 700 }}>{selectedAlert.affectedPop.toLocaleString()} people</span>
                                </div>
                            )}
                            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>{selectedAlert.detail}</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => setSelected(null)}
                                    style={{ flex: 1, padding: '8px 0', background: N.bgRaised, border: `1px solid ${N.border}`, borderRadius: 8, color: N.textDim, cursor: 'pointer', fontSize: 12 }}>Close</button>
                                <button onClick={() => dismiss(selectedAlert.id)}
                                    style={{ flex: 1, padding: '8px 0', background: 'rgba(255,45,120,0.12)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: 8, color: '#ff2d78', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Dismiss</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
