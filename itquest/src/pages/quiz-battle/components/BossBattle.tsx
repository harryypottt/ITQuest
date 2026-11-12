import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import QuestionRenderer from "./QuestionRenderer";
import Timer from "./Timer";

export interface BossBadgeReward {
  name: string;
  rarity?: string;
}

export interface BossData {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  hp?: number;
  level?: number;
  element?: string;
  description?: string;
  xpReward?: number;
  badgeReward?: string | BossBadgeReward | any;
  questions?: any[];
  [key: string]: any;
}

export interface BossBattleProps {
  boss: BossData;
  questions?: any[];
  onBackToHub: () => void;
  onComplete?: (result: { passed: boolean; xpEarned: number; bossHpRemaining: number }) => void;
}

interface FloatingDamage {
  id: number;
  amount: number;
  isCrit: boolean;
  target: "boss" | "player";
}

export default function BossBattle({ boss, questions = [], onBackToHub, onComplete }: BossBattleProps) {
  const battleQuestions = useMemo(() => {
    if (questions && questions.length > 0) return questions;
    if (boss.questions && boss.questions.length > 0) return boss.questions;
    return [];
  }, [questions, boss]);

  const maxBossHp = boss.hp || 500;
  const maxPlayerHp = 100;
  const xpReward = boss.xpReward || 500;

  const [phase, setPhase] = useState<"intro" | "fighting" | "victory" | "defeat">("intro");
  const [bossHp, setBossHp] = useState(maxBossHp);
  const [playerHp, setPlayerHp] = useState(maxPlayerHp);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [isBossHit, setIsBossHit] = useState(false);
  const [isPlayerHit, setIsPlayerHit] = useState(false);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [turnAction, setTurnAction] = useState<string>("");

  const currentQuestion = battleQuestions[currentIndex];
  const totalQuestions = battleQuestions.length;

  const triggerDamageText = useCallback((amount: number, isCrit: boolean, target: "boss" | "player") => {
    const id = Date.now() + Math.random();
    setFloatingDamages((prev) => [...prev, { id, amount, isCrit, target }]);
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1200);
  }, []);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || phase !== "fighting" || !currentQuestion) return;

      setSelectedAnswer(answer);
      const correct = answer === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      setShowResult(true);

      const baseDamage = currentQuestion.points ? currentQuestion.points * 10 : 80;

      if (correct) {
        const isCrit = Math.random() < 0.25;
        const damageDealt = isCrit ? Math.round(baseDamage * 1.5) : baseDamage;

        setIsBossHit(true);
        setTimeout(() => setIsBossHit(false), 500);

        triggerDamageText(damageDealt, isCrit, "boss");
        setTurnAction(`⚔️ Critical Hit! You dealt ${damageDealt} damage to ${boss.name}!`);

        setBossHp((prev) => {
          const nextHp = Math.max(0, prev - damageDealt);
          if (nextHp === 0) {
            setTimeout(() => setPhase("victory"), 1000);
          }
          return nextHp;
        });
      } else {
        const bossDamage = 25;

        setIsPlayerHit(true);
        setTimeout(() => setIsPlayerHit(false), 500);

        triggerDamageText(bossDamage, false, "player");
        setTurnAction(`💥 ${boss.name} counter-attacked! You took ${bossDamage} damage!`);

        setPlayerHp((prev) => {
          const nextHp = Math.max(0, prev - bossDamage);
          if (nextHp === 0) {
            setTimeout(() => setPhase("defeat"), 1000);
          }
          return nextHp;
        });
      }
    },
    [showResult, phase, currentQuestion, boss.name, triggerDamageText]
  );

  const handleNextTurn = () => {
    if (bossHp <= 0) {
      setPhase("victory");
      return;
    }
    if (playerHp <= 0) {
      setPhase("defeat");
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTurnAction("");
    } else {
      if (bossHp < maxBossHp * 0.3) {
        setPhase("victory");
      } else {
        setPhase("defeat");
      }
    }
  };

  const handleTimeUp = () => {
    if (!showResult) {
      handleAnswer("__TIME_EXPIRED__");
    }
  };

  const handleStartFight = () => {
    setPhase("fighting");
    setBossHp(maxBossHp);
    setPlayerHp(maxPlayerHp);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (phase === "victory" && onComplete) {
      onComplete({ passed: true, xpEarned: xpReward, bossHpRemaining: bossHp });
    } else if (phase === "defeat" && onComplete) {
      onComplete({ passed: false, xpEarned: Math.round(xpReward * 0.2), bossHpRemaining: bossHp });
    }
  }, [phase, xpReward, bossHp, onComplete]);

  return (
    <div className="max-w-4xl mx-auto p-4 select-none">
      {phase === "intro" && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border border-purple-500/30 bg-[#0e0c18] p-8 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-600 border-2 border-purple-400/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <i className="ri-skull-2-line text-5xl text-purple-200" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-purple-500/20 text-purple-400 border border-purple-500/30">
            ELITE BOSS QUEST • LVL {boss.level || 1}
          </span>

          <h1 className="text-3xl font-black text-white mt-3 mb-1">{boss.name}</h1>
          <p className="text-sm text-purple-300/80 mb-4">{boss.title}</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">{boss.description}</p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8 bg-[#151224] p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Boss HP</span>
              <span className="text-lg font-bold font-mono text-rose-400">{maxBossHp} HP</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Questions</span>
              <span className="text-lg font-bold font-mono text-white">{totalQuestions} Items</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reward</span>
              <span className="text-lg font-bold font-mono text-amber-400">+{xpReward} XP</span>
            </div>
          </div>

          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={onBackToHub}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-[#161426] text-slate-300 text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              Retreat
            </button>
            <button
              onClick={handleStartFight}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Start Boss Battle ⚔️
            </button>
          </div>
        </motion.div>
      )}

      {phase === "fighting" && currentQuestion && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHub}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line" /> Flee Battle
            </button>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-400">
                Turn {currentIndex + 1}/{totalQuestions}
              </span>
              <Timer
                totalSeconds={currentQuestion.timeLimit || 25}
                onTimeUp={handleTimeUp}
                isRunning={!showResult}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0e0c18] border border-purple-500/20 p-5 rounded-2xl relative overflow-hidden">
            <motion.div
              animate={isPlayerHit ? { x: [-10, 10, -8, 8, 0] } : {}}
              className="p-4 rounded-xl bg-[#141122] border border-white/5 relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <i className="ri-shield-user-line" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Player Hero</h4>
                    <span className="text-[10px] text-slate-400">Challenger</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {playerHp}/{maxPlayerHp} HP
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                />
              </div>

              {floatingDamages
                .filter((d) => d.target === "player")
                .map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -30 }}
                    className="absolute top-2 right-4 text-sm font-bold font-mono text-rose-500"
                  >
                    -{d.amount} HP
                  </motion.div>
                ))}
            </motion.div>

            <motion.div
              animate={isBossHit ? { x: [-12, 12, -8, 8, 0] } : {}}
              className="p-4 rounded-xl bg-[#141122] border border-rose-500/20 relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <i className="ri-skull-line" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-400">{boss.name}</h4>
                    <span className="text-[10px] text-slate-400">Boss Entity</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {bossHp}/{maxBossHp} HP
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${(bossHp / maxBossHp) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400"
                />
              </div>

              {floatingDamages
                .filter((d) => d.target === "boss")
                .map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 1, y: 0, scale: d.isCrit ? 1.4 : 1 }}
                    animate={{ opacity: 0, y: -35 }}
                    className={`absolute top-2 right-4 text-sm font-black font-mono ${
                      d.isCrit ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {d.isCrit ? "CRIT! " : ""}-{d.amount} HP
                  </motion.div>
                ))}
            </motion.div>
          </div>

          {turnAction && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs font-semibold py-2 px-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300"
            >
              {turnAction}
            </motion.div>
          )}

          <div className="bg-[#0e0c18] border border-white/10 rounded-2xl p-6 shadow-xl">
            <QuestionRenderer
              question={currentQuestion}
              onAnswer={handleAnswer}
              userAnswer={selectedAnswer}
              showResult={showResult}
              isCorrect={isCorrect}
              disabled={showResult}
            />

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <button
                  onClick={handleNextTurn}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-all cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  {currentIndex < totalQuestions - 1 ? "Next Turn ⚔️" : "Finish Battle"}
                  <i className="ri-arrow-right-line" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {phase === "victory" && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border border-emerald-500/30 bg-[#0e0c18] p-8 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400 text-4xl">
            <i className="ri-trophy-line" />
          </div>
          <h2 className="text-3xl font-black text-white mb-1">VICTORY!</h2>
          <p className="text-xs text-emerald-400 mb-6">You defeated {boss.name}!</p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#151224] border border-emerald-500/20 mb-8">
            <i className="ri-flashlight-line text-amber-400 text-xl" />
            <span className="text-xl font-bold font-mono text-amber-400">+{xpReward} XP</span>
          </div>

          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={handleStartFight}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-[#161426] text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              Fight Again
            </button>
            <button
              onClick={onBackToHub}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Back to Hub
            </button>
          </div>
        </motion.div>
      )}

      {phase === "defeat" && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border border-rose-500/30 bg-[#0e0c18] p-8 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-500 text-4xl">
            <i className="ri-skull-2-line" />
          </div>
          <h2 className="text-3xl font-black text-white mb-1">DEFEATED!</h2>
          <p className="text-xs text-rose-400 mb-6">{boss.name} overwhelmed your defenses!</p>

          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={handleStartFight}
              className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-500 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
            >
              Retry Battle 🔄
            </button>
            <button
              onClick={onBackToHub}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-[#161426] text-slate-300 text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              Back to Hub
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}