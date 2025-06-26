// ==== CoPilot Code START ====
// Hook to rotate daily quests if a new day is detected
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { rotateDailyQuests } from '../store/slices/questsSlice';

function getTodayString() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useDailyQuestRotation() {
  const dispatch = useDispatch();
  const quests = useSelector((state: RootState) => state.quests);

  useEffect(() => {
    const today = getTodayString();
    const lastUpdate = localStorage.getItem('lastDailyQuestUpdate');
    if (lastUpdate !== today) {
      dispatch(rotateDailyQuests({ updateDate: true }));
    }
  }, [dispatch, quests]);
}
// ==== CoPilot Code END ====
