import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { useRiskAnalysis } from '../../hooks/useApiQueries'
import { FeatureImportanceChart } from '../../components/FeatureImportanceChart'
import { KpiCard } from '../../components/KpiCard'
import { staggerContainer, fadeUp } from '../../animations/variants'
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts'

const N = {
    cyan: '#00fff5', green: '#39ff14', pink: '#ff2d78', orange: '#ff6b00',
    bgCard: '#080f1e', bgRaised: '#0c1428',
    border: 'rgba(0,255,245,0.12)', borderHi: 'rgba(0,255,245,0.35)',
    text: '#e0f4ff', textMid: '#7ec8d4', textDim: '#2d5c6e',
    glowC: '0 0 8px rgba(0,255,245,0.5)',
}

const PRESETS = [
    { label: '🌊 Flash Flood — Bihar', color: N.cyan, payload: { area: 'Bihar - Patna', rainfall: 92, elevation: 8, population_density: 95, coastal_distance: 90, historical_index: 85 } },
    { label: '🌀 Cyclone — Odisha Coast', color: N.pink, payload: { area: 'Odisha - Bhubaneswar', rainfall: 85, elevation: 10, population_density: 65, coastal_distance: 10, historical_index: 70 } },
    { label: '🏔️ Landslide — J&K', color: N.orange, payload: { area: 'J&K - Srinagar', rainfall: 65, elevation: 90, population_density: 30, coastal_distance: 95, historical_index: 55 } },
    { label: '🌧️ Urban Flood — Mumbai', color: '#a78bfa', payload: { area: 'Maharashtra - Mumbai', rainfall: 78, elevation: 5, population_density: 98, coastal_distance: 3, historical_index: 72 } },
    { label: '🏜️ Drought — Rajasthan', color: '#f0c040', payload: { area: 'Rajasthan - Jodhpur', rainfall: 5, elevation: 25, population_density: 58, coastal_distance: 92, historical_index: 40 } },
    { label: '⛰️ Landslip — Uttarakhand', color: N.green, payload: { area: 'Uttarakhand - Dehradun', rainfall: 70, elevation: 82, population_density: 22, coastal_distance: 94, historical_index: 60 } },
]

const SevColor = (score: number) => score >= 70 ? N.pink : score >= 45 ? N.orange : N.green

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color || N.cyan, fontWeight: 600 }}>{p.name}: {p.value}</div>
            ))}
        </div>
    )
}

