import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Quiz } from '@/sampleData/quizData';

export interface AnswerDetail {
  questionId: string;
  questionText?: string;
  userAnswer?: any;
  correctAnswer?: any;
  isCorrect: boolean;
  points: number;
}

export interface BattleParticipant {
  id: string;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

export interface XPBreakdownData {
  base: number;
  speedBonus: number;
  passingBonus: number;
  perfectBonus: number;
}



interface ResultsSummaryProps {
  quiz: Quiz;
  score: number;
  totalPoints: number;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number;
  xpEarned: number;
  xpBreakdownData?: any;
  answers: any[];
  isBattle?: boolean;
  battleRank?: number;
  battleParticipants?: any[];
  rpChange?: number | null; // 🟢 Idagdag ito
  currentRP?: number; // 🟢 Idagdag ito
  onRetry: () => void;
  onBackToHub: () => void;
}
export default function ResultsSummary({
  quiz,
  score,
  totalPoints,
  correctCount,
  totalQuestions,
  timeTaken,
  xpEarned,
  xpBreakdownData,
  answers,
  isBattle,
  battleRank = 1,
  battleParticipants,
  rpChange, // 🟢 Idagdag ito rito
  currentRP, // 🟢 Idagdag ito rito
  onRetry,
  onBackToHub,
}: ResultsSummaryProps) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // 🟢 Pure Item Accuracy Percentage (e.g. 5/8 = 63%)
  const percentage = useMemo(() => {
    if (totalQuestions > 0) {
      return Math.round((correctCount / totalQuestions) * 100);
    }
    return 0;
  }, [correctCount, totalQuestions]);

  const passingScore = quiz?.passingScore || quiz?.passing_score || 70;
  const passed = percentage >= passingScore;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  // Unlocked Badges
  const unlockedBadges = useMemo(() => {
    const fromBackend = quiz?.latestAttemptData?.unlockedAchievements;
    if (Array.isArray(fromBackend) && fromBackend.length > 0) {
      return fromBackend;
    }
    if (quiz?.badgeReward && passed) {
      return [quiz.badgeReward];
    }
    return [];
  }, [quiz, passed]);

  // Recommended Review Topics
  const wrongTopics = useMemo(() => {
    if (!answers || answers.length === 0) return [];

    return answers
      .filter((a) => !a.isCorrect)
      .map((a) => {
        const q = quiz?.questions?.find(
          (item: any) => item.id === a.questionId || item._id === a.questionId,
        );
        return {
          topic: q?.topic || q?.category || quiz?.category || "General Review",
          priority:
            q?.difficulty === 3
              ? "high"
              : q?.difficulty === 2
                ? "medium"
                : "low",
        };
      })
      .filter(
        (item, index, self) =>
          self.findIndex((t) => t.topic === item.topic) === index,
      );
  }, [answers, quiz]);

  const handleTopicClick = (topicName: string) => {
    navigate(`/lessons?topic=${encodeURIComponent(topicName)}`);
  };

  useEffect(() => {
    if (passed) {
      const timer = setTimeout(() => setCelebrate(true), 300);
      return () => clearTimeout(timer);
    }
  }, [passed]);

  // 🟢 Synchronized XP Breakdown (Backend Data -> UI Display)
  const xpBreakdown = useMemo(() => {
    if (xpBreakdownData) {
      return {
        base: xpBreakdownData.base || 0,
        speedBonus: xpBreakdownData.speedBonus || 0,
        passingBonus: xpBreakdownData.passingBonus || 0,
        perfectBonus: xpBreakdownData.perfectBonus || 0,
      };
    }

    const base = correctCount * 15;
    const speedBonus =
      timeTaken > 0 && timeTaken < 60 ? 50 : timeTaken < 120 ? 20 : 0;
    const passingBonus = passed ? 100 : 0;
    const perfectBonus = percentage === 100 ? 50 : 0;

    return { base, speedBonus, passingBonus, perfectBonus };
  }, [xpBreakdownData, correctCount, timeTaken, passed, percentage]);

