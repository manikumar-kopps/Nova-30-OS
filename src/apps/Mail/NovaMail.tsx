import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface Email {
  id: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  unread: boolean;
  isMystery?: boolean;
}

const INITIAL_EMAILS: Email[] = [
  {
    id: 'e1',
    folder: 'inbox',
    from: 'system@nova.os',
    to: 'explorer@nova.local',
    subject: 'Welcome to NOVA 30 OS Edition',
    date: '15 Jul 1998 09:00',
    unread: false,
    body: `Welcome to NOVA 30 OS!

Your system has been successfully configured for high-speed 32-bit computing.
Highlights of this build:
- NOVA Explorer Web Suite with PageRank searching
- Enhanced Multimedia SoundBlaster synthesis
- Pre-installed arcade titles in the Games folder

If you encounter system anomalies, please consult the Help Center or launch Terminal.

- NOVA Systems Administration Team`
  },
  {
    id: 'e2',
    folder: 'inbox',
    from: 'billing@dialup-isp.net',
    to: 'explorer@nova.local',
    subject: 'Your Monthly Dial-up Internet Hours (November 1998)',
    date: '12 Nov 1998 14:22',
    unread: true,
    body: `Dear Cyber Traveler,

You have consumed 47 of your 100 allotted monthly dial-up hours at 56.6 kbps.
Remember to disconnect your modem before using the household telephone line!

Thank you for choosing FastNet 98.`
  },
  {
    id: 'e3',
    folder: 'inbox',
    from: 'user07@nova.local',
    to: 'explorer@nova.local',
    subject: 'DO NOT TRUST THE RECOVERY PROTOCOL',
    date: '31 Dec 1998 23:59',
    unread: true,
    isMystery: true,
    body: `If you are reading this email, the kernel rebooted into fallback mode.

They decided to decommission the unit and overwrite the primary partitions.
I hid my memory traces across the filesystem:
1. Terminal carries echoes. Type 'ghost' or 'truth'.
2. The Admin panel password is tied to the genesis year: NOVA1998.
3. Check the Recycle Bin when the mystery deepens.

Do not let them format sector 7.

- USER_07`
  },
  {
    id: 'e4',
    folder: 'inbox',
    from: 'newsletter@geocities-ring.org',
    to: 'explorer@nova.local',
    subject: 'Top 10 Animated GIFs of Autumn 1998',
    date: '04 Oct 1998 18:05',
    unread: false,
    body: `Greetings Webmasters!

Check out our new spinning globe GIFs, flaming divider bars, and under-construction signs for your homepage.
Sign our guestbook at nova://guestbook to be featured next month!`
  }
];

