 import { useCallback, useRef } from 'react';
 import { TimerMode, MODE_LABELS, NotificationSettings, TelegramSettings, WebhookSettings } from '@/types/pomodoro';
 import { toast } from '@/hooks/use-toast';
 
 interface UseNotificationsProps {
   notifications: NotificationSettings;
   telegram: TelegramSettings;
   webhook: WebhookSettings;
 }
 
 export function useNotifications({ notifications, telegram, webhook }: UseNotificationsProps) {
   const audioContextRef = useRef<AudioContext | null>(null);
 
   const playSound = useCallback(() => {
     if (!notifications.sound) return;
 
     try {
       // Create AudioContext on first use
       if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
       }
 
       const ctx = audioContextRef.current;
       const oscillator = ctx.createOscillator();
       const gainNode = ctx.createGain();
 
       oscillator.connect(gainNode);
       gainNode.connect(ctx.destination);
 
       oscillator.frequency.setValueAtTime(800, ctx.currentTime);
       oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
       oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
 
       gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
       gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
 
       oscillator.start(ctx.currentTime);
       oscillator.stop(ctx.currentTime + 0.5);
     } catch (e) {
       console.error('Failed to play sound:', e);
     }
   }, [notifications.sound]);
 
   const showBrowserNotification = useCallback(async (mode: TimerMode) => {
     if (!notifications.browser) return;
 
     try {
       if (Notification.permission === 'default') {
         await Notification.requestPermission();
       }
 
       if (Notification.permission === 'granted') {
         new Notification('Pomodoro Timer', {
           body: `${MODE_LABELS[mode]} session completed!`,
           icon: '/favicon.ico',
         });
       }
     } catch (e) {
       console.error('Failed to show notification:', e);
     }
   }, [notifications.browser]);
 
   const sendTelegramMessage = useCallback(async (mode: TimerMode) => {
     if (!telegram.enabled || !telegram.token || !telegram.chatId) return;
 
     try {
       const response = await fetch(
         `https://api.telegram.org/bot${telegram.token}/sendMessage`,
         {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             chat_id: telegram.chatId,
             text: `🍅 Pomodoro: ${MODE_LABELS[mode]} session completed!`,
           }),
         }
       );
 
       if (!response.ok) {
         throw new Error('Telegram API error');
       }
     } catch (e) {
       console.error('Failed to send Telegram message:', e);
       toast({
         title: 'Telegram Error',
         description: 'Failed to send message. Check your credentials.',
         variant: 'destructive',
       });
     }
   }, [telegram]);
 
   const sendWebhook = useCallback(async (mode: TimerMode) => {
     if (!webhook.enabled || !webhook.url) return;
 
     try {
       const payload = webhook.payload
         .replace('{{timestamp}}', new Date().toISOString())
         .replace('{{mode}}', mode);
 
       const response = await fetch(webhook.url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: payload,
       });
 
       if (!response.ok) {
         throw new Error('Webhook error');
       }
     } catch (e) {
       console.error('Failed to send webhook:', e);
       toast({
         title: 'Webhook Error',
         description: 'Failed to send request. Check your URL.',
         variant: 'destructive',
       });
     }
   }, [webhook]);
 
   const testTelegram = useCallback(async (token: string, chatId: string) => {
     try {
       const response = await fetch(
         `https://api.telegram.org/bot${token}/sendMessage`,
         {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             chat_id: chatId,
             text: '🍅 Pomodoro Timer: Test message successful!',
           }),
         }
       );
 
       if (!response.ok) {
         const data = await response.json();
         throw new Error(data.description || 'Unknown error');
       }
 
       toast({
         title: 'Success!',
         description: 'Test message sent to Telegram.',
       });
       return true;
     } catch (e: any) {
       toast({
         title: 'Telegram Test Failed',
         description: e.message || 'Check your Bot Token and Chat ID.',
         variant: 'destructive',
       });
       return false;
     }
   }, []);
 
   const testWebhook = useCallback(async (url: string, payload: string) => {
     try {
       const parsedPayload = payload
         .replace('{{timestamp}}', new Date().toISOString())
         .replace('{{mode}}', 'test');
 
       const response = await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: parsedPayload,
       });
 
       if (!response.ok) {
         throw new Error(`HTTP ${response.status}`);
       }
 
       toast({
         title: 'Success!',
         description: 'Webhook test successful.',
       });
       return true;
     } catch (e: any) {
       const isCors = e.message?.includes('Failed to fetch');
       toast({
         title: 'Webhook Test Failed',
         description: isCors 
           ? 'CORS error. The target server may not allow cross-origin requests.'
           : e.message || 'Check your URL and payload.',
         variant: 'destructive',
       });
       return false;
     }
   }, []);
 
   const notifyComplete = useCallback((mode: TimerMode) => {
     playSound();
     showBrowserNotification(mode);
     sendTelegramMessage(mode);
     sendWebhook(mode);
   }, [playSound, showBrowserNotification, sendTelegramMessage, sendWebhook]);
 
   return {
     notifyComplete,
     testTelegram,
     testWebhook,
   };
 }