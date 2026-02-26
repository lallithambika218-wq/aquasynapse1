import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import { useWebSocket, useOffline } from './hooks/useRealtime'
import { useSOS } from './hooks/useApiQueries'
import { HomePage } from './pages/HomePage'
import { DashboardHome } from './pages/dashboard/DashboardHome'
import { RiskMapPage } from './pages/dashboard/RiskMapPage'
import { ResourcesPage } from './pages/dashboard/ResourcesPage'
import { SheltersPage } from './pages/dashboard/SheltersPage'
import { SimulationPage } from './pages/dashboard/SimulationPage'
import { AlertsPage } from './pages/dashboard/AlertsPage'
import { HistoryPage } from './pages/dashboard/HistoryPage'
import { exportJSON } from './services/api'
import { sosPulse } from './animations/variants'
import { SosButton } from './components/SosButton'
import { LiveTicker } from './components/LiveTicker'
import { QuickActions } from './components/QuickActions'

// ─── Neon palette (matches CSS vars) ─────────────────────────────────────────
const N = {
    cyan: '#00fff5',
    green: '#39ff14',
    pink: '#ff2d78',
    blue: '#3d9bff',
    bgDeep: '#020510',
    bgDark: '#050c1a',
    bgCard: '#080f1e',
    bgRaised: '#0c1428',
    bgHover: '#101d35',
    border: 'rgba(0,255,245,0.15)',
    borderHi: 'rgba(0,255,245,0.45)',
    text: '#e0f4ff',
    textMid: '#7ec8d4',
    textDim: '#2d5c6e',
    glowC: '0 0 8px rgba(0,255,245,0.6), 0 0 20px rgba(0,255,245,0.15)',
    glowP: '0 0 8px rgba(255,45,120,0.6)',
    glowG: '0 0 8px rgba(57,255,20,0.5)',
}

// ─── Page Router ──────────────────────────────────────────────────────────────
function PageContent({ section }: { section: string }) {
    switch (section) {
        case 'dashboard': return <DashboardHome />
        case 'map': return <RiskMapPage />
        case 'resources': return <ResourcesPage />
        case 'shelters': return <SheltersPage />
        case 'simulation': return <SimulationPage />
        case 'alerts': return <AlertsPage />
        case 'history': return <HistoryPage />
        default: return <DashboardHome />
    }
}

