 import { useState, useEffect, useRef, useCallback } from 'react';
 import { TimerMode, TimerSettings, MODE_DURATIONS } from '@/types/pomodoro';
 
const TIMER_STATE_KEY = 'pomodoro-timer-state';

interface TimerState {
  mode: TimerMode;
  remainingSeconds: number;
  isRunning: boolean;
  lastUpdated: number;
}

function loadTimerState(timerSettings: TimerSettings): TimerState {
  try {
    const stored = localStorage.getItem(TIMER_STATE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as TimerState;
      // Если таймер был запущен, вычисляем прошедшее время
      if (state.isRunning && state.lastUpdated) {
        const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);
        const remaining = Math.max(0, state.remainingSeconds - elapsed);
        return { ...state, remainingSeconds: remaining, isRunning: remaining > 0 };
      }
      return state;
    }
  } catch (e) {
    console.error('Failed to load timer state:', e);
  }
  return {
    mode: 'work',
    remainingSeconds: timerSettings.workDuration,
    isRunning: false,
    lastUpdated: Date.now(),
  };
}

function saveTimerState(state: TimerState) {
  try {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({ ...state, lastUpdated: Date.now() }));
  } catch (e) {
    console.error('Failed to save timer state:', e);
  }
}

 interface UseTimerProps {
   timerSettings: TimerSettings;
   onComplete: (mode: TimerMode) => void;
 }
 
 export function useTimer({ timerSettings, onComplete }: UseTimerProps) {
  const [state, setState] = useState<TimerState>(() => loadTimerState(timerSettings));
   const workerRef = useRef<Worker | null>(null);
  const modeRef = useRef<TimerMode>(state.mode);
  const initializedRef = useRef(false);
 
   // Keep modeRef in sync
   useEffect(() => {
    modeRef.current = state.mode;
  }, [state.mode]);

  // Save timer state to localStorage
  useEffect(() => {
    saveTimerState(state);
  }, [state]);
 
   // Initialize Web Worker
   useEffect(() => {
     workerRef.current = new Worker('/timer-worker.js');
 
     workerRef.current.onmessage = (e) => {
       const { type, payload } = e.data;
 
       switch (type) {
         case 'TICK':
          setState(prev => ({ ...prev, remainingSeconds: payload }));
           break;
         case 'COMPLETE':
          setState(prev => ({ ...prev, isRunning: false }));
           onComplete(modeRef.current);
           break;
       }
     };
 
    // Restore timer state
    const savedState = loadTimerState(timerSettings);
    workerRef.current.postMessage({
      type: 'SET_TIME',
      payload: savedState.remainingSeconds,
    });

    // Auto-resume if was running
    if (savedState.isRunning && savedState.remainingSeconds > 0) {
      workerRef.current.postMessage({ type: 'START' });
    }

    initializedRef.current = true;
 
     return () => {
       workerRef.current?.terminate();
     };
   }, []);
 
   const start = useCallback(() => {
     workerRef.current?.postMessage({ type: 'START' });
    setState(prev => ({ ...prev, isRunning: true }));
   }, []);
 
   const pause = useCallback(() => {
     workerRef.current?.postMessage({ type: 'PAUSE' });
    setState(prev => ({ ...prev, isRunning: false }));
   }, []);
 
   const reset = useCallback(() => {
    const durationKey = MODE_DURATIONS[state.mode];
     const duration = timerSettings[durationKey];
     workerRef.current?.postMessage({ type: 'RESET', payload: duration });
    setState(prev => ({ ...prev, remainingSeconds: duration, isRunning: false }));
  }, [state.mode, timerSettings]);
 
   const changeMode = useCallback((newMode: TimerMode) => {
     const durationKey = MODE_DURATIONS[newMode];
     const duration = timerSettings[durationKey];
     workerRef.current?.postMessage({ type: 'RESET', payload: duration });
    setState({ mode: newMode, remainingSeconds: duration, isRunning: false, lastUpdated: Date.now() });
   }, [timerSettings]);
 
   const formatTime = useCallback((seconds: number) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   }, []);
 
   return {
    mode: state.mode,
    remainingSeconds: state.remainingSeconds,
    isRunning: state.isRunning,
    formattedTime: formatTime(state.remainingSeconds),
     start,
     pause,
     reset,
     changeMode,
   };
 }