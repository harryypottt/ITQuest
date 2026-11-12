import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface QuestObjective {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface QuestProgressItem {
  questId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  xpReward: number;
  progress: number;
  total: number;
  objectives: QuestObjective[];
  status: "active" | "completed" | "available";
}

interface QuestProgressPanelProps {
  quests: QuestProgressItem[];
}

export default function QuestProgressPanel({
  quests,
}: QuestProgressPanelProps) {
 
  const activeQuests = quests || [];

  const totalObjectives = activeQuests.reduce(
    (sum: number, q: any) => sum + (q.total || 0),
    0,
  );
  const completedObjectives = activeQuests.reduce(
    (sum: number, q: any) => sum + (q.progress || 0),
    0,
  );
  const overallPct =
    totalObjectives > 0
      ? Math.round((completedObjectives / totalObjectives) * 100)
      : 0;

  // ... i-save at i-refresh

  const svgSize = 52;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="p-5 md:p-6 rounded-xl bg-quest-card border border-quest-border"
    >
      {/* Header with overall stats */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <i className="ri-treasure-map-line text-emerald-400 text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-quest-text">
              Quest Progress
            </h3>
            <p className="text-xs text-quest-textMuted">
              {activeQuests.length} active quest
              {activeQuests.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Overall completion ring */}
        <div className="flex items-center gap-3">
          <div className="relative w-[52px] h-[52px] flex items-center justify-center">
            <svg width={svgSize} height={svgSize} className="-rotate-90">
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-quest-bg"
              />
              <motion.circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={radius}
                fill="none"
                stroke="url(#questProgressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset:
                    circumference - (overallPct / 100) * circumference,
                }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="questProgressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-xs font-bold text-quest-text">
              {overallPct}%
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-quest-text">
              {completedObjectives}/{totalObjectives}
            </div>
            <div className="text-xs text-quest-textMuted">objectives</div>
          </div>
        </div>
      </div>

      {/* Individual quest progress bars */}
      <div className="space-y-3.5">
        {activeQuests.map((quest, idx) => {
          const pct = Math.round((quest.progress / quest.total) * 100);

          return (
            <motion.div
              key={quest.questId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + idx * 0.07 }}
            >
              <Link
                to={`/quests/${quest.questId}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-quest-bg hover:bg-quest-hover border border-transparent hover:border-quest-border transition-all group cursor-pointer block"
              >
                {/* Quest icon */}
                <div
                  className={`w-9 h-9 rounded-lg ${quest.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <i className={`${quest.icon} ${quest.color} text-base`} />
                </div>

                {/* Quest info + progress bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-quest-text group-hover:text-quest-primary transition-colors truncate">
                      {quest.title}
                    </span>
                    <span className="text-sm font-bold text-quest-text flex-shrink-0 ml-2">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-quest-dark overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.4 + idx * 0.1,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        quest.color === "text-emerald-400"
                          ? "from-emerald-600 to-emerald-400"
                          : quest.color === "text-cyan-400"
                            ? "from-cyan-600 to-cyan-400"
                            : quest.color === "text-amber-400"
                              ? "from-amber-600 to-amber-400"
                              : "from-emerald-600 to-emerald-400"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-quest-textMuted">
                      {quest.progress} of {quest.total} objectives
                    </span>
                    <span className="text-xs text-quest-gold">
                      +{quest.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="ri-arrow-right-s-line text-quest-textDim" />
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {activeQuests.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-3">
              <i className="ri-sword-line text-quest-textDim text-xl" />
            </div>
            <p className="text-sm text-quest-textMuted">No active quests</p>
            <Link
              to="/quests"
              className="inline-block mt-2 text-xs text-quest-primary hover:text-quest-primaryGlow transition-colors whitespace-nowrap cursor-pointer"
            >
              Browse quests
            </Link>
          </div>
        )}
      </div>

      {/* View all link */}
      {activeQuests.length > 0 && (
        <Link
          to="/quests"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-quest-textDim hover:text-quest-primary transition-colors py-2 rounded-lg hover:bg-quest-bg cursor-pointer"
        >
          <i className="ri-compass-3-line" />
          View All Quests
          <i className="ri-arrow-right-line" />
        </Link>
      )}
    </motion.div>
  );
}
