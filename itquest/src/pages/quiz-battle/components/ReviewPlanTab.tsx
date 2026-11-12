import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface ReviewRecommendation {
  topicTitle: string;
  category: string;
  accuracy: number;
  reason: string;
}

export default function ReviewPlanTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<ReviewRecommendation[]>([]);

  useEffect(() => {
    const fetchReviewPlan = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/review-plan');
        if (res.data?.success && Array.isArray(res.data?.recommendations)) {
          setRecommendations(res.data.recommendations);
        } else {
          loadFallbackData();
        }
      } catch (err) {
        console.warn("Review Plan API error, loading fallback:", err);
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchReviewPlan();
  }, []);

  const loadFallbackData = () => {
    setRecommendations([
      {
        topicTitle: "HTML5 Fundamentals & Semantics",
        category: "Frontend",
        accuracy: 58,
        reason: "Low Accuracy Topic (58%) • Suggested Review",
      },
      {
        topicTitle: "Cybersecurity Basics & OWASP",
        category: "Cybersecurity",
        accuracy: 63,
        reason: "Needs Attention (63%) • Suggested Review",
      },
    ]);
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-quest-textMuted">
        <i className="ri-loader-4-line animate-spin text-2xl text-cyan-400 mb-2 inline-block" />
        <p className="text-sm">Generating personalized review plan based on your scores...</p>
      </div>
    );
  }

  return (
    <div className="bg-quest-card border border-quest-border rounded-xl p-6 select-none">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <i className="ri-book-open-line text-cyan-400" /> Recommended Review Plan
          </h3>
          <p className="text-xs text-quest-textMuted mt-1">
            Mga topic na iminumungkahing i-review batay sa iyong quiz performance (Accuracy &lt; 75%).
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {recommendations.length} Topics for Review
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-quest-border rounded-xl">
          <i className="ri-checkbox-circle-line text-3xl text-emerald-400 mb-2 inline-block" />
          <h4 className="text-sm font-bold text-white">Great Job! No Urgent Reviews Needed</h4>
          <p className="text-xs text-quest-textMuted mt-1">
            Lahat ng sinagutan mong topics ay nasa taas ng 75% accuracy.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <i className="ri-error-warning-line text-cyan-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.topicTitle}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-cyan-300 font-semibold">{item.category}</span>
                    <span className="text-[10px] text-quest-textDim">•</span>
                    <span className="text-[10px] text-rose-400 font-mono font-semibold">{item.reason}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/lessons')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="ri-book-read-line" />
                Start Lesson
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}