import React, { useState, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export default function NovaWriter() {
  const { playClick, playNotification } = useSound();
  const editorRef = useRef<HTMLDivElement>(null);
  const [docTitle, setDocTitle] = useState('Document1.doc');
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState('3');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const formatDoc = (cmd: string, val: string = '') => {
    playClick();
    document.execCommand(cmd, false, val);
    updateStats();
  };

  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    setCharCount(text.length);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleSave = () => {
    playNotification();
    if (!editorRef.current) return;
    try {
      localStorage.setItem(`nova-writer-${docTitle}`, editorRef.current.innerHTML);
      alert(`Document saved as "${docTitle}".`);
    } catch {
      alert('Error saving document to local disk.');
    }
  };

  const handleOpen = () => {
    playClick();
    const name = prompt('Enter document name to load:', docTitle);
    if (!name) return;
    const saved = localStorage.getItem(`nova-writer-${name}`);
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
      setDocTitle(name);
      updateStats();
      playNotification();
    } else {
      alert(`File "${name}" not found in storage.`);
    }
  };

  const handleFindReplace = () => {
    if (!editorRef.current || !findText) return;
    playClick();
    const content = editorRef.current.innerHTML;
    const regex = new RegExp(findText, 'gi');
    editorRef.current.innerHTML = content.replace(regex, replaceText);
    updateStats();
    setShowFind(false);
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '4px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Menu Bar */}
      <div style={{ display: 'flex', gap: '12px', padding: '2px 4px', borderBottom: '1px solid #808080', marginBottom: '4px', fontSize: '11px' }}>
        <span onClick={handleOpen} style={{ cursor: 'pointer' }}><u>F</u>ile</span>
        <span onClick={() => setShowFind(!showFind)} style={{ cursor: 'pointer' }}><u>E</u>dit</span>
        <span onClick={() => formatDoc('selectAll')} style={{ cursor: 'pointer' }}><u>V</u>iew</span>
        <span onClick={handleSave} style={{ cursor: 'pointer' }}><u>S</u>ave</span>
        <span onClick={() => alert('NOVA Writer 98 Build 4.2 - Compatible with RTF and Word 97')} style={{ cursor: 'pointer' }}><u>H</u>elp</span>
      </div>

      {/* Formatting Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '4px', backgroundColor: '#d4d0c8', border: '1px outset #ffffff', marginBottom: '4px', alignItems: 'center' }}>
        <button className="retro-button" onClick={handleSave} title="Save Document" style={{ padding: '2px 6px' }}>💾</button>
        <button className="retro-button" onClick={handleOpen} title="Open Document" style={{ padding: '2px 6px' }}>📂</button>
        <div style={{ width: '1px', height: '18px', backgroundColor: '#808080', margin: '0 2px' }} />

        {/* Font Family selector */}
        <select 
          value={fontFamily} 
          onChange={(e) => { setFontFamily(e.target.value); formatDoc('fontName', e.target.value); }}
          style={{ fontSize: '11px', padding: '1px' }}
        >
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>

        {/* Font Size selector */}
        <select 
          value={fontSize} 
          onChange={(e) => { setFontSize(e.target.value); formatDoc('fontSize', e.target.value); }}
          style={{ fontSize: '11px', padding: '1px' }}
        >
          <option value="1">8 pt</option>
          <option value="2">10 pt</option>
          <option value="3">12 pt</option>
          <option value="4">14 pt</option>
          <option value="5">18 pt</option>
          <option value="6">24 pt</option>
        </select>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#808080', margin: '0 2px' }} />

        <button className="retro-button" onClick={() => formatDoc('bold')} style={{ fontWeight: 'bold', padding: '2px 6px' }}>B</button>
        <button className="retro-button" onClick={() => formatDoc('italic')} style={{ fontStyle: 'italic', padding: '2px 6px' }}>I</button>
        <button className="retro-button" onClick={() => formatDoc('underline')} style={{ textDecoration: 'underline', padding: '2px 6px' }}>U</button>
        <button className="retro-button" onClick={() => formatDoc('strikeThrough')} style={{ textDecoration: 'line-through', padding: '2px 6px' }}>S</button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#808080', margin: '0 2px' }} />

        <button className="retro-button" onClick={() => formatDoc('justifyLeft')} title="Align Left" style={{ padding: '2px 6px' }}>⇤</button>
        <button className="retro-button" onClick={() => formatDoc('justifyCenter')} title="Align Center" style={{ padding: '2px 6px' }}>⇥⇤</button>
        <button className="retro-button" onClick={() => formatDoc('justifyRight')} title="Align Right" style={{ padding: '2px 6px' }}>⇥</button>
        <button className="retro-button" onClick={() => formatDoc('insertUnorderedList')} title="Bullet List" style={{ padding: '2px 6px' }}>•≡</button>
        <button className="retro-button" onClick={() => formatDoc('insertOrderedList')} title="Numbered List" style={{ padding: '2px 6px' }}>1≡</button>
      </div>

      {/* Find & Replace Bar (Collapsible) */}
      {showFind && (
        <div style={{ display: 'flex', gap: '6px', padding: '4px', backgroundColor: '#ffffcc', border: '1px solid #808080', marginBottom: '4px', alignItems: 'center', fontSize: '11px' }}>
          <label>Find:</label>
          <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} style={{ padding: '1px 3px' }} />
          <label>Replace with:</label>
          <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} style={{ padding: '1px 3px' }} />
          <button className="retro-button" onClick={handleFindReplace} style={{ padding: '1px 6px' }}>Replace All</button>
          <button className="retro-button" onClick={() => setShowFind(false)} style={{ padding: '1px 6px' }}>✕</button>
        </div>
      )}

      {/* Document Page Canvas */}
      <div style={{
        flex: 1,
        backgroundColor: '#808080',
        padding: '12px',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 0
      }}>
        <div
          ref={editorRef}
          contentEditable
          onInput={updateStats}
          style={{
            width: '100%',
            maxWidth: '650px',
            minHeight: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
            padding: '24px 32px',
            boxSizing: 'border-box',
            outline: 'none',
            fontFamily: fontFamily,
            lineHeight: '1.5',
            color: '#000000'
          }}
          dangerouslySetInnerHTML={{
            __html: `<h2>NOVA Project Report (Draft)</h2><p>This document was drafted using <strong>NOVA Writer 98</strong>. It supports full rich text styling, font changes, alignment, and local document serialization.</p><p><em>Confidential note:</em> All research materials regarding autonomous cybernetics are stored in sector 7.</p>`
          }}
        />
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px', borderTop: '2px groove #ffffff', backgroundColor: '#c0c0c0', fontSize: '11px', color: '#333' }}>
        <span>Page 1 • {docTitle}</span>
        <span>Words: {wordCount} • Characters: {charCount}</span>
      </div>
    </div>
  );
}
