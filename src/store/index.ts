import { configureStore } from '@reduxjs/toolkit';
import statsReducer from './slices/statsSlice';
import questsReducer from './slices/questsSlice';
import effectsReducer from './slices/effectsSlice';

export const store = configureStore({
  reducer: {
    stats: statsReducer,
    quests: questsReducer,
    effects: effectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
