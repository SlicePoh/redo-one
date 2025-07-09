import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import styles from '../assets/style';
import { PageWrapper } from '../components/shared/PageWrapper';
import type { Quest } from '../assets/types';
import { QuestItem } from '../components/shared/QuestItem';

export const QuestLog = () => {
  const quests = useSelector((state: RootState) => state.quests);
  const headingStyle = styles.flexBetween + ' text-lg font-semibold';

  return (
    <PageWrapper>
      <div className={styles.hero + ' p-4'}>
        <h2 className={headingStyle + ' mb-4'}>Quest Log</h2>
        {quests.length === 0 && <div className="text-beige">No quests found.</div>}
        <div className="grid gap-4 md:grid-cols-4">
          {quests.map((q: Quest) => (
            <QuestItem
              key={q.id}
              quest={q}
              mode="card"
              showStats={true}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
