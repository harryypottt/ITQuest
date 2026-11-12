import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import {
  worldRegions,
  getUnlockedQuestIds,
  getRegionProgress,
  type Quest,
  type WorldRegion,
} from "@/sampleData/questData";
import { useQuestProgressEngine, markQuestAccepted } from "@/hooks/useQuestProgressEngine";
import WorldMap from "./components/WorldMap";
import QuestPathTree from "./components/QuestPathTree";
import MasteryPanel from "./components/MasteryPanel";
import SmartContinueButton from "./components/SmartContinueButton";
import EpicCompletionModal from "./components/EpicCompletionModal";
import QuestCard from "./components/QuestCard";
import QuestDetailPanel from "./components/QuestDetail";
import AcceptModal from "./components/AcceptModal";
import InstructorFacultyQuests from "./components/InstructorFacultyQuests";
import { startQuest as startQuestApi } from "@/services/api";

type HubTab =
  | "world-map"
  | "quest-paths"
  | "faculty-quests"
  | "active-quests"
  | "daily-weekly";

const hubTabs: { value: HubTab; label: string; icon: string }[] = [
  { value: "world-map", label: "World Map", icon: "ri-global-line" },
  { value: "quest-paths", label: "Quest Paths", icon: "ri-git-branch-line" },
  {
    value: "faculty-quests",
    label: "Faculty Quests",
    icon: "ri-graduation-cap-line",
  },
  { value: "active-quests", label: "Active Quests", icon: "ri-sword-line" },
  {
    value: "daily-weekly",
    label: "Daily/Weekly",
    icon: "ri-calendar-check-line",
  },
];

