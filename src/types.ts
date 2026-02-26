export interface Alert {
    id: string
    type: 'flood' | 'evacuation' | 'resource' | 'earthquake' | 'cyclone' | 'sos'
    title: string
    location: string
    detail: string
    time: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    read: boolean
}

export interface Resource {
    name: string
    icon: string
    current: number
    total: number
    unit: string
}

export interface Shelter {
    name: string
    capacity: number
    safety: 'Safe' | 'At Risk' | 'Full'
    distance: string
}

export interface ActionStep {
    id: number
    text: string
    highlight: string
    completed: boolean
}

export interface StateRisk {
    name: string
    abbr: string
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    riskScore: number
    lat: number
    lng: number
    rainfall: number
    elevation: number
    population: number
    coastalDistance: number
}

export interface SOSEvent {
    id: string
    timestamp: string
    location: string
    status: 'sent' | 'received' | 'responded'
}

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'warning'
}
