import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  getFacultyQuestById,
  getFacultyLessonById,
  getFacultyQuizById,
  startFacultyQuest,
  completeFacultyQuest,
  getFacultyQuestProgress,
  getFacultyQuestStatus,
  isFacultyLessonCompleted,
  getFacultyQuizBestScore,
  type FacultyQuest,
} from '@/sampleData/facultyContentData';
import { useQuestProgressEngine } from '@/hooks/useQuestProgressEngine';

export default function FacultyQuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quest = useMemo(() => getFacultyQuestById(id || '') || null, [id]);
  const [status, setStatus] = useState(() => getFacultyQuestStatus(id || ''));

  const { allQuestsProgress, refresh } = useQuestProgressEngine();

  const questInfo = useMemo(() => {
    if (!quest) return null;
    return allQuestsProgress[quest.id] || {
      quest: quest as any,
      status: 'not_started' as const,
      objectiveProgress: quest.objectives.map((o) => {
        let isCompleted = false;
        let progressPercent = 0;
        let progressDetail = 'Not started';

        if (o.type === 'lesson' && o.contentId) {
          isCompleted = isFacultyLessonCompleted(o.contentId);
          progressPercent = isCompleted ? 100 : 0;
          progressDetail = isCompleted ? 'Lesson completed' : 'Lesson not completed';
        } else if (o.type === 'quiz' && o.contentId) {
          const bestScore = getFacultyQuizBestScore(o.contentId);
          const passed = o.minScore ? bestScore >= o.minScore : bestScore > 0;
          isCompleted = passed;
          progressPercent = passed ? 100 : bestScore > 0 ? Math.round((bestScore / (o.minScore || 100)) * 100) : 0;
          progressDetail = bestScore > 0 ? `Score: ${bestScore}%${!passed ? ` (need ${o.minScore}%)` : ''}` : 'Quiz not attempted';
        }

        return {
          objectiveId: o.id,
          isCompleted,
          progressPercent,
          progressDetail,
        };
      }),
      completedCount: 0,
      totalCount: quest.objectives.length,
      progressPercent: 0,
      allCompleted: false,
      nextObjective: quest.objectives[0] || null,
    };
  }, [quest, allQuestsProgress, status]);

  const handleAccept = useCallback(() => {
    if (!quest) return;
    startFacultyQuest(quest.id);
    setStatus('active');
    refresh();
  }, [quest, refresh]);

  const handleComplete = useCallback(() => {
    if (!quest) return;
    completeFacultyQuest(quest.id);
    setStatus('completed');
    refresh();
  }, [quest, refresh]);

  const getDifficultyLabel = (d: number) => {
    const map = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return map[d - 1] || 'Unknown';
  };

  const getDifficultyColor = (d: number) => {
    if (d <= 2) return 'text-emerald-400';
    if (d === 3) return 'text-amber-400';
    return 'text-rose-400';
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
            <p className="text-sm text-quest-textMuted mb-4">This faculty quest does not exist or has been removed.</p>
            <button
              onClick={() => navigate('/faculty-quests')}
              className="px-4 py-2 rounded-lg bg-quest-primary/10 border border-quest-primary/20 text-quest-primary text-sm font-semibold hover:bg-quest-primary/20 transition-all cursor-pointer"
            >
              Back to Faculty Quests
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const completedCount = questInfo?.objectiveProgress.filter((o: any) => o.isCompleted).length || 0;
  const totalCount = quest.objectives.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = completedCount === totalCount;

  const handleGoToLesson = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  const handleGoToQuiz = (quizId: string) => {
    navigate(`/quiz-battle/${quizId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/faculty-quests')}
          className="flex items-center gap-2 text-sm text-quest-textDim hover:text-quest-text transition-all mb-6 cursor-pointer"
        >
          <i className="ri-arrow-left-line" />
          Back to Faculty Quests
        </button>

        {/* Faculty Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
            Faculty Quest
          </span>
          <span className={`text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
            {getDifficultyLabel(quest.difficulty)}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-quest-text mb-1">{quest.title}</h1>
        <p className="text-sm text-quest-textMuted mb-2">{quest.subtitle}</p>
        <p className="text-sm text-quest-textDim mb-6">{quest.description}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-xl bg-quest-card border border-quest-border">
          <span className="text-xs text-quest-textDim flex items-center gap-1">
            <i className="ri-user-line text-amber-400" />
            Created by {quest.creatorName}
          </span>
          <span className="text-xs text-quest-textDim flex items-center gap-1">
            <i className="ri-time-line" />
            {quest.estimatedMinutes} min
          </span>
          <span className="text-xs text-quest-textDim flex items-center gap-1">
            <i className="ri-flashlight-line text-yellow-400" />
            {quest.xpReward} XP
          </span>
          {quest.badgeReward && (
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <i className="ri-medal-line" />
              {quest.badgeReward}
            </span>
          )}
        </div>

        {/* Progress */}
        {status === 'active' && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-quest-textDim">Progress</span>
              <span className="text-quest-text font-medium">{completedCount}/{totalCount} Objectives</span>
            </div>
            <div className="h-2 rounded-full bg-quest-bg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full rounded-full bg-quest-primary"
              />
            </div>
            <div className="text-xs text-quest-textDim mt-1">{progressPercent}%</div>
          </div>
        )}

        {/* Objectives */}
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-bold text-quest-text uppercase tracking-wider">Objectives</h2>
          {quest.objectives.map((obj, idx) => {
            const objInfo = questInfo?.objectiveProgress.find((o: any) => o.objectiveId === obj.id);
            const isDone = objInfo?.isCompleted || false;

            return (
              <div
                key={obj.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-quest-card border-quest-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-quest-bg border border-quest-border text-quest-textDim'
                  }`}>
                    {isDone ? <i className="ri-check-line text-xs" /> : <span className="text-xs">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">
                        {obj.type === 'lesson' ? (
                          <i className="ri-book-open-line text-emerald-400" />
                        ) : (
                          <i className="ri-questionnaire-line text-rose-400" />
                        )}
                      </span>
                      <span className="text-sm font-medium text-quest-text">{obj.title}</span>
                    </div>
                    <p className="text-xs text-quest-textDim mb-2">{obj.description}</p>
                    {obj.minScore && (
                      <p className="text-xs text-amber-400 mb-2">Required score: {obj.minScore}%</p>
                    )}
                    <p className={`text-xs ${isDone ? 'text-emerald-400' : 'text-quest-textDim'}`}>
                      {objInfo?.progressDetail || 'Not started'}
                    </p>
                    {!isDone && obj.contentId && (
                      <div className="mt-2">
                        {obj.type === 'lesson' && (
                          <button
                            onClick={() => handleGoToLesson(obj.contentId!)}
                            className="px-3 py-1.5 rounded-lg bg-quest-primary/10 text-quest-primary text-xs font-medium hover:bg-quest-primary/20 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Go to Lesson
                            <i className="ri-arrow-right-line ml-1" />
                          </button>
                        )}
                        {obj.type === 'quiz' && (
                          <button
                            onClick={() => handleGoToQuiz(obj.contentId!)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Take Quiz
                            <i className="ri-arrow-right-line ml-1" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {status === 'not_started' && (
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 rounded-lg bg-quest-primary text-white text-sm font-medium hover:bg-quest-primaryGlow transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-sword-line mr-2" />
              Accept Quest
            </button>
          )}
          {status === 'active' && allCompleted && (
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-check-double-line mr-2" />
              Complete Quest (+{quest.xpReward} XP)
            </button>
          )}
          {status === 'active' && !allCompleted && (
            <div className="flex-1 px-4 py-2.5 rounded-lg bg-quest-bg border border-quest-border text-quest-textDim text-sm text-center">
              Complete all objectives to finish this quest
            </div>
          )}
          {status === 'completed' && (
            <div className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center font-medium">
              <i className="ri-check-double-line mr-2" />
              Quest Completed — {quest.xpReward} XP Earned
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}