import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { useRiskAnalysis } from '../../hooks/useApiQueries'
import { FeatureImportanceChart } from '../../components/FeatureImportanceChart'
import { fadeUp } from '../../animations/variants'

const STATE_RISKS = [
    { name: 'Bihar', riskLevel: 'critical', riskScore: 89, lat: 25.5, lng: 85.1, rainfall: 85, elevation: 12, populationDensity: 95, coastalDistance: 90 },
    { name: 'Assam', riskLevel: 'critical', riskScore: 85, lat: 26.2, lng: 92.9, rainfall: 90, elevation: 8, populationDensity: 70, coastalDistance: 70 },
    { name: 'Odisha', riskLevel: 'critical', riskScore: 82, lat: 20.9, lng: 85.1, rainfall: 80, elevation: 10, populationDensity: 65, coastalDistance: 10 },
    { name: 'West Bengal', riskLevel: 'high', riskScore: 75, lat: 22.9, lng: 87.9, rainfall: 70, elevation: 5, populationDensity: 85, coastalDistance: 8 },
    { name: 'Jharkhand', riskLevel: 'high', riskScore: 73, lat: 23.6, lng: 85.3, rainfall: 62, elevation: 35, populationDensity: 60, coastalDistance: 80 },
    { name: 'J&K', riskLevel: 'high', riskScore: 72, lat: 33.7, lng: 76.9, rainfall: 60, elevation: 90, populationDensity: 30, coastalDistance: 95 },
    { name: 'Maharashtra', riskLevel: 'high', riskScore: 70, lat: 19.7, lng: 75.7, rainfall: 65, elevation: 30, populationDensity: 90, coastalDistance: 5 },
    { name: 'UP', riskLevel: 'high', riskScore: 68, lat: 26.9, lng: 80.9, rainfall: 55, elevation: 15, populationDensity: 98, coastalDistance: 85 },
    { name: 'Andhra Pradesh', riskLevel: 'high', riskScore: 65, lat: 15.9, lng: 79.7, rainfall: 60, elevation: 20, populationDensity: 72, coastalDistance: 6 },
    { name: 'Meghalaya', riskLevel: 'medium', riskScore: 52, lat: 25.5, lng: 91.4, rainfall: 88, elevation: 60, populationDensity: 20, coastalDistance: 78 },
    { name: 'Tamil Nadu', riskLevel: 'medium', riskScore: 48, lat: 11.1, lng: 78.7, rainfall: 50, elevation: 15, populationDensity: 75, coastalDistance: 5 },
    { name: 'Gujarat', riskLevel: 'medium', riskScore: 45, lat: 22.3, lng: 72.6, rainfall: 35, elevation: 18, populationDensity: 68, coastalDistance: 4 },
    { name: 'Karnataka', riskLevel: 'medium', riskScore: 38, lat: 15.3, lng: 75.7, rainfall: 45, elevation: 42, populationDensity: 60, coastalDistance: 15 },
    { name: 'MP', riskLevel: 'medium', riskScore: 42, lat: 22.9, lng: 78.7, rainfall: 40, elevation: 40, populationDensity: 75, coastalDistance: 88 },
    { name: 'Rajasthan', riskLevel: 'low', riskScore: 20, lat: 27.0, lng: 74.2, rainfall: 10, elevation: 25, populationDensity: 58, coastalDistance: 92 },
    { name: 'Punjab', riskLevel: 'low', riskScore: 25, lat: 31.1, lng: 75.3, rainfall: 20, elevation: 22, populationDensity: 55, coastalDistance: 90 },
    { name: 'Kerala', riskLevel: 'low', riskScore: 30, lat: 10.8, lng: 76.3, rainfall: 75, elevation: 35, populationDensity: 60, coastalDistance: 3 },
    { name: 'Uttarakhand', riskLevel: 'medium', riskScore: 55, lat: 30.1, lng: 79.2, rainfall: 55, elevation: 85, populationDensity: 25, coastalDistance: 92 },
    { name: 'Himachal Pradesh', riskLevel: 'medium', riskScore: 50, lat: 31.1, lng: 77.2, rainfall: 50, elevation: 88, populationDensity: 15, coastalDistance: 94 },
    { name: 'Chhattisgarh', riskLevel: 'medium', riskScore: 44, lat: 21.3, lng: 81.9, rainfall: 42, elevation: 32, populationDensity: 52, coastalDistance: 82 },
]

