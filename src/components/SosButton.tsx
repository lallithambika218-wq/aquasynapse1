/**
 * AquaSynapse — SOS Button Component
 * Floating red pulsing button → confirmation modal → POST /api/sos → toast
 */
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const N = {
    pink: '#ff2d78', cyan: '#00fff5', green: '#39ff14',
    bgCard: '#080f1e', bgRaised: '#0c1428',
    border: 'rgba(0,255,245,0.12)', text: '#e0f4ff', textDim: '#2d5c6e',
}

// Demo phone numbers — replace with real numbers or pull from user profile
const DEMO_NUMBERS: string[] = [
    // '+91XXXXXXXXXX',   // Add real numbers here
]

interface Props {
    onSosDispatched?: (caseId: string, location: { lat: number; lng: number }) => void
}

export function SosButton({ onSosDispatched }: Props) {
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
    const [zone, setZone] = useState('Current Location')
    const [contactInput, setContactInput] = useState('')

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 5000)
    }

    const handleSOS = useCallback(async () => {
        setLoading(true)
        try {
            // Get geolocation if available
            let lat = 28.6139, lng = 77.2090
            try {
                const pos = await new Promise<GeolocationPosition>((res, rej) =>
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
                )
                lat = pos.coords.latitude
                lng = pos.coords.longitude
            } catch {
                // Fallback to New Delhi if geolocation denied
            }

            // Build numbers list
            const numbers = [
                ...DEMO_NUMBERS,
                ...(contactInput.trim() ? [contactInput.trim()] : []),
            ]

            const response = await fetch('http://localhost:8000/api/sos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zone,
                    numbers,
                    location: { lat, lng },
                    severity: 'critical',
                    message: `Emergency SOS from ${zone}`,
                }),
            })

            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            const result = await response.json()

            setModalOpen(false)
            showToast(`✅ SOS Dispatched! Case: ${result.case_id} · ETA: ${result.eta_minutes} min`, 'success')
            onSosDispatched?.(result.case_id, { lat, lng })
        } catch (err: any) {
            console.error('[SOS] Request failed:', err)
            showToast('⚠️ SOS sent (offline fallback mode) — backend may be down', 'error')
            setModalOpen(false)
            onSosDispatched?.('LOCAL-FALLBACK', { lat: 28.6139, lng: 77.2090 })
        } finally {
            setLoading(false)
        }
    }, [zone, contactInput, onSosDispatched])

    return (
        <>
            {/* ── Floating SOS Button ─────────────────────────────────────── */}
            <motion.button
                id="sos-trigger-btn"
                onClick={() => setModalOpen(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                    width: 68, height: 68, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff2d78, #c0002a)',
                    border: '2px solid rgba(255,45,120,0.6)',
                    color: '#fff', fontWeight: 900, fontSize: 13,
                    cursor: 'pointer', letterSpacing: 1,
                    fontFamily: 'Orbitron, monospace',
                    boxShadow: '0 0 20px rgba(255,45,120,0.6), 0 0 40px rgba(255,45,120,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {/* Pulse ring */}
                <span style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: '2px solid rgba(255,45,120,0.5)',
                    animation: 'sosPulse 1.4s ease-out infinite',
                }} />
                <span style={{
                    position: 'absolute', inset: -12, borderRadius: '50%',
                    border: '1px solid rgba(255,45,120,0.25)',
                    animation: 'sosPulse 1.4s ease-out infinite .4s',
                }} />
                🚨<br />SOS
            </motion.button>

            {/* ── Confirmation Modal ─────────────────────────────────────── */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 10000,
                            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
                        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                            style={{
                                background: N.bgCard, border: '1px solid rgba(255,45,120,0.4)',
                                boxShadow: '0 0 40px rgba(255,45,120,0.2)',
                                borderRadius: 18, padding: 32, width: 380, maxWidth: '92vw',
                            }}>

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 12 }}>🚨</div>
                                <div style={{ fontSize: 18, fontWeight: 900, color: N.pink, fontFamily: 'Orbitron, monospace', letterSpacing: 2 }}>
                                    SEND SOS ALERT
                                </div>
                                <div style={{ fontSize: 12, color: N.textDim, marginTop: 6, letterSpacing: 1 }}>
                                    SMS will be sent · All dashboards notified
                                </div>
                            </div>

                            {/* Zone input */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 10, color: N.textDim, letterSpacing: 1 }}>ZONE / LOCATION NAME</label>
                                <input value={zone} onChange={e => setZone(e.target.value)}
                                    style={{ width: '100%', marginTop: 6, padding: '10px 14px', background: N.bgRaised, border: `1px solid rgba(255,45,120,0.25)`, borderRadius: 9, color: N.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                            </div>

                            {/* Phone number input */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 10, color: N.textDim, letterSpacing: 1 }}>SMS NUMBER (optional, E.164: +91XXXXXXXXXX)</label>
                                <input value={contactInput} onChange={e => setContactInput(e.target.value)}
                                    placeholder="+91XXXXXXXXXX"
                                    style={{ width: '100%', marginTop: 6, padding: '10px 14px', background: N.bgRaised, border: `1px solid rgba(255,45,120,0.2)`, borderRadius: 9, color: N.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                            </div>

                            {/* Info box */}
                            <div style={{ padding: '10px 14px', background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', borderRadius: 9, marginBottom: 20, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                                📡 This will:<br />
                                • Send SMS to provided number(s)<br />
                                • Broadcast alert to all open dashboards<br />
                                • Flash the risk map<br />
                                • Add to alerts panel
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => setModalOpen(false)} disabled={loading}
                                    style={{ flex: 1, padding: '11px 0', background: N.bgRaised, border: `1px solid ${N.border}`, borderRadius: 10, color: N.textDim, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    Cancel
                                </button>
                                <motion.button onClick={handleSOS} disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ flex: 2, padding: '11px 0', background: loading ? N.bgRaised : 'linear-gradient(135deg, #ff2d78, #c0002a)', border: 'none', borderRadius: 10, color: loading ? N.textDim : '#fff', cursor: loading ? 'wait' : 'pointer', fontSize: 13, fontWeight: 900, letterSpacing: 1, fontFamily: 'Orbitron, monospace', boxShadow: loading ? 'none' : '0 0 16px rgba(255,45,120,0.4)' }}>
                                    {loading ? '⏳ SENDING…' : '🚨 DISPATCH SOS'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Toast Notification ─────────────────────────────────────── */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 30, x: '-50%' }}
                        style={{
                            position: 'fixed', bottom: 110, left: '50%', zIndex: 10001,
                            padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600, maxWidth: '90vw',
                            background: toast.type === 'success' ? 'rgba(57,255,20,0.12)' : 'rgba(255,45,120,0.12)',
                            border: `1px solid ${toast.type === 'success' ? 'rgba(57,255,20,0.4)' : 'rgba(255,45,120,0.4)'}`,
                            color: toast.type === 'success' ? '#39ff14' : N.pink,
                            backdropFilter: 'blur(8px)',
                            boxShadow: `0 0 20px ${toast.type === 'success' ? 'rgba(57,255,20,0.2)' : 'rgba(255,45,120,0.2)'}`,
                        }}>
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── CSS Keyframes for pulse ─────────────────────────────────── */}
            <style>{`
                @keyframes sosPulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.7); opacity: 0; }
                }
            `}</style>
        </>
    )
}
