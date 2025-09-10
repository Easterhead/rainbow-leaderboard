export interface LeaderboardEntry {
    name: string;
    points: number;
    id?: string;
    avatarUrl?: string;
}
export interface ClientConfig {
    currentMonth: string;
    currentYear: string;
    localApiUrl: string;
    apiBaseUrl: string;
    refreshInterval?: number;
}
export interface TimerState {
    countdownInterval?: number;
}
export interface CountdownValues {
    minutes: number;
    seconds: number;
    isUrgent: boolean;
}
export interface PointsResult {
    maxPoints: number;
    pointsFound: boolean;
}
export type StorageResult = boolean | string | object | null;
export interface ApiResponse {
    success: boolean;
    data: LeaderboardEntry[];
    timestamp?: number;
    error?: string;
}
