import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Effect } from '../../assets/types';
import effectsData from '../../assets/initialData/effects.json';

// Deep clone to avoid mutating imported JSON
const initialState: Effect[] = JSON.parse(JSON.stringify(effectsData));

export const effectsSlice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    activateEffect: (state, action: PayloadAction<string>) => {
      const eff = state.find(e => e.id === action.payload);
      if (eff) eff.active = true;
    },
    deactivateEffect: (state, action: PayloadAction<string>) => {
      const eff = state.find(e => e.id === action.payload);
      if (eff) eff.active = false;
    },
    // You can add more effect-related reducers here as needed
  },
});

export const { activateEffect, deactivateEffect } = effectsSlice.actions;
export default effectsSlice.reducer;
