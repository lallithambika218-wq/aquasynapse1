import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { useHistory } from '../../hooks/useApiQueries'
import { staggerContainer, fadeUp } from '../../animations/variants'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area, Legend
} from 'recharts'

const N = {
    cyan: '#00fff5', green: '#39ff14', pink: '#ff2d78', orange: '#ff6b00',
    bgCard: '#080f1e', bgRaised: '#0c1428',
    border: 'rgba(0,255,245,0.12)', text: '#e0f4ff', textMid: '#7ec8d4', textDim: '#2d5c6e',
    glowC: '0 0 8px rgba(0,255,245,0.5)',
}

const SEV_COLORS: Record<string, string> = { critical: '#ff2d78', high: '#ff6b00', medium: '#f0c040', low: '#39ff14' }

const STATE_HISTORY = [
    { state: 'Bihar', criticalEvents: 14, avgRisk: 88, totalAnalyses: 32 },
    { state: 'Assam', criticalEvents: 11, avgRisk: 84, totalAnalyses: 28 },
    { state: 'Odisha', criticalEvents: 9, avgRisk: 81, totalAnalyses: 24 },
    { state: 'WB', criticalEvents: 7, avgRisk: 74, totalAnalyses: 20 },
    { state: 'MH', criticalEvents: 6, avgRisk: 69, totalAnalyses: 18 },
    { state: 'UP', criticalEvents: 5, avgRisk: 67, totalAnalyses: 15 },
    { state: 'J&K', criticalEvents: 4, avgRisk: 71, totalAnalyses: 12 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 11 }}>
            <div style={{ color: N.textMid, marginBottom: 6, letterSpacing: 1 }}>{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color || N.cyan, fontWeight: 700, marginBottom: 2 }}>
                    {p.name || p.dataKey}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
                </div>
            ))}
        </div>
    )
}

