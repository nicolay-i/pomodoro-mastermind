import { Bell, BellOff, Send, Webhook, Volume2, BellRing, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { NotificationSettings, TelegramSettings, WebhookSettings, TimerTextColor } from '@/types/pomodoro';

interface SettingsPanelProps {
  notifications: NotificationSettings;
  telegram: TelegramSettings;
  webhook: WebhookSettings;
  designStyle: 'glassmorphism' | 'flat';
  timerTextColor: TimerTextColor;
  onUpdateNotifications: (n: Partial<NotificationSettings>) => void;
  onUpdateTelegram: (t: Partial<TelegramSettings>) => void;
  onUpdateWebhook: (w: Partial<WebhookSettings>) => void;
  onSetDesignStyle: (style: 'glassmorphism' | 'flat') => void;
  onSetTimerTextColor: (color: TimerTextColor) => void;
  onTestTelegram: (token: string, chatId: string) => Promise<boolean>;
  onTestWebhook: (url: string, payload: string) => Promise<boolean>;
  onTestSound: () => void;
  onTestBrowserNotification: () => void;
}

export function SettingsPanel({
  notifications,
  telegram,
  webhook,
  designStyle,
  timerTextColor,
  onUpdateNotifications,
  onUpdateTelegram,
  onUpdateWebhook,
  onSetDesignStyle,
  onSetTimerTextColor,
  onTestTelegram,
  onTestWebhook,
  onTestSound,
  onTestBrowserNotification,
}: SettingsPanelProps) {
   return (
     <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Design Style */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Стиль дизайна
          </CardTitle>
          <CardDescription>Выберите визуальный стиль интерфейса</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={designStyle}
            onValueChange={(value) => onSetDesignStyle(value as 'glassmorphism' | 'flat')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="glassmorphism" id="glassmorphism" />
              <Label htmlFor="glassmorphism">Glassmorphism</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flat" id="flat" />
              <Label htmlFor="flat">Flat Design</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Timer Text Color */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Цвет текста таймера
          </CardTitle>
          <CardDescription>Единый цвет для всех режимов таймера</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={timerTextColor}
            onValueChange={(value) => onSetTimerTextColor(value as TimerTextColor)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="orange" id="color-orange" />
              <Label htmlFor="color-orange" className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pomodoro-work" />
                Оранжевый
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="green" id="color-green" />
              <Label htmlFor="color-green" className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pomodoro-short-break" />
                Зелёный
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blue" id="color-blue" />
              <Label htmlFor="color-blue" className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pomodoro-long-break" />
                Синий
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="purple" id="color-purple" />
              <Label htmlFor="color-purple" className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500" />
                Фиолетовый
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="white" id="color-white" />
              <Label htmlFor="color-white" className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-foreground border" />
                Белый/Чёрный
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Уведомления
          </CardTitle>
          <CardDescription>Настройте способы уведомления о завершении сессии</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="flex items-center gap-2">
              {notifications.sound ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              Звуковое уведомление
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onTestSound}
                className="glass"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Тест
              </Button>
              <Switch
                id="sound"
                checked={notifications.sound}
                onCheckedChange={(checked) => onUpdateNotifications({ sound: checked })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="browser" className="flex items-center gap-2">
              Push-уведомление в браузере
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onTestBrowserNotification}
                className="glass"
              >
                <BellRing className="h-4 w-4 mr-1" />
                Тест
              </Button>
              <Switch
                id="browser"
                checked={notifications.browser}
                onCheckedChange={(checked) => onUpdateNotifications({ browser: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
 
       {/* Telegram */}
       <Card className="glass-card border-0">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Send className="h-5 w-5" />
              Интеграция с Telegram
           </CardTitle>
            <CardDescription>Отправляйте уведомления в ваш Telegram-чат</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
              <Label htmlFor="telegram-enabled">Включить Telegram</Label>
             <Switch
               id="telegram-enabled"
               checked={telegram.enabled}
               onCheckedChange={(checked) => onUpdateTelegram({ enabled: checked })}
             />
           </div>
           
           {telegram.enabled && (
             <>
               <div className="space-y-2">
                  <Label htmlFor="bot-token">Токен бота</Label>
                 <Input
                   id="bot-token"
                   type="password"
                   placeholder="123456789:ABCdefGHI..."
                   value={telegram.token}
                   onChange={(e) => onUpdateTelegram({ token: e.target.value })}
                   className="glass"
                 />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="chat-id">ID чата</Label>
                 <Input
                   id="chat-id"
                   placeholder="-1001234567890"
                   value={telegram.chatId}
                   onChange={(e) => onUpdateTelegram({ chatId: e.target.value })}
                   className="glass"
                 />
               </div>
               <Button
                 variant="outline"
                 onClick={() => onTestTelegram(telegram.token, telegram.chatId)}
                 disabled={!telegram.token || !telegram.chatId}
                 className="glass"
               >
                  Проверить подключение
               </Button>
             </>
           )}
         </CardContent>
       </Card>
 
       {/* Webhook */}
       <Card className="glass-card border-0">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Webhook className="h-5 w-5" />
              Пользовательский Webhook
           </CardTitle>
            <CardDescription>Отправляйте POST-запросы на ваш endpoint</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
              <Label htmlFor="webhook-enabled">Включить Webhook</Label>
             <Switch
               id="webhook-enabled"
               checked={webhook.enabled}
               onCheckedChange={(checked) => onUpdateWebhook({ enabled: checked })}
             />
           </div>
           
           {webhook.enabled && (
             <>
               <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL-адрес</Label>
                 <Input
                   id="webhook-url"
                   type="url"
                   placeholder="https://your-api.com/webhook"
                   value={webhook.url}
                   onChange={(e) => onUpdateWebhook({ url: e.target.value })}
                   className="glass"
                 />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="webhook-payload">JSON-данные</Label>
                 <Textarea
                   id="webhook-payload"
                   placeholder='{"event": "pomodoro_complete", "timestamp": "{{timestamp}}"}'
                   value={webhook.payload}
                   onChange={(e) => onUpdateWebhook({ payload: e.target.value })}
                   className="glass font-mono text-sm"
                   rows={4}
                 />
                 <p className="text-xs text-muted-foreground">
                    Используйте {"{{timestamp}}"} и {"{{mode}}"} как плейсхолдеры
                 </p>
               </div>
               <Button
                 variant="outline"
                 onClick={() => onTestWebhook(webhook.url, webhook.payload)}
                 disabled={!webhook.url}
                 className="glass"
               >
                  Проверить Webhook
               </Button>
             </>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }