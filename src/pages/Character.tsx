import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { layout } from '../assets/style';
import type { Biodata, StatType, StatOrMetaType } from '../assets/types';
import { statColors } from '../assets/statConfig';
import { statLabels } from '../assets/statConfig';

const LEVEL_UP_XP = 100;
const STAT_LEVEL_CAP = 10; // You can adjust this if you want a different cap

export const Character = () => {
  const statsAll = useSelector((state: RootState) => state.stats) as Record<StatOrMetaType, number>;
  const stats = statsAll as Record<StatType, number>;
  const biodata = useSelector((state: RootState) => state.biodata as Biodata);

  // XP bar calculation
  const xp = statsAll.xp ?? 0;
  const level = statsAll.level ?? 1;
  const xpPercent = Math.min(100, Math.round((xp % LEVEL_UP_XP) / LEVEL_UP_XP * 100));
  const xpToNext = LEVEL_UP_XP - (xp % LEVEL_UP_XP);

  // Stat progress to next level (example: next level at 10)
  const statToNext = (stat: number) => Math.max(0, STAT_LEVEL_CAP - stat);

  return (
    <div className={layout.hero + ' min-h-screen flex flex-col items-center gap-8'}>
      <h1 className="text-3xl font-bold tracking-wide mt-8 mb-2">Character Sheet</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Biodata Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6 w-full md:w-1/2">
          {/* Profile Section */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg text-beige">{biodata.name}</span>
              <span className="text-sm text-beige/70">({biodata.gender}, {biodata.age} yrs)</span>
            </div>
            <div className="flex flex-wrap gap-4 text-beige/80 text-sm">
              <span>Height: {biodata.height} cm</span>
              <span>Weight: {biodata.weight} kg</span>
              <span>Location: {biodata.location}</span>
              <span>Languages: {biodata.languages.join(', ')}</span>
            </div>
          </div>
          {/* Goals & Addictions */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <h2 className="font-semibold text-beige mb-1 text-sm">Goals</h2>
              <ul className="list-disc list-inside text-beige/90 text-xs">
                {biodata.goals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-beige mb-1 text-sm">Addictions</h2>
              <ul className="list-disc list-inside text-beige/90 text-xs">
                {biodata.addictions.map((add, i) => (
                  <li key={i}>{add}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Skills */}
          <div className="mb-4">
            <h2 className="font-semibold text-beige mb-1 text-sm">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {biodata.skills.map((skill, i) => (
                <span key={i} className="bg-dark-3 px-2 py-1 rounded text-xs text-beige/90 border border-dark-4">{skill}</span>
              ))}
            </div>
          </div>
          {/* Relationships & Finance */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <h2 className="font-semibold text-beige mb-1 text-sm">Relationship</h2>
              <div className="text-xs text-beige/90">
                <div>Status: {biodata.relationships.status}</div>
                <div>Partner Location: {biodata.relationships.partnerLocation}</div>
                <div>Notes: {biodata.relationships.notes}</div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-beige mb-1 text-sm">Finance</h2>
              <div className="text-xs text-beige/90">
                <div>Net Worth: ₹{biodata.finance.netWorthINR.toLocaleString()}</div>
                <div>Monthly Income: ₹{biodata.finance.monthlyIncome.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Stats Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6 w-full md:w-1/2">
          {/* Stat Bars */}
          <div className="flex flex-col gap-2">
            {(['discipline','strength','intellect','charisma','luck','dexterity'] as StatType[]).map((stat) => {
              const statValue = typeof stats[stat as keyof typeof stats] === 'number' && !isNaN(stats[stat as keyof typeof stats]) ? stats[stat as keyof typeof stats] : 0;
              return (
                <div key={stat} className="flex items-center gap-4">
                  <span className="w-24 font-semibold text-beige">{statLabels[stat]}</span>
                  <div className="flex-1 bg-dark-3 rounded-full h-4 overflow-hidden">
                    <div
                      className={`${statColors[stat]} h-4 rounded-full transition-all`}
                      style={{ width: `${Math.min(100, statValue * 10)}%` }}
                    />
                  </div>
                  <span className="ml-2 text-lg font-bold">{statValue}</span>
                  <span className="ml-2 text-xs text-beige">+{statToNext(statValue)} to next</span>
                </div>
              );
            })}
          </div>
          {/* XP Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-beige">XP</span>
              <span className="text-sm">Level {level}</span>
            </div>
            <div className="w-full bg-orange-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-beige mt-1">
              <span>{xp % LEVEL_UP_XP} / {LEVEL_UP_XP} XP</span>
              <span>{xpToNext} XP to next level</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
