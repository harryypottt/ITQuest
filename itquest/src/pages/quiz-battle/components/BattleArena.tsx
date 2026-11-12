import { useState, useCallback, useEffect, useRef } from "react";
import type { Quiz } from "@/sampleData/quizData";
import { generateBattleParticipants } from "@/sampleData/quizData";
import Timer from "./Timer";
import QuestionRenderer from "./QuestionRenderer";
import BattleRanking from "./BattleRanking";
import ResultSummary from "./ResultSummary";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import {
  getRankByRP,
  powerUps,
  consumePowerUp,
  getPowerUpUses,
} from '@/sampleData/quizArenaData';
import { useAntiCheat } from "@/hooks/useAntiCheat";

export interface BattleParticipant {
  id: string;
  name: string;
  score: number;
  combo: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  avgResponseTime: number;
  isCurrentUser?: boolean;
}

interface PowerUpItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderClass: string;
  bgClass: string;
  effect: string;
  maxUses: number;
  cooldownSeconds: number;
}

interface BattleArenaProps {
  quiz: Quiz;
  onBackToHub: () => void;
  onComplete?: (attemptData: {
    score: number;
    totalPoints: number;
    correctCount: number;
    totalQuestions: number;
    timeTaken: number;
    answers: any[];
    wrongTopics?: string[];
    attemptType?: string;
  }) => any;
}

