import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
  },
});

export const { completeQuest, resetDailies, toggleQuestStatus } = questsSlice.actions;
export default questsSlice.reducer;
