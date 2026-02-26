// Dashboard state types and initial data

export interface Alert {
  id: string
  type: "flood" | "evacuation" | "resource" | "earthquake" | "cyclone"
  title: string
  location: string
  detail: string
  time: string
  severity: "critical" | "high" | "medium" | "low"
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
  safety: "Safe" | "At Risk" | "Full"
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
  riskLevel: "low" | "medium" | "high" | "critical"
  riskScore: number
  x: number
  y: number
}

export interface WeatherData {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  condition: string
  area: string
  updatedAt: string
}

export interface AnalysisInput {
  area: string
  rainfall: number
  elevation: number
  population: number
  coastalDistance: number
  disasterIntensity: number
}

export interface HistoryEntry {
  id: string
  date: string
  area: string
  riskLevel: string
  riskScore: number
  confidence: number
}

export interface SimulationPoint {
  time: string
  current: number
  after: number
}

export const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "flood",
    title: "Flood Warning",
    location: "Bihar",
    detail: "High Risk",
    time: "5 mins ago",
    severity: "critical",
    read: false,
  },
  {
    id: "2",
    type: "evacuation",
    title: "Evacuation Suggested",
    location: "Odisha",
    detail: "Zone 3",
    time: "23 mins ago",
    severity: "high",
    read: false,
  },
  {
    id: "3",
    type: "resource",
    title: "Resource Shortage",
    location: "Maharashtra",
    detail: "",
    time: "1 hour ago",
    severity: "medium",
    read: false,
  },
  {
    id: "4",
    type: "cyclone",
    title: "Cyclone Alert",
    location: "Tamil Nadu",
    detail: "Category 2",
    time: "2 hours ago",
    severity: "high",
    read: true,
  },
  {
    id: "5",
    type: "earthquake",
    title: "Seismic Activity",
    location: "J&K",
    detail: "4.2 Magnitude",
    time: "3 hours ago",
    severity: "medium",
    read: true,
  },
]

export const initialResources: Resource[] = [
  { name: "Boats", icon: "boat", current: 36, total: 50, unit: "" },
  { name: "Ambulances", icon: "ambulance", current: 22, total: 30, unit: "" },
  { name: "Food Kits", icon: "food", current: 410, total: 500, unit: "" },
  { name: "Medical Teams", icon: "medical", current: 15, total: 20, unit: "" },
]

export const initialShelters: Shelter[] = [
  { name: "Green Valley School", capacity: 1200, safety: "Safe", distance: "2.3 km" },
  { name: "City Hall Shelter", capacity: 800, safety: "At Risk", distance: "5.1 km" },
  { name: "Hilltop Complex", capacity: 1500, safety: "Safe", distance: "7.8 km" },
  { name: "Stadium Shelter", capacity: 3000, safety: "Safe", distance: "12.4 km" },
  { name: "Community Center", capacity: 600, safety: "Full", distance: "3.2 km" },
]

export const initialActionPlan: ActionStep[] = [
  { id: 1, text: "Deploy 12 Boats -> Zone A", highlight: "12 Boats", completed: false },
  { id: 2, text: "Open 3 Shelters in Zone B", highlight: "3 Shelters", completed: false },
  { id: 3, text: "Send Alerts to 5 Districts", highlight: "5 Districts", completed: false },
]

export const stateRisks: StateRisk[] = [
  { name: "Jammu & Kashmir", abbr: "J&K", riskLevel: "high", riskScore: 72, x: 28, y: 8 },
  { name: "Himachal Pradesh", abbr: "HP", riskLevel: "medium", riskScore: 55, x: 32, y: 16 },
  { name: "Punjab", abbr: "PB", riskLevel: "low", riskScore: 25, x: 26, y: 20 },
  { name: "Uttarakhand", abbr: "UK", riskLevel: "medium", riskScore: 58, x: 38, y: 18 },
  { name: "Uttar Pradesh", abbr: "UP", riskLevel: "high", riskScore: 68, x: 42, y: 30 },
  { name: "Bihar", abbr: "Bihar", riskLevel: "critical", riskScore: 89, x: 55, y: 28 },
  { name: "Assam", abbr: "Assam", riskLevel: "critical", riskScore: 85, x: 72, y: 26 },
  { name: "West Bengal", abbr: "WB", riskLevel: "high", riskScore: 75, x: 60, y: 35 },
  { name: "Rajasthan", abbr: "RJ", riskLevel: "low", riskScore: 20, x: 22, y: 32 },
  { name: "Gujarat", abbr: "Gujarat", riskLevel: "medium", riskScore: 45, x: 14, y: 40 },
  { name: "Madhya Pradesh", abbr: "MP", riskLevel: "medium", riskScore: 42, x: 35, y: 38 },
  { name: "Maharashtra", abbr: "Maharashtra", riskLevel: "high", riskScore: 70, x: 28, y: 50 },
  { name: "Odisha", abbr: "Odisha", riskLevel: "critical", riskScore: 82, x: 54, y: 45 },
  { name: "Karnataka", abbr: "Karnataka", riskLevel: "medium", riskScore: 38, x: 25, y: 62 },
  { name: "Tamil Nadu", abbr: "TN", riskLevel: "medium", riskScore: 48, x: 32, y: 72 },
  { name: "Kerala", abbr: "KL", riskLevel: "low", riskScore: 30, x: 22, y: 72 },
  { name: "Andhra Pradesh", abbr: "AP", riskLevel: "high", riskScore: 65, x: 40, y: 58 },
  { name: "Telangana", abbr: "TS", riskLevel: "medium", riskScore: 50, x: 36, y: 52 },
  { name: "Chhattisgarh", abbr: "CG", riskLevel: "medium", riskScore: 44, x: 45, y: 40 },
  { name: "Jharkhand", abbr: "JH", riskLevel: "high", riskScore: 73, x: 54, y: 34 },
  { name: "Sikkim", abbr: "SK", riskLevel: "low", riskScore: 28, x: 62, y: 22 },
  { name: "Meghalaya", abbr: "ML", riskLevel: "medium", riskScore: 52, x: 68, y: 28 },
  { name: "Manipur", abbr: "MN", riskLevel: "medium", riskScore: 47, x: 78, y: 28 },
  { name: "Nagaland", abbr: "NL", riskLevel: "low", riskScore: 32, x: 78, y: 24 },
  { name: "Goa", abbr: "GA", riskLevel: "low", riskScore: 22, x: 18, y: 56 },
]

