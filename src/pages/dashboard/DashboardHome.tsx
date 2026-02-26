import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { KpiCard } from '../../components/KpiCard'
import { staggerContainer, fadeUp } from '../../animations/variants'
import { useResources, useShelters, useHistory } from '../../hooks/useApiQueries'
import { useState, useEffect } from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'

const N = {
    cyan: '#00fff5', green: '#39ff14', pink: '#ff2d78', orange: '#ff6b00',
    bgCard: '#080f1e', bgRaised: '#0c1428', bgRow: '#0a1424',
    border: 'rgba(0,255,245,0.12)', borderHi: 'rgba(0,255,245,0.35)',
    text: '#e0f4ff', textMid: '#7ec8d4', textDim: '#2d5c6e',
    glowC: '0 0 8px rgba(0,255,245,0.5)', glowG: '0 0 8px rgba(57,255,20,0.5)',
}

// Location-specific risk trend data for India
const RISK_TREND_DATA = [
    { time: 'Jan', Bihar: 72, Odisha: 60, Assam: 65, Maharashtra: 45 },
    { time: 'Feb', Bihar: 80, Odisha: 68, Assam: 77, Maharashtra: 50 },
    { time: 'Mar', Bihar: 85, Odisha: 74, Assam: 80, Maharashtra: 55 },
    { time: 'Apr', Bihar: 78, Odisha: 70, Assam: 82, Maharashtra: 60 },
    { time: 'May', Bihar: 90, Odisha: 83, Assam: 88, Maharashtra: 68 },
    { time: 'Jun', Bihar: 89, Odisha: 82, Assam: 85, Maharashtra: 70 },
]

const STATE_RISK_PIE = [
    { name: 'Critical', value: 3, color: '#ff2d78' },
    { name: 'High', value: 6, color: '#ff6b00' },
    { name: 'Medium', value: 9, color: '#f0c040' },
    { name: 'Low', value: 5, color: '#39ff14' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: '#080f1e', border: '1px solid rgba(0,255,245,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
            <div style={{ color: N.textMid, marginBottom: 6, fontFamily: 'Orbitron, monospace', letterSpacing: 1, fontSize: 10 }}>{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>{p.dataKey}: {p.value}</div>
            ))}
        </div>
    )
}

