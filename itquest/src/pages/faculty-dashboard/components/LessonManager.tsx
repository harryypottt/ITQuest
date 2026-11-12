import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FacultyLesson } from '@/sampleData/facultyContentData';

// Master list ng mga topics para sa dynamic filtering
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

// Helper function para sa natatanging kulay ng bawat Topic Badge
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

interface LessonManagerProps {
  lessons?: FacultyLesson[];
  onCreate?: () => void;
  onEdit?: (lesson: FacultyLesson) => void;
  onStatusToggle?: (id: string, currentStatus: string) => void;
  onDelete?: (id: string) => void;
}

export default function LessonManager({
  lessons: propsLessons,
  onCreate,
  onEdit,
  onStatusToggle,
  onDelete,
}: LessonManagerProps) {
  const [lessonsList, setLessonsList] = useState<FacultyLesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load Lessons mula sa props o Direct Express API Call
  const fetchLessonsFromDB = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/faculty/lessons');
      if (res.ok) {
        const data = await res.json();
        setLessonsList(data);
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propsLessons && propsLessons.length > 0) {
      setLessonsList(propsLessons);
      setLoading(false);
    } else {
      fetchLessonsFromDB();
    }
  }, [propsLessons]);

  // Dynamic Topics Extraction
  const availableTopics = Array.from(
    new Set([
      ...ALL_TOPICS,
      ...lessonsList.map((l) => l.topic).filter(Boolean),
    ])
  );

  // Statistics Calculations
  const totalLessons = lessonsList.length;
  const publishedLessons = lessonsList.filter(
    (l) => (l.status || '').toLowerCase() === 'published'
  ).length;
  const draftLessons = lessonsList.filter(
    (l) => (l.status || 'draft').toLowerCase() === 'draft'
  ).length;

  // 🔄 FUNCTION 1: PUBLISH / DRAFT TOGGLE (AGAD MAGBABAGO SA UI)
  const handleToggleStatus = (lesson: FacultyLesson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = lesson.status === 'published' ? 'draft' : 'published';

    // 1. Baguhin Agad ang UI State
    setLessonsList((prev) =>
      prev.map((item) => (item.id === lesson.id ? { ...item, status: newStatus } : item))
    );

    // 2. Tawagin ang parent handler kung mayroon
    if (onStatusToggle) {
      onStatusToggle(lesson.id, newStatus);
    }

    // 3. I-save sa Backend API
    fetch(`http://localhost:5000/api/faculty/lessons/${lesson.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lesson, status: newStatus }),
    }).catch((err) => console.error('DB Update Error:', err));
  };

  // 📦 FUNCTION 2: ARCHIVE / RESTORE TOGGLE (AGAD MAGBABAGO SA UI)
  const handleToggleArchive = (lesson: FacultyLesson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = lesson.status === 'archived' ? 'draft' : 'archived';

    // 1. Baguhin Agad ang UI State
    setLessonsList((prev) =>
      prev.map((item) => (item.id === lesson.id ? { ...item, status: newStatus } : item))
    );

    // 2. Tawagin ang parent handler kung mayroon
    if (onStatusToggle) {
      onStatusToggle(lesson.id, newStatus);
    }

    // 3. I-save sa Backend API
    fetch(`http://localhost:5000/api/faculty/lessons/${lesson.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lesson, status: newStatus }),
    }).catch((err) => console.error('DB Archive Update Error:', err));
  };

  // 🗑️ FUNCTION 3: DELETE LESSON (AGAD MATATANGGAL SA UI)
  const handleDelete = (id: string) => {
    setLessonsList((prev) => prev.filter((item) => item.id !== id));

    if (onDelete) {
      onDelete(id);
    }

    fetch(`http://localhost:5000/api/faculty/lessons/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('DB Delete Error:', err));

    setDeleteConfirm(null);
  };

  // Filter Logic (Search + Topic + Status Tab)
  const filtered = lessonsList.filter((lesson) => {
    const currentStatus = (lesson.status || 'draft').toLowerCase();
    const targetStatus = filter.toLowerCase();

    const matchesSearch =
      (lesson.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lesson.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = targetStatus === 'all' || currentStatus === targetStatus;
    const matchesTopic =
      selectedTopic === 'All' ||
      (lesson.topic && lesson.topic.toLowerCase() === selectedTopic.toLowerCase());

    return matchesSearch && matchesStatus && matchesTopic;
  });

  return (
    <div className="w-full space-y-6 font-sans antialiased text-slate-100">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-100 via-cyan-100 to-teal-200 bg-clip-text text-transparent tracking-tight">
            Lesson Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, structure, and organize interactive learning modules.
          </p>
        </div>

        {onCreate && (
          <button
            onClick={onCreate}
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer whitespace-nowrap active:scale-95"
          >
            <i className="ri-add-line text-base font-black transition-transform duration-300 group-hover:rotate-90" />
            <span>Create Lesson</span>
          </button>
        )}
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Lessons */}
        <div
          onClick={() => setFilter('all')}
          className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
            filter === 'all'
              ? 'bg-cyan-950/40 border border-cyan-500/50 ring-1 ring-cyan-500/50 shadow-[0_8px_32px_rgba(6,182,212,0.25)]'
              : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 hover:border-sky-500/30'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <i className="ri-book-open-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">{totalLessons}</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Total Lessons</p>
          </div>
        </div>

        {/* Published Lessons */}
        <div
          onClick={() => setFilter('published')}
          className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
            filter === 'published'
              ? 'bg-emerald-950/40 border border-emerald-500/50 ring-1 ring-emerald-500/50 shadow-[0_8px_32px_rgba(52,211,153,0.25)]'
              : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/30'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
            <i className="ri-checkbox-circle-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">{publishedLessons}</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Published Lessons</p>
          </div>
        </div>

        {/* Draft Lessons */}
        <div
          onClick={() => setFilter('draft')}
          className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
            filter === 'draft'
              ? 'bg-amber-950/40 border border-amber-500/50 ring-1 ring-amber-500/50 shadow-[0_8px_32px_rgba(251,191,36,0.25)]'
              : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/30'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            <i className="ri-draft-line text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">{draftLessons}</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Draft Lessons</p>
          </div>
        </div>

      </div>

      {/* TABLE CONTAINER & CONTROLS */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]">

        {/* TABLE HEADER & CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-slate-800/80 bg-slate-950/30">
          <div>
            <h3 className="text-base font-bold text-slate-100">Lesson Library</h3>
            <p className="text-xs text-slate-400 mt-0.5">View, filter by topic, and manage all learning content.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
              />
            </div>

            {/* Topic Filter Dropdown */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic === 'All' ? 'All Topics' : topic}
                </option>
              ))}
            </select>

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
                        layoutId="activeLessonFilterBg"
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

        {/* LOADING STATE */}
        {loading && (
          <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <i className="ri-loader-4-line animate-spin text-cyan-400 text-lg" />
            Loading lessons...
          </div>
        )}

        {/* TABLE BODY */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">

              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                  <th className="px-5 py-4 font-semibold">Lesson Details</th>
                  <th className="px-4 py-4 font-semibold hidden md:table-cell">Topic</th>
                  <th className="px-4 py-4 font-semibold text-center hidden sm:table-cell">Difficulty</th>
                  <th className="px-4 py-4 font-semibold text-center hidden sm:table-cell">Est. Time</th>
                  <th className="px-4 py-4 font-semibold hidden lg:table-cell">Created</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/50 text-sm">
                {filtered.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="group hover:bg-gradient-to-r hover:from-cyan-950/10 hover:via-slate-800/20 hover:to-transparent transition-colors duration-200"
                  >
                    {/* Details */}
                    <td className="px-5 py-4 max-w-[280px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="hidden sm:flex shrink-0 w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 items-center justify-center text-cyan-400">
                          <i className="ri-book-open-line text-base" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors duration-200 truncate max-w-[240px]">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px]" title={lesson.description}>
                            {lesson.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Topic Badge */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getTopicBadgeStyle(lesson.topic)}`}>
                        {lesson.topic}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-300 hidden sm:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/50 border border-slate-800 font-semibold">
                        Level {lesson.difficulty || 1}
                      </span>
                    </td>

                    {/* Estimated Time */}
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                        {lesson.estimatedMinutes || (lesson as any).estimated_minutes || 30} mins
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-4 text-xs font-mono text-slate-400 whitespace-nowrap hidden lg:table-cell">
                      {lesson.createdAt
                        ? new Date(lesson.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>

                    {/* Status Badge (Clickable para sa Status Toggle) */}
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => handleToggleStatus(lesson, e)}
                        title="Click to toggle status (Published <-> Draft)"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md cursor-pointer transition-all ${
                          (lesson.status || 'draft').toLowerCase() === 'published'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : (lesson.status || 'draft').toLowerCase() === 'archived'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            (lesson.status || 'draft').toLowerCase() === 'published'
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                              : (lesson.status || 'draft').toLowerCase() === 'archived'
                              ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                              : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          }`}
                        />
                        <span className="capitalize">{lesson.status || 'draft'}</span>
                      </button>
                    </td>

                    {/* Action Buttons (Edit, Publish Toggle, Archive Toggle, Delete) */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">

                        {/* Edit Button */}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(lesson)}
                            className="p-2 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                            title="Edit Lesson"
                          >
                            <i className="ri-edit-line text-sm" />
                          </button>
                        )}

                        {/* 🔄 Publish / Draft Toggle Button */}
                        <button
                          onClick={(e) => handleToggleStatus(lesson, e)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            lesson.status === 'published'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                          }`}
                          title={lesson.status === 'published' ? 'Unpublish (Set to Draft)' : 'Publish Lesson'}
                        >
                          <i className={lesson.status === 'published' ? 'ri-close-circle-line text-sm' : 'ri-check-line text-sm'} />
                        </button>

                        {/* 📦 Archive / Restore Button */}
                        <button
                          onClick={(e) => handleToggleArchive(lesson, e)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            lesson.status === 'archived'
                              ? 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 text-sky-400'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
                          }`}
                          title={lesson.status === 'archived' ? 'Restore from Archive' : 'Archive Lesson'}
                        >
                          <i className={lesson.status === 'archived' ? 'ri-inbox-unarchive-line text-sm' : 'ri-archive-line text-sm'} />
                        </button>

                        {/* 🗑️ Delete Button */}
                        <button
                          onClick={() => setDeleteConfirm(lesson.id)}
                          className="p-2 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 border border-slate-700/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete Lesson"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

                {/* Empty State */}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 text-xl">
                          <i className="ri-folder-open-line" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                          No {filter !== 'all' ? filter : ''} lessons found.
                        </p>
                        {onCreate && (
                          <button
                            onClick={onCreate}
                            className="mt-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer"
                          >
                            Create a new lesson
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        )}

        {/* TABLE FOOTER */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-800/80 bg-slate-950/50 text-xs text-slate-400">
          <p>
            Showing <span className="font-mono text-cyan-400 font-semibold">{filtered.length}</span> of <span className="font-mono text-slate-200">{totalLessons}</span> lessons
          </p>
          <p className="font-medium text-slate-500">Lesson Library</p>
        </div>

      </div>

      {/* DELETE MODAL */}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xl">
                  <i className="ri-delete-bin-line" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Delete Lesson?</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Delete Lesson
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