export const simulationData: SimulationPoint[] = [
  { time: "0h", current: 65, after: 65 },
  { time: "6h", current: 68, after: 72 },
  { time: "12h", current: 72, after: 78 },
  { time: "18h", current: 70, after: 82 },
  { time: "24h", current: 68, after: 85 },
  { time: "30h", current: 65, after: 80 },
  { time: "36h", current: 62, after: 78 },
]

export const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    riskEngine: "Risk Engine",
    heatmap: "Heatmap",
    resources: "Resources",
    shelters: "Shelters",
    simulation: "Simulation",
    alerts: "Alerts",
    history: "History",
    offlineMode: "Offline Mode",
    settings: "Settings",
    overallRiskScore: "Overall Risk Score",
    decisionConfidence: "Decision Confidence",
    goldenHourIndex: "Golden Hour Index",
    safeZones: "Safe Zones",
    highRiskZones: "High Risk Zones",
    actNow: "Act Now!",
    indiaRiskHeatmap: "India Risk Heatmap",
    quickAlerts: "Quick Alerts",
    viewAll: "View All",
    actionPlan: "Action Plan (AI Generated)",
    executePlan: "Execute Plan",
    resourceAllocation: "Resource Allocation",
    autoOptimize: "Auto-Optimize",
    shelterRecommendation: "Shelter Recommendation",
    whatIfSimulation: "What-if Simulation",
    riskProjection: "Risk Projection",
    current: "Current",
    after: "After",
    systemStatus: "System Status",
    allSystems: "All Systems",
    operational: "Operational",
    searchPlaceholder: "Search Zone / Analyze...",
    commandCenter: "Command Center",
    online: "Online",
    offline: "Offline",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    shelterName: "Shelter Name",
    capacity: "Capacity",
    safety: "Safety",
    distance: "Distance",
    sendAlert: "Send Alert",
    analyzeRisk: "Analyze Risk",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    riskEngine: "जोखिम इंजन",
    heatmap: "हीटमैप",
    resources: "संसाधन",
    shelters: "आश्रय",
    simulation: "सिमुलेशन",
    alerts: "अलर्ट",
    history: "इतिहास",
    offlineMode: "ऑफ़लाइन मोड",
    settings: "सेटिंग्स",
    overallRiskScore: "समग्र जोखिम स्कोर",
    decisionConfidence: "निर्णय विश्वास",
    goldenHourIndex: "गोल्डन ऑवर इंडेक्स",
    safeZones: "सुरक्षित क्षेत्र",
    highRiskZones: "उच्च जोखिम क्षेत्र",
    actNow: "अभी कार्य करें!",
    indiaRiskHeatmap: "भारत जोखिम हीटमैप",
    quickAlerts: "त्वरित अलर्ट",
    viewAll: "सभी देखें",
    actionPlan: "कार्य योजना (AI जनित)",
    executePlan: "योजना क्रियान्वित करें",
    resourceAllocation: "संसाधन आवंटन",
    autoOptimize: "ऑटो-ऑप्टिमाइज़",
    shelterRecommendation: "आश्रय सिफारिश",
    whatIfSimulation: "क्या-अगर सिमुलेशन",
    riskProjection: "जोखिम अनुमान",
    current: "वर्तमान",
    after: "बाद में",
    systemStatus: "सिस्टम स्थिति",
    allSystems: "सभी सिस्टम",
    operational: "चालू",
    searchPlaceholder: "क्षेत्र खोजें / विश्लेषण...",
    commandCenter: "कमांड सेंटर",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    critical: "गंभीर",
    shelterName: "आश्रय का नाम",
    capacity: "क्षमता",
    safety: "सुरक्षा",
    distance: "दूरी",
    sendAlert: "अलर्ट भेजें",
    analyzeRisk: "जोखिम विश्लेषण",
  },
  ta: {
    dashboard: "டாஷ்போர்ட்",
    riskEngine: "ஆபத்து இঞ்சின்",
    heatmap: "வெப்ப மாடல்",
    resources: "வளங்கள்",
    shelters: "தங்குமிடங்கள்",
    simulation: "உருவகப்படுத்தல்",
    alerts: "எச்சரிக்கைகள்",
    history: "வரலாறு",
    offlineMode: "ஆஃப்லைன் பயன்முறை",
    settings: "அமைப்புகள்",
    overallRiskScore: "மொத்த ஆபத்து மதிப்பெண்",
    decisionConfidence: "முடிவு நம்பிக்கை",
    goldenHourIndex: "தங்க மணி குறியீடு",
    safeZones: "பாதுகாப்பான மண்டலங்கள்",
    highRiskZones: "உচ்ச ஆபத்து மண்டலங்கள்",
    actNow: "இப்போது நடவடிக்கை எடுக்கவும்!",
    indiaRiskHeatmap: "இந்தியா ஆபத்து வெப்ப மாடல்",
    quickAlerts: "வேகமான எச்சரிக்கைகள்",
    viewAll: "அனைத்தையும் பார்க்கவும்",
    actionPlan: "நடவடிக்கை திட்டம் (AI உருவாக்கம்)",
    executePlan: "திட்டத்தை செயல்படுத்தவும்",
    resourceAllocation: "வளங்களின் ஒதுக்கீடு",
    autoOptimize: "தானியங்கி மேம்படுத்தல்",
    shelterRecommendation: "தங்குமிடம் பரிந்துரை",
    whatIfSimulation: "என்ன-என்றால் உருவகப்படுத்தல்",
    riskProjection: "ஆபத்து ப்ரொஜெக்શன்",
    current: "தற்போதைய",
    after: "பிறகு",
    systemStatus: "அமைப்பு நிலை",
    allSystems: "அனைத்து அமைப்புகள்",
    operational: "செயல்பாட்டு",
    searchPlaceholder: "மண்டலம் தேடவும் / பகுப்பாய்வு...",
    commandCenter: "கட்டளை மையம்",
    online: "ஆன்லைன்",
    offline: "ஆஃப்லைன்",
    low: "குறைந்த",
    medium: "நடுத்தர",
    high: "உচ்ச",
    critical: "கடுமையான",
    shelterName: "தங்குமிடத்தின் பெயர்",
    capacity: "திறன்",
    safety: "பாதுகாப்பு",
    distance: "தூரம்",
    sendAlert: "எச்சரிக்கை அனுப்பவும்",
    analyzeRisk: "ஆபத்தை பகுப்பாய்வு செய்யவும்",
  },
}

