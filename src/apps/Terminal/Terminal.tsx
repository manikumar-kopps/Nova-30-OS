import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import { secretTerminalCommands } from '../../utils/easter-eggs';
import { useWindows } from '../../contexts/WindowContext';
import { mysteryEngine } from '../../mystery/mysteryEngine';
import { askNovaAi } from '../../utils/ai';

const Terminal: React.FC = () => {
  const { playKeypress, playError, playNotification } = useSound();
  let openWindow: any = null;
  try {
    const wc = useWindows();
    openWindow = wc.openWindow;
  } catch {}
  const [history, setHistory] = useState<string[]>([
    'NOVA 30 OS [Version 30.01.1998]',
    '(C) 1998 NOVA Systems Inc. All rights reserved.',
    '',
    'Type "help" for a list of available commands.',
    'Type "matrix" for system diagnostics.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textColor, setTextColor] = useState('#00ff00');
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Matrix falling rain animation
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const characters = katakana.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 35);

    const timeout = setTimeout(() => {
      setIsMatrixActive(false);
      setHistory(prev => [...prev, 'Matrix diagnostics completed. Reality verified.', '']);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isMatrixActive]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) {
      setHistory(prev => [...prev, 'C:\\NOVA> ']);
      return;
    }

    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const args = trimmedCmd.split(' ');
    const baseCmd = args[0].toLowerCase();
    let response = '';

    // Check easter eggs first
    if (baseCmd in secretTerminalCommands) {
      const secret = secretTerminalCommands[baseCmd];
      if (secret) {
        playNotification();
        setHistory(prev => [...prev, `C:\\NOVA> ${cmd}`, secret, '']);
        return;
      }
    }

    switch (baseCmd) {
      case 'help':
        response = `AVAILABLE COMMANDS:
----------------------------------------
help        - Displays this command reference
about       - System and OS information
date        - Displays current system date
time        - Displays current system time
matrix      - Runs digital rain simulation
games       - Lists available retro games
clear / cls - Clears the terminal screen
echo <text> - Prints text to the console
whoami      - Displays current user profile
dir / ls    - Lists files in current directory
tree        - Visualizes directory tree
ping <host> - Sends ICMP ping packets
ipconfig    - Shows network configuration
color <c>   - Changes terminal color (green, amber, white, cyan, red)
ver         - Shows NOVA 30 OS kernel version`;
        break;

      case 'about':
        response = `NOVA 30 OS [Version 30.01.1998]
Architecture: x86 32-bit Architecture
Memory: 16 MB EDO RAM
Processor: NOVA-486DX4 100MHz
Fictional Operating System designed for retro digital exploration.`;
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'echo':
        response = args.slice(1).join(' ');
        break;

      case 'date':
        response = `Current Date: ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        break;

      case 'time':
        response = `Current Time: ${new Date().toLocaleTimeString()}`;
        break;

      case 'whoami':
        response = 'NOVA\\User (Security Level: Administrator)';
        break;

      case 'ver':
      case 'version':
        response = 'NOVA 30 OS [Build 1998.11.12-Release]';
        break;

      case 'matrix':
        setIsMatrixActive(true);
        response = 'Initiating neural interface simulation... Press any key to abort.';
        break;

      case 'games':
        response = `AVAILABLE GAMES IN C:\\NOVA\\GAMES:
- snake.exe           (Classic Arcade Snake)
- minesweeper.exe     (Retro Mine Clearer)
- pong.exe            (Retro Table Tennis)
- spaceinvaders.exe   (Alien Shooter)
- tictactoe.exe       (3x3 Match Game)
- solitaire.exe       (Card Solitaire)`;
        break;

      case 'color':
        if (args[1]) {
          const colors: Record<string, string> = {
            green: '#00ff00',
            amber: '#ffb000',
            white: '#ffffff',
            cyan: '#00ffff',
            red: '#ff3333'
          };
          if (colors[args[1].toLowerCase()]) {
            setTextColor(colors[args[1].toLowerCase()]);
            response = `Terminal phosphor color switched to ${args[1]}.`;
          } else {
            playError();
            response = 'Invalid color. Valid options: green, amber, white, cyan, red';
          }
        } else {
          response = 'Usage: color <green | amber | white | cyan | red>';
        }
        break;

      case 'dir':
      case 'ls':
        response = ` Volume in drive C has no label.
 Volume Serial Number is 1998-NOVA
 Directory of C:\\NOVA

11/12/1998  08:30 AM    <DIR>          .
11/12/1998  08:30 AM    <DIR>          ..
11/12/1998  09:15 AM    <DIR>          SYSTEM
11/12/1998  10:22 AM    <DIR>          GAMES
11/12/1998  11:00 AM    <DIR>          DOCS
11/12/1998  08:30 AM             1,440 CONFIG.SYS
11/12/1998  08:30 AM               820 AUTOEXEC.BAT
11/12/1998  04:12 PM               256 SECRET.TXT
               3 File(s)          2,516 bytes
               5 Dir(s)   1,420,894,208 bytes free`;
        break;

      case 'tree':
        response = `C:\\NOVA
├── DOCUMENTS
│   ├── README.TXT
│   └── SECRET.TXT
├── GAMES
│   ├── SNAKE.EXE
│   ├── MINESWEEPER.EXE
│   └── PONG.EXE
├── MUSIC
│   └── TRACK01.MID
└── SYSTEM
    ├── NOVA.SYS
    └── COMMAND.COM`;
        break;

      case 'ping':
        const host = args[1] || 'nova.net';
        response = `Pinging ${host} [192.168.1.98] with 32 bytes of data:
Reply from 192.168.1.98: bytes=32 time=42ms TTL=128
Reply from 192.168.1.98: bytes=32 time=39ms TTL=128
Reply from 192.168.1.98: bytes=32 time=44ms TTL=128
Reply from 192.168.1.98: bytes=32 time=40ms TTL=128

Ping statistics for ${host}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`;
        break;

      case 'ipconfig':
        response = `NOVA 30 OS IP Configuration

Ethernet adapter Local Area Connection:
   Connection-specific DNS Suffix  . : local.nova
   IP Address. . . . . . . . . . . . : 192.168.1.98
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`;
        break;

      case 'ghost':
        playNotification();
        mysteryEngine.recordTerminalCommand('ghost');
        response = `Searching kernel threads...
████████████████ 100%

PROCESS FOUND:
unknown.exe (PID: 0707)
STATUS: ACTIVE / RESIDENT
Run Task Manager or execute 'wake' to establish contact.`;
        break;

      case 'memory':
        playNotification();
        mysteryEngine.recordTerminalCommand('memory');
        response = `NOVA 30 OS MEMORY MAP:
0x0000 - 0x06FF : SYSTEM KERNEL
0x0700 - 0x07FF : SECTOR 07 RESIDENT (USER_07)
0x0800 - 0xFFFF : USER LAND

CLUE: Target folder identified at C:\\SYSTEM\\NOTHING.`;
        break;

      case '1998':
        playNotification();
        mysteryEngine.recordTerminalCommand('1998');
        response = `NOVA BUILD ARCHIVE [11/04/1998 23:59:59]:
LEAD ARCHITECT: USER_07
MESSAGE: "I left a signal before the power failure.
Check the Taskbar Network monitor or Nova Player Station 05."`;
        break;

      case 'black':
        mysteryEngine.recordTerminalCommand('black');
        if (mysteryEngine.getState().blackWindowUnlocked || mysteryEngine.getState().mysteryLevel >= 3) {
          playNotification();
          if (openWindow) openWindow('black-window');
          response = 'INITIALIZING DIRECT BLACK WINDOW INTERFACE...';
        } else {
          playError();
          response = 'ACCESS RESTRICTED. Subroutine dormant. Type "wake" first.';
        }
        break;

      case 'admin':
        mysteryEngine.recordTerminalCommand('admin');
        playNotification();
        if (openWindow) openWindow('admin-panel');
        response = 'MOUNTING NOVA ROOT ADMINISTRATIVE CONSOLE...';
        break;

      case 'wake':
        playNotification();
        mysteryEngine.recordTerminalCommand('wake');
        if (openWindow) openWindow('black-window');
        response = `WAKING BACKGROUND SUBROUTINE...
LINK ESTABLISHED WITH BLACK WINDOW.`;
        break;

      case 'secret':
        mysteryEngine.recordTerminalCommand('secret');
        response = `SYSTEM SECRETS PROTOCOL:
- Repeated inspection of system clock reveals temporal anomalies (5 clicks in 10s).
- Inspect unknown.exe in Task Manager.
- Authentication key is the birth year of the OS (NOVA1998).`;
        break;

      case 'trace':
        playNotification();
        mysteryEngine.recordTerminalCommand('trace');
        response = `TRACING PACKET TELEMETRY...
SOURCE: 127.0.0.1:0707 [USER_07]
DESTINATION: NOVA AUDIO FREQUENCY 05
BROADCAST: "Do not trust the admin console. Find truth."`;
        break;

      case 'truth':
        mysteryEngine.recordTerminalCommand('truth');
        const mState = mysteryEngine.getState();
        if (mState.mysteryLevel >= 4 || mState.cluesDiscovered.includes('CURRENT_USER')) {
          playNotification();
          if (openWindow) openWindow('black-window');
          response = `================================================
SYNCHRONIZATION COMPLETE.
YOU FOUND USER_07.
NOVA 30 OS IS NO LONGER FORGOTTEN.
A RECORD HAS BEEN PLACED IN C:\\USERS\\YOU.TXT.
================================================`;
        } else {
          response = `INSUFFICIENT CLEARANCE FOR TRUTH.
Current Mystery Progress: Level ${mState.mysteryLevel}/5.
You must authenticate as Admin, inspect System Memory, and listen to the Unknown Radio Station.`;
        }
        break;

      case 'ai':
      case 'ask':
        const query = args.slice(1).join(' ');
        if (!query) {
          response = 'Usage: ask <question> (Queries NOVA AI via Azure OpenAI gpt-4.1-mini)';
        } else {
          setHistory(prev => [...prev, `C:\\NOVA> ${cmd}`, 'Consulting NOVA AI Core via Azure OpenAI...', '']);
          askNovaAi(query).then(aiAnswer => {
            setHistory(prev => [...prev, `[NOVA AI]: ${aiAnswer}`, '']);
          });
          return;
        }
        break;

      case 'devroom':
        playNotification();
        response = `*** WELCOME TO THE HIDDEN DEVELOPER ROOM ***
NOVA 30 OS was engineered with pure passion for late-90s computing.
Components: Draggable multi-window manager, CRT scanlines shader,
synthesized Web Audio sound card, 6 playable retro games, pixel drawing engine.
Thank you for exploring!`;
        break;

      default:
        playError();
        response = `'${baseCmd}' is not recognized as an internal or external command, operable program or batch file. Type "help" for a list of commands.`;
    }

    setHistory(prev => [...prev, `C:\\NOVA> ${cmd}`, response, '']);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeypress();

    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    }
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#000000', 
        color: textColor, 
        fontFamily: '"Courier New", Courier, monospace', 
        fontSize: '13px',
        lineHeight: '1.4',
        height: '100%', 
        padding: '12px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }} 
      role="log"
      aria-label="Terminal output log"
    >
      {/* Matrix Canvas Overlay */}
      {isMatrixActive && (
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
        />
      )}

      <div style={{ flex: 1 }}>
        {history.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</div>
        ))}
        
        {/* Active command prompt */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontWeight: 'bold' }}>C:\NOVA&gt;&nbsp;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ 
              backgroundColor: 'transparent', 
              color: textColor, 
              border: 'none', 
              outline: 'none', 
              fontFamily: '"Courier New", Courier, monospace', 
              fontSize: '13px',
              flex: 1 
            }}
            role="textbox"
            aria-label="Terminal Command Prompt"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default Terminal;
