import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  getFacultyQuests,
  updateFacultyQuest,
  deleteFacultyQuest,
  getStudentProgressForQuest,
  type FacultyQuest,
} from '@/sampleData/facultyContentData';

export default function QuestManager({
  onCreate,
  onEdit,
  onViewProgress,
}: {
  onCreate: () => void;
  onEdit: (quest: FacultyQuest) => void;
  onViewProgress: (quest: FacultyQuest) => void;
}) {
  const [quests, setQuests] = useState<FacultyQuest[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  // Synchronize data mula sa LocalStorage/Data Layer
  const refresh = () => {
    const data = getFacultyQuests();
    setQuests(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  // Filtered Logic para sa Table
  const filtered = quests.filter((q) => {
    const currentStatus = (q.status || '').toLowerCase();
    const targetStatus = filter.toLowerCase();
    return targetStatus === 'all' || currentStatus === targetStatus;
  });

  // Real-time Status Switcher (Published <-> Draft)
  const handleToggleStatus = (quest: FacultyQuest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus: 'published' | 'draft' =
      quest.status === 'published' ? 'draft' : 'published';

    updateFacultyQuest(quest.id, { status: newStatus });
    refresh();
  };

  // Real-time Archive Switcher (Archive <-> Restore to Draft)
  const handleToggleArchive = (quest: FacultyQuest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus: 'archived' | 'draft' =
      quest.status === 'archived' ? 'draft' : 'archived';

    updateFacultyQuest(quest.id, { status: newStatus });
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteFacultyQuest(id);
    setDeleteConfirm(null);
    refresh();
  };

  const handleDuplicate = (quest: FacultyQuest) => {
    const questsList = getFacultyQuests();
    const dup: FacultyQuest = {
      ...quest,
      id: `faculty-quest-${Date.now()}`,
      title: `${quest.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    questsList.push(dup);
    localStorage.setItem('itquest_faculty_quests', JSON.stringify(questsList));
    refresh();
  };

  const getCompletionRate = (questId: string) => {
    const progress = getStudentProgressForQuest(questId);
    if (progress.length === 0) return 0;
    const completed = progress.filter((p) => p.status === 'completed').length;
    return Math.round((completed / progress.length) * 100);
  };

  // Statistics Calculations
  const totalQuests = quests.length;
  const publishedQuests = quests.filter(
    (quest) => quest.status?.toLowerCase() === 'published'
  ).length;
  const draftQuests = quests.filter(
    (quest) => quest.status?.toLowerCase() === 'draft'
  ).length;

  return (
    <div className="w-full space-y-6 font-sans antialiased text-slate-100">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-100 via-cyan-100 to-teal-200 bg-clip-text text-transparent tracking-tight">
            Quest Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, assign, and track gamified learning quests and student progress.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] cursor-pointer whitespace-nowrap active:scale-95"
        >
          <i className="ri-add-line text-base font-black transition-transform duration-300 group-hover:rotate-90" />
          <span>Create Quest</span>
        </button>
      </div>

      {/* STATISTICS (INTERACTIVE & CLICKABLE CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Quests Card */}
        <div
          onClick={() => setFilter('all')}
          className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
            filter === 'all'
              ? 'bg-cyan-950/40 border border-cyan-500/50 ring-1 ring-cyan-500/50 shadow-[0_8px_32px_rgba(6,182,212,0.25)]'
              : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 hover:border-sky-500/30'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <i className="ri-sword-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">
              {totalQuests}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Total Quests
            </p>
          </div>
        </div>

        {/* Published Quests Card */}
        <div
          onClick={() => setFilter('published')}
          className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
            filter === 'published'
              ? 'bg-emerald-950/40 border border-emerald-500/50 ring-1 ring-emerald-500/50 shadow-[0_8px_32px_rgba(52,211,153,0.25)]'
              : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/30'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
            <i className="ri-checkbox-circle-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">
              {publishedQuests}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Published Quests
            </p>
          </div>
        </div>

        {/* Draft Quests Card */}
        <div
          onClick={() => setFilter('draft')}
          className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
            filter === 'draft'
              ? 'bg-amber-950/40 border border-amber-500/50 ring-1 ring-amber-500/50 shadow-[0_8px_32px_rgba(251,191,36,0.25)]'
              : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/30'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            <i className="ri-draft-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">
              {draftQuests}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Draft Quests
            </p>
          </div>
        </div>

      </div>

      {/* QUEST TABLE CONTAINER */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]">

        {/* TABLE HEADER & CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-slate-800/80 bg-slate-950/30">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Quest Library
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              View and manage all available quests.
            </p>
          </div>

          {/* STATUS FILTER TABS (ALL ➔ PUBLISHED ➔ DRAFT ➔ ARCHIVED) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-x-auto">
            {(['all', 'published', 'draft', 'archived'] as const).map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? 'text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeQuestFilterBg"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 border border-cyan-500/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">
                    {f === 'all' ? 'All Quests' : f}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="px-5 py-4 font-semibold">Quest Details</th>
                <th className="px-4 py-4 font-semibold text-center hidden md:table-cell">Objectives</th>
                <th className="px-4 py-4 font-semibold text-center hidden sm:table-cell">XP Reward</th>
                <th className="px-4 py-4 font-semibold text-center hidden lg:table-cell">Students</th>
                <th className="px-4 py-4 font-semibold hidden lg:table-cell">Completion</th>
                <th className="px-4 py-4 font-semibold hidden sm:table-cell">Created</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50 text-sm">
              {filtered.map((quest) => {
                const progress = getStudentProgressForQuest(quest.id);
                const completionRate = getCompletionRate(quest.id);

                return (
                  <tr
                    key={quest.id}
                    className="group hover:bg-gradient-to-r hover:from-cyan-950/10 hover:via-slate-800/20 hover:to-transparent transition-colors duration-200"
                  >
                    {/* Quest Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="hidden sm:flex shrink-0 w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 items-center justify-center text-cyan-400 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all duration-200">
                          <i className="ri-compass-3-line text-base" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors duration-200 truncate max-w-[240px]">
                            {quest.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px]" title={quest.subtitle}>
                            {quest.subtitle || 'No subtitle provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Objectives Count */}
                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-300 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/50 border border-slate-800 font-semibold">
                        {quest.objectives?.length || 0}
                      </span>
                    </td>

                    {/* XP Reward */}
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-amber-400 bg-amber-950/20 border border-amber-500/20 px-2.5 py-1 rounded-md">
                        <i className="ri-flashlight-line text-amber-400" />
                        {quest.xpReward} XP
                      </span>
                    </td>

                    {/* Students Count */}
                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-300 hidden lg:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/50 border border-slate-800 font-semibold">
                        {progress.length}
                      </span>
                    </td>

                    {/* Completion Progress Bar */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 h-2 rounded-full bg-slate-950/80 border border-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {completionRate}%
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-4 text-xs font-mono text-slate-400 whitespace-nowrap hidden sm:table-cell">
                      {quest.createdAt
                        ? new Date(quest.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>

                    {/* Clickable Status Badge */}
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => handleToggleStatus(quest, e)}
                        title="Click to toggle status (Published <-> Draft)"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md cursor-pointer transition-all ${
                          quest.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : quest.status === 'archived'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            quest.status === 'published'
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                              : quest.status === 'archived'
                              ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                              : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          }`}
                        />
                        <span className="capitalize">{quest.status}</span>
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">

                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(quest)}
                          className="p-2 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                          title="Edit Quest"
                        >
                          <i className="ri-edit-line text-sm" />
                        </button>

                        {/* Duplicate Button */}
                        <button
                          onClick={() => handleDuplicate(quest)}
                          className="p-2 rounded-xl bg-slate-800/50 hover:bg-teal-500/10 border border-slate-700/50 hover:border-teal-500/30 text-slate-300 hover:text-teal-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                          title="Duplicate Quest"
                        >
                          <i className="ri-file-copy-line text-sm" />
                        </button>

                        {/* View Progress Button */}
                        <button
                          onClick={() => onViewProgress(quest)}
                          className="p-2 rounded-xl bg-slate-800/50 hover:bg-sky-500/10 border border-slate-700/50 hover:border-sky-500/30 text-slate-300 hover:text-sky-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                          title="View Student Progress"
                        >
                          <i className="ri-bar-chart-line text-sm" />
                        </button>

                        {/* Publish / Draft Toggle Button */}
                        <button
                          onClick={(e) => handleToggleStatus(quest, e)}
                          className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
                            quest.status === 'published'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          }`}
                          title={quest.status === 'published' ? 'Unpublish (Set to Draft)' : 'Publish Quest'}
                        >
                          <i className={quest.status === 'published' ? 'ri-close-circle-line text-sm' : 'ri-check-line text-sm'} />
                        </button>

                        {/* Archive / Restore Button */}
                        <button
                          onClick={(e) => handleToggleArchive(quest, e)}
                          className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                            quest.status === 'archived'
                              ? 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 hover:border-sky-500/40 text-sky-400'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/40 text-rose-400'
                          }`}
                          title={quest.status === 'archived' ? 'Restore from Archive' : 'Archive Quest'}
                        >
                          <i className={quest.status === 'archived' ? 'ri-inbox-unarchive-line text-sm' : 'ri-archive-line text-sm'} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirm(quest.id)}
                          className="p-2 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 border border-slate-700/50 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all duration-200 cursor-pointer"
                          title="Delete Quest"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 text-xl">
                        <i className="ri-folder-open-line" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        No {filter !== 'all' ? filter : ''} quests found.
                      </p>
                      <p className="text-xs text-slate-500">
                        There are currently no quests matching this filter.
                      </p>
                      <button
                        onClick={onCreate}
                        className="mt-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer"
                      >
                        Create a new quest
                      </button>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-800/80 bg-slate-950/50 text-xs text-slate-400">
          <p>
            Showing <span className="font-mono text-cyan-400 font-semibold">{filtered.length}</span> of <span className="font-mono text-slate-200">{totalQuests}</span> quests
          </p>
          <p className="font-medium text-slate-500">
            Quest Library
          </p>
        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xl flex-shrink-0">
                  <i className="ri-delete-bin-line" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Delete Quest?
                  </h3>
                  <p className="text-xs text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 mb-6 leading-relaxed">
                All student progress and submissions recorded for this quest will be permanently removed.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-semibold shadow-[0_0_16px_rgba(244,63,94,0.3)] transition-all duration-200 cursor-pointer"
                >
                  Delete Quest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
