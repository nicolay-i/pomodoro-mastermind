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
            body: `Сессия "${MODE_LABELS[mode]}" завершена!`,
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
              text: `🍅 Pomodoro: Сессия "${MODE_LABELS[mode]}" завершена!`,
           }),
         }
       );
 
       if (!response.ok) {
         throw new Error('Telegram API error');
       }
     } catch (e) {
       console.error('Failed to send Telegram message:', e);
       toast({
          title: 'Ошибка Telegram',
          description: 'Не удалось отправить сообщение. Проверьте данные.',
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
          title: 'Ошибка Webhook',
          description: 'Не удалось отправить запрос. Проверьте URL.',
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
              text: '🍅 Pomodoro Timer: Тестовое сообщение успешно!',
           }),
         }
       );
 
       if (!response.ok) {
         const data = await response.json();
         throw new Error(data.description || 'Unknown error');
       }
 
       toast({
          title: 'Успешно!',
          description: 'Тестовое сообщение отправлено в Telegram.',
       });
       return true;
     } catch (e: any) {
       toast({
          title: 'Ошибка теста Telegram',
          description: e.message || 'Проверьте токен бота и ID чата.',
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
          title: 'Успешно!',
          description: 'Тест Webhook успешен.',
       });
       return true;
     } catch (e: any) {
       const isCors = e.message?.includes('Failed to fetch');
       toast({
          title: 'Ошибка теста Webhook',
         description: isCors 
            ? 'Ошибка CORS. Сервер может не разрешать кросс-доменные запросы.'
            : e.message || 'Проверьте URL и данные.',
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