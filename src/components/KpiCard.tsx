import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cardHover } from '../animations/variants'

interface KpiCardProps {
    label: string
    value: number | string
    suffix?: string
    color: string
    icon: string
    subLabel?: string
    isAnimated?: boolean
}

function AnimatedNumber({ value, color }: { value: number; color: string }) {
    const mv = useMotionValue(0)
    const rounded = useTransform(mv, v => Math.round(v))
    const display = useTransform(rounded, v => String(v))
    const prevRef = useRef(0)

    useEffect(() => {
        const ctrl = animate(mv, value, { duration: 0.8, ease: 'easeOut' })
        return ctrl.stop
    }, [value, mv])

    return <motion.span style={{ color }}>{display}</motion.span>
}

export function KpiCard({ label, value, suffix = '', color, icon, subLabel, isAnimated = true }: KpiCardProps) {
    return (
        <motion.div
            initial="rest" whileHover="hover" variants={cardHover}
            className="hover-glow"
            style={{ background: '#080f1e', border: '1px solid rgba(0,255,245,0.15)', borderRadius: 14, padding: '18px 20px', cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 22 }}>{icon}</span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>
                {typeof value === 'number' && isAnimated
                    ? <><AnimatedNumber value={value} color={color} /><span style={{ fontSize: 18, color: '#64748b' }}>{suffix}</span></>
                    : <span style={{ color }}>{value}{suffix}</span>
                }
            </div>
            {subLabel && <div style={{ fontSize: 12, color: '#64748b' }}>{subLabel}</div>}
            <div style={{ marginTop: 8, height: 2, background: '#1e293b', borderRadius: 1 }}>
                <motion.div
                    initial={{ width: 0 }} animate={{ width: typeof value === 'number' ? `${Math.min(100, value)}%` : '60%' }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    style={{ height: '100%', background: color, borderRadius: 1 }}
                />
            </div>
        </motion.div>
    )
}
