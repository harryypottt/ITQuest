import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import LessonManager from './components/LessonManager';
import QuizManager from './components/QuizManager';
import QuestManager from './components/QuestManager';
import StudentProgressView from './components/StudentProgress';
import LessonBuilder from './components/LessonBuilder';
import QuizBuilder from './components/QuizBuilder';
import QuestBuilder from './components/QuestBuilder';
import SubmissionsManager from './components/SubmissionsManager';
import type {
    FacultyLesson,
    FacultyQuiz,
    FacultyQuest,
} from '@/sampleData/facultyContentData';

type FacultyTab =
    | 'overview'
    | 'lessons'
    | 'quizzes'
    | 'quests'
    | 'student-progress'
    | 'submissions';

type BuilderModal = 'lesson' | 'quiz' | 'quest' | null;

export default function FacultyDashboard() {
    const [activeTab, setActiveTab] = useState<FacultyTab>('overview');
    const [builderModal, setBuilderModal] = useState<BuilderModal>(null);
    const [contentVersion, setContentVersion] = useState(0);

    const [editingLesson, setEditingLesson] = useState<FacultyLesson | undefined>();
    const [editingQuiz, setEditingQuiz] = useState<FacultyQuiz | undefined>();
    const [editingQuest, setEditingQuest] = useState<FacultyQuest | undefined>();
    const [progressQuest, setProgressQuest] = useState<FacultyQuest | undefined>();

    const [submissionTab, setSubmissionTab] = useState<'pending' | 'reviewed'>('pending');

    // 🔗 DATABASE STATES (Palit sa sampleData)
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        pendingSubmissions: 0,
        totalContent: 0,
        lessonsCreated: 0,
        questsCreated: 0,
        quizzesCreated: 0,
        challengesCreated: 0,
    });
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [recentContent, setRecentContent] = useState<any[]>([]);
    const [studentOverview, setStudentOverview] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔗 FETCH REAL DATA FROM EXPRESS BACKEND SERVER
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Stats mula sa /api/faculty/stats
            const statsRes = await fetch('http://localhost:5000/api/faculty/stats');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // 2. Fetch Submissions mula sa /api/faculty/submissions
            const subRes = await fetch('http://localhost:5000/api/faculty/submissions');
            if (subRes.ok) {
                const subData = await subRes.json();
                setSubmissions(subData);
            }
        } catch (err) {
            console.error('Failed to load dashboard data from database:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [contentVersion]);

    const tabConfig: {
        value: FacultyTab;
        label: string;
        icon: string;
    }[] = [
            { value: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
            { value: 'lessons', label: 'Lessons', icon: 'ri-book-open-line' },
            { value: 'quizzes', label: 'Quizzes', icon: 'ri-questionnaire-line' },
            { value: 'quests', label: 'Quests', icon: 'ri-sword-line' },
            { value: 'student-progress', label: 'Student Progress', icon: 'ri-bar-chart-line' },
            { value: 'submissions', label: 'Submissions', icon: 'ri-file-list-3-line' },
        ];

    const openLessonBuilder = (lesson?: FacultyLesson) => {
        setEditingLesson(lesson);
        setBuilderModal('lesson');
    };

    const openQuizBuilder = (quiz?: FacultyQuiz) => {
        setEditingQuiz(quiz);
        setBuilderModal('quiz');
    };

    const openQuestBuilder = (quest?: FacultyQuest) => {
        setEditingQuest(quest);
        setBuilderModal('quest');
    };

    const closeBuilder = () => {
        setBuilderModal(null);
        setEditingLesson(undefined);
        setEditingQuiz(undefined);
        setEditingQuest(undefined);
        setContentVersion((v) => v + 1); // Triggers re-fetch of database stats!
    };

    const viewProgress = (quest: FacultyQuest) => {
        setProgressQuest(quest);
        setActiveTab('student-progress');
    };

    const displayedSubmissions = submissions.filter((s: any) =>
        submissionTab === 'pending'
            ? s.status === 'pending' || s.status === 'in_progress'
            : s.status === 'completed' || s.status === 'approved'
    );

    const typeIconMap: Record<string, string> = {
        lesson: 'ri-book-open-line',
        quest: 'ri-sword-line',
        challenge: 'ri-code-box-line',
        quiz: 'ri-questionnaire-line',
    };

    const typeColorMap: Record<string, string> = {
        lesson: 'text-emerald-400',
        quest: 'text-amber-400',
        challenge: 'text-cyan-400',
        quiz: 'text-rose-400',
    };

    const statCards = [
        {
            label: 'Total Students',
            value: stats.totalStudents || 0,
            icon: 'ri-group-line',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-400/20',
        },
        {
            label: 'Active Students',
            value: stats.activeStudents || 0,
            icon: 'ri-user-star-line',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-400/20',
        },
        {
            label: 'Pending Reviews',
            value: stats.pendingSubmissions || 0,
            icon: 'ri-file-list-3-line',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-400/20',
        },
        {
            label: 'Total Content',
            value: stats.totalContent || 0,
            icon: 'ri-stack-line',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-400/20',
        },
    ];

    const panelClass =
        'rounded-xl border border-white/[0.08] bg-[#0d1b2a] shadow-sm';

    const sectionTitleClass =
        'text-base font-semibold tracking-tight text-white';

    const tableHeaderClass =
        'border-b border-white/[0.08] bg-white/[0.025] text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400';

    const tableCellClass =
        'border-b border-white/[0.05] px-5 py-4 text-sm text-slate-300';

    return (
        <DashboardLayout>
            <div className="relative min-h-screen bg-[#081321] p-4 text-white sm:p-5 md:p-6 lg:p-8">

                {/* ===== FACULTY DASHBOARD HERO HEADER ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative isolate -mx-4 -mt-4 mb-0 overflow-hidden border-b border-white/10 sm:-mx-5 sm:-mt-5 md:-mx-6 md:-mt-6 lg:-mx-8 lg:-mt-8"
                >
                    <div
                        className="absolute inset-0 -z-20 bg-cover bg-center"
                        style={{
                            backgroundImage: `
      linear-gradient(
        90deg,
        rgba(5, 13, 25, 0.75) 0%,
        rgba(5, 13, 25, 0.50) 50%,
        rgba(5, 13, 25, 0.25) 100%
      ),
      url("https://www.paterostechnologicalcollege.edu.ph/ASSETS/IMAGES/ABOUTUS/ptcfront.png")
    `,
                            backgroundPosition: 'center 50%',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />

                    <div className="absolute inset-0 -z-10 bg-[#071426]/10" />

                    <div className="relative flex min-h-[240px] flex-col justify-center px-6 py-12 sm:px-8 md:min-h-[270px] md:px-10 lg:px-12">
                        <div className="max-w-3xl">
                            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-300">
                                <span>Faculty Portal</span>
                                <i className="ri-arrow-right-s-line" />
                                <span className="text-emerald-400">Dashboard</span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Faculty Dashboard
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                                Manage educational content, review student submissions, and monitor student academic progress.
                            </p>

                            <div className="mt-5 h-1 w-16 rounded-full bg-emerald-400" />
                        </div>
                    </div>
                </motion.div>

                {/* ===== TAB NAVIGATION ===== */}
                <div className="mb-7 mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d1b2a] p-1.5 shadow-sm">
                    <div className="flex min-w-max items-center gap-1">
                        {tabConfig.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${activeTab === tab.value
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                                    }`}
                            >
                                <i className={`${tab.icon} text-base`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >

                        {/* ===== OVERVIEW TAB ===== */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {statCards.map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.06 }}
                                            className={`rounded-xl border ${stat.border} bg-[#0d1b2a] p-5 shadow-sm transition-colors hover:bg-[#112238] md:p-6`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-400">
                                                        {stat.label}
                                                    </p>
                                                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
                                                        {stat.value}
                                                    </h3>
                                                </div>

                                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                                                    <i className={`${stat.icon} ${stat.color} text-2xl`} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                    <div className={`${panelClass} overflow-hidden xl:col-span-2`}>
                                        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                                            <div>
                                                <h2 className={sectionTitleClass}>
                                                    Submission Queue
                                                </h2>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Manage and review student submissions
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#081321] p-1">
                                                {(['pending', 'reviewed'] as const).map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setSubmissionTab(tab)}
                                                        className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold capitalize transition-colors ${submissionTab === tab
                                                                ? 'bg-emerald-600 text-white'
                                                                : 'text-slate-400 hover:text-white'
                                                            }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[620px]">
                                                <thead>
                                                    <tr className={tableHeaderClass}>
                                                        <th className="px-5 py-4">Student</th>
                                                        <th className="px-5 py-4">Quest / Submission</th>
                                                        <th className="hidden px-5 py-4 md:table-cell">Submitted</th>
                                                        <th className="px-5 py-4 text-right">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {displayedSubmissions.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="py-8 text-center text-xs text-slate-500">
                                                                No submissions found in database queue.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        displayedSubmissions.map((sub: any, idx: number) => (
                                                            <tr
                                                                key={sub.id || idx}
                                                                className="transition-colors hover:bg-white/[0.025]"
                                                            >
                                                                <td className={tableCellClass}>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#172a40] text-xs font-semibold text-slate-300">
                                                                            {(sub.studentName || 'Student').split(' ').map((n: string) => n[0]).join('')}
                                                                        </div>
                                                                        <span className="whitespace-nowrap font-medium text-slate-200">
                                                                            {sub.studentName || 'Student User'}
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td className={tableCellClass}>
                                                                    {sub.questId || sub.bossQuestTitle || 'Lesson Submission'}
                                                                </td>

                                                                <td className={`${tableCellClass} hidden whitespace-nowrap text-xs md:table-cell`}>
                                                                    {sub.startedAt ? new Date(sub.startedAt).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    }) : 'Recently'}
                                                                </td>

                                                                <td className={`${tableCellClass} text-right`}>
                                                                    <button
                                                                        onClick={() => setActiveTab('submissions')}
                                                                        className="cursor-pointer whitespace-nowrap rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                                                                    >
                                                                        Review
                                                                        <i className="ri-arrow-right-line ml-1" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className={`${panelClass} p-5 md:p-6`}>
                                            <div className="mb-6">
                                                <h2 className={sectionTitleClass}>Content Overview</h2>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Summary of created learning materials
                                                </p>
                                            </div>

                                            <div className="space-y-5">
                                                {[
                                                    {
                                                        label: 'Lessons',
                                                        value: stats.lessonsCreated || 0,
                                                        icon: 'ri-book-open-line',
                                                        color: 'text-emerald-400',
                                                    },
                                                    {
                                                        label: 'Quests',
                                                        value: stats.questsCreated || 0,
                                                        icon: 'ri-sword-line',
                                                        color: 'text-amber-400',
                                                    },
                                                    {
                                                        label: 'Quizzes',
                                                        value: stats.quizzesCreated || 0,
                                                        icon: 'ri-questionnaire-line',
                                                        color: 'text-purple-400',
                                                    },
                                                ].map((item) => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <i className={`${item.icon} ${item.color} text-lg`} />
                                                            <span className="text-sm text-slate-300">{item.label}</span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-white">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== LESSONS TAB ===== */}
                        {activeTab === 'lessons' && (
                            <LessonManager
                                key={`lessons-${contentVersion}`}
                                onCreate={() => openLessonBuilder()}
                                onEdit={(lesson: any) => openLessonBuilder(lesson)}
                            />
                        )}

                        {/* ===== QUIZZES TAB ===== */}
                        {activeTab === 'quizzes' && (
                            <QuizManager
                                key={`quizzes-${contentVersion}`}
                                onCreate={() => openQuizBuilder()}
                                onEdit={(quiz: any) => openQuizBuilder(quiz)}
                            />
                        )}

                        {/* ===== QUESTS TAB ===== */}
                        {activeTab === 'quests' && (
                            <QuestManager
                                key={`quests-${contentVersion}`}
                                onCreate={() => openQuestBuilder()}
                                onEdit={(quest: any) => openQuestBuilder(quest)}
                                onViewProgress={viewProgress}
                            />
                        )}

                        {/* ===== STUDENT PROGRESS TAB ===== */}
                        {activeTab === 'student-progress' && (
                            progressQuest ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setProgressQuest(undefined)}
                                            className="group flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#0d1b2a] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
                                        >
                                            <i className="ri-arrow-left-line transition-transform group-hover:-translate-x-1" />
                                            Back to Quests
                                        </button>
                                    </div>

                                    <StudentProgressView quest={progressQuest} />
                                </div>
                            ) : (
                                <div className={`${panelClass} px-5 py-16 text-center md:p-16`}>
                                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-[#14263a]">
                                        <i className="ri-bar-chart-grouped-line text-4xl text-emerald-400" />
                                    </div>

                                    <h3 className="mb-2 text-xl font-semibold text-white">
                                        View Quest Progress
                                    </h3>

                                    <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-slate-400">
                                        Select a quest from the Quests tab to view student progress.
                                    </p>

                                    <button
                                        onClick={() => setActiveTab('quests')}
                                        className="cursor-pointer rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                                    >
                                        <i className="ri-sword-line mr-2" />
                                        Go to Quests
                                    </button>
                                </div>
                            )
                        )}

                        {/* ===== SUBMISSIONS TAB ===== */}
                        {activeTab === 'submissions' && (
                            <SubmissionsManager key={`submissions-${contentVersion}`} />
                        )}

                    </motion.div>
                </AnimatePresence>

                {/* ===== OVERLAY & BUILDER MODALS CONTAINER ===== */}
                <AnimatePresence>
                    {builderModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-white/10 bg-[#0d1b2a] p-6 shadow-2xl">
                                {builderModal === 'lesson' && (
                                    <LessonBuilder
                                        editingLesson={editingLesson}
                                        onClose={closeBuilder}
                                    />
                                )}

                                {builderModal === 'quiz' && (
                                    <QuizBuilder
                                        editingQuiz={editingQuiz}
                                        onClose={closeBuilder}
                                    />
                                )}

                                {builderModal === 'quest' && (
                                    <QuestBuilder
                                        editingQuest={editingQuest}
                                        onClose={closeBuilder}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </DashboardLayout>
    );
}
