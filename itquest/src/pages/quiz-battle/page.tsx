import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import QuizCard from "./components/QuizCard";
import CreateAssessmentModal from "./components/CreateAssessmentModal";
import InstructorAssessments from "./components/InstructorAssessments";
import JoinBattleModal from "./components/JoinBattleModal";
import MasteryTab from "./components/MasteryTab";
import ReviewPlanTab from "./components/ReviewPlanTab";
import QuestLinksTab from "./components/QuestLinksTab";
import { motion } from "framer-motion";

type FilterType = "all" | "solo" | "battle";
type FilterCategory = "all" | string;

type HubTab = "assessments" | "mastery" | "reviews" | "quests";

const hubTabs: { value: HubTab; label: string; icon: string }[] = [
  {
    value: "assessments",
    label: "Assessments",
    icon: "ri-question-answer-line",
  },
  { value: "mastery", label: "Mastery", icon: "ri-bar-chart-2-line" },
  { value: "reviews", label: "Review Plan", icon: "ri-book-open-line" },
  { value: "quests", label: "Quest Links", icon: "ri-git-branch-line" },
];

const battleModes = [
  {
    id: "classroom",
    name: "Classroom Battle",
    description: "Join live professor battle sessions via 6-digit PIN.",
    icon: "ri-keypad-line",
    color: "#10b981",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
  },
  {
    id: "ranked",
    name: "Ranked Arena",
    description:
      "Compete against peer learners to gain RP and climb divisions.",
    icon: "ri-trophy-line",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
  },
  {
    id: "elite-assessment",
    name: "AI Boss Battle",
    description: "Challenge AI Boss Entities to prove domain mastery.",
    icon: "ri-skull-2-line",
    color: "#a855f7",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
  },
];

