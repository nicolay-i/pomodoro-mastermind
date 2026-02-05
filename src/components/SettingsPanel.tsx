 import { Bell, BellOff, Send, Webhook } from 'lucide-react';
 import { Switch } from '@/components/ui/switch';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { NotificationSettings, TelegramSettings, WebhookSettings } from '@/types/pomodoro';
 
 interface SettingsPanelProps {
   notifications: NotificationSettings;
   telegram: TelegramSettings;
   webhook: WebhookSettings;
   onUpdateNotifications: (n: Partial<NotificationSettings>) => void;
   onUpdateTelegram: (t: Partial<TelegramSettings>) => void;
   onUpdateWebhook: (w: Partial<WebhookSettings>) => void;
   onTestTelegram: (token: string, chatId: string) => Promise<boolean>;
   onTestWebhook: (url: string, payload: string) => Promise<boolean>;
 }
 
 export function SettingsPanel({
   notifications,
   telegram,
   webhook,
   onUpdateNotifications,
   onUpdateTelegram,
   onUpdateWebhook,
   onTestTelegram,
   onTestWebhook,
 }: SettingsPanelProps) {
   return (
     <div className="w-full max-w-2xl mx-auto space-y-6">
       {/* Notifications */}
       <Card className="glass-card border-0">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Bell className="h-5 w-5" />
             Notifications
           </CardTitle>
           <CardDescription>Configure how you want to be notified when a session ends</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
             <Label htmlFor="sound" className="flex items-center gap-2">
               {notifications.sound ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
               Sound Notification
             </Label>
             <Switch
               id="sound"
               checked={notifications.sound}
               onCheckedChange={(checked) => onUpdateNotifications({ sound: checked })}
             />
           </div>
           <div className="flex items-center justify-between">
             <Label htmlFor="browser" className="flex items-center gap-2">
               Browser Push Notification
             </Label>
             <Switch
               id="browser"
               checked={notifications.browser}
               onCheckedChange={(checked) => onUpdateNotifications({ browser: checked })}
             />
           </div>
         </CardContent>
       </Card>
 
       {/* Telegram */}
       <Card className="glass-card border-0">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Send className="h-5 w-5" />
             Telegram Integration
           </CardTitle>
           <CardDescription>Send notifications to your Telegram chat</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
             <Label htmlFor="telegram-enabled">Enable Telegram</Label>
             <Switch
               id="telegram-enabled"
               checked={telegram.enabled}
               onCheckedChange={(checked) => onUpdateTelegram({ enabled: checked })}
             />
           </div>
           
           {telegram.enabled && (
             <>
               <div className="space-y-2">
                 <Label htmlFor="bot-token">Bot Token</Label>
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
                 <Label htmlFor="chat-id">Chat ID</Label>
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
                 Test Connection
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
             Custom Webhook
           </CardTitle>
           <CardDescription>Send POST requests to your custom endpoint</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
             <Label htmlFor="webhook-enabled">Enable Webhook</Label>
             <Switch
               id="webhook-enabled"
               checked={webhook.enabled}
               onCheckedChange={(checked) => onUpdateWebhook({ enabled: checked })}
             />
           </div>
           
           {webhook.enabled && (
             <>
               <div className="space-y-2">
                 <Label htmlFor="webhook-url">Target URL</Label>
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
                 <Label htmlFor="webhook-payload">JSON Payload</Label>
                 <Textarea
                   id="webhook-payload"
                   placeholder='{"event": "pomodoro_complete", "timestamp": "{{timestamp}}"}'
                   value={webhook.payload}
                   onChange={(e) => onUpdateWebhook({ payload: e.target.value })}
                   className="glass font-mono text-sm"
                   rows={4}
                 />
                 <p className="text-xs text-muted-foreground">
                   Use {"{{timestamp}}"} and {"{{mode}}"} as placeholders
                 </p>
               </div>
               <Button
                 variant="outline"
                 onClick={() => onTestWebhook(webhook.url, webhook.payload)}
                 disabled={!webhook.url}
                 className="glass"
               >
                 Test Webhook
               </Button>
             </>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }