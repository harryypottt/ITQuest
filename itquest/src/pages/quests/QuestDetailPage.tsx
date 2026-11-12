import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useQuestProgressEngine, markQuestAccepted } from '@/hooks/useQuestProgressEngine';
import { startQuest as startQuestApi } from '@/services/api';
import QuestDetailPanel from './components/QuestDetail';
import AcceptModal from './components/AcceptModal';
import CompletionModal from './components/CompletionModal';

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ─── KUNIN ANG DATA MULA SA LIVE DATABASE / ENGINE ───
  const { allQuests, allQuestsProgress, questStatusMap, refresh } = useQuestProgressEngine();

  // Hanapin ang quest sa live DB quests list
  const quest = useMemo(() => allQuests.find((q: any) => q.id === id) || null, [allQuests, id]);
 
  const [acceptQuest, setAcceptQuest] = useState<any>(null);
  const [completeQuest, setCompleteQuest] = useState<any>(null);

  const status = quest ? (questStatusMap[quest.id] || 'not_started') : 'not_started';
 
  const questInfo = quest ? (allQuestsProgress[quest.id] || {
    quest: {
      ...quest,
      difficulty: String(quest.difficulty || 1),
    },
    status: 'not_started' as const,
    objectiveProgress: (quest.objectives || []).map((o: any) => ({
      objectiveId: o.id || o.objectiveId,
      isCompleted: false,
      progressPercent: 0,
      progressDetail: 'Not started',
    })),
    completedCount: 0,
    totalCount: (quest.objectives || []).length,
    progressPercent: 0,
    allCompleted: false,
    nextObjective: (quest.objectives || [])[0] || null,
  }) : null;

  // ─── HANDLER FOR STARTING / ACCEPTING QUEST ───
  const handleAccept = async (q: any) => {
    if (!q || !q.id) return;

    try {
      const currentXP = user?.total_xp || user?.xp || 0;
      // 1. Mark accepted locally & save current user XP as quest start XP
      markQuestAccepted(q.id, currentXP);

      // 2. Call backend API
      await startQuestApi(q.id);
    } catch (error) {
      console.error('Failed to start quest via API:', error);
    } finally {
      // 3. Always close modal and refresh state
      setAcceptQuest(null);
      await refresh();
    }
  };

  if (!quest) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-2xl text-quest-textDim" />
            </div>
            <h3 className="text-lg font-bold text-quest-text mb-2">Quest Not Found</h3>
            <p className="text-sm text-quest-textMuted mb-4">This quest has vanished into the void or is loading from database.</p>
            <button
              onClick={() => navigate('/quests')}
              className="px-4 py-2 rounded-lg bg-quest-primary/10 border border-quest-primary/20 text-quest-primary text-sm font-semibold hover:bg-quest-primary/20 transition-all cursor-pointer"
            >
              Back to Quest Hub
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/quests')}
          className="flex items-center gap-2 text-sm text-quest-textDim hover:text-quest-text transition-all mb-6 cursor-pointer"
        >
          <i className="ri-arrow-left-line" />
          Back to Quest Hub
        </button>

        {questInfo && (
          <QuestDetailPanel
            quest={quest as any}
            questInfo={questInfo as any}
            status={status}
            onAccept={() => handleAccept(quest)}
            onClose={() => navigate('/quests')}
          />
        )}

        <AcceptModal
          isOpen={!!acceptQuest}
          quest={acceptQuest}
          onConfirm={() => {
            if (acceptQuest) handleAccept(acceptQuest);
          }}
          onClose={() => setAcceptQuest(null)}
        />

        <CompletionModal
          isOpen={!!completeQuest}
          quest={completeQuest}
          onClose={() => setCompleteQuest(null)}
        />
      </div>
    </DashboardLayout>
  );
}