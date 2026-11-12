import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import fetchBadges from "@/services/api";
import { rarityConfig, badgeCategories } from "@/sampleData/badgeData";

type BadgeRarity = "Common" | "Rare" | "Epic" | "Legendary";
type RarityFilter = "all" | BadgeRarity;

const rarityFilters: {
  value: RarityFilter;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "All Rarities",
    icon: "ri-medal-line",
    color: "text-quest-textDim",
  },
  {
    value: "Common",
    label: "Common",
    icon: "ri-shield-line",
    color: "text-slate-400",
  },
  {
    value: "Rare",
    label: "Rare",
    icon: "ri-shield-star-line",
    color: "text-emerald-400",
  },
  {
    value: "Epic",
    label: "Epic",
    icon: "ri-shield-flash-line",
    color: "text-fuchsia-400",
  },
  {
    value: "Legendary",
    label: "Legendary",
    icon: "ri-shield-cross-line",
    color: "text-amber-400",
  },
];

export default function BadgesPage() {
  const [badgesList, setBadgesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRarity, setActiveRarity] = useState<RarityFilter>("all");
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        setLoading(true);
        const res: any = await fetchBadges("/student/badges");

        let rawBadges: any[] = [];
        if (Array.isArray(res)) {
          rawBadges = res;
        } else if (res && Array.isArray(res.data)) {
          rawBadges = res.data;
        } else if (res && res.data && Array.isArray(res.data.data)) {
          rawBadges = res.data.data;
        }

        const normalized = rawBadges.map((b: any) => {
          const earnedVal = b.isEarned ?? b.is_earned;
          return {
            ...b,
            isEarned:
              earnedVal === 1 ||
              earnedVal === "1" ||
              earnedVal === true ||
              earnedVal === "true",
            xpBonus: Number(b.xpBonus ?? b.xp_bonus ?? b.xpReward ?? 0),
            categoryName: b.categoryName || b.category_name || b.category,
            progressCurrent: Number(
              b.progressCurrent ?? b.progress_current ?? 0,
            ),
            progressTarget: Number(
              b.progressTarget ??
                b.progress_target ??
                b.reqCount ??
                b.req_count ??
                1,
            ),
            earnedAt: b.earnedAt || b.earned_at || null,
          };
        });

        setBadgesList(normalized);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, []);

  const filteredBadges = useMemo(() => {
    return badgesList.filter((b) => {
      if (activeCategory !== "all" && b.category !== activeCategory)
        return false;
      if (activeRarity !== "all" && b.rarity !== activeRarity) return false;
      return true;
    });
  }, [badgesList, activeCategory, activeRarity]);

  const earnedCount = badgesList.filter((b) => b.isEarned).length;
  const totalCount = badgesList.length;
  const commonEarned = badgesList.filter(
    (b) => b.rarity === "Common" && b.isEarned,
  ).length;
  const rareEarned = badgesList.filter(
    (b) => b.rarity === "Rare" && b.isEarned,
  ).length;
  const epicEarned = badgesList.filter(
    (b) => b.rarity === "Epic" && b.isEarned,
  ).length;
  const legendaryEarned = badgesList.filter(
    (b) => b.rarity === "Legendary" && b.isEarned,
  ).length;
  const totalXP = badgesList
    .filter((b) => b.isEarned)
    .reduce((s, b) => s + (b.xpBonus || 0), 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-quest-textDim">
          <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading badges collection...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
              <i className="ri-medal-line text-xl text-fuchsia-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text">
                Badge Collection
              </h1>
              <p className="text-sm text-quest-textMuted mt-0.5">
                {earnedCount}/{totalCount} badges earned
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
        >
          <StatCard
            label="Total Earned"
            value={earnedCount}
            suffix={`/ ${totalCount}`}
            icon="ri-medal-line"
            color="text-fuchsia-400"
            bg="bg-fuchsia-500/10"
          />
          <StatCard
            label="Common"
            value={commonEarned}
            icon="ri-shield-line"
            color="text-slate-400"
            bg="bg-slate-500/10"
          />
          <StatCard
            label="Rare"
            value={rareEarned}
            icon="ri-shield-star-line"
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatCard
            label="Epic"
            value={epicEarned}
            icon="ri-shield-flash-line"
            color="text-fuchsia-400"
            bg="bg-fuchsia-500/10"
          />
          <StatCard
            label="Legendary"
            value={legendaryEarned}
            icon="ri-shield-cross-line"
            color="text-amber-400"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Total XP Bonus"
            value={totalXP}
            suffix=" XP"
            icon="ri-flashlight-line"
            color="text-amber-400"
            bg="bg-amber-500/10"
          />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-1 bg-quest-card border border-quest-border rounded-full p-1 overflow-x-auto">
            {badgeCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.value
                    ? "bg-quest-primary text-white shadow-lg shadow-emerald-500/20"
                    : "text-quest-textDim hover:text-quest-text"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {rarityFilters.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRarity(r.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeRarity === r.value
                    ? "bg-quest-bg border border-quest-primary/30 text-quest-primary"
                    : "text-quest-textDim hover:text-quest-text"
                }`}
              >
                <i
                  className={`${r.icon} ${activeRarity === r.value ? "text-quest-primary" : r.color} text-xs`}
                />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Grid */}
        <AnimatePresence mode="wait">
          {filteredBadges.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 rounded-xl bg-quest-card border border-quest-border text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
                <i className="ri-medal-line text-2xl text-quest-textDim" />
              </div>
              <h3 className="text-lg font-bold text-quest-text mb-2">
                No badges here
              </h3>
              <p className="text-sm text-quest-textMuted">
                Try changing your filters to discover more badges.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${activeRarity}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <BadgeCard
                    badge={badge}
                    onClick={() => setSelectedBadge(badge)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge Detail Modal */}
        <AnimatePresence>
          {selectedBadge && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedBadge(null)}
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-md bg-quest-card border border-quest-border rounded-2xl p-6 shadow-2xl z-10"
              >
                <BadgeDetail
                  badge={selectedBadge}
                  onClose={() => setSelectedBadge(null)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, suffix, icon, color, bg }: any) {
  return (
    <div className="p-4 rounded-xl bg-quest-card border border-quest-border">
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className={`w-7 h-7 rounded-lg ${bg} border border-quest-border flex items-center justify-center`}
        >
          <i className={`${icon} ${color} text-sm`} />
        </div>
        <span className="text-xs text-quest-textDim">{label}</span>
      </div>
      <div className={`text-xl font-bold ${color}`}>
        {value}
        {suffix || ""}
      </div>
    </div>
  );
}

function BadgeCard({ badge, onClick }: { badge: any; onClick: () => void }) {
  const cfg = rarityConfig[badge.rarity as BadgeRarity] || rarityConfig.Common;
  const badgeIcon = badge.icon || "ri-medal-line";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative rounded-xl border p-5 cursor-pointer transition-all group ${
        badge.isEarned
          ? `bg-quest-card ${cfg.border} hover:shadow-lg ${cfg.glow}`
          : "bg-quest-card/80 border-quest-border/60 hover:border-quest-primary/40 hover:bg-quest-card"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            badge.isEarned
              ? `${cfg.bg} ${cfg.border}`
              : "bg-quest-bg/80 border-quest-border"
          }`}
        >
          <i
            className={`${badgeIcon} text-2xl ${badge.isEarned ? cfg.text : "text-slate-400"}`}
          />
        </div>

        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}
        >
          {badge.rarity}
        </span>
      </div>

      <h3
        className={`text-sm font-bold mb-1.5 ${badge.isEarned ? "text-quest-text" : "text-slate-200"}`}
      >
        {badge.name || badge.title}
      </h3>

      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
        {badge.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-quest-border/40">
        <div className="flex items-center gap-1.5">
          <i className="ri-flashlight-line text-xs text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">
            +{badge.xpBonus} XP
          </span>
        </div>

        {badge.isEarned ? (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
            <i className="ri-check-double-line text-sm" />
            <span>Earned</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-quest-bg overflow-hidden border border-quest-border/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                style={{
                  width: `${Math.min((badge.progressCurrent / badge.progressTarget) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {badge.progressCurrent}/{badge.progressTarget}
            </span>
          </div>
        )}
      </div>

      {!badge.isEarned && (
        <div className="absolute top-3 right-3 text-slate-600/40 pointer-events-none">
          <i className="ri-lock-2-line text-lg" />
        </div>
      )}
    </motion.div>
  );
}

function BadgeDetail({ badge, onClose }: { badge: any; onClose: () => void }) {
  const cfg = rarityConfig[badge.rarity as BadgeRarity] || rarityConfig.Common;
  const badgeIcon = badge.icon || "ri-medal-line";

  return (
    <div className="text-center relative">
      <button
        onClick={onClose}
        className="absolute -top-1 -right-1 w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <i className="ri-close-line text-lg" />
      </button>

      <div
        className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center border-2 mb-4 shadow-lg ${
          badge.isEarned
            ? `${cfg.bg} ${cfg.border}`
            : "bg-quest-bg border-quest-border"
        }`}
      >
        <i
          className={`${badgeIcon} text-4xl ${badge.isEarned ? cfg.text : "text-slate-400"}`}
        />
      </div>

      <span
        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} mb-3`}
      >
        {badge.rarity} &middot;{" "}
        {badge.categoryName || badge.category || "General"}
      </span>

      <h2
        className={`text-xl font-bold mb-2 ${badge.isEarned ? "text-white" : "text-slate-100"}`}
      >
        {badge.name || badge.title}
      </h2>

      <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-5 px-2">
        {badge.description}
      </p>

      {badge.requirement && (
        <div className="p-3.5 rounded-xl bg-quest-bg/80 border border-quest-border mb-5 text-left">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
            Requirement
          </span>
          <p className="text-xs text-slate-200 font-medium">
            {badge.requirement}
          </p>
        </div>
      )}

      {!badge.isEarned && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-200 font-bold">
              {badge.progressCurrent} / {badge.progressTarget}
            </span>
          </div>
          <div className="h-2 rounded-full bg-quest-bg overflow-hidden border border-quest-border/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((badge.progressCurrent / badge.progressTarget) * 100, 100)}%`,
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3">
        <i className="ri-flashlight-fill text-amber-400 text-base" />
        <span className="text-sm font-bold text-amber-400">
          +{badge.xpBonus} XP Bonus
        </span>
      </div>

      {!badge.isEarned && (
        <p className="text-[11px] text-slate-400 italic">
          Keep progressing to unlock this badge!
        </p>
      )}
    </div>
  );
}
