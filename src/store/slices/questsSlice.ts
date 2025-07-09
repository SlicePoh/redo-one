import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Quest } from "../../assets/types";
import questsData from "../../assets/initialData/quests.json";

// Define the state type for quests in the slice
export type QuestState = Quest & { completed: boolean; progress: number };

// Only include valid quest objects (with id and title)
const initialState: QuestState[] = (questsData as Partial<Quest>[])
  .filter((q) => q && typeof q.id === "string" && typeof q.title === "string")
  .map((q) => ({
    ...q,
    xp: (q && typeof (q as Record<string, unknown>)["xpGain"] === "number") ? (q as Record<string, number>)["xpGain"] : 0, // Map xpGain from JSON to xp for Quest type
    completed: false,
    progress: 0,
  } as QuestState));

// Ensure at least one daily quest per stat base
const statMap = {
  DISC: 'discipline',
  STR: 'strength',
  INT: 'intellect',
  CHA: 'charisma',
} as const;
const statBases = ['discipline', 'strength', 'intellect', 'charisma'] as const;

//type StatBase = typeof statBases[number];

type QuestWithStats = QuestState & { stats?: string[] };

statBases.forEach((stat) => {
  if (!initialState.some(q => q.isDaily && Array.isArray((q as QuestWithStats).stats) && (q as QuestWithStats).stats!.some((s) => statMap[s as keyof typeof statMap] === stat))) {
    // Find first quest for this stat
    const quest = initialState.find(q => Array.isArray((q as QuestWithStats).stats) && (q as QuestWithStats).stats!.some((s) => statMap[s as keyof typeof statMap] === stat));
    if (quest) {
      (quest as QuestWithStats).isDaily = true;
    }
  }
});

// Helper to pick new daily quests
export function pickNewDailyQuests(quests: QuestWithStats[]): string[] {
  const statMap = {
    DISC: 'discipline',
    STR: 'strength',
    INT: 'intellect',
    CHA: 'charisma',
  } as const;
  const statBases = ['discipline', 'strength', 'intellect', 'charisma'] as const;
  const newDailyIds: string[] = [];
  statBases.forEach((stat) => {
    const candidates = quests.filter(q => Array.isArray(q.stats) && q.stats.some((s: string) => statMap[s as keyof typeof statMap] === stat));
    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      newDailyIds.push(pick.id);
    }
  });
  return newDailyIds;
}

// Thunk to rotate daily quests (optionally update date)
export const rotateDailyQuests = createAsyncThunk(
  'quests/rotateDailyQuests',
  async ({ updateDate }: { updateDate: boolean }, { getState, dispatch }) => {
    const state = getState();
    const quests = state?.quests as QuestWithStats[];
    const newDailyIds = pickNewDailyQuests(quests);
    dispatch(setDailyQuests(newDailyIds));
    if (updateDate) {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('lastDailyQuestUpdate', today);
    }
  }
);

export const questsSlice = createSlice({
  name: "quests",
  initialState,
  reducers: {
    completeQuest: (state, action: PayloadAction<string>) => {
      const quest = state.find((q) => q.id === action.payload);
      if (quest && !quest.completed) {
        quest.completed = true;
      }
    },
    resetDailies: (state) => {
      state.forEach((q) => {
        if (q.isDaily) q.completed = false;
      });
    },
    toggleQuestStatus: (state, action: PayloadAction<string>) => {
      const quest = state.find((q) => q.id === action.payload);
      if (quest) {
        quest.completed = !quest.completed;
        quest.progress = quest.completed ? 100 : 0;
      }
    },
    setDailyQuests: (state, action: PayloadAction<string[]>) => {
      // Unset all isDaily
      state.forEach((q) => { (q as QuestWithStats).isDaily = false; });
      // Set new dailies by id
      action.payload.forEach((id) => {
        const quest = state.find((q) => q.id === id);
        if (quest) (quest as QuestWithStats).isDaily = true;
      });
    },
    setQuestProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const quest = state.find((q) => q.id === action.payload.id);
      if (quest) {
        quest.progress = action.payload.progress;
        quest.completed = action.payload.progress >= 100;
      }
    },
  },
});

export const { completeQuest, resetDailies, toggleQuestStatus, setDailyQuests, setQuestProgress } = questsSlice.actions;
export default questsSlice.reducer;
