import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
api.interceptors.request.use(config => config, err => Promise.reject(err))

// Response interceptor — graceful degradation
api.interceptors.response.use(
    res => res,
    err => {
        console.warn('[AquaSynapse API] Request failed, using fallback:', err.message)
        return Promise.reject(err)
    }
)

// ─── Typed API calls ──────────────────────────────────────────────────────────

export interface AnalysisPayload {
    area?: string
    rainfall: number
    elevation: number
    population_density: number
    coastal_distance: number
    historical_index: number
}

export interface AnalysisResult {
    area: string
    risk_score: number
    risk_level: string
    confidence: number
    feature_importance: Record<string, number>
    golden_hour_index: { status: string; time_window_hours: number; message: string; color: string }
    recommended_resources: Record<string, number>
    suggested_shelters: Array<{ name: string; capacity: number; safety: string; distance_km: number }>
    model_source: string
    inputs: Record<string, number>
}

export const analyzeRisk = async (payload: AnalysisPayload): Promise<AnalysisResult> => {
    const { data } = await api.post('/api/analyze', payload)
    return data
}

export const getRiskOverview = async () => {
    const { data } = await api.get('/api/risk-overview')
    return data
}

export const getWeather = async (area: string) => {
    const { data } = await api.get(`/api/weather/${encodeURIComponent(area)}`)
    return data
}

export const getResources = async (risk_score: number) => {
    const { data } = await api.get(`/api/resources?risk_score=${risk_score}`)
    return data
}

export const getShelters = async (risk_score: number) => {
    const { data } = await api.get(`/api/shelters?risk_score=${risk_score}`)
    return data
}

export const getHistory = async () => {
    const { data } = await api.get('/api/history')
    return data
}

export const sendSOS = async (payload: { zone: string; latitude?: number; longitude?: number; contact?: string; message?: string }) => {
    const { data } = await api.post('/api/sos', payload)
    return data
}

export const exportJSON = (area: string, riskScore: number, confidence: number, rainfall: number) => {
    const payload = {
        exported_at: new Date().toISOString(),
        platform: 'AquaSynapse v3.0',
        area,
        risk_score: riskScore,
        confidence,
        rainfall,
        risk_level: riskScore >= 70 ? 'critical' : riskScore >= 45 ? 'high' : riskScore >= 25 ? 'medium' : 'low',
        recommended_action: riskScore >= 70 ? 'Immediate evacuation required' : riskScore >= 45 ? 'Prepare evacuation plan' : 'Monitor closely',
        generated_by: 'RandomForest ML Engine',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aquasynapse_${area.replace(/\s/g, '_')}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
}

export const exportCSV = (area: string, riskScore: number, confidence: number, rainfall: number) => {
    const headers = ['area', 'risk_score', 'confidence', 'rainfall', 'risk_level', 'exported_at']
    const riskLevel = riskScore >= 70 ? 'critical' : riskScore >= 45 ? 'high' : riskScore >= 25 ? 'medium' : 'low'
    const row = [area, riskScore, confidence, rainfall, riskLevel, new Date().toISOString()]
    const csv = [headers.join(','), row.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aquasynapse_${area.replace(/\s/g, '_')}_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
}
