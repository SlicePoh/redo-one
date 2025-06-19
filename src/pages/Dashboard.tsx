import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const Dashboard = () => {
  const dashRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      dashRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, { scope: dashRef });

  return (
    <div ref={dashRef} className="p-4 grid gap-4 grid-cols-1 md:grid-cols-3">
      
      {/* Left: Daily Quests */}
      <div className="col-span-2 bg-gray-700 rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Daily Quests</h2>
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <input type="checkbox" className="w-5 h-5" />
            <span className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
              <div className="bg-black h-full w-[60%]"></div> {/* simulate progress */}
            </span>
          </div>
        ))}
      </div>

      {/* Right: Add Quest + Negative Effects */}
      <div className="flex flex-col gap-4">
        <div className="bg-gray-700 rounded-lg p-4 shadow flex flex-col items-center justify-center h-1/2">
          <h2 className="text-lg font-semibold mb-2">Add Quests</h2>
          <button className="text-5xl text-gray-700 hover:scale-110 transition-transform">+</button>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 shadow h-1/2">
          <h2 className="text-lg font-semibold mb-2">Negative Status Effects</h2>
          <ul className="text-sm text-red-600 list-disc ml-5">
            <li>Gooning -5 XP</li>
            <li>Skipped Workout -10 XP</li>
          </ul>
        </div>
      </div>

      {/* Bottom: Placeholder Panels */}
      <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-700 rounded-lg h-24 shadow"></div>
        <div className="bg-gray-700 rounded-lg h-24 shadow"></div>
      </div>
    </div>
  );
};
