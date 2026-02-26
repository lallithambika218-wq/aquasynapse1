import { create } from 'zustand'
import en from '../i18n/en'
import hi from '../i18n/hi'
import ta from '../i18n/ta'

type Lang = 'en' | 'hi' | 'ta'
type TranslationKey = keyof typeof en

const translations: Record<Lang, typeof en> = { en, hi: hi as any, ta: ta as any }

interface AppState {
    // Language
    language: Lang
    setLanguage: (l: Lang) => void
    t: (key: TranslationKey) => string

    // Auth
    loggedIn: boolean
    setLoggedIn: (v: boolean) => void
    currentPage: 'home' | 'login' | 'dashboard'
    setCurrentPage: (p: 'home' | 'login' | 'dashboard') => void

    // Dashboard nav
    activeSection: string
    setActiveSection: (s: string) => void

    // Sidebar
    sidebarCollapsed: boolean
    setSidebarCollapsed: (v: boolean) => void

    // Online
    isOnline: boolean
    setIsOnline: (v: boolean) => void

    // Risk state (shared)
    riskScore: number
    riskLevel: string
    confidence: number
    rainfall: number
    selectedState: string | null
    setRiskScore: (v: number) => void
    setRiskLevel: (v: string) => void
    setConfidence: (v: number) => void
    setRainfall: (v: number) => void
    setSelectedState: (s: string | null) => void

    // Toasts
    toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' }>
    addToast: (message: string, type: 'success' | 'error' | 'warning') => void
    removeToast: (id: string) => void
}

export const useStore = create<AppState>((set, get) => ({
    language: 'en',
    setLanguage: (l) => set({
        language: l,
        // Update t function reference so all subscribers re-render
        t: (key) => translations[l][key] || translations.en[key] || String(key),
    }),
    t: (key) => translations['en'][key] || String(key),

    loggedIn: false,
    setLoggedIn: (v) => set({ loggedIn: v }),
    currentPage: 'home',
    setCurrentPage: (p) => set({ currentPage: p }),

    activeSection: 'dashboard',
    setActiveSection: (s) => set({ activeSection: s }),

    sidebarCollapsed: false,
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    setIsOnline: (v) => set({ isOnline: v }),

    riskScore: 78,
    riskLevel: 'high',
    confidence: 92,
    rainfall: 65,
    selectedState: 'Bihar',
    setRiskScore: (v) => set({ riskScore: v }),
    setRiskLevel: (v) => set({ riskLevel: v }),
    setConfidence: (v) => set({ confidence: v }),
    setRainfall: (v) => set({ rainfall: v }),
    setSelectedState: (s) => set({ selectedState: s }),

    toasts: [],
    addToast: (message, type) => {
        const id = Date.now().toString()
        set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => get().removeToast(id), 4500)
    },
    removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
