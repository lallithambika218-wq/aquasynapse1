import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const N = {
    cyan: '#00fff5',
    bgCard: '#080f1e',
    border: 'rgba(0,255,245,0.15)',
    glowC: '0 0 8px rgba(0,255,245,0.6)',
    textMid: '#7ec8d4',
}

const ACTIONS = [
    { id: 'broadcast', icon: '📡', label: 'Broadcast Alert' },
    { id: 'drone', icon: '🚁', label: 'Deploy Drone' },
    { id: 'diag', icon: '⚙️', label: 'Diagnostics' }
]

export function QuickActions({ onAction }: { onAction: (id: string) => void }) {
    const [open, setOpen] = useState(false)

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9000 }}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        style={{ position: 'absolute', bottom: 60, right: 0, display: 'flex', flexDirection: 'column', gap: 10 }}
                    >
                        {ACTIONS.map((action, i) => (
                            <motion.button
                                key={action.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (ACTIONS.length - 1 - i) * 0.05 }}
                                onClick={() => { onAction(action.id); setOpen(false) }}
                                className="hover-scale"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    background: N.bgCard, border: `1px solid ${N.border}`,
                                    padding: '8px 14px', borderRadius: 20,
                                    color: N.textMid, cursor: 'pointer',
                                    whiteSpace: 'nowrap', fontSize: 13,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    flexDirection: 'row-reverse'
                                }}
                            >
                                <span style={{ fontSize: 16 }}>{action.icon}</span>
                                <span>{action.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.05, boxShadow: N.glowC }}
                whileTap={{ scale: 0.95 }}
                style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: N.bgCard, border: `2px solid ${N.cyan}`,
                    color: N.cyan, fontSize: 24, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
            >
                <motion.div animate={{ rotate: open ? 45 : 0 }}>
                    +
                </motion.div>
            </motion.button>
        </div>
    )
}
