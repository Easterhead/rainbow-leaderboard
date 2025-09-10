// Type definitions for the Rainbow Leaderboard project

// Leaderboard entry (represents a reader)
export interface LeaderboardEntry {
  name: string;
  points: number;
  id?: string;  // Wattpad user ID if available
  avatarUrl?: string;  // For future avatar feature
}

// Client configuration
export interface ClientConfig {
  currentMonth: string;
  currentYear: string;
  localApiUrl: string;
  apiBaseUrl: string;
  refreshInterval?: number;  // In milliseconds
}

// Countdown timer state
export interface TimerState {
  countdownInterval?: number;
}

// Countdown calculation result
export interface CountdownValues {
  minutes: number;
  seconds: number;
  isUrgent: boolean;
}

// Points calculation result
export interface PointsResult {
  maxPoints: number;
  pointsFound: boolean;
}

// Storage utilities return types
export type StorageResult = boolean | string | object | null;

// API response for leaderboard data
export interface ApiResponse {
  success: boolean;
  data: LeaderboardEntry[];
  timestamp?: number;
  error?: string;
}
