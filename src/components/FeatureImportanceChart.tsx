import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'

interface Props {
    importance: Record<string, number>
    t: (k: string) => string
}

const ICONS: Record<string, string> = {
    rainfall: '🌧️',
    elevation: '⛰️',
    population_density: '👥',
    coastal_distance: '🌊',
    historical_index: '📊',
}

const LABELS: Record<string, string> = {
    rainfall: 'Rainfall',
    elevation: 'Elevation',
    population_density: 'Population',
    coastal_distance: 'Coastal Dist.',
    historical_index: 'Historical',
}

const COLORS: Record<string, string> = {
    rainfall: '#0ea5e9',
    elevation: '#f59e0b',
    population_density: '#8b5cf6',
    coastal_distance: '#ef4444',
    historical_index: '#22c55e',
}

export function FeatureImportanceChart({ importance, t }: Props) {
    const sorted = Object.entries(importance).sort(([, a], [, b]) => b - a)
    const max = Math.max(...Object.values(importance), 1)

    return (
        <div style={{ background: '#0f1823', border: '1px solid #1e293b', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4aa', marginBottom: 16 }}>
                🧠 {t('featureImportance')}
            </div>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sorted.map(([key, val]) => (
                    <motion.div key={key} variants={fadeUp}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                            <span style={{ color: '#94a3b8' }}>{ICONS[key] || '📌'} {LABELS[key] || key}</span>
                            <span style={{ color: COLORS[key] || '#00d4aa', fontWeight: 700 }}>{val.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: 6, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(val / max) * 100}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                                style={{ height: '100%', background: COLORS[key] || '#00d4aa', borderRadius: 999 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            <div style={{ marginTop: 14, padding: '8px 10px', background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.12)', borderRadius: 8, fontSize: 11, color: '#64748b' }}>
                💡 Top driver: <span style={{ color: '#00d4aa', fontWeight: 600 }}>{LABELS[sorted[0]?.[0]] || sorted[0]?.[0] || 'N/A'}</span>
            </div>
        </div>
    )
}
