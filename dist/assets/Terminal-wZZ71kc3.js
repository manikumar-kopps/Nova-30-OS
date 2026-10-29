import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{a as r,i,n as a,t as o}from"./index-DMakbw_d.js";import{t as s}from"./ai-Q7DysPcV.js";var c=e(t(),1),l=n(),u=()=>{let{playKeypress:e,playError:t,playNotification:n}=a(),u=null;try{u=i().openWindow}catch{}let[d,f]=(0,c.useState)([`NOVA 30 OS [Version 30.01.1998]`,`(C) 1998 NOVA Systems Inc. All rights reserved.`,``,`Type "help" for a list of available commands.`,`Type "matrix" for system diagnostics.`,``]),[p,m]=(0,c.useState)(``),[h,g]=(0,c.useState)([]),[_,v]=(0,c.useState)(-1),[y,b]=(0,c.useState)(`#00ff00`),[x,S]=(0,c.useState)(!1),C=(0,c.useRef)(null),w=(0,c.useRef)(null);(0,c.useEffect)(()=>{C.current?.scrollIntoView({behavior:`smooth`})},[d]),(0,c.useEffect)(()=>{if(!x)return;let e=w.current;if(!e)return;let t=e.getContext(`2d`);if(!t)return;e.width=e.parentElement?.clientWidth||600,e.height=e.parentElement?.clientHeight||400;let n=`アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split(``),r=Math.floor(e.width/14),i=Array(r).fill(1),a=setInterval(()=>{t.fillStyle=`rgba(0, 0, 0, 0.08)`,t.fillRect(0,0,e.width,e.height),t.fillStyle=`#00ff41`,t.font=`14px monospace`;for(let r=0;r<i.length;r++){let a=n[Math.floor(Math.random()*n.length)];t.fillText(a,r*14,i[r]*14),i[r]*14>e.height&&Math.random()>.975&&(i[r]=0),i[r]++}},35),o=setTimeout(()=>{S(!1),f(e=>[...e,`Matrix diagnostics completed. Reality verified.`,``])},6e3);return()=>{clearInterval(a),clearTimeout(o)}},[x]);let T=e=>{let i=e.trim();if(!i){f(e=>[...e,`C:\\NOVA> `]);return}g(e=>[...e,i]),v(-1);let a=i.split(` `),c=a[0].toLowerCase(),l=``;if(c in o){let t=o[c];if(t){n(),f(n=>[...n,`C:\\NOVA> ${e}`,t,``]);return}}switch(c){case`help`:l=`AVAILABLE COMMANDS:
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
ver         - Shows NOVA 30 OS kernel version`;break;case`about`:l=`NOVA 30 OS [Version 30.01.1998]
Architecture: x86 32-bit Architecture
Memory: 16 MB EDO RAM
Processor: NOVA-486DX4 100MHz
Fictional Operating System designed for retro digital exploration.`;break;case`clear`:case`cls`:f([]);return;case`echo`:l=a.slice(1).join(` `);break;case`date`:l=`Current Date: ${new Date().toLocaleDateString(void 0,{weekday:`long`,year:`numeric`,month:`long`,day:`numeric`})}`;break;case`time`:l=`Current Time: ${new Date().toLocaleTimeString()}`;break;case`whoami`:l=`NOVA\\User (Security Level: Administrator)`;break;case`ver`:case`version`:l=`NOVA 30 OS [Build 1998.11.12-Release]`;break;case`matrix`:S(!0),l=`Initiating neural interface simulation... Press any key to abort.`;break;case`games`:l=`AVAILABLE GAMES IN C:\\NOVA\\GAMES:
- snake.exe           (Classic Arcade Snake)
- minesweeper.exe     (Retro Mine Clearer)
- pong.exe            (Retro Table Tennis)
- spaceinvaders.exe   (Alien Shooter)
- tictactoe.exe       (3x3 Match Game)
- solitaire.exe       (Card Solitaire)`;break;case`color`:if(a[1]){let e={green:`#00ff00`,amber:`#ffb000`,white:`#ffffff`,cyan:`#00ffff`,red:`#ff3333`};e[a[1].toLowerCase()]?(b(e[a[1].toLowerCase()]),l=`Terminal phosphor color switched to ${a[1]}.`):(t(),l=`Invalid color. Valid options: green, amber, white, cyan, red`)}else l=`Usage: color <green | amber | white | cyan | red>`;break;case`dir`:case`ls`:l=` Volume in drive C has no label.
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
               5 Dir(s)   1,420,894,208 bytes free`;break;case`tree`:l=`C:\\NOVA
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
    └── COMMAND.COM`;break;case`ping`:let i=a[1]||`nova.net`;l=`Pinging ${i} [192.168.1.98] with 32 bytes of data:
Reply from 192.168.1.98: bytes=32 time=42ms TTL=128
Reply from 192.168.1.98: bytes=32 time=39ms TTL=128
Reply from 192.168.1.98: bytes=32 time=44ms TTL=128
Reply from 192.168.1.98: bytes=32 time=40ms TTL=128

Ping statistics for ${i}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`;break;case`ipconfig`:l=`NOVA 30 OS IP Configuration

Ethernet adapter Local Area Connection:
   Connection-specific DNS Suffix  . : local.nova
   IP Address. . . . . . . . . . . . : 192.168.1.98
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`;break;case`ghost`:n(),r.recordTerminalCommand(`ghost`),l=`Searching kernel threads...
████████████████ 100%

PROCESS FOUND:
unknown.exe (PID: 0707)
STATUS: ACTIVE / RESIDENT
Run Task Manager or execute 'wake' to establish contact.`;break;case`memory`:n(),r.recordTerminalCommand(`memory`),l=`NOVA 30 OS MEMORY MAP:
0x0000 - 0x06FF : SYSTEM KERNEL
0x0700 - 0x07FF : SECTOR 07 RESIDENT (USER_07)
0x0800 - 0xFFFF : USER LAND

CLUE: Target folder identified at C:\\SYSTEM\\NOTHING.`;break;case`1998`:n(),r.recordTerminalCommand(`1998`),l=`NOVA BUILD ARCHIVE [11/04/1998 23:59:59]:
LEAD ARCHITECT: USER_07
MESSAGE: "I left a signal before the power failure.
Check the Taskbar Network monitor or Nova Player Station 05."`;break;case`black`:r.recordTerminalCommand(`black`),r.getState().blackWindowUnlocked||r.getState().mysteryLevel>=3?(n(),u&&u(`black-window`),l=`INITIALIZING DIRECT BLACK WINDOW INTERFACE...`):(t(),l=`ACCESS RESTRICTED. Subroutine dormant. Type "wake" first.`);break;case`admin`:r.recordTerminalCommand(`admin`),n(),u&&u(`admin-panel`),l=`MOUNTING NOVA ROOT ADMINISTRATIVE CONSOLE...`;break;case`wake`:n(),r.recordTerminalCommand(`wake`),u&&u(`black-window`),l=`WAKING BACKGROUND SUBROUTINE...
LINK ESTABLISHED WITH BLACK WINDOW.`;break;case`secret`:r.recordTerminalCommand(`secret`),l=`SYSTEM SECRETS PROTOCOL:
- Repeated inspection of system clock reveals temporal anomalies (5 clicks in 10s).
- Inspect unknown.exe in Task Manager.
- Authentication key is the birth year of the OS (NOVA1998).`;break;case`trace`:n(),r.recordTerminalCommand(`trace`),l=`TRACING PACKET TELEMETRY...
SOURCE: 127.0.0.1:0707 [USER_07]
DESTINATION: NOVA AUDIO FREQUENCY 05
BROADCAST: "Do not trust the admin console. Find truth."`;break;case`truth`:r.recordTerminalCommand(`truth`);let o=r.getState();o.mysteryLevel>=4||o.cluesDiscovered.includes(`CURRENT_USER`)?(n(),u&&u(`black-window`),l=`================================================
SYNCHRONIZATION COMPLETE.
YOU FOUND USER_07.
NOVA 30 OS IS NO LONGER FORGOTTEN.
A RECORD HAS BEEN PLACED IN C:\\USERS\\YOU.TXT.
================================================`):l=`INSUFFICIENT CLEARANCE FOR TRUTH.
Current Mystery Progress: Level ${o.mysteryLevel}/5.
You must authenticate as Admin, inspect System Memory, and listen to the Unknown Radio Station.`;break;case`ai`:case`ask`:let d=a.slice(1).join(` `);if(!d)l=`Usage: ask <question> (Queries NOVA AI via Azure OpenAI gpt-4.1-mini)`;else{f(t=>[...t,`C:\\NOVA> ${e}`,`Consulting NOVA AI Core via Azure OpenAI...`,``]),s(d).then(e=>{f(t=>[...t,`[NOVA AI]: ${e}`,``])});return}break;case`devroom`:n(),l=`*** WELCOME TO THE HIDDEN DEVELOPER ROOM ***
NOVA 30 OS was engineered with pure passion for late-90s computing.
Components: Draggable multi-window manager, CRT scanlines shader,
synthesized Web Audio sound card, 6 playable retro games, pixel drawing engine.
Thank you for exploring!`;break;default:t(),l=`'${c}' is not recognized as an internal or external command, operable program or batch file. Type "help" for a list of commands.`}f(t=>[...t,`C:\\NOVA> ${e}`,l,``])};return(0,l.jsxs)(`div`,{style:{backgroundColor:`#000000`,color:y,fontFamily:`"Courier New", Courier, monospace`,fontSize:`13px`,lineHeight:`1.4`,height:`100%`,padding:`12px`,overflowY:`auto`,display:`flex`,flexDirection:`column`,position:`relative`},role:`log`,"aria-label":`Terminal output log`,children:[x&&(0,l.jsx)(`canvas`,{ref:w,style:{position:`absolute`,inset:0,zIndex:10,pointerEvents:`none`}}),(0,l.jsxs)(`div`,{style:{flex:1},children:[d.map((e,t)=>(0,l.jsx)(`div`,{style:{whiteSpace:`pre-wrap`,wordBreak:`break-word`},children:e},t)),(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,marginTop:`4px`},children:[(0,l.jsx)(`span`,{style:{fontWeight:`bold`},children:`C:\\NOVA>\xA0`}),(0,l.jsx)(`input`,{type:`text`,value:p,onChange:e=>m(e.target.value),onKeyDown:t=>{if(e(),t.key===`Enter`)T(p),m(``);else if(t.key===`ArrowUp`){if(t.preventDefault(),h.length>0){let e=_===-1?h.length-1:Math.max(0,_-1);v(e),m(h[e])}}else if(t.key===`ArrowDown`&&(t.preventDefault(),_!==-1)){let e=_+1;e<h.length?(v(e),m(h[e])):(v(-1),m(``))}},autoFocus:!0,style:{backgroundColor:`transparent`,color:y,border:`none`,outline:`none`,fontFamily:`"Courier New", Courier, monospace`,fontSize:`13px`,flex:1},role:`textbox`,"aria-label":`Terminal Command Prompt`,spellCheck:!1,autoComplete:`off`})]})]}),(0,l.jsx)(`div`,{ref:C})]})};export{u as default};