export const initialHistory: HistoryEntry[] = [
  { id: "h1", date: "2026-02-26 14:30", area: "Bihar - Patna", riskLevel: "critical", riskScore: 89, confidence: 92 },
  { id: "h2", date: "2026-02-26 12:15", area: "Assam - Guwahati", riskLevel: "critical", riskScore: 85, confidence: 88 },
  { id: "h3", date: "2026-02-25 09:45", area: "Odisha - Bhubaneswar", riskLevel: "high", riskScore: 72, confidence: 90 },
  { id: "h4", date: "2026-02-24 16:20", area: "Maharashtra - Mumbai", riskLevel: "high", riskScore: 70, confidence: 85 },
  { id: "h5", date: "2026-02-23 11:00", area: "Gujarat - Surat", riskLevel: "medium", riskScore: 45, confidence: 94 },
  { id: "h6", date: "2026-02-22 08:30", area: "Tamil Nadu - Chennai", riskLevel: "medium", riskScore: 48, confidence: 91 },
  { id: "h7", date: "2026-02-21 15:45", area: "Kerala - Kochi", riskLevel: "low", riskScore: 30, confidence: 96 },
]

export const initialWeather: WeatherData = {
  temperature: 32,
  humidity: 78,
  rainfall: 45.2,
  windSpeed: 28,
  condition: "Heavy Rain",
  area: "Bihar - Patna",
  updatedAt: "2026-02-26 14:30",
}

export const areas = [
  "Bihar - Patna",
  "Assam - Guwahati",
  "Odisha - Bhubaneswar",
  "Maharashtra - Mumbai",
  "Gujarat - Surat",
  "Tamil Nadu - Chennai",
  "Kerala - Kochi",
  "Uttar Pradesh - Lucknow",
  "West Bengal - Kolkata",
  "Karnataka - Bangalore",
  "Rajasthan - Jaipur",
  "Andhra Pradesh - Hyderabad",
]
