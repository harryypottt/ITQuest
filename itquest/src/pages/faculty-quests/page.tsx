import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  getPublishedFacultyQuests,
  getFacultyQuestProgress,
  type FacultyQuest,
} from '@/sampleData/facultyContentData';
import { useQuestProgressEngine } from '@/hooks/useQuestProgressEngine';
import InstructorFilterBar from '@/components/feature/InstructorFilterBar';
import type { InstructorOption } from '@/components/feature/InstructorFilterBar';

export default function FacultyQuestsPage() {
  const navigate = useNavigate();
  const [quests] = useState<FacultyQuest[]>(getPublishedFacultyQuests());
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const { allQuestsProgress } = useQuestProgressEngine();

  const facultyProgress = getFacultyQuestProgress();

  const instructors = useMemo<InstructorOption[]>(() => {
    const map = new Map<string, InstructorOption>();
    quests.forEach((q) => {
      const existing = map.get(q.createdBy);
      if (existing) existing.count += 1;
      else map.set(q.createdBy, { id: q.createdBy, name: q.creatorName, count: 1 });
    });
    return Array.from(map.values());
  }, [quests]);

  const getStatus = (questId: string) => {
    const entry = facultyProgress.find((p: any) => p.questId === questId);
    return entry?.status || 'not_started';
  };

  const getProgress = (quest: FacultyQuest) => {
    const info = allQuestsProgress[quest.id];
    if (!info) return 0;
    return info.progressPercent || 0;
  };

  const activeName = selectedInstructor === 'all'
    ? null
    : instructors.find((i) => i.id === selectedInstructor)?.name || null;

  const filtered = useMemo(() => {
    let list = quests;
    if (selectedInstructor !== 'all') {
      list = list.filter((q) => q.createdBy === selectedInstructor);
    }
    if (filter !== 'all') {
      list = list.filter((q) => getStatus(q.id) === filter);
    }
    return list;
  }, [quests, filter, selectedInstructor]);

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
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <i className="ri-graduation-cap-line text-lg text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text">Faculty Quests</h1>
              <p className="text-sm text-quest-textMuted">Complete additional learning quests created by your instructors.</p>
            </div>
          </div>
        </div>

        {/* Instructor filter */}
        <div className="mb-4">
          <InstructorFilterBar
            instructors={instructors}
            selectedInstructor={selectedInstructor}
            onSelectInstructor={setSelectedInstructor}
            totalCount={quests.length}
            itemNoun="quest"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-quest-card border border-quest-border rounded-full p-1 mb-4 overflow-x-auto">
          {(['all', 'in-progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === f
                  ? 'bg-quest-primary text-white shadow-lg shadow-emerald-500/20'
                  : 'text-quest-textDim hover:text-quest-text'
              }`}
            >
              {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Section heading */}
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-user-star-line text-amber-400" />
          <h2 className="text-sm font-bold text-quest-text">
            {activeName ? `${activeName}'s Quests` : 'Quests From Your Instructors'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
            {filtered.length}
          </span>
        </div>

        {/* Quest Grid */}
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
                {/* Faculty Badge */}
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

        {filtered.length === 0 && (
          <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
              <i className="ri-graduation-cap-line text-2xl text-quest-textDim" />
            </div>
            <h3 className="text-lg font-bold text-quest-text mb-2">No Faculty Quests</h3>
            <p className="text-sm text-quest-textMuted">
              {activeName
                ? `No ${filter !== 'all' ? `${filter.replace('-', ' ')} ` : ''}quests from ${activeName} right now.`
                : `No ${filter !== 'all' ? `${filter.replace('-', ' ')} ` : ''}faculty quests available right now.`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}