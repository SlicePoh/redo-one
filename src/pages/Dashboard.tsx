import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import styles from '../assets/style';
import { PageWrapper } from '../components/shared/PageWrapper';
import type { Effect, StatType, Quest } from '../assets/types';
import { toggleQuestStatus, rotateDailyQuests } from '../store/slices/questsSlice';
import { useDailyQuestsByStat } from '../hooks/useDailyQuestsByStat';
import { useDailyQuestRotation } from '../hooks/useDailyQuestRotation';
import { statLabels, statColors, statMap } from '../assets/statConfig';
import questsData from '../assets/initialData/quests.json';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AddQuestModal } from '../components/shared/AddQuestModal';
import { QuestItem } from '../components/shared/QuestItem';

dayjs.extend(utc);
dayjs.extend(timezone);

export const Dashboard = () => {
  const dashRef = useRef<HTMLDivElement>(null);
  const effects = useSelector((state: RootState) => state.effects.filter((e: Effect) => e.active));
  const dispatch = useDispatch();
  useDailyQuestRotation();

  useGSAP(() => {
    gsap.fromTo(
      dashRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, { scope: dashRef });

  const headingStyle = styles.flexBetween + ' text-lg font-semibold';

  // Helper to get normalized stat array for a quest
  function getQuestStats(rawStats: string[]): StatType[] {
    return rawStats
      .map(s => statMap[s] || s.toLowerCase())
      .filter((s): s is StatType => ['discipline','strength','intellect','charisma','luck','dexterity'].includes(s));
  }

  // Surprise Quest logic (using quests.json)
  type SurpriseQuest = (typeof allQuests[number] & { completed?: boolean; progress?: number }) | null;
  const [surpriseQuest, setSurpriseQuest] = useState<SurpriseQuest>(null);
  const [acceptedSurpriseId, setAcceptedSurpriseId] = useState<string | null>(null);
  const [showAddQuestModal, setShowAddQuestModal] = useState(false);
  const [extraDailyQuests, setExtraDailyQuests] = useState<Quest[]>([]); // For user-added quests

  // Type for raw quest data from JSON
  interface RawQuest {
    id: string;
    title: string;
    description?: string;
    xpGain?: number;
    statGain?: Partial<Record<StatType, number>>;
    statGains?: Partial<Record<StatType, number>>;
    penaltyOnMiss?: Partial<Record<StatType, number>>;
    isDaily?: boolean;
    completed?: boolean;
    progress?: number;
    stats?: string[];
    partialScoring?: boolean;
    scalingXp?: Record<string, number>;
    difficulty?: string;
  }

  // Normalize questsData to match Quest interface
  // Prefer statGain, fallback to statGains, then default to {}
  const allQuests: Quest[] = Array.isArray(questsData)
    ? (questsData as RawQuest[]).filter(q => q && typeof q.id === 'string' && typeof q.title === 'string').map(q => ({
        id: q.id,
        title: q.title,
        description: q.description || '',
        xp: typeof q.xpGain === 'number' ? q.xpGain : 0,
        statGain: q.statGain ?? q.statGains ?? {},
        statGains: q.statGains ?? undefined,
        penaltyOnMiss: q.penaltyOnMiss ?? {},
        isDaily: false,
        completed: false,
        progress: 0,
        stats: q.stats || [],
        partialScoring: q.partialScoring ?? false,
        scalingXp: q.scalingXp || {},
        difficulty: typeof q.difficulty === 'string' ? q.difficulty : undefined,
      }))
    : [];

  const triggerSurpriseQuest = () => {
    const dailyIds = allDailyQuests.concat(extraDailyQuests).map(q => q.id);
    const available = allQuests.filter(q => !dailyIds.includes(q.id) && q.id !== acceptedSurpriseId);
    if (available.length === 0) return;
    const newQuest = available[Math.floor(Math.random() * available.length)];
    setSurpriseQuest(newQuest);
  };

  const handleAcceptSurprise = () => {
    if (surpriseQuest) {
      setAcceptedSurpriseId(surpriseQuest.id);
      setSurpriseQuest(null);
      // Map surpriseQuest to Quest type and add to extraDailyQuests
      setExtraDailyQuests(prev => [
        ...prev,
        {
          ...surpriseQuest,
          xp: (surpriseQuest as unknown as { xpGain?: number }).xpGain || 0,
          isDaily: true,
          completed: false,
          progress: 0,
          // Ensure scalingXp is a Record<string, number>
          scalingXp: surpriseQuest.scalingXp ? Object.fromEntries(Object.entries(surpriseQuest.scalingXp).filter(([, v]) => typeof v === 'number')) : {},
        } as Quest
      ]);
    }
  };

  const handleDeclineSurprise = () => {
    setSurpriseQuest(null);
  };

  // Remove lastRefresh state and handler
  // Add refresh handler to rotate quests manually
  const handleRefreshQuests = () => {
    // @ts-expect-error: Redux thunk type mismatch, safe to ignore for dispatching rotateDailyQuests
    dispatch(rotateDailyQuests({ updateDate: false }));
  };
  // Remove useEffect for lastRefresh
  // Use dailyByStat directly
  const dailyByStatRefreshed = useDailyQuestsByStat(); // This will always run on render
  // Flatten all daily quests into a single array
  const allDailyQuests = Object.values(dailyByStatRefreshed).flat().filter((q, i, arr) => arr.findIndex(x => x.id === q.id) === i).concat(extraDailyQuests);
  // Limit to 3-7 quests
  const displayedQuests = allDailyQuests.slice(0, 7);

  // Auto-refresh at 00:00 IST
  useGSAP(() => {
    const now = dayjs();
    const nextMidnightIST = dayjs().tz('Asia/Kolkata').add(1, 'day').startOf('day');
    const msToMidnight = nextMidnightIST.valueOf() - now.valueOf();
    const timeout = setTimeout(() => {
      handleRefreshQuests();
    }, msToMidnight);
    return () => clearTimeout(timeout);
  }, []);

  // Handler to add a quest to extraDailyQuests
  const handleAddExtraQuest = (quest: Quest) => {
    if (!extraDailyQuests.some(q => q.id === quest.id)) {
      setExtraDailyQuests(prev => [...prev, {
        ...quest,
        isDaily: false,
        completed: false,
        progress: 0,
      }]);
    }
  };

  // Handler to remove a quest from extraDailyQuests
  const handleRemoveExtraQuest = (id: string) => {
    setExtraDailyQuests(prev => prev.filter(q => q.id !== id));
  };

  return (
    <PageWrapper>
      <div ref={dashRef} className={styles.hero + ' grid gap-4 grid-cols-1 md:grid-cols-3 font-poppins'}>
        {/* Left: Daily Quests */}
        <div className="col-span-2 bg-dark-2 rounded-lg p-4 shadow font-poppins">
          <div className="flex justify-between items-center mb-4">
            <h2 className={headingStyle + ' font-montserrat'}>Daily Quests</h2>
            <button className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 text-xs font-semibold font-poppins"
              onClick={handleRefreshQuests} title="Refresh daily quests manually" >
              Refresh
            </button>
          </div>
          {displayedQuests.length ? (
            displayedQuests.map((q) => (
              <QuestItem
                key={q.id}
                quest={q}
                mode="select"
                onToggle={(id) => dispatch(toggleQuestStatus(id))}
                showStats={true}
                showActions={true}
                className="mb-2 font-poppins"
              />
            ))
          ) : (
            <div className="text-beige/60 text-xs mb-2 font-poppins">No daily quests available.</div>
          )}
          {/* Surprise Quests Section */}
          <div className="mt-8">
            <h2 className={headingStyle + ' mb-4 font-montserrat'}>Surprise Quests</h2>
            {!surpriseQuest && !acceptedSurpriseId && (
              <button
                className="px-6 py-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 mb-4 font-poppins"
                onClick={triggerSurpriseQuest}
              >
                Trigger Surprise Quest
              </button>
            )}
            {surpriseQuest && (
              <div className="bg-gray-800 rounded-lg p-6 font-poppins">
                <h2 className="text-xl font-semibold mb-2 font-montserrat">{surpriseQuest.title}</h2>
                <p className="mb-4 font-poppins">{surpriseQuest.description}</p>
                {/* Render surprise quest controls like daily quests */}
                <div className="flex items-center gap-4 mb-4">
                  {(() => {
                    const supportsPartial = !!surpriseQuest.partialScoring || !!surpriseQuest.scalingXp;
                    const questStats = getQuestStats(surpriseQuest.stats || []);
                    return (
                      <>
                        <input type="checkbox" className="w-5 h-5" checked={!!surpriseQuest.completed}
                          onChange={() => setSurpriseQuest({ ...surpriseQuest, completed: !surpriseQuest.completed, progress: !surpriseQuest.completed ? 100 : 0 })}
                          disabled={supportsPartial}
                        />
                        <span className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
                          <div className="bg-black h-full" style={{ width: `${surpriseQuest.progress ?? (surpriseQuest.completed ? 100 : 0)}%` }}></div>
                        </span>
                        <span className="flex gap-1 ml-2">
                          {questStats.map((stat) => (
                            <span key={stat} className={`px-2 py-0.5 rounded text-xs text-white font-montserrat ${statColors[stat]}`}>{statLabels[stat]}</span>
                          ))}
                        </span>
                        {supportsPartial && (
                          <input type="number" min={0} max={100} step={5} value={surpriseQuest.progress ?? 0}
                            onChange={e => setSurpriseQuest({ ...surpriseQuest, progress: Math.max(0, Math.min(100, Number(e.target.value))), completed: Number(e.target.value) >= 100 })}
                            className="ml-2 w-16 px-1 py-0.5 rounded bg-dark-3 text-beige border border-dark-4 text-xs font-poppins"
                            title="Enter completion %"
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <button
                  className="px-4 py-2 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 mr-2 font-poppins"
                  onClick={handleAcceptSurprise}
                  disabled={!!acceptedSurpriseId}
                >Accept</button>
                <button
                  className="px-4 py-2 bg-red-500 rounded-lg text-white font-bold hover:bg-red-600 font-poppins"
                  onClick={handleDeclineSurprise}
                >Decline</button>
              </div>
            )}
            {acceptedSurpriseId && !surpriseQuest && (
              <div className="text-green-400 font-semibold mb-2 font-poppins">Surprise quest accepted for today!</div>
            )}
            {!surpriseQuest && !acceptedSurpriseId && (
              <div className="text-beige/60 text-xs mb-2 font-poppins">No surprise quests yet.</div>
            )}
          </div>
          {/* Extra Quests Section */}
          {extraDailyQuests.length > 0 && (
            <div className="mt-8">
              <h2 className={headingStyle + ' mb-2 font-montserrat'}>Added Quests</h2>
              {extraDailyQuests.map(q => (
                <div key={q.id} className="flex items-center gap-4 mb-2 bg-dark-3 rounded p-2 font-poppins">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={q.completed}
                    onChange={() => setExtraDailyQuests(prev => prev.map(quest => quest.id === q.id ? { ...quest, completed: !quest.completed, progress: !quest.completed ? 100 : 0 } : quest))}
                  />
                  <span className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
                    <div className="bg-black h-full" style={{ width: `${q.progress ?? (q.completed ? 100 : 0)}%` }}></div>
                  </span>
                  <span className="text-beige text-sm ml-2 font-montserrat">{q.title}</span>
                  <button className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded font-poppins" onClick={() => handleRemoveExtraQuest(q.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right: Add Quest + Negative Effects */}
        <div className="flex flex-col gap-4 font-poppins">
          <div className="bg-dark-2 rounded-lg p-4 shadow flex flex-col items-center justify-center h-1/2">
            <h2 className={headingStyle + ' mb-2 font-montserrat'}>Add Quests</h2>
            <button className="text-5xl text-gray-700 hover:scale-110 transition-transform font-poppins" onClick={() => setShowAddQuestModal(true)}>+</button>
          </div>
          <div className="bg-dark-2 rounded-lg p-4 shadow h-1/2">
            <h2 className={headingStyle + ' mb-2 font-montserrat'}>Negative Status Effects</h2>
            <ul className="text-sm text-red-600 list-disc ml-5 font-poppins">
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
        {/* AddQuestModal */}
        <AddQuestModal
          open={showAddQuestModal}
          onClose={() => setShowAddQuestModal(false)}
          allQuests={allQuests}
          onAdd={handleAddExtraQuest}
          addedQuestIds={extraDailyQuests.map(q => q.id)}
        />
      </div>
    </PageWrapper>
  );
};
