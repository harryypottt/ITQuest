import { useState, useCallback, useEffect, useRef } from "react";
import Timer from "./Timer";
import QuestionRenderer from "./QuestionRenderer";
import ResultsSummary from "./ResultSummary";
import { motion, AnimatePresence } from "framer-motion";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { calculateMatchingScore } from './QuestionRenderer'; 

interface QuizPlayerProps {
  quiz: any;
  onBackToHub: () => void;
  onComplete?: (attemptData: {
    score: number;
    totalPoints: number;
    correctCount: number;
    totalQuestions: number;
    timeTaken: number;
    answers: any[];
    wrongTopics: string[];
  }) => Promise<any> | any;
}

export default function QuizPlayer({
  quiz,
  onBackToHub,
  onComplete,
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    {
      questionId: string;
      userAnswer: string;
      isCorrect: boolean;
      points: number;
      timeSpent: number;
    }[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);
  const [backendResult, setBackendResult] = useState<any>(null);

  // Prevent multiple submission triggers
  const hasSubmittedRef = useRef(false);

  const totalQuestions = quiz.questions?.length || 0;
  const currentQuestion = quiz.questions?.[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // 🛡️ ANTI-CHEAT EXEMPTION CONDITION:
  const isAntiCheatRequired =
    quiz.type !== "practice" &&
    quiz.category !== "Practice" &&
    quiz.category !== "practice";

  // 🌟 Pag-ipon ng Results at pagpasa sa parent (QuizArena) na siyang mag-isa magpo-POST sa API
const submitResultsToBackend = useCallback(
  async (finalAnswers: typeof answers, finalTimeTaken: number) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

      const totalScore = finalAnswers.reduce((sum, a) => sum + a.points, 0);
      const totalPoints =
        quiz.questions?.reduce(
          (sum: number, q: any) => sum + (q.points || 10),
          0,
        ) || 0;
      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;

      const wrongTopics = finalAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => {
          const questionObj = quiz.questions.find(
            (q: any) => q.id === a.questionId || q._id === a.questionId,
          );
          return (
            questionObj?.topic ||
            questionObj?.category ||
            quiz.category ||
            "General"
          );
        })
        .filter((topic, index, self) => self.indexOf(topic) === index);

      const attemptPayload = {
        score: totalScore,
        totalPoints,
        correctCount,
        totalQuestions,
        timeTaken: finalTimeTaken,
        answers: finalAnswers,
        wrongTopics,
      };

if (onComplete) {
      const serverData = await onComplete(attemptPayload);
      if (serverData) {
        setBackendResult(serverData);
      }
    }
  },
  [quiz, totalQuestions, onComplete]
);


  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    setIsFinished(true);
    submitResultsToBackend(answers, timeTaken);
  }, [answers, timeTaken, submitResultsToBackend]);

  // 🛡️ INTEGRATION NG ANTI-CHEAT HOOK
  const {
    videoRef,
    warnings,
    isFullscreen,
    isCameraActive,
    cameraError,
    requestFullscreenAgain,
  } = useAntiCheat({
    enabled: isAntiCheatRequired && !isFinished,
    maxWarnings: 3,
    onViolationExceeded: () => {
      alert(
        "Nalampasan mo ang limit sa anti-cheat warnings! Awtomatikong isu-submit ang iyong exam.",
      );
      handleTimeUp();
    },
  });

