import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import type { StateRisk } from './types'

interface IndiaMapProps {
    states: StateRisk[]
    selectedState: string | null
    onStateSelect: (name: string) => void
    sosActiveZone?: string | null
    t: Record<string, string>
}

function riskColor(level: string, isSos?: boolean): string {
    if (isSos) return '#ef4444'
    switch (level) {
        case 'critical': return '#ef4444'
        case 'high': return '#f59e0b'
        case 'medium': return '#0ea5e9'
        default: return '#22c55e'
    }
}

function suggestedAction(level: string): string {
    switch (level) {
        case 'critical': return 'Immediate evacuation required'
        case 'high': return 'Prepare evacuation plans'
        case 'medium': return 'Monitor closely, alert teams'
        default: return 'No immediate action needed'
    }
}

export function IndiaMap({ states, selectedState, onStateSelect, sosActiveZone, t }: IndiaMapProps) {
    return (
        <div style={{ height: 380, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e293b' }}>
            <MapContainer
                center={[22.5, 80.0]}
                zoom={4.5}
                style={{ height: '100%', width: '100%', background: '#0a0e17' }}
                zoomControl={true}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {states.map(state => {
                    const isSos = sosActiveZone === state.name
                    const color = riskColor(state.riskLevel, isSos)
                    const isSelected = selectedState === state.name
                    return (
                        <CircleMarker
                            key={state.name}
                            center={[state.lat, state.lng]}
                            radius={isSelected ? 14 : isSos ? 16 : 10}
                            pathOptions={{
                                color,
                                fillColor: color,
                                fillOpacity: isSos ? 0.95 : isSelected ? 0.9 : 0.7,
                                weight: isSos ? 3 : isSelected ? 2 : 1,
                            }}
                            eventHandlers={{ click: () => onStateSelect(state.name) }}
                        >
                            <Popup>
                                <div style={{ color: '#e2e8f0', minWidth: 180 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{state.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ color: '#64748b' }}>Risk Score</span>
                                        <span style={{ color, fontWeight: 600 }}>{state.riskScore}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ color: '#64748b' }}>Risk Level</span>
                                        <span style={{ color, fontWeight: 600, textTransform: 'capitalize' }}>{state.riskLevel}</span>
                                    </div>
                                    <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 12 }}>
                                        <span style={{ color: '#64748b' }}>Action: </span>
                                        <span>{suggestedAction(state.riskLevel)}</span>
                                    </div>
                                    {isSos && (
                                        <div style={{ marginTop: 8, padding: '4px 8px', background: 'rgba(239,68,68,0.2)', borderRadius: 6, fontSize: 12, color: '#fca5a5', textAlign: 'center' }}>
                                            🚨 SOS ACTIVE
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    )
                })}
            </MapContainer>
        </div>
    )
}
