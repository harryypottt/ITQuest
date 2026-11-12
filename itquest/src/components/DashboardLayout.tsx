import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const studentNavGroups = [
  {
    label: "MAIN",
    items: [
      { path: "/dashboard", icon: "ri-dashboard-line", label: "Dashboard" },
      { path: "/quests", icon: "ri-sword-line", label: "Quests" },
      { path: "/boss-quests", icon: "ri-fire-line", label: "Boss Quests" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { path: "/lessons", icon: "ri-book-open-line", label: "Lessons" },
      { path: "/coding", icon: "ri-code-box-line", label: "Coding" },
      {
        path: "/quiz-battle",
        icon: "ri-flashlight-line",
        label: "Quiz Battle",
      },
    ],
  },
  {
    label: "PROGRESSION",
    items: [
      { path: "/leaderboard", icon: "ri-trophy-line", label: "Leaderboard" },
      { path: "/badges", icon: "ri-medal-line", label: "Badges" },
      { path: "/profile", icon: "ri-user-line", label: "Profile" },
    ],
  },
];

const facultyNavGroups = [
  {
    label: "MAIN",
    items: [
      {
        path: "/faculty-dashboard",
        icon: "ri-user-star-line",
        label: "Faculty Hub",
      },
      { path: "/dashboard", icon: "ri-dashboard-line", label: "Dashboard" },
      { path: "/quests", icon: "ri-sword-line", label: "Quests" },
      { path: "/boss-quests", icon: "ri-fire-line", label: "Boss Quests" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { path: "/lessons", icon: "ri-book-open-line", label: "Lessons" },
      { path: "/coding", icon: "ri-code-box-line", label: "Coding" },
      {
        path: "/quiz-battle",
        icon: "ri-flashlight-line",
        label: "Quiz Battle",
      },
    ],
  },
  {
    label: "PROGRESSION",
    items: [
      { path: "/leaderboard", icon: "ri-trophy-line", label: "Leaderboard" },
      { path: "/badges", icon: "ri-medal-line", label: "Badges" },
      { path: "/profile", icon: "ri-user-line", label: "Profile" },
    ],
  },
];

const adminNavGroups = [
  {
    label: "MAIN",
    items: [
      {
        path: "/admin-dashboard",
        icon: "ri-shield-keyhole-line",
        label: "Admin Panel",
      },
      {
        path: "/faculty-dashboard",
        icon: "ri-user-star-line",
        label: "Faculty Hub",
      },
      { path: "/dashboard", icon: "ri-dashboard-line", label: "Dashboard" },
      { path: "/quests", icon: "ri-sword-line", label: "Quests" },
      { path: "/boss-quests", icon: "ri-fire-line", label: "Boss Quests" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { path: "/lessons", icon: "ri-book-open-line", label: "Lessons" },
      { path: "/coding", icon: "ri-code-box-line", label: "Coding" },
      {
        path: "/quiz-battle",
        icon: "ri-flashlight-line",
        label: "Quiz Battle",
      },
    ],
  },
  {
    label: "PROGRESSION",
    items: [
      { path: "/leaderboard", icon: "ri-trophy-line", label: "Leaderboard" },
      { path: "/badges", icon: "ri-medal-line", label: "Badges" },
      { path: "/profile", icon: "ri-user-line", label: "Profile" },
    ],
  },
];

const SIDEBAR_STORAGE_KEY = "itquest_sidebar_collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  // State para sa Collapsible Sidebar na may LocalStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error("Failed to save sidebar state:", err);
    }
  };

  // Case-insensitive role matching para iwas bug sa database roles
  const userRole = user?.role?.toLowerCase() || "student";
  const navItems =
    userRole === "admin"
      ? adminNavGroups
      : userRole === "faculty"
        ? facultyNavGroups
        : studentNavGroups;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // User Fallback Logic & Calculations
  const displayName = user?.full_name || user?.name || user?.username || "User";
  const totalXP = Number(user?.total_xp ?? user?.totalXp ?? user?.xp ?? 0);
  const xpPerLevel = 500; // Pwede mong gawing 1000 kung gusto mo
  const computedLevel =
    user?.current_level || user?.level || Math.floor(totalXP / xpPerLevel) + 1;
  const currentLevelXP = totalXP % xpPerLevel;

  // 🌟 Kukunin ang rank_tier mula sa database, may fallback lang kung blangko
  const userRankTier =
    user?.rank_tier ||
    user?.rankTier ||
    user?.current_rank ||
    user?.rank ||
    "Unranked";

  const progressPercentage = Math.min((currentLevelXP / xpPerLevel) * 100, 100);

  return (
    <div className="min-h-screen bg-quest-bg text-quest-text font-body flex">
      {/* Sidebar */}
      <aside
        className={`bg-quest-card border-r border-quest-border hidden lg:flex flex-col fixed h-screen z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header & Logo with Collapse Toggle */}
        <div
          className={`p-4 border-b border-quest-border flex items-center ${
            isCollapsed ? "justify-center flex-col gap-3" : "justify-between"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-quest-primary to-quest-accent flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <i className="ri-sword-line text-white text-lg" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-quest-text tracking-tight whitespace-nowrap">
                IT<span className="text-quest-primary">Quest</span>
              </span>
            )}
          </Link>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`w-7 h-7 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors ${
              isCollapsed ? "" : "ml-auto"
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i
              className={
                isCollapsed ? "ri-indent-increase" : "ri-indent-decrease"
              }
            />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 border-b border-quest-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-quest-primary/20 border border-quest-primary/30 flex items-center justify-center flex-shrink-0">
              <i className="ri-user-line text-quest-primary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-quest-text truncate">
                  {displayName}
                </div>
                <div className="text-xs text-quest-primary truncate">
                  Level {computedLevel} • {userRankTier}
                </div>
              </div>
            )}
          </div>

          {/* XP Bar */}
          {!isCollapsed && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-quest-textDim mb-1">
                <span>XP</span>
                <span>
                  {currentLevelXP} / {xpPerLevel}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-quest-primary to-quest-accent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((group, groupIdx) => (
            <div key={group.label} className={groupIdx > 0 ? "mt-4" : ""}>
              {!isCollapsed && (
                <div className="px-4 mb-1">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-quest-textDim/50 uppercase">
                    {group.label}
                  </span>
                </div>
              )}
              <ul className="space-y-0.5 px-3">
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                          active
                            ? "text-quest-primary bg-quest-primary/10 font-semibold"
                            : "text-quest-textMuted hover:text-quest-text hover:bg-quest-bg"
                        } ${isCollapsed ? "justify-center px-0" : ""}`}
                      >
                        <i className={`${item.icon} text-lg`} />
                        {!isCollapsed && <span>{item.label}</span>}
                        {active && !isCollapsed && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-quest-primary" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Notifications */}
          <div className="mt-4 pt-4 border-t border-quest-border/50 mx-3">
            <Link
              to="/notifications"
              title={isCollapsed ? "Notifications" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                isActive("/notifications")
                  ? "text-quest-primary bg-quest-primary/10 font-semibold"
                  : "text-quest-textMuted hover:text-quest-text hover:bg-quest-bg"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <span className="relative">
                <i className="ri-notification-3-line text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {!isCollapsed && <span>Notifications</span>}
              {!isCollapsed && isActive("/notifications") && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-quest-primary" />
              )}
              {!isCollapsed &&
                !isActive("/notifications") &&
                unreadCount > 0 && (
                  <span className="ml-auto bg-rose-500/10 text-rose-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {unreadCount} new
                  </span>
                )}
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-quest-border">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-quest-textDim hover:text-quest-danger hover:bg-rose-500/5 transition-all w-full ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <i className="ri-logout-box-line text-lg" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-quest-card/95 backdrop-blur-xl border-b border-quest-border z-40 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-quest-primary to-quest-accent flex items-center justify-center">
            <i className="ri-sword-line text-white text-sm" />
          </div>
          <span className="text-base font-bold text-quest-text">
            IT<span className="text-quest-primary">Quest</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-quest-primary font-medium">
            Lv.{computedLevel}
          </span>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim"
          >
            <i className="ri-logout-box-line" />
          </button>
        </div>
      </div>

      {/* Dynamic Main Content Margin */}
      <main
        className={`flex-1 pt-16 lg:pt-0 min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}