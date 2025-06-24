import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { layout } from '../assets/style';

const statLabels: Record<string, string> = {
  discipline: 'Discipline',
  strength: 'Strength',
  intellect: 'Intellect',
  charisma: 'Charisma',
  xp: 'XP',
  level: 'Level',
};

const statColors: Record<string, string> = {
  discipline: 'bg-blue-500',
  strength: 'bg-red-500',
  intellect: 'bg-green-500',
  charisma: 'bg-yellow-500',
};

const LEVEL_UP_XP = 100;
const STAT_LEVEL_CAP = 10; // You can adjust this if you want a different cap

export const Character = () => {
  const stats = useSelector((state: RootState) => state.stats);

  // XP bar calculation
  const xp = stats.xp % LEVEL_UP_XP;
  const xpPercent = Math.min(100, Math.round((xp / LEVEL_UP_XP) * 100));
  const xpToNext = LEVEL_UP_XP - xp;

  // Stat progress to next level (example: next level at 10)
  const statToNext = (stat: number) => Math.max(0, STAT_LEVEL_CAP - stat);

  return (
    <div className={layout.hero + ' min-h-screen flex flex-col items-center gap-8'}>
      <h1 className="text-3xl font-bold tracking-wide mt-8 mb-2">Character Sheet</h1>
      <div className="w-full max-w-md bg-dark-1 rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {(['discipline','strength','intellect','charisma'] as const).map((stat) => (
            <div key={stat} className="flex items-center gap-4">
              <span className="w-24 font-semibold text-beige">{statLabels[stat]}</span>
              <div className="flex-1 bg-dark-3 rounded-full h-4 overflow-hidden">
                <div
                  className={`${statColors[stat]} h-4 rounded-full transition-all`}
                  style={{ width: `${Math.min(100, stats[stat] * 10)}%` }}
                />
              </div>
              <span className="ml-2 text-lg font-bold">{stats[stat]}</span>
              <span className="ml-2 text-xs text-beige">+{statToNext(stats[stat])} to next</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-beige">XP</span>
            <span className="text-sm">Level {stats.level}</span>
          </div>
          <div className="w-full bg-dark-3 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-beige mt-1">
            <span>{xp} / {LEVEL_UP_XP} XP</span>
            <span>{xpToNext} XP to next level</span>
          </div>
        </div>
      </div>
    </div>
  );
};
