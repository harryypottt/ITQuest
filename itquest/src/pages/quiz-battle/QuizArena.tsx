import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import QuizPlayer from "./components/QuizPlayer";
import BattleArena from "./components/BattleArena";
import BossBattle from "./components/BossBattle";
import api from "@/services/api";
import { normalizeQuestion } from "@/services/quizAdapter";

export default function QuizArena() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [bossData, setBossData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleBackToHub = () => {
    navigate("/quiz-battle");
  };

  useEffect(() => {
    const fetchArenaData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg("");

        const isBossRoute = id.startsWith("boss-") || id.startsWith("elite-");

        if (isBossRoute) {
          const res = await api.get(`/student/bosses/${id}`);
          if (res.data?.success && res.data?.boss) {
            const fetchedBoss = res.data.boss;
            setBossData({
              ...fetchedBoss,
              questions: (fetchedBoss.questions || []).map(normalizeQuestion),
            });
          } else {
            setErrorMsg("Boss entity data not found in MySQL Database.");
          }
          setLoading(false);
          return;
        }

        // Regular Quiz / Battle Arena Route mula sa MySQL
        const res = await api.get(`/student/quizzes/${id}`);
        if (res.data?.success && res.data?.quiz) {
          const fetchedQuiz = res.data.quiz;
          setQuiz({
            ...fetchedQuiz,
            attempts: res.data.attempts || fetchedQuiz.attempts || [],
            questions: (fetchedQuiz.questions || []).map(normalizeQuestion),
          });
        } else {
          setErrorMsg("Quiz assessment not found in MySQL database.");
        }
      } catch (err) {
        console.error("Error fetching arena data:", err);
        setErrorMsg("Failed to connect to backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchArenaData();
  }, [id]);

  const handleBossComplete = async (result: {
    passed: boolean;
    xpEarned: number;
    bossHpRemaining: number;
  }) => {
    try {
      await api.post(`/student/bosses/${id}/attempt`, {
        passed: result.passed,
        xpEarned: result.xpEarned,
        bossHpRemaining: result.bossHpRemaining,
      });
    } catch (err) {
      console.error("Error saving boss attempt:", err);
    }
  };
const handleQuizComplete = async (attemptData: any) => {
    try {
      const totalQ = attemptData.totalQuestions || quiz?.questions?.length || 0;

      // 🟢 Tamang percentage computation (e.g. 5/8 = 63%)
      const percentage =
        totalQ > 0
          ? Math.round((attemptData.correctCount / totalQ) * 100)
          : 0;

      const res = await api.post(`/student/quizzes/${id}/attempt`, {
        score: attemptData.score,
        totalQuestions: totalQ,
        percentage,
        correctCount: attemptData.correctCount,
        timeTaken: attemptData.timeTaken,
        answers: attemptData.answers,
        attemptType: quiz?.type === "battle" ? "ranked" : "solo",
      });

      return res.data?.data;
    } catch (err) {
      console.error("Error saving quiz attempt:", err);
    }
  };
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-slate-400">
          <i className="ri-loader-4-line animate-spin text-3xl text-emerald-400 mb-2 inline-block" />
          <p className="text-sm">Loading Arena Data from Database...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (errorMsg) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="ri-error-warning-line" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">{errorMsg}</h2>
          <p className="text-xs text-slate-400 mb-6">
            Verify that the database seed exists in your MySQL server.
          </p>
          <button
            onClick={handleBackToHub}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600"
          >
            Back to Quiz Battle Hub
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (bossData) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <BossBattle
            boss={bossData}
            questions={bossData.questions || []}
            onBackToHub={handleBackToHub}
            onComplete={handleBossComplete}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <h2 className="text-lg font-bold text-white mb-2">
            Assessment Not Found
          </h2>
          <button
            onClick={handleBackToHub}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
          >
            Back to Quiz Battle
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {quiz.type === "battle" ? (
          <BattleArena
            quiz={quiz}
            onBackToHub={handleBackToHub}
            onComplete={handleQuizComplete}
          />
        ) : (
          <QuizPlayer
            quiz={quiz}
            onBackToHub={handleBackToHub}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
