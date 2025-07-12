// ==== CoPilot Code START ====
// Hook to get daily quests grouped by stat base
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Quest, StatType } from '../assets/types';

// Mapping from JSON stat codes to app stat keys
const statMap: Record<string, StatType> = {
  'DISC': 'discipline',
  'STR': 'strength',
  'INT': 'intellect',
  'CHA': 'charisma',
};

export function useDailyQuestsByStat() {
  const quests = useSelector((state: RootState) => state.quests as Quest[]);
  // Only daily quests
  const daily = quests.filter(q => q.isDaily);
  // Group by stat base
  const grouped: Partial<Record<StatType, Quest[]>> = {};
  daily.forEach((q: Quest & { stats?: string[] }) => {
    const statsArr = q.stats;
    if (Array.isArray(statsArr)) {
      statsArr.forEach((statCode: string) => {
        const stat = statMap[statCode];
        if (stat) {
          if (!grouped[stat]) grouped[stat] = [];
          grouped[stat]!.push(q);
        }
      });
    }
  });
  return grouped;
}
// ==== CoPilot Code END ====