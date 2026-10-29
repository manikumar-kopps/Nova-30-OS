/**
 * Mystery State Interface & Storage Definition
 */

export interface MysteryState {
  appsOpened: string[];
  filesOpened: string[];
  terminalCommandsUsed: string[];
  secretCommandsDiscovered: string[];
  easterEggsFound: string[];
  achievementsUnlocked: string[];
  cluesDiscovered: string[];
  mysteryLevel: number; // 0 to 5
  adminUnlocked: boolean;
  forbiddenFolderUnlocked: boolean;
  blackWindowUnlocked: boolean;
  trueEndingUnlocked: boolean;
  unknownProcessDiscovered: boolean;
  temporalDiagnosticsUnlocked: boolean;
  radioWarningHeard: boolean;
  paintPatternDiscovered: boolean;
}

export const INITIAL_MYSTERY_STATE: MysteryState = {
  appsOpened: [],
  filesOpened: [],
  terminalCommandsUsed: [],
  secretCommandsDiscovered: [],
  easterEggsFound: [],
  achievementsUnlocked: ['FIRST_BOOT'],
  cluesDiscovered: ['BOOT'],
  mysteryLevel: 0,
  adminUnlocked: false,
  forbiddenFolderUnlocked: false,
  blackWindowUnlocked: false,
  trueEndingUnlocked: false,
  unknownProcessDiscovered: false,
  temporalDiagnosticsUnlocked: false,
  radioWarningHeard: false,
  paintPatternDiscovered: false,
};

export const MYSTERY_STORAGE_KEY = 'nova_mystery_progress_v1';
