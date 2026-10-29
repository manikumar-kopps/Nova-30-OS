export class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  init(): void {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, volFactor: number = 1): void {
    if (!this.enabled || !this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    gainNode.gain.setValueAtTime(this.volume * volFactor, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick(): void {
    this.playTone(800, 'square', 0.05, 0.5);
  }

  playDoubleClick(): void {
    if (!this.enabled || !this.ctx) return;
    this.playClick();
    setTimeout(() => this.playClick(), 100);
  }

  playWindowOpen(): void {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, this.ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playWindowClose(): void {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playError(): void {
    if (!this.enabled || !this.ctx) return;
    this.playTone(150, 'sawtooth', 0.4, 0.8);
    setTimeout(() => this.playTone(120, 'sawtooth', 0.4, 0.8), 100);
  }

  playNotification(): void {
    if (!this.enabled || !this.ctx) return;
    this.playTone(880, 'sine', 0.1, 0.6); // A5
    setTimeout(() => this.playTone(1108.73, 'sine', 0.3, 0.6), 100); // C#6
  }

  playStartup(): void {
    if (!this.enabled || !this.ctx) return;
    const notes = [
      { f: 523.25, d: 0.2 }, // C5
      { f: 659.25, d: 0.2 }, // E5
      { f: 783.99, d: 0.2 }, // G5
      { f: 1046.50, d: 0.8 } // C6
    ];
    
    let time = 0;
    notes.forEach(note => {
      setTimeout(() => this.playTone(note.f, 'square', note.d, 0.5), time * 1000);
      time += note.d;
    });
  }

  playShutdown(): void {
    if (!this.enabled || !this.ctx) return;
    const notes = [
      { f: 1046.50, d: 0.2 }, // C6
      { f: 783.99, d: 0.2 }, // G5
      { f: 659.25, d: 0.2 }, // E5
      { f: 523.25, d: 0.6 } // C5
    ];
    
    let time = 0;
    notes.forEach(note => {
      setTimeout(() => this.playTone(note.f, 'triangle', note.d, 0.5), time * 1000);
      time += note.d;
    });
  }

  playKeypress(): void {
    this.playTone(1200, 'square', 0.02, 0.1);
  }

  playMenuOpen(): void {
    this.playTone(300, 'triangle', 0.1, 0.3);
  }

  playMenuHover(): void {
    this.playTone(600, 'sine', 0.05, 0.1);
  }

  playGameSound(type: 'eat' | 'die' | 'shoot' | 'hit' | 'win' | 'lose'): void {
    if (!this.enabled || !this.ctx) return;
    switch (type) {
      case 'eat':
        this.playTone(600, 'square', 0.1);
        setTimeout(() => this.playTone(800, 'square', 0.1), 50);
        break;
      case 'die':
        this.playTone(200, 'sawtooth', 0.5);
        setTimeout(() => this.playTone(150, 'sawtooth', 0.6), 200);
        break;
      case 'shoot':
        this.playTone(800, 'square', 0.1, 0.3);
        break;
      case 'hit':
        this.playTone(200, 'square', 0.1, 0.5);
        break;
      case 'win':
        this.playNotification();
        break;
      case 'lose':
        this.playError();
        break;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
