import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface QuestLink {
  id: string;
  title: string;
  description: string;
  category: string;
  targetCount: number;
  currentProgress: number;
  xpReward: number;
  badgeReward?: string;
  isCompleted: boolean;
  isClaimed?: boolean;
}

interface QuestLinksTabProps {
  onRewardClaimed?: () => void;
}

export default function QuestLinksTab({ onRewardClaimed }: QuestLinksTabProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [questLinks, setQuestLinks] = useState<QuestLink[]>([]);

  const fetchQuestLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/quest-links');
      if (res.data?.success && Array.isArray(res.data?.questLinks)) {
        setQuestLinks(res.data.questLinks);
      }
    } catch (err) {
      console.warn("Quest Links API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestLinks();
  }, []);

  const handleClaimReward = async (questId: string) => {
    try {
      setClaimingId(questId);
      const res = await api.post(`/student/quest-links/${questId}/claim`);
      if (res.data?.success) {
        setQuestLinks((prev) =>
          prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
        );
        if (onRewardClaimed) onRewardClaimed();
      }
    } catch (err) {
      console.error("Failed to claim reward:", err);
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-quest-textMuted">
        <i className="ri-loader-4-line animate-spin text-2xl text-purple-400 mb-2 inline-block" />
        <p className="text-sm">Fetching Active Quest Links...</p>
      </div>
    );
  }

  return (
    <div className="bg-quest-card border border-quest-border rounded-xl p-6 select-none">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <i className="ri-git-branch-line text-purple-400" /> Active Quest Links
          </h3>
          <p className="text-xs text-quest-textMuted mt-1">
            Mga naka-link na Quests para sa bonus XP, RP Rewards, at Badges.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {questLinks.length} Quests Available
        </span>
      </div>

      <div className="space-y-4">
        {questLinks.map((quest) => {
          const progressPercent = Math.min(
            100,
            Math.round((quest.currentProgress / quest.targetCount) * 100)
          );

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border transition-all ${
                quest.isCompleted
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                      quest.isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    }`}
                  >
                    <i className={quest.isCompleted ? "ri-checkbox-circle-fill text-xl" : "ri-sword-line text-xl"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{quest.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                        {quest.category}
                      </span>
                    </div>
                    <p className="text-xs text-quest-textMuted mt-1">{quest.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <i className="ri-shield-flash-line" /> +{quest.xpReward} XP
                  </span>
                  {quest.badgeReward && (
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <i className="ri-award-line" /> {quest.badgeReward}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar & Dynamic Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-quest-textDim">Progress</span>
                    <span className="font-mono font-bold text-white">
                      {quest.currentProgress} / {quest.targetCount} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        quest.isCompleted ? "bg-emerald-400" : "bg-purple-500"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {quest.isCompleted ? (
                  <button
                    disabled={quest.isClaimed || claimingId === quest.id}
                    onClick={() => handleClaimReward(quest.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
                      quest.isClaimed
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    }`}
                  >
                    {claimingId === quest.id ? (
                      <i className="ri-loader-4-line animate-spin" />
                    ) : (
                      <i className={quest.isClaimed ? "ri-check-line" : "ri-gift-line"} />
                    )}
                    {quest.isClaimed ? "Reward Claimed" : "Claim Quest Reward"}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/quiz-battle')}
                    className="px-4 py-2 rounded-lg font-bold text-xs bg-purple-600 text-white hover:bg-purple-500 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="ri-play-line" />
                    Start Quest Quiz
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}