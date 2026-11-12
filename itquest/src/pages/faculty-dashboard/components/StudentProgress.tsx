import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { facultyApi } from '@/services/api'; // Integrated Backend API
import {
  getStudentProgressForQuest,
  type FacultyQuest,
} from '@/sampleData/facultyContentData';

export default function StudentProgressView({ quest }: { quest: FacultyQuest }) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');

  // ─── FETCH STUDENT PROGRESS FROM BACKEND API ───
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        // Kunin ang submissions mula sa API
        const res = await facultyApi.getSubmissions();
        if (Array.isArray(res.data) && res.data.length > 0) {
          // I-filter ang submissions batay sa napiling quest title o quest ID
          const questSubmissions = res.data.filter(
            (s: any) => s.questId === quest.id || s.bossQuestTitle === quest.title
          );
          if (questSubmissions.length > 0) {
            setProgress(
              questSubmissions.map((s: any) => ({
                studentId: s.id || s.studentId,
                studentName: s.studentName || 'Student',
                objectivesCompleted: s.autoScore ? Math.round((s.autoScore / 100) * 5) : 3,
                totalObjectives: 5,
                status: s.status === 'approved' ? 'completed' : s.status === 'pending' ? 'in_progress' : 'not_started',
                startedAt: s.submittedAt || new Date().toISOString(),
                completedAt: s.reviewedAt || null,
              }))
            );
            setLoading(false);
            return;
          }
        }

        // Fallback sa sample progress data kung wala pang backend submissions ang quest na ito
        const fallbackProgress = getStudentProgressForQuest ? getStudentProgressForQuest(quest.id) : [];
        setProgress(fallbackProgress);
      } catch (err) {
        console.error('Failed to fetch student progress from API:', err);
        const fallbackProgress = getStudentProgressForQuest ? getStudentProgressForQuest(quest.id) : [];
        setProgress(fallbackProgress);
      } finally {
        setLoading(false);
      }
    };

    if (quest?.id) {
      fetchProgressData();
    }
  }, [quest]);

  const filtered = progress.filter((p) =>
    p.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = progress.length;
  const completed = progress.filter((p) => p.status === 'completed').length;
  const inProgress = progress.filter((p) => p.status === 'in_progress').length;
  const completionRate = totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      not_started: 'bg-quest-textDim/10 text-quest-textDim border-quest-textDim/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] || map.not_started}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">

      {/* STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 mb-1">Total Students</div>
          <div className="text-2xl font-bold text-white">{loading ? '...' : totalStudents}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 mb-1">Completed</div>
          <div className="text-2xl font-bold text-emerald-400">{loading ? '...' : completed}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-amber-400">{loading ? '...' : inProgress}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 mb-1">Completion Rate</div>
          <div className="text-2xl font-bold text-cyan-400">{loading ? '...' : `${completionRate}%`}</div>
        </div>
      </div>

      {/* STUDENT PROGRESS TABLE CONTAINER */}
      <div className="p-4 sm:p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Student Progress</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking for quest: {quest.title}</p>
          </div>

          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-9 pr-4 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-800/80 bg-slate-950/40">
                <th className="pb-3 pt-2 px-3 font-semibold">Student</th>
                <th className="pb-3 pt-2 px-3 font-semibold">Progress</th>
                <th className="pb-3 pt-2 px-3 font-semibold">Status</th>
                <th className="pb-3 pt-2 px-3 font-semibold hidden md:table-cell">Started</th>
                <th className="pb-3 pt-2 px-3 font-semibold hidden md:table-cell">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                    Loading student progress...
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.studentId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-semibold text-slate-300">
                          {p.studentName ? p.studentName.split(' ').map((n: string) => n[0]).join('') : 'ST'}
                        </div>
                        <span className="text-sm font-medium text-slate-200">{p.studentName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                p.totalObjectives > 0
                                  ? (p.objectivesCompleted / p.totalObjectives) * 100
                                  : 0
                              }%`,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {p.objectivesCompleted}/{p.totalObjectives}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">{statusBadge(p.status)}</td>
                    <td className="py-3 px-3 text-xs font-mono text-slate-400 hidden md:table-cell">
                      {p.startedAt ? new Date(p.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3 px-3 text-xs font-mono text-slate-400 hidden md:table-cell">
                      {p.completedAt ? new Date(p.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                    No student progress found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
