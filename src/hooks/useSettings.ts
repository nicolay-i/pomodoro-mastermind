 import { useState, useEffect, useCallback } from 'react';
 import { PomodoroSettings, DEFAULT_SETTINGS } from '@/types/pomodoro';
 
 const STORAGE_KEY = 'pomodoro-settings';
 
 export function useSettings() {
   const [settings, setSettings] = useState<PomodoroSettings>(() => {
     try {
       const stored = localStorage.getItem(STORAGE_KEY);
       if (stored) {
         return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
       }
     } catch (e) {
       console.error('Failed to load settings:', e);
     }
     return DEFAULT_SETTINGS;
   });
 
   useEffect(() => {
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
     } catch (e) {
       console.error('Failed to save settings:', e);
     }
   }, [settings]);
 
   useEffect(() => {
     document.documentElement.classList.toggle('dark', settings.theme === 'dark');
   }, [settings.theme]);
 
  useEffect(() => {
    document.documentElement.classList.toggle('flat', settings.designStyle === 'flat');
  }, [settings.designStyle]);

   const toggleTheme = useCallback(() => {
     setSettings(prev => ({
       ...prev,
       theme: prev.theme === 'light' ? 'dark' : 'light',
     }));
   }, []);
 
  const setDesignStyle = useCallback((designStyle: PomodoroSettings['designStyle']) => {
    setSettings(prev => ({ ...prev, designStyle }));
  }, []);

   const updateNotifications = useCallback((notifications: Partial<PomodoroSettings['notifications']>) => {
     setSettings(prev => ({
       ...prev,
       notifications: { ...prev.notifications, ...notifications },
     }));
   }, []);
 
   const updateTelegram = useCallback((telegram: Partial<PomodoroSettings['integrations']['telegram']>) => {
     setSettings(prev => ({
       ...prev,
       integrations: {
         ...prev.integrations,
         telegram: { ...prev.integrations.telegram, ...telegram },
       },
     }));
   }, []);
 
   const updateWebhook = useCallback((webhook: Partial<PomodoroSettings['integrations']['webhook']>) => {
     setSettings(prev => ({
       ...prev,
       integrations: {
         ...prev.integrations,
         webhook: { ...prev.integrations.webhook, ...webhook },
       },
     }));
   }, []);
 
   const incrementSessions = useCallback(() => {
     setSettings(prev => ({
       ...prev,
       stats: {
         ...prev.stats,
         sessionsCompleted: prev.stats.sessionsCompleted + 1,
       },
     }));
   }, []);
 
   return {
     settings,
     toggleTheme,
    setDesignStyle,
     updateNotifications,
     updateTelegram,
     updateWebhook,
     incrementSessions,
   };
 }