export function DashboardHome() {
    const { t, riskScore, confidence, rainfall, selectedState } = useStore()
    const { data: resourceData } = useResources(riskScore)
    const { data: shelterData } = useShelters(riskScore)
    const { data: histData } = useHistory()
    const [steps, setSteps] = useState([
        { id: 1, text: 'Deploy 12 Boats → Patna (Zone A)', done: false },
        { id: 2, text: 'Open 3 Shelters → Guwahati (Zone B)', done: false },
        { id: 3, text: 'Send Alerts → 5 Bihar Districts', done: false },
        { id: 4, text: 'Pre-position Helicopters → J&K', done: false },
    ])
    const [liveTime, setLiveTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setLiveTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const resources = resourceData?.resources || [
        { name: 'Rescue Boats', icon: '⛵', current: 36, total: 50 },
        { name: 'Ambulances', icon: '🚑', current: 22, total: 30 },
        { name: 'Food Kits', icon: '📦', current: 410, total: 500 },
        { name: 'Medical Teams', icon: '⚕️', current: 15, total: 20 },
        { name: 'Helicopters', icon: '🚁', current: 3, total: 5 },
        { name: 'Evacuation Buses', icon: '🚌', current: 9, total: 15 },
    ]

    const shelters = shelterData?.shelters || [
        { id: 's1', name: 'Green Valley School — Patna', capacity: 1200, current_occupancy: 340, safety: 'Safe', distance_km: 2.3 },
        { id: 's2', name: 'City Hall — Guwahati', capacity: 800, current_occupancy: 620, safety: 'At Risk', distance_km: 5.1 },
        { id: 's3', name: 'Hilltop Complex — Dehradun', capacity: 1500, current_occupancy: 200, safety: 'Safe', distance_km: 7.8 },
        { id: 's4', name: 'District Stadium — Bhubaneswar', capacity: 3000, current_occupancy: 450, safety: 'Safe', distance_km: 12.4 },
    ]

    const history = histData?.history || []
    const riskColor = riskScore >= 70 ? N.pink : riskScore >= 45 ? N.orange : N.green

    const card = (extra?: React.CSSProperties): React.CSSProperties => ({
        background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20, ...extra,
    })

    // Radial bar data for risk gauge
    const radialData = [{ name: 'Risk', value: riskScore, fill: riskColor }]

    return (
        <div style={{ padding: 24, overflowY: 'auto', height: '100%', background: 'transparent' }}>

            {/* Header */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 2, marginBottom: 4, textShadow: N.glowC }}>
                        🛡️ COMMAND CENTER OVERVIEW
                    </h1>
                    <p style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>
                        REAL-TIME SITUATIONAL AWARENESS — {selectedState ? `FOCUSED ON ${selectedState.toUpperCase()}` : 'ALL INDIA'}
                    </p>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'Orbitron, monospace' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: N.cyan, textShadow: N.glowC }}>
                        {liveTime.toLocaleTimeString('en-IN')}
                    </div>
                    <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1 }}>
                        {liveTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} · IST
                    </div>
                </div>
            </div>

            {/* KPI Row */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible"
                className="grid-cols-responsive" style={{ marginBottom: 24 }}>
                {[
                    { label: t('overallRiskScore'), value: riskScore, color: riskColor, icon: '⚡', sub: riskScore >= 70 ? '🔴 Critical — Act Now!' : '🟡 Elevated' },
                    { label: t('decisionConfidence'), value: confidence, suffix: '%', color: N.cyan, icon: '🧠', sub: 'RandomForest ML' },
                    { label: 'Active Alerts', value: 7, color: N.orange, icon: '🔔', sub: '4 unread' },
                    { label: 'SOS Events Today', value: 2, color: N.pink, icon: '🚨', sub: 'Last: 14 mins ago' },
                    { label: 'Resources Deployed', value: 72, suffix: '%', color: '#3d9bff', icon: '📦', sub: 'Of total capacity' },
                    { label: 'Safe Shelters', value: 3, suffix: '/5', color: N.green, icon: '🏠', sub: '7,100 capacity' },
                ].map(k => (
                    <motion.div key={k.label} variants={fadeUp}>
                        <KpiCard label={k.label} value={k.value} suffix={k.suffix} color={k.color} icon={k.icon} subLabel={k.sub} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row */}
            <div className="layout-2col-responsive" style={{ marginBottom: 20 }}>

                {/* Risk Trend Area Chart */}
                <div style={card()}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                        📈 STATE RISK TREND — 2026
                    </div>
                    <div style={{ fontSize: 10, color: N.textDim, marginBottom: 14, letterSpacing: 1 }}>Top-4 high-risk states · monthly risk score</div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={RISK_TREND_DATA}>
                            <defs>
                                <linearGradient id="gBihar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff2d78" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff2d78" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gAssam" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00fff5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00fff5" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gOdisha" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,245,0.05)" />
                            <XAxis dataKey="time" tick={{ fill: N.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: N.textDim, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, color: N.textMid }} />
                            <Area type="monotone" dataKey="Bihar" stroke="#ff2d78" fill="url(#gBihar)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="Assam" stroke="#00fff5" fill="url(#gAssam)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="Odisha" stroke="#ff6b00" fill="url(#gOdisha)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="Maharashtra" stroke="#39ff14" fill="none" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Distribution Pie */}
                <div style={card({ display: 'flex', flexDirection: 'column' })}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                        🗺️ STATE RISK DIST.
                    </div>
                    <div style={{ fontSize: 10, color: N.textDim, marginBottom: 8, letterSpacing: 1 }}>23 states assessed</div>
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie data={STATE_RISK_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                                {STATE_RISK_PIE.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val: any, name: any) => [val + ' states', name]}
                                contentStyle={{ background: '#080f1e', border: `1px solid ${N.border}`, borderRadius: 8, fontSize: 11 }}
                                labelStyle={{ color: N.textMid }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
                        {STATE_RISK_PIE.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                <span style={{ color: N.textMid }}>{d.name}: <strong style={{ color: d.color }}>{d.value}</strong></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="layout-2col-responsive" style={{ marginBottom: 20 }}>

                {/* Resources */}
                <div style={card()}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 18, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                        📦 RESOURCE OVERVIEW
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {resources.map((r: any) => {
                            const pct = (r.current / r.total) * 100
                            const barColor = pct < 40 ? N.pink : pct < 70 ? N.orange : N.cyan
                            return (
                                <div key={r.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                                        <span style={{ color: N.textMid }}>{r.icon} {r.name}</span>
                                        <span style={{ color: N.text, fontWeight: 700 }}>{r.current}/{r.total}</span>
                                    </div>
                                    <div style={{ height: 5, background: 'rgba(0,255,245,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.9, delay: 0.1 }}
                                            style={{ height: '100%', background: barColor, borderRadius: 999, boxShadow: `0 0 6px ${barColor}` }} />
                                    </div>
                                    <div style={{ fontSize: 10, color: N.textDim, marginTop: 3 }}>{Math.round(pct)}% deployed</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Action Plan */}
                <div style={card()}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                        ⚡ ACTION PLAN (AI)
                    </div>
                    {steps.map(s => (
                        <div key={s.id} onClick={() => setSteps(p => p.map(x => x.id === s.id ? { ...x, done: !x.done } : x))}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', marginBottom: 8, background: N.bgRaised, borderRadius: 9, cursor: 'pointer', opacity: s.done ? 0.5 : 1, border: `1px solid ${s.done ? 'rgba(57,255,20,0.2)' : N.border}` }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${s.done ? N.green : N.textDim}`, background: s.done ? 'rgba(57,255,20,0.15)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: N.green, boxShadow: s.done ? N.glowG : 'none' }}>
                                {s.done ? '✓' : ''}
                            </div>
                            <span style={{ fontSize: 11, color: s.done ? N.textDim : N.textMid, textDecoration: s.done ? 'line-through' : 'none' }}>{s.text}</span>
                        </div>
                    ))}
                    <button onClick={() => setSteps(p => p.map(x => ({ ...x, done: true })))}
                        style={{ width: '100%', marginTop: 8, padding: '9px 0', background: 'rgba(0,255,245,0.06)', border: `1px solid ${N.borderHi}`, borderRadius: 9, color: N.cyan, fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: 1, textShadow: N.glowC, boxShadow: N.glowC }}>
                        ⚡ EXECUTE ALL
                    </button>
                </div>
            </div>

            {/* Shelters + History */}
            <div className="layout-1-1-responsive" style={{ marginBottom: 20 }}>

                {/* Shelter Table */}
                <div style={card()}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                        🏠 SHELTER STATUS
                    </div>
                    <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: N.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                                <th style={{ textAlign: 'left', paddingBottom: 10 }}>Location</th>
                                <th style={{ textAlign: 'right', paddingBottom: 10 }}>Cap</th>
                                <th style={{ textAlign: 'right', paddingBottom: 10 }}>Occ.</th>
                                <th style={{ textAlign: 'right', paddingBottom: 10 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shelters.map((s: any) => {
                                const occPct = s.current_occupancy / s.capacity
                                return (
                                    <tr key={s.id || s.name} style={{ borderTop: `1px solid ${N.border}` }}>
                                        <td style={{ padding: '9px 0', color: N.text, fontSize: 11 }}>{s.name.split('—')[0].trim()}<br /><span style={{ color: N.textDim, fontSize: 9 }}>{s.name.split('—')[1]?.trim()}</span></td>
                                        <td style={{ textAlign: 'right', color: N.textDim }}>{s.capacity?.toLocaleString()}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span style={{ color: occPct > 0.8 ? N.pink : occPct > 0.6 ? N.orange : N.green, fontWeight: 700 }}>
                                                {s.current_occupancy?.toLocaleString() ?? '—'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 1,
                                                background: s.safety === 'Safe' ? 'rgba(57,255,20,0.1)' : s.safety === 'Full' ? 'rgba(255,45,120,0.1)' : 'rgba(255,107,0,0.1)',
                                                color: s.safety === 'Safe' ? N.green : s.safety === 'Full' ? N.pink : N.orange,
                                                border: `1px solid ${s.safety === 'Safe' ? 'rgba(57,255,20,0.25)' : s.safety === 'Full' ? 'rgba(255,45,120,0.25)' : 'rgba(255,107,0,0.25)'}`,
                                            }}>
                                                {s.safety.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Recent Analyses */}
                <div style={card()}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                        🕐 RECENT ANALYSES
                    </div>
                    {(history.slice(0, 5) as any[]).map((h: any) => (
                        <div key={h.id} style={{ padding: '10px 12px', marginBottom: 8, background: N.bgRaised, border: `1px solid ${N.border}`, borderRadius: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 13, color: N.text, fontWeight: 600 }}>{h.area}</div>
                                <div style={{ fontSize: 10, color: N.textDim, marginTop: 2, letterSpacing: 1 }}>{new Date(h.timestamp).toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 900, fontSize: 20, color: h.risk_level === 'critical' ? N.pink : h.risk_level === 'high' ? N.orange : N.green, textShadow: h.risk_level === 'critical' ? N.glowC.replace('0,255,245', '255,45,120') : N.glowG }}>
                                    {h.risk_score}
                                </div>
                                <div style={{ fontSize: 9, color: N.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>{h.risk_level}</div>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <p style={{ color: N.textDim, fontSize: 12, textAlign: 'center', marginTop: 20, letterSpacing: 1 }}>
                            NO ANALYSES YET — RUN ONE FROM SIMULATION
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