// ─── Toast Container ──────────────────────────────────────────────────────────
function ToastContainer() {
    const { toasts } = useStore()
    return (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div key={t.id}
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                        className={`toast toast-${t.type}`}>
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage() {
    const { setLoggedIn, setCurrentPage } = useStore()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [err, setErr] = useState('')

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: N.bgDeep }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{
                    background: N.bgCard, border: `1px solid ${N.borderHi}`, borderRadius: 20,
                    padding: 48, width: '100%', maxWidth: 430, position: 'relative',
                    boxShadow: N.glowC,
                }}>
                {/* Corner cuts */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: `2px solid ${N.cyan}`, borderLeft: `2px solid ${N.cyan}`, borderRadius: '14px 0 0 0' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: `2px solid ${N.pink}`, borderRight: `2px solid ${N.pink}`, borderRadius: '0 0 14px 0' }} />

                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <motion.div
                        animate={{ boxShadow: [`0 0 0px ${N.cyan}`, `0 0 24px ${N.cyan}`, `0 0 0px ${N.cyan}`] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ width: 64, height: 64, background: 'rgba(0,255,245,0.08)', border: `1px solid ${N.borderHi}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 30 }}>
                        🛡️
                    </motion.div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 2, textShadow: N.glowC, marginBottom: 6 }}>
                        AQUASYNAPSE
                    </h1>
                    <p style={{ fontSize: 12, color: N.textDim, letterSpacing: 1 }}>AI-POWERED DISASTER INTELLIGENCE</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: N.textMid, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Username</div>
                    <input value={user} onChange={e => setUser(e.target.value)} placeholder="Enter username"
                        className="neon-input" />
                </div>
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: N.textMid, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Password</div>
                    <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                        className="neon-input" />
                </div>

                {err && <p style={{ color: N.pink, fontSize: 12, marginBottom: 14, textShadow: N.glowP }}>{err}</p>}

                <motion.button whileHover={{ scale: 1.02, boxShadow: `0 0 24px ${N.cyan}` }} whileTap={{ scale: 0.97 }}
                    onClick={() => { if (user.trim() && pass.trim()) { setLoggedIn(true); setCurrentPage('dashboard') } else setErr('Enter any credentials to continue.') }}
                    style={{
                        width: '100%', padding: '13px 0', background: 'transparent', border: `1px solid ${N.cyan}`,
                        borderRadius: 10, color: N.cyan, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                        letterSpacing: 2, textShadow: N.glowC, boxShadow: N.glowC, fontFamily: 'Orbitron, monospace',
                    }}>
                    AUTHENTICATE →
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: 10, color: N.textDim, marginTop: 20, letterSpacing: 1 }}>
                    DEMO MODE: ANY CREDENTIALS ACCEPTED
                </p>
                <button onClick={() => setCurrentPage('home')}
                    style={{ position: 'absolute', top: 16, left: 20, background: 'none', border: 'none', color: N.textDim, cursor: 'pointer', fontSize: 12, letterSpacing: 1 }}>
                    ← BACK
                </button>
            </motion.div>
        </div>
    )
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
function Dashboard() {
    const { t, selectedState, riskScore, confidence, rainfall, sidebarCollapsed, setSidebarCollapsed, activeSection, setActiveSection, isOnline, addToast, language, setLanguage, setCurrentPage } = useStore()
    const [showSosModal, setShowSosModal] = useState(false)
    const [showLang, setShowLang] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const sosMutation = useSOS()

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (mobile) setSidebarCollapsed(true)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [setSidebarCollapsed])

    useWebSocket()
    useOffline()

    const handleSosConfirm = async () => {
        setShowSosModal(false)
        try {
            const result = await sosMutation.mutateAsync({ zone: selectedState || 'Bihar', message: 'Emergency evacuation needed' })
            addToast(`🚨 SOS sent! Case ID: ${result.case_id}. Teams ETA: ${result.eta_minutes}min`, 'error')
        } catch {
            addToast('🚨 SOS dispatched (offline mode)', 'warning')
        }
    }

    const navItems = [
        { key: 'dashboard', icon: '📊', label: t('dashboard') },
        { key: 'map', icon: '🗺️', label: t('map') },
        { key: 'resources', icon: '📦', label: t('resources') },
        { key: 'shelters', icon: '🏠', label: t('shelters') },
        { key: 'simulation', icon: '📈', label: t('simulation') },
        { key: 'alerts', icon: '🔔', label: t('alerts') },
        { key: 'history', icon: '🕐', label: t('history') },
    ]

    const activeNav = navItems.find(n => n.key === activeSection)

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: N.bgDeep, position: 'relative' }}>

            {isMobile && !sidebarCollapsed && (
                <div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}

            {/* ══ Sidebar ══ */}
            <motion.aside animate={{ width: sidebarCollapsed ? (isMobile ? 0 : 62) : 220 }} transition={{ duration: 0.25 }}
                style={{
                    background: N.bgDark, borderRight: `1px solid ${N.border}`,
                    display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
                    boxShadow: `2px 0 20px rgba(0,255,245,0.04)`,
                    position: isMobile ? 'absolute' : 'relative',
                    zIndex: isMobile ? 50 : 1,
                    height: '100%'
                }}>

                {/* Logo */}
                <div style={{ padding: '16px 14px', borderBottom: `1px solid ${N.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <motion.div
                        animate={{ boxShadow: [`0 0 0px ${N.cyan}`, `0 0 12px ${N.cyan}`, `0 0 0px ${N.cyan}`] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ width: 34, height: 34, background: 'rgba(0,255,245,0.08)', border: `1px solid ${N.borderHi}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 17 }}>
                        🛡️
                    </motion.div>
                    {!sidebarCollapsed && (
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>AQUA</div>
                            <div style={{ fontSize: 10, color: N.textDim, letterSpacing: 2 }}>SYNAPSE v3</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                    {navItems.map(item => {
                        const isActive = activeSection === item.key
                        return (
                            <motion.button key={item.key}
                                onClick={() => setActiveSection(item.key)}
                                whileHover={{ backgroundColor: 'rgba(0,255,245,0.06)', x: 2 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px',
                                    borderRadius: 8, border: 'none',
                                    borderLeft: isActive ? `2px solid ${N.cyan}` : '2px solid transparent',
                                    background: isActive ? 'rgba(0,255,245,0.07)' : 'transparent',
                                    color: isActive ? N.cyan : N.textDim,
                                    cursor: 'pointer', fontSize: 13,
                                    fontWeight: isActive ? 700 : 400,
                                    width: '100%', textAlign: 'left',
                                    textShadow: isActive ? N.glowC : 'none',
                                    transition: 'all 0.15s',
                                }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                                {!sidebarCollapsed && <span>{item.label}</span>}
                                {!sidebarCollapsed && isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: N.cyan, boxShadow: N.glowC }}
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </nav>

                {/* Footer */}
                {!sidebarCollapsed && (
                    <div style={{ padding: '10px 14px', borderTop: `1px solid ${N.border}` }}>
                        <div style={{ padding: '8px 10px', background: N.bgCard, borderRadius: 8, border: `1px solid ${N.border}`, marginBottom: 8 }}>
                            <div style={{ fontSize: 10, color: N.textDim, marginBottom: 4, letterSpacing: 1 }}>SYSTEM STATUS</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ width: 7, height: 7, borderRadius: '50%', background: N.green, display: 'inline-block', boxShadow: N.glowG }} />
                                <span style={{ fontSize: 10, color: N.green, fontWeight: 600, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>ONLINE</span>
                            </div>
                        </div>
                        <button onClick={() => setCurrentPage('home')}
                            style={{ width: '100%', padding: '7px 0', background: 'none', border: `1px solid ${N.border}`, borderRadius: 8, color: N.textDim, fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>
                            ← HOME
                        </button>
                    </div>
                )}
            </motion.aside>

            {/* ══ Main Column ══ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <LiveTicker />
                {/* TopNav */}
                <header className="header-responsive" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 16px', borderBottom: `1px solid ${N.border}`,
                    background: N.bgDark, flexShrink: 0, gap: 10,
                    boxShadow: `0 1px 16px rgba(0,255,245,0.06)`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            style={{ background: 'none', border: `1px solid ${N.border}`, borderRadius: 6, color: N.textMid, cursor: 'pointer', fontSize: 16, padding: '5px 8px', lineHeight: 1 }}>
                            ☰
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 15 }}>{activeNav?.icon}</span>
                            <span className="xs-hide" style={{ fontSize: 14, fontWeight: 700, color: N.cyan, fontFamily: 'Orbitron, monospace', letterSpacing: 1, textShadow: N.glowC }}>
                                {activeNav?.label?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="header-actions-responsive" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                        {/* Language */}
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setShowLang(p => !p)}
                                style={{ padding: '5px 10px', background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 6, color: N.textMid, fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>
                                🌐 {language.toUpperCase()}
                            </button>
                            {showLang && (
                                <div style={{ position: 'absolute', right: 0, top: '110%', background: N.bgCard, border: `1px solid ${N.borderHi}`, borderRadius: 8, zIndex: 200, minWidth: 100, padding: 4, boxShadow: N.glowC }}>
                                    {(['en', 'hi', 'ta'] as const).map(l => (
                                        <button key={l} onClick={() => { setLanguage(l); setShowLang(false) }}
                                            style={{ width: '100%', padding: '7px 12px', background: 'none', border: 'none', color: language === l ? N.cyan : N.textMid, cursor: 'pointer', fontSize: 12, borderRadius: 6, textAlign: 'left', textShadow: language === l ? N.glowC : 'none' }}>
                                            {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'தமிழ்'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Online badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px', background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 6, fontSize: 11 }}>
                            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                style={{ width: 6, height: 6, borderRadius: '50%', background: isOnline ? N.green : N.pink, display: 'inline-block' }} />
                            <span style={{ color: isOnline ? N.green : N.pink, fontWeight: 600, fontFamily: 'Orbitron, monospace', fontSize: 9, letterSpacing: 1 }}>
                                {isOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>

                        {/* Export — now client-side */}
                        <motion.button
                            whileHover={{ borderColor: N.cyan, boxShadow: N.glowC, color: N.cyan }}
                            onClick={() => { exportJSON(selectedState || 'India', riskScore, confidence, rainfall); addToast('📤 Report exported successfully!', 'success') }}
                            style={{ padding: '6px 12px', background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 6, color: N.textMid, fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s' }}>
                            📤 EXPORT
                        </motion.button>

                        {/* SOS */}
                        <motion.button variants={sosPulse} initial="idle" animate="pulse" onClick={() => setShowSosModal(true)}
                            style={{
                                padding: '7px 18px', border: `1px solid ${N.pink}`, borderRadius: 7,
                                color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer',
                                background: 'rgba(255,45,120,0.2)', letterSpacing: 2,
                                boxShadow: N.glowP, fontFamily: 'Orbitron, monospace',
                            }}>
                            🚨 SOS
                        </motion.button>
                    </div>
                </header>

                {/* Offline banner */}
                {!isOnline && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                        style={{ padding: '6px 16px', background: 'rgba(255,107,0,0.1)', borderBottom: `1px solid rgba(255,107,0,0.3)`, textAlign: 'center', fontSize: 11, color: '#ff9a4d', letterSpacing: 1 }}>
                        📶 OFFLINE MODE — CACHED DATA · LIVE UPDATES PAUSED
                    </motion.div>
                )}

                {/* ── Page Content ── */}
                <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeSection}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18 }}
                            style={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <PageContent section={activeSection} />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* ══ SOS Modal ══ */}
            <AnimatePresence>
                {showSosModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(2,5,16,0.88)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                        onClick={() => setShowSosModal(false)}>
                        <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: N.bgCard, border: `1px solid ${N.pink}`, borderRadius: 20, padding: 36, width: '90%', maxWidth: 400, textAlign: 'center', boxShadow: N.glowP }}>
                            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6, repeat: Infinity }}
                                style={{ fontSize: 56, marginBottom: 16 }}>🚨</motion.div>
                            <h3 style={{ color: N.pink, fontWeight: 900, fontSize: 20, marginBottom: 10, fontFamily: 'Orbitron, monospace', letterSpacing: 2, textShadow: N.glowP }}>
                                CONFIRM SOS
                            </h3>
                            <p style={{ color: N.textMid, fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
                                Dispatching emergency teams to <strong style={{ color: N.text }}>{selectedState || 'current zone'}</strong>. This action will alert local authorities immediately.
                            </p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setShowSosModal(false)}
                                    style={{ flex: 1, padding: '12px 0', background: N.bgRaised, border: `1px solid ${N.border}`, borderRadius: 10, color: N.textMid, fontWeight: 600, cursor: 'pointer', letterSpacing: 1 }}>
                                    CANCEL
                                </button>
                                <motion.button whileHover={{ boxShadow: '0 0 24px rgba(255,45,120,0.8)' }} onClick={handleSosConfirm}
                                    style={{ flex: 1, padding: '12px 0', background: 'rgba(255,45,120,0.2)', border: `1px solid ${N.pink}`, borderRadius: 10, color: N.pink, fontWeight: 900, cursor: 'pointer', fontFamily: 'Orbitron, monospace', letterSpacing: 2 }}>
                                    🚨 CONFIRM
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ Floating SOS Button (with real SMS + WS broadcast) ══ */}
            <SosButton
                onSosDispatched={(caseId, location) => {
                    addToast(`🚨 SOS dispatched! Case: ${caseId}`, 'error')
                    setActiveSection('alerts')
                }}
            />

            {/* ══ Quick Actions Speed Dial ══ */}
            <QuickActions onAction={(id) => {
                if (id === 'broadcast') addToast('📡 Broadcasting Emergency Alert...', 'warning')
                if (id === 'drone') addToast('🚁 Drone deployed to sector 4.', 'success')
                if (id === 'diag') addToast('⚙️ System diagnostics: All systems nominal.', 'success')
            }} />
        </div>
    )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
    const { currentPage, loggedIn, setCurrentPage } = useStore()

    useEffect(() => {
        if (loggedIn && currentPage === 'home') setCurrentPage('dashboard')
    }, [loggedIn, currentPage])

    return (
        <>
            <AnimatePresence mode="wait">
                {currentPage === 'home' && (
                    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <HomePage />
                    </motion.div>
                )}
                {currentPage === 'login' && (
                    <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoginPage />
                    </motion.div>
                )}
                {currentPage === 'dashboard' && loggedIn && (
                    <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Dashboard />
                    </motion.div>
                )}
                {currentPage === 'dashboard' && !loggedIn && (
                    <motion.div key="login2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoginPage />
                    </motion.div>
                )}
            </AnimatePresence>
            <ToastContainer />
        </>
    )
}
