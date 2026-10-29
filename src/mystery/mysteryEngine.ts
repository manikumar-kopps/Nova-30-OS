import { MysteryState, INITIAL_MYSTERY_STATE, MYSTERY_STORAGE_KEY } from './mysteryState';
import { ACHIEVEMENTS } from './achievements';

type StateListener = (state: MysteryState) => void;

class MysteryEngine {
  private state: MysteryState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.state = this.loadState();
    this.setupDebugWindow();
  }

  private loadState(): MysteryState {
    try {
      const data = localStorage.getItem(MYSTERY_STORAGE_KEY);
      if (data) {
        return { ...INITIAL_MYSTERY_STATE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load mystery state:', e);
    }
    return { ...INITIAL_MYSTERY_STATE };
  }

  private saveState() {
    try {
      localStorage.setItem(MYSTERY_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save mystery state:', e);
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn(this.state));
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): MysteryState {
    return { ...this.state };
  }

  public unlockClue(clue: string): boolean {
    if (!this.state.cluesDiscovered.includes(clue)) {
      this.state.cluesDiscovered.push(clue);
      this.evaluateMysteryLevel();
      this.saveState();
      this.dispatchMysteryNotification(`[CLUE DISCOVERED] ${clue}`);
      return true;
    }
    return false;
  }

  public unlockAchievement(id: string): boolean {
    if (!this.state.achievementsUnlocked.includes(id) && ACHIEVEMENTS[id]) {
      this.state.achievementsUnlocked.push(id);
      this.saveState();
      const ach = ACHIEVEMENTS[id];
      this.dispatchMysteryNotification(`🏆 ACHIEVEMENT UNLOCKED: ${ach.title}\n${ach.description}`);
      return true;
    }
    return false;
  }

  public recordAppOpen(appName: string) {
    if (!this.state.appsOpened.includes(appName)) {
      this.state.appsOpened.push(appName);
      if (this.state.appsOpened.length >= 3) {
        this.unlockAchievement('EXPLORER');
      }
      this.saveState();
    }
  }

  public recordFileOpen(filePath: string): number {
    const count = this.state.filesOpened.filter(f => f === filePath).length + 1;
    this.state.filesOpened.push(filePath);
    
    if (filePath.includes('NOTHING') || filePath.includes('README.TXT')) {
      this.unlockClue('CLUE_1998');
      this.unlockAchievement('NOTHING');
    }
    if (filePath.includes('INCIDENT.LOG')) {
      this.unlockClue('INCIDENT_LOG');
      this.unlockAchievement('TRUE_DETECTIVE');
    }

    this.evaluateMysteryLevel();
    this.saveState();
    return count;
  }

  public recordTerminalCommand(cmd: string) {
    const c = cmd.trim().toLowerCase();
    if (!this.state.terminalCommandsUsed.includes(c)) {
      this.state.terminalCommandsUsed.push(c);
    }

    if (['ghost', 'memory', '1998', 'black', 'admin', 'wake', 'truth', 'secret'].includes(c)) {
      if (!this.state.secretCommandsDiscovered.includes(c)) {
        this.state.secretCommandsDiscovered.push(c);
      }
    }

    // Command specific progression
    if (c === 'memory') {
      this.unlockClue('CLUE_1998');
    } else if (c === '1998') {
      this.unlockClue('USER_07');
    } else if (c === 'ghost') {
      this.unlockClue('GHOST_TRACE');
    } else if (c === 'wake') {
      this.state.blackWindowUnlocked = true;
      this.unlockClue('USER_07_INTEGRATION');
      this.unlockAchievement('BLACK_WINDOW');
    } else if (c === 'truth') {
      if (this.state.mysteryLevel >= 4 || this.state.cluesDiscovered.includes('CURRENT_USER')) {
        this.state.trueEndingUnlocked = true;
        this.unlockClue('TRUTH_REVEALED');
        this.unlockAchievement('YOU_FOUND_ME');
      }
    }

    this.evaluateMysteryLevel();
    this.saveState();
  }

  public triggerClockAnomaly() {
    this.state.temporalDiagnosticsUnlocked = true;
    this.unlockClue('TEMPORAL_ANOMALY');
    this.unlockAchievement('TIMEKEEPER');
    this.evaluateMysteryLevel();
    this.saveState();
  }

  public recordSecretFound(secretId: string) {
    if (!this.state.easterEggsFound.includes(secretId)) {
      this.state.easterEggsFound.push(secretId);
      this.unlockClue(`SECRET_${secretId.toUpperCase()}`);
      if (this.state.easterEggsFound.length >= 3) {
        this.unlockAchievement('CURIOSITY');
      }
      this.saveState();
      this.dispatchMysteryNotification(`[SECRET DISCOVERED] ${secretId}`);
    }
  }


  public triggerNetworkSignal() {
    if (this.state.cluesDiscovered.includes('TEMPORAL_ANOMALY') || this.state.mysteryLevel >= 1) {
      this.unlockClue('SIGNAL_USER_07');
      this.unlockAchievement('SIGNAL_FOUND');
      this.state.unknownProcessDiscovered = true;
      this.evaluateMysteryLevel();
      this.saveState();
    }
  }

  public unlockAdmin(password: string): boolean {
    if (password.trim() === 'NOVA1998') {
      this.state.adminUnlocked = true;
      this.unlockClue('ADMIN_ACCESS');
      this.unlockAchievement('ADMINISTRATOR');
      this.evaluateMysteryLevel();
      this.saveState();
      return true;
    }
    return false;
  }

  public recordAdminMemoryInspected() {
    this.unlockClue('CURRENT_USER');
    this.evaluateMysteryLevel();
    this.saveState();
  }

  public recordRadioWarning() {
    this.state.radioWarningHeard = true;
    this.unlockClue('RADIO_WARNING');
    this.evaluateMysteryLevel();
    this.saveState();
  }

  public recordPaintPattern() {
    this.state.paintPatternDiscovered = true;
    this.unlockClue('PAINT_PATTERN');
    this.evaluateMysteryLevel();
    this.saveState();
  }

  private evaluateMysteryLevel() {
    const clues = this.state.cluesDiscovered;
    let lvl = 0;

    if (this.state.appsOpened.length >= 3 && this.state.terminalCommandsUsed.length >= 1) {
      lvl = Math.max(lvl, 1);
    }
    if (clues.includes('CLUE_1998') || clues.includes('TEMPORAL_ANOMALY')) {
      lvl = Math.max(lvl, 2);
      this.state.forbiddenFolderUnlocked = true;
    }
    if (clues.includes('USER_07') || clues.includes('SIGNAL_USER_07') || clues.includes('UNKNOWN_PROCESS')) {
      lvl = Math.max(lvl, 3);
      this.state.unknownProcessDiscovered = true;
    }
    if (this.state.adminUnlocked || clues.includes('ADMIN_ACCESS') || clues.includes('USER_07_INTEGRATION')) {
      lvl = Math.max(lvl, 4);
      this.state.blackWindowUnlocked = true;
    }
    if (clues.includes('TRUTH_REVEALED') || this.state.trueEndingUnlocked) {
      lvl = 5;
    }

    this.state.mysteryLevel = lvl;
  }

  private dispatchMysteryNotification(message: string) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nova-mystery-notify', { detail: { message } }));
    }
  }

  public resetProgress() {
    this.state = { ...INITIAL_MYSTERY_STATE };
    this.saveState();
  }

  private setupDebugWindow() {
    if (typeof window !== 'undefined') {
      (window as any).NOVA_DEBUG = {
        getState: () => this.getState(),
        setLevel: (lvl: number) => {
          this.state.mysteryLevel = lvl;
          if (lvl >= 2) this.state.forbiddenFolderUnlocked = true;
          if (lvl >= 3) this.state.unknownProcessDiscovered = true;
          if (lvl >= 4) {
            this.state.adminUnlocked = true;
            this.state.blackWindowUnlocked = true;
          }
          if (lvl >= 5) this.state.trueEndingUnlocked = true;
          this.saveState();
          console.log(`NOVA DEBUG: Mystery level set to ${lvl}`);
        },
        unlockAll: () => {
          Object.keys(ACHIEVEMENTS).forEach(a => this.unlockAchievement(a));
          this.state.mysteryLevel = 5;
          this.state.adminUnlocked = true;
          this.state.forbiddenFolderUnlocked = true;
          this.state.blackWindowUnlocked = true;
          this.state.trueEndingUnlocked = true;
          this.state.unknownProcessDiscovered = true;
          this.state.temporalDiagnosticsUnlocked = true;
          this.saveState();
          console.log('NOVA DEBUG: All mysteries unlocked!');
        },
        reset: () => {
          this.resetProgress();
          console.log('NOVA DEBUG: Mystery progress reset.');
        }
      };
    }
  }
}

export const mysteryEngine = new MysteryEngine();
