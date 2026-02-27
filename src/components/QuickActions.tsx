import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimulationPanel } from './SimulationPanel'

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
    { id: 'simulator', icon: '📊', label: 'Data Simulator' },
    { id: 'diag', icon: '⚙️', label: 'Diagnostics' }
]

export function QuickActions({ onAction }: { onAction: (id: string) => void }) {
    const [showSimulator, setShowSimulator] = useState(false)
    const [open, setOpen] = useState(false)

    const handleAction = (id: string) => {
        if (id === 'simulator') {
            setShowSimulator(true)
            setOpen(false)
        } else {
            onAction(id)
            setOpen(false)
        }
    }

    return (
        <>
            {/* Simulator Modal */}
            <AnimatePresence>
                {showSimulator && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSimulator(false)}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflowY: 'auto',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'linear-gradient(135deg, #0a0f1a 0%, #0c1428 100%)',
                                border: '1px solid rgba(0, 255, 245, 0.2)',
                                borderRadius: '12px',
                                width: '100%',
                                maxWidth: '1000px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                position: 'sticky',
                                top: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderBottom: '1px solid rgba(0, 255, 245, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                zIndex: 1
                            }}>
                                <h2 style={{ color: '#00fff5', margin: 0 }}>📊 Data Simulation Control</h2>
                                <button
                                    onClick={() => setShowSimulator(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#7ec8d4',
                                        fontSize: '24px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <SimulationPanel />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Actions Button */}
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
                                    onClick={() => handleAction(action.id)}
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
                    title="Quick Actions"
                >
                    <motion.div animate={{ rotate: open ? 45 : 0 }}>
                        +
                    </motion.div>
                </motion.button>
            </div>
        </>
    )
}
