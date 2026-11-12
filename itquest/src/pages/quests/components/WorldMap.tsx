import { motion } from "framer-motion";
import type { WorldRegion, Quest } from "@/sampleData/questData";
import { worldRegions } from "@/sampleData/questData";

interface WorldMapProps {
  completedQuestIds: string[];
  unlockedRegionIds: string[];
  onSelectRegion: (region: WorldRegion) => void;
  allQuests?: any[]; // Live Database Quests
}

// SVG path data for region connectors (7 regions)
const connectorPaths: { from: string; to: string; d: string }[] = [
  {
    from: "frontend-kingdom",
    to: "server-citadel",
    d: "M 540 120 Q 540 220 360 240",
  },
  {
    from: "frontend-kingdom",
    to: "design-sanctum",
    d: "M 540 120 Q 640 160 720 200",
  },
  {
    from: "server-citadel",
    to: "data-vault",
    d: "M 360 320 Q 360 420 360 500",
  },
  {
    from: "server-citadel",
    to: "cyber-fortress",
    d: "M 440 320 Q 600 340 680 380",
  },
  {
    from: "cyber-fortress",
    to: "networking-nexus",
    d: "M 720 380 Q 760 440 680 520",
  },
  {
    from: "frontend-kingdom",
    to: "fullstack-forge",
    d: "M 480 200 Q 540 280 540 380",
  },
  {
    from: "server-citadel",
    to: "fullstack-forge",
    d: "M 440 320 Q 480 360 480 440",
  },
  {
    from: "data-vault",
    to: "fullstack-forge",
    d: "M 420 560 Q 480 500 540 440",
  },
];

// Dynamic calculation ng region progress mula sa Database Quests
function getDynamicRegionProgress(
  regionId: string,
  completedQuestIds: string[],
  allQuests: Quest[] = [],
) {
  const region = worldRegions.find((r) => r.id === regionId);
  if (!region)
    return { completed: 0, total: 0, percentage: 0, bossCompleted: false };

  // Hanapin ang quests sa DB na para sa region na ito
  const regionQuests = allQuests.filter(
    (q: any) =>
      q.region === regionId ||
      (region.questIds && region.questIds.includes(q.id)),
  );

  // Kung may DB quests, gamitin ang totoong count. Kung loading pa, fallback muna.
  const total =
    regionQuests.length > 0
      ? regionQuests.length
      : region.questIds?.length || 0;
  const completed = regionQuests.filter((q) =>
    completedQuestIds.includes(q.id),
  ).length;
  const bossCompleted = completedQuestIds.includes(region.bossQuestId);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage, bossCompleted };
}

function getConnectorOpacity(
  fromId: string,
  toId: string,
  unlockedIds: string[],
  completedIds: string[],
  allQuests: Quest[] = [],
): number {
  const bothAvailable =
    unlockedIds.includes(fromId) && unlockedIds.includes(toId);
  if (!bothAvailable) return 0.15;
  const fromCompleted =
    getDynamicRegionProgress(fromId, completedIds, allQuests).percentage ===
    100;
  const toCompleted =
    getDynamicRegionProgress(toId, completedIds, allQuests).percentage === 100;
  if (fromCompleted && toCompleted) return 1;
  if (fromCompleted) return 0.6;
  return 0.4;
}

