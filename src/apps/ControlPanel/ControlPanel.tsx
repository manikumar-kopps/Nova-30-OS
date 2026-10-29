import React, { useState, useEffect, useCallback } from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';

// Import NovaSettings if it exists, otherwise define inline based on context structure
// import { NovaSettings } from '../../types';

interface ControlPanelProps {
  initialSection?: string;
  onClose?: () => void;
}

const CATEGORIES = [
  { id: 'Display', icon: '🎨', label: 'Display' },
  { id: 'Sound', icon: '🔊', label: 'Sound' },
  { id: 'Mouse', icon: '🖱️', label: 'Mouse' },
  { id: 'Keyboard', icon: '⌨️', label: 'Keyboard' },
  { id: 'Accessibility', icon: '♿', label: 'Accessibility' },
  { id: 'ScreenEffects', icon: '📺', label: 'Screen Effects' },
  { id: 'DateTime', icon: '🕒', label: 'Date/Time' },
  { id: 'System', icon: 'ℹ️', label: 'System' },
];

export default function ControlPanel({ initialSection = 'Display', onClose }: ControlPanelProps) {
  const { settings, updateSettings } = useSettingsContext() as any;
  const [activeTab, setActiveTab] = useState(initialSection);
  const [localSettings, setLocalSettings] = useState(settings || {});
  
  useEffect(() => {
    if (initialSection) setActiveTab(initialSection);
  }, [initialSection]);

  const handleUpdate = (key: string, value: any) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    if (updateSettings) {
      updateSettings({ [key]: value });
    }
  };

  const handleApply = () => {
    if (updateSettings) updateSettings(localSettings);
  };

  const handleOk = () => {
    handleApply();
    if (onClose) onClose();
  };

  const handleCancel = () => {
    if (updateSettings) updateSettings(settings);
    if (onClose) onClose();
  };

  const playTestSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'square';
      oscillator.frequency.value = 440;
      gainNode.gain.value = (localSettings.volume || 50) / 100;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 150);
    } catch (e) {
      console.log('Audio context not supported');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Display':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Display Properties</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Wallpaper:</label>
              <select 
                style={styles.select}
                value={localSettings.wallpaper || 'Teal'} 
                onChange={(e) => handleUpdate('wallpaper', e.target.value)}
                aria-label="Select Wallpaper"
              >
                <option value="Teal">Teal (Default)</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
                <option value="Sunset Gradient">Sunset Gradient</option>
                <option value="Matrix">Matrix</option>
                <option value="Stars">Stars</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Theme:</label>
              <select 
                style={styles.select}
                value={localSettings.theme || 'Classic'} 
                onChange={(e) => handleUpdate('theme', e.target.value)}
                aria-label="Select Theme"
              >
                <option value="Classic">Classic (Win95)</option>
                <option value="Dark">Dark Mode</option>
                <option value="High Contrast">High Contrast</option>
              </select>
            </div>
          </div>
        );

      case 'Sound':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Sound Settings</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localSettings.soundEnabled ?? true} 
                  onChange={(e) => handleUpdate('soundEnabled', e.target.checked)}
                />
                Enable System Sounds
              </label>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Volume: {localSettings.volume ?? 50}%</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={localSettings.volume ?? 50} 
                onChange={(e) => handleUpdate('volume', parseInt(e.target.value))}
                style={styles.slider}
                disabled={!(localSettings.soundEnabled ?? true)}
                aria-label="System Volume"
              />
            </div>
            <button 
              style={styles.button} 
              onClick={playTestSound}
              disabled={!(localSettings.soundEnabled ?? true)}
            >
              Test Sound
            </button>
          </div>
        );

      case 'Mouse':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Mouse Properties</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Cursor Style:</label>
              <select 
                style={styles.select}
                value={localSettings.cursorStyle || 'Default'} 
                onChange={(e) => handleUpdate('cursorStyle', e.target.value)}
                aria-label="Select Cursor Style"
              >
                <option value="Default">Default</option>
                <option value="Retro">Retro (Pixel)</option>
                <option value="Crosshair">Crosshair</option>
              </select>
            </div>
          </div>
        );

      case 'Keyboard':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Keyboard Shortcuts</h3>
            <div style={styles.listContainer}>
              <ul style={styles.list}>
                <li><strong>Alt+Tab:</strong> Switch windows</li>
                <li><strong>Alt+F4:</strong> Close window</li>
                <li><strong>Ctrl+S:</strong> Save</li>
                <li><strong>Ctrl+C/V/X:</strong> Copy/Paste/Cut</li>
                <li><strong>Ctrl+A:</strong> Select all</li>
                <li><strong>Ctrl+Alt+A:</strong> Accessibility Center</li>
                <li><strong>Meta/Win:</strong> Start Menu</li>
                <li><strong>F11:</strong> Fullscreen</li>
                <li><strong>Escape:</strong> Close menu/dialog</li>
              </ul>
            </div>
          </div>
        );

      case 'Accessibility':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Accessibility Center</h3>
            <div style={styles.scrollArea}>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.reduceMotion ?? false} 
                    onChange={(e) => handleUpdate('reduceMotion', e.target.checked)}
                  />
                  Reduce Motion (disables animations)
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.highContrastMode ?? false} 
                    onChange={(e) => handleUpdate('highContrastMode', e.target.checked)}
                  />
                  High Contrast Mode
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.largerText ?? false} 
                    onChange={(e) => handleUpdate('largerText', e.target.checked)}
                  />
                  Larger Text (1.25x scale)
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.disableCrtEffects ?? false} 
                    onChange={(e) => handleUpdate('disableCrtEffects', e.target.checked)}
                  />
                  Disable CRT Effects
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.disableGlitchEffects ?? false} 
                    onChange={(e) => handleUpdate('disableGlitchEffects', e.target.checked)}
                  />
                  Disable Glitch Effects
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.disableBlinking ?? false} 
                    onChange={(e) => handleUpdate('disableBlinking', e.target.checked)}
                  />
                  Disable Blinking (cursors, carets)
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.soundEnabled ?? true} 
                    onChange={(e) => handleUpdate('soundEnabled', e.target.checked)}
                  />
                  Sound On/Off
                </label>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={localSettings.screenReaderMode ?? false} 
                    onChange={(e) => handleUpdate('screenReaderMode', e.target.checked)}
                  />
                  Screen Reader Mode
                </label>
              </div>
              
              <div style={{...styles.buttonRow, marginTop: '16px'}}>
                <button 
                  style={styles.button} 
                  onClick={() => {
                    const defaults = {
                      reduceMotion: false,
                      highContrastMode: false,
                      largerText: false,
                      disableCrtEffects: false,
                      disableGlitchEffects: false,
                      disableBlinking: false,
                      soundEnabled: true,
                      screenReaderMode: false,
                    };
                    setLocalSettings((prev: any) => ({...prev, ...defaults}));
                    if (updateSettings) updateSettings(defaults);
                  }}
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        );

      case 'ScreenEffects':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Screen Effects</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localSettings.crtScanlines ?? true} 
                  onChange={(e) => handleUpdate('crtScanlines', e.target.checked)}
                />
                CRT Scanlines
              </label>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localSettings.screenCurvature ?? true} 
                  onChange={(e) => handleUpdate('screenCurvature', e.target.checked)}
                />
                Screen Curvature
              </label>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localSettings.chromaticAberration ?? true} 
                  onChange={(e) => handleUpdate('chromaticAberration', e.target.checked)}
                />
                Chromatic Aberration
              </label>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localSettings.screenNoise ?? true} 
                  onChange={(e) => handleUpdate('screenNoise', e.target.checked)}
                />
                Screen Noise
              </label>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localSettings.glitchEffects ?? true} 
                  onChange={(e) => handleUpdate('glitchEffects', e.target.checked)}
                />
                Glitch Effects
              </label>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Intensity: {localSettings.intensity ?? 50}%</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={localSettings.intensity ?? 50} 
                onChange={(e) => handleUpdate('intensity', parseInt(e.target.value))}
                style={styles.slider}
                aria-label="Effects Intensity"
              />
            </div>
          </div>
        );

      case 'DateTime':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>Date / Time</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Clock Format:</label>
              <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="radio" 
                    name="clockFormat" 
                    value="12h"
                    checked={(localSettings.clockFormat || '12h') === '12h'}
                    onChange={() => handleUpdate('clockFormat', '12h')}
                  /> 12-Hour
                </label>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="radio" 
                    name="clockFormat" 
                    value="24h"
                    checked={localSettings.clockFormat === '24h'}
                    onChange={() => handleUpdate('clockFormat', '24h')}
                  /> 24-Hour
                </label>
              </div>
            </div>
            <div style={{...styles.insetBox, marginTop: '20px', padding: '15px', textAlign: 'center'}}>
              <div style={{fontSize: '24px', fontFamily: 'monospace'}}>
                {new Date().toLocaleTimeString([], { hour12: (localSettings.clockFormat || '12h') === '12h' })}
              </div>
              <div style={{marginTop: '5px'}}>
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        );

      case 'System':
        return (
          <div style={styles.section}>
            <h3 style={styles.h3}>System Properties</h3>
            <div style={styles.insetBox}>
              <p><strong>System:</strong> NOVA 30 OS</p>
              <p><strong>Version:</strong> 30.10.1998</p>
              <p><strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}</p>
            </div>
            
            <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button 
                style={styles.button}
                onClick={() => {
                  if(window.confirm('Reset ALL settings to default?')) {
                    if (updateSettings) {
                      localStorage.removeItem('nova-settings');
                      window.location.reload();
                    }
                  }
                }}
              >
                Reset All Settings
              </button>
              
              <button 
                style={styles.button}
                onClick={() => {
                  if(window.confirm('Clear all local data? This will reset the entire OS.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Clear LocalStorage
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container} role="dialog" aria-labelledby="cp-title">
      <div style={styles.layout}>
        {/* Left Sidebar */}
        <div style={styles.sidebar} role="tablist" aria-orientation="vertical">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeTab === cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                ...styles.categoryBtn,
                ...(activeTab === cat.id ? styles.categoryBtnActive : {})
              }}
            >
              <span style={{marginRight: '8px', fontSize: '16px'}}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div style={styles.content} role="tabpanel">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div style={styles.footer}>
        <button style={styles.button} onClick={handleOk}>OK</button>
        <button style={styles.button} onClick={handleCancel}>Cancel</button>
        <button style={styles.button} onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#c0c0c0',
    fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Geneva, sans-serif',
    color: '#000',
    padding: '8px',
    boxSizing: 'border-box'
  },
  layout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    gap: '8px',
    marginBottom: '8px'
  },
  sidebar: {
    width: '160px',
    border: '2px inset #dfdfdf',
    backgroundColor: '#fff',
    overflowY: 'auto',
    padding: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  content: {
    flex: 1,
    padding: '12px',
    border: '2px outset #dfdfdf',
    backgroundColor: '#c0c0c0',
    overflowY: 'auto'
  },
  categoryBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '6px 8px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px'
  },
  categoryBtnActive: {
    backgroundColor: '#000080',
    color: '#fff',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  h3: {
    margin: '0 0 10px 0',
    paddingBottom: '4px',
    borderBottom: '1px solid #808080',
    fontSize: '14px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '12px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  select: {
    padding: '2px',
    fontFamily: 'inherit',
    border: '2px inset #dfdfdf'
  },
  slider: {
    width: '100%'
  },
  insetBox: {
    border: '2px inset #dfdfdf',
    backgroundColor: '#fff',
    padding: '8px',
    fontSize: '12px'
  },
  scrollArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '100%',
    overflowY: 'auto'
  },
  listContainer: {
    border: '2px inset #dfdfdf',
    backgroundColor: '#fff',
    height: '200px',
    overflowY: 'auto',
    padding: '8px'
  },
  list: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    fontSize: '12px',
    lineHeight: '1.8'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '6px',
    paddingTop: '8px',
    borderTop: '1px solid #808080'
  },
  button: {
    padding: '4px 16px',
    minWidth: '75px',
    border: '2px outset #dfdfdf',
    backgroundColor: '#c0c0c0',
    fontFamily: 'inherit',
    fontSize: '12px',
    cursor: 'pointer'
  },
  buttonRow: {
    display: 'flex',
    gap: '8px'
  }
};
