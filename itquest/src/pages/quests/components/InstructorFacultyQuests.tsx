import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublishedFacultyQuests, getFacultyQuestProgress } from '@/sampleData/facultyContentData';
import type { FacultyQuest } from '@/sampleData/facultyContentData';
import { useQuestProgressEngine } from '@/hooks/useQuestProgressEngine';
import InstructorFilterBar from '@/components/feature/InstructorFilterBar';
import type { InstructorOption } from '@/components/feature/InstructorFilterBar';

/**
 * Faculty quests list shown inside the Quests hub, with an instructor filter so
 * students can jump straight to a specific teacher's quests.
 */
export default function InstructorFacultyQuests() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<FacultyQuest[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const { allQuestsProgress } = useQuestProgressEngine();
  const facultyProgress = getFacultyQuestProgress();

  useEffect(() => {
    setQuests(getPublishedFacultyQuests());
  }, []);

  const instructors = useMemo<InstructorOption[]>(() => {
    const map = new Map<string, InstructorOption>();
    quests.forEach((q) => {
      const existing = map.get(q.createdBy);
      if (existing) existing.count += 1;
      else map.set(q.createdBy, { id: q.createdBy, name: q.creatorName, count: 1 });
    });
    return Array.from(map.values());
  }, [quests]);

  const filtered = useMemo(() => {
    if (selectedInstructor === 'all') return quests;
    return quests.filter((q) => q.createdBy === selectedInstructor);
  }, [quests, selectedInstructor]);

  const activeName = selectedInstructor === 'all'
    ? null
    : instructors.find((i) => i.id === selectedInstructor)?.name || null;

  const getStatus = (questId: string) => {
    const entry = facultyProgress.find((p: { questId: string }) => p.questId === questId);
    return entry?.status || 'not_started';
  };

  const getProgress = (quest: FacultyQuest) => {
    const info = allQuestsProgress[quest.id];
    return info?.progressPercent || 0;
  };

  const getDifficultyLabel = (d: number) => {
    const map = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return map[d - 1] || 'Unknown';
  };

  const getDifficultyColor = (d: number) => {
    if (d <= 2) return 'text-emerald-400';
    if (d === 3) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-5">
      <InstructorFilterBar
        instructors={instructors}
        selectedInstructor={selectedInstructor}
        onSelectInstructor={setSelectedInstructor}
        totalCount={quests.length}
        itemNoun="quest"
      />

      <div className="flex items-center gap-2">
        <i className="ri-user-star-line text-amber-400" />
        <h3 className="text-sm font-bold text-quest-text">
          {activeName ? `${activeName}'s Quests` : 'Quests From Your Instructors'}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
          <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
            <i className="ri-graduation-cap-line text-2xl text-quest-textDim" />
          </div>
          <h3 className="text-lg font-bold text-quest-text mb-2">No Faculty Quests</h3>
          <p className="text-sm text-quest-textMuted">Try another instructor — no quests available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((quest) => {
            const status = getStatus(quest.id);
            const progress = getProgress(quest);
            const lessonCount = quest.objectives.filter((o) => o.type === 'lesson').length;
            const quizCount = quest.objectives.filter((o) => o.type === 'quiz').length;

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative p-5 rounded-xl bg-quest-card border border-quest-border hover:border-quest-primary/40 transition-all cursor-pointer"
                onClick={() => navigate(`/faculty-quests/${quest.id}`)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    Faculty Quest
                  </span>
                  {status === 'completed' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      Completed
                    </span>
                  )}
                  {status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                      In Progress
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-quest-text mb-1 group-hover:text-quest-primary transition-colors">
                  {quest.title}
                </h3>
                <p className="text-sm text-quest-textMuted mb-1">{quest.subtitle}</p>
                <p className="text-xs text-quest-textDim mb-4 line-clamp-2">{quest.description}</p>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-user-line text-amber-400" />
                    {quest.creatorName}
                  </span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${getDifficultyColor(quest.difficulty)}`}>
                    <i className="ri-sword-line" />
                    {getDifficultyLabel(quest.difficulty)}
                  </span>
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-time-line" />
                    {quest.estimatedMinutes}m
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-book-open-line text-emerald-400" />
                    {lessonCount} Lesson{lessonCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-questionnaire-line text-rose-400" />
                    {quizCount} Quiz{quizCount !== 1 ? 'zes' : ''}
                  </span>
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-flashlight-line text-yellow-400" />
                    {quest.xpReward} XP
                  </span>
                </div>

                {status === 'active' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-quest-textDim">Progress</span>
                      <span className="text-quest-text">{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full rounded-full bg-quest-primary"
                      />
                    </div>
                  </div>
                )}

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-quest-primary/10 text-quest-primary text-sm font-medium hover:bg-quest-primary/20 transition-all cursor-pointer whitespace-nowrap">
                  {status === 'completed' ? 'View Quest' : status === 'active' ? 'Continue' : 'View Quest'}
                  <i className="ri-arrow-right-line" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}