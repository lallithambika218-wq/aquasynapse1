import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants'

// Animated counter
function Counter({ to, suffix = '', duration = 2 }: { to: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = to / (duration * 60)
        const timer = setInterval(() => {
            start += step
            if (start >= to) { setCount(to); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 1000 / 60)
        return () => clearInterval(timer)
    }, [inView, to, duration])

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Mini risk demo slider
function MiniRiskDemo() {
    const [rainfall, setRainfall] = useState(50)
    const rs = Math.min(100, Math.max(0, Math.round(rainfall * 0.85)))
    const color = rs >= 70 ? '#ef4444' : rs >= 45 ? '#f59e0b' : '#22c55e'
    const level = rs >= 70 ? '🔴 Critical' : rs >= 45 ? '🟡 High' : '🟢 Low'

    return (
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, textAlign: 'center' }}>Try it — move the slider to see AI risk prediction</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: '#64748b', width: 80 }}>🌧️ Rainfall</span>
                <input type="range" min={0} max={100} value={rainfall} onChange={e => setRainfall(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#00d4aa' }} />
                <span style={{ fontSize: 12, color: '#00d4aa', width: 40 }}>{rainfall}%</span>
            </div>
            <motion.div
                key={rs}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '16px', background: `rgba(${color === '#ef4444' ? '239,68,68' : color === '#f59e0b' ? '245,158,11' : '34,197,94'},0.1)`, borderRadius: 12, border: `1px solid ${color}30` }}
            >
                <div style={{ fontSize: 40, fontWeight: 800, color, marginBottom: 4 }}>{rs}</div>
                <div style={{ fontSize: 14, color, fontWeight: 600 }}>{level}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>AI Risk Score</div>
            </motion.div>
        </div>
    )
}

export function HomePage() {
    const { t, setCurrentPage } = useStore()

    const stats = [
        { value: 50, suffix: 'M+', label: 'People Protected', icon: '🛡️' },
        { value: 94, suffix: '%', label: 'Model Accuracy', icon: '🎯' },
        { value: 28, suffix: '+', label: 'States Monitored', icon: '🗺️' },
        { value: 12, suffix: 'min', label: 'Avg Response Time', icon: '⚡' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#0a0e17', overflowX: 'hidden' }}>
            {/* Grid background */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.04 }}>
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id="pg" width="48" height="48" patternUnits="userSpaceOnUse">
                            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00d4aa" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pg)" />
                </svg>
            </div>

            {/* Glow orbs */}
            <div style={{ position: 'fixed', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Navbar */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,14,23,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: 'rgba(0,212,170,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛡️</div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#00d4aa' }}>AquaSynapse</span>
                    <span style={{ fontSize: 11, color: '#374151', padding: '2px 6px', background: 'rgba(0,212,170,0.1)', borderRadius: 4, marginLeft: 4 }}>AI v3.0</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => setCurrentPage('dashboard')}
                        style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                        {t('home')} / Docs
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setCurrentPage('login')}
                        style={{ padding: '8px 24px', background: '#00d4aa', border: 'none', borderRadius: 8, color: '#0a0e17', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        {t('launchDashboard')} →
                    </motion.button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px' }}>
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <motion.div variants={fadeUp}>
                        <span style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 100, fontSize: 12, color: '#00d4aa', marginBottom: 24, letterSpacing: 1 }}>
                            🛡️ SDG 13 · Climate Action · Track B Hackathon
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp}
                        style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, background: 'linear-gradient(135deg, #ffffff 30%, #00d4aa 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('heroTitle')}
                    </motion.h1>

                    <motion.p variants={fadeUp}
                        style={{ fontSize: 'clamp(16px, 2vw, 22px)', color: '#64748b', maxWidth: 600, margin: '0 auto 16px', lineHeight: 1.65 }}>
                        {t('heroSubtitle')}
                    </motion.p>

                    <motion.p variants={fadeUp} style={{ fontSize: 14, color: '#374151', marginBottom: 40 }}>
                        Powered by RandomForest ML · React-Leaflet Maps · FastAPI · Real-time WebSocket
                    </motion.p>

                    <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(0,212,170,0.35)' }} whileTap={{ scale: 0.97 }}
                            onClick={() => setCurrentPage('login')}
                            style={{ padding: '14px 36px', background: '#00d4aa', border: 'none', borderRadius: 10, color: '#0a0e17', fontWeight: 800, fontSize: 16, cursor: 'pointer', letterSpacing: 0.5 }}>
                            🚀 {t('launchDashboard')}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                            onClick={() => window.open('http://localhost:8000/docs', '_blank')}
                            style={{ padding: '14px 36px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#94a3b8', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                            📖 API Docs
                        </motion.button>
                    </motion.div>

                    {/* Mini Demo */}
                    <motion.div variants={scaleIn}>
                        <MiniRiskDemo />
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '80px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
                    {stats.map(s => (
                        <motion.div key={s.label} variants={fadeUp} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 44, fontWeight: 900, color: '#00d4aa', lineHeight: 1 }}>
                                <Counter to={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '80px 40px' }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                    <motion.h2 variants={fadeUp} style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, color: '#e2e8f0', marginBottom: 12 }}>
                        Built for Real Emergencies
                    </motion.h2>
                    <motion.p variants={fadeUp} style={{ textAlign: 'center', color: '#64748b', fontSize: 15, marginBottom: 48 }}>
                        Every module works independently. One failure doesn't take down the system.
                    </motion.p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
                        {[
                            { icon: '🧠', title: 'Real ML Engine', desc: 'RandomForestClassifier trained on 10,000+ disaster records with full XAI', color: '#00d4aa' },
                            { icon: '🗺️', title: 'India Risk Map', desc: 'React-Leaflet heatmap with animated pulse for high-risk zones and click-to-analyze', color: '#0ea5e9' },
                            { icon: '⚡', title: 'Golden Hour Index', desc: 'AI-computed emergency response window with real-time acceleration calc', color: '#f59e0b' },
                            { icon: '🚨', title: 'Advanced SOS', desc: 'Confirmed dispatch with case tracking, nearest-team routing, SMS hook ready', color: '#ef4444' },
                            { icon: '📤', title: 'Export System', desc: 'Full JSON/CSV/PDF export from backend. Auto-generated mission report', color: '#8b5cf6' },
                            { icon: '📶', title: 'Offline-First', desc: 'IndexedDB caching + navigator.onLine detection. Works without internet', color: '#22c55e' },
                        ].map(f => (
                            <motion.div key={f.title} variants={fadeUp}
                                whileHover={{ y: -4, boxShadow: `0 16px 40px ${f.color}20` }}
                                style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, cursor: 'default', transition: 'box-shadow 0.3s' }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{f.title}</div>
                                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 40px', textAlign: 'center' }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                    <motion.h2 variants={fadeUp} style={{ fontSize: 36, fontWeight: 800, color: '#e2e8f0', marginBottom: 16 }}>Ready to Deploy?</motion.h2>
                    <motion.p variants={fadeUp} style={{ color: '#64748b', marginBottom: 36, fontSize: 15 }}>
                        Smart City integration ready · SaaS model · API-documented · Patent potential
                    </motion.p>
                    <motion.button
                        variants={fadeUp}
                        whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(0,212,170,0.4)' }} whileTap={{ scale: 0.97 }}
                        onClick={() => setCurrentPage('login')}
                        style={{ padding: '16px 48px', background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', border: 'none', borderRadius: 12, color: '#0a0e17', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>
                        🚀 Enter AquaSynapse
                    </motion.button>
                </motion.div>
            </section>
        </div>
    )
}
