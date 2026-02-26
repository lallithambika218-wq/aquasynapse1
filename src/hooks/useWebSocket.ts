/**
 * AquaSynapse — useWebSocket hook
 * Connects to ws://localhost:8000/ws
 * Handles SOS_ALERT, risk_update, heartbeat, and reconnect logic.
 */
import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'

const WS_URL = 'ws://localhost:8000/ws'
const RECONNECT_DELAY_MS = 3000
const MAX_RECONNECT_ATTEMPTS = 10

export interface WsMessage {
    type: string
    [key: string]: any
}

export type WsMessageHandler = (msg: WsMessage) => void

export function useWebSocket(onMessage?: WsMessageHandler) {
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectCount = useRef(0)
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isMounted = useRef(true)

    const connect = useCallback(() => {
        if (!isMounted.current) return
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        try {
            const ws = new WebSocket(WS_URL)
            wsRef.current = ws

            ws.onopen = () => {
                reconnectCount.current = 0
                console.log('[WS] Connected to AquaSynapse real-time feed')
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as WsMessage
                    onMessage?.(data)
                } catch {
                    console.warn('[WS] Failed to parse message:', event.data)
                }
            }

            ws.onclose = (event) => {
                console.log(`[WS] Disconnected (code=${event.code}). Reconnecting...`)
                scheduleReconnect()
            }

            ws.onerror = (err) => {
                console.warn('[WS] Connection error — backend may be offline')
                ws.close()
            }
        } catch (err) {
            console.warn('[WS] Failed to create WebSocket:', err)
            scheduleReconnect()
        }
    }, [onMessage])

    const scheduleReconnect = useCallback(() => {
        if (!isMounted.current) return
        if (reconnectCount.current >= MAX_RECONNECT_ATTEMPTS) {
            console.warn('[WS] Max reconnect attempts reached — giving up')
            return
        }
        reconnectCount.current++
        const delay = RECONNECT_DELAY_MS * Math.min(reconnectCount.current, 5)
        console.log(`[WS] Reconnect attempt ${reconnectCount.current} in ${delay}ms`)
        reconnectTimer.current = setTimeout(connect, delay)
    }, [connect])

    const send = useCallback((data: object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data))
        }
    }, [])

    const disconnect = useCallback(() => {
        isMounted.current = false
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
        wsRef.current?.close(1000, 'Component unmounted')
    }, [])

    useEffect(() => {
        isMounted.current = true
        connect()
        return () => {
            disconnect()
        }
    }, [connect, disconnect])

    return { send, isConnected: wsRef.current?.readyState === WebSocket.OPEN }
}