export default function QuizBattle() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<HubTab>("assessments");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [dbQuizzes, setDbQuizzes] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizError, setQuizError] = useState("");

  const fetchHubData = async () => {
    try {
      setLoading(true);
      setQuizError("");
      const [quizzesRes, profileRes, statsRes] = await Promise.allSettled([
        api.get("/student/quizzes"),
        api.get("/student/profile"),
        api.get("/student/header-stats"),
      ]);

      if (quizzesRes.status === "fulfilled" && quizzesRes.value.data?.success) {
        setDbQuizzes(
          quizzesRes.value.data.quizzes || quizzesRes.value.data.data || [],
        );
      } else {
        setQuizError("Unable to fetch quizzes from server.");
      }

      let mergedProfile: any = {};
      if (profileRes.status === "fulfilled" && profileRes.value.data?.user) {
        mergedProfile = profileRes.value.data.user;
      }

      if (statsRes.status === "fulfilled" && statsRes.value.data?.stats) {
        const stats = statsRes.value.data.stats;
        mergedProfile = {
          ...mergedProfile,
          xp: stats.totalXp ?? mergedProfile.total_xp ?? mergedProfile.xp ?? 0,
          rank: stats.division ?? mergedProfile.rank ?? "Gold Division",
        };
      }

      setUserProfile(mergedProfile);
    } catch (err: any) {
      console.error("Failed to load hub data:", err);
      setQuizError("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(dbQuizzes.map((q) => q.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [dbQuizzes]);

  const visibleCategories = useMemo(() => {
    if (showAllCategories) return categories;
    return categories.slice(0, 6);
  }, [categories, showAllCategories]);

  const filteredQuizzes = useMemo(() => {
    return dbQuizzes.filter((q) => {
      if (typeFilter !== "all" && q.type !== typeFilter) return false;
      if (categoryFilter !== "all" && q.category !== categoryFilter)
        return false;
      if (
        searchQuery &&
        !q.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !q.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [dbQuizzes, typeFilter, categoryFilter, searchQuery]);

  const handleModeClick = (modeId: string) => {
    switch (modeId) {
      case "classroom":
        setShowJoinModal(true);
        break;
      case "ranked": {
        const rankedQuiz = dbQuizzes.find((q) => q.type === "battle");
        if (rankedQuiz) navigate(`/quiz-battle/${rankedQuiz.id}`);
        break;
      }
      case "elite-assessment":
        navigate("/quiz-battle/elite-code-dragon");
        break;
      default:
        break;
    }
  };

  const handleSaveCustomQuiz = (newQuiz: any) => {
    setDbQuizzes((prev) => [newQuiz, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 select-none">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            >
              <i className="ri-brain-line text-xl text-emerald-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text">
                Assessment & Skills Center
              </h1>
              <p className="text-xs text-quest-textMuted mt-0.5">
                Mastery-driven learning assessment • MySQL Database Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-quest-card border border-quest-border">
              <i className="ri-shield-flash-line text-amber-400 text-lg" />
              <div>
                <p className="text-[10px] text-quest-textDim">Student XP</p>
                <p className="text-xs font-bold text-amber-400">
                  {userProfile?.xp ?? userProfile?.total_xp ?? 0} XP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <i className="ri-trophy-line text-purple-400 text-lg" />
              <div>
                <p className="text-[10px] text-quest-textDim">Rank Division</p>
                <p className="text-xs font-bold text-purple-400">
                  {userProfile?.rank || userProfile?.division || "Gold Division"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Modes */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-quest-textMuted mb-3 flex items-center gap-2">
            <i className="ri-stack-line" /> Assessment Modes —{" "}
            <span className="text-quest-textDim font-normal">
              click to start
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {battleModes.map((mode, idx) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleModeClick(mode.id)}
                className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${mode.borderClass} ${mode.bgClass}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg bg-black/20 border flex items-center justify-center"
                    style={{ borderColor: mode.color }}
                  >
                    <i
                      className={mode.icon}
                      style={{ color: mode.color, fontSize: "0.9rem" }}
                    />
                  </div>
                  <span className="text-sm font-bold text-quest-text">
                    {mode.name}
                  </span>
                  <div className="ml-auto w-5 h-5 rounded-full bg-black/20 border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="ri-play-fill text-[10px] text-white" />
                  </div>
                </div>
                <p className="text-xs text-quest-textMuted leading-relaxed">
                  {mode.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-quest-card border border-quest-border mb-6 overflow-x-auto">
          {hubTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.value
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-quest-textDim hover:text-quest-text"
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-quest-textMuted">
            <i className="ri-loader-4-line animate-spin text-2xl text-emerald-400 mb-2 inline-block" />
            <p className="text-sm">
              Fetching assessments from MySQL Database...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {quizError && (
          <div className="p-4 mb-6 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
            <p className="text-sm text-rose-400 mb-2">{quizError}</p>
            <button
              onClick={fetchHubData}
              className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-lg hover:bg-rose-500/20"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* TAB 1: ASSESSMENTS VIEW */}
        {!loading &&
          activeTab === "assessments" &&
          (showInstructor ? (
            <InstructorAssessments onExit={() => setShowInstructor(false)} />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-quest-card border border-quest-border">
                  {(["all", "solo", "battle"] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                        typeFilter === type
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "text-quest-textDim hover:text-quest-text"
                      }`}
                    >
                      {type === "all"
                        ? "All"
                        : type === "solo"
                          ? "Practice"
                          : "Competitive"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {visibleCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                        categoryFilter === cat
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-quest-border bg-quest-card text-quest-textDim hover:text-quest-text"
                      }`}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all whitespace-nowrap"
                  >
                    <i className="ri-keypad-line" />
                    Join PIN
                  </button>
                  <button
                    onClick={() => setShowInstructor(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-all whitespace-nowrap"
                  >
                    <i className="ri-user-star-line" />
                    Instructor Exams
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-all whitespace-nowrap"
                  >
                    <i className="ri-add-line" />
                    Create Quiz
                  </button>
                </div>
              </div>

              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-16">
                  <i className="ri-search-line text-3xl text-quest-textDim mb-2 inline-block" />
                  <h3 className="text-base font-semibold text-quest-text">
                    No assessments found
                  </h3>
                  <p className="text-xs text-quest-textMuted">
                    Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuizzes.map((quiz, idx) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <QuizCard quiz={quiz} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ))}

        {/* TAB 2: MASTERY VIEW */}
        {!loading && activeTab === "mastery" && <MasteryTab />}

        {/* 📖 TAB 3: REVIEW PLAN VIEW */}
        {!loading && activeTab === "reviews" && <ReviewPlanTab />}

        {/* 🔗 TAB 4: QUEST LINKS VIEW */}
        {!loading && activeTab === "quests" && (
          <QuestLinksTab onRewardClaimed={fetchHubData} />
        )}
      </div>

      <CreateAssessmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveCustomQuiz}
      />
      <JoinBattleModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </DashboardLayout>
  );
}