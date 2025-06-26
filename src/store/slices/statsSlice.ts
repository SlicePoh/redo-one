import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StatType, StatOrMetaType } from '../../assets/types';
import statsData from '../../assets/initialData/stats.json';

// Define the initial state strictly based on the stat types
const initialState: Record<StatOrMetaType, number> = {
  discipline: statsData.discipline || 0,
  strength: statsData.strength || 0,
  intellect: statsData.intellect || 0,
  charisma: statsData.charisma || 0,
  luck: statsData.luck || 0,
  dexterity: statsData.dexterity || 0,
  xp: statsData.xp || 0,
  level: statsData.level || 1,
};

const LEVEL_UP_XP = 100;

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    // Modify a stat by a given value (positive or negative)
    modifyStat: (state, action: PayloadAction<{ type: StatType; value: number }>) => {
      const { type, value } = action.payload;
      if (Object.prototype.hasOwnProperty.call(state, type)) {
        state[type] += value;
      }
    },
    // Gain XP and handle level up logic
    gainXP: (state, action: PayloadAction<number>) => {
      state.xp += action.payload;
      while (state.xp >= LEVEL_UP_XP) {
        state.level++;
        state.xp -= LEVEL_UP_XP;
        // Optionally: trigger level-up modal or reward logic here
      }
    },
    // Apply penalties to one or more stats
    applyPenalty: (state, action: PayloadAction<Partial<Record<StatType, number>>>) => {
      for (const key in action.payload) {
        const stat = key as StatType;
        if (Object.prototype.hasOwnProperty.call(state, stat) && typeof action.payload[stat] === 'number') {
          state[stat] += action.payload[stat] || 0;
        }
      }
    },
    // Optionally: add resetStats or setStats for future extensibility
  },
});

export const { modifyStat, gainXP, applyPenalty } = statsSlice.actions;
export default statsSlice.reducer;
