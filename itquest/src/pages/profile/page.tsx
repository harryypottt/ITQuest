import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { badges as initialBadges, rarityConfig } from "@/sampleData/badgeData";
import {
  bossStatusConfig,
  codingStatusConfig,
} from "@/sampleData/submissionData";
import api, { fetchUserProfile, updateUserProfile } from "@/services/api";

const defaultPreferenceOptions = [
  {
    id: "email-quest",
    label: "Email for new quests",
    icon: "ri-sword-line",
    checked: true,
  },
  {
    id: "email-badge",
    label: "Email for badge earnings",
    icon: "ri-shield-star-line",
    checked: true,
  },
  {
    id: "email-level",
    label: "Email for level ups",
    icon: "ri-arrow-up-circle-line",
    checked: false,
  },
  {
    id: "email-faculty",
    label: "Email for faculty reviews",
    icon: "ri-user-star-line",
    checked: true,
  },
  {
    id: "push-quest",
    label: "Push for quest reminders",
    icon: "ri-sword-line",
    checked: true,
  },
  {
    id: "push-streak",
    label: "Push for streak warnings",
    icon: "ri-fire-line",
    checked: true,
  },
];

export default function Profile() {
  const { user, updateUser } = useAuth();

  // 🟢 Pure Backend Data States
  const [profileStats, setProfileStats] = useState<any>(null);
  const [badgeList, setBadgeList] = useState<any[]>([]);
  const [bossSubs, setBossSubs] = useState<any[]>([]);
  const [codingSubs, setCodingSubs] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [prefs, setPrefs] = useState(defaultPreferenceOptions);

  // UI & Form States
  const [activeTab, setActiveTab] = useState<
    "badges" | "activity" | "submissions" | "settings"
  >("badges");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || user?.name || "");
  const [editSpecialization, setEditSpecialization] = useState(
    user?.specialization || "",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch live profile data and badges specific to the logged-in user
  const loadBackendProfile = async () => {
    try {
      const res = await fetchUserProfile();
      if (res && (res.success || res.status === 200 || res.data)) {
        const data = res.data || res;

        // Sync Stats
        if (data.stats) setProfileStats(data.stats);

        // Sync User-Specific Submissions
        setBossSubs(data.bossSubmissions || data.submissions?.boss || []);
        setCodingSubs(data.codingSubmissions || data.submissions?.coding || []);

        // Sync User-Specific Activity Log
        if (data.activities || data.activityFeed) {
          const rawActivities = data.activities || data.activityFeed;
          const mappedActivities = rawActivities.map((act: any) => ({
            action: act.action || act.title || "Activity",
            detail: act.detail || act.description || "",
            time: act.createdAt
              ? new Date(act.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : act.time || "Recently",
            icon: act.icon || "ri-history-line",
            color: act.color || "text-cyan-400",
          }));
          setActivities(mappedActivities);
        } else {
          setActivities([]);
        }

        // Sync Settings Preferences
        if (data.settings?.preferences) {
          setPrefs((prev) =>
            prev.map((p) => ({
              ...p,
              checked: data.settings.preferences[p.id] ?? p.checked,
            })),
          );
        }
      }

      // 🌟 KUNIN ANG BADGES GAMIT ANG LEFT JOIN ENDPOINT (/student/badges)
      try {
        const badgeRes: any = await api.get("/student/badges");
        const rawBadges = Array.isArray(badgeRes)
          ? badgeRes
          : badgeRes.data?.data || badgeRes.data || [];

        if (rawBadges.length > 0) {
          const mappedBadges = rawBadges.map((b: any) => {
            const earnedVal = b.isEarned ?? b.is_earned;
            return {
              ...b,
              name: b.name || b.title,
              isEarned:
                earnedVal === 1 ||
                earnedVal === "1" ||
                earnedVal === true ||
                earnedVal === "true",
            };
          });
          setBadgeList(mappedBadges);
        } else {
          setBadgeList(initialBadges.map((b) => ({ ...b, isEarned: false })));
        }
      } catch (badgeErr) {
        console.warn("Could not fetch badges for profile:", badgeErr);
        setBadgeList(initialBadges.map((b) => ({ ...b, isEarned: false })));
      }
    } catch (err) {
      console.warn("Backend profile fetch error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      setEditName(user.full_name || user.name || "");
      setEditSpecialization(user.specialization || "");
    }
    loadBackendProfile();
  }, [user]);

  // 2. Save Profile Info (PUT /student/profile)
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await updateUserProfile({
        name: editName,
        specialization: editSpecialization,
      });

      if (res && (res.success || res.status === 200)) {
        if (updateUser) {
          updateUser({
            full_name: editName,
            name: editName,
            specialization: editSpecialization,
          });
        }
        await loadBackendProfile();
      }
    } catch (err) {
      console.error("Error saving profile to backend:", err);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  // 3. Save Notification Preferences to Backend (PUT /student/settings)
  const togglePref = async (id: string) => {
    const updatedPrefs = prefs.map((p) =>
      p.id === id ? { ...p, checked: !p.checked } : p,
    );
    setPrefs(updatedPrefs);

    try {
      const prefObject = updatedPrefs.reduce(
        (acc, curr) => {
          acc[curr.id] = curr.checked;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      await api.put("/student/settings", { preferences: prefObject });
    } catch (err) {
      console.warn("Could not sync preference settings to backend:", err);
    }
  };

  // Real-time Badge Computations
  const earnedBadges = badgeList.filter((b: any) => b.isEarned);
  const earnedCount = earnedBadges.length;
  const totalCount = badgeList.length || initialBadges.length;

  const earnedByRarity = (rarity: string) =>
    earnedBadges.filter((b: any) => b.rarity === rarity).length;

  // Real-time Computed User Stats
  const currentLevel =
    profileStats?.level ?? user?.current_level ?? user?.level ?? 1;
  const totalXp = profileStats?.totalXp ?? user?.total_xp ?? user?.xp ?? 0;
  const streakDays = profileStats?.streak ?? user?.streak_days ?? 0;
  const currentRank = profileStats?.rank ?? user?.current_rank ?? "Novice";

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl bg-quest-card border border-quest-border overflow-hidden mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-quest-card to-cyan-500/5 pointer-events-none" />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center relative group cursor-pointer"
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                >
                  <span className="text-2xl font-bold text-emerald-400">
                    {(user?.full_name || user?.name || "JL")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-quest-card border border-quest-border flex items-center justify-center">
                    <i className="ri-camera-line text-xs text-quest-textDim" />
                  </div>
                </div>
                {showAvatarMenu && (
                  <div className="absolute top-full left-0 mt-2 w-44 rounded-xl bg-quest-card border border-quest-border shadow-lg z-10 overflow-hidden">
                    {["Upload Photo", "Remove Photo", "Cancel"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setShowAvatarMenu(false)}
                        className="w-full text-left px-4 py-2.5 text-sm text-quest-textMuted hover:bg-quest-bg hover:text-quest-text transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-xl md:text-2xl font-bold text-quest-text bg-quest-bg border border-quest-border rounded-lg px-3 py-1 outline-none focus:border-emerald-500/50"
                    />
                  ) : (
                    <h1 className="text-xl md:text-2xl font-bold text-quest-text truncate">
                      {user?.full_name || user?.name || "Student"}
                    </h1>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    {user?.role || "student"}
                  </span>
                </div>
                {isEditing ? (
                  <input
                    value={editSpecialization}
                    onChange={(e) => setEditSpecialization(e.target.value)}
                    className="text-sm text-quest-textMuted bg-quest-bg border border-quest-border rounded-lg px-3 py-1 outline-none focus:border-emerald-500/50 w-full max-w-xs mt-1"
                  />
                ) : (
                  <p className="text-sm text-quest-textMuted">
                    {user?.specialization || "Full Stack Developer"}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isSaving}
                        onClick={handleSaveProfile}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(user?.full_name || user?.name || "");
                          setEditSpecialization(user?.specialization || "");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-quest-bg border border-quest-border text-quest-textDim text-xs font-medium hover:text-quest-textMuted transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-xs text-quest-textDim hover:text-quest-textMuted transition-colors cursor-pointer"
                    >
                      <i className="ri-edit-line" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* XP Progress */}
              <div className="w-full sm:w-48 shrink-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-quest-textDim">
                    Level {currentLevel}
                  </span>
                  <span className="text-quest-textDim">
                    {totalXp.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-2 rounded-full bg-quest-bg border border-quest-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((totalXp % 1000) / 10, 100)}%`,
                    }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  />
                </div>
                <p className="text-xs text-quest-textDim mt-1.5">
                  {1000 - (totalXp % 1000)} XP to next level
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              label: "Total XP",
              value: totalXp.toLocaleString(),
              icon: "ri-coin-line",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Current Level",
              value: currentLevel,
              icon: "ri-bar-chart-line",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Streak",
              value: `${streakDays} days`,
              icon: "ri-fire-line",
              color: "text-rose-400",
              bg: "bg-rose-500/10",
            },
            {
              label: "Rank",
              value: currentRank,
              icon: "ri-shield-star-line",
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-quest-card border border-quest-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <i className={`${stat.icon} ${stat.color} text-lg`} />
                </div>
                <span className="text-xs text-quest-textDim">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-quest-text">
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Badge summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-quest-card border border-quest-border overflow-x-auto"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <i className="ri-trophy-line text-amber-400 text-lg" />
            <span className="text-sm font-semibold text-quest-text">
              {earnedCount}/{totalCount} Badges
            </span>
          </div>
          <div className="w-px h-6 bg-quest-border" />
          {["Common", "Rare", "Epic", "Legendary"].map((rarity) => {
            const cfg =
              rarityConfig[rarity as keyof typeof rarityConfig] ||
              rarityConfig.Common;
            return (
              <div
                key={rarity}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <div
                  className={`w-2 h-2 rounded-full ${cfg.bg.replace("/10", "")}`}
                />
                <span className={`text-xs ${cfg.text}`}>{rarity}</span>
                <span className="text-xs text-quest-textDim">
                  {earnedByRarity(rarity)}
                </span>
              </div>
            );
          })}
          <Link
            to="/badges"
            className="ml-auto text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            View All <i className="ri-arrow-right-line" />
          </Link>
        </motion.div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-6 bg-quest-card border border-quest-border rounded-full p-1 w-fit">
          {[
            {
              value: "badges" as const,
              label: "Badges",
              icon: "ri-shield-star-line",
            },
            {
              value: "submissions" as const,
              label: "Submissions",
              icon: "ri-send-plane-line",
            },
            {
              value: "activity" as const,
              label: "Activity",
              icon: "ri-history-line",
            },
            {
              value: "settings" as const,
              label: "Settings",
              icon: "ri-settings-3-line",
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.value
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "text-quest-textDim hover:text-quest-textMuted"
              }`}
            >
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {/* 1. BADGES TAB */}
          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {earnedBadges.length > 0 ? (
                earnedBadges.map((badge: any) => {
                  const cfg =
                    rarityConfig[badge.rarity as keyof typeof rarityConfig] ||
                    rarityConfig.Common;
                  const badgeIcon = badge.icon || "ri-medal-line";
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl bg-quest-card border ${cfg.border} ${cfg.glow} group hover:-translate-y-1 transition-transform cursor-pointer`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center mb-3`}
                      >
                        <i className={`${badgeIcon} ${cfg.text} text-xl`} />
                      </div>
                      <h3 className="text-sm font-bold text-quest-text mb-1 truncate">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-quest-textDim line-clamp-2 mb-2">
                        {badge.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}
                        >
                          {badge.rarity}
                        </span>
                        <span className="text-xs text-amber-400">
                          +{badge.xpBonus || badge.xp_bonus || 0} XP
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-8 text-center bg-quest-card border border-quest-border rounded-xl">
                  <i className="ri-trophy-line text-3xl text-quest-textDim mb-2 block" />
                  <p className="text-sm font-semibold text-quest-text">
                    No Badges Earned Yet
                  </p>
                  <p className="text-xs text-quest-textDim mt-1">
                    Complete quests and challenges to unlock badges!
                  </p>
                </div>
              )}
              {earnedBadges.length < totalCount && (
                <Link
                  to="/badges"
                  className="p-4 rounded-xl bg-quest-bg border border-dashed border-quest-border flex flex-col items-center justify-center text-center min-h-[172px] hover:border-quest-textDim/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-quest-card border border-quest-border flex items-center justify-center mb-3">
                    <i className="ri-lock-line text-xl text-quest-textDim group-hover:text-quest-textMuted transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-quest-textDim group-hover:text-quest-textMuted transition-colors">
                    {totalCount - earnedCount} more to earn
                  </span>
                  <span className="text-xs text-quest-textDim mt-1">
                    View badge gallery
                  </span>
                </Link>
              )}
            </motion.div>
          )}

          {/* 2. ACTIVITY TAB */}
          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-quest-card border border-quest-border overflow-hidden"
            >
              {activities.length > 0 ? (
                <div className="divide-y divide-quest-border">
                  {activities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-quest-bg/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center shrink-0">
                        <i className={`${item.icon} ${item.color} text-lg`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-quest-text">
                            {item.action}
                          </span>
                          <span className="text-sm font-semibold text-quest-textMuted truncate">
                            {item.detail}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-quest-textDim whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-quest-textDim text-sm">
                  <i className="ri-history-line text-2xl mb-2 block text-quest-textDim" />
                  No recent activity recorded for this account yet.
                </div>
              )}
            </motion.div>
          )}

          {/* 3. SUBMISSIONS TAB */}
          {activeTab === "submissions" && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Boss Quest Submissions */}
              <div className="rounded-xl bg-quest-card border border-quest-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-quest-border">
                  <h2 className="text-base font-bold text-quest-text flex items-center gap-2">
                    <i className="ri-fire-line text-rose-400" />
                    Boss Quest Submissions
                    <span className="text-xs text-quest-textDim font-normal ml-1">
                      ({bossSubs.length})
                    </span>
                  </h2>
                </div>
                {bossSubs.length > 0 ? (
                  <div className="divide-y divide-quest-border">
                    {bossSubs.map((sub: any) => {
                      const cfg =
                        bossStatusConfig[
                          sub.status as keyof typeof bossStatusConfig
                        ];
                      const progressPct = Math.round(
                        (sub.requirementsMet / (sub.requirementsTotal || 1)) *
                          100,
                      );
                      return (
                        <div
                          key={sub.id}
                          className="px-5 py-4 hover:bg-quest-bg/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="text-sm font-bold text-quest-text truncate">
                                  {sub.questTitle}
                                </h3>
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${cfg?.bg} ${cfg?.color} border border-white/5 whitespace-nowrap flex items-center gap-1`}
                                >
                                  <i className={`${cfg?.icon} text-xs`} />
                                  {cfg?.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-quest-textDim mb-2">
                                <span>{sub.categoryName}</span>
                                {sub.submittedAt && (
                                  <>
                                    <span>&middot;</span>
                                    <span>
                                      Submitted{" "}
                                      {new Date(
                                        sub.submittedAt,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </>
                                )}
                                {sub.score !== undefined && (
                                  <>
                                    <span>&middot;</span>
                                    <span
                                      className={`font-semibold ${sub.score >= 80 ? "text-emerald-400" : sub.score >= 60 ? "text-amber-400" : "text-rose-400"}`}
                                    >
                                      Score: {sub.score}/100
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 max-w-[200px] h-1.5 rounded-full bg-quest-bg border border-quest-border overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className={`h-full rounded-full ${
                                      sub.status === "approved"
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                        : sub.status === "rejected"
                                          ? "bg-gradient-to-r from-rose-500 to-rose-400"
                                          : "bg-gradient-to-r from-amber-500 to-amber-400"
                                    }`}
                                  />
                                </div>
                                <span className="text-xs text-quest-textDim whitespace-nowrap">
                                  {sub.requirementsMet}/
                                  {sub.requirementsTotal || 1} reqs
                                </span>
                              </div>
                              {sub.feedback && (
                                <div className="mt-2 p-3 rounded-lg bg-quest-bg border border-quest-border">
                                  <p className="text-xs text-quest-textMuted leading-relaxed">
                                    <span className="text-quest-textDim font-semibold">
                                      Feedback:{" "}
                                    </span>
                                    {sub.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                            <Link
                              to="/boss-quests"
                              className="shrink-0 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap mt-0.5"
                            >
                              {sub.status === "in_progress"
                                ? "Continue"
                                : "View"}{" "}
                              <i className="ri-arrow-right-line" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-quest-textDim">
                    No boss quest submissions yet for this account.
                  </div>
                )}
              </div>

              {/* Coding Challenge Submissions */}
              <div className="rounded-xl bg-quest-card border border-quest-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-quest-border">
                  <h2 className="text-base font-bold text-quest-text flex items-center gap-2">
                    <i className="ri-code-box-line text-cyan-400" />
                    Coding Challenge Submissions
                    <span className="text-xs text-quest-textDim font-normal ml-1">
                      ({codingSubs.length})
                    </span>
                  </h2>
                </div>
                {codingSubs.length > 0 ? (
                  <div className="divide-y divide-quest-border">
                    {codingSubs.map((sub: any) => {
                      const cfg =
                        codingStatusConfig[
                          sub.status as keyof typeof codingStatusConfig
                        ];
                      const scorePct =
                        sub.bestScore !== undefined ? sub.bestScore : 0;
                      return (
                        <div
                          key={sub.id}
                          className="px-5 py-4 hover:bg-quest-bg/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <h3 className="text-sm font-bold text-quest-text truncate">
                                  {sub.challengeTitle}
                                </h3>
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${cfg?.bg} ${cfg?.color} border border-white/5 whitespace-nowrap flex items-center gap-1`}
                                >
                                  <i className={`${cfg?.icon} text-xs`} />
                                  {cfg?.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-quest-textDim mb-2">
                                <span>{sub.category}</span>
                                {sub.lastAttemptedAt && (
                                  <>
                                    <span>&middot;</span>
                                    <span>
                                      Last attempt:{" "}
                                      {new Date(
                                        sub.lastAttemptedAt,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="text-quest-textDim">
                                  Attempts:{" "}
                                  <span className="text-quest-textMuted font-semibold">
                                    {sub.attempts}
                                  </span>
                                </span>
                                {sub.bestScore !== undefined && (
                                  <span className="text-quest-textDim">
                                    Best:{" "}
                                    <span
                                      className={`font-semibold ${scorePct >= 80 ? "text-emerald-400" : "text-amber-400"}`}
                                    >
                                      {scorePct}%
                                    </span>
                                  </span>
                                )}
                                {sub.xpAwarded && (
                                  <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                                    <i className="ri-coin-line text-xs" />+
                                    {sub.xpAwarded} XP
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link
                              to="/coding"
                              className="shrink-0 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap mt-0.5"
                            >
                              {sub.status === "in_progress" ? "Retry" : "View"}{" "}
                              <i className="ri-arrow-right-line" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-quest-textDim">
                    No coding challenge submissions yet for this account.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. SETTINGS TAB */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="rounded-xl bg-quest-card border border-quest-border p-5">
                <h2 className="text-base font-bold text-quest-text mb-4 flex items-center gap-2">
                  <i className="ri-notification-3-line text-emerald-400" />
                  Notification Preferences
                </h2>
                <div className="space-y-3">
                  {prefs.map((pref) => (
                    <label
                      key={pref.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-quest-bg border border-quest-border cursor-pointer hover:border-quest-textDim/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i
                          className={`${pref.icon} text-quest-textDim text-sm`}
                        />
                        <span className="text-sm text-quest-text">
                          {pref.label}
                        </span>
                      </div>
                      <button
                        onClick={() => togglePref(pref.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                          pref.checked ? "bg-emerald-500" : "bg-quest-border"
                        }`}
                      >
                        <motion.div
                          animate={{ x: pref.checked ? 20 : 2 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
