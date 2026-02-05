 // Pomodoro Timer Web Worker
 // Handles accurate timing even when browser tab is inactive
 
 let intervalId = null;
 let remainingSeconds = 0;
 let isRunning = false;
 
 self.onmessage = function(e) {
   const { type, payload } = e.data;
 
   switch (type) {
     case 'START':
       if (!isRunning && remainingSeconds > 0) {
         isRunning = true;
         intervalId = setInterval(() => {
           if (remainingSeconds > 0) {
             remainingSeconds--;
             self.postMessage({ type: 'TICK', payload: remainingSeconds });
           }
           if (remainingSeconds === 0) {
             clearInterval(intervalId);
             intervalId = null;
             isRunning = false;
             self.postMessage({ type: 'COMPLETE' });
           }
         }, 1000);
       }
       break;
 
     case 'PAUSE':
       if (intervalId) {
         clearInterval(intervalId);
         intervalId = null;
       }
       isRunning = false;
       break;
 
     case 'RESET':
       if (intervalId) {
         clearInterval(intervalId);
         intervalId = null;
       }
       isRunning = false;
       remainingSeconds = payload;
       self.postMessage({ type: 'TICK', payload: remainingSeconds });
       break;
 
     case 'SET_TIME':
       remainingSeconds = payload;
       self.postMessage({ type: 'TICK', payload: remainingSeconds });
       break;
   }
 };