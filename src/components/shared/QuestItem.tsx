// ==== CoPilot Code START ====
import React from "react";
import {
  statLabels,
  statColors,
  statMap,
  difficultyColors,
} from "../../assets/statConfig";
import type { Quest } from "../../assets/types";

export type QuestItemMode = "select" | "card" | "kpi";

interface QuestItemProps {
  quest: Quest & { completed?: boolean; progress?: number };
  mode?: QuestItemMode;
  onSelect?: (id: string) => void;
  onToggle?: (id: string) => void;
  showStats?: boolean;
  showActions?: boolean;
  className?: string;
}

export const QuestItem: React.FC<QuestItemProps> = ({
  quest,
  mode = "card",
  onSelect,
  onToggle,
  showStats = true,
  showActions = true,
  className = "",
}) => {
  // Card/KPI/Selectable rendering
  const isCompleted = !!quest.completed;
  const progress =
    typeof quest.progress === "number" ? quest.progress : isCompleted ? 100 : 0;

  return (
    <div
      className={`bg-dark-2 rounded p-3 flex flex-col gap-1 shadow ${className}`}
      style={{
        ...(mode === "kpi" ? { minWidth: 120, alignItems: "center" } : {}),
        outline: "1.5px solid #23272f",
        outlineOffset: "0px",
      }}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-beige text-base md:text-lg font-montserrat">
          {quest.title}
        </span>
        {mode === "select" && showActions && (
          <input type="checkbox" checked={isCompleted} onChange={() => onToggle?.(quest.id)} className="w-5 h-5 cursor-pointer accent-green-600" />
        )}
        {mode === "card" && showActions && (
          <button className={`text-xs px-2 py-1 rounded ${ isCompleted ? "bg-gray-600 text-white" : "bg-blue-600 text-white"}`}
            onClick={() => onToggle?.(quest.id)} disabled={isCompleted} >
            {isCompleted ? "Done" : "Mark Done"}
          </button>
        )}
      </div>
      <div className="text-xs text-gray-300 mb-1">{quest.description}</div>
      {showStats && quest.stats && (
        <div className="flex justify-between flex-wrap">
            <div className="flex gap-2">
                {quest.stats.map((s) => {
                    // Use statMap to normalize s to a valid stat key
                    const mappedKey = statMap[s.toUpperCase()] || s.toLowerCase();
                    const colorClass = statColors[mappedKey as keyof typeof statColors];
                    return (
                    <span key={s} className={`text-xs px-2 py-0.5 rounded border border-opacity-30 border-gray-700 font-semibold shadow-sm ${colorClass}`}
                        style={{ color: "#fff", letterSpacing: "0.02em"}}>
                        {statLabels[mappedKey as keyof typeof statLabels] || s}
                    </span>
                    );
                })}
                {typeof quest.xp === "number" && (
                    <div className="flex items-center text-center text-xs bg-blue-900 px-1 rounded">
                    +{quest.xp} XP
                    </div>
                )}
            </div>
            {quest.difficulty && (
                <span className={`text-xs px-2 py-0.5 rounded font-bold border border-opacity-40 border-gray-800 tracking-wide ${
                    difficultyColors[quest.difficulty.toLowerCase()] || "bg-gray-700" }`}
                style={{ color: "#fff", textTransform: "capitalize", boxShadow: "0 1px 4px 0 #0002", }}
                >
                {quest.difficulty}
                </span>
            )}
        </div>
      )}
      {mode === "kpi" && (
        <div className="flex flex-col items-center mt-2">
          <span className="text-2xl font-bold text-green-400">{progress}%</span>
          <span className="text-xs text-gray-400">Progress</span>
        </div>
      )}
    </div>
  );
};
// ==== CoPilot Code END ====
