export type StatType = 'discipline' | 'strength' | 'intellect' | 'charisma' | 'xp' | 'level';

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
  penaltyOnMiss?: Partial<Record<StatType, number>>;
  isDaily: boolean;
  completed: boolean;
  progress?: number; // ==== CoPilot Code START ==== // Added for QuestState compatibility // ==== CoPilot Code END ====
}

export interface Effect {
  id: string;
  name: string;
  description: string;
  active: boolean;
  penalty: Partial<Record<StatType, number>>;
}

export interface CharacterState {
  stats: Record<StatType, number>;
  quests: Quest[];
  effects: Effect[];
  history: string[];
}
