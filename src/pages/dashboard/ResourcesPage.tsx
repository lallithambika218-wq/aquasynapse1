import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { useResources } from '../../hooks/useApiQueries'
import { staggerContainer, fadeUp } from '../../animations/variants'
import {
    RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
    PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

const N = {
    cyan: '#00fff5', green: '#39ff14', pink: '#ff2d78', orange: '#ff6b00',
    bgCard: '#080f1e', bgRaised: '#0c1428',
    border: 'rgba(0,255,245,0.12)', text: '#e0f4ff', textMid: '#7ec8d4', textDim: '#2d5c6e',
    glowC: '0 0 8px rgba(0,255,245,0.5)',
}

const RESOURCE_DESCRIPTIONS: Record<string, { icon: string; desc: string; unit: string; criticalThreshold: number; stateDeployment: string }> = {
    'Rescue Boats': { icon: '⛵', desc: 'Flood evacuation — Bihar, Assam, Odisha', unit: 'boats', criticalThreshold: 0.4, stateDeployment: 'Bihar: 18 · Assam: 10 · Odisha: 8' },
    'Ambulances': { icon: '🚑', desc: 'Emergency medical transport', unit: 'units', criticalThreshold: 0.5, stateDeployment: 'MH: 8 · WB: 7 · UP: 7' },
    'Food Kits': { icon: '📦', desc: '3-day emergency nutrition packs', unit: 'kits', criticalThreshold: 0.6, stateDeployment: 'Bihar: 160 · Assam: 130 · Odisha: 120' },
    'Medical Teams': { icon: '⚕️', desc: 'Field medical response teams', unit: 'teams', criticalThreshold: 0.5, stateDeployment: 'Bihar: 5 · MH: 4 · WB: 4 · Others: 2' },
    'Helicopters': { icon: '🚁', desc: 'Aerial rescue — J&K, Uttarakhand', unit: 'aircraft', criticalThreshold: 0.3, stateDeployment: 'J&K: 2 · Uttarakhand: 1' },
    'Evacuation Buses': { icon: '🚌', desc: 'Mass civilian transport', unit: 'buses', criticalThreshold: 0.45, stateDeployment: 'Assam: 4 · Bihar: 3 · Odisha: 2' },
}

// State-wise deployment data
const STATE_DEPLOYMENT = [
    { state: 'Bihar', boats: 18, ambulances: 5, foodKits: 160, buses: 3 },
    { state: 'Assam', boats: 10, ambulances: 4, foodKits: 130, buses: 4 },
    { state: 'Odisha', boats: 8, ambulances: 4, foodKits: 120, buses: 2 },
    { state: 'WB', boats: 0, ambulances: 7, foodKits: 0, buses: 0 },
    { state: 'MH', boats: 0, ambulances: 8, foodKits: 0, buses: 0 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
            <div style={{ color: N.textMid, marginBottom: 4 }}>{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color || N.cyan, fontWeight: 600 }}>{p.name}: {p.value}</div>
            ))}
        </div>
    )
}

