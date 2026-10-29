export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_BOOT: {
    id: 'FIRST_BOOT',
    title: 'First Boot',
    description: 'Welcome to NOVA 30 OS. An ancient terminal awaits.',
    icon: '💾'
  },
  EXPLORER: {
    id: 'EXPLORER',
    title: 'Digital Explorer',
    description: 'Opened multiple applications across NOVA 30 OS.',
    icon: '🧭'
  },
  NOTHING: {
    id: 'NOTHING',
    title: 'Looking into the Abyss',
    description: 'Discovered the hidden C:\\SYSTEM\\NOTHING directory.',
    icon: '📁'
  },
  TIMEKEEPER: {
    id: 'TIMEKEEPER',
    title: 'Temporal Anomaly',
    description: 'Triggered diagnostics by probing the system clock.',
    icon: '⏳'
  },
  SIGNAL_FOUND: {
    id: 'SIGNAL_FOUND',
    title: 'Signal Intercepted',
    description: 'Captured an unrouted packet broadcast from USER_07.',
    icon: '📡'
  },
  GHOST_IN_THE_MACHINE: {
    id: 'GHOST_IN_THE_MACHINE',
    title: 'Ghost in the Machine',
    description: 'Located unknown.exe hiding in the system processes.',
    icon: '👻'
  },
  ADMINISTRATOR: {
    id: 'ADMINISTRATOR',
    title: 'Root Authority',
    description: 'Authenticated into NOVA 1998 Admin Panel.',
    icon: '🔑'
  },
  BLACK_WINDOW: {
    id: 'BLACK_WINDOW',
    title: 'Direct Link',
    description: 'Established two-way link via the Black Window.',
    icon: '⬛'
  },
  TRUE_DETECTIVE: {
    id: 'TRUE_DETECTIVE',
    title: 'True Detective',
    description: 'Read the incident log and decoded the audio broadcast.',
    icon: '🕵️'
  },
  YOU_FOUND_ME: {
    id: 'YOU_FOUND_ME',
    title: 'YOU FOUND ME',
    description: 'Completed the mystery. USER_07 is now forever part of you.',
    icon: '✨'
  }
};
