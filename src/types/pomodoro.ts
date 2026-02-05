 export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
 
 export interface TimerSettings {
   workDuration: number; // seconds
   shortBreakDuration: number;
   longBreakDuration: number;
 }
 
 export interface NotificationSettings {
   sound: boolean;
   browser: boolean;
 }
 
 export interface TelegramSettings {
   enabled: boolean;
   token: string;
   chatId: string;
 }
 
 export interface WebhookSettings {
   enabled: boolean;
   url: string;
   payload: string;
 }
 
 export interface IntegrationSettings {
   telegram: TelegramSettings;
   webhook: WebhookSettings;
 }
 
 export interface PomodoroSettings {
   theme: 'light' | 'dark';
  designStyle: 'glassmorphism' | 'flat';
   timerSettings: TimerSettings;
   notifications: NotificationSettings;
   integrations: IntegrationSettings;
   stats: {
     sessionsCompleted: number;
   };
 }
 
 export const DEFAULT_SETTINGS: PomodoroSettings = {
   theme: 'dark',
  designStyle: 'glassmorphism',
   timerSettings: {
     workDuration: 25 * 60,
     shortBreakDuration: 5 * 60,
     longBreakDuration: 15 * 60,
   },
   notifications: {
     sound: true,
     browser: true,
   },
   integrations: {
     telegram: {
       enabled: false,
       token: '',
       chatId: '',
     },
     webhook: {
       enabled: false,
       url: '',
       payload: '{"event": "pomodoro_complete", "timestamp": "{{timestamp}}"}',
     },
   },
   stats: {
     sessionsCompleted: 0,
   },
 };
 
 export const MODE_DURATIONS: Record<TimerMode, keyof TimerSettings> = {
   work: 'workDuration',
   shortBreak: 'shortBreakDuration',
   longBreak: 'longBreakDuration',
 };
 
 export const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Работа',
  shortBreak: 'Короткий перерыв',
  longBreak: 'Длинный перерыв',
 };