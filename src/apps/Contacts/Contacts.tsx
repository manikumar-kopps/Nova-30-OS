import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  isLocked?: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'David CyberDave',
    email: 'dave98@geocities.com',
    phone: '555-0198',
    address: 'Seattle, WA',
    notes: 'Webmaster of the 90s Cyber Ring. Loves MIDI files.'
  },
  {
    id: 'c2',
    name: 'Sarah Miller',
    email: 'smiller@mit.edu',
    phone: '555-4321',
    address: 'Boston, MA',
    notes: 'Computer science researcher specializing in neural networks.'
  },
  {
    id: 'c3',
    name: 'Prof. Arthur Vance',
    email: 'vance@nova-labs.org',
    phone: '555-1998',
    address: 'Palo Alto, CA',
    notes: 'Lead architect of NOVA 30 OS Kernel. Retired abruptly in 1998.'
  },
  {
    id: 'c4',
    name: 'USER_07 [CLASSIFIED]',
    email: 'user07@nova.local',
    phone: 'UNKNOWN',
    address: 'C:\\DO_NOT_OPEN',
    notes: 'Access Denied. Encrypted profile. Discovered in sector 7.',
    isLocked: true
  }
];

export default function Contacts() {
  const { playClick, playNotification, playError } = useSound();
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem('nova-contacts');
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [selectedId, setSelectedId] = useState<string>(contacts[0]?.id || '');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});

  useEffect(() => {
    try {
      localStorage.setItem('nova-contacts', JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  const selected = contacts.find(c => c.id === selectedId) || contacts[0];

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (c: Contact) => {
    playClick();
    setSelectedId(c.id);
    setIsEditing(false);
    if (c.isLocked) {
      playNotification();
      mysteryEngine.recordSecretFound('contacts_user_07');
    }
  };

  const handleAdd = () => {
    playClick();
    const newC: Contact = {
      id: `c-${Date.now()}`,
      name: 'New Contact',
      email: '',
      phone: '',
      address: '',
      notes: ''
    };
    setContacts([...contacts, newC]);
    setSelectedId(newC.id);
    setEditForm(newC);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (selected?.isLocked) {
      playError();
      alert('System Error: System-level contacts cannot be removed.');
      return;
    }
    playClick();
    const remaining = contacts.filter(c => c.id !== id);
    setContacts(remaining);
    setSelectedId(remaining[0]?.id || '');
    setIsEditing(false);
  };

  const handleSave = () => {
    playClick();
    setContacts(contacts.map(c => c.id === selectedId ? { ...c, ...editForm } as Contact : c));
    setIsEditing(false);
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '8px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px' }}>
        <button className="retro-button" onClick={handleAdd} style={{ padding: '2px 8px' }}>➕ New</button>
        <button 
          className="retro-button" 
          onClick={() => { if (!selected?.isLocked) { setEditForm(selected); setIsEditing(true); } else playError(); }}
          disabled={selected?.isLocked}
          style={{ padding: '2px 8px' }}
        >
          ✏️ Edit
        </button>
        <button 
          className="retro-button" 
          onClick={() => handleDelete(selectedId)} 
          disabled={selected?.isLocked}
          style={{ padding: '2px 8px', color: '#cc0000' }}
        >
          🗑️ Delete
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <label>Find:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '2px', border: '1px inset #ffffff', width: '110px', fontSize: '11px' }}
          />
        </div>
      </div>

      {/* Main Two-Pane View */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '8px', flex: 1, minHeight: 0 }}>
        {/* Left Contacts List */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', overflowY: 'auto' }}>
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              style={{
                padding: '4px 8px',
                cursor: 'pointer',
                backgroundColor: c.id === selectedId ? '#000080' : 'transparent',
                color: c.id === selectedId ? '#ffffff' : c.isLocked ? '#800080' : '#000000',
                fontWeight: c.isLocked ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{c.isLocked ? '🔒' : '👤'}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
            </div>
          ))}
        </div>

        {/* Right Details Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '12px', overflowY: 'auto' }}>
          {selected && (
            isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>Name:</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{ width: '100%', padding: '2px', border: '1px inset #ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>Email:</label>
                  <input
                    type="text"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%', padding: '2px', border: '1px inset #ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>Phone:</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '2px', border: '1px inset #ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>Notes:</label>
                  <textarea
                    rows={3}
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    style={{ width: '100%', padding: '2px', border: '1px inset #ffffff' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button className="retro-button" onClick={handleSave} style={{ padding: '3px 12px', fontWeight: 'bold' }}>Save</button>
                  <button className="retro-button" onClick={() => setIsEditing(false)} style={{ padding: '3px 12px' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #000080', paddingBottom: '6px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{selected.isLocked ? '🔒' : '📇'}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#000080' }}>{selected.name}</h3>
                    <span style={{ fontSize: '11px', color: '#666' }}>{selected.address}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px', fontSize: '12px' }}>
                  <strong>Email:</strong>
                  <span><a href={`mailto:${selected.email}`} style={{ color: '#0000cc' }}>{selected.email || 'None'}</a></span>

                  <strong>Phone:</strong>
                  <span>{selected.phone || 'None'}</span>

                  <strong>Address:</strong>
                  <span>{selected.address || 'None'}</span>

                  <strong>Notes:</strong>
                  <div style={{ backgroundColor: '#f5f5f5', padding: '6px', border: '1px solid #e0e0e0', fontStyle: 'italic' }}>
                    {selected.notes || 'No notes available.'}
                  </div>
                </div>

                {selected.isLocked && (
                  <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#ffeeff', border: '1px dashed #800080', fontSize: '11px', color: '#800080' }}>
                    🔒 <strong>CLASSIFIED ARCHIVE NOTE:</strong> This entry is synchronized with C:\DO_NOT_OPEN\USER_07.DAT. Do not attempt manual clearance without administrative rights.
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