export function SimulationPage() {
    const { t } = useStore()
    const [rainfall, setRainfall] = useState(65)
    const [elevation, setElevation] = useState(20)
    const [population, setPopulation] = useState(70)
    const [coastal, setCoastal] = useState(50)
    const [historical, setHistorical] = useState(55)
    const [area, setArea] = useState('Custom Simulation')
    const [hasRun, setHasRun] = useState(false)
    const [scoreHistory, setScoreHistory] = useState<{ step: number; score: number }[]>([])

    const payload = { area, rainfall, elevation, population_density: population, coastal_distance: coastal, historical_index: historical }
    const { data: analysis, refetch, isFetching } = useRiskAnalysis(payload, false)

    const riskPreview = Math.min(100, Math.round(rainfall * 0.30 + Math.max(0, 100 - elevation) * 0.25 + population * 0.20 + Math.max(0, 100 - coastal) * 0.15 + historical * 0.10))

    const runAnalysis = async () => {
        await refetch()
        setHasRun(true)
        setScoreHistory(prev => [...prev.slice(-9), { step: prev.length + 1, score: riskPreview }])
    }

    const loadPreset = (p: typeof PRESETS[0]) => {
        setArea(p.payload.area)
        setRainfall(p.payload.rainfall)
        setElevation(p.payload.elevation)
        setPopulation(p.payload.population_density)
        setCoastal(p.payload.coastal_distance)
        setHistorical(p.payload.historical_index)
    }

    // Radar chart data derived from current slider values
    const radarData = [
        { factor: 'Rainfall', value: rainfall, fullMark: 100 },
        { factor: 'Pop. Density', value: population, fullMark: 100 },
        { factor: 'Historical', value: historical, fullMark: 100 },
        { factor: 'Low Elev.', value: Math.max(0, 100 - elevation), fullMark: 100 },
        { factor: 'Coast Risk', value: Math.max(0, 100 - coastal), fullMark: 100 },
    ]

    const sliders = [
        { label: '🌧️ Rainfall Intensity', value: rainfall, set: setRainfall, color: '#3d9bff', desc: 'mm/hr normalized' },
        { label: '⛰️ Elevation', value: elevation, set: setElevation, color: N.orange, desc: 'Higher = safer terrain' },
        { label: '👥 Population Density', value: population, set: setPopulation, color: '#a78bfa', desc: 'People at risk index' },
        { label: '🌊 Coastal Distance', value: coastal, set: setCoastal, color: N.pink, desc: 'Higher = inland/safer' },
        { label: '📅 Historical Index', value: historical, set: setHistorical, color: N.green, desc: 'Past disaster frequency' },
    ]

    const riskColor = SevColor(riskPreview)

    return (
        <div style={{ padding: 24, overflowY: 'auto', height: '100%', background: 'transparent' }}>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 2, marginBottom: 4, textShadow: N.glowC }}>
                    📈 WHAT-IF SIMULATION ENGINE
                </h1>
                <p style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>ADJUST PARAMETERS · RUN ML MODEL · ANALYSE DISASTER SCENARIOS</p>
            </div>

            {/* Presets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                {PRESETS.map(p => (
                    <button key={p.label} onClick={() => loadPreset(p)}
                        style={{ padding: '9px 14px', background: N.bgCard, border: `1px solid ${area === p.payload.area ? p.color : N.border}`, borderRadius: 10, color: area === p.payload.area ? p.color : N.textMid, fontSize: 11, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: area === p.payload.area ? 700 : 400, boxShadow: area === p.payload.area ? `0 0 12px ${p.color}20` : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = p.color)}
                        onMouseLeave={e => { if (area !== p.payload.area) e.currentTarget.style.borderColor = N.border }}>
                        {p.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
                {/* Controls Column */}
                <div>
                    {/* Sliders */}
                    <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>🎛️ PARAMETERS</div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 10, color: N.textDim, letterSpacing: 1 }}>AREA / LOCATION</label>
                            <input value={area} onChange={e => setArea(e.target.value)}
                                style={{ width: '100%', marginTop: 6, padding: '8px 12px', background: N.bgRaised, border: `1px solid ${N.border}`, borderRadius: 8, color: N.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        {sliders.map(s => (
                            <div key={s.label} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                                    <span style={{ color: N.textMid }}>{s.label}</span>
                                    <span style={{ color: s.color, fontWeight: 900, fontSize: 14 }}>{s.value}</span>
                                </div>
                                <input type="range" min={0} max={100} value={s.value} onChange={e => s.set(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: s.color }} />
                                <div style={{ fontSize: 9, color: N.textDim, marginTop: 2, letterSpacing: 1 }}>{s.desc}</div>
                            </div>
                        ))}

                        {/* Live Risk Preview */}
                        <div style={{ background: N.bgRaised, borderRadius: 12, padding: 14, textAlign: 'center', marginBottom: 14, border: `1px solid ${riskColor}30` }}>
                            <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 2, marginBottom: 4 }}>LIVE PREVIEW</div>
                            <div style={{ fontSize: 48, fontWeight: 900, color: riskColor, textShadow: `0 0 20px ${riskColor}60`, lineHeight: 1 }}>{riskPreview}</div>
                            <div style={{ fontSize: 10, color: N.textDim, marginTop: 4, letterSpacing: 1 }}>
                                {riskPreview >= 70 ? '🔴 CRITICAL' : riskPreview >= 45 ? '🟠 HIGH' : '🟢 MODERATE'}
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={runAnalysis} disabled={isFetching}
                            style={{ width: '100%', padding: '13px 0', background: isFetching ? N.bgRaised : `linear-gradient(135deg, ${N.cyan}, #0ea5e9)`, border: 'none', borderRadius: 10, color: isFetching ? N.textDim : '#0a0e17', fontWeight: 900, fontSize: 14, cursor: isFetching ? 'wait' : 'pointer', letterSpacing: 1, fontFamily: 'Orbitron, monospace' }}>
                            {isFetching ? '⏳ RUNNING ML…' : '⚡ RUN ML ANALYSIS'}
                        </motion.button>
                    </div>
                </div>

                {/* Results Column */}
                <div>
                    {/* Radar Chart */}
                    <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>🕸️ RISK FACTOR RADAR</div>
                        <div style={{ fontSize: 10, color: N.textDim, marginBottom: 10, letterSpacing: 1 }}>Live updates as you adjust sliders</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(0,255,245,0.1)" />
                                    <PolarAngleAxis dataKey="factor" tick={{ fill: N.textMid, fontSize: 10 }} />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Risk Profile" dataKey="value" stroke={riskColor} fill={riskColor} fillOpacity={0.2} strokeWidth={2} />
                                    <Tooltip content={<CustomTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>

                            {/* Run history mini-chart */}
                            <div>
                                <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 1, marginBottom: 8 }}>RUN HISTORY</div>
                                {scoreHistory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={150}>
                                        <AreaChart data={scoreHistory}>
                                            <defs>
                                                <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={N.cyan} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={N.cyan} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,245,0.04)" />
                                            <XAxis dataKey="step" tick={{ fill: N.textDim, fontSize: 8 }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[0, 100]} tick={{ fill: N.textDim, fontSize: 8 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="score" name="Risk Score" stroke={N.cyan} fill="url(#gScore)" strokeWidth={2} dot={{ fill: N.cyan, r: 3 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ padding: '30px 10px', textAlign: 'center', color: N.textDim, fontSize: 11, letterSpacing: 1 }}>
                                        RUN SIMULATION<br />TO TRACK SCORES
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ML Results */}
                    {!hasRun && !isFetching && (
                        <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 40, textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 14 }}>🧠</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: N.text, marginBottom: 8, fontFamily: 'Orbitron, monospace' }}>READY TO SIMULATE</div>
                            <div style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>SELECT A PRESET OR ADJUST SLIDERS · THEN RUN ML MODEL</div>
                        </div>
                    )}

                    <AnimatePresence>
                        {analysis && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                {/* ML Result */}
                                <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 22, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                                        <div>
                                            <div style={{ fontSize: 12, color: N.textDim, letterSpacing: 1, marginBottom: 4 }}>ML ANALYSIS — {analysis.area}</div>
                                            <div style={{ fontSize: 10, color: N.textDim }}>Model: {analysis.model_source?.replace(/_/g, ' ')}</div>
                                        </div>
                                        <span style={{
                                            padding: '5px 14px', borderRadius: 20, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
                                            background: `${SevColor(analysis.risk_score)}15`, color: SevColor(analysis.risk_score), border: `1px solid ${SevColor(analysis.risk_score)}30`
                                        }}>
                                            {analysis.risk_level}
                                        </span>
                                    </div>
                                    <motion.div variants={staggerContainer} initial="hidden" animate="visible"
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                                        <motion.div variants={fadeUp}><KpiCard label="Risk Score" value={analysis.risk_score} color={SevColor(analysis.risk_score)} icon="⚡" /></motion.div>
                                        <motion.div variants={fadeUp}><KpiCard label="Confidence" value={analysis.confidence} suffix="%" color={N.cyan} icon="🧠" /></motion.div>
                                        <motion.div variants={fadeUp}><KpiCard label="Golden Hour" value={analysis.golden_hour_index?.status || '—'} color={analysis.golden_hour_index?.status === 'Critical' ? N.pink : N.orange} icon="⏱️" isAnimated={false} subLabel={analysis.golden_hour_index?.message} /></motion.div>
                                    </motion.div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <FeatureImportanceChart importance={analysis.feature_importance} t={(k) => k} />
                                    <div style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 14, padding: 20 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>📦 RESOURCES NEEDED</div>
                                        {Object.entries(analysis.recommended_resources || {}).map(([k, v]) => (
                                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '6px 10px', background: N.bgRaised, borderRadius: 8 }}>
                                                <span style={{ fontSize: 12, color: N.textMid, textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                                                <span style={{ fontSize: 13, color: N.cyan, fontWeight: 700 }}>{v as number}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
