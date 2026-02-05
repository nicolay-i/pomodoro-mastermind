import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Settings } from 'lucide-react';
import { Header } from '@/components/Header';
import { TimerDisplay } from '@/components/TimerDisplay';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useSettings } from '@/hooks/useSettings';
import { useTimer } from '@/hooks/useTimer';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

const Index = () => {
  const {
    settings,
    toggleTheme,
    updateNotifications,
    updateTelegram,
    updateWebhook,
    incrementSessions,
  } = useSettings();

  const { notifyComplete, testTelegram, testWebhook } = useNotifications({
    notifications: settings.notifications,
    telegram: settings.integrations.telegram,
    webhook: settings.integrations.webhook,
  });

  const handleTimerComplete = (mode: string) => {
    if (mode === 'work') {
      incrementSessions();
    }
    notifyComplete(mode as 'work' | 'shortBreak' | 'longBreak');
  };

  const timer = useTimer({
    timerSettings: settings.timerSettings,
    onComplete: handleTimerComplete,
  });

  const bgGradient = cn(
    'min-h-screen transition-all duration-700',
    timer.mode === 'work' && 'bg-gradient-to-br from-background via-background to-pomodoro-work/10',
    timer.mode === 'shortBreak' && 'bg-gradient-to-br from-background via-background to-pomodoro-short-break/10',
    timer.mode === 'longBreak' && 'bg-gradient-to-br from-background via-background to-pomodoro-long-break/10'
  );

  return (
    <div className={bgGradient}>
      <div className="container max-w-4xl mx-auto px-4">
        <Header theme={settings.theme} onToggleTheme={toggleTheme} />

        <Tabs defaultValue="timer" className="mt-8">
          <div className="flex justify-center mb-8">
            <TabsList className="glass-card">
              <TabsTrigger value="timer" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Timer
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="timer" className="mt-0">
            <TimerDisplay
              mode={timer.mode}
              formattedTime={timer.formattedTime}
              isRunning={timer.isRunning}
              sessionsCompleted={settings.stats.sessionsCompleted}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
              onChangeMode={timer.changeMode}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsPanel
              notifications={settings.notifications}
              telegram={settings.integrations.telegram}
              webhook={settings.integrations.webhook}
              onUpdateNotifications={updateNotifications}
              onUpdateTelegram={updateTelegram}
              onUpdateWebhook={updateWebhook}
              onTestTelegram={testTelegram}
              onTestWebhook={testWebhook}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
