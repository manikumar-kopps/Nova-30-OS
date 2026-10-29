import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{a as r,n as i}from"./index-DMakbw_d.js";var a=e(t(),1),o=n(),s=[{id:`welcome`,title:`Welcome to NOVA 30 OS`,category:`Basics`,content:`Welcome to NOVA 30 OS, your 32-bit graphical multitasking environment.

To get started:
- Double-click any desktop icon to launch its application.
- Use the Start menu in the bottom-left to explore Programs, Accessories, and Settings.
- Drag any window by its blue title bar to reposition it.
- Resize windows using any of the 8 border handles.`},{id:`shortcuts`,title:`Keyboard Shortcuts Reference`,category:`Basics`,content:`Essential NOVA 30 OS Shortcuts:
- Alt + Tab: Switch between active windows
- Alt + F4: Close active window
- Alt + R: Open the Run dialog
- Ctrl + S: Save document in Notepad or Writer
- Ctrl + Z: Undo last edit
- F11: Full-screen display toggle`},{id:`terminal`,title:`Using the Terminal`,category:`System Tools`,content:`The Terminal allows low-level system interaction.
Commands include:
- help: lists standard commands
- dir / ls: view files in current directory
- color <green|amber|cyan>: customize CRT phosphor text
- matrix: toggle digital green rain animation
- ask <question>: query the NOVA System AI
- ghost, 1998, truth: classified telemetry commands`},{id:`browser`,title:`NOVA Explorer & Google Search`,category:`Internet`,content:`Browse the World Wide Web with built-in Google PageRank indexing:
- Visit nova://home for the primary cyber portal.
- Search with Google 98 to find comprehensive encyclopedia entries, news, and knowledge graphs on any topic.
- Sign our community guestbook at nova://guestbook.`},{id:`mystery`,title:`Secret Archives & Whispers`,category:`Troubleshooting`,content:`NOTICE FROM ARCHIVES:
Some users report temporal glitches when clicking the taskbar clock 5 times in succession.
Furthermore, rumors persist regarding a hidden directory on the C:\\ drive labeled 'DO_NOT_OPEN'.
If you encounter unusual system telemetry, consult the Admin Panel or Task Manager.`}];function c(){let{playClick:e,playNotification:t}=i(),[n,c]=(0,a.useState)(`welcome`),[l,u]=(0,a.useState)(``),d=s.filter(e=>e.title.toLowerCase().includes(l.toLowerCase())||e.content.toLowerCase().includes(l.toLowerCase())),f=s.find(e=>e.id===n)||s[0],p=n=>{e(),c(n.id),n.id===`mystery`&&(t(),r.recordSecretFound(`help_mystery_topic`))};return(0,o.jsxs)(`div`,{style:{backgroundColor:`#c0c0c0`,padding:`6px`,height:`100%`,boxSizing:`border-box`,display:`flex`,flexDirection:`column`,fontFamily:`"MS Sans Serif", Tahoma, sans-serif`,fontSize:`12px`},children:[(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,borderBottom:`1px solid #808080`,paddingBottom:`6px`,marginBottom:`6px`,alignItems:`center`},children:[(0,o.jsx)(`strong`,{children:`❓ Help Topics:`}),(0,o.jsx)(`input`,{type:`text`,value:l,onChange:e=>u(e.target.value),placeholder:`Search documentation...`,style:{padding:`2px 4px`,border:`1px inset #ffffff`,fontSize:`11px`,flex:1,maxWidth:`240px`}})]}),(0,o.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`170px 1fr`,gap:`6px`,flex:1,minHeight:0},children:[(0,o.jsx)(`div`,{style:{backgroundColor:`#ffffff`,border:`2px inset #dfdfdf`,overflowY:`auto`,padding:`4px`},children:d.map(e=>(0,o.jsxs)(`div`,{onClick:()=>p(e),style:{padding:`4px 6px`,cursor:`pointer`,backgroundColor:e.id===n?`#000080`:`transparent`,color:e.id===n?`#ffffff`:`#000000`,fontWeight:e.id===`mystery`?`bold`:`normal`},children:[`📖 `,e.title]},e.id))}),(0,o.jsxs)(`div`,{style:{backgroundColor:`#ffffff`,border:`2px inset #dfdfdf`,padding:`14px`,overflowY:`auto`},children:[(0,o.jsx)(`h2`,{style:{margin:`0 0 4px 0`,fontSize:`16px`,color:`#000080`,borderBottom:`2px solid #000080`,paddingBottom:`4px`},children:f.title}),(0,o.jsxs)(`div`,{style:{fontSize:`11px`,color:`#666`,marginBottom:`12px`},children:[`Category: `,f.category]}),(0,o.jsx)(`div`,{style:{whiteSpace:`pre-wrap`,lineHeight:`1.6`,fontSize:`12px`},children:f.content})]})]})]})}export{c as default};