export default function QuestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HubTab>("world-map");
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion | null>(
    null,
  );
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [acceptQuest, setAcceptQuest] = useState<Quest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [regionDetailOpen, setRegionDetailOpen] = useState(false);
  const [completedQuestModalData, setCompletedQuestModalData] =
    useState<Quest | null>(null);
  const [searchParams] = useSearchParams();
  const openQuestId = searchParams.get("openQuest");

  // ─── Live Centralized Progress Engine ───
  const {
    allQuests,
    loading,
    allQuestsProgress,
    questStatusMap,
    questProgressEntries,
    refresh,
  } = useQuestProgressEngine();

  const displayQuests = useMemo(() => {
    return allQuests || [];
  }, [allQuests]);

  useEffect(() => {
    const handleQuestCompleted = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.quest) {
        setCompletedQuestModalData(customEvent.detail.quest);
      }
      refresh();
    };

    window.addEventListener("quest:completed", handleQuestCompleted);
    return () => {
      window.removeEventListener("quest:completed", handleQuestCompleted);
    };
  }, [refresh]);

  useEffect(() => {
    if (openQuestId && allQuests.length > 0) {
      const targetQuest = allQuests.find(
        (q: any) => String(q.id) === String(openQuestId)
      );
      if (targetQuest) {
        setSelectedQuest(targetQuest as any);
        setDetailOpen(true);
      }
    }
  }, [openQuestId, allQuests]);

  const completedQuestIds = useMemo(
    () =>
      questProgressEntries
        .filter((p) => p.status === "completed")
        .map((p) => p.questId),
    [questProgressEntries],
  );

  const activeQuestIds = useMemo(
    () =>
      questProgressEntries
        .filter((p) => p.status === "active")
        .map((p) => p.questId),
    [questProgressEntries],
  );

  const unlockedQuestIds = useMemo(
    () => getUnlockedQuestIds(completedQuestIds, displayQuests),
    [completedQuestIds, displayQuests],
  );

  const unlockedRegionIds = useMemo(() => {
    return worldRegions
      .filter((r) => {
        if (r.requiredRegionIds.length === 0) return true;
        return r.requiredRegionIds.every((rid) => {
          const progress = getRegionProgress(rid, completedQuestIds, displayQuests);
          return progress.percentage > 0;
        });
      })
      .map((r) => r.id);
  }, [completedQuestIds, displayQuests]);

  const completedObjectiveIdsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.values(allQuestsProgress).forEach((info) => {
      map[info.quest.id] = (info.objectiveProgress || [])
        .filter((o: any) => o.isCompleted)
        .map((o: any) => o.objectiveId || o.id);
    });
    return map;
  }, [allQuestsProgress]);

  // 🌟 ACCEPTS QUEST WITH CURRENT BASELINE XP SAVING
  const handleAccept = async (quest: Quest) => {
    if (!quest || !quest.id) return;

    try {
      const currentXP = user?.total_xp || user?.xp || 0;
      markQuestAccepted(quest.id, currentXP);

      await startQuestApi(quest.id);
    } catch (error) {
      console.error("Failed to start quest:", error);
    } finally {
      setAcceptQuest(null);
      setSelectedQuest(quest);
      setDetailOpen(true);
      await refresh();
    }
  };

  const handleViewQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setDetailOpen(true);
  };

  const handleSelectRegion = (region: WorldRegion) => {
    setSelectedRegion(region);
    setRegionDetailOpen(true);
    setActiveTab("quest-paths");
  };

  const dailyQuestTemplate = useMemo(() => {
    const found = displayQuests.find(
      (q: any) => q.type === "daily" || q.id === "quest-daily-grind"
    );
    return (
      found || {
        id: "quest-daily-grind",
        title: "Daily Coding Grind",
        description:
          "Complete at least 1 coding exercise or lesson today to maintain your streak.",
        xpReward: 50,
        objectives: [
          {
            id: "d-1",
            description: "Complete 1 lesson or challenge today",
          },
        ],
      }
    );
  }, [displayQuests]);

  const weeklyQuestTemplate = useMemo(() => {
    const found = displayQuests.find(
      (q: any) => q.type === "weekly" || q.id === "quest-weekly-challenge"
    );
    return (
      found || {
        id: "quest-weekly-challenge",
        title: "Weekly Mastery Challenge",
        description:
          "Complete 3 quests and earn bonus XP this week to claim rewards.",
        xpReward: 200,
        objectives: [
          { id: "w-1", description: "Complete 3 quests this week" },
        ],
      }
    );
  }, [displayQuests]);

  const activeQuests = useMemo(
    () =>
      displayQuests.filter((q: any) => {
        const status = questStatusMap[q.id];
        return (
          status === "active" ||
          (status === "not_started" && unlockedQuestIds.includes(q.id))
        );
      }),
    [displayQuests, questStatusMap, unlockedQuestIds],
  );

  const completedQuests = useMemo(
    () =>
      displayQuests.filter((q: any) => questStatusMap[q.id] === "completed"),
    [displayQuests, questStatusMap],
  );

  const stats = useMemo(
    () => ({
      total: displayQuests.filter((q: any) => !q.isHidden).length,
      completed: completedQuestIds.length,
      active: activeQuestIds.length,
      available: unlockedQuestIds.filter(
        (id) => !completedQuestIds.includes(id) && !activeQuestIds.includes(id),
      ).length,
      totalXp: displayQuests
        .filter((q: any) => completedQuestIds.includes(q.id))
        .reduce((sum, q: any) => sum + (q.xpReward || q.xp_reward || 0), 0),
      regionsUnlocked: unlockedRegionIds.length,
      regionsConquered: worldRegions.filter(
        (r) =>
          getRegionProgress(r.id, completedQuestIds, displayQuests)
            .percentage === 100,
      ).length,
    }),
    [
      displayQuests,
      completedQuestIds,
      activeQuestIds,
      unlockedQuestIds,
      unlockedRegionIds,
    ],
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
              >
                <i className="ri-compass-3-line text-lg text-amber-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text font-display tracking-wide">
                QUEST HUB
              </h1>
            </div>
            <p className="text-sm text-quest-textMuted mt-1">
              {activeQuestIds.length > 0
                ? `${activeQuestIds.length} quest${activeQuestIds.length > 1 ? "s" : ""} in progress — your adventure continues`
                : "Embark on your journey. Choose a realm and begin your first quest."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-quest-bg border border-quest-border">
              <i className="ri-earth-line text-quest-textDim text-sm" />
              <span className="text-xs text-quest-textDim">
                <span className="text-amber-400 font-bold">
                  {stats.regionsConquered}
                </span>
                /{stats.regionsUnlocked} realms
              </span>
            </div>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Quests Completed",
              count: stats.completed,
              total: stats.total,
              icon: "ri-check-double-line",
              color: "text-emerald-400",
            },
            {
              label: "In Progress",
              count: stats.active,
              icon: "ri-play-circle-line",
              color: "text-amber-400",
            },
            {
              label: "Available",
              count: stats.available,
              icon: "ri-compass-3-line",
              color: "text-quest-primary",
            },
            {
              label: "Total XP Earned",
              count: stats.totalXp,
              suffix: " XP",
              icon: "ri-flashlight-line",
              color: "text-yellow-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-quest-card border border-quest-border"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <i className={`${stat.icon} ${stat.color} text-sm`} />
                <span className="text-xs text-quest-textDim">{stat.label}</span>
              </div>
              <span className={`text-xl font-bold ${stat.color}`}>
                {stat.count}
                {stat.suffix || ""}
                {stat.total !== undefined && (
                  <span className="text-quest-textDim text-sm ml-1">
                    / {stat.total}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Smart Continue */}
        {activeQuestIds.length > 0 && (
          <div className="mb-6">
            <SmartContinueButton
              questProgress={questProgressEntries}
              completedObjectiveIdsFn={(quest) => {
                const info = allQuestsProgress[quest.id];
                return info
                  ? info.objectiveProgress
                      .filter((o: any) => o.isCompleted)
                      .map((o: any) => o.objectiveId || o.id)
                  : [];
              }}
              onAcceptQuest={handleAccept}
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-quest-card border border-quest-border rounded-full p-1 mb-6 overflow-x-auto">
          {hubTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setRegionDetailOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.value
                  ? "bg-quest-primary text-white shadow-lg shadow-emerald-500/20"
                  : "text-quest-textDim hover:text-quest-text"
              }`}
            >
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ===== WORLD MAP TAB ===== */}
            {activeTab === "world-map" && (
              <div className="space-y-6">
                <WorldMap
                  completedQuestIds={completedQuestIds}
                  unlockedRegionIds={unlockedRegionIds}
                  onSelectRegion={handleSelectRegion}
                  allQuests={displayQuests as any[]}
                />
                <MasteryPanel
                  completedQuestIds={completedQuestIds}
                  userXp={user?.total_xp || 0}
                  onSelectRegion={(regionId) => {
                    const region = worldRegions.find((r) => r.id === regionId);
                    if (region) handleSelectRegion(region);
                  }}
                />
              </div>
            )}

            {/* ===== QUEST PATHS TAB ===== */}
            {activeTab === "quest-paths" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setRegionDetailOpen(false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      !regionDetailOpen
                        ? "bg-quest-primary text-white"
                        : "bg-quest-card border border-quest-border text-quest-textDim hover:text-quest-text"
                    }`}
                  >
                    All Regions
                  </button>
                  {worldRegions
                    .filter((r) => unlockedRegionIds.includes(r.id))
                    .map((region) => (
                      <button
                        key={region.id}
                        onClick={() => {
                          setSelectedRegion(region);
                          setRegionDetailOpen(true);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                          regionDetailOpen && selectedRegion?.id === region.id
                            ? "bg-quest-primary text-white"
                            : "bg-quest-card border border-quest-border text-quest-textDim hover:text-quest-text"
                        }`}
                      >
                        <i className={`${region.icon} text-xs`} />
                        {region.name}
                      </button>
                    ))}
                </div>

                {regionDetailOpen && selectedRegion ? (
                  <QuestPathTree
                    region={selectedRegion}
                    questProgressMap={questStatusMap}
                    completedObjectiveIdsMap={completedObjectiveIdsMap}
                    isRegionUnlocked={unlockedRegionIds.includes(
                      selectedRegion.id,
                    )}
                    onAcceptQuest={handleAccept}
                    onViewQuest={handleViewQuest}
                    allQuests={displayQuests as any[]}
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {worldRegions
                      .filter((r) => unlockedRegionIds.includes(r.id))
                      .map((region) => (
                        <div key={region.id} className="space-y-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-8 h-8 rounded-lg ${region.bgClass} border ${region.borderClass} flex items-center justify-center`}
                            >
                              <i
                                className={`${region.icon} text-sm ${region.textClass}`}
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-quest-text">
                                {region.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-24 rounded-full bg-quest-bg overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${getRegionProgress(region.id, completedQuestIds, displayQuests).percentage}%`,
                                    }}
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                  />
                                </div>
                                <span className="text-xs text-quest-textDim">
                                  {
                                    getRegionProgress(
                                      region.id,
                                      completedQuestIds,
                                      displayQuests
                                    ).completed
                                  }
                                  /
                                  {
                                    getRegionProgress(
                                      region.id,
                                      completedQuestIds,
                                      displayQuests
                                    ).total
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRegion(region);
                              setRegionDetailOpen(true);
                            }}
                            className="w-full text-left p-3 rounded-xl border border-quest-border bg-quest-card hover:border-quest-textDim/40 transition-all cursor-pointer"
                          >
                            <p className="text-xs text-quest-textDim">
                              {
                                [region.questIds, region.bossQuestId]
                                  .flat()
                                  .filter((qid) =>
                                    completedQuestIds.includes(qid),
                                  ).length
                              }{" "}
                              quests completed — View path
                            </p>
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== FACULTY QUESTS TAB ===== */}
            {activeTab === "faculty-quests" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-quest-card to-quest-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                      <i className="ri-graduation-cap-line text-xl text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-quest-text">
                        Faculty Quests
                      </h2>
                      <p className="text-sm text-quest-textMuted">
                        Complete additional learning quests created by your
                        instructors.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-quest-textDim mb-4">
                    Faculty quests are separate from the official World Map.
                    They are created by your instructors with custom lessons and
                    assessments to help you learn specific skills.
                  </p>
                  <button
                    onClick={() => navigate("/faculty-quests")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-sm hover:bg-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-graduation-cap-line" />
                    Browse Faculty Quests
                    <i className="ri-arrow-right-line" />
                  </button>
                </div>

                <InstructorFacultyQuests />
              </div>
            )}

            {/* ===== ACTIVE QUESTS TAB ===== */}
            {activeTab === "active-quests" && (
              <div className="space-y-6">
                {loading && activeQuests.length === 0 ? (
                  <div className="p-12 text-center text-quest-textDim">
                    Loading quests from database...
                  </div>
                ) : activeQuests.length === 0 ? (
                  <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
                    <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
                      <i className="ri-compass-3-line text-2xl text-quest-textDim" />
                    </div>
                    <h3 className="text-lg font-bold text-quest-text mb-2">
                      No active quests
                    </h3>
                    <p className="text-sm text-quest-textMuted mb-4">
                      Head to the World Map or Quest Paths to discover your
                      first quest.
                    </p>
                    <button
                      onClick={() => setActiveTab("world-map")}
                      className="px-4 py-2 rounded-lg bg-quest-primary/10 border border-quest-primary/20 text-quest-primary text-sm font-semibold hover:bg-quest-primary/20 transition-all cursor-pointer"
                    >
                      Explore World Map
                    </button>
                  </div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {activeQuests.map((quest: any) => {
                        const status =
                          questStatusMap[quest.id] || "not_started";
                        const info = allQuestsProgress[quest.id];
                        const objectiveProgress = info?.objectiveProgress || [];
                        return (
                          <motion.div
                            key={quest.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                          >
                            <QuestCard
                              quest={quest}
                              status={status}
                              objectiveProgress={objectiveProgress}
                              onViewDetail={() => handleViewQuest(quest)}
                              onAccept={() => setAcceptQuest(quest)}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}

                {completedQuests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <i className="ri-check-double-line text-emerald-400" />
                      <h3 className="text-sm font-bold text-quest-text uppercase tracking-wider">
                        Completed Quests
                      </h3>
                      <span className="text-xs text-quest-textDim">
                        ({completedQuests.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-80">
                      {completedQuests.map((quest: any) => {
                        const info = allQuestsProgress[quest.id];
                        const objectiveProgress =
                          info?.objectiveProgress ||
                          (quest.objectives || []).map((o: any) => ({
                            objectiveId: o.id,
                            isCompleted: true,
                            progressPercent: 100,
                            progressDetail: "Completed",
                          }));
                        return (
                          <motion.div
                            key={quest.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="cursor-pointer"
                            onClick={() => handleViewQuest(quest)}
                          >
                            <QuestCard
                              quest={quest}
                              status="completed"
                              objectiveProgress={objectiveProgress}
                              onViewDetail={() => handleViewQuest(quest)}
                              onAccept={() => {}}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== DAILY/WEEKLY TAB ===== */}
            {activeTab === "daily-weekly" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-quest-card to-quest-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                        <i className="ri-sun-line text-xl text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-quest-text">
                          Daily Quest
                        </h2>
                        <p className="text-xs text-amber-400/70">
                          Rotates daily • +{dailyQuestTemplate.xpReward || 50} XP
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="ml-auto w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400"
                      />
                    </div>
                    <p className="text-sm text-quest-textMuted mb-4">
                      {dailyQuestTemplate.description}
                    </p>
                    <div className="space-y-3 mb-4">
                      {(dailyQuestTemplate.objectives || []).map((obj: any, i: number) => (
                        <div
                          key={obj.id || i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-quest-bg/50 border border-quest-border"
                        >
                          <div className="w-6 h-6 rounded-full bg-quest-border/30 border border-quest-border flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-quest-textDim font-bold">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-sm text-quest-textMuted">
                            {obj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const dailyQuest = displayQuests.find(
                          (q: any) => q.id === "quest-daily-grind" || q.type === "daily",
                        );
                        if (dailyQuest) setAcceptQuest(dailyQuest as Quest);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-sm hover:bg-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-sword-line" />
                      Accept Daily Quest
                    </button>
                  </div>

                  <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/5 via-quest-card to-quest-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center">
                        <i className="ri-calendar-check-line text-xl text-fuchsia-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-quest-text">
                          Weekly Quest
                        </h2>
                        <p className="text-xs text-fuchsia-400/70">
                          Rotates weekly • +{weeklyQuestTemplate.xpReward || 200} XP
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-quest-textDim">
                        Badge reward
                      </div>
                    </div>
                    <p className="text-sm text-quest-textMuted mb-4">
                      {weeklyQuestTemplate.description}
                    </p>
                    <div className="space-y-3 mb-4">
                      {(weeklyQuestTemplate.objectives || []).map((obj: any, i: number) => (
                        <div
                          key={obj.id || i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-quest-bg/50 border border-quest-border"
                        >
                          <div className="w-6 h-6 rounded-full bg-quest-border/30 border border-quest-border flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-quest-textDim font-bold">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-sm text-quest-textMuted">
                            {obj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const weeklyQuest = displayQuests.find(
                          (q: any) => q.id === "quest-weekly-challenge" || q.type === "weekly",
                        );
                        if (weeklyQuest) setAcceptQuest(weeklyQuest as Quest);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 font-semibold text-sm hover:bg-fuchsia-500/20 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-sword-line" />
                      Accept Weekly Quest
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-quest-border bg-quest-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-quest-primary/10 border border-quest-primary/20 flex items-center justify-center">
                      <i className="ri-lightbulb-line text-lg text-quest-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-quest-text">
                        Quest Recommendations
                      </h3>
                      <p className="text-xs text-quest-textDim">
                        Based on your progress and specialization
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {worldRegions
                      .filter(
                        (r) =>
                          unlockedRegionIds.includes(r.id) &&
                          getRegionProgress(r.id, completedQuestIds, displayQuests)
                            .percentage < 100,
                      )
                      .slice(0, 3)
                      .map((region) => {
                        const prog = getRegionProgress(
                          region.id,
                          completedQuestIds,
                          displayQuests
                        );
                        const nextQuest = displayQuests.find((q: any) => {
                          if (q.region !== region.id) return false;
                          if (completedQuestIds.includes(q.id)) return false;
                          if (
                            q.requiresQuestIds &&
                            q.requiresQuestIds.length > 0
                          ) {
                            return q.requiresQuestIds.every((rq: string) =>
                              completedQuestIds.includes(rq),
                            );
                          }
                          return true;
                        });
                        return (
                          <div
                            key={region.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-quest-border bg-quest-bg/30"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl ${region.bgClass} border ${region.borderClass} flex items-center justify-center flex-shrink-0`}
                            >
                              <i
                                className={`${region.icon} text-lg ${region.textClass}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-quest-text">
                                {region.name}
                              </h4>
                              <p className="text-xs text-quest-textDim">
                                {prog.completed}/{prog.total} quests done
                                {nextQuest ? ` — Next: ${nextQuest.title}` : ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-quest-textDim mb-1">
                                {prog.percentage}%
                              </div>
                              {nextQuest && (
                                <button
                                  onClick={() =>
                                    handleViewQuest(nextQuest as Quest)
                                  }
                                  className="text-xs font-semibold text-quest-primary hover:underline cursor-pointer whitespace-nowrap"
                                >
                                  View Quest
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quest Detail Slide-in Panel */}
        <AnimatePresence>
          {detailOpen && selectedQuest && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setDetailOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-quest-card border-l border-quest-border z-50 overflow-y-auto p-6"
              >
                <QuestDetailPanel
                  quest={selectedQuest as any}
                  questInfo={
                    allQuestsProgress[selectedQuest.id] ||
                    ({
                      quest: {
                        ...selectedQuest,
                        difficulty: String(selectedQuest.difficulty),
                      },
                      status: "not_started" as const,
                      objectiveProgress: (selectedQuest.objectives || []).map(
                        (o: any) => ({
                          objectiveId: o.id,
                          isCompleted: false,
                          progressPercent: 0,
                          progressDetail: "Not started",
                        }),
                      ),
                      completedCount: 0,
                      totalCount: (selectedQuest.objectives || []).length,
                      progressPercent: 0,
                      allCompleted: false,
                      nextObjective: selectedQuest.objectives?.[0] || null,
                    } as any)
                  }
                  status={questStatusMap[selectedQuest.id] || "not_started"}
                  onAccept={() => handleAccept(selectedQuest)}
                  onClose={() => setDetailOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Accept Modal */}
        <AcceptModal
          isOpen={!!acceptQuest}
          quest={acceptQuest}
          onConfirm={() => {
            if (acceptQuest) handleAccept(acceptQuest);
          }}
          onClose={() => setAcceptQuest(null)}
        />

        {/* EPIC COMPLETION MODAL */}
        {completedQuestModalData && (
          <EpicCompletionModal
            isOpen={Boolean(completedQuestModalData)}
            quest={completedQuestModalData}
            onClose={() => setCompletedQuestModalData(null)}
            newlyUnlockedQuests={[]}
            newlyUnlockedRegions={[]}
            onViewUnlocked={() => {
              setCompletedQuestModalData(null);
              setActiveTab("world-map");
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}