import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import styles from '../assets/style';
import { PageWrapper } from '../components/shared/PageWrapper';
import type { Quest, Effect } from '../assets/types';

export const Dashboard = () => {
  const dashRef = useRef<HTMLDivElement>(null);
  const quests = useSelector((state: RootState) => state.quests.filter((q: Quest) => q.isDaily));
  const effects = useSelector((state: RootState) => state.effects.filter((e: Effect) => e.active));

  useGSAP(() => {
    gsap.fromTo(
      dashRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, { scope: dashRef });

  // Use a valid heading style from style.ts, fallback to flexBetween if needed
  const headingStyle = styles.flexBetween + ' text-lg font-semibold';

  return (
    <PageWrapper>
      <div ref={dashRef} className={styles.hero + ' grid gap-4 grid-cols-1 md:grid-cols-3'}>
        {/* Left: Daily Quests */}
        <div className="col-span-2 bg-dark-2 rounded-lg p-4 shadow">
          <h2 className={headingStyle + ' mb-4'}>Daily Quests</h2>
          {quests.length === 0 && <div className="text-beige">No daily quests found.</div>}
          {quests.map((q: Quest) => (
            <div key={q.id} className="flex items-center gap-4 mb-4">
              <input type="checkbox" className="w-5 h-5" checked={q.completed} readOnly />
              <span className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
                <div className="bg-black h-full" style={{ width: `${q.progress ?? (q.completed ? 100 : 0)}%` }}></div>
              </span>
              <span className="text-beige text-sm ml-2">{q.title}</span>
            </div>
          ))}
        </div>
        {/* Right: Add Quest + Negative Effects */}
        <div className="flex flex-col gap-4">
          <div className="bg-dark-2 rounded-lg p-4 shadow flex flex-col items-center justify-center h-1/2">
            <h2 className={headingStyle + ' mb-2'}>Add Quests</h2>
            <button className="text-5xl text-gray-700 hover:scale-110 transition-transform">+</button>
          </div>
          <div className="bg-dark-2 rounded-lg p-4 shadow h-1/2">
            <h2 className={headingStyle + ' mb-2'}>Negative Status Effects</h2>
            <ul className="text-sm text-red-600 list-disc ml-5">
              {effects.length === 0 && <li>No negative effects</li>}
              {effects.map((e: Effect) => {
                const penaltySum = Object.values(e.penalty ?? {}).reduce<number>((a, b) => a + (typeof b === 'number' ? b : 0), 0);
                return (
                  <li key={e.id}>{e.name} {penaltySum !== 0 ? `(${penaltySum > 0 ? '+' : ''}${penaltySum} XP)` : ''}</li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* Bottom: Placeholder Panels */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-dark-2 rounded-lg h-24 shadow"></div>
          <div className="bg-dark-2 rounded-lg h-24 shadow"></div>
        </div>
      </div>
    </PageWrapper>
  );
};