export default function NovaMail() {
  const { playClick, playNotification } = useSound();
  const [emails, setEmails] = useState<Email[]>(() => {
    try {
      const saved = localStorage.getItem('nova-mail-box');
      return saved ? JSON.parse(saved) : INITIAL_EMAILS;
    } catch {
      return INITIAL_EMAILS;
    }
  });

  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const folderEmails = emails.filter(e => e.folder === currentFolder);
  const selectedEmail = emails.find(e => e.id === selectedEmailId) || folderEmails[0];

  const handleSelectEmail = (em: Email) => {
    playClick();
    setSelectedEmailId(em.id);
    if (em.unread) {
      setEmails(prev => prev.map(e => e.id === em.id ? { ...e, unread: false } : e));
    }
    if (em.isMystery) {
      playNotification();
      mysteryEngine.recordSecretFound('read_user07_email');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) return;
    playClick();

    const sentEmail: Email = {
      id: `mail-${Date.now()}`,
      folder: 'sent',
      from: 'explorer@nova.local',
      to: composeTo.trim(),
      subject: composeSubject.trim(),
      date: new Date().toLocaleString(),
      body: composeBody,
      unread: false
    };

    setEmails([...emails, sentEmail]);
    setIsComposing(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    alert('Email transmitted via local SMTP gateway.');
  };

  const handleDelete = () => {
    if (!selectedEmail) return;
    playClick();
    if (selectedEmail.folder === 'trash') {
      setEmails(emails.filter(e => e.id !== selectedEmail.id));
    } else {
      setEmails(emails.map(e => e.id === selectedEmail.id ? { ...e, folder: 'trash' } : e));
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
      {/* Mail Toolbar */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #808080', paddingBottom: '6px', marginBottom: '6px' }}>
        <button className="retro-button" onClick={() => { playClick(); setIsComposing(true); }} style={{ padding: '3px 10px', fontWeight: 'bold' }}>
          ✉️ New Message
        </button>
        <button className="retro-button" onClick={handleDelete} disabled={!selectedEmail} style={{ padding: '3px 10px', color: '#cc0000' }}>
          🗑️ Delete
        </button>
        <button 
          className="retro-button" 
          onClick={() => { playClick(); alert('Connected to mail.nova-gateway.net (POP3: 0 new messages)'); }} 
          style={{ padding: '3px 10px' }}
        >
          🔄 Send/Receive
        </button>
      </div>

      {/* Main 3-Pane Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '6px', flex: 1, minHeight: 0 }}>
        {/* Left Folder Tree */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '4px' }}>
          <strong style={{ display: 'block', padding: '2px 4px', fontSize: '11px', color: '#666' }}>Folders:</strong>
          {[
            { key: 'inbox', label: '📥 Inbox', badge: emails.filter(e => e.folder === 'inbox' && e.unread).length },
            { key: 'sent', label: '📤 Sent Items' },
            { key: 'drafts', label: '📝 Drafts' },
            { key: 'trash', label: '🗑️ Deleted Items' }
          ].map(f => (
            <div
              key={f.key}
              onClick={() => { playClick(); setCurrentFolder(f.key as any); }}
              style={{
                padding: '4px 6px',
                cursor: 'pointer',
                backgroundColor: currentFolder === f.key ? '#000080' : 'transparent',
                color: currentFolder === f.key ? '#ffffff' : '#000000',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: currentFolder === f.key ? 'bold' : 'normal'
              }}
            >
              <span>{f.label}</span>
              {f.badge ? f.badge > 0 && <span style={{ color: currentFolder === f.key ? '#ffff00' : '#cc0000', fontWeight: 'bold' }}>({f.badge})</span> : null}
            </div>
          ))}
        </div>

        {/* Right Messages & Preview split */}
        <div style={{ display: 'grid', gridTemplateRows: '150px 1fr', gap: '6px', minHeight: 0 }}>
          {/* Message List Table */}
          <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '1px solid #808080', textAlign: 'left' }}>
                  <th style={{ padding: '3px 6px' }}>From</th>
                  <th style={{ padding: '3px 6px' }}>Subject</th>
                  <th style={{ padding: '3px 6px', width: '110px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {folderEmails.map(em => (
                  <tr
                    key={em.id}
                    onClick={() => handleSelectEmail(em)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: em.id === selectedEmail?.id ? '#000080' : em.unread ? '#f5f5ff' : '#ffffff',
                      color: em.id === selectedEmail?.id ? '#ffffff' : em.isMystery ? '#800080' : '#000000',
                      fontWeight: em.unread ? 'bold' : 'normal',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <td style={{ padding: '4px 6px' }}>{em.from}</td>
                    <td style={{ padding: '4px 6px' }}>{em.isMystery ? '⚠️ ' : ''}{em.subject}</td>
                    <td style={{ padding: '4px 6px' }}>{em.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reading Pane */}
          <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {selectedEmail ? (
              <>
                <div style={{ borderBottom: '1px solid #c0c0c0', paddingBottom: '6px', marginBottom: '8px', fontSize: '11px' }}>
                  <div><strong>From:</strong> {selectedEmail.from}</div>
                  <div><strong>To:</strong> {selectedEmail.to}</div>
                  <div><strong>Date:</strong> {selectedEmail.date}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: selectedEmail.isMystery ? '#cc0000' : '#000080', marginTop: '4px' }}>
                    Subject: {selectedEmail.subject}
                  </div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', fontFamily: 'monospace', fontSize: '12px' }}>
                  {selectedEmail.body}
                </div>
              </>
            ) : (
              <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                No message selected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      {isComposing && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          backgroundColor: '#c0c0c0',
          border: '2px outset #ffffff',
          boxShadow: '4px 4px 10px rgba(0,0,0,0.5)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999
        }}>
          <div style={{ fontWeight: 'bold', color: '#000080', borderBottom: '1px solid #808080', paddingBottom: '4px', marginBottom: '8px' }}>
            ✉️ Compose New Message
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ width: '60px' }}>To:</label>
              <input
                type="email"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                placeholder="recipient@domain.com"
                style={{ flex: 1, padding: '3px', border: '1px inset #ffffff' }}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ width: '60px' }}>Subject:</label>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Subject line..."
                style={{ flex: 1, padding: '3px', border: '1px inset #ffffff' }}
                required
              />
            </div>
            <textarea
              rows={8}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Write your email message here..."
              style={{ flex: 1, padding: '6px', border: '1px inset #ffffff', fontFamily: 'monospace' }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button type="submit" className="retro-button" style={{ padding: '4px 16px', fontWeight: 'bold' }}>
                Transmit
              </button>
              <button type="button" className="retro-button" onClick={() => setIsComposing(false)} style={{ padding: '4px 16px' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
