import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { analyzeRisk, getResources, getShelters, getHistory, sendSOS, getWeather, getRiskOverview, type AnalysisPayload } from '../services/api'

// ─── Risk Engine Query ─────────────────────────────────────────────────────────

export function useRiskAnalysis(payload: AnalysisPayload, enabled = true) {
    return useQuery({
        queryKey: ['analysis', payload],
        queryFn: () => analyzeRisk(payload),
        enabled,
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}

// ─── Risk Overview ─────────────────────────────────────────────────────────────

export function useRiskOverview() {
    return useQuery({
        queryKey: ['risk-overview'],
        queryFn: getRiskOverview,
        staleTime: 60_000,
        retry: 1,
    })
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export function useWeather(area: string) {
    return useQuery({
        queryKey: ['weather', area],
        queryFn: () => getWeather(area),
        staleTime: 300_000, // 5 min
        refetchInterval: 300_000,
        retry: 1,
    })
}

// ─── Resources ────────────────────────────────────────────────────────────────

export function useResources(riskScore: number) {
    return useQuery({
        queryKey: ['resources', Math.round(riskScore)],
        queryFn: () => getResources(riskScore),
        staleTime: 15_000,
        retry: 1,
    })
}

// ─── Shelters ─────────────────────────────────────────────────────────────────

export function useShelters(riskScore: number) {
    return useQuery({
        queryKey: ['shelters', Math.round(riskScore)],
        queryFn: () => getShelters(riskScore),
        staleTime: 30_000,
        retry: 1,
    })
}

// ─── History ──────────────────────────────────────────────────────────────────

export function useHistory() {
    const qc = useQueryClient()
    const query = useQuery({
        queryKey: ['history'],
        queryFn: getHistory,
        staleTime: 10_000,
        retry: 1,
    })
    const refetch = () => qc.invalidateQueries({ queryKey: ['history'] })
    return { ...query, refetch }
}

// ─── SOS Mutation ─────────────────────────────────────────────────────────────

export function useSOS() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: sendSOS,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['history'] })
        },
    })
}
