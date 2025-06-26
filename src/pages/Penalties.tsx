// ==== CoPilot Code START ====
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import styles from '../assets/style';

const penaltyLabels: Record<string, string> = {
  discipline: 'Discipline',
  strength: 'Strength',
  intellect: 'Intellect',
  charisma: 'Charisma',
};

export const Penalties = () => {
  const effects = useSelector((state: RootState) => state.effects);
  const penalties = effects.filter(e => e.active && e.penalty);
  return (
    <div className="max-w-xl mx-auto">
      <h1 className={styles.heading + ' mb-6'}>Penalties</h1>
      {penalties.length === 0 ? (
        <div className="text-gray-400">No active penalties.</div>
      ) : (
        <ul className="space-y-4">
          {penalties.map((pen, i) => (
            <li key={pen.id} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-1">
              <span className="font-semibold text-red-400">{pen.name}</span>
              <span className="text-sm text-gray-300">{pen.description}</span>
              <div className="flex gap-2 mt-1">
                {Object.entries(pen.penalty || {}).map(([stat, val]) => (
                  <span key={stat} className="text-red-500 font-bold">{penaltyLabels[stat] || stat}: {val}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
// ==== CoPilot Code END ====
