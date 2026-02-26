interface ExportPanelProps {
    riskScore: number
    confidence: number
    selectedState: string | null
    rainfall: number
    t: Record<string, string>
    onClose: () => void
}

export function ExportPanel({ riskScore, confidence, selectedState, rainfall, t, onClose }: ExportPanelProps) {
    const payload = {
        timestamp: new Date().toISOString(),
        analysisArea: selectedState || 'India Overview',
        riskMetrics: { riskScore, confidence, rainfall },
        weather: { rainfall, windSpeed: 28, humidity: 78, condition: 'Heavy Rain' },
        resources: { boats: 36, ambulances: 22, foodKits: 410, medicalTeams: 15 },
        shelter: { available: 3, total: 5, totalCapacity: 7100 },
        generatedBy: 'AquaSynapse AI v2.0',
    }

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aquasynapse-analysis-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const downloadCSV = () => {
        const rows = [
            ['Field', 'Value'],
            ['Timestamp', payload.timestamp],
            ['Area', payload.analysisArea],
            ['Risk Score', String(riskScore)],
            ['Confidence', String(confidence)],
            ['Rainfall', String(rainfall)],
            ['Boats', '36'],
            ['Ambulances', '22'],
            ['Food Kits', '410'],
            ['Medical Teams', '15'],
        ]
        const csv = rows.map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aquasynapse-analysis-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const btn = (label: string, onClick: () => void, color: string) => (
        <button
            onClick={onClick}
            style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: color, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 8, transition: 'opacity 0.2s' }}
        >
            {label}
        </button>
    )

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box animate-fade-in" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ color: '#00d4aa', fontWeight: 700 }}>📤 {t.exportData}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>×</button>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                    Export current analysis for <strong style={{ color: '#e2e8f0' }}>{payload.analysisArea}</strong>
                </div>
                {btn('⬇️ Export as JSON', downloadJSON, '#00d4aa')}
                {btn('⬇️ Export as CSV', downloadCSV, '#0ea5e9')}
                <button
                    onClick={() => alert('PDF export requires a PDF library. Hook ready!')}
                    style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: '1px solid #1e293b', background: 'transparent', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                    🖨️ Export as PDF (Hook Ready)
                </button>
            </div>
        </div>
    )
}
