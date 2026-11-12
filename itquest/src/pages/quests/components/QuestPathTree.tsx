import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Quest, WorldRegion } from "@/sampleData/questExpandedData";
import {
  worldRegions,
  questTypeConfig,
  rarityConfig,
} from "@/sampleData/questExpandedData";

interface QuestPathTreeProps {
  region: WorldRegion;
  questProgressMap: Record<string, "not_started" | "active" | "completed">;
  completedObjectiveIdsMap: Record<string, string[]>;
  isRegionUnlocked: boolean;
  onAcceptQuest: (quest: Quest) => void;
  onViewQuest: (quest: Quest) => void;
  allQuests?: any[]; // Live database quests
}

export default function QuestPathTree({
  region,
  questProgressMap,
  completedObjectiveIdsMap,
  isRegionUnlocked,
  onAcceptQuest,
  onViewQuest,
  allQuests = [],
}: QuestPathTreeProps) {
  const navigate = useNavigate();
  const regionQuests = useMemo(() => {
    return allQuests.filter((q: any) => q.region === region.id);
  }, [allQuests, region.id]);

  // Separate quests by type
  const bossQuest = regionQuests.find((q: any) => q.type === "boss");
  const legendaryQuest = regionQuests.find((q: any) => q.type === "legendary");

  // Chain quests = learning quests (NOT boss, NOT legendary, NOT hidden)
  const chainQuests = regionQuests
    .filter(
      (q: any) => q.type !== "boss" && q.type !== "legendary" && !q.isHidden,
    )
    .sort((a: any, b: any) => (a.chainPosition || 0) - (b.chainPosition || 0));

  // Legendary only visible if boss is completed
  const isBossCompleted = bossQuest
    ? questProgressMap[bossQuest.id] === "completed"
    : false;
  const isLegendUnlocked = isBossCompleted && !!legendaryQuest;

  // Build the display list: chain → boss → [region cleared] → legendary
  type DisplayItem =
    | { type: "quest"; quest: Quest }
    | { type: "region-cleared" };
  const displayItems: DisplayItem[] = [
    ...chainQuests.map((q) => ({ type: "quest" as const, quest: q })),
  ];

  if (bossQuest) {
    displayItems.push({ type: "quest", quest: bossQuest });
  }

  if (isLegendUnlocked && legendaryQuest) {
    displayItems.push({ type: "region-cleared" });
    displayItems.push({ type: "quest", quest: legendaryQuest });
  }

  // Track if legendary just appeared (for reveal animation)
  const [legendaryJustRevealed, setLegendaryJustRevealed] = useState(false);
  const [prevBossCompleted, setPrevBossCompleted] = useState(isBossCompleted);

  useEffect(() => {
    if (isBossCompleted && !prevBossCompleted) {
      setLegendaryJustRevealed(true);
      const timer = setTimeout(() => setLegendaryJustRevealed(false), 3000);
      setPrevBossCompleted(true);
      return () => clearTimeout(timer);
    }
    setPrevBossCompleted(isBossCompleted);
  }, [isBossCompleted, prevBossCompleted]);

  return (
    <div className="rounded-2xl border border-quest-border bg-quest-card p-6 md:p-8">
      {/* Region header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-xl ${region.bgClass} border ${region.borderClass} flex items-center justify-center`}
          >
            <i className={`${region.icon} text-xl ${region.textClass}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-quest-text font-display tracking-wide">
              {region.name}
            </h2>
            <p className="text-sm text-quest-textDim">{region.subtitle}</p>
          </div>
          {!isRegionUnlocked && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-quest-bg border border-quest-border">
              <i className="ri-lock-line text-sm text-quest-textDim" />
              <span className="text-xs text-quest-textDim">Locked</span>
            </div>
          )}
          {isBossCompleted && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <i className="ri-check-double-line text-sm text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold whitespace-nowrap">
                Region Cleared
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-quest-textMuted leading-relaxed">
          {region.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {region.themes.map((theme) => (
            <span
              key={theme}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${region.bgClass} ${region.textClass} border ${region.borderClass}`}
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Quest path chain */}
      <div className="relative">
        {!isRegionUnlocked ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-quest-border/20 border border-quest-border flex items-center justify-center mx-auto mb-4">
              <i className="ri-lock-line text-2xl text-quest-textDim" />
            </div>
            <p className="text-sm text-quest-textMuted">
              Complete quests in prerequisite regions to unlock this realm.
            </p>
            <p className="text-xs text-quest-textDim mt-1">
              Required:{" "}
              {region.requiredRegionIds
                .map(
                  (rid) => worldRegions.find((r) => r.id === rid)?.name || rid,
                )
                .join(", ")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0">
            {displayItems.map((item, idx) => {
              if (item.type === "region-cleared") {
                const isRevealing = legendaryJustRevealed;
                return (
                  <div
                    key="region-cleared"
                    className="flex flex-col items-center w-full max-w-lg"
                  >
                    {/* Connector line to Region Cleared */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 40, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 150,
                      }}
                      className="w-1 rounded-full bg-gradient-to-b from-emerald-400 to-amber-400"
                      style={{ height: 40 }}
                    />
                    {/* REGION CLEARED banner */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: -20 }}
                      animate={
                        isRevealing
                          ? {
                              opacity: [0, 1, 1, 1],
                              scale: [0.3, 1.2, 1, 1],
                              y: [30, -10, 0, 0],
                            }
                          : { opacity: 1, scale: 1, y: 0 }
                      }
                      transition={
                        isRevealing
                          ? {
                              duration: 1.5,
                              times: [0, 0.4, 0.7, 1],
                              ease: "easeOut",
                            }
                          : { duration: 0.5 }
                      }
                      className="relative w-full py-4 px-6 my-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border border-amber-500/20 text-center overflow-hidden"
                    >
                      {/* Particle sparkles on reveal */}
                      {isRevealing && (
                        <>
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.8, 0] }}
                            transition={{ duration: 2, delay: 0.3 }}
                          >
                            {Array.from({ length: 12 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
                                initial={{
                                  left: "50%",
                                  top: "50%",
                                  opacity: 1,
                                  scale: 0,
                                }}
                                animate={{
                                  left: `${30 + Math.random() * 40}%`,
                                  top: `${10 + Math.random() * 80}%`,
                                  opacity: 0,
                                  scale: [0, 1.5, 0],
                                }}
                                transition={{
                                  duration: 1.5 + Math.random(),
                                  delay: 0.3 + Math.random() * 0.5,
                                  ease: "easeOut",
                                }}
                              />
                            ))}
                          </motion.div>
                        </>
                      )}
                      {/* Crown icon */}
                      <motion.div
                        animate={
                          isRevealing
                            ? {
                                rotate: [0, -10, 10, -5, 5, 0],
                                scale: [0.5, 1.3, 1],
                              }
                            : {}
                        }
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex items-center justify-center gap-1 mb-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                          <i className="ri-vip-crown-line text-amber-400" />
                        </div>
                      </motion.div>
                      <motion.p
                        animate={isRevealing ? { opacity: [0, 1] } : {}}
                        transition={{ delay: 0.5 }}
                        className="text-sm font-bold text-amber-400 uppercase tracking-widest"
                      >
                        {region.name} Cleared
                      </motion.p>
                      <motion.p
                        animate={isRevealing ? { opacity: [0, 1] } : {}}
                        transition={{ delay: 0.7 }}
                        className="text-xs text-amber-400/60 mt-1"
                      >
                        <i className="ri-star-smile-line mr-1" />
                        Legendary Quest Unlocked
                      </motion.p>
                      {/* Glowing line decorations */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-3 bg-gradient-to-b from-transparent to-amber-500/40" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-3 bg-gradient-to-t from-transparent to-amber-500/40" />
                    </motion.div>
                    {/* Connector line from Region Cleared to Legendary */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 36, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-400"
                      style={{ height: 36 }}
                    />
                  </div>
                );
              }

              // --- Quest node rendering ---
              const quest = item.quest;
              const isBoss = quest.type === "boss";
              const isLegendary = quest.type === "legendary";
              const isChainQuest = !isBoss && !isLegendary;

              // Find the index in the chain-only list for locking logic
              const chainIdx = isChainQuest
                ? chainQuests.findIndex((q) => q.id === quest.id)
                : -1;

              // 1. STRICT SEQUENTIAL LOCKING RULES
              let isLocked = false;

              // Chain quest locking: locked kung hindi pa "completed" ang sinusundang quest
              if (isChainQuest && chainIdx > 0) {
                const prevChainQuest = chainQuests[chainIdx - 1];
                const prevStatus = questProgressMap[prevChainQuest.id];
                isLocked = prevStatus !== "completed";
              }

              // Boss quest locking: locked hangga't hindi tapos LAHAT ng chain quests
              if (isBoss) {
                const allChainCompleted = chainQuests.every(
                  (cq) => questProgressMap[cq.id] === "completed"
                );
                isLocked = !allChainCompleted;
              }

              // Legendary quest locking: locked kung hindi pa cleared ang Boss
              if (isLegendary) {
                isLocked = !isBossCompleted;
              }

              // 2. FORCE STATUS TO NOT_STARTED IF LOCKED
              const rawStatus = questProgressMap[quest.id] || "not_started";
              const status = isLocked ? "not_started" : rawStatus;

              const isCompleted = status === "completed";
              const isActive = status === "active";

              // 3. ZERO PROGRESS OVERRIDE FOR LOCKED OR UNACCEPTED QUESTS
              const completedIds =
                !isLocked && (isActive || isCompleted)
                  ? completedObjectiveIdsMap[quest.id] || []
                  : [];

              const progressPercent =
                !isLocked && (isActive || isCompleted) && quest.objectives?.length > 0
                  ? isCompleted
                    ? 100
                    : Math.round((completedIds.length / quest.objectives.length) * 100)
                  : 0;

              const isFirst = isChainQuest && chainIdx === 0;
              const typeCfg = questTypeConfig[quest.type];

              // Check if newly visible
              let isNewlyVisible = false;
              if (isChainQuest && chainIdx > 0 && !isLocked) {
                const prevChainQuest = chainQuests[chainIdx - 1];
                isNewlyVisible =
                  questProgressMap[prevChainQuest.id] === "completed" &&
                  status === "not_started";
              }

              const isLegendaryRevealing = isLegendary && legendaryJustRevealed;

              return (
                <div
                  key={quest.id}
                  className="flex flex-col items-center w-full max-w-lg"
                >
                  {/* Connector line from previous item */}
                  {!isFirst && !isLegendary && (
                    <div className="flex flex-col items-center w-full">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: isLocked ? 20 : 48,
                          opacity: isLocked ? 0.2 : 1,
                        }}
                        transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                        className={`w-1 rounded-full ${
                          isCompleted || isActive
                            ? "bg-gradient-to-b from-emerald-500 to-emerald-400"
                            : "bg-quest-border"
                        }`}
                        style={{ height: 48 }}
                      />
                      {/* Animated pulsing dot on active paths */}
                      {isActive && !isCompleted && (
                        <div className="relative -mt-6 mb-1">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400">
                            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quest Node */}
                  <AnimatePresence mode="wait">
                    {isLegendaryRevealing ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, y: -30, rotateX: 45 }}
                        animate={{
                          opacity: [0, 1, 1],
                          scale: [0, 1.15, 1],
                          y: [30, -5, 0],
                          rotateX: [45, 0, 0],
                        }}
                        transition={{
                          duration: 1.2,
                          times: [0, 0.5, 1],
                          type: "spring",
                          stiffness: 150,
                          damping: 12,
                          delay: 0.8,
                        }}
                        className="w-full"
                      >
                        <div className="relative">
                          {/* Legendary reveal glow burst */}
                          <motion.div
                            className="absolute -inset-4 rounded-2xl pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.6, 0],
                              scale: [0.5, 1.3, 1.8],
                            }}
                            transition={{
                              duration: 1.8,
                              delay: 0.8,
                              times: [0, 0.3, 1],
                            }}
                            style={{
                              background:
                                "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)",
                            }}
                          />
                          <QuestNode
                            quest={quest}
                            status={status}
                            progressPercent={progressPercent}
                            completedCount={completedIds.length}
                            totalCount={quest.objectives.length}
                            isLocked={isLocked}
                            isBoss={isBoss}
                            isLegendary={isLegendary}
                            typeCfg={typeCfg}
                            onAccept={() => onAcceptQuest(quest)}
                            onView={() => onViewQuest(quest)}
                            regionColor={region.color}
                          />
                        </div>
                      </motion.div>
                    ) : isNewlyVisible ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                          delay: 0.3,
                        }}
                        className="w-full"
                      >
                        <QuestNode
                          quest={quest}
                          status={status}
                          progressPercent={progressPercent}
                          completedCount={completedIds.length}
                          totalCount={quest.objectives.length}
                          isLocked={isLocked}
                          isBoss={isBoss}
                          isLegendary={isLegendary}
                          typeCfg={typeCfg}
                          onAccept={() => onAcceptQuest(quest)}
                          onView={() => onViewQuest(quest)}
                          regionColor={region.color}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="w-full"
                      >
                        <QuestNode
                          quest={quest}
                          status={status}
                          progressPercent={progressPercent}
                          completedCount={completedIds.length}
                          totalCount={quest.objectives.length}
                          isLocked={isLocked}
                          isBoss={isBoss}
                          isLegendary={isLegendary}
                          typeCfg={typeCfg}
                          onAccept={() => onAcceptQuest(quest)}
                          onView={() => onViewQuest(quest)}
                          regionColor={region.color}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Legendary locked placeholder */}
            {!isLegendUnlocked && legendaryQuest && isRegionUnlocked && (
              <div className="flex flex-col items-center w-full max-w-lg mt-4">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-quest-border/40 to-transparent" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="w-full p-4 rounded-xl border border-dashed border-quest-border/30 bg-quest-bg/20 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <i className="ri-lock-line text-quest-textDim text-sm" />
                    <span className="text-xs text-quest-textDim italic">
                      Complete the Boss Quest to unlock a Legendary challenge...
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// QUEST NODE COMPONENT
// ============================================================
interface QuestNodeProps {
  quest: Quest;
  status: "not_started" | "active" | "completed";
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  isLocked: boolean;
  isBoss: boolean;
  isLegendary: boolean;
  typeCfg: {
    label: string;
    icon: string;
    color: string;
    bg: string;
    border: string;
  };
  onAccept: () => void;
  onView: () => void;
  regionColor: string;
}

function QuestNode({
  quest,
  status,
  progressPercent,
  completedCount,
  totalCount,
  isLocked,
  isBoss,
  isLegendary,
  typeCfg,
  onAccept,
  onView,
  regionColor,
}: QuestNodeProps) {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      className={`relative rounded-xl border transition-all ${
        isLocked
          ? "border-quest-border/30 bg-quest-bg/30 opacity-40 cursor-not-allowed"
          : isCompleted
            ? isLegendary
              ? "border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-quest-card to-amber-500/5 cursor-pointer"
              : "border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-quest-card cursor-pointer"
            : isActive
              ? `${typeCfg.border} ${typeCfg.bg} cursor-pointer`
              : isLegendary
                ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-quest-card to-quest-card cursor-pointer"
                : "border-quest-border bg-quest-card hover:border-quest-textDim/40 cursor-pointer"
      } ${
        isBoss && !isLocked
          ? "p-5 ring-1 ring-rose-500/20"
          : isLegendary && !isLocked
            ? "p-5 ring-1 ring-amber-500/30"
            : "p-4"
      }`}
      onClick={() => {
        if (isLocked) return;
        if (isActive || isCompleted) onView();
        else onAccept();
      }}
    >
      {/* Boss flame border */}
      {isBoss && !isLocked && !isCompleted && (
        <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 -z-10 blur-sm" />
      )}
      {/* Legendary shimmer border */}
      {isLegendary && !isLocked && !isCompleted && (
        <>
          <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-amber-400/30 via-yellow-400/20 to-amber-400/30 -z-10 blur-sm" />
          <motion.div
            className="absolute -inset-[1px] rounded-xl pointer-events-none"
            animate={{
              background: [
                "linear-gradient(105deg, transparent 30%, rgba(245,158,11,0.15) 45%, rgba(245,158,11,0.25) 50%, rgba(245,158,11,0.15) 55%, transparent 70%)",
                "linear-gradient(105deg, transparent 30%, rgba(245,158,11,0.25) 45%, rgba(245,158,11,0.15) 50%, rgba(245,158,11,0.25) 55%, transparent 70%)",
                "linear-gradient(105deg, transparent 30%, rgba(245,158,11,0.15) 45%, rgba(245,158,11,0.25) 50%, rgba(245,158,11,0.15) 55%, transparent 70%)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-quest-card/30 z-10">
          <i className="ri-lock-line text-xl text-quest-textDim" />
        </div>
      )}
      <div className="flex items-start gap-4">
        {/* Quest icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? isLegendary
                ? "bg-amber-500/20 border-2 border-amber-500/40"
                : "bg-emerald-500/20 border-2 border-emerald-500/30"
              : isActive
                ? `${typeCfg.bg} border ${typeCfg.border}`
                : isLegendary
                  ? "bg-amber-500/10 border border-amber-500/30"
                  : "bg-quest-bg border border-quest-border"
          }`}
        >
          {isCompleted ? (
            <i
              className={`ri-check-double-line text-xl ${isLegendary ? "text-amber-400" : "text-emerald-400"}`}
            />
          ) : (
            <i
              className={`${quest.icon} text-xl ${isActive ? typeCfg.color : isLegendary ? "text-amber-400" : "text-quest-textDim"}`}
            />
          )}
        </div>
        {/* Quest info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.color}`}
            >
              {typeCfg.label}
            </span>
            {isBoss && !isLocked && (
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 whitespace-nowrap">
                <i className="ri-sword-line mr-0.5" />
                REGION BOSS
              </span>
            )}
            {isLegendary && !isLocked && (
              <span className="text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap">
                <i className="ri-star-smile-line mr-0.5 text-amber-400" />
                LEGENDARY
              </span>
            )}
          </div>
          <h3
            className={`text-base font-bold mb-1 ${
              isCompleted
                ? isLegendary
                  ? "text-amber-400"
                  : "text-emerald-400"
                : isActive
                  ? "text-quest-text"
                  : isLegendary
                    ? "text-amber-300"
                    : "text-quest-textMuted"
            }`}
          >
            {quest.title}
          </h3>
          <p className="text-xs text-quest-textDim line-clamp-1">
            {quest.description}
          </p>
        </div>
        {/* Actions */}
        <div className="flex-shrink-0">
          {isCompleted ? (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                isLegendary
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20"
              }`}
            >
              <i
                className={`ri-check-double-line ${isLegendary ? "text-amber-400" : "text-emerald-400"}`}
              />
            </div>
          ) : isActive ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center">
                <span className="text-sm font-bold text-quest-text">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <span className="text-xs text-quest-textDim">
                {completedCount}/{totalCount}
              </span>
            </div>
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                isLegendary
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-quest-bg border-quest-border"
              }`}
            >
              <i
                className={`ri-play-line text-lg ${isLegendary ? "text-amber-400" : "text-quest-textDim"}`}
              />
            </div>
          )}
        </div>
      </div>
      {/* Progress bar for active quests */}
      {isActive && !isCompleted && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className={`h-full rounded-full ${
                isLegendary
                  ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"
                  : isBoss
                    ? "bg-gradient-to-r from-rose-500 to-amber-500"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-400"
              }`}
            />
          </div>
        </div>
      )}
      {/* Rewards hint */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <i
            className={`ri-flashlight-line text-xs ${isLegendary ? "text-yellow-400" : "text-amber-400"}`}
          />
          <span
            className={`text-xs font-bold ${isLegendary ? "text-yellow-400" : "text-amber-400"}`}
          >
            +{quest.xpReward} XP
          </span>
        </div>
        {quest.badgeReward && (
          <div className="flex items-center gap-1.5">
            <i className="ri-medal-line text-xs text-quest-textDim" />
            <span
              className={`text-xs ${
                quest.badgeReward.rarity === "Legendary"
                  ? "text-orange-400"
                  : quest.badgeReward.rarity === "Epic"
                    ? "text-fuchsia-400"
                    : "text-quest-textDim"
              }`}
            >
              {quest.badgeReward.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}