import { ClientConfig, TimerState, CountdownValues, StorageResult } from '../types';
declare global {
    interface Window {
        client_config: ClientConfig;
    }
}
declare function saveToStorage(key: string, value: any): boolean;
declare function getFromStorage(key: string, defaultValue?: any): StorageResult;
declare function updateRefreshTimeAndStartCountdown(timerState: TimerState, refreshInterval: number): TimerState;
declare function calculateCountdownValues(timeRemaining: number): CountdownValues;
declare function startCountdownTimer(timerState: TimerState, refreshInterval: number): TimerState;
declare function initializePage(): void;
export { calculateCountdownValues, saveToStorage, getFromStorage, updateRefreshTimeAndStartCountdown, startCountdownTimer, initializePage };