const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !currentQuestion) return;

      setSelectedAnswer(answer);
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

      let isCorrect = false;
      let pointsEarned = 0;
      const maxPoints = currentQuestion.points || 10;

      // 🌟 CHECKING LOGIC PARA SA MATCHING AT OTHER QUESTION TYPES
      if (currentQuestion.type === 'matching' && currentQuestion.matchPairs) {
        const result = calculateMatchingScore(answer, currentQuestion.matchPairs, maxPoints);
        // Fully correct o may partial score:
        isCorrect = result.isFullyCorrect; // Magiging TRUE pag 4/4 matches
        pointsEarned = result.score;       // Makakakuha ng proportional points (hal. 10/20 pts)
      } else {
        // Standard normalize check para sa MCQ, True/False, at Fill in the blank
        const normUser = String(answer || '').replace(/[<>]/g, '').trim().toLowerCase();
        const normCorrect = Array.isArray(currentQuestion.correctAnswer)
          ? currentQuestion.correctAnswer.map((c) => String(c).replace(/[<>]/g, '').trim().toLowerCase()).join('|')
          : String(currentQuestion.correctAnswer || '').replace(/[<>]/g, '').trim().toLowerCase();

        isCorrect = normUser === normCorrect;
        pointsEarned = isCorrect ? maxPoints : 0;
      }

      setShowResult(true);

      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          userAnswer: answer,
          isCorrect,
          points: pointsEarned,
          timeSpent,
        },
      ]);
    },
    [showResult, currentQuestion, questionStartTime]
  );

  const handleNext = () => {
    if (isLastQuestion) {
      setIsTimerRunning(false);
      const finalTime =
        timeTaken + Math.round((Date.now() - questionStartTime) / 1000);
      setTimeTaken(finalTime);
      setIsFinished(true);
      submitResultsToBackend(answers, finalTime);
    } else {
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleRetry = () => {
    hasSubmittedRef.current = false;
    setCurrentIndex(0);
    setAnswers([]);
    setIsFinished(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsTimerRunning(true);
    setQuestionStartTime(Date.now());
  };

  useEffect(() => {
    if (!isFinished) {
      const interval = setInterval(() => {
        setTimeTaken((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFinished]);

  if (isFinished) {
    const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
    const totalPoints =
      quiz.questions?.reduce(
        (sum: number, q: any) => sum + (q.points || 10),
        0,
      ) || 0;
    const correctCount = answers.filter((a) => a.isCorrect).length;

    return (
      <ResultsSummary
        quiz={quiz}
        score={totalScore}
        totalPoints={totalPoints}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        timeTaken={timeTaken}
        xpEarned={backendResult?.xpEarned ?? (correctCount * 15)}
        xpBreakdownData={backendResult?.xpBreakdown}
        answers={answers}
        onRetry={handleRetry}
        onBackToHub={onBackToHub}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto relative select-none">
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
              "Kailangan mong i-allow ang camera permission para sa official exam na ito."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg text-sm hover:bg-emerald-600 transition-all"
          >
            Subukan Uli
          </button>
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
            className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-lg text-sm hover:bg-amber-400 transition-all"
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

      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-1.5 text-sm text-quest-textDim hover:text-quest-text transition-colors"
        >
          <i className="ri-arrow-left-line" />
          Exit Quiz
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-quest-textDim">
              {currentIndex + 1}/{totalQuestions}
            </span>
            <div className="w-32 h-1.5 rounded-full bg-quest-bg overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-quest-primary"
                animate={{
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <Timer
            totalSeconds={quiz.timeLimit || 300}
            onTimeUp={handleTimeUp}
            isRunning={isTimerRunning}
            questionTimeLimit={currentQuestion?.timeLimit}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id || currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-quest-card border border-quest-border rounded-xl p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-quest-primary/10 text-quest-primary border border-quest-primary/20">
                Question {currentIndex + 1}
              </span>
              <span className="text-xs text-quest-textDim flex items-center gap-1">
                <i className="ri-star-line text-quest-gold" />
                {currentQuestion?.points || 10} points
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
                {answers[currentIndex]?.isCorrect ? "Correct!" : "Incorrect"}
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
          />

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 flex items-center justify-end"
            >
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-quest-primary text-white text-sm font-semibold hover:bg-emerald-600 transition-all whitespace-nowrap"
              >
                {isLastQuestion ? "See Results" : "Next Question"}
                <i className="ri-arrow-right-line" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