export default function WorldMap({
  completedQuestIds,
  unlockedRegionIds,
  onSelectRegion,
  allQuests = [],
}: WorldMapProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-quest-border bg-gradient-to-br from-quest-card via-quest-card to-quest-bg p-6 md:p-8">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Title */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <i className="ri-global-line text-lg text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-quest-text font-display tracking-wide">
              WORLD MAP
            </h2>
            <p className="text-xs text-quest-textDim">
              Explore 7 realms, conquer quests, unlock new territories
            </p>
          </div>
        </div>
      </div>

      {/* SVG Connectors overlay */}
      <div className="relative w-full" style={{ minHeight: "560px" }}>
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {connectorPaths.map((conn) => {
            const opacity = getConnectorOpacity(
              conn.from,
              conn.to,
              unlockedRegionIds,
              completedQuestIds,
              allQuests,
            );
            const fromCompleted =
              getDynamicRegionProgress(conn.from, completedQuestIds, allQuests)
                .percentage === 100;
            return (
              <g key={`${conn.from}-${conn.to}`}>
                <path
                  d={conn.d}
                  fill="none"
                  stroke={fromCompleted ? "#10b981" : "#3a3a4a"}
                  strokeWidth={fromCompleted ? 3 : 2}
                  strokeDasharray={fromCompleted ? "0" : "6 4"}
                  opacity={opacity}
                  strokeLinecap="round"
                />
                {fromCompleted && (
                  <circle r="4" fill="#34d399" opacity="0.8">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={conn.d}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Region Nodes */}
        <div className="relative grid grid-cols-3 gap-4" style={{ zIndex: 2 }}>
          <div />
          <div className="col-start-2">
            <RegionNode
              region={worldRegions.find((r) => r.id === "frontend-kingdom")!}
              progress={getDynamicRegionProgress(
                "frontend-kingdom",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("frontend-kingdom")}
              onClick={() =>
                onSelectRegion(
                  worldRegions.find((r) => r.id === "frontend-kingdom")!,
                )
              }
              isStarting
            />
          </div>
          <div className="mt-16">
            <RegionNode
              region={worldRegions.find((r) => r.id === "design-sanctum")!}
              progress={getDynamicRegionProgress(
                "design-sanctum",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("design-sanctum")}
              onClick={() =>
                onSelectRegion(
                  worldRegions.find((r) => r.id === "design-sanctum")!,
                )
              }
            />
          </div>

          <div className="mt-6">
            <RegionNode
              region={worldRegions.find((r) => r.id === "server-citadel")!}
              progress={getDynamicRegionProgress(
                "server-citadel",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("server-citadel")}
              onClick={() =>
                onSelectRegion(
                  worldRegions.find((r) => r.id === "server-citadel")!,
                )
              }
            />
          </div>
          <div className="mt-6">
            <RegionNode
              region={worldRegions.find((r) => r.id === "fullstack-forge")!}
              progress={getDynamicRegionProgress(
                "fullstack-forge",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("fullstack-forge")}
              onClick={() =>
                onSelectRegion(
                  worldRegions.find((r) => r.id === "fullstack-forge")!,
                )
              }
              isSpecial
            />
          </div>
          <div className="mt-6">
            <RegionNode
              region={worldRegions.find((r) => r.id === "cyber-fortress")!}
              progress={getDynamicRegionProgress(
                "cyber-fortress",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("cyber-fortress")}
              onClick={() =>
                onSelectRegion(
                  worldRegions.find((r) => r.id === "cyber-fortress")!,
                )
              }
            />
          </div>

          <div className="mt-8">
            <RegionNode
              region={worldRegions.find((r) => r.id === "data-vault")!}
              progress={getDynamicRegionProgress(
                "data-vault",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("data-vault")}
              onClick={() =>
                onSelectRegion(worldRegions.find((r) => r.id === "data-vault")!)
              }
            />
          </div>
          <div />
          <div className="mt-8">
            <RegionNode
              region={worldRegions.find((r) => r.id === "networking-nexus")!}
              progress={getDynamicRegionProgress(
                "networking-nexus",
                completedQuestIds,
                allQuests,
              )}
              isUnlocked={unlockedRegionIds.includes("networking-nexus")}
              onClick={() =>
                onSelectRegion(
                  worldRegions.find((r) => r.id === "networking-nexus")!,
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="relative mt-6 flex items-center justify-center gap-6 text-xs text-quest-textDim">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-quest-border" />
          Locked
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          In Progress
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Conquered
        </div>
      </div>
    </div>
  );
}

interface RegionNodeProps {
  region: WorldRegion;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    bossCompleted: boolean;
  };
  isUnlocked: boolean;
  onClick: () => void;
  isSpecial?: boolean;
  isStarting?: boolean;
}

function RegionNode({
  region,
  progress,
  isUnlocked,
  onClick,
  isSpecial,
  isStarting,
}: RegionNodeProps) {
  // 1. Guard check sa region
  if (!region) return null;

  // 2. Safe check sa progress (gamitan ng optional chaining ?.)
  const isCompleted = progress?.percentage === 100;

  return (
    <motion.button
      onClick={isUnlocked ? onClick : undefined}
      whileHover={isUnlocked ? { scale: 1.05, y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-full rounded-2xl p-4 transition-all cursor-pointer border ${
        !isUnlocked
          ? "border-quest-border/50 bg-quest-bg/50 opacity-50 cursor-not-allowed"
          : isCompleted
            ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-quest-card"
            : `${region?.borderClass || "border-quest-border"} ${region?.bgClass || "bg-quest-card"} hover:shadow-lg ${region?.glowClass || ""}`
      } ${isSpecial ? "ring-1 ring-amber-500/20" : ""} ${isStarting ? "ring-1 ring-emerald-500/20" : ""}`}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-quest-card/60 z-10">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-quest-border/30 border border-quest-border flex items-center justify-center mx-auto mb-2">
              <i className="ri-lock-line text-lg text-quest-textDim" />
            </div>
            <span className="text-xs text-quest-textDim">Locked</span>
          </div>
        </div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-quest-card flex items-center justify-center z-20"
        >
          <i className="ri-vip-crown-line text-sm text-white" />
        </motion.div>
      )}

      {isStarting && !isCompleted && (
        <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 z-20">
          START
        </div>
      )}

      <div className="flex items-center gap-3 mb-3 relative z-[1]">
        <div
          className={`w-10 h-10 rounded-xl ${region?.bgClass || "bg-quest-card"} border ${region?.borderClass || "border-quest-border"} flex items-center justify-center ${isUnlocked ? "" : "opacity-50"}`}
        >
          <i
            className={`${region?.icon || "ri-map-pin-line"} text-lg ${region?.textClass || "text-quest-text"}`}
          />
        </div>
        <div className="text-left min-w-0">
          <h3
            className={`text-sm font-bold truncate ${isUnlocked ? "text-quest-text" : "text-quest-textDim"}`}
          >
            {region?.name || "Unknown Realm"}
          </h3>
          <p className="text-xs text-quest-textDim truncate">
            {region?.subtitle || ""}
          </p>
        </div>
      </div>
      {isUnlocked && (
        <div className="relative z-[1]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-quest-textDim">Progress</span>
            <span
              className={
                isCompleted
                  ? "text-amber-400 font-bold"
                  : "text-quest-textMuted"
              }
            >
              {progress.completed}/{progress.total}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-full"
              style={{
                background: isCompleted
                  ? "linear-gradient(90deg, #f59e0b, #eab308)"
                  : `linear-gradient(90deg, ${region.color}, ${region.color}88)`,
              }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
}
