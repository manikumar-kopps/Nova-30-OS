import React, { useState, useEffect, useCallback } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

type CalcMode = 'standard' | 'scientific' | 'programmer';
type Base = 'HEX' | 'DEC' | 'OCT' | 'BIN';

export default function Calculator() {
  const { playClick, playError, playNotification } = useSound();
  const [mode, setMode] = useState<CalcMode>('standard');
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [currentBase, setCurrentBase] = useState<Base>('DEC');

  // Check Easter egg
  const checkEasterEgg = (val: string) => {
    if (val === '1998' || val === '07' || val === '80085' || val === '42') {
      playNotification();
      mysteryEngine.recordSecretFound(`calc_easter_egg_${val}`);
    }
  };

  const inputDigit = useCallback((digit: string) => {
    playClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      checkEasterEgg(digit);
    } else {
      const next = display === '0' ? digit : display + digit;
      setDisplay(next);
      checkEasterEgg(next);
    }
  }, [display, waitingForOperand, playClick]);

  const inputDecimal = useCallback(() => {
    playClick();
    if (currentBase !== 'DEC') return;
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand, currentBase, playClick]);

  const clearAll = useCallback(() => {
    playClick();
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, [playClick]);

  const clearEntry = useCallback(() => {
    playClick();
    setDisplay('0');
  }, [playClick]);

  const backspace = useCallback(() => {
    playClick();
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, waitingForOperand, playClick]);

  const toggleSign = useCallback(() => {
    playClick();
    const val = parseFloat(display);
    if (!isNaN(val) && val !== 0) {
      setDisplay(String(-val));
    }
  }, [display, playClick]);

  const performOperation = useCallback((nextOp: string) => {
    playClick();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const current = prevValue;
      let result = current;

      switch (operation) {
        case '+': result = current + inputValue; break;
        case '-': result = current - inputValue; break;
        case '*': result = current * inputValue; break;
        case '/':
          if (inputValue === 0) {
            playError();
            setDisplay('Cannot divide by zero');
            setPrevValue(null);
            setOperation(null);
            setWaitingForOperand(true);
            return;
          }
          result = current / inputValue;
          break;
        case '^': result = Math.pow(current, inputValue); break;
        case 'Mod': result = current % inputValue; break;
        case 'AND': result = (current | 0) & (inputValue | 0); break;
        case 'OR': result = (current | 0) | (inputValue | 0); break;
        case 'XOR': result = (current | 0) ^ (inputValue | 0); break;
        default: break;
      }

      setPrevValue(result);
      setDisplay(String(Number(result.toFixed(10))));
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  }, [display, prevValue, operation, playClick, playError]);

  // Scientific special functions
  const performSciFunc = useCallback((fn: string) => {
    playClick();
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = val;
    switch (fn) {
      case 'sin': res = Math.sin(val); break;
      case 'cos': res = Math.cos(val); break;
      case 'tan': res = Math.tan(val); break;
      case 'sqrt':
        if (val < 0) { playError(); setDisplay('Invalid Input'); return; }
        res = Math.sqrt(val);
        break;
      case 'sqr': res = val * val; break;
      case 'cube': res = val * val * val; break;
      case 'log':
        if (val <= 0) { playError(); setDisplay('Invalid Input'); return; }
        res = Math.log10(val);
        break;
      case 'ln':
        if (val <= 0) { playError(); setDisplay('Invalid Input'); return; }
        res = Math.log(val);
        break;
      case 'fact':
        if (val < 0 || val > 170) { playError(); setDisplay('Overflow'); return; }
        let f = 1;
        for (let i = 2; i <= Math.floor(val); i++) f *= i;
        res = f;
        break;
      case 'pi': res = Math.PI; break;
      case 'e': res = Math.E; break;
      case 'not': res = ~(val | 0); break;
      case 'inv':
        if (val === 0) { playError(); setDisplay('Cannot divide by zero'); return; }
        res = 1 / val;
        break;
      case 'percent': res = prevValue ? (prevValue * val) / 100 : val / 100; break;
      default: break;
    }

    setDisplay(String(Number(res.toFixed(10))));
    setWaitingForOperand(true);
  }, [display, prevValue, playClick, playError]);

  // Programmer base conversions
  const handleBaseChange = (newBase: Base) => {
    playClick();
    const currentInt = parseInt(display, currentBase === 'HEX' ? 16 : currentBase === 'OCT' ? 8 : currentBase === 'BIN' ? 2 : 10) || 0;
    setCurrentBase(newBase);
    if (newBase === 'HEX') setDisplay(currentInt.toString(16).toUpperCase());
    else if (newBase === 'DEC') setDisplay(currentInt.toString(10));
    else if (newBase === 'OCT') setDisplay(currentInt.toString(8));
    else if (newBase === 'BIN') setDisplay(currentInt.toString(2));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') performOperation(e.key);
      else if (e.key === 'Enter' || e.key === '=') performOperation('=');
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Backspace') backspace();
      else if (currentBase === 'HEX' && ['a', 'b', 'c', 'd', 'e', 'f'].includes(e.key.toLowerCase())) {
        inputDigit(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, clearAll, backspace, currentBase]);

  const btnStyle: React.CSSProperties = {
    padding: '4px',
    minWidth: '32px',
    height: '28px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  return (
    <div 
      style={{
        backgroundColor: '#c0c0c0',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif'
      }}
      role="region"
      aria-label="Calculator"
    >
      {/* Mode Switcher Menu */}
      <div style={{ display: 'flex', gap: '8px', padding: '2px 4px', borderBottom: '1px solid #808080', marginBottom: '8px', fontSize: '11px' }}>
        <span 
          onClick={() => { playClick(); setMode('standard'); }} 
          style={{ cursor: 'pointer', fontWeight: mode === 'standard' ? 'bold' : 'normal', textDecoration: mode === 'standard' ? 'underline' : 'none' }}
        >
          Standard
        </span>
        <span 
          onClick={() => { playClick(); setMode('scientific'); }} 
          style={{ cursor: 'pointer', fontWeight: mode === 'scientific' ? 'bold' : 'normal', textDecoration: mode === 'scientific' ? 'underline' : 'none' }}
        >
          Scientific
        </span>
        <span 
          onClick={() => { playClick(); setMode('programmer'); }} 
          style={{ cursor: 'pointer', fontWeight: mode === 'programmer' ? 'bold' : 'normal', textDecoration: mode === 'programmer' ? 'underline' : 'none' }}
        >
          Programmer
        </span>
      </div>

      {/* Display Screen */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '2px inset #dfdfdf',
          padding: '6px 8px',
          textAlign: 'right',
          fontSize: '18px',
          fontFamily: '"Lucida Console", monospace',
          fontWeight: 'bold',
          marginBottom: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        aria-live="polite"
      >
        {display}
      </div>

      {/* Programmer Radix Radios */}
      {mode === 'programmer' && (
        <div style={{ display: 'flex', gap: '12px', border: '1px solid #808080', padding: '4px 8px', marginBottom: '8px', fontSize: '11px' }}>
          {(['HEX', 'DEC', 'OCT', 'BIN'] as Base[]).map(b => (
            <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="radix" 
                checked={currentBase === b} 
                onChange={() => handleBaseChange(b)} 
              />
              {b}
            </label>
          ))}
        </div>
      )}

      {/* Calculator Buttons Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {/* Top Function / Clear Row */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="retro-button" style={{ ...btnStyle, flex: 1, color: '#cc0000' }} onClick={backspace}>Back</button>
          <button className="retro-button" style={{ ...btnStyle, flex: 1, color: '#cc0000' }} onClick={clearEntry}>CE</button>
          <button className="retro-button" style={{ ...btnStyle, flex: 1, color: '#cc0000' }} onClick={clearAll}>C</button>
        </div>

        {/* Scientific Rows */}
        {mode === 'scientific' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('sin')}>sin</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('cos')}>cos</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('tan')}>tan</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('log')}>log</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('ln')}>ln</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('sqr')}>x²</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('cube')}>x³</button>
              <button className="retro-button" style={btnStyle} onClick={() => performOperation('^')}>xʸ</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('fact')}>n!</button>
              <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('pi')}>π</button>
            </div>
          </>
        )}

        {/* Programmer Bitwise Rows */}
        {mode === 'programmer' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            <button className="retro-button" style={btnStyle} onClick={() => performOperation('AND')}>AND</button>
            <button className="retro-button" style={btnStyle} onClick={() => performOperation('OR')}>OR</button>
            <button className="retro-button" style={btnStyle} onClick={() => performOperation('XOR')}>XOR</button>
            <button className="retro-button" style={btnStyle} onClick={() => performSciFunc('not')}>NOT</button>
            <button className="retro-button" style={btnStyle} onClick={() => performOperation('Mod')}>Mod</button>
          </div>
        )}

        {/* Programmer HEX A-F keys */}
        {mode === 'programmer' && currentBase === 'HEX' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
            {['A', 'B', 'C', 'D', 'E', 'F'].map(h => (
              <button key={h} className="retro-button" style={btnStyle} onClick={() => inputDigit(h)}>{h}</button>
            ))}
          </div>
        )}

        {/* Standard Keypad Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('7')}>7</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('8')}>8</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('9')}>9</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#cc0000' }} onClick={() => performOperation('/')}>/</button>

          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('4')}>4</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('5')}>5</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('6')}>6</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#cc0000' }} onClick={() => performOperation('*')}>*</button>

          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('1')}>1</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('2')}>2</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('3')}>3</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#cc0000' }} onClick={() => performOperation('-')}>-</button>

          <button className="retro-button" style={{ ...btnStyle, color: '#0000cc' }} onClick={() => inputDigit('0')}>0</button>
          <button className="retro-button" style={btnStyle} onClick={toggleSign}>+/-</button>
          <button className="retro-button" style={btnStyle} onClick={inputDecimal}>.</button>
          <button className="retro-button" style={{ ...btnStyle, color: '#cc0000' }} onClick={() => performOperation('+')}>+</button>
        </div>

        {/* Equals Row */}
        <button 
          className="retro-button" 
          style={{ ...btnStyle, height: '32px', backgroundColor: '#e0e0e0', color: '#cc0000', fontSize: '13px' }} 
          onClick={() => performOperation('=')}
        >
          =
        </button>
      </div>
    </div>
  );
}
