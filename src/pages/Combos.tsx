// ==== CoPilot Code START ====

import { heading } from '../assets/style';

const combos = [
  { name: 'Early Bird', desc: 'Completed 3 morning quests', xp: 50 },
  { name: 'Brainstorm', desc: 'Finished INT and DEX quests in a row', xp: 30 },
];

export const Combos = () => {
  // In future, fetch combos from Redux or backend
  return (
    <div className="max-w-xl mx-auto">
      <h1 className={heading + ' mb-6'}>Combo Tracker</h1>
      <ul className="space-y-4">
        {combos.map((combo, i) => (
          <li key={i} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-1">
            <span className="font-semibold text-blue-400">{combo.name}</span>
            <span className="text-sm text-gray-300">{combo.desc}</span>
            <span className="text-green-400 font-bold">+{combo.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
// ==== CoPilot Code END ====
