 import { Moon, Sun, Timer } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface HeaderProps {
   theme: 'light' | 'dark';
   onToggleTheme: () => void;
 }
 
 export function Header({ theme, onToggleTheme }: HeaderProps) {
   return (
     <header className="w-full flex items-center justify-between px-4 py-4 md:px-8">
       <div className="flex items-center gap-2">
         <div className="p-2 rounded-xl glass">
           <Timer className="h-6 w-6 text-pomodoro-work" />
         </div>
         <h1 className="text-xl font-bold text-foreground">Pomodoro</h1>
       </div>
       
       <Button
         variant="ghost"
         size="icon"
         onClick={onToggleTheme}
         className="glass-card h-10 w-10 transition-all duration-300 hover:scale-105"
       >
         {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-pomodoro-work" />
         ) : (
        <Moon className="h-5 w-5 text-muted-foreground" />
         )}
       </Button>
     </header>
   );
 }