export function HistoryPage() {
    const { t } = useStore()
    const { data, isLoading } = useHistory()
    const [sortBy, setSortBy] = useState<'date' | 'score' | 'conf'>('date')
    const [filterLevel, setFilterLevel] = useState<string>('all')

    const rawHistory = data?.history || [
        { id: 'h1', timestamp: '2026-02-26T14:30:00', area: 'Bihar - Patna', risk_level: 'critical', risk_score: 89.0, confidence: 92.0, rainfall: 85.0 },
        { id: 'h2', timestamp: '2026-02-26T12:15:00', area: 'Assam - Guwahati', risk_level: 'critical', risk_score: 85.0, confidence: 88.0, rainfall: 90.0 },
        { id: 'h3', timestamp: '2026-02-25T09:45:00', area: 'Odisha - Bhubaneswar', risk_level: 'high', risk_score: 72.0, confidence: 90.0, rainfall: 70.0 },
        { id: 'h4', timestamp: '2026-02-24T16:20:00', area: 'Maharashtra - Mumbai', risk_level: 'high', risk_score: 70.0, confidence: 85.0, rainfall: 65.0 },
        { id: 'h5', timestamp: '2026-02-23T11:00:00', area: 'Gujarat - Surat', risk_level: 'medium', risk_score: 45.0, confidence: 94.0, rainfall: 35.0 },
        { id: 'h6', timestamp: '2026-02-22T08:30:00', area: 'Tamil Nadu - Chennai', risk_level: 'medium', risk_score: 48.0, confidence: 89.0, rainfall: 50.0 },
        { id: 'h7', timestamp: '2026-02-21T07:00:00', area: 'West Bengal - Kolkata', risk_level: 'high', risk_score: 74.0, confidence: 87.0, rainfall: 68.0 },
        { id: 'h8', timestamp: '2026-02-20T15:45:00', area: 'J&K - Srinagar', risk_level: 'medium', risk_score: 55.0, confidence: 80.0, rainfall: 42.0 },
    ]

    const history: any[] = filterLevel === 'all' ? rawHistory : rawHistory.filter((h: any) => h.risk_level === filterLevel)

    const sorted = [...history].sort((a, b) =>
        sortBy === 'score' ? b.risk_score - a.risk_score :
            sortBy === 'conf' ? b.confidence - a.confidence :
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const avgScore = history.length ? Math.round(history.reduce((a: number, h: any) => a + h.risk_score, 0) / history.length) : 0
    const avgConf = history.length ? Math.round(history.reduce((a: number, h: any) => a + h.confidence, 0) / history.length) : 0
    const criticalCount = history.filter((h: any) => h.risk_level === 'critical').length

    // Chart data — last entries reversed for chronological display
    const trendData = [...rawHistory].reverse().map((h: any) => ({
        label: h.area.split(' - ')[1] || h.area,
        score: h.risk_score,
        confidence: h.confidence,
        rainfall: h.rainfall,
        level: h.risk_level,
    }))

    return (
        <div style={{ padding: 24, overflowY: 'auto', height: '100%', background: 'transparent' }}>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 2, marginBottom: 4, textShadow: N.glowC }}>
                    🕐 ANALYSIS HISTORY
                </h1>
                <p style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>PAST RISK ANALYSES · ML CONFIDENCE · RAINFALL CORRELATION</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Analyses', value: history.length, color: N.text, icon: '📋' },
                    { label: 'Avg Risk Score', value: avgScore, color: avgScore >= 70 ? N.pink : N.orange, icon: '⚡' },
                    { label: 'Avg Confidence', value: `${avgConf}%`, color: N.cyan, icon: '🧠' },
                    { label: 'Critical Events', value: criticalCount, color: N.pink, icon: '🚨' },
                ].map(s => (
                    <div key={s.label} style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: '16px 20px' }}>
                        <div style={{ fontSize: 22 }}>{s.icon}</div>
                        <div style={{ fontSize: 30, fontWeight: 800, color: s.color, marginTop: 6, textShadow: `0 0 10px ${s.color}40` }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: N.textDim, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 20 }}>

                {/* Risk + Rainfall Line Chart */}
                <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>
                        📈 RISK SCORE vs RAINFALL — CHRONOLOGICAL
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,245,0.04)" />
                            <XAxis dataKey="label" tick={{ fill: N.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: N.textDim, fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, color: N.textMid }} />
                            <Line type="monotone" dataKey="score" stroke={N.pink} strokeWidth={2.5} dot={{ fill: N.pink, r: 4 }} name="Risk Score" />
                            <Line type="monotone" dataKey="confidence" stroke={N.cyan} strokeWidth={2} dot={{ fill: N.cyan, r: 3 }} strokeDasharray="5 3" name="Confidence" />
                            <Line type="monotone" dataKey="rainfall" stroke="#3d9bff" strokeWidth={1.5} dot={false} strokeDasharray="3 5" name="Rainfall %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* State-wise critical events bar */}
                <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>
                        🏴 CRITICAL EVENTS BY STATE
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={STATE_HISTORY} layout="vertical" barSize={10}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,245,0.04)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: N.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="state" type="category" tick={{ fill: N.textMid, fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="criticalEvents" name="Critical Events" radius={[0, 4, 4, 0]}>
                                {STATE_HISTORY.map((_, i) => (
                                    <Cell key={i} fill={i < 3 ? N.pink : i < 5 ? N.orange : N.cyan} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filters + Table */}
            <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${N.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>ANALYSIS LOG</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {/* Filter */}
                        {['all', 'critical', 'high', 'medium'].map(l => (
                            <button key={l} onClick={() => setFilterLevel(l)}
                                style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${filterLevel === l ? (SEV_COLORS[l] || N.cyan) : N.border}`, background: filterLevel === l ? `${(SEV_COLORS[l] || N.cyan)}15` : 'transparent', color: filterLevel === l ? (SEV_COLORS[l] || N.cyan) : N.textDim, fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>
                                {l.toUpperCase()}
                            </button>
                        ))}
                        {/* Sort */}
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                            style={{ padding: '3px 10px', borderRadius: 8, border: `1px solid ${N.border}`, background: N.bgRaised, color: N.textMid, fontSize: 10, cursor: 'pointer', outline: 'none' }}>
                            <option value="date">Sort: Date</option>
                            <option value="score">Sort: Risk Score</option>
                            <option value="conf">Sort: Confidence</option>
                        </select>
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: N.bgRaised }}>
                            {['Date & Time', 'Area', 'Risk Level', 'Score', 'Confidence', 'Rainfall'].map(h => (
                                <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, color: N.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                        {(sorted as any[]).map((h: any) => (
                            <motion.tr key={h.id} variants={fadeUp}
                                style={{ borderTop: `1px solid ${N.border}`, cursor: 'default', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = N.bgRaised)}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <td style={{ padding: '12px 18px', fontSize: 11, color: N.textDim }}>
                                    {new Date(h.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 600, color: N.text }}>{h.area}</td>
                                <td style={{ padding: '12px 18px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, background: `${SEV_COLORS[h.risk_level]}15`, color: SEV_COLORS[h.risk_level], border: `1px solid ${SEV_COLORS[h.risk_level]}30` }}>
                                        {h.risk_level}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 18px', fontWeight: 900, fontSize: 18, color: SEV_COLORS[h.risk_level], textShadow: `0 0 8px ${SEV_COLORS[h.risk_level]}50` }}>{h.risk_score}</td>
                                <td style={{ padding: '12px 18px', fontSize: 13, color: N.cyan }}>{h.confidence}%</td>
                                <td style={{ padding: '12px 18px', fontSize: 13, color: '#3d9bff' }}>{h.rainfall}%</td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </div>
    )
}