const RISK_COLORS: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9', low: '#22c55e' }

const ACTION: Record<string, string> = {
    critical: 'Immediate evacuation required',
    high: 'Prepare evacuation plan',
    medium: 'Monitor closely, teams on standby',
    low: 'No immediate action needed',
}

export function RiskMapPage() {
    const { t, selectedState, setSelectedState } = useStore()
    const [filter, setFilter] = useState<string>('all')
    const [payload, setPayload] = useState<any>(null)
    const [showAnalyze, setShowAnalyze] = useState(false)

    const { data: analysis, refetch, isFetching } = useRiskAnalysis(
        payload || { area: 'Bihar', rainfall: 85, elevation: 12, population_density: 95, coastal_distance: 90, historical_index: 65 },
        false
    )

    const handleStateClick = (s: typeof STATE_RISKS[0]) => {
        setSelectedState(s.name)
        setPayload({ area: s.name, rainfall: s.rainfall, elevation: s.elevation, population_density: s.populationDensity, coastal_distance: s.coastalDistance, historical_index: 65 })
        setShowAnalyze(true)
    }

    const filtered = filter === 'all' ? STATE_RISKS : STATE_RISKS.filter(s => s.riskLevel === filter)

    const counts = { critical: STATE_RISKS.filter(s => s.riskLevel === 'critical').length, high: STATE_RISKS.filter(s => s.riskLevel === 'high').length, medium: STATE_RISKS.filter(s => s.riskLevel === 'medium').length, low: STATE_RISKS.filter(s => s.riskLevel === 'low').length }

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Full-screen map */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Map toolbar */}
                <div style={{ padding: '12px 20px', background: '#0f1823', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginRight: 8 }}>🗺️ {t('indiaRiskMap')}</h2>
                    {/* Filter buttons */}
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${filter === f ? RISK_COLORS[f] || '#00d4aa' : '#1e293b'}`, background: filter === f ? `${RISK_COLORS[f] || '#00d4aa'}20` : 'transparent', color: filter === f ? RISK_COLORS[f] || '#00d4aa' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                            {f === 'all' ? `All (${STATE_RISKS.length})` : `${f} (${counts[f]})`}
                        </button>
                    ))}
                    <div style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>Click any zone to analyze</div>
                </div>

                {/* Leaflet map */}
                <div style={{ flex: 1 }}>
                    <MapContainer center={[22.5, 80.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="© CartoDB © OpenStreetMap" />
                        {filtered.map(s => {
                            const isSelected = selectedState === s.name
                            const color = RISK_COLORS[s.riskLevel]
                            return (
                                <CircleMarker key={s.name} center={[s.lat, s.lng]}
                                    radius={isSelected ? 18 : s.riskLevel === 'critical' ? 13 : 10}
                                    pathOptions={{ color, fillColor: color, fillOpacity: isSelected ? 1 : 0.72, weight: isSelected ? 3 : 1, dashArray: isSelected ? undefined : undefined }}
                                    eventHandlers={{ click: () => handleStateClick(s) }}>
                                    <Popup>
                                        <div style={{ color: '#e2e8f0', minWidth: 190 }}>
                                            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>{s.name}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}><span style={{ color: '#64748b' }}>Risk Score</span><span style={{ color, fontWeight: 800, fontSize: 16 }}>{s.riskScore}</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}><span style={{ color: '#64748b' }}>Level</span><span style={{ color, fontWeight: 600, textTransform: 'capitalize' }}>{s.riskLevel}</span></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}><span style={{ color: '#64748b' }}>Rainfall</span><span style={{ color: '#0ea5e9' }}>{s.rainfall}%</span></div>
                                            <div style={{ margin: '10px 0 8px', padding: '6px 8px', background: `${color}15`, borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
                                                📋 {ACTION[s.riskLevel]}
                                            </div>
                                            <button onClick={() => { handleStateClick(s); setTimeout(() => refetch(), 100) }}
                                                style={{ width: '100%', padding: '7px 0', background: '#00d4aa', border: 'none', borderRadius: 7, color: '#0a0e17', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                                                ⚡ Run ML Analysis
                                            </button>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            )
                        })}
                    </MapContainer>
                </div>
            </div>

            {/* Side panel */}
            <AnimatePresence>
                {showAnalyze && (
                    <motion.div initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }}
                        style={{ width: 320, background: '#0c1220', borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
                        {/* Panel header */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{selectedState}</div>
                                <div style={{ fontSize: 11, color: '#64748b' }}>Zone Detail Panel</div>
                            </div>
                            <button onClick={() => setShowAnalyze(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>×</button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, padding: 16 }}>
                            {/* Zone stats */}
                            {(() => {
                                const s = STATE_RISKS.find(x => x.name === selectedState)
                                if (!s) return null
                                const color = RISK_COLORS[s.riskLevel]
                                return (
                                    <>
                                        <div style={{ background: '#0f1823', border: `1px solid ${color}40`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                                <div>
                                                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Risk Score</div>
                                                    <div style={{ fontSize: 48, fontWeight: 900, color, lineHeight: 1 }}>{s.riskScore}</div>
                                                    <div style={{ fontSize: 13, color, fontWeight: 600, textTransform: 'capitalize', marginTop: 4 }}>{s.riskLevel} Risk</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ width: 60, height: 60, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                                                        {s.riskLevel === 'critical' ? '🚨' : s.riskLevel === 'high' ? '⚠️' : s.riskLevel === 'medium' ? '📊' : '✅'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                                {[{ label: 'Rainfall', value: `${s.rainfall}%`, icon: '🌧️' }, { label: 'Elevation', value: `${s.elevation}m`, icon: '⛰️' }, { label: 'Population', value: `${s.populationDensity}%`, icon: '👥' }, { label: 'Coastal Dist.', value: `${s.coastalDistance}%`, icon: '🌊' }].map(m => (
                                                    <div key={m.label} style={{ padding: '8px 10px', background: '#111827', borderRadius: 8 }}>
                                                        <div style={{ fontSize: 10, color: '#64748b' }}>{m.icon} {m.label}</div>
                                                        <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginTop: 2 }}>{m.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 14, padding: '10px 12px', background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 10, fontSize: 12, color: '#94a3b8' }}>
                                            📋 <strong style={{ color: '#e2e8f0' }}>Recommended action:</strong> {ACTION[s.riskLevel]}
                                        </div>

                                        <button onClick={() => refetch()} disabled={isFetching}
                                            style={{ width: '100%', padding: '11px 0', background: isFetching ? '#1a2332' : '#00d4aa', border: 'none', borderRadius: 10, color: isFetching ? '#64748b' : '#0a0e17', fontWeight: 800, fontSize: 14, cursor: isFetching ? 'wait' : 'pointer', marginBottom: 16 }}>
                                            {isFetching ? '⏳ Running ML…' : '⚡ Run Full ML Analysis'}
                                        </button>
                                    </>
                                )
                            })()}

                            {/* Analysis result */}
                            {analysis && (
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                                    <FeatureImportanceChart importance={analysis.feature_importance} t={(k) => k} />
                                    <div style={{ marginTop: 14, background: '#0f1823', border: '1px solid #1e293b', borderRadius: 12, padding: 14 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4aa', marginBottom: 10 }}>⏱️ Golden Hour</div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: analysis.golden_hour_index?.status === 'Critical' ? '#ef4444' : analysis.golden_hour_index?.status === 'Warning' ? '#f59e0b' : '#22c55e' }}>
                                            {analysis.golden_hour_index?.status}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{analysis.golden_hour_index?.message}</div>
                                    </div>
                                    <div style={{ marginTop: 12, background: '#0f1823', border: '1px solid #1e293b', borderRadius: 12, padding: 14 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>📦 Resources Needed</div>
                                        {Object.entries(analysis.recommended_resources || {}).map(([k, v]) => (
                                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, color: '#94a3b8' }}>
                                                <span style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                                                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v as number}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
