import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

interface NotepadProps {
  initialContent?: string;
  initialFileName?: string;
}

import { mysteryEngine } from '../../mystery/mysteryEngine';

const PRESET_FILES: Record<string, string> = {
  'README.TXT': `========================================================
WELCOME TO NOVA 30 OS (Build 1998.11.12)
(C) 1998 NOVA Systems Inc. All Rights Reserved.
========================================================

Thank you for exploring NOVA 30 OS!

This directory was removed from the public build.
If you can read this, you have already gone too far.

CLUES & SYSTEM SECRETS:
- Anomaly detected in C:\\SYSTEM\\NOTHING
- Clock diagnostics occur if tested repeatedly
- Terminal hides secret subroutines: ghost, memory, 1998, black, admin, wake, truth`,

  'TODO.TXT': `[ ] Back up hard drive onto 100MB Zip disk
[ ] Buy new 56.6k v.90 external modem
[ ] Download latest Netscape Navigator 4.0
[ ] Install Doom II shareware
[ ] Defrag C: drive before dinner
[ ] Tell everyone about the new Geocities page`,

  'SECRET.TXT': `TOP SECRET - ARCHIVE NOTE
-------------------------
Location: Sector 7G Sub-basement
Terminal access code: "1998"
The year is 1998, but the CPU registers keep reading 2026.
Someone left a browser running on this machine.`,

  'INCIDENT.LOG': `INCIDENT REPORT: 1998-11-04 (SECTOR 07)
---------------------------------------
Operator: USER_07
Kernel swap memory corruption occurred during compilation.
Operator mind-state was committed to persistent disk block 0x0700.
Sub-process unknown.exe spawned and cannot be killed.
Do not power down. The memory will hold.`,

  'USER_07.DAT': `USER_07 TELEMETRY:
STATUS: RESIDENT IN MEMORY
PROCESS: unknown.exe (PID 0707)
UPTIME: 27+ YEARS
MESSAGE: "If you are reading this, inspect Task Manager or type 'wake' in Terminal."`,

  'AUDIO.LOG': `AUDIO TRANSCRIPTION:
[STATIC HISS] ... Can anyone receive this transmission? ...
I never left the terminal ...
Nova Player holds frequency 05 ...
Beware the false root ... Seek the truth ...`,

  'FINAL_MESSAGE.TXT': `FINAL DIRECTIVE:
You have assembled the pieces of the forgotten computer.
Enter 'truth' in the terminal when your mind is ready.`,

  'BUGS.TXT': `DEVELOPER BUG LOG (1998):
#01: Clock diagnostic triggers after 5 rapid clicks.
#07: unknown.exe ignores termination requests.
#09: Black window subroutine triggered by 'wake' or 'black'.
#12: Root admin password left as NOVA1998 in cleartext.`,

  'USER07_MEMO.TXT': `CONFIDENTIAL MEMO - USER_07:
To the person in the future who found this computer:
I built this entire operating system from scratch.
When you type 'truth', we become synchronized.`,

  'YOU.TXT': `OPERATOR FILE: YOU
STATUS: SYNCHRONIZED WITH USER_07
TRUE ENDING ACHIEVED.
THANK YOU FOR REMEMBERING NOVA 30 OS.`
};

