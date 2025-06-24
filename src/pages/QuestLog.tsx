import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import styles from '../assets/style';
import { PageWrapper } from '../components/shared/PageWrapper';
import type { Quest } from '../assets/types';

export const QuestLog = () => {
  const quests = useSelector((state: RootState) => state.quests);
  const headingStyle = styles.flexBetween + ' text-lg font-semibold';

  return (
    <PageWrapper>
      <div className={styles.hero + ' p-4'}>
        <h2 className={headingStyle + ' mb-4'}>Quest Log</h2>
        {quests.length === 0 && <div className="text-beige">No quests found.</div>}
        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((q: Quest) => (
            <div key={q.id} className="bg-dark-2 rounded-lg p-4 shadow flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-beige font-semibold">{q.title}</span>
                <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-200">{q.isDaily ? 'Daily' : 'Optional'}</span>
              </div>
              <div className="text-gray-300 text-sm mb-2">{q.description}</div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={q.completed} readOnly className="w-5 h-5" />
                <span className="text-xs text-green-400">{q.completed ? 'Completed' : 'Incomplete'}</span>
                <span className="ml-auto text-xs text-yellow-400">XP: {q.xp}</span>
              </div>
              {typeof q.progress === 'number' && (
                <div className="w-full h-2 bg-gray-600 rounded overflow-hidden mt-2">
                  <div className="bg-yellow-400 h-full" style={{ width: `${q.progress}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
