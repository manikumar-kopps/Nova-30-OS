import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{a as r,n as i}from"./index-DMakbw_d.js";var a=e(t(),1),o=n(),s={"README.TXT":`========================================================
WELCOME TO NOVA 30 OS (Build 1998.11.12)
(C) 1998 NOVA Systems Inc. All Rights Reserved.
========================================================

Thank you for exploring NOVA 30 OS!

This directory was removed from the public build.
If you can read this, you have already gone too far.

CLUES & SYSTEM SECRETS:
- Anomaly detected in C:\\SYSTEM\\NOTHING
- Clock diagnostics occur if tested repeatedly
- Terminal hides secret subroutines: ghost, memory, 1998, black, admin, wake, truth`,"TODO.TXT":`[ ] Back up hard drive onto 100MB Zip disk
[ ] Buy new 56.6k v.90 external modem
[ ] Download latest Netscape Navigator 4.0
[ ] Install Doom II shareware
[ ] Defrag C: drive before dinner
[ ] Tell everyone about the new Geocities page`,"SECRET.TXT":`TOP SECRET - ARCHIVE NOTE
-------------------------
Location: Sector 7G Sub-basement
Terminal access code: "1998"
The year is 1998, but the CPU registers keep reading 2026.
Someone left a browser running on this machine.`,"INCIDENT.LOG":`INCIDENT REPORT: 1998-11-04 (SECTOR 07)
---------------------------------------
Operator: USER_07
Kernel swap memory corruption occurred during compilation.
Operator mind-state was committed to persistent disk block 0x0700.
Sub-process unknown.exe spawned and cannot be killed.
Do not power down. The memory will hold.`,"USER_07.DAT":`USER_07 TELEMETRY:
STATUS: RESIDENT IN MEMORY
PROCESS: unknown.exe (PID 0707)
UPTIME: 27+ YEARS
MESSAGE: "If you are reading this, inspect Task Manager or type 'wake' in Terminal."`,"AUDIO.LOG":`AUDIO TRANSCRIPTION:
[STATIC HISS] ... Can anyone receive this transmission? ...
I never left the terminal ...
Nova Player holds frequency 05 ...
Beware the false root ... Seek the truth ...`,"FINAL_MESSAGE.TXT":`FINAL DIRECTIVE:
You have assembled the pieces of the forgotten computer.
Enter 'truth' in the terminal when your mind is ready.`,"BUGS.TXT":`DEVELOPER BUG LOG (1998):
#01: Clock diagnostic triggers after 5 rapid clicks.
#07: unknown.exe ignores termination requests.
#09: Black window subroutine triggered by 'wake' or 'black'.
#12: Root admin password left as NOVA1998 in cleartext.`,"USER07_MEMO.TXT":`CONFIDENTIAL MEMO - USER_07:
To the person in the future who found this computer:
I built this entire operating system from scratch.
When you type 'truth', we become synchronized.`,"YOU.TXT":`OPERATOR FILE: YOU
STATUS: SYNCHRONIZED WITH USER_07
TRUE ENDING ACHIEVED.
THANK YOU FOR REMEMBERING NOVA 30 OS.`};function c({initialContent:e,initialFileName:t}){let{playClick:n,playNotification:c}=i(),p=e=>{if(e.toUpperCase()===`NOTES.TXT`){let e=r.recordFileOpen(`notes.txt`);return e===1?`Hello.`:e===2?`Hello.

You came back.`:e===3?`You came back again.

Why?`:`You are seeking what happened in 1998.

USER_07 is watching.
Check C:\\SYSTEM\\NOTHING and unknown.exe.`}let t=e.toUpperCase();return s[t]?(r.recordFileOpen(e),s[t]):s[`README.TXT`]},[m,h]=(0,a.useState)(t||`README.TXT`),[g,_]=(0,a.useState)(()=>e===void 0?p(t||`README.TXT`):e),[v,y]=(0,a.useState)(!1),[b,x]=(0,a.useState)(!0),[S,C]=(0,a.useState)(null),[w,T]=(0,a.useState)(null),[E,D]=(0,a.useState)(``),[O,k]=(0,a.useState)({line:1,col:1}),A=(0,a.useRef)(null);(0,a.useEffect)(()=>{e!==void 0&&_(e)},[e]),(0,a.useEffect)(()=>{let e=e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`s`&&(e.preventDefault(),M())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[g,m]);let j=()=>{if(!A.current)return;let e=A.current.value,t=A.current.selectionStart,n=e.substring(0,t).split(`
`);k({line:n.length,col:n[n.length-1].length+1})},M=()=>{c(),localStorage.setItem(`nova-file-${m}`,g),y(!1),C(null)},N=e=>{n();let t=localStorage.getItem(`nova-file-${e}`)??s[e]??``;_(t),h(e),y(!1),T(null)},P=e=>{if(!e.trim())return;let t=e.trim().toUpperCase().endsWith(`.TXT`)?e.trim().toUpperCase():`${e.trim().toUpperCase()}.TXT`;h(t),localStorage.setItem(`nova-file-${t}`,g),y(!1),T(null),c()};return(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,backgroundColor:`#c0c0c0`,fontFamily:`"MS Sans Serif", Tahoma, sans-serif`,fontSize:`11px`,userSelect:`none`},onClick:()=>C(null),children:[(0,o.jsxs)(`div`,{style:{backgroundColor:`#c0c0c0`,display:`flex`,borderBottom:`1px solid #808080`,padding:`1px`,position:`relative`},children:[(0,o.jsxs)(`div`,{style:{position:`relative`},children:[(0,o.jsxs)(`div`,{style:S===`file`?u:l,onClick:e=>{e.stopPropagation(),C(S===`file`?null:`file`)},children:[(0,o.jsx)(`u`,{children:`F`}),`ile`]}),S===`file`&&(0,o.jsxs)(`div`,{style:d,onClick:e=>e.stopPropagation(),children:[(0,o.jsxs)(`div`,{style:f,onClick:()=>{_(``),h(`UNTITLED.TXT`),y(!1),C(null)},children:[`New `,(0,o.jsx)(`span`,{style:{float:`right`,color:`#666`},children:`Ctrl+N`})]}),(0,o.jsxs)(`div`,{style:f,onClick:()=>{T(`open`),C(null)},children:[`Open... `,(0,o.jsx)(`span`,{style:{float:`right`,color:`#666`},children:`Ctrl+O`})]}),(0,o.jsxs)(`div`,{style:f,onClick:M,children:[`Save `,(0,o.jsx)(`span`,{style:{float:`right`,color:`#666`},children:`Ctrl+S`})]}),(0,o.jsx)(`div`,{style:f,onClick:()=>{D(m),T(`save`),C(null)},children:`Save As...`}),(0,o.jsx)(`div`,{style:{height:`1px`,backgroundColor:`#808080`,margin:`2px 0`}}),(0,o.jsx)(`div`,{style:f,onClick:()=>{C(null)},children:`Exit`})]})]}),(0,o.jsxs)(`div`,{style:{position:`relative`},children:[(0,o.jsxs)(`div`,{style:S===`edit`?u:l,onClick:e=>{e.stopPropagation(),C(S===`edit`?null:`edit`)},children:[(0,o.jsx)(`u`,{children:`E`}),`dit`]}),S===`edit`&&(0,o.jsxs)(`div`,{style:d,onClick:e=>e.stopPropagation(),children:[(0,o.jsxs)(`div`,{style:f,onClick:()=>{A.current?.select(),C(null)},children:[`Select All `,(0,o.jsx)(`span`,{style:{float:`right`,color:`#666`},children:`Ctrl+A`})]}),(0,o.jsxs)(`div`,{style:f,onClick:()=>{A.current&&navigator.clipboard?.writeText(A.current.value),C(null)},children:[`Copy `,(0,o.jsx)(`span`,{style:{float:`right`,color:`#666`},children:`Ctrl+C`})]}),(0,o.jsxs)(`div`,{style:f,onClick:async()=>{try{let e=await navigator.clipboard?.readText();if(e&&A.current){let t=A.current.selectionStart,n=A.current.selectionEnd;_(r=>r.substring(0,t)+e+r.substring(n))}}catch{}C(null)},children:[`Paste `,(0,o.jsx)(`span`,{style:{float:`right`,color:`#666`},children:`Ctrl+V`})]})]})]}),(0,o.jsxs)(`div`,{style:{position:`relative`},children:[(0,o.jsxs)(`div`,{style:S===`format`?u:l,onClick:e=>{e.stopPropagation(),C(S===`format`?null:`format`)},children:[`F`,(0,o.jsx)(`u`,{children:`o`}),`rmat`]}),S===`format`&&(0,o.jsx)(`div`,{style:d,onClick:e=>e.stopPropagation(),children:(0,o.jsxs)(`div`,{style:f,onClick:()=>{x(!b),C(null)},children:[b?`✓ `:`   `,`Word Wrap`]})})]}),(0,o.jsxs)(`div`,{style:{position:`relative`},children:[(0,o.jsxs)(`div`,{style:S===`help`?u:l,onClick:e=>{e.stopPropagation(),C(S===`help`?null:`help`)},children:[(0,o.jsx)(`u`,{children:`H`}),`elp`]}),S===`help`&&(0,o.jsx)(`div`,{style:d,onClick:e=>e.stopPropagation(),children:(0,o.jsx)(`div`,{style:f,onClick:()=>{alert(`NOVA Notepad v30.01
Standard text editor for NOVA 30 OS.`),C(null)},children:`About Notepad`})})]})]}),(0,o.jsx)(`div`,{style:{flex:1,padding:`2px`,position:`relative`,overflow:`hidden`},children:(0,o.jsx)(`textarea`,{ref:A,value:g,onChange:e=>{_(e.target.value),y(!0),j()},onKeyUp:j,onClick:j,wrap:b?`soft`:`off`,spellCheck:!1,style:{width:`100%`,height:`100%`,resize:`none`,border:`2px inset #dfdfdf`,outline:`none`,padding:`6px`,fontFamily:`"Lucida Console", "Courier New", Courier, monospace`,fontSize:`12px`,lineHeight:`1.4`,backgroundColor:`#ffffff`,color:`#000000`,boxSizing:`border-box`},"aria-label":`Notepad text editor`})}),(0,o.jsxs)(`div`,{style:{backgroundColor:`#c0c0c0`,borderTop:`1px solid #808080`,padding:`2px 8px`,fontSize:`11px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,o.jsxs)(`span`,{children:[m,` `,v?`(Modified)`:``]}),(0,o.jsxs)(`span`,{children:[`Ln `,O.line,`, Col `,O.col]})]}),w&&(0,o.jsx)(`div`,{role:`dialog`,"aria-label":w===`open`?`Open File`:`Save As`,style:{position:`absolute`,inset:0,backgroundColor:`rgba(0,0,0,0.2)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:100},onClick:()=>T(null),children:(0,o.jsxs)(`div`,{style:{width:`320px`,backgroundColor:`#c0c0c0`,border:`2px outset #ffffff`,boxShadow:`2px 2px 8px rgba(0,0,0,0.5)`,padding:`2px`},onClick:e=>e.stopPropagation(),children:[(0,o.jsxs)(`div`,{style:{background:`linear-gradient(90deg, #000080, #1084d0)`,color:`#ffffff`,fontWeight:`bold`,padding:`2px 6px`,display:`flex`,justifyContent:`space-between`},children:[(0,o.jsx)(`span`,{children:w===`open`?`Open File`:`Save As`}),(0,o.jsx)(`button`,{onClick:()=>T(null),style:{background:`#c0c0c0`,border:`1px outset #fff`,fontSize:`10px`,cursor:`pointer`},children:`✕`})]}),(0,o.jsxs)(`div`,{style:{padding:`12px`},children:[(0,o.jsx)(`p`,{style:{fontWeight:`bold`,marginBottom:`6px`},children:`Available Files in C:\\DOCS:`}),(0,o.jsx)(`div`,{style:{backgroundColor:`#fff`,border:`2px inset #dfdfdf`,height:`100px`,overflowY:`auto`,padding:`4px`,marginBottom:`8px`},children:Object.keys(s).map(e=>(0,o.jsxs)(`div`,{onClick:()=>{w===`open`?N(e):D(e)},style:{padding:`2px 4px`,cursor:`pointer`,display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,o.jsx)(`span`,{children:`📄`}),` `,e]},e))}),w===`save`&&(0,o.jsxs)(`div`,{style:{marginBottom:`8px`},children:[(0,o.jsx)(`label`,{style:{display:`block`,marginBottom:`2px`},children:`File name:`}),(0,o.jsx)(`input`,{type:`text`,value:E,onChange:e=>D(e.target.value),style:{width:`100%`,padding:`2px`,border:`2px inset #dfdfdf`}})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`6px`},children:[w===`save`&&(0,o.jsx)(`button`,{onClick:()=>P(E),style:{background:`#c0c0c0`,border:`2px outset #fff`,padding:`2px 10px`,cursor:`pointer`},children:`Save`}),(0,o.jsx)(`button`,{onClick:()=>T(null),style:{background:`#c0c0c0`,border:`2px outset #fff`,padding:`2px 10px`,cursor:`pointer`},children:`Cancel`})]})]})]})})]})}var l={padding:`2px 6px`,cursor:`pointer`},u={padding:`2px 6px`,cursor:`pointer`,backgroundColor:`#000080`,color:`#ffffff`},d={position:`absolute`,top:`100%`,left:0,minWidth:`150px`,backgroundColor:`#c0c0c0`,border:`2px outset #ffffff`,boxShadow:`2px 2px 4px rgba(0,0,0,0.3)`,zIndex:1e3,padding:`2px`},f={padding:`3px 8px`,cursor:`pointer`,userSelect:`none`};export{c as default};