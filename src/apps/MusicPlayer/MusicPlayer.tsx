import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  waveType: OscillatorType;
  leadNotes: number[];
  bassNotes: number[];
  isSecret?: boolean;
}

const NOTE = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// 10 Distinct musical compositions with unique keys, modes, BPMs, and instruments
const PLAYLIST: Track[] = [
  {
    id: 1,
    title: 'Digital Dreams (C Major)',
    artist: 'NOVA Synth',
    duration: '2:30',
    bpm: 132,
    waveType: 'square',
    leadNotes: [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.F5, NOTE.A5, NOTE.F5, NOTE.G5, NOTE.E5],
    bassNotes: [NOTE.C3, NOTE.C3, NOTE.G3, NOTE.G3, NOTE.F3, NOTE.F3, NOTE.G3, NOTE.G3]
  },
  {
    id: 2,
    title: 'Cyberpunk 1998 (A Minor)',
    artist: 'Byte Beats',
    duration: '3:15',
    bpm: 145,
    waveType: 'sawtooth',
    leadNotes: [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.F5, NOTE.D5, NOTE.E5, NOTE.C5, NOTE.D5, NOTE.B4],
    bassNotes: [NOTE.A2, NOTE.A3, NOTE.F2, NOTE.F3, NOTE.G2, NOTE.G3, NOTE.E2, NOTE.E3]
  },
  {
    id: 3,
    title: 'Space Odyssey (Lydian F)',
    artist: 'Starlight Sound',
    duration: '2:45',
    bpm: 105,
    waveType: 'sine',
    leadNotes: [NOTE.F4, NOTE.A4, NOTE.C5, NOTE.E5, NOTE.D5, NOTE.B4, NOTE.G4, NOTE.E4, NOTE.A4, NOTE.C5, NOTE.E5, NOTE.G5],
    bassNotes: [NOTE.F3, NOTE.C3, NOTE.G3, NOTE.D3, NOTE.A3, NOTE.F3, NOTE.C3, NOTE.G3]
  },
  {
    id: 4,
    title: 'Dungeon Crawl (E Phrygian)',
    artist: 'QuestMaster',
    duration: '2:15',
    bpm: 120,
    waveType: 'square',
    leadNotes: [NOTE.E4, NOTE.F4, NOTE.G4, NOTE.B4, NOTE.C5, NOTE.B4, NOTE.G4, NOTE.F4, NOTE.E4, NOTE.G4, NOTE.F4, NOTE.D4],
    bassNotes: [NOTE.E3, NOTE.F3, NOTE.E3, NOTE.C3, NOTE.D3, NOTE.E3, NOTE.B2, NOTE.E3]
  },
  {
    id: 5,
    title: 'Pixel Paradise (G Pentatonic)',
    artist: 'Chip Tuner',
    duration: '3:00',
    bpm: 138,
    waveType: 'triangle',
    leadNotes: [NOTE.G4, NOTE.A4, NOTE.B4, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.B4, NOTE.A4, NOTE.G4, NOTE.D4],
    bassNotes: [NOTE.G3, NOTE.D3, NOTE.E3, NOTE.C3, NOTE.G3, NOTE.D3, NOTE.C3, NOTE.D3]
  },
  {
    id: 6,
    title: 'Dial-Up Symphony (D Dorian)',
    artist: 'Baud 56k',
    duration: '2:50',
    bpm: 124,
    waveType: 'sawtooth',
    leadNotes: [NOTE.D4, NOTE.F4, NOTE.G4, NOTE.A4, NOTE.C5, NOTE.A4, NOTE.F4, NOTE.D4, NOTE.E4, NOTE.C4, NOTE.D4, NOTE.A3],
    bassNotes: [NOTE.D3, NOTE.D3, NOTE.C3, NOTE.C3, NOTE.G3, NOTE.G3, NOTE.A3, NOTE.A3]
  },
  {
    id: 7,
    title: 'Neon Sunset (B Blues)',
    artist: 'SynthWave98',
    duration: '3:20',
    bpm: 112,
    waveType: 'sine',
    leadNotes: [NOTE.B4, NOTE.D5, NOTE.E5, NOTE.F5, NOTE.E5, NOTE.D5, NOTE.B4, NOTE.A4, NOTE.F4, NOTE.A4, NOTE.B4, NOTE.D5],
    bassNotes: [NOTE.B2, NOTE.F3, NOTE.E3, NOTE.B2, NOTE.A2, NOTE.E3, NOTE.F2, NOTE.B2]
  },
  {
    id: 8,
    title: "Boss Battle '98 (C# Minor Fast)",
    artist: 'Arcade Heroes',
    duration: '2:10',
    bpm: 160,
    waveType: 'square',
    leadNotes: [NOTE.C5, NOTE.C5, NOTE.D5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.F5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.B4, NOTE.G4],
    bassNotes: [NOTE.C3, NOTE.G3, NOTE.C3, NOTE.G3, NOTE.A3, NOTE.E3, NOTE.F3, NOTE.G3]
  },
  {
    id: 9,
    title: 'Memory Lane (Slow Ambient 80)',
    artist: 'Data Flow',
    duration: '2:40',
    bpm: 80,
    waveType: 'triangle',
    leadNotes: [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.B4, NOTE.C5, NOTE.B4, NOTE.G4, NOTE.E4, NOTE.A4, NOTE.G4, NOTE.E4, NOTE.C4],
    bassNotes: [NOTE.C2, NOTE.G2, NOTE.A2, NOTE.E2, NOTE.F2, NOTE.C2, NOTE.G2, NOTE.C2]
  },
  {
    id: 10,
    title: 'Moonlight MIDI (F Minor)',
    artist: 'Classic98',
    duration: '3:05',
    bpm: 96,
    waveType: 'sawtooth',
    leadNotes: [NOTE.F4, NOTE.C5, NOTE.F5, NOTE.G5, NOTE.E5, NOTE.C5, NOTE.D5, NOTE.B4, NOTE.C5, NOTE.A4, NOTE.B4, NOTE.G4],
    bassNotes: [NOTE.F3, NOTE.C3, NOTE.D3, NOTE.A3, NOTE.B3, NOTE.F3, NOTE.C3, NOTE.G3]
  },
  // Mystery Station
  {
    id: 11,
    title: '05 — UNKNOWN (SIGNAL BROADCAST)',
    artist: 'USER_07',
    duration: '??:??',
    bpm: 65,
    waveType: 'sine',
    leadNotes: [NOTE.A3, NOTE.B3, NOTE.C4, NOTE.E4, NOTE.B3, NOTE.A3, NOTE.F3, NOTE.E3],
    bassNotes: [NOTE.A2, NOTE.E2, NOTE.A2, NOTE.D2, NOTE.A2, NOTE.E2],
    isSecret: true
  }
];

