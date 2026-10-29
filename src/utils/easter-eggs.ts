import { Notification } from '../types';

export function initKonamiCode(callback: () => void): () => void {
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  let konamiIndex = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase() || e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        callback();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

export function initSecretClicks(elementId: string, count: number, callback: () => void): () => void {
  let clicks = 0;
  let timer: number | null = null;

  const handleClick = () => {
    clicks++;
    if (timer) clearTimeout(timer);
    
    if (clicks >= count) {
      callback();
      clicks = 0;
    } else {
      timer = window.setTimeout(() => {
        clicks = 0;
      }, 1000);
    }
  };

  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }
  return () => {};
}

export const secretTerminalCommands: Record<string, string | null> = {
  'sudo': 'Nice try! Access denied. 😏',
  'hack': 'Accessing mainframe... Just kidding.',
  'nova': 'NOVA 30 OS was created by a mysterious developer in 1998...',
  'secret': 'You found a secret! But there are more...',
  '42': 'The answer to life, the universe, and everything.',
  'hello': 'Hello, user. Welcome to NOVA 30 OS.',
  'exit': 'There is no escape from NOVA 30 OS.',
  'doom': 'DOOM is not installed. Yet.',
  'love': '❤️ NOVA 30 OS loves you too!',
  'matrix': null, // handled separately with animation in terminal component
};

export function triggerBlueScreen(): { title: string; code: string; message: string } {
  return {
    title: 'NOVA 30 OS - Fatal Exception',
    code: '0x0000000A: IRQL_NOT_LESS_OR_EQUAL',
    message: 'A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +\n00010E36. The current application will be terminated.\n\n* Press any key to terminate the current application.\n* Press CTRL+ALT+DEL again to restart your computer. You will\n  lose any unsaved information in all applications.'
  };
}

export function triggerFakeError(): Notification {
  const errors = [
    'Task failed successfully.',
    'Error 404: Motivation not found.',
    'Mouse moved. Please restart computer for changes to take effect.',
    'Keyboard not found. Press F1 to continue.',
    'Windows found a virus. It has been deleted. Also, Windows has been deleted.'
  ];
  
  return {
    id: `err-${Date.now()}`,
    title: 'System Error',
    message: errors[Math.floor(Math.random() * errors.length)],
    type: 'error',
    icon: '❌'
  };
}

export function getRandomPopup(): Notification {
  const popups = [
    'Have you tried turning it off and on again?',
    "Don't forget to defragment your hard drive!",
    'You have 1 new unread email from: Nigerian Prince',
    'Clippy says: It looks like you are writing a letter!',
    'Winamp: It really whips the llama\'s ass!'
  ];

  return {
    id: `popup-${Date.now()}`,
    title: 'Did you know?',
    message: popups[Math.floor(Math.random() * popups.length)],
    type: 'info',
    icon: '💡'
  };
}