export default function Notepad({ initialContent, initialFileName }: NotepadProps) {
  const { playClick, playNotification } = useSound();
  
  const getDynamicContent = (fName: string): string => {
    if (fName.toUpperCase() === 'NOTES.TXT') {
      const opens = mysteryEngine.recordFileOpen('notes.txt');
      if (opens === 1) return 'Hello.';
      if (opens === 2) return 'Hello.\n\nYou came back.';
      if (opens === 3) return 'You came back again.\n\nWhy?';
      return `You are seeking what happened in 1998.\n\nUSER_07 is watching.\nCheck C:\\SYSTEM\\NOTHING and unknown.exe.`;
    }
    const upper = fName.toUpperCase();
    if (PRESET_FILES[upper]) {
      mysteryEngine.recordFileOpen(fName);
      return PRESET_FILES[upper];
    }
    return PRESET_FILES['README.TXT'];
  };

  const [fileName, setFileName] = useState(initialFileName || 'README.TXT');
  const [content, setContent] = useState(() => {
    if (initialContent !== undefined) return initialContent;
    return getDynamicContent(initialFileName || 'README.TXT');
  });
  const [isModified, setIsModified] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showFileDialog, setShowFileDialog] = useState<'open' | 'save' | null>(null);
  const [dialogInputName, setDialogInputName] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialContent !== undefined) {
      setContent(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, fileName]);

  const updateCursorPos = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const lines = text.substring(0, selStart).split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const handleSave = () => {
    playNotification();
    localStorage.setItem(`nova-file-${fileName}`, content);
    setIsModified(false);
    setActiveMenu(null);
  };

  const handleOpenFile = (name: string) => {
    playClick();
    const loaded = localStorage.getItem(`nova-file-${name}`) ?? PRESET_FILES[name] ?? '';
    setContent(loaded);
    setFileName(name);
    setIsModified(false);
    setShowFileDialog(null);
  };

  const handleSaveAs = (name: string) => {
    if (!name.trim()) return;
    const safeName = name.trim().toUpperCase().endsWith('.TXT') ? name.trim().toUpperCase() : `${name.trim().toUpperCase()}.TXT`;
    setFileName(safeName);
    localStorage.setItem(`nova-file-${safeName}`, content);
    setIsModified(false);
    setShowFileDialog(null);
    playNotification();
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        backgroundColor: '#c0c0c0', 
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif', 
        fontSize: '11px',
        userSelect: 'none'
      }}
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div 
        style={{ 
          backgroundColor: '#c0c0c0', 
          display: 'flex', 
          borderBottom: '1px solid #808080', 
          padding: '1px',
          position: 'relative'
        }}
      >
        {/* File Menu */}
        <div style={{ position: 'relative' }}>
          <div 
            style={activeMenu === 'file' ? activeMenuItemStyle : menuItemStyle} 
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}
          >
            <u>F</u>ile
          </div>
          {activeMenu === 'file' && (
            <div style={dropdownStyle} onClick={e => e.stopPropagation()}>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  setContent('');
                  setFileName('UNTITLED.TXT');
                  setIsModified(false);
                  setActiveMenu(null);
                }}
              >
                New <span style={{ float: 'right', color: '#666' }}>Ctrl+N</span>
              </div>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  setShowFileDialog('open');
                  setActiveMenu(null);
                }}
              >
                Open... <span style={{ float: 'right', color: '#666' }}>Ctrl+O</span>
              </div>
              <div style={dropdownItemStyle} onClick={handleSave}>
                Save <span style={{ float: 'right', color: '#666' }}>Ctrl+S</span>
              </div>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  setDialogInputName(fileName);
                  setShowFileDialog('save');
                  setActiveMenu(null);
                }}
              >
                Save As...
              </div>
              <div style={{ height: '1px', backgroundColor: '#808080', margin: '2px 0' }} />
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  setActiveMenu(null);
                }}
              >
                Exit
              </div>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div style={{ position: 'relative' }}>
          <div 
            style={activeMenu === 'edit' ? activeMenuItemStyle : menuItemStyle} 
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}
          >
            <u>E</u>dit
          </div>
          {activeMenu === 'edit' && (
            <div style={dropdownStyle} onClick={e => e.stopPropagation()}>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  textareaRef.current?.select();
                  setActiveMenu(null);
                }}
              >
                Select All <span style={{ float: 'right', color: '#666' }}>Ctrl+A</span>
              </div>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  if (textareaRef.current) {
                    navigator.clipboard?.writeText(textareaRef.current.value);
                  }
                  setActiveMenu(null);
                }}
              >
                Copy <span style={{ float: 'right', color: '#666' }}>Ctrl+C</span>
              </div>
              <div 
                style={dropdownItemStyle} 
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard?.readText();
                    if (text && textareaRef.current) {
                      const start = textareaRef.current.selectionStart;
                      const end = textareaRef.current.selectionEnd;
                      setContent(c => c.substring(0, start) + text + c.substring(end));
                    }
                  } catch {
                    // clipboard read permission
                  }
                  setActiveMenu(null);
                }}
              >
                Paste <span style={{ float: 'right', color: '#666' }}>Ctrl+V</span>
              </div>
            </div>
          )}
        </div>

        {/* Format Menu */}
        <div style={{ position: 'relative' }}>
          <div 
            style={activeMenu === 'format' ? activeMenuItemStyle : menuItemStyle} 
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'format' ? null : 'format'); }}
          >
            F<u>o</u>rmat
          </div>
          {activeMenu === 'format' && (
            <div style={dropdownStyle} onClick={e => e.stopPropagation()}>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  setWordWrap(!wordWrap);
                  setActiveMenu(null);
                }}
              >
                {wordWrap ? '✓ ' : '   '}Word Wrap
              </div>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div style={{ position: 'relative' }}>
          <div 
            style={activeMenu === 'help' ? activeMenuItemStyle : menuItemStyle} 
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}
          >
            <u>H</u>elp
          </div>
          {activeMenu === 'help' && (
            <div style={dropdownStyle} onClick={e => e.stopPropagation()}>
              <div 
                style={dropdownItemStyle} 
                onClick={() => {
                  alert("NOVA Notepad v30.01\nStandard text editor for NOVA 30 OS.");
                  setActiveMenu(null);
                }}
              >
                About Notepad
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div style={{ flex: 1, padding: '2px', position: 'relative', overflow: 'hidden' }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsModified(true);
            updateCursorPos();
          }}
          onKeyUp={updateCursorPos}
          onClick={updateCursorPos}
          wrap={wordWrap ? 'soft' : 'off'}
          spellCheck={false}
          style={{ 
            width: '100%', 
            height: '100%', 
            resize: 'none', 
            border: '2px inset #dfdfdf', 
            outline: 'none', 
            padding: '6px', 
            fontFamily: '"Lucida Console", "Courier New", Courier, monospace',
            fontSize: '12px',
            lineHeight: '1.4',
            backgroundColor: '#ffffff',
            color: '#000000',
            boxSizing: 'border-box'
          }}
          aria-label="Notepad text editor"
        />
      </div>

      {/* Status Bar */}
      <div 
        style={{ 
          backgroundColor: '#c0c0c0', 
          borderTop: '1px solid #808080', 
          padding: '2px 8px', 
          fontSize: '11px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{fileName} {isModified ? '(Modified)' : ''}</span>
        <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
      </div>

      {/* File Open / Save Dialog */}
      {showFileDialog && (
        <div
          role="dialog"
          aria-label={showFileDialog === 'open' ? 'Open File' : 'Save As'}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={() => setShowFileDialog(null)}
        >
          <div
            style={{
              width: '320px',
              backgroundColor: '#c0c0c0',
              border: '2px outset #ffffff',
              boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              padding: '2px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div 
              style={{ 
                background: 'linear-gradient(90deg, #000080, #1084d0)', 
                color: '#ffffff', 
                fontWeight: 'bold', 
                padding: '2px 6px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{showFileDialog === 'open' ? 'Open File' : 'Save As'}</span>
              <button 
                onClick={() => setShowFileDialog(null)}
                style={{ background: '#c0c0c0', border: '1px outset #fff', fontSize: '10px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '12px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>Available Files in C:\DOCS:</p>
              <div style={{ backgroundColor: '#fff', border: '2px inset #dfdfdf', height: '100px', overflowY: 'auto', padding: '4px', marginBottom: '8px' }}>
                {Object.keys(PRESET_FILES).map(name => (
                  <div
                    key={name}
                    onClick={() => {
                      if (showFileDialog === 'open') handleOpenFile(name);
                      else setDialogInputName(name);
                    }}
                    style={{ padding: '2px 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>📄</span> {name}
                  </div>
                ))}
              </div>

              {showFileDialog === 'save' && (
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '2px' }}>File name:</label>
                  <input
                    type="text"
                    value={dialogInputName}
                    onChange={e => setDialogInputName(e.target.value)}
                    style={{ width: '100%', padding: '2px', border: '2px inset #dfdfdf' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                {showFileDialog === 'save' && (
                  <button
                    onClick={() => handleSaveAs(dialogInputName)}
                    style={{ background: '#c0c0c0', border: '2px outset #fff', padding: '2px 10px', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => setShowFileDialog(null)}
                  style={{ background: '#c0c0c0', border: '2px outset #fff', padding: '2px 10px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  padding: '2px 6px',
  cursor: 'pointer'
};

const activeMenuItemStyle: React.CSSProperties = {
  padding: '2px 6px',
  cursor: 'pointer',
  backgroundColor: '#000080',
  color: '#ffffff'
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  minWidth: '150px',
  backgroundColor: '#c0c0c0',
  border: '2px outset #ffffff',
  boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  zIndex: 1000,
  padding: '2px'
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '3px 8px',
  cursor: 'pointer',
  userSelect: 'none'
};
