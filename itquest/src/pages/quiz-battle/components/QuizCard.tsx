import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    difficulty?: number;
    xpReward?: number;
    timeLimit?: number;
    passingScore?: number;
    questionCount?: number;
    type?: string;
    badgeReward?: string;
    questions?: any[];
    attempts?: any[];
  };
  completed?: boolean;
  bestScore?: number;
}

export default function QuizCard({ quiz, completed, bestScore }: QuizCardProps) {
  const navigate = useNavigate();

  // Ligtas na pag-access sa fallback arrays
  const questionsList = quiz?.questions || [];
  const attemptsList = quiz?.attempts || [];

  // Kunin ang best score (gamitin ang ipinasang bestScore prop o i-compute mula sa attempts)
  const calculatedBestScore = attemptsList.reduce(
    (max, a) => Math.max(max, Number(a?.score) || 0),
    0
  );
  const finalBestScore = bestScore !== undefined ? bestScore : calculatedBestScore;
  const isCompleted = completed !== undefined ? completed : attemptsList.length > 0;

  const questionCount = quiz?.questionCount || questionsList.length || 0;

  const handleStartQuiz = () => {
    navigate(`/quiz-battle/${quiz.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-quest-card border border-quest-border rounded-2xl p-5 flex flex-col justify-between h-full hover:border-emerald-500/40 transition-all shadow-lg select-none relative overflow-hidden"
    >
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {quiz.category || "General"}
          </span>
          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <i className="ri-checkbox-circle-fill text-xs" /> Completed
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                quiz.type === "battle"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}
            >
              {quiz.type === "battle" ? "Competitive" : "Practice"}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-quest-text mb-2 line-clamp-1">
          {quiz.title}
        </h3>
        <p className="text-xs text-quest-textMuted line-clamp-2 mb-4 leading-relaxed">
          {quiz.description || "No description provided."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-black/20 rounded-xl border border-quest-border/50 text-center mb-4">
          <div>
            <p className="text-[10px] text-quest-textDim">Questions</p>
            <p className="text-xs font-bold text-white mt-0.5">{questionCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-quest-textDim">Best Score</p>
            <p className="text-xs font-bold text-amber-400 mt-0.5">
              {finalBestScore > 0 ? `${finalBestScore} pts` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-quest-textDim">Time Limit</p>
            <p className="text-xs font-bold text-cyan-400 mt-0.5">
              {quiz.timeLimit ? `${Math.round(quiz.timeLimit / 60)}m` : "5m"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-quest-border/40">
        {quiz.badgeReward ? (
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold truncate">
            <i className="ri-medal-line" />
            <span className="truncate">{quiz.badgeReward}</span>
          </div>
        ) : (
          <span className="text-[11px] text-quest-textDim">
            Passing: {quiz.passingScore || 70}%
          </span>
        )}

        <button
          onClick={handleStartQuiz}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all"
        >
          <span>{isCompleted ? "Retake" : "Start"}</span>
          <i className="ri-arrow-right-line" />
        </button>
      </div>
    </motion.div>
  );
}