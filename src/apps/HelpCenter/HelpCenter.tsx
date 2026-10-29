import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface HelpTopic {
  id: string;
  title: string;
  category: string;
  content: string;
}

const TOPICS: HelpTopic[] = [
  {
    id: 'welcome',
    title: 'Welcome to NOVA 30 OS',
    category: 'Basics',
    content: `Welcome to NOVA 30 OS, your 32-bit graphical multitasking environment.

To get started:
- Double-click any desktop icon to launch its application.
- Use the Start menu in the bottom-left to explore Programs, Accessories, and Settings.
- Drag any window by its blue title bar to reposition it.
- Resize windows using any of the 8 border handles.`
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts Reference',
    category: 'Basics',
    content: `Essential NOVA 30 OS Shortcuts:
- Alt + Tab: Switch between active windows
- Alt + F4: Close active window
- Alt + R: Open the Run dialog
- Ctrl + S: Save document in Notepad or Writer
- Ctrl + Z: Undo last edit
- F11: Full-screen display toggle`
  },
  {
    id: 'terminal',
    title: 'Using the Terminal',
    category: 'System Tools',
    content: `The Terminal allows low-level system interaction.
Commands include:
- help: lists standard commands
- dir / ls: view files in current directory
- color <green|amber|cyan>: customize CRT phosphor text
- matrix: toggle digital green rain animation
- ask <question>: query the NOVA System AI
- ghost, 1998, truth: classified telemetry commands`
  },
  {
    id: 'browser',
    title: 'NOVA Explorer & Google Search',
    category: 'Internet',
    content: `Browse the World Wide Web with built-in Google PageRank indexing:
- Visit nova://home for the primary cyber portal.
- Search with Google 98 to find comprehensive encyclopedia entries, news, and knowledge graphs on any topic.
- Sign our community guestbook at nova://guestbook.`
  },
  {
    id: 'mystery',
    title: 'Secret Archives & Whispers',
    category: 'Troubleshooting',
    content: `NOTICE FROM ARCHIVES:
Some users report temporal glitches when clicking the taskbar clock 5 times in succession.
Furthermore, rumors persist regarding a hidden directory on the C:\\ drive labeled 'DO_NOT_OPEN'.
If you encounter unusual system telemetry, consult the Admin Panel or Task Manager.`
  }
];

export default function HelpCenter() {
  const { playClick, playNotification } = useSound();
  const [selectedTopicId, setSelectedTopicId] = useState('welcome');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = TOPICS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];

  const handleSelect = (t: HelpTopic) => {
    playClick();
    setSelectedTopicId(t.id);
    if (t.id === 'mystery') {
      playNotification();
      mysteryEngine.recordSecretFound('help_mystery_topic');
    }
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '6px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Help Toolbar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '6px', alignItems: 'center' }}>
        <strong>❓ Help Topics:</strong>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documentation..."
          style={{ padding: '2px 4px', border: '1px inset #ffffff', fontSize: '11px', flex: 1, maxWidth: '240px' }}
        />
      </div>

      {/* Two Pane Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '6px', flex: 1, minHeight: 0 }}>
        {/* Left Topics List */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', overflowY: 'auto', padding: '4px' }}>
          {filteredTopics.map(t => (
            <div
              key={t.id}
              onClick={() => handleSelect(t)}
              style={{
                padding: '4px 6px',
                cursor: 'pointer',
                backgroundColor: t.id === selectedTopicId ? '#000080' : 'transparent',
                color: t.id === selectedTopicId ? '#ffffff' : '#000000',
                fontWeight: t.id === 'mystery' ? 'bold' : 'normal'
              }}
            >
              📖 {t.title}
            </div>
          ))}
        </div>

        {/* Right Article Viewer */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '14px', overflowY: 'auto' }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#000080', borderBottom: '2px solid #000080', paddingBottom: '4px' }}>
            {selectedTopic.title}
          </h2>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
            Category: {selectedTopic.category}
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '12px' }}>
            {selectedTopic.content}
          </div>
        </div>
      </div>
    </div>
  );
}
