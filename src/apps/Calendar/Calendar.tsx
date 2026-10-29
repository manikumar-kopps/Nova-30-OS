import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time?: string;
  isSecret?: boolean;
}

const SECRET_HISTORICAL_EVENT: CalendarEvent = {
  id: 'secret-1998-init',
  date: '1998-01-01',
  title: '⚠️ NOVA PROJECT INITIALIZED [CLASSIFIED]',
  time: '00:00',
  isSecret: true
};

export default function CalendarApp() {
  const { playClick, playNotification } = useSound();
  const [viewDate, setViewDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<'month' | 'day' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('nova-calendar-events');
      const loaded: CalendarEvent[] = saved ? JSON.parse(saved) : [];
      if (!loaded.some(e => e.id === SECRET_HISTORICAL_EVENT.id)) {
        loaded.push(SECRET_HISTORICAL_EVENT);
      }
      return loaded;
    } catch {
      return [SECRET_HISTORICAL_EVENT];
    }
  });

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');

  useEffect(() => {
    try {
      localStorage.setItem('nova-calendar-events', JSON.stringify(events));
    } catch {}
  }, [events]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => {
    playClick();
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    playClick();
    setViewDate(new Date(year, month + 1, 1));
  };

  const jumpTo1998 = () => {
    playNotification();
    setViewDate(new Date(1998, 0, 1));
    setSelectedDate('1998-01-01');
    mysteryEngine.recordSecretFound('calendar_jump_1998');
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    playClick();
    const created: CalendarEvent = {
      id: `evt-${Date.now()}`,
      date: selectedDate,
      title: newEventTitle.trim(),
      time: newEventTime
    };
    setEvents([...events, created]);
    setNewEventTitle('');
  };

  const handleDeleteEvent = (id: string) => {
    playClick();
    setEvents(events.filter(e => e.id !== id));
  };

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const selectedEvents = events.filter(e => e.date === selectedDate);

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '10px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button className="retro-button" onClick={prevMonth} style={{ padding: '2px 8px' }}>◀</button>
          <strong style={{ fontSize: '14px', minWidth: '140px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </strong>
          <button className="retro-button" onClick={nextMonth} style={{ padding: '2px 8px' }}>▶</button>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="retro-button" 
            onClick={() => { playClick(); setViewDate(new Date()); setSelectedDate(todayStr); }}
            style={{ padding: '2px 8px', fontSize: '11px' }}
          >
            Today
          </button>
          <button 
            className="retro-button" 
            onClick={jumpTo1998}
            title="Secret timeline jump"
            style={{ padding: '2px 8px', fontSize: '11px', color: '#800080', fontWeight: 'bold' }}
          >
            🕰️ Jan 1998
          </button>
        </div>
      </div>

      {/* Main Grid & Side Agenda */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '10px', flex: 1, minHeight: 0 }}>
        {/* Calendar Grid */}
        <div style={{ backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '6px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #c0c0c0', paddingBottom: '4px', fontSize: '11px', color: '#000080' }}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', flex: 1, gap: '2px', marginTop: '4px' }}>
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ backgroundColor: '#f0f0f0' }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateKey === todayStr;
              const isSelected = dateKey === selectedDate;
              const hasEvents = events.some(e => e.date === dateKey);
              const hasSecret = events.some(e => e.date === dateKey && e.isSecret);

              return (
                <div
                  key={dayNum}
                  onClick={() => { playClick(); setSelectedDate(dateKey); }}
                  style={{
                    border: isSelected ? '2px solid #000080' : '1px solid #e0e0e0',
                    backgroundColor: isSelected ? '#316ac5' : isToday ? '#ffffcc' : hasSecret ? '#ffeeff' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#000000',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontSize: '11px'
                  }}
                >
                  <span style={{ fontWeight: isToday || isSelected ? 'bold' : 'normal' }}>
                    {dayNum}
                  </span>
                  {hasEvents && (
                    <span style={{ fontSize: '9px', textAlign: 'right', color: isSelected ? '#ffff00' : hasSecret ? '#cc0000' : '#008000' }}>
                      {hasSecret ? '⚠️' : '📌'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Event Agenda */}
        <div style={{ backgroundColor: '#e8e8e8', border: '2px inset #dfdfdf', padding: '8px', display: 'flex', flexDirection: 'column' }}>
          <strong style={{ borderBottom: '1px solid #808080', paddingBottom: '4px', marginBottom: '8px', color: '#000080' }}>
            📅 {selectedDate}
          </strong>

          {/* Events List */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '8px' }}>
            {selectedEvents.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#666', fontSize: '11px', margin: 0 }}>No events scheduled.</p>
            ) : (
              selectedEvents.map(evt => (
                <div 
                  key={evt.id} 
                  style={{ 
                    backgroundColor: evt.isSecret ? '#ffeeee' : '#ffffff', 
                    border: evt.isSecret ? '1px dashed #cc0000' : '1px solid #c0c0c0', 
                    padding: '4px 6px', 
                    marginBottom: '6px',
                    borderRadius: '2px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '11px', color: evt.isSecret ? '#cc0000' : '#000080' }}>
                    {evt.time} {evt.title}
                  </div>
                  {evt.isSecret ? (
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                      <em>First recorded boot sequence of USER_07. Core files initialized in sector 7.</em>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleDeleteEvent(evt.id)} 
                      style={{ fontSize: '9px', background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Event Form */}
          <form onSubmit={handleAddEvent} style={{ borderTop: '1px solid #c0c0c0', paddingTop: '6px' }}>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="New event title..."
              style={{ width: '100%', padding: '3px', border: '1px inset #ffffff', fontSize: '11px', marginBottom: '4px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                style={{ width: '70px', padding: '2px', fontSize: '10px', border: '1px inset #ffffff' }}
              />
              <button type="submit" className="retro-button" style={{ flex: 1, padding: '2px', fontSize: '11px' }}>
                + Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
