import type { StatOrMetaType } from './types';

export const statLabels: Record<StatOrMetaType, string> = {
  discipline: 'Discipline',
  strength: 'Strength',
  intellect: 'Intellect',
  charisma: 'Charisma',
  luck: 'Luck',
  dexterity: 'Dexterity',
  xp: 'XP',
  level: 'Level',
};

export const statColors: Record<StatOrMetaType, string> = {
  discipline: 'bg-blue-500',
  strength: 'bg-red-500',
  intellect: 'bg-green-500',
  charisma: 'bg-yellow-500',
  luck: 'bg-purple-500',
  dexterity: 'bg-pink-500',
  xp: 'bg-orange-400',
  level: 'bg-gray-500',
};

export const statMap: Record<string, StatOrMetaType> = {
  STR: 'strength',
  DISC: 'discipline',
  INT: 'intellect',
  CHA: 'charisma',
  DEX: 'dexterity',
  LUK: 'luck',
  XP: 'xp',
  LEVEL: 'level',
};
