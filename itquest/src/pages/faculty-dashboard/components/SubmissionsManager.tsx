import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentInitials: string;
  bossQuest: string;
  submittedDate: string;
  score?: number;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  submissionLink?: string;
  submissionNotes?: string;
}

// Sample Initial Submissions Data
const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Maria Santos',
    studentInitials: 'MS',
    bossQuest: 'Build Your Developer Portfolio',
    submittedDate: 'May 25',
    score: 82,
    status: 'pending',
    submissionNotes: 'I completed the interactive dark mode and portfolio gallery.',
    submissionLink: 'https://github.com/example/maria-portfolio',
  },
  {
    id: 'sub-2',
    studentName: 'James Reyes',
    studentInitials: 'JR',
    bossQuest: 'REST API Dashboard',
    submittedDate: 'May 25',
    score: 91,
    status: 'pending',
    submissionNotes: 'All endpoints tested using Postman with bearer token authentication.',
    submissionLink: 'https://github.com/example/james-api',
  },
  {
    id: 'sub-3',
    studentName: 'Angela Cruz',
    studentInitials: 'AC',
    bossQuest: 'Full-Stack Todo Application',
    submittedDate: 'May 25',
    score: 76,
    status: 'pending',
    submissionNotes: 'Frontend works great, database connects on localhost.',
    submissionLink: 'https://github.com/example/angela-todo',
  },
];

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = localStorage.getItem('itquest_faculty_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  // Review Form States
  const [reviewScore, setReviewScore] = useState<number>(80);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('itquest_faculty_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Open modal and pre-fill form
  const handleOpenReview = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setReviewScore(submission.score || 80);
    setReviewFeedback(submission.feedback || '');
  };

  // Process Grade Action (Approve vs Reject) ⚡
  const handleReviewAction = (actionStatus: 'approved' | 'rejected') => {
    if (!selectedSubmission) return;

    const updated = submissions.map((sub) => {
      if (sub.id === selectedSubmission.id) {
        return {
          ...sub,
          score: actionStatus === 'approved' ? Number(reviewScore) : 0,
          feedback: reviewFeedback,
          status: actionStatus,
        };
      }
      return sub;
    });

    setSubmissions(updated);
    setSelectedSubmission(null);
  };

  // Re-open/Move back to Pending
  const handleMoveToPending = (id: string) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status: 'pending' as const } : sub
    );
    setSubmissions(updated);
  };

  // Filter Submissions based on tab
  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === 'pending') return s.status === 'pending';
    return s.status === 'approved' || s.status === 'rejected';
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const reviewedCount = submissions.filter((s) => s.status === 'approved' || s.status === 'rejected').length;

  return (
    <div className="w-full space-y-6 font-sans antialiased text-slate-100">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-100 via-cyan-100 to-teal-200 bg-clip-text text-transparent tracking-tight">
            Submission Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and manage student work, assess code submissions, and provide feedback.
          </p>
        </div>

        {/* STATUS TABS (PENDING / REVIEWED) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <button
            onClick={() => setActiveTab('pending')}
            className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'pending'
                ? 'text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {activeTab === 'pending' && (
              <motion.div
                layoutId="activeSubTabBg"
                className="absolute inset-0 rounded-lg bg-emerald-500/20 border border-emerald-500/40"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Pending</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {pendingCount}
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviewed')}
            className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'reviewed'
                ? 'text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {activeTab === 'reviewed' && (
              <motion.div
                layoutId="activeSubTabBg"
                className="absolute inset-0 rounded-lg bg-cyan-500/20 border border-cyan-500/40"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Reviewed</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {reviewedCount}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* SUBMISSIONS TABLE CONTAINER */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Boss Quest</th>
                <th className="px-4 py-4 font-semibold">Submitted</th>
                <th className="px-4 py-4 font-semibold">Status / Score</th>
                <th className="px-5 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50 text-sm">
              {filteredSubmissions.map((sub) => {
                return (
                  <tr
                    key={sub.id}
                    className="group hover:bg-gradient-to-r hover:from-cyan-950/10 hover:via-slate-800/20 hover:to-transparent transition-colors duration-200"
                  >
                    {/* Student Info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0 shadow-inner">
                          {sub.studentInitials}
                        </div>
                        <span className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {sub.studentName}
                        </span>
                      </div>
                    </td>

                    {/* Boss Quest */}
                    <td className="px-5 py-4 text-slate-200 font-medium">
                      {sub.bossQuest}
                    </td>

                    {/* Submitted Date */}
                    <td className="px-4 py-4 text-xs text-slate-400 font-mono">
                      {sub.submittedDate}
                    </td>

                    {/* Score Bar & Status Badge */}
                    <td className="px-4 py-4">
                      {sub.status === 'pending' ? (
                        <span className="text-xs text-slate-500 italic">Needs Review</span>
                      ) : sub.status === 'approved' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                            Approved
                          </span>
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            {sub.score}%
                          </span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="px-5 py-4 text-right">
                      {sub.status === 'pending' ? (
                        <button
                          onClick={() => handleOpenReview(sub)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] cursor-pointer"
                        >
                          <span>Review</span>
                          <i className="ri-arrow-right-line text-xs" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenReview(sub)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-cyan-500/10 border border-slate-700/60 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-all cursor-pointer"
                          >
                            Edit Review
                          </button>
                          <button
                            onClick={() => handleMoveToPending(sub.id)}
                            className="p-1.5 rounded-xl bg-slate-800/40 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
                            title="Re-open submission to pending"
                          >
                            <i className="ri-refresh-line text-xs" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 text-xl">
                        <i className="ri-checkbox-multiple-line" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        No {activeTab} submissions found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER METRICS */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-800/80 bg-slate-950/50 text-xs text-slate-400">
          <p>
            Showing <span className="font-mono text-emerald-400 font-semibold">{filteredSubmissions.length}</span> {activeTab} submissions
          </p>
          <p className="font-medium text-slate-500">
            Submissions Queue
          </p>
        </div>
      </div>

      {/* REVIEW & GRADING MODAL WITH APPROVE / REJECT BUTTONS 🎯 */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] relative overflow-hidden space-y-5"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    {selectedSubmission.studentInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {selectedSubmission.studentName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedSubmission.bossQuest}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <i className="ri-close-line text-lg" />
                </button>
              </div>

              {/* Student Submission Details */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block font-semibold mb-1">STUDENT NOTES:</span>
                  <p className="text-slate-300 italic">
                    "{selectedSubmission.submissionNotes || 'No notes provided by student.'}"
                  </p>
                </div>

                {selectedSubmission.submissionLink && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-slate-500 block font-semibold mb-1">SUBMISSION LINK:</span>
                    <a
                      href={selectedSubmission.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
                    >
                      <span>{selectedSubmission.submissionLink}</span>
                      <i className="ri-external-link-line text-xs" />
                    </a>
                  </div>
                )}
              </div>

              {/* Grade & Feedback Input */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Grade / Score (%)
                    </label>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {reviewScore}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Faculty Feedback & Comments
                  </label>
                  <textarea
                    rows={3}
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Provide constructive feedback or explain reason for rejection..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS (REJECT vs APPROVE) 🟢🔴 */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleReviewAction('rejected')}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Reject & Request Changes
                </button>

                <button
                  onClick={() => handleReviewAction('approved')}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:brightness-110 transition-all cursor-pointer"
                >
                  Approve & Grade
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
