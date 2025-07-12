// ==== CoPilot Code START ====
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { heading } from '../assets/style';

const rewards = [
  { label: 'Increase Stat Cap', value: 'cap' },
  { label: 'Unlock Theme', value: 'theme' },
];

export const LevelUp = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const stats = useSelector((state: RootState) => state.stats);
  return (
    <div className="max-w-xl mx-auto">
      <h1 className={heading + ' mb-6'}>Level Up!</h1>
      <div className="mb-6">
        <div className="w-full bg-gray-800 rounded-full h-5 mb-2">
          <div className="bg-green-400 h-5 rounded-full transition-all duration-500" style={{ width: '100%' }} />
        </div>
        <span className="text-green-400 font-bold">Level {stats.level}</span>
      </div>
      <div className="mb-4">Choose your reward:</div>
      <div className="flex gap-4">
        {rewards.map(r => (
          <button
            key={r.value}
            className={`px-4 py-2 rounded-lg border-2 ${selected === r.value ? 'border-green-400 bg-green-900' : 'border-gray-600 bg-gray-800'} text-white`}
            onClick={() => setSelected(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {selected && <div className="mt-6 text-green-300">Reward selected: {rewards.find(r => r.value === selected)?.label}</div>}
    </div>
  );
};
// ==== CoPilot Code END ====