export default function MusicPlayer() {
  const { playClick, playError, playNotification } = useSound();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [eqLevels, setEqLevels] = useState<number[]>(Array(16).fill(5));
  const [secretBroadcastMsg, setSecretBroadcastMsg] = useState<string>('');
  const [mysteryState, setMysteryState] = useState(mysteryEngine.getState());

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noteStepRef = useRef(0);
  const synthTimerRef = useRef<any>(null);
  const timeTimerRef = useRef<any>(null);
  const eqTimerRef = useRef<any>(null);
  const shuffleBagRef = useRef<number[]>([]);

  useEffect(() => {
    return mysteryEngine.subscribe(setMysteryState);
  }, []);

  const isSecretUnlocked = mysteryState.unknownProcessDiscovered || mysteryState.mysteryLevel >= 2;

  const currentTrack = PLAYLIST[currentTrackIdx];

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
        masterGainRef.current = audioCtxRef.current.createGain();
        masterGainRef.current.connect(audioCtxRef.current.destination);
      }
    }
  };

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Equalizer visualizer
  useEffect(() => {
    if (!isPlaying) {
      setEqLevels(Array(16).fill(4));
      return;
    }

    const interval = setInterval(() => {
      setEqLevels(
        Array(16).fill(0).map((_, i) => {
          const bassBoost = i < 4 ? 20 : 0;
          return Math.floor(Math.random() * (45 - bassBoost)) + 5 + bassBoost;
        })
      );
    }, 80);

    eqTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playStep = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const step = noteStepRef.current;
    const track = PLAYLIST[currentTrackIdx];

    // 1. Lead Melody Note
    const leadFreq = track.leadNotes[step % track.leadNotes.length];
    const leadOsc = ctx.createOscillator();
    const leadGain = ctx.createGain();
    leadOsc.type = track.waveType;
    leadOsc.frequency.setValueAtTime(leadFreq, now);

    leadGain.gain.setValueAtTime(0.08, now);
    leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    leadOsc.connect(leadGain);
    leadGain.connect(masterGainRef.current);
    leadOsc.start(now);
    leadOsc.stop(now + 0.24);

    // 2. Bass Note
    if (step % 2 === 0) {
      const bassIndex = Math.floor(step / 2) % track.bassNotes.length;
      const bassFreq = track.bassNotes[bassIndex];
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      bassOsc.connect(bassGain);
      bassGain.connect(masterGainRef.current);
      bassOsc.start(now);
      bassOsc.stop(now + 0.38);
    }

    noteStepRef.current = step + 1;
  }, [currentTrackIdx]);

  const startAudio = () => {
    initAudio();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    stopAudio();

    const intervalMs = Math.floor(60000 / (currentTrack.bpm * 2));
    synthTimerRef.current = setInterval(playStep, intervalMs);

    timeTimerRef.current = setInterval(() => {
      setTimeElapsed(prev => {
        const nextTime = prev + 1;
        // Trigger mystery clue on secret track
        if (currentTrack.isSecret && nextTime >= 8 && !secretBroadcastMsg) {
          setSecretBroadcastMsg('USER_07: DO NOT TRUST THE ADMIN PANEL.');
          mysteryEngine.recordRadioWarning();
          playNotification();
        }
        return nextTime;
      });
    }, 1000);

    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    if (eqTimerRef.current) clearInterval(eqTimerRef.current);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    playClick();
    if (isPlaying) stopAudio();
    else startAudio();
  };

  // True non-repeating shuffle implementation
  const getNextShuffleIndex = () => {
    if (shuffleBagRef.current.length === 0) {
      // Re-fill shuffle bag excluding current
      const pool = PLAYLIST.map((_, i) => i).filter(i => i !== currentTrackIdx && (!PLAYLIST[i].isSecret || isSecretUnlocked));
      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      shuffleBagRef.current = pool;
    }
    return shuffleBagRef.current.pop() ?? 0;
  };

  const nextTrack = () => {
    playClick();
    stopAudio();
    let nextIdx: number;
    if (isShuffle) {
      nextIdx = getNextShuffleIndex();
    } else {
      nextIdx = (currentTrackIdx + 1) % PLAYLIST.length;
      if (PLAYLIST[nextIdx].isSecret && !isSecretUnlocked) {
        nextIdx = 0;
      }
    }
    setCurrentTrackIdx(nextIdx);
    noteStepRef.current = 0;
    setTimeElapsed(0);
    setSecretBroadcastMsg('');
  };

  const prevTrack = () => {
    playClick();
    stopAudio();
    let prevIdx = (currentTrackIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
    if (PLAYLIST[prevIdx].isSecret && !isSecretUnlocked) {
      prevIdx = PLAYLIST.length - 2;
    }
    setCurrentTrackIdx(prevIdx);
    noteStepRef.current = 0;
    setTimeElapsed(0);
    setSecretBroadcastMsg('');
  };

  const selectTrack = (idx: number) => {
    if (PLAYLIST[idx].isSecret && !isSecretUnlocked) {
      playError();
      alert('[ENCRYPTED FREQUENCY 05]\nUnknown broadcast source. Inspect unknown.exe or detect network signal first.');
      return;
    }
    playClick();
    stopAudio();
    setCurrentTrackIdx(idx);
    noteStepRef.current = 0;
    setTimeElapsed(0);
    setSecretBroadcastMsg('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#262626',
        color: '#00ff41',
        fontFamily: 'monospace',
        fontSize: '11px',
        userSelect: 'none',
        padding: '6px',
        boxSizing: 'border-box'
      }}
      role="region"
      aria-label="NOVA Player"
    >
      {/* Winamp style Display Header */}
      <div
        style={{
          backgroundColor: '#000000',
          border: '2px inset #555555',
          padding: '6px 8px',
          marginBottom: '6px',
          boxShadow: 'inset 0 0 8px rgba(0,255,65,0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: currentTrack.isSecret ? '#ff3333' : '#00ff41' }}>
            {isPlaying ? '▶' : '■'} {currentTrack.title}
          </div>
          <div style={{ fontSize: '14px', color: '#ffcc00', letterSpacing: '2px' }}>
            {formatTime(timeElapsed)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888888', fontSize: '10px' }}>
          <span>ARTIST: {currentTrack.artist}</span>
          <span>BPM: {currentTrack.bpm} • {currentTrack.waveType.toUpperCase()} WAVE</span>
        </div>

        {secretBroadcastMsg && (
          <div style={{ marginTop: '4px', backgroundColor: '#800000', color: '#ffffff', padding: '3px 6px', fontWeight: 'bold', border: '1px solid #ff0000' }}>
            📻 {secretBroadcastMsg}
          </div>
        )}

        {/* 16-Band Visualizer Equalizer */}
        <div style={{ display: 'flex', gap: '3px', height: '32px', alignItems: 'flex-end', marginTop: '6px', padding: '2px 0' }}>
          {eqLevels.map((lvl, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.min(100, (lvl / 45) * 100)}%`,
                backgroundColor: currentTrack.isSecret ? '#ff2222' : (i < 4 ? '#ff3333' : i < 10 ? '#ffff00' : '#00ff41'),
                borderRadius: '1px 1px 0 0',
                transition: 'height 0.08s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Control buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#c0c0c0',
          padding: '4px 6px',
          border: '2px outset #ffffff',
          marginBottom: '6px',
          color: '#000000'
        }}
      >
        <div style={{ display: 'flex', gap: '2px' }}>
          <button style={btnStyle} onClick={prevTrack} title="Previous Track" aria-label="Previous Track">⏮</button>
          <button style={{ ...btnStyle, fontWeight: 'bold' }} onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button style={btnStyle} onClick={stopAudio} title="Stop" aria-label="Stop">⏹</button>
          <button style={btnStyle} onClick={nextTrack} title="Next Track" aria-label="Next Track">⏭</button>
        </div>

        {/* Volume slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px' }}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '60px', height: '10px', cursor: 'pointer' }}
            aria-label="Volume slider"
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: '3px' }}>
          <button 
            style={{ ...btnStyle, backgroundColor: isShuffle ? '#000080' : '#c0c0c0', color: isShuffle ? '#ffffff' : '#000000' }}
            onClick={() => { playClick(); setIsShuffle(!isShuffle); }}
            title="Non-repeating Shuffle"
            aria-label="Shuffle toggle"
          >
            🔀
          </button>
          <button 
            style={{ ...btnStyle, backgroundColor: isRepeat ? '#000080' : '#c0c0c0', color: isRepeat ? '#ffffff' : '#000000' }}
            onClick={() => { playClick(); setIsRepeat(!isRepeat); }}
            title="Repeat"
            aria-label="Repeat toggle"
          >
            🔁
          </button>
        </div>
      </div>

      {/* Playlist Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#000000',
          border: '2px inset #555555',
          overflowY: 'auto',
          padding: '2px'
        }}
        role="listbox"
        aria-label="Track Playlist"
      >
        <div style={{ padding: '2px 4px', color: '#888888', borderBottom: '1px solid #222222', fontSize: '10px' }}>
          POLYPHONIC SOUNDBLASTER PLAYLIST ({PLAYLIST.length} DISTINCT TRACKS)
        </div>
        {PLAYLIST.map((t, idx) => {
          const isCurrent = idx === currentTrackIdx;
          const locked = t.isSecret && !isSecretUnlocked;
          return (
            <div
              key={t.id}
              onClick={() => selectTrack(idx)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '3px 6px',
                cursor: locked ? 'not-allowed' : 'pointer',
                backgroundColor: isCurrent ? '#000080' : 'transparent',
                color: locked ? '#555555' : t.isSecret ? '#ff5555' : isCurrent ? '#ffffff' : '#00ff41',
                borderRadius: '1px',
                opacity: locked ? 0.6 : 1
              }}
              role="option"
              aria-selected={isCurrent}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ opacity: 0.7 }}>{t.id < 10 ? `0${t.id}` : t.id}. </span>
                <span>{locked ? '🔒 05 — UNKNOWN (LOCKED SIGNAL)' : t.title}</span>
                <span style={{ opacity: 0.6 }}> - {locked ? '???' : t.artist}</span>
              </div>
              <span style={{ opacity: 0.8, marginLeft: '8px' }}>{locked ? 'LOCKED' : t.duration}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  backgroundColor: '#c0c0c0',
  border: '2px outset #ffffff',
  padding: '2px 6px',
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontSize: '12px',
  outline: 'none',
  minWidth: '24px'
};
