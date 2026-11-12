import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type FacultyQuiz } from '@/sampleData/facultyContentData';
import QuizBuilder from './QuizBuilder';

const ALL_TOPICS = [
  'All',
  'JavaScript',
  'HTML/CSS',
  'React',
  'Database',
  'Node.js',
  'Cybersecurity',
  'UI/UX',
  'General',
];

const getTopicBadgeStyle = (topic: string) => {
  const normalized = (topic || '').toLowerCase().trim();

  switch (normalized) {
    case 'javascript':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'react':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'html/css':
    case 'html':
    case 'css':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    case 'database':
    case 'sql':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'node.js':
    case 'nodejs':
    case 'node':
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'cybersecurity':
    case 'security':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'ui/ux':
    case 'uiux':
    case 'design':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'general':
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    default:
      return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  }
};

type SortOption = 'newest' | 'title' | 'questions';

// 🌟 INIDAGDAG: Interface para mawala ang TypeScript error sa page.tsx
interface QuizManagerProps {
  quizzes?: FacultyQuiz[];
  onCreate?: () => void;
  onEdit?: (quiz: FacultyQuiz) => void;
  onStatusToggle?: (id: string, currentStatus: string) => void;
  onDelete?: (id: string) => void;
}

export default function QuizManager({
  quizzes: propsQuizzes,
  onCreate,
  onEdit,
  onStatusToggle,
  onDelete,
}: QuizManagerProps) {
  const [quizzesList, setQuizzesList] = useState<FacultyQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Modal State para sa Quiz Builder (Fallback kung walang parent handler)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<FacultyQuiz | undefined>(undefined);

  // 🚀 API FETCH: Kunin ang Quizzes sa Express API kapag walang binigay na propsQuizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/faculty/quizzes');
      if (res.ok) {
        const data = await res.json();
        setQuizzesList(data);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propsQuizzes) {
      setQuizzesList(propsQuizzes);
      setLoading(false);
    } else {
      fetchQuizzes();
    }
  }, [propsQuizzes]);

  const displayList = propsQuizzes && propsQuizzes.length > 0 ? propsQuizzes : quizzesList;

  const availableTopics = Array.from(
    new Set([
      ...ALL_TOPICS,
      ...displayList.map((q) => q.topic).filter(Boolean),
    ])
  );

  // Statistics Calculations
  const totalQuizzes = displayList.length;
  const publishedQuizzes = displayList.filter(
    (q) => q.status?.toLowerCase() === 'published'
  ).length;
  const draftQuizzes = displayList.filter(
    (q) => q.status?.toLowerCase() === 'draft'
  ).length;

  // 🚀 API Status Switcher (PATCH request)
  const handleToggleStatus = async (quiz: FacultyQuiz, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = quiz.status === 'published' ? 'draft' : 'published';

    if (onStatusToggle) {
      onStatusToggle(quiz.id, newStatus);
    } else {
      try {
        const res = await fetch(`http://localhost:5000/api/faculty/quizzes/${quiz.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
          fetchQuizzes();
        }
      } catch (err) {
        console.error('Error updating status:', err);
      }
    }
  };

  // 🚀 API Archive Switcher (PATCH request)
  const handleToggleArchive = async (quiz: FacultyQuiz, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = quiz.status === 'archived' ? 'draft' : 'archived';

    if (onStatusToggle) {
      onStatusToggle(quiz.id, newStatus);
    } else {
      try {
        const res = await fetch(`http://localhost:5000/api/faculty/quizzes/${quiz.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
          fetchQuizzes();
        }
      } catch (err) {
        console.error('Error updating archive status:', err);
      }
    }
  };

  // 🚀 API Delete
  const handleDelete = async (id: string) => {
    if (onDelete) {
      onDelete(id);
    } else {
      try {
        const res = await fetch(`http://localhost:5000/api/faculty/quizzes/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          fetchQuizzes();
        }
      } catch (err) {
        console.error('Error deleting quiz:', err);
      }
    }
    setDeleteConfirm(null);
  };

  const handleOpenCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      setEditingQuiz(undefined);
      setIsBuilderOpen(true);
    }
  };

  const handleOpenEdit = (quiz: FacultyQuiz) => {
    if (onEdit) {
      onEdit(quiz);
    } else {
      setEditingQuiz(quiz);
      setIsBuilderOpen(true);
    }
  };

  // Filter & Sort Logic
  const filtered = displayList
    .filter((quiz) => {
      const currentStatus = (quiz.status || '').toLowerCase();
      const targetStatus = filter.toLowerCase();

      const matchesStatus = targetStatus === 'all' || currentStatus === targetStatus;
      const matchesTopic =
        selectedTopic === 'All' ||
        (quiz.topic && quiz.topic.toLowerCase() === selectedTopic.toLowerCase());

      return matchesStatus && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'questions') {
        return (b.questions?.length || 0) - (a.questions?.length || 0);
      }
      // Default: newest
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

  if (isBuilderOpen) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl">
        <QuizBuilder
          editingQuiz={editingQuiz}
          onClose={() => setIsBuilderOpen(false)}
          onSuccess={() => {
            setIsBuilderOpen(false);
            fetchQuizzes();
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-sans antialiased text-slate-100">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-100 via-cyan-100 to-teal-200 bg-clip-text text-transparent tracking-tight">
            Quiz Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, configure, and monitor interactive quizzes and assessments.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] cursor-pointer whitespace-nowrap active:scale-95"
        >
          <i className="ri-add-line text-base font-black transition-transform duration-300 group-hover:rotate-90" />
          <span>Create Quiz</span>
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Quizzes */}
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
            <i className="ri-questionnaire-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">
              {totalQuizzes}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Total Quizzes
            </p>
          </div>
        </div>

        {/* Published Quizzes */}
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
              {publishedQuizzes}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Published Quizzes
            </p>
          </div>
        </div>

        {/* Draft Quizzes */}
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
              {draftQuizzes}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Draft Quizzes
            </p>
          </div>
        </div>

      </div>

      {/* QUIZ TABLE CONTAINER */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]">

        {/* TABLE HEADER & CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-slate-800/80 bg-slate-950/30">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Quiz Library
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              View, filter by topic, sort, and manage all quiz modules.
            </p>
          </div>

          {/* DYNAMIC FILTERS & CSS-STYLED DROPDOWNS */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Custom CSS Topic Filter */}
            <div className="relative inline-flex items-center">
              <i className="ri-filter-3-line absolute left-3 text-xs text-cyan-400 pointer-events-none" />
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="appearance-none bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm transition-all"
              >
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic} className="bg-slate-900 text-slate-200">
                    {topic === 'All' ? 'Topic: All Topics' : `Topic: ${topic}`}
                  </option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 text-xs text-slate-400 pointer-events-none" />
            </div>

            {/* Custom CSS Sort (Without Oldest option) */}
            <div className="relative inline-flex items-center">
              <i className="ri-sort-desc absolute left-3 text-xs text-teal-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer shadow-sm transition-all"
              >
                <option value="newest" className="bg-slate-900 text-slate-200">Sort: Newest First</option>
                <option value="title" className="bg-slate-900 text-slate-200">Sort: Title (A-Z)</option>
                <option value="questions" className="bg-slate-900 text-slate-200">Sort: Most Questions</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 text-xs text-slate-400 pointer-events-none" />
            </div>

            {/* Status Tabs Filter */}
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
                        layoutId="activeQuizFilterBg"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 border border-cyan-500/30"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 capitalize">
                      {f === 'all' ? 'All Status' : f}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="px-5 py-4 font-semibold">Quiz Details</th>
                <th className="px-4 py-4 font-semibold hidden md:table-cell">Topic</th>
                <th className="px-4 py-4 font-semibold text-center hidden sm:table-cell">Questions</th>
                <th className="px-4 py-4 font-semibold text-center hidden sm:table-cell">Time Limit</th>
                <th className="px-4 py-4 font-semibold hidden lg:table-cell">Pass Score</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-slate-400">
                    Loading quizzes from server...
                  </td>
                </tr>
              ) : filtered.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="group hover:bg-gradient-to-r hover:from-cyan-950/10 hover:via-slate-800/20 hover:to-transparent transition-colors duration-200"
                >
                  {/* Quiz Details */}
                  <td className="px-5 py-4 max-w-[280px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="hidden sm:flex shrink-0 w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 items-center justify-center text-cyan-400 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all">
                        <i className="ri-questionnaire-line text-base" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate max-w-[240px]">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px]" title={quiz.description}>
                          {quiz.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Topic Badge */}
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getTopicBadgeStyle(quiz.topic)}`}>
                      {quiz.topic}
                    </span>
                  </td>

                  {/* Questions Count */}
                  <td className="px-4 py-4 text-center font-mono text-xs text-slate-300 hidden sm:table-cell">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/50 border border-slate-800 font-semibold">
                      {quiz.questions?.length || 0} Qs
                    </span>
                  </td>

                  {/* Time Limit */}
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      {quiz.timeLimit || 20} mins
                    </span>
                  </td>

                  {/* Passing Score */}
                  <td className="px-4 py-4 text-xs font-mono text-slate-400 whitespace-nowrap hidden lg:table-cell">
                    {quiz.passingScore || 80}%
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => handleToggleStatus(quiz, e)}
                      title="Click to toggle status (Published <-> Draft)"
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md cursor-pointer transition-all ${
                        quiz.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          : quiz.status === 'archived'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          quiz.status === 'published'
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                            : quiz.status === 'archived'
                            ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                            : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        }`}
                      />
                      <span className="capitalize">{quiz.status || 'draft'}</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(quiz)}
                        className="p-2 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
                        title="Edit Quiz"
                      >
                        <i className="ri-edit-line text-sm" />
                      </button>

                      {/* Publish / Draft Toggle */}
                      <button
                        onClick={(e) => handleToggleStatus(quiz, e)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
                          quiz.status === 'published'
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                        }`}
                        title={quiz.status === 'published' ? 'Unpublish (Set to Draft)' : 'Publish Quiz'}
                      >
                        <i className={quiz.status === 'published' ? 'ri-close-circle-line text-sm' : 'ri-check-line text-sm'} />
                      </button>

                      {/* Archive Button */}
                      <button
                        onClick={(e) => handleToggleArchive(quiz, e)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          quiz.status === 'archived'
                            ? 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 text-sky-400'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
                        }`}
                        title={quiz.status === 'archived' ? 'Restore from Archive' : 'Archive Quiz'}
                      >
                        <i className={quiz.status === 'archived' ? 'ri-inbox-unarchive-line text-sm' : 'ri-archive-line text-sm'} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirm(quiz.id)}
                        className="p-2 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 border border-slate-700/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete Quiz"
                      >
                        <i className="ri-delete-bin-line text-sm" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 text-xl">
                        <i className="ri-folder-open-line" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        No {filter !== 'all' ? filter : ''} quizzes found.
                      </p>
                      <button
                        onClick={handleOpenCreate}
                        className="mt-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer"
                      >
                        Create a new quiz
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
            Showing <span className="font-mono text-cyan-400 font-semibold">{filtered.length}</span> of <span className="font-mono text-slate-200">{totalQuizzes}</span> quizzes
          </p>
          <p className="font-medium text-slate-500">
            Quiz Management Module
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
                    Delete Quiz?
                  </h3>
                  <p className="text-xs text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-semibold shadow-[0_0_16px_rgba(244,63,94,0.3)] transition-all cursor-pointer"
                >
                  Delete Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
