import { useState, useEffect } from "react";
import api from "@/services/api";

interface CategoryAccuracy {
  name: string;
  accuracy: number;
  questionsCount: number;
  avgTime: string;
  trend: 'improving' | 'stable' | 'needs_attention';
}

interface TopicMastery {
  id: string;
  title: string;
  category: string;
  accuracy: number;
  questionsCount: number;
  lastAttempt: string;
  status: 'Mastered' | 'Proficient' | 'Developing' | 'Needs Work';
}

export default function MasteryTab() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategoryAccuracy[]>([]);
  const [topicData, setTopicData] = useState<TopicMastery[]>([]);

  useEffect(() => {
    const fetchMastery = async () => {
      try {
        setLoading(true);
        // Kunin ang tunay na mastery metrics ng user mula sa backend
        const res = await api.get('/student/mastery');
        if (res.data?.success && res.data?.categories) {
          setCategoryData(res.data.categories);
          setTopicData(res.data.topics || []);
        } else {
          // Fallback static view habang ginagawa pa ang backend endpoint
          loadFallbackData();
        }
      } catch (err) {
        console.warn("Mastery API not ready yet, loading fallback mockup:", err);
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchMastery();
  }, []);

  const loadFallbackData = () => {
    setCategoryData([
      { name: 'Frontend', accuracy: 81, questionsCount: 116, avgTime: '12.5s', trend: 'improving' },
      { name: 'Backend', accuracy: 85, questionsCount: 38, avgTime: '10.2s', trend: 'stable' },
      { name: 'Database', accuracy: 68, questionsCount: 34, avgTime: '14.8s', trend: 'improving' },
      { name: 'Cybersecurity', accuracy: 61, questionsCount: 18, avgTime: '16.3s', trend: 'needs_attention' },
      { name: 'UI/UX', accuracy: 92, questionsCount: 12, avgTime: '8.7s', trend: 'stable' },
    ]);

    setTopicData([
      { id: '1', title: 'HTML5 Semantics', category: 'Frontend', accuracy: 85, questionsCount: 24, lastAttempt: '2026-05-26', status: 'Proficient' },
      { id: '2', title: 'React Hooks', category: 'Frontend', accuracy: 90, questionsCount: 16, lastAttempt: '2026-05-26', status: 'Mastered' },
      { id: '3', title: 'SQL JOINs', category: 'Database', accuracy: 78, questionsCount: 20, lastAttempt: '2026-05-25', status: 'Proficient' },
      { id: '4', title: 'OWASP Vulnerabilities', category: 'Cybersecurity', accuracy: 61, questionsCount: 18, lastAttempt: '2026-11-09', status: 'Developing' },
    ]);
  };

  const getStatusStyle = (status: TopicMastery['status']) => {
    switch (status) {
      case 'Mastered':
        return { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', bar: 'bg-emerald-400' };
      case 'Proficient':
        return { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', bar: 'bg-cyan-400' };
      case 'Developing':
        return { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', bar: 'bg-amber-400' };
      case 'Needs Work':
        return { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', bar: 'bg-rose-400' };
    }
  };

  const getCategoryBarColor = (accuracy: number) => {
    if (accuracy >= 85) return 'bg-cyan-400';
    if (accuracy >= 75) return 'bg-emerald-400';
    if (accuracy >= 65) return 'bg-amber-400';
    return 'bg-amber-500';
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-quest-textMuted">
        <i className="ri-loader-4-line animate-spin text-2xl text-emerald-400 mb-2 inline-block" />
        <p className="text-sm">Calculating Topic Mastery stats...</p>
      </div>
    );
  }

return (
    <div className="space-y-8 select-none">
      {/* 🟢 EMPTY STATE: Ipakikita LANG kapag wala pang quiz attempt ang user */}
      {categoryData.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-quest-border rounded-xl text-quest-textMuted text-xs bg-quest-card/50">
          <i className="ri-bar-chart-box-line text-3xl text-emerald-400 mb-2 inline-block" />
          <h4 className="text-sm font-bold text-white mb-1">Wala ka pang quiz attempts</h4>
          <p>Mag-take ng unang quiz sa Assessments tab para makita ang iyong mastery metrics!</p>
        </div>
      ) : (
        <>
          {/* 🟢 SECTION 1: CATEGORY ACCURACY */}
          <div className="bg-quest-card border border-quest-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
              <i className="ri-history-line text-emerald-400" /> Category Accuracy
            </h3>

            <div className="space-y-6">
              {categoryData.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{cat.name}</span>
                      {cat.trend === 'improving' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                          <i className="ri-arrow-up-line" /> Improving
                        </span>
                      )}
                      {cat.trend === 'stable' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/10 text-slate-400">
                          <i className="ri-subtract-line" /> Stable
                        </span>
                      )}
                      {cat.trend === 'needs_attention' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400">
                          <i className="ri-arrow-down-line" /> Needs attention
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-white font-mono">{cat.accuracy}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getCategoryBarColor(cat.accuracy)}`}
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-quest-textDim">
                    <span>{cat.questionsCount} questions</span>
                    <span>{cat.avgTime} avg time</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🟢 SECTION 2: TOPIC MASTERY BREAKDOWN */}
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <i className="ri-bar-chart-horizontal-line text-emerald-400" /> Topic Mastery Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicData.map((topic) => {
                const style = getStatusStyle(topic.status);
                return (
                  <div
                    key={topic.id}
                    className="bg-quest-card border border-quest-border rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-white leading-tight">{topic.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap ${style.badge}`}>
                          {topic.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-quest-textDim mb-4">{topic.category}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-900/80 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${style.bar}`}
                            style={{ width: `${topic.accuracy}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold font-mono text-white">{topic.accuracy}%</span>
                      </div>

                      <p className="text-[10px] text-quest-textMuted">
                        {topic.questionsCount} questions • last {topic.lastAttempt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}