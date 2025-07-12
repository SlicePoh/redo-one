// StatType only for real stats
export type StatType = 'discipline' | 'strength' | 'intellect' | 'charisma' | 'luck' | 'dexterity';
export type DifficultyType = 'easy' | 'medium' | 'hard';

// For places where xp/level are needed
export type StatOrMetaType = StatType | 'xp' | 'level';

export interface Stat {
  type: StatType;
  value: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  statGain?: Partial<Record<StatType, number>>;
  statGains?: Partial<Record<StatType, number>>; // Optional: for compatibility with some quest JSONs
  penaltyOnMiss?: Partial<Record<StatType, number>>;
  isDaily: boolean;
  completed: boolean;
  progress?: number; // ==== CoPilot Code START ==== // Added for QuestState compatibility // ==== CoPilot Code END ====
  stats?: string[]; // Added for compatibility with quest JSON
  partialScoring?: boolean; // Added for compatibility with quest JSON
  scalingXp?: Record<string, number>; // Added for compatibility with quest JSON
  difficulty?: string; // Added for AddQuestModal compatibility
}

export interface Effect {
  id: string;
  name: string;
  description: string;
  active: boolean;
  penalty: Partial<Record<StatType, number>>;
}

export interface CharacterState {
  stats: Record<StatOrMetaType, number>; // Allow xp/level in state
  quests: Quest[];
  effects: Effect[];
  history: string[];
}

export interface Relationships {
  status: string;
  partnerLocation: string;
  notes: string;
}

export interface Finance {
  netWorthINR: number;
  monthlyIncome: number;
}

export interface Biodata {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goals: string[];
  addictions: string[];
  mentalHealth: number;
  discipline: number;
  strength: number;
  intellect: number;
  charisma: number;
  luck: number;
  dexterity: number; // Added dexterity to Biodata
  relationships: Relationships;
  finance: Finance;
  languages: string[];
  location: string;
  skills: string[];
}