  // Live Improvement Tracking
  const retryImprovement = useMemo(() => {
    const rawAttempts = quiz?.attempts || quiz?.userAttempts || [];

    // 🟢 1. I-filter para TANGING mga attempt LANG nitong specific Quiz/Battle ang makasama
    const currentQuizId = quiz?.id;
    const filteredAttempts = rawAttempts.filter((a: any) => {
      const qId = a.quiz_id || a.quizId;
      return !currentQuizId || !qId || qId === currentQuizId;
    });

    if (filteredAttempts.length < 2) return null;

    // 🟢 2. I-sort ayon sa totoong time recorded
    const sortedAttempts = [...filteredAttempts].sort((a, b) => {
      const timeA = new Date(a.recorded_at || a.createdAt || 0).getTime();
      const timeB = new Date(b.recorded_at || b.createdAt || 0).getTime();
      return timeA - timeB;
    });

    // 🟢 3. Kunin ang eksaktong nakaraang attempt ng QUIZ NA ITO
    const previousAttempt = sortedAttempts[sortedAttempts.length - 2];
    const prevScore = Number(previousAttempt?.percentage ?? 0);
    const diff = percentage - prevScore;

    return {
      previousScore: prevScore,
      currentScore: percentage,
      improvement: diff,
      attemptNumber: sortedAttempts.length,
      date: new Date().toISOString().split("T")[0],
    };
  }, [quiz, percentage]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Celebration overlay */}
      {celebrate && passed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, x: "50vw", y: "50vh", scale: 0 }}
              animate={{
                opacity: 0,
                x: `${50 + (Math.random() - 0.5) * 80}vw`,
                y: `${50 + (Math.random() - 0.5) * 80}vh`,
                scale: 1.5,
              }}
              transition={{
                duration: 1.8,
                delay: Math.random() * 0.4,
                ease: "easeOut",
              }}
              className="absolute text-2xl"
            >
              {["🎉", "✨", "🏆", "⭐", "💫", "🔥"][i % 6]}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main result card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border overflow-hidden shadow-2xl bg-[#0e0c15] ${
          passed ? "border-emerald-500/30" : "border-rose-500/30"
        }`}
      >
        {/* Header Banner */}
        <div
          className={`p-8 text-center border-b ${
            passed
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-rose-500/10 border-rose-500/20"
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-1">
            {passed ? "Quiz Complete!" : "Keep Practicing!"}
          </h2>

          {isBattle && battleRank !== undefined ? (
            <p className="text-base text-amber-400 font-semibold">
              {battleRank === 1
                ? "🥇 1st Place - Champion!"
                : `#${battleRank} Place`}
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              {passed
                ? "Great job! You passed the assessment!"
                : "You didn't reach the passing score this time."}
            </p>
          )}
        </div>

        {/* Unlocked Badges */}
        <AnimatePresence>
          {unlockedBadges.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-6 mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-500/30 flex items-center justify-between shadow-lg shadow-amber-500/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl flex-shrink-0">
                  <i className="ri-award-line" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    Achievement Unlocked!
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {unlockedBadges.join(", ")}
                  </h4>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                +Badge Claimed
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1a1726] mx-6 my-6 rounded-xl overflow-hidden">
          <div className="bg-[#12101a] p-4 text-center">
            <span
              className={`text-2xl font-bold font-mono ${
                passed ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {percentage}%
            </span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              Score
            </p>
          </div>
          <div className="bg-[#12101a] p-4 text-center">
            <span className="text-2xl font-bold font-mono text-white">
              {correctCount}/{totalQuestions}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              Correct
            </p>
          </div>
          <div className="bg-[#12101a] p-4 text-center">
            <span className="text-2xl font-bold font-mono text-white">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              Time
            </p>
          </div>
          <div className="bg-[#12101a] p-4 text-center">
            <span className="text-2xl font-bold font-mono text-amber-400">
              +{xpEarned}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              XP Earned
            </p>
          </div>
        </div>

        {/* XP Breakdown Card */}
        <div className="mx-6 mb-6 p-4 rounded-xl bg-[#13111c] border border-white/5">
          <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
            <i className="ri-flashlight-line text-amber-400" /> XP Breakdown
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Base XP</span>
              <span className="text-white font-mono">
                +{xpBreakdown.base} XP
              </span>
            </div>
            {xpBreakdown.speedBonus > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Speed Bonus</span>
                <span className="text-cyan-400 font-mono">
                  +{xpBreakdown.speedBonus} XP
                </span>
              </div>
            )}
            {xpBreakdown.passingBonus > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Passing Bonus (70%+)</span>
                <span className="text-emerald-400 font-mono">
                  +{xpBreakdown.passingBonus} XP
                </span>
              </div>
            )}
            {xpBreakdown.perfectBonus > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Perfect Score Bonus (100%)
                </span>
                <span className="text-amber-300 font-mono">
                  +{xpBreakdown.perfectBonus} XP
                </span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex items-center justify-between text-sm">
              <span className="text-white font-semibold">Total</span>
              <span className="text-amber-400 font-bold font-mono">
                +{xpEarned} XP
              </span>
            </div>
          </div>
        </div>
        {/* 🏆 RP Rating Points Change Badge (Lalabas kapag Ranked Battle) */}
        {(rpChange !== undefined && rpChange !== null) ||
        (quiz as any)?.rpChange !== undefined ? (
          <div className="mx-6 mb-6 p-4 rounded-xl bg-[#13111c] border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-trophy-line text-amber-400 text-lg" />
              <span className="text-xs font-bold text-white">
                Ranked Rating (RP)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  (rpChange ?? (quiz as any)?.rpChange ?? 0) >= 0
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {(rpChange ?? (quiz as any)?.rpChange ?? 0) >= 0
                  ? `+${rpChange ?? (quiz as any)?.rpChange} RP`
                  : `${rpChange ?? (quiz as any)?.rpChange} RP`}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Total:{" "}
                <strong className="text-amber-400">
                  {currentRP ?? (quiz as any)?.currentRP ?? 0} RP
                </strong>
              </span>
            </div>
          </div>
        ) : null}

        {/* Dynamic Improvement Tracking */}
        {retryImprovement && (
          <div className="mx-6 mb-6 p-4 rounded-xl bg-[#13111c] border border-cyan-500/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                <i className="ri-refresh-line text-sm" />
                <span>Improvement Tracking</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  retryImprovement.improvement >= 0
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {retryImprovement.improvement >= 0
                  ? `+${retryImprovement.improvement}% improved`
                  : `${retryImprovement.improvement}% drop`}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Previous:{" "}
              <span className="text-rose-400 font-semibold">
                {retryImprovement.previousScore}%
              </span>
              {" → "}
              Current:{" "}
              <span className="text-emerald-400 font-semibold">
                {retryImprovement.currentScore}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Attempt #{retryImprovement.attemptNumber} on{" "}
              {retryImprovement.date}
            </div>
          </div>
        )}

        {/* Recommended Review */}
        {wrongTopics.length > 0 && (
          <div className="mx-6 mb-6 p-4 rounded-xl bg-[#13111c] border border-rose-500/20 text-left space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <i className="ri-bookmark-3-line text-sm" />
              <span>Recommended Review</span>
            </div>
            <p className="text-xs text-slate-400">
              Click any topic below to open its lesson and strengthen your
              understanding:
            </p>
            <div className="space-y-2 pt-1">
              {wrongTopics.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleTopicClick(item.topic)}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#1a1726] border border-white/5 hover:border-rose-500/40 hover:bg-[#201c30] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <i className="ri-book-open-line text-rose-400 group-hover:scale-110 transition-transform text-xs" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {item.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                        item.priority === "high"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {item.priority}
                    </span>
                    <i className="ri-arrow-right-s-line text-slate-500 group-hover:text-rose-400 transition-colors text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Question Review Toggle */}
        <div className="mx-6 mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <i
              className={
                showDetails ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
              }
            />
            {showDetails ? "Hide Question Details" : "Show Question Details"}
          </button>
        </div>

        {showDetails && (
          <div className="mx-6 mb-6 max-h-60 overflow-y-auto space-y-2 pr-1">
            {answers.map((ans, idx) => (
              <div
                key={ans.questionId || idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                  ans.isCorrect
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-rose-500/5 border-rose-500/20"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    ans.isCorrect
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  <i
                    className={
                      ans.isCorrect ? "ri-check-line" : "ri-close-line"
                    }
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    Q{idx + 1}: {ans.questionText || `Question #${idx + 1}`}
                  </p>
                </div>
                <span className="text-slate-400 font-mono font-bold">
                  +{ans.points} pts
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex items-center gap-3 p-6 bg-[#0a090f] border-t border-white/5">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-[#14121f] text-white text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="ri-refresh-line" /> Try Again
            </button>
          )}
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="flex-1 py-3 rounded-xl bg-[#10b981] text-white text-sm font-semibold hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <i className="ri-arrow-left-line" /> Back to Hub
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
