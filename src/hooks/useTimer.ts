 import { useState, useEffect, useRef, useCallback } from 'react';
 import { TimerMode, TimerSettings, MODE_DURATIONS } from '@/types/pomodoro';
 
 interface UseTimerProps {
   timerSettings: TimerSettings;
   onComplete: (mode: TimerMode) => void;
 }
 
 export function useTimer({ timerSettings, onComplete }: UseTimerProps) {
   const [mode, setMode] = useState<TimerMode>('work');
   const [remainingSeconds, setRemainingSeconds] = useState(timerSettings.workDuration);
   const [isRunning, setIsRunning] = useState(false);
   const workerRef = useRef<Worker | null>(null);
   const modeRef = useRef<TimerMode>(mode);
 
   // Keep modeRef in sync
   useEffect(() => {
     modeRef.current = mode;
   }, [mode]);
 
   // Initialize Web Worker
   useEffect(() => {
     workerRef.current = new Worker('/timer-worker.js');
 
     workerRef.current.onmessage = (e) => {
       const { type, payload } = e.data;
 
       switch (type) {
         case 'TICK':
           setRemainingSeconds(payload);
           break;
         case 'COMPLETE':
           setIsRunning(false);
           onComplete(modeRef.current);
           break;
       }
     };
 
     // Set initial time
     workerRef.current.postMessage({
       type: 'SET_TIME',
       payload: timerSettings.workDuration,
     });
 
     return () => {
       workerRef.current?.terminate();
     };
   }, []);
 
   const start = useCallback(() => {
     workerRef.current?.postMessage({ type: 'START' });
     setIsRunning(true);
   }, []);
 
   const pause = useCallback(() => {
     workerRef.current?.postMessage({ type: 'PAUSE' });
     setIsRunning(false);
   }, []);
 
   const reset = useCallback(() => {
     const durationKey = MODE_DURATIONS[mode];
     const duration = timerSettings[durationKey];
     workerRef.current?.postMessage({ type: 'RESET', payload: duration });
     setIsRunning(false);
   }, [mode, timerSettings]);
 
   const changeMode = useCallback((newMode: TimerMode) => {
     const durationKey = MODE_DURATIONS[newMode];
     const duration = timerSettings[durationKey];
     setMode(newMode);
     workerRef.current?.postMessage({ type: 'RESET', payload: duration });
     setIsRunning(false);
   }, [timerSettings]);
 
   const formatTime = useCallback((seconds: number) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   }, []);
 
   return {
     mode,
     remainingSeconds,
     isRunning,
     formattedTime: formatTime(remainingSeconds),
     start,
     pause,
     reset,
     changeMode,
   };
 }