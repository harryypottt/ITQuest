import { motion } from 'framer-motion';
import {
  masteryPaths,
  masteryLevels,
  getMasteryLevel,
  worldRegions,
  getRegionProgress,
} from '@/sampleData/questData';
interface MasteryPanelProps {
  completedQuestIds: string[];
  userXp: number;
  onSelectRegion: (regionId: string) => void;
}

export default function MasteryPanel({ completedQuestIds, userXp, onSelectRegion }: MasteryPanelProps) {
  return (
    <div className="rounded-2xl border border-quest-border bg-quest-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <i className="ri-line-chart-line text-lg text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-quest-text font-display tracking-wide">MASTERY PATHS</h2>
          <p className="text-xs text-quest-textDim">Your specialization journey across the realms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {masteryPaths.map((path) => {
          const currentLevel = getMasteryLevel(path.id, completedQuestIds, userXp);
          const region = (worldRegions || []).find((r) => r?.id === path.regionId);
          const nextLevel = path.levels.find((l) => {
            const questsDone = l.requiredQuests.every((qid) => completedQuestIds.includes(qid));
            const xpMet = userXp >= l.xpThreshold;
            return !(questsDone && xpMet);
          });

          return (
            <motion.button
              key={path.id}
              onClick={() => onSelectRegion(path.regionId)}
              whileHover={{ y: -2 }}
              className={`text-left rounded-xl border p-4 transition-all cursor-pointer hover:shadow-lg group ${
                currentLevel
                  ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-quest-card'
                  : 'border-quest-border bg-quest-card hover:border-quest-textDim/40'
              }`}
              style={currentLevel ? { boxShadow: `0 0 20px ${path.color}15` } : undefined}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${path.color}15`,
                    borderColor: `${path.color}30`,
                  }}
                >
                  <i className={`${path.icon} text-lg`} style={{ color: path.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-quest-text">{path.name}</h3>
                  <p className="text-xs text-quest-textDim">{region?.name || ''}</p>
                </div>
                {currentLevel && (
                  <div
                    className="px-2.5 py-1 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: `${path.color}15`,
                      borderColor: `${path.color}30`,
                      color: path.color,
                    }}
                  >
                    Lv.{currentLevel.level}
                  </div>
                )}
              </div>

              {/* Level progress dots */}
              <div className="flex items-center gap-2 mb-3">
                {path.levels.map((level, idx) => {
                  const isAchieved = currentLevel && level.level <= currentLevel.level;
                  const isCurrent = currentLevel && level.level === currentLevel.level;

                  return (
                    <div key={level.level} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isAchieved
                              ? 'text-white'
                              : 'text-quest-textDim bg-quest-bg border border-quest-border'
                          } ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-quest-card' : ''}`}
                          style={
                            isAchieved
                              ? {
                                  background: `linear-gradient(135deg, ${path.color}, ${path.color}88)`,
                                  ...(isCurrent ? { ringColor: path.color } : {}),
                                }
                              : undefined
                          }
                        >
                          {isAchieved ? (
                            <i className="ri-check-line text-sm" />
                          ) : (
                            level.level
                          )}
                        </div>
                        <span className={`text-[10px] mt-1 text-center leading-tight ${isCurrent ? 'font-bold' : ''}`} style={{ color: isCurrent ? path.color : '#64748b' }}>
                          {level.title}
                        </span>
                      </div>
                      {idx < path.levels.length - 1 && (
                        <div className="flex-1 h-0.5 rounded-full bg-quest-border mb-4">
                          {isAchieved && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.5, delay: 0.1 * idx }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: path.color }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Current status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-quest-textDim">
                  {currentLevel
                    ? `${currentLevel.title} — ${currentLevel.badgeName}`
                    : 'Begin your journey in this path'}
                </span>
                {nextLevel && (
                  <span className="text-xs text-quest-textDim">
                    Next: {nextLevel.title} ({nextLevel.xpThreshold} XP)
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}