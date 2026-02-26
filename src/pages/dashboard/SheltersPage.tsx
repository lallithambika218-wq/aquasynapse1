import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { useShelters } from '../../hooks/useApiQueries'
import { staggerContainer, fadeUp } from '../../animations/variants'

export function SheltersPage() {
    const { t, riskScore } = useStore()
    const { data, isLoading } = useShelters(riskScore)

    const shelters = data?.shelters || [
        { id: 's1', name: 'Green Valley School', capacity: 1200, current_occupancy: 340, safety: 'Safe', distance_km: 2.3, facilities: ['Medical', 'Food', 'Water'] },
        { id: 's2', name: 'City Hall Shelter', capacity: 800, current_occupancy: 620, safety: 'At Risk', distance_km: 5.1, facilities: ['Food', 'Water'] },
        { id: 's3', name: 'Hilltop Complex', capacity: 1500, current_occupancy: 200, safety: 'Safe', distance_km: 7.8, facilities: ['Medical', 'Food', 'Water', 'Power'] },
        { id: 's4', name: 'District Stadium', capacity: 3000, current_occupancy: 450, safety: 'Safe', distance_km: 12.4, facilities: ['Medical', 'Food', 'Water', 'Power', 'Comms'] },
        { id: 's5', name: 'Community Center', capacity: 600, current_occupancy: 600, safety: 'Full', distance_km: 3.2, facilities: ['Food', 'Water'] },
        { id: 's6', name: 'Railway Station Hall', capacity: 2000, current_occupancy: 800, safety: 'Safe', distance_km: 6.5, facilities: ['Medical', 'Food'] },
    ]

    const totalCapacity = shelters.reduce((a: number, s: any) => a + s.capacity, 0)
    const totalOccupied = shelters.reduce((a: number, s: any) => a + (s.current_occupancy || 0), 0)
    const available = shelters.filter((s: any) => s.safety === 'Safe').length
    const full = shelters.filter((s: any) => s.safety === 'Full').length

    const facilityColors: Record<string, string> = {
        Medical: '#ef4444', Food: '#22c55e', Water: '#0ea5e9',
        Power: '#f59e0b', Comms: '#8b5cf6',
    }

    return (
        <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>🏠 {t('shelterRecommendation')}</h1>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                    Available shelters filtered by risk score ({riskScore}) — sorted by distance
                </p>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                {[
                    { label: 'Total Shelters', value: shelters.length, icon: '🏠', color: '#e2e8f0' },
                    { label: 'Safe & Open', value: available, icon: '✅', color: '#22c55e' },
                    { label: 'Total Capacity', value: totalCapacity.toLocaleString(), icon: '👥', color: '#0ea5e9' },
                    { label: 'Currently Full', value: full, icon: '🚫', color: '#ef4444' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#0f1823', border: '1px solid #1e293b', borderRadius: 14, padding: '16px 20px' }}>
                        <div style={{ fontSize: 24 }}>{s.icon}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Overall capacity bar */}
            <div style={{ background: '#0f1823', border: '1px solid #1e293b', borderRadius: 14, padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Overall Occupancy</span>
                    <span style={{ fontSize: 14, color: '#64748b' }}>{totalOccupied.toLocaleString()} / {totalCapacity.toLocaleString()}</span>
                </div>
                <div style={{ height: 10, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(totalOccupied / totalCapacity) * 100}%` }}
                        transition={{ duration: 1.2 }}
                        style={{ height: '100%', background: totalOccupied / totalCapacity > 0.8 ? '#ef4444' : '#00d4aa', borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{Math.round((totalOccupied / totalCapacity) * 100)}% occupied — {(totalCapacity - totalOccupied).toLocaleString()} spaces available</div>
            </div>

            {/* Shelter cards */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
                {(shelters as any[]).map((s: any) => {
                    const pct = (s.current_occupancy || 0) / s.capacity
                    const safetyColor = s.safety === 'Safe' ? '#22c55e' : s.safety === 'Full' ? '#ef4444' : '#f59e0b'
                    return (
                        <motion.div key={s.id || s.name} variants={fadeUp}
                            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}
                            style={{ background: '#0f1823', border: `1px solid ${safetyColor}30`, borderRadius: 14, padding: 22 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{s.name}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>📍 {s.distance_km} km away</div>
                                </div>
                                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${safetyColor}20`, color: safetyColor }}>
                                    {s.safety}
                                </span>
                            </div>

                            {/* Capacity bar */}
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, color: '#64748b' }}>
                                    <span>Occupancy</span>
                                    <span>{(s.current_occupancy || 0).toLocaleString()} / {s.capacity.toLocaleString()}</span>
                                </div>
                                <div style={{ height: 7, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1 }}
                                        style={{ height: '100%', background: pct > 0.85 ? '#ef4444' : pct > 0.6 ? '#f59e0b' : '#22c55e', borderRadius: 999 }} />
                                </div>
                            </div>

                            {/* Facilities */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {(s.facilities || [] as string[]).map((f: string) => (
                                    <span key={f} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${facilityColors[f] || '#64748b'}20`, color: facilityColors[f] || '#64748b' }}>
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}
