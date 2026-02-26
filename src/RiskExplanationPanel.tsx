import type { StateRisk } from './types'

interface Props {
    state: StateRisk | null
    rainfall: number
    t: Record<string, string>
}

function calcImpacts(state: StateRisk, rainfall: number) {
    const rainfallImpact = Math.round((rainfall / 100) * 40)
    const elevationImpact = Math.round(((100 - state.elevation) / 100) * 30)
    const populationImpact = Math.round((state.population / 100) * 20)
    const coastalImpact = Math.round(((100 - state.coastalDistance) / 100) * 10)
    return { rainfallImpact, elevationImpact, populationImpact, coastalImpact }
}

function Bar({ pct, color }: { pct: number; color: string }) {
    return (
        <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(pct * 10, 100)}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.5s ease' }} />
        </div>
    )
}

export function RiskExplanationPanel({ state, rainfall, t }: Props) {
    if (!state) {
        return (
            <div className="glass-card" style={{ height: '100%' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4aa', marginBottom: 12 }}>🧠 {t.whyThisRisk}</div>
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 32 }}>
                    Select a zone on the map to see risk explanation
                </p>
            </div>
        )
    }

    const { rainfallImpact, elevationImpact, populationImpact, coastalImpact } = calcImpacts(state, rainfall)
    const factors = [
        { label: 'High Rainfall', value: `+${rainfallImpact}%`, pct: rainfallImpact, color: '#0ea5e9', icon: '🌧️' },
        { label: 'Low Elevation', value: `+${elevationImpact}%`, pct: elevationImpact, color: '#f59e0b', icon: '⛰️' },
        { label: 'High Population', value: `+${populationImpact}%`, pct: populationImpact, color: '#8b5cf6', icon: '👥' },
        { label: 'Coastal Proximity', value: `+${coastalImpact}%`, pct: coastalImpact, color: '#ef4444', icon: '🌊' },
    ]

    return (
        <div className="glass-card" style={{ height: '100%' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4aa', marginBottom: 12 }}>🧠 {t.whyThisRisk}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                Analyzing <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{state.name}</span> — Risk Score: <span style={{ color: '#ef4444', fontWeight: 700 }}>{state.riskScore}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {factors.map(f => (
                    <div key={f.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                            <span style={{ color: '#94a3b8' }}>{f.icon} {f.label}</span>
                            <span style={{ color: f.color, fontWeight: 600 }}>{f.value}</span>
                        </div>
                        <Bar pct={f.pct} color={f.color} />
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 14, padding: '8px 10px', background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 8, fontSize: 11, color: '#94a3b8' }}>
                💡 Primary factor: {factors.sort((a, b) => b.pct - a.pct)[0].label} contributing {factors.sort((a, b) => b.pct - a.pct)[0].value} to overall risk
            </div>
        </div>
    )
}
