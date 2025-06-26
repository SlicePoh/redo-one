// ==== CoPilot Code START ====
import React, { useState } from 'react';
import styles from '../../assets/style';
import { statLabels } from '../../assets/statConfig';
import type { Quest, DifficultyType } from '../../assets/types';

interface AddQuestModalProps {
  open: boolean;
  onClose: () => void;
  allQuests: Quest[];
  onAdd: (quest: Quest) => void;
  addedQuestIds: string[];
}

const difficulties: DifficultyType[] = ['easy', 'medium', 'hard'];

export const AddQuestModal: React.FC<AddQuestModalProps> = ({ open, onClose, allQuests, onAdd, addedQuestIds }) => {
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType | ''>('');
  const [search, setSearch] = useState('');

  if (!open) return null;

  // Filter quests
  const filtered = allQuests.filter(q => {
    if (addedQuestIds.includes(q.id)) return false;
    if (selectedStats.length && (!q.stats || !selectedStats.every(s => q.stats?.includes(s)))) return false;
    if (selectedDifficulty && q.difficulty !== selectedDifficulty) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60 w-96">
      <div className={styles.modal + ' max-w-lg w-full p-6'}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Quest</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {Object.entries(statLabels).map(([key, label]) => (
            <button
              key={key}
              className={`px-2 py-1 rounded text-xs border ${selectedStats.includes(key) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
              onClick={() => setSelectedStats(s => s.includes(key) ? s.filter(x => x !== key) : [...s, key])}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          {difficulties.map(d => (
            <button
              key={d}
              className={`px-2 py-1 rounded text-xs border ${selectedDifficulty === d ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}
              onClick={() => setSelectedDifficulty(selectedDifficulty === d ? '' : d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        <input
          className="w-full mb-3 px-2 py-1 rounded bg-gray-800 text-white"
          placeholder="Search quests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="max-h-60 overflow-y-auto">
          {filtered.length === 0 && <div className="text-gray-400 text-sm">No quests found.</div>}
          <ul className="space-y-2">
            {filtered.map(q => (
              <li key={q.id} className="bg-dark-2 rounded p-2 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-beige">{q.title}</span>
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded" onClick={() => onAdd(q)}>Add</button>
                </div>
                <div className="text-xs text-gray-300">{q.description}</div>
                <div className="flex gap-2 mt-1">
                  {q.stats?.map(s => <span key={s} className="text-xs bg-gray-700 px-1 rounded">{statLabels[s as keyof typeof statLabels] || s}</span>)}
                  {q.difficulty && <span className="text-xs bg-green-700 px-1 rounded">{q.difficulty}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
// ==== CoPilot Code END ====