export default function BattleArena({
  quiz,
  onBackToHub,
  onComplete,
}: BattleArenaProps) {
  const [phase, setPhase] = useState<"lobby" | "playing" | "finished">("lobby");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [userCombo, setUserCombo] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [answers, setAnswers] = useState<
    {
      questionId: string;
      userAnswer: string;
      isCorrect: boolean;
      points: number;
      timeSpent: number;
    }[]
  >([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [backendResult, setBackendResult] = useState<any>(null);
  const { user } = useAuth();
  const questionStartRef = useRef(Date.now());
  const botTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasSubmittedRef = useRef(false);

  // 🛡️ ANTI-CHEAT EXEMPTION CONDITION
  const isAntiCheatRequired =
    quiz.type !== "practice" &&
    quiz.category !== "Practice" &&
    (quiz as any).category !== "practice";

  // Power-up state
  const [activePowerUps, setActivePowerUps] = useState<
    { id: string; remainingQuestions: number }[]
  >([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [revealedOptions, setRevealedOptions] = useState<string[]>([]);
  const [powerUpCooldowns, setPowerUpCooldowns] = useState<
    Record<string, number>
  >({});
  const [xpBurst, setXpBurst] = useState<
    { x: number; y: number; amount: number }[]
  >([]);
  const xpBurstIdRef = useRef(0);

  // RP state
  const initialRP = useRef(user?.rp ?? 0);
  const [rpChange, setRpChange] = useState<number | null>(null);
  const userRank = getRankByRP(initialRP.current);

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const powerUpUses = getPowerUpUses();

  // 🛡️ ANTI-CHEAT HOOK INTEGRATION
  const {
    videoRef,
    warnings,
    isFullscreen,
    isCameraActive,
    cameraError,
    requestFullscreenAgain,
  } = useAntiCheat({
    enabled: isAntiCheatRequired && (phase === "lobby" || phase === "playing"),
    maxWarnings: 3,
    onViolationExceeded: () => {
      setShowViolationModal(true);
    },
  });

  // Lobby countdown
  useEffect(() => {
    if (phase !== "lobby") return;
    const participants_ = generateBattleParticipants(
      6,
      "user-1",
    ) as BattleParticipant[];
    setParticipants(participants_);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("playing");
          setIsTimerRunning(true);
          questionStartRef.current = Date.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Cleanup bot timers
  useEffect(() => {
    return () => {
      botTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // 🟢 AUTOMATIC BACKEND SUBMISSION TRIGGER
  useEffect(() => {
    if (phase === "lobby") {
      hasSubmittedRef.current = false;
      setBackendResult(null);
    }

    if (phase === "finished" && onComplete && !hasSubmittedRef.current) { 
      hasSubmittedRef.current = true;

      const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
      const totalPoints = quiz.questions.reduce(
        (sum, q) => sum + Number(q.points || 10),
        0,
      );
      const correctCount = answers.filter((a) => a.isCorrect).length;

      // 🟢 Sum ng oras mula Q1 hanggang huling tanong
      const totalTimeTaken = answers.reduce(
        (sum, a) => sum + (a.timeSpent || 0),
        0,
      );

      Promise.resolve(
        onComplete({
          score: totalScore,
          totalPoints,
          correctCount,
          totalQuestions,
          timeTaken: totalTimeTaken,
          answers,
          attemptType: "ranked",
        }),
      ).then((resData: any) => {
        if (resData) {
          setBackendResult(resData);
        }
      });
    }
  }, [phase, answers, quiz, totalQuestions, onComplete]);

  const simulateBotAnswers = useCallback(() => {
    botTimersRef.current.forEach(clearTimeout);
    botTimersRef.current = [];
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.isCurrentUser) return p;
        const delay = 2000 + Math.random() * 6000;
        const timer = setTimeout(() => {
          setParticipants((current) =>
            current.map((pp) => {
              if (pp.id !== p.id) return pp;
              const isCorrect = Math.random() < 0.65;
              const points_ = isCorrect
                ? Number(currentQuestion.points || 10)
                : 0;
              return {
                ...pp,
                score: pp.score + points_,
                combo: isCorrect ? pp.combo + 1 : 0,
                streak: isCorrect ? pp.streak + 1 : 0,
                questionsAnswered: pp.questionsAnswered + 1,
                correctAnswers: isCorrect
                  ? pp.correctAnswers + 1
                  : pp.correctAnswers,
                avgResponseTime:
                  pp.avgResponseTime > 0
                    ? (pp.avgResponseTime + delay) / 2
                    : delay,
              };
            }),
          );
        }, delay);
        botTimersRef.current.push(timer);
        return { ...p };
      }),
    );
  }, [currentQuestion]);

  useEffect(() => {
    if (phase === "playing") simulateBotAnswers();
  }, [currentIndex, phase, simulateBotAnswers]);

  // Xp burst effect
  const spawnXpBurst = useCallback((amount: number) => {
    const id = ++xpBurstIdRef.current;
    const x = 40 + Math.random() * 20;
    const y = 20 + Math.random() * 30;
    setXpBurst((prev) => [...prev, { x, y, amount }]);
    setTimeout(() => {
      setXpBurst((prev) => prev.filter((_, i) => i !== 0));
    }, 1200);
  }, []);

  // Use power-up
  const handleUsePowerUp = useCallback(
    (powerUp: PowerUpItem) => {
      if (showResult || phase !== "playing") return;
      const uses = powerUpUses[powerUp.id] || 0;
      if (uses >= powerUp.maxUses) return;
      if (powerUpCooldowns[powerUp.id]) return;

      const success = consumePowerUp(powerUp.id);
      if (!success) return;

      switch (powerUp.id) {
        case "time-freeze":
          setActivePowerUps((prev) => [
            ...prev,
            { id: "time-freeze", remainingQuestions: 1 },
          ]);
          break;
        case "double-xp":
          setActivePowerUps((prev) => [
            ...prev,
            { id: "double-xp", remainingQuestions: 1 },
          ]);
          break;
        case "shield":
          setShieldActive(true);
          setActivePowerUps((prev) => [
            ...prev,
            { id: "shield", remainingQuestions: 1 },
          ]);
          break;
        case "reveal-hint":
          if (currentQuestion.options && currentQuestion.options.length > 2) {
            const wrongOptions = currentQuestion.options.filter(
              (o) => o !== currentQuestion.correctAnswer,
            );
            const toReveal = wrongOptions.slice(
              0,
              Math.min(2, wrongOptions.length - 1),
            );
            setRevealedOptions(toReveal);
          }
          break;
        case "combo-booster":
          setActivePowerUps((prev) => [
            ...prev,
            { id: "combo-booster", remainingQuestions: 2 },
          ]);
          break;
        case "time-bonus":
          setActivePowerUps((prev) => [
            ...prev,
            { id: "time-bonus", remainingQuestions: 1 },
          ]);
          break;
      }

      setPowerUpCooldowns((prev) => ({
        ...prev,
        [powerUp.id]: powerUp.cooldownSeconds,
      }));
    },
    [showResult, phase, currentQuestion, powerUpUses, powerUpCooldowns],
  );

  // Handle cooldown ticks
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setPowerUpCooldowns((prev) => {
        const next: Record<string, number> = {};
        let changed = false;
        for (const [key, val] of Object.entries(prev)) {
          if (val > 1) {
            next[key] = val - 1;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // 🟢 FIXED ANSWER HANDLER (Exact Database Question Points)
  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || phase !== "playing") return;

      setSelectedAnswer(answer);
      const isCorrect = answer === currentQuestion.correctAnswer;
      const responseTime = Date.now() - questionStartRef.current;

      const basePoints = Number(currentQuestion.points || 10);
      const points = isCorrect ? basePoints : 0;

      if (isCorrect) {
        setUserCombo((c) => c + 1);
        setUserStreak((s) => s + 1);
        spawnXpBurst(points);
      } else {
        setUserCombo(0);
        if (!shieldActive) {
          setUserStreak(0);
        }
        setShieldActive(false);
      }

      setUserScore((prev) => prev + points);

      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          userAnswer: answer,
          isCorrect,
          points,
          timeSpent: Math.round(responseTime / 1000),
        },
      ]);

      setParticipants((prev) =>
        prev.map((p) => {
          if (!p.isCurrentUser) return p;
          return {
            ...p,
            score: p.score + points,
            combo: isCorrect ? p.combo + 1 : shieldActive ? p.combo : 0,
            streak: isCorrect ? p.streak + 1 : shieldActive ? p.streak : 0,
            questionsAnswered: p.questionsAnswered + 1,
            correctAnswers: isCorrect ? p.correctAnswers + 1 : p.correctAnswers,
            avgResponseTime:
              p.avgResponseTime > 0
                ? (p.avgResponseTime + responseTime) / 2
                : responseTime,
          };
        }),
      );

      setShowResult(true);
    },
    [showResult, phase, currentQuestion, shieldActive, spawnXpBurst],
  );

const handleNext = () => {
  setActivePowerUps((prev) =>
    prev
      .map((p) => ({ ...p, remainingQuestions: p.remainingQuestions - 1 }))
      .filter((p) => p.remainingQuestions > 0)
  );
  setRevealedOptions([]);
  setShieldActive(false);

  if (isLastQuestion) {
    setIsTimerRunning(false);
    setPhase('finished'); // 🟢 I-set na lang agad sa finished!
  } else {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
    questionStartRef.current = Date.now();
  }
};
const handleTimeUp = () => {
  if (!showResult) {
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswer: '',
        isCorrect: false,
        points: 0,
        timeSpent: currentQuestion.timeLimit || 0,
      },
    ]);
    setParticipants((prev) =>
      prev.map((p) => {
        if (!p.isCurrentUser) return p;
        return { ...p, questionsAnswered: p.questionsAnswered + 1, combo: 0 };
      })
    );
  }

  if (isLastQuestion) {
    setIsTimerRunning(false);
    setPhase('finished'); // 🟢 I-set na lang agad sa finished!
  } else {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
    questionStartRef.current = Date.now();
  }
};

  const handleRetry = () => {
    setPhase("lobby");
    setCountdown(5);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsTimerRunning(false);
    setUserScore(0);
    setUserCombo(0);
    setUserStreak(0);
    setAnswers([]);
    setTimeTaken(0);
    setParticipants([]);
    setActivePowerUps([]);
    setShieldActive(false);
    setRevealedOptions([]);
    setRpChange(null);
    setBackendResult(null);
    initialRP.current = user?.rp ?? 0;
  };

  const userRank_ =
    [...participants]
      .sort((a, b) => b.score - a.score)
      .findIndex((p) => p.isCurrentUser) + 1;

// 🏁 FINISHED PHASE
    if (phase === 'finished') {
      const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
      const totalPoints = quiz.questions.reduce((sum, q) => sum + Number(q.points || 10), 0);
      const correctCount = answers.filter((a) => a.isCorrect).length;
     
      const totalTimeTaken = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
      const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;

      // 🟢 Kunin ang data kahit may wrapper man na .data o wala
      const serverData = backendResult?.data || backendResult;

      const xpEarned = serverData?.xpEarned ?? (
        percentage >= quiz.passingScore
          ? Math.round(quiz.xpReward * (Math.min(100, percentage) / 100))
          : Math.round(quiz.xpReward * (percentage / 200))
      );

      return (
        <ResultSummary
          quiz={quiz}
          score={totalScore}
          totalPoints={totalPoints}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          timeTaken={totalTimeTaken}
          xpEarned={xpEarned}
          xpBreakdownData={serverData?.xpBreakdown}
          answers={answers}
          isBattle
          battleRank={userRank_}
          battleParticipants={participants}
          rpChange={serverData?.rpChange ?? rpChange}
          currentRP={serverData?.currentRP ?? (initialRP.current + (rpChange || 0))}
          onRetry={handleRetry}
          onBackToHub={onBackToHub}
        />
      );
    }
  // 🎮 MAIN CONTAINER
  const hasTimeFreeze = activePowerUps.some((p) => p.id === "time-freeze");
  const hasShield = activePowerUps.some((p) => p.id === "shield");
  const hasComboBooster = activePowerUps.some((p) => p.id === "combo-booster");

  return (
    <div className="relative select-none">
      {/* 🔴 1. ANTI-CHEAT: CAMERA REQUIREMENT BLOCKER */}
      {isAntiCheatRequired && !isCameraActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4 text-4xl">
            <i className="ri-webcam-line" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Required ang Camera Access
          </h2>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            {cameraError ||
              "Kailangan mong i-allow ang camera permission bago makapasok sa battle exam lobby."}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-slate-800 border border-slate-700 text-white font-semibold rounded-lg text-sm hover:bg-slate-700 transition-all cursor-pointer"
            >
              Subukan Uli
            </button>
            <button
              onClick={onBackToHub}
              className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg text-sm hover:bg-emerald-600 transition-all cursor-pointer"
            >
              Bumalik sa Quiz Battle
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ 2. ANTI-CHEAT: FULLSCREEN OVERLAY */}
      {isAntiCheatRequired && isCameraActive && !isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-full bg-amber-500/10 text-amber-400 mb-4 text-4xl">
            <i className="ri-fullscreen-exit-line" />
          </div>
          <h2 className="text-2xl font-bold text-amber-400 mb-2">
            Pumasok sa Fullscreen Mode
          </h2>
          <p className="text-sm text-slate-300 mb-6 max-w-md">
            Ipinagbabawal ang paglabas sa Fullscreen habang nag-e-exam. Magiging
            count ito bilang warning.
          </p>
          <button
            onClick={requestFullscreenAgain}
            className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-lg text-sm hover:bg-amber-400 transition-all cursor-pointer"
          >
            I-click para Bumalik sa Fullscreen
          </button>
        </div>
      )}

      {/* 📹 3. ANTI-CHEAT: FLOATING WEBCAM & WARNING COUNTER */}
      {isAntiCheatRequired && (
        <div className="fixed bottom-4 right-4 z-40 bg-slate-900/90 border border-slate-700 p-2 rounded-xl shadow-2xl flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-32 h-24 object-cover rounded-lg bg-black border border-slate-800"
          />
          <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
            <i className="ri-error-warning-line" />
            <span>Warnings: {warnings}/3</span>
          </div>
        </div>
      )}

      {/* 🚨 4. CUSTOM ANTI-CHEAT VIOLATION MODAL */}
      <AnimatePresence>
        {showViolationModal && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-quest-card border border-rose-500/30 rounded-2xl p-6 text-center shadow-2xl shadow-rose-950/40 relative overflow-hidden"
            >
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />

              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-500 text-3xl">
                <i className="ri-error-warning-line" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Anti-Cheat Alert
              </h3>

              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 mb-6 text-xs text-rose-200">
                Nalampasan mo ang limit sa anti-cheat warnings! Awtomatikong
                lalabas sa Battle Arena.
              </div>

              <button
                onClick={() => {
                  setShowViolationModal(false);
                  onBackToHub();
                }}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold rounded-xl text-sm hover:from-rose-500 hover:to-rose-400 transition-all shadow-lg shadow-rose-600/30 active:scale-[0.98]"
              >
                I Understand & Exit Battle Arena
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🏛️ LOBBY PHASE UI */}
      {phase === "lobby" && (
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-quest-card border border-quest-border rounded-2xl p-10"
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at center, ${userRank.color}40, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-quest-accent/10 border-2 border-quest-accent/30 flex items-center justify-center mx-auto mb-6 relative">
                <i className="ri-sword-line text-3xl text-quest-accent" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-quest-accent/20"
                  style={{ borderStyle: "dashed" }}
                />
              </div>

              <h2 className="text-xl font-bold text-quest-text mb-2">
                {quiz.title}
              </h2>
              <p className="text-sm text-quest-textMuted mb-2">
                {quiz.description}
              </p>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${userRank.borderClass} ${userRank.bgClass} mb-6`}
              >
                <i
                  className={userRank.icon}
                  style={{ color: userRank.color, fontSize: "0.85rem" }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: userRank.color }}
                >
                  {userRank.name}
                </span>
                <span className="text-[10px] text-quest-textDim font-mono">
                  {initialRP.current} RP
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-quest-textDim mb-8">
                <span className="flex items-center gap-1">
                  <i className="ri-question-answer-line" /> {quiz.questionCount}{" "}
                  questions
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-team-line" /> {quiz.minPlayers}-
                  {quiz.maxPlayers} players
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-flashlight-line text-quest-gold" /> +
                  {quiz.xpReward} XP
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg ${
                      p.isCurrentUser
                        ? "bg-quest-primary/10 border border-quest-primary/20"
                        : "bg-quest-card border border-quest-border"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center overflow-hidden">
                      <i className="ri-user-line text-quest-textDim text-xs" />
                    </div>
                    <span className="text-xs text-quest-text truncate">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-5xl font-bold font-mono text-quest-accent mb-3"
              >
                {countdown}
              </motion.div>
              <p className="text-sm text-quest-textMuted">
                Matchmaking complete. Battle starting...
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ⚔️ PLAYING PHASE UI */}
      {phase === "playing" && (
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBackToHub}
                className="flex items-center gap-1.5 text-sm text-quest-textDim hover:text-quest-text transition-colors"
              >
                <i className="ri-arrow-left-line" />
                Exit Battle
              </button>

              <div className="flex items-center gap-6">
                <span className="text-sm font-mono text-quest-textDim">
                  {currentIndex + 1}/{totalQuestions}
                </span>
                <Timer
                  totalSeconds={quiz.timeLimit}
                  onTimeUp={handleTimeUp}
                  isRunning={isTimerRunning}
                  questionTimeLimit={currentQuestion.timeLimit}
                  timeFreeze={hasTimeFreeze}
                />
              </div>
            </div>

            {activePowerUps.length > 0 && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {activePowerUps.map((p) => {
                  const pu = (powerUps as unknown as PowerUpItem[]).find(
                    (pp) => pp.id === p.id,
                  );
                  if (!pu) return null;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${pu.borderClass} ${pu.bgClass}`}
                    >
                      <i className={pu.icon} style={{ color: pu.color }} />
                      <span style={{ color: pu.color }}>{pu.name}</span>
                      <span className="text-quest-textDim">
                        {p.remainingQuestions}q
                      </span>
                    </motion.div>
                  );
                })}
                {shieldActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400"
                  >
                    <i className="ri-shield-check-line" /> Shield Ready
                  </motion.div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6 relative">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-quest-card border border-quest-border">
                <span className="text-xs text-quest-textDim">Score:</span>
                <span className="text-sm font-bold font-mono text-quest-accent">
                  {userScore}
                </span>
              </div>
              {userCombo >= 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-accent/10 border border-quest-accent/30"
                >
                  <i
                    className="ri-fire-line text-quest-gold"
                    style={
                      userCombo >= 7
                        ? { filter: "drop-shadow(0 0 6px #f59e0b)" }
                        : {}
                    }
                  />
                  <span className="text-sm font-bold text-quest-accent">
                    x{userCombo} COMBO
                  </span>
                  {userCombo >= 5 && (
                    <span className="text-xs text-quest-gold font-bold animate-pulse">
                      🔥
                    </span>
                  )}
                  {userCombo >= 7 && (
                    <span className="text-xs text-rose-400 font-bold animate-pulse">
                      MAX
                    </span>
                  )}
                </motion.div>
              )}
              {hasComboBooster && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-bold text-red-400">
                  <i className="ri-fire-line" /> BOOST
                </div>
              )}
              {userStreak >= 5 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-gold/10 border border-quest-gold/30">
                  <i className="ri-flashlight-line text-quest-gold" />
                  <span className="text-sm font-bold text-quest-gold">
                    {userStreak} streak
                  </span>
                </div>
              )}
              {hasShield && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                  <i className="ri-shield-check-line" /> Protected
                </div>
              )}

              <AnimatePresence>
                {xpBurst.map((burst, i) => (
                  <motion.div
                    key={`${burst.amount}-${i}`}
                    initial={{
                      opacity: 1,
                      scale: 0.5,
                      x: `${burst.x}%`,
                      y: `${burst.y}%`,
                    }}
                    animate={{ opacity: 0, scale: 1.5, y: `${burst.y - 20}%` }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute pointer-events-none z-50 text-xs font-bold font-mono"
                    style={{ color: userRank.color }}
                  >
                    +{burst.amount}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {(powerUps as unknown as PowerUpItem[]).map((pu) => {
                const used = getPowerUpUses()[pu.id] || 0;
                const remaining = Math.max(0, pu.maxUses - used);
                const onCooldown = (powerUpCooldowns[pu.id] || 0) > 0;
                const disabled = showResult || remaining <= 0 || onCooldown;
                return (
                  <button
                    key={pu.id}
                    disabled={disabled}
                    onClick={() => handleUsePowerUp(pu)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                      disabled
                        ? "border-quest-border bg-quest-bg text-quest-textDim/40 cursor-not-allowed"
                        : pu.borderClass +
                          " " +
                          pu.bgClass +
                          " hover:scale-105 cursor-pointer"
                    }`}
                    title={
                      onCooldown
                        ? `Cooldown: ${powerUpCooldowns[pu.id]}s`
                        : pu.effect
                    }
                  >
                    <i
                      className={pu.icon}
                      style={!disabled ? { color: pu.color } : {}}
                    />
                    <span style={!disabled ? { color: pu.color } : {}}>
                      {pu.name}
                    </span>
                    <span className="text-quest-textDim">
                      {remaining}/{pu.maxUses}
                    </span>
                    {onCooldown && (
                      <span className="text-quest-textDim">
                        {powerUpCooldowns[pu.id]}s
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="bg-quest-card border border-quest-border rounded-xl p-6 md:p-7"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-quest-accent/10 text-quest-accent border border-quest-accent/20">
                      Question {currentIndex + 1}
                    </span>
                    <span className="text-xs text-quest-textDim flex items-center gap-1">
                      <i className="ri-star-line text-quest-gold" />
                      {currentQuestion.points || 10} pts
                    </span>
                  </div>
                  {showResult && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        answers[currentIndex]?.isCorrect
                          ? "bg-quest-primary/10 text-quest-primary"
                          : "bg-quest-danger/10 text-quest-danger"
                      }`}
                    >
                      {answers[currentIndex]?.isCorrect
                        ? `+${answers[currentIndex]?.points} pts`
                        : "+0 pts"}
                    </span>
                  )}
                </div>

                <QuestionRenderer
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  userAnswer={answers[currentIndex]?.userAnswer}
                  showResult={showResult}
                  isCorrect={answers[currentIndex]?.isCorrect}
                  disabled={showResult}
                  revealedOptions={revealedOptions}
                />

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-center justify-end"
                  >
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-quest-accent text-white text-sm font-semibold hover:bg-cyan-600 transition-all whitespace-nowrap"
                    >
                      {isLastQuestion ? "Finish Battle" : "Next Question"}
                      <i className="ri-arrow-right-line" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-1.5 mt-6">
              {quiz.questions.map((q, idx) => {
                const ans = answers[idx];
                return (
                  <div
                    key={q.id}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-quest-accent w-4"
                        : ans?.isCorrect
                          ? "bg-quest-primary/60"
                          : ans && !ans.isCorrect
                            ? "bg-quest-danger/60"
                            : "bg-quest-border"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="w-72 hidden lg:block flex-shrink-0">
            <BattleRanking
              participants={participants as any}
              totalQuestions={totalQuestions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