export function ResourcesPage() {
    const { t, riskScore } = useStore()
    const { data, isLoading } = useResources(riskScore)
    const [selectedResource, setSelectedResource] = useState<string | null>(null)

    const resources = data?.resources || [
        { name: 'Rescue Boats', icon: '⛵', current: 36, total: 50 },
        { name: 'Ambulances', icon: '🚑', current: 22, total: 30 },
        { name: 'Food Kits', icon: '📦', current: 410, total: 500 },
        { name: 'Medical Teams', icon: '⚕️', current: 15, total: 20 },
        { name: 'Helicopters', icon: '🚁', current: 3, total: 5 },
        { name: 'Evacuation Buses', icon: '🚌', current: 9, total: 15 },
    ]

    const totalPct = resources.reduce((acc: number, r: any) => acc + (r.current / r.total), 0) / resources.length

    // Pie data for overall resource deployment
    const pieData = resources.map((r: any) => ({
        name: r.name.split(' ')[0],
        value: Math.round((r.current / r.total) * 100),
        color: (r.current / r.total) < 0.4 ? N.pink : (r.current / r.total) < 0.7 ? N.orange : N.cyan,
    }))

    return (
        <div style={{ padding: 24, overflowY: 'auto', height: '100%', background: 'transparent' }}>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 2, marginBottom: 4, textShadow: N.glowC }}>
                    📦 RESOURCE ALLOCATION
                </h1>
                <p style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>LIVE DEPLOYMENT STATUS · RISK SCORE: {riskScore} · ALL-INDIA VIEW</p>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                {[
                    { label: 'Overall Deployment', value: `${Math.round(totalPct * 100)}%`, color: totalPct > 0.7 ? N.pink : N.cyan, icon: '📊' },
                    { label: 'Low Stock Resources', value: resources.filter((r: any) => (r.current / r.total) < 0.5).length, color: N.orange, icon: '⚠️' },
                    { label: 'At Capacity', value: resources.filter((r: any) => (r.current / r.total) >= 0.9).length, color: N.pink, icon: '🔴' },
                ].map(s => (
                    <div key={s.label} style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 32 }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, textShadow: `0 0 10px ${s.color}40` }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: N.textDim, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 18, marginBottom: 20 }}>

                {/* Deployment Donut */}
                <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>
                        🍩 DEPLOYMENT MIX
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} opacity={0.85} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val: any, name: any) => [`${val}% deployed`, name]}
                                contentStyle={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 8, fontSize: 11 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        {pieData.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: N.textMid }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                {d.name}: <strong style={{ color: d.color }}>{d.value}%</strong>
                            </div>
                        ))}
                    </div>
                </div>

                {/* State-wise deployment bar chart */}
                <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>
                        🗺️ STATE-WISE DEPLOYMENT (TOP 5)
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={STATE_DEPLOYMENT} barSize={14}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,245,0.04)" />
                            <XAxis dataKey="state" tick={{ fill: N.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: N.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 10, color: N.textMid }} />
                            <Bar dataKey="boats" name="Boats" fill={N.cyan} opacity={0.85} radius={[3, 3, 0, 0]} />
                            <Bar dataKey="ambulances" name="Ambulances" fill={N.pink} opacity={0.8} radius={[3, 3, 0, 0]} />
                            <Bar dataKey="buses" name="Buses" fill={N.orange} opacity={0.8} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Resource Cards */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
                {resources.map((r: any) => {
                    const meta = RESOURCE_DESCRIPTIONS[r.name] || { icon: '📌', desc: 'Emergency resource', unit: 'units', criticalThreshold: 0.5, stateDeployment: '—' }
                    const pct = r.current / r.total
                    const status = pct >= 0.9 ? 'critical' : pct >= 0.6 ? 'high' : 'normal'
                    const statusColor = status === 'critical' ? N.pink : status === 'high' ? N.orange : N.green
                    const barColor = pct < meta.criticalThreshold ? N.pink : pct < 0.7 ? N.orange : N.cyan
                    const isSelected = selectedResource === r.name

                    return (
                        <motion.div key={r.name} variants={fadeUp}
                            whileHover={{ y: -3, boxShadow: `0 8px 28px ${barColor}15` }}
                            onClick={() => setSelectedResource(isSelected ? null : r.name)}
                            style={{ background: N.bgCard, border: `1px solid ${isSelected ? barColor : N.border}`, boxShadow: isSelected ? `0 0 16px ${barColor}20` : 'none', borderRadius: 14, padding: 22, cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 48, height: 48, background: N.bgRaised, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: `1px solid ${N.border}` }}>
                                        {r.icon || meta.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: N.text }}>{r.name}</div>
                                        <div style={{ fontSize: 10, color: N.textDim, marginTop: 2 }}>{meta.desc}</div>
                                    </div>
                                </div>
                                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${statusColor}15`, color: statusColor, textTransform: 'uppercase', letterSpacing: 1, border: `1px solid ${statusColor}30` }}>
                                    {status === 'critical' ? 'Full' : status === 'high' ? 'High' : 'OK'}
                                </span>
                            </div>

                            <div key={r.current} style={{ fontSize: 38, fontWeight: 900, color: barColor, textShadow: `0 0 10px ${barColor}40`, marginBottom: 6 }}>
                                {r.current}<span style={{ fontSize: 16, color: N.textDim, fontWeight: 400 }}>/{r.total} {meta.unit}</span>
                            </div>

                            <div style={{ height: 8, background: 'rgba(0,255,245,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                    style={{ height: '100%', background: `linear-gradient(90deg, ${barColor}80, ${barColor})`, borderRadius: 999, boxShadow: `0 0 8px ${barColor}60` }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: N.textDim, marginBottom: isSelected ? 10 : 0 }}>
                                <span>Deployed: <strong style={{ color: barColor }}>{Math.round(pct * 100)}%</strong></span>
                                <span>Available: <strong style={{ color: N.text }}>{r.total - r.current} {meta.unit}</strong></span>
                            </div>

                            {/* Expanded state deployment info */}
                            {isSelected && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    style={{ marginTop: 12, padding: '10px 12px', background: N.bgRaised, borderRadius: 8, border: `1px solid ${N.border}` }}>
                                    <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 4 }}>STATE DEPLOYMENT BREAKDOWN</div>
                                    <div style={{ fontSize: 11, color: N.textMid }}>{meta.stateDeployment}</div>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}
