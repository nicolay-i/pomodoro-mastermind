import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimerMode, TimerTextColor, MODE_LABELS } from '@/types/pomodoro';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  mode: TimerMode;
  formattedTime: string;
  isRunning: boolean;
  sessionsCompleted: number;
  timerTextColor: TimerTextColor;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeMode: (mode: TimerMode) => void;
}
 
 const modes: TimerMode[] = ['work', 'shortBreak', 'longBreak'];
 
 const modeStyles: Record<TimerMode, { bg: string; text: string; glow: string }> = {
   work: {
     bg: 'gradient-bg-work',
     text: 'text-pomodoro-work',
     glow: 'shadow-[0_0_60px_rgba(249,115,22,0.3)]',
   },
   shortBreak: {
     bg: 'gradient-bg-short-break',
     text: 'text-pomodoro-short-break',
     glow: 'shadow-[0_0_60px_rgba(34,197,94,0.3)]',
   },
   longBreak: {
     bg: 'gradient-bg-long-break',
     text: 'text-pomodoro-long-break',
     glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]',
   },
 };
 
const TEXT_COLOR_CLASSES: Record<TimerTextColor, string> = {
  orange: 'text-pomodoro-work',
  green: 'text-pomodoro-short-break',
  blue: 'text-pomodoro-long-break',
  purple: 'text-purple-500',
  white: 'text-foreground',
};

export function TimerDisplay({
  mode,
  formattedTime,
  isRunning,
  sessionsCompleted,
  timerTextColor,
  onStart,
  onPause,
  onReset,
  onChangeMode,
}: TimerDisplayProps) {
  const currentStyle = modeStyles[mode];
  const textColorClass = TEXT_COLOR_CLASSES[timerTextColor];
 
   return (
     <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
       {/* Mode Selector */}
       <div className="flex gap-2 p-1 glass-card">
         {modes.map((m) => (
           <button
             key={m}
             onClick={() => onChangeMode(m)}
             className={cn(
               'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
               mode === m
                 ? `${modeStyles[m].bg} ${modeStyles[m].text}`
                 : 'text-muted-foreground hover:text-foreground'
             )}
           >
             {MODE_LABELS[m]}
           </button>
         ))}
       </div>
 
       {/* Timer Card */}
        <div
          className={cn(
            'glass-card p-8 md:p-12 transition-all duration-500',
            currentStyle.bg,
            isRunning && currentStyle.glow
          )}
        >
          <div
            className={cn(
              'text-7xl md:text-9xl font-mono font-bold tracking-tight transition-colors duration-500',
              textColorClass,
              isRunning && 'animate-pulse-glow'
            )}
          >
            {formattedTime}
          </div>
        </div>
 
       {/* Controls */}
       <div className="flex items-center gap-4">
         <Button
           variant="ghost"
           size="icon"
           onClick={onReset}
           className="glass-card h-12 w-12 hover:scale-105 transition-transform"
         >
           <RotateCcw className="h-5 w-5" />
         </Button>
 
         <Button
           onClick={isRunning ? onPause : onStart}
           className={cn(
             'glass-card h-16 w-16 rounded-full transition-all duration-300 hover:scale-110',
             currentStyle.bg,
             currentStyle.text,
             'border-2',
             mode === 'work' && 'border-pomodoro-work/50',
             mode === 'shortBreak' && 'border-pomodoro-short-break/50',
             mode === 'longBreak' && 'border-pomodoro-long-break/50'
           )}
         >
           {isRunning ? (
             <Pause className="h-6 w-6" />
           ) : (
             <Play className="h-6 w-6 ml-1" />
           )}
         </Button>
 
         <div className="glass-card h-12 px-4 flex items-center justify-center">
           <span className="text-sm text-muted-foreground">
             🍅 <span className="font-semibold text-foreground">{sessionsCompleted}</span>
           </span>
         </div>
       </div>
     </div>
   );
 }