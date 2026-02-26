import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'

const RECONNECT_DELAY = 15_000

export function useWebSocket() {
    const ws = useRef<WebSocket | null>(null)
    const { setRiskScore, addToast, isOnline, setActiveSection, riskScore } = useStore()

    const connect = useCallback(() => {
        if (!isOnline) return
        try {
            ws.current = new WebSocket('ws://localhost:8000/ws/updates')

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)

                    // ── Real-time risk update ────────────────────────────────
                    if (data.type === 'risk_update' && data.risk_delta) {
                        const next = Math.max(0, Math.min(100, riskScore + (data.risk_delta as number)))
                        setRiskScore(next)
                    }

                    // ── SOS Alert broadcast ──────────────────────────────────
                    if (data.type === 'SOS_ALERT') {
                        addToast(
                            `🚨 SOS ALERT — ${data.zone || 'Unknown'} | Case: ${data.case_id || 'N/A'}`,
                            'error'
                        )
                        // Flash alerts panel
                        setActiveSection('alerts')
                        // Play alert sound (best-effort)
                        try {
                            const ctx = new AudioContext()
                            const osc = ctx.createOscillator()
                            const gain = ctx.createGain()
                            osc.connect(gain)
                            gain.connect(ctx.destination)
                            osc.type = 'square'
                            osc.frequency.setValueAtTime(880, ctx.currentTime)
                            osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15)
                            gain.gain.setValueAtTime(0.15, ctx.currentTime)
                            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
                            osc.start(ctx.currentTime)
                            osc.stop(ctx.currentTime + 0.4)
                        } catch { /* AudioContext not available */ }
                    }
                } catch { }
            }

            ws.current.onerror = () => {
                // Silently fail — no toast spam when backend offline
            }

            ws.current.onclose = () => {
                setTimeout(connect, RECONNECT_DELAY)
            }
        } catch { }
    }, [isOnline, setRiskScore, addToast, setActiveSection])

    useEffect(() => {
        connect()
        return () => {
            ws.current?.close(1000, 'Component unmounted')
        }
    }, [connect])
}

export function useOffline() {
    const { setIsOnline, addToast } = useStore()

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            addToast('✅ Back online! Live data restored.', 'success')
        }
        const handleOffline = () => {
            setIsOnline(false)
            addToast('📶 Offline mode — showing cached data', 'warning')
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [setIsOnline, addToast])
}
