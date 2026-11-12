import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchDashboardData } from "@/services/api";

// Iba pang components at sample data para sa mga hindi pa natin ginalaw
import { notifications as mockNotifications } from "@/sampleData/notificationData";
import {
  weeklyActivityData,
  skillDistributionData,
  activityFeedData,
} from "@/sampleData/dashboardData";
import XPRing from "./components/XPRing";
import ActiveQuestCard from "./components/ActiveQuestCard";
import WeeklyActivityChart from "./components/WeeklyActivityChart";
import SkillDistributionChart from "./components/SkillDistributionChart";
import ActivityFeed from "./components/ActivityFeed";
import NotificationPreview from "./components/NotificationPreview";
import QuickAccessTile from "./components/QuickAccessTile";
import QuestProgressPanel from "./components/QuestProgressPanel";

const quickAccessTiles = [
  {
    label: "Lessons",
    description: "Continue your learning path",
    icon: "ri-book-open-line",
    path: "/lessons",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Quests",
    description: "Accept & complete quests",
    icon: "ri-sword-line",
    path: "/quests",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Coding",
    description: "Solve code challenges",
    icon: "ri-code-box-line",
    path: "/coding",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    label: "Quiz Battle",
    description: "Compete & test knowledge",
    icon: "ri-flashlight-line",
    path: "/quiz-battle",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
  },
  {
    label: "Leaderboard",
    description: "See top performers",
    icon: "ri-trophy-line",
    path: "/leaderboard",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Boss Quests",
    description: "Epic challenges await",
    icon: "ri-fire-line",
    path: "/boss-quests",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    label: "Badges",
    description: "View earned badges",
    icon: "ri-medal-line",
    path: "/badges",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    label: "Profile",
    description: "Customize your profile",
    icon: "ri-user-line",
    path: "/profile",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
];

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Gamitin ang real data mula sa database kung meron na, fallback sa authUser o defaults
  const user = dashboardData?.user || authUser;
  const activeDashboardQuests = dashboardData?.activeQuests || [];

  // XP & Level computation formula: Level = floor(total_xp / 500) + 1
  const totalXP = user?.total_xp || 0;
  const currentLevel =
    user?.current_level || user?.level || Math.floor(totalXP / 500) + 1;
  const xpForNextLevel = currentLevel * 500;
  const currentRank = user?.current_rank || user?.rank_tier || "Novice";
  const streakDays = user?.streak_days || user?.streak || 0;
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-quest-text mb-1">
            Welcome back,{" "}
            <span className="text-quest-primary">
              {user?.full_name?.split(" ")[0] ||
                user?.name?.split(" ")[0] ||
                "Student"}
            </span>
          </h1>
          <p className="text-sm text-quest-textMuted">
            Track your progress, complete quests, and level up your skills.
          </p>
        </motion.div>

        {/* Row 1: XP Ring + Quick Access Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* XP Ring Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-5 md:p-6 rounded-xl bg-quest-card border border-quest-border flex flex-col items-center justify-center"
          >
            <XPRing
              currentXP={totalXP}
              xpForNextLevel={xpForNextLevel}
              level={currentLevel}
              rank={currentRank}
            />
            {/* Level Progress Bar */}
            <div className="w-full mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-quest-textDim">Level Progress</span>
                <span className="text-quest-gold font-semibold">
                  {Math.min(100, Math.round((totalXP / xpForNextLevel) * 100))}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-quest-bg border border-quest-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (totalXP / xpForNextLevel) * 100)}%`,
                  }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500"
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-quest-textDim">
                  Lv. {currentLevel}
                </span>
                <span className="text-xs text-quest-textDim">
                  Lv. {currentLevel + 1}
                </span>
              </div>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-4 border-t border-quest-border">
              <div className="text-center p-2 rounded-lg bg-quest-bg">
                <div className="flex items-center justify-center gap-1 text-rose-400 mb-0.5">
                  <i className="ri-fire-line text-sm" />
                </div>
                <div className="text-lg font-bold text-quest-text">
                  {streakDays}
                </div>
                <div className="text-xs text-quest-textDim">Day Streak</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-quest-bg">
                <div className="flex items-center justify-center gap-1 text-cyan-400 mb-0.5">
                  <i className="ri-sword-line text-sm" />
                </div>
                <div className="text-lg font-bold text-quest-text">
                  {activeDashboardQuests.length}
                </div>
                <div className="text-xs text-quest-textDim">Active Quests</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Access Tiles (spans 2 columns) */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-quest-text mb-4 flex items-center gap-2">
              <i className="ri-apps-2-line text-quest-primary" />
              Quick Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickAccessTiles.map((tile, idx) => (
                <QuickAccessTile
                  key={tile.path}
                  label={tile.label}
                  description={tile.description}
                  icon={tile.icon}
                  path={tile.path}
                  color={tile.color}
                  bg={tile.bg}
                  border={tile.border}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 1.5: Quest Progress Panel — full width (Database Powered) */}
        <QuestProgressPanel quests={activeDashboardQuests.slice(0, 3)} />

        {/* Row 2: Active Quests + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Active Quests */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-quest-text flex items-center gap-2">
                <i className="ri-sword-line text-quest-primary" />
                Active Quests
              </h2>
              <span className="text-xs text-quest-textDim">
                {
                  activeDashboardQuests.filter(
                    (q: any) =>
                      q.status === "in_progress" || q.status === "active",
                  ).length
                }{" "}
                active
              </span>
            </div>
            <div className="space-y-3">
              {activeDashboardQuests.map((quest: any, idx: number) => (
                <ActiveQuestCard
                  key={quest.questId}
                  questId={quest.questId}
                  title={quest.title}
                  description={quest.description}
                  icon={quest.icon || "ri-sword-line"}
                  color={quest.color || "text-cyan-400"}
                  bg={quest.bg || "bg-cyan-500/10"}
                  xpReward={quest.xpReward}
                  progress={quest.progress}
                  total={quest.total}
                  objectives={quest.objectives}
                  index={idx}
                />
              ))}
              {activeDashboardQuests.length === 0 && (
                <div className="p-8 rounded-xl bg-quest-card border border-quest-border text-center text-quest-textMuted">
                  Wala pang active quests. Pumunta sa Quests para kumuha ng
                  bagong pagsubok!
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-1">
            <NotificationPreview
              notifications={mockNotifications}
              unreadCount={unreadNotifications.length}
            />
          </div>
        </div>

        {/* Row 3: Weekly Activity Chart + Skill Distribution (Sample Data retained) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <WeeklyActivityChart data={weeklyActivityData} />
          </div>
          <div className="lg:col-span-1">
            <SkillDistributionChart data={skillDistributionData} />
          </div>
        </div>

        {/* Row 4: Recent Activity Feed (Sample Data retained) */}
        <ActivityFeed activities={activityFeedData} />
      </div>
    </DashboardLayout>
  );
}
