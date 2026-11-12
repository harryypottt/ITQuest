import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

export interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  matchPairs?: { left: string; right: string }[];
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: number;
  xpReward: number;
  timeLimit: number;
  passingScore: number;
  questionCount: number;
  type: 'solo' | 'battle';
  questions: QuizQuestion[];
  minPlayers?: number;
  maxPlayers?: number;
}

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: Quiz) => void;
}

const categories = ['Frontend', 'Backend', 'Database', 'Cybersecurity', 'Full Stack', 'UI/UX'];

const defaultQuestions: QuizQuestion[] = [
  {
    id: 'custom-q1',
    type: 'mcq',
    question: 'Sample Multiple Choice Question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
    explanation: 'Explanation for the correct answer.',
    points: 10,
  },
  {
    id: 'custom-q2',
    type: 'true-false',
    question: 'Sample True/False Question?',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Explanation for the correct answer.',
    points: 10,
  },
  {
    id: 'custom-q3',
    type: 'matching',
    question: 'Match each item with its correct description:',
    matchPairs: [
      { left: 'sticky', right: 'Fixed within parent until scrolled past' },
      { left: 'absolute', right: 'Positioned relative to nearest positioned ancestor' },
    ],
    correctAnswer: 'sticky>Fixed within parent until scrolled past|absolute>Positioned relative to nearest positioned ancestor',
    explanation: 'Match pairs based on CSS position definitions.',
    points: 20,
  },
];

export default function CreateAssessmentModal({ isOpen, onClose, onSave }: CreateAssessmentModalProps) {
  const [step, setStep] = useState<'details' | 'questions'>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [difficulty, setDifficulty] = useState(2);
  const [type, setType] = useState<'solo' | 'battle'>('solo');
  const [timeLimit, setTimeLimit] = useState(300);
  const [passingScore, setPassingScore] = useState(70);
  const [xpReward, setXpReward] = useState(200);
  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuestions);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const questionCount = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAddQuestion = () => {
    const newId = `custom-q${questions.length + 1}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 10,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = questions.map((q, i) => {
      if (i !== index) return q;

      if (field === 'type') {
        const newType = value as string;
        if (newType === 'matching' && (!q.matchPairs || q.matchPairs.length === 0)) {
          return {
            ...q,
            type: newType,
            matchPairs: [{ left: '', right: '' }, { left: '', right: '' }],
            correctAnswer: '',
          };
        }
        return { ...q, type: newType };
      }

      if (field === 'options' && Array.isArray(value)) {
        return { ...q, options: value };
      }

      if (field.startsWith('option-') && Array.isArray(q.options)) {
        const optIdx = parseInt(field.split('-')[1], 10);
        const newOpts = [...q.options];
        newOpts[optIdx] = value as string;
        return { ...q, options: newOpts };
      }

      return { ...q, [field]: value };
    });
    setQuestions(updated);
  };

  const handleMatchPairChange = (qIndex: number, pIndex: number, field: 'left' | 'right', val: string) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      const pairs = [...(q.matchPairs || [{ left: '', right: '' }, { left: '', right: '' }])];
      pairs[pIndex] = { ...pairs[pIndex], [field]: val };
      const autoCorrectAnswer = pairs.map((p) => `${p.left}>${p.right}`).join('|');
      return { ...q, matchPairs: pairs, correctAnswer: autoCorrectAnswer };
    });
    setQuestions(updated);
  };

  const handleAddMatchPair = (qIndex: number) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      const pairs = [...(q.matchPairs || []), { left: '', right: '' }];
      const autoCorrectAnswer = pairs.map((p) => `${p.left}>${p.right}`).join('|');
      return { ...q, matchPairs: pairs, correctAnswer: autoCorrectAnswer };
    });
    setQuestions(updated);
  };

  const handleRemoveMatchPair = (qIndex: number, pIndex: number) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      const pairs = (q.matchPairs || []).filter((_, idx) => idx !== pIndex);
      const autoCorrectAnswer = pairs.map((p) => `${p.left}>${p.right}`).join('|');
      return { ...q, matchPairs: pairs, correctAnswer: autoCorrectAnswer };
    });
    setQuestions(updated);
  };

  const handleSave = async () => {
    setError('');

    if (!title.trim()) { setError('Please enter an assessment title.'); return; }
    if (!description.trim()) { setError('Please enter a description.'); return; }
    if (questions.some((q) => !q.question.trim())) { setError('All questions must have text.'); return; }
    if (questions.some((q) => q.type === 'mcq' && Array.isArray(q.options) && q.options.some((o) => !o.trim()))) {
      setError('All MCQ options must be filled in.'); return;
    }
    if (
      questions.some((q) => {
        if (q.type === 'matching') {
          return !q.matchPairs || q.matchPairs.length < 2 || q.matchPairs.some((p) => !p.left.trim() || !p.right.trim());
        }
        return !q.correctAnswer || (typeof q.correctAnswer === 'string' && !q.correctAnswer.trim());
      })
    ) {
      setError('All questions must have complete correct answers or valid matching pairs.'); return;
    }

    setSaving(true);

    const quizPayload = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      xpReward,
      timeLimit,
      passingScore,
      questionCount,
      type,
      questions,
      ...(type === 'battle' ? { minPlayers: 2, maxPlayers: 8 } : {}),
    };

    try {
      const res = await api.post('/student/quizzes', quizPayload);
      const savedQuiz = res.data?.quiz || res.data?.data || quizPayload;
      onSave(savedQuiz);
    } catch (_err) {
      onSave(quizPayload);
    } finally {
      setSaving(false);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setStep('details');
    setTitle('');
    setDescription('');
    setCategory('Frontend');
    setDifficulty(2);
    setType('solo');
    setTimeLimit(300);
    setPassingScore(70);
    setXpReward(200);
    setQuestions(defaultQuestions);
    setError('');
  };

  const handleClose = () => { resetForm(); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 select-none" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <div className="bg-quest-card border border-quest-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-quest-border sticky top-0 bg-quest-card rounded-t-2xl z-10">
                <div>
                  <h2 className="text-lg font-bold text-quest-text">Create Custom Assessment</h2>
                  <p className="text-xs text-quest-textMuted mt-0.5">Design your own quiz for practice or competition</p>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-lg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-all">
                  <i className="ri-close-line" />
                </button>
              </div>

              <div className="flex items-center gap-2 p-4 border-b border-quest-border">
                {(['details', 'questions'] as const).map((s, idx) => (
                  <button key={s} onClick={() => setStep(s)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${step === s ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-quest-textDim border border-transparent'}`}>
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${step === s ? 'bg-emerald-500/20 text-emerald-400' : 'bg-quest-bg text-quest-textDim'}`}>{idx + 1}</span>
                    {s === 'details' ? 'Details' : 'Questions'}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {error && <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2"><i className="ri-error-warning-line" />{error}</div>}

                {step === 'details' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-quest-text mb-1.5">Title</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Advanced React Patterns Quiz" maxLength={80} className="w-full px-4 py-2.5 rounded-lg border border-quest-border bg-quest-bg text-quest-text text-sm outline-none focus:border-emerald-500/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-quest-text mb-1.5">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this assessment covers..." maxLength={300} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-quest-border bg-quest-bg text-quest-text text-sm outline-none focus:border-emerald-500/50 transition-all resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-quest-text mb-1.5">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-quest-border bg-quest-bg text-quest-text text-sm outline-none cursor-pointer">
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-quest-text mb-1.5">Difficulty</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value, 10))} className="w-full px-4 py-2.5 rounded-lg border border-quest-border bg-quest-bg text-quest-text text-sm outline-none cursor-pointer">
                          <option value={1}>1 - Easy</option><option value={2}>2 - Medium</option><option value={3}>3 - Hard</option><option value={4}>4 - Expert</option><option value={5}>5 - Legendary</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-quest-text mb-1.5">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value as 'solo' | 'battle')} className="w-full px-4 py-2.5 rounded-lg border border-quest-border bg-quest-bg text-quest-text text-sm outline-none cursor-pointer">
                          <option value="solo">Practice (Solo)</option>
                          <option value="battle">Competitive (Battle)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-quest-text mb-1.5">XP Reward</label>
                        <input type="number" value={xpReward} onChange={(e) => setXpReward(Math.max(50, Math.min(1000, parseInt(e.target.value, 10) || 200)))} min={50} max={1000} className="w-full px-4 py-2.5 rounded-lg border border-quest-border bg-quest-bg text-quest-text text-sm outline-none" />
                      </div>
                    </div>
                  </>
                )}

                {step === 'questions' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-quest-textDim">{questions.length} questions • {totalPoints} total points</span>
                      <button onClick={handleAddQuestion} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"><i className="ri-add-line" /> Add Question</button>
                    </div>

                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-quest-border bg-quest-bg/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-quest-gold">Question {idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <select value={q.type} onChange={(e) => handleQuestionChange(idx, 'type', e.target.value)} className="px-2 py-1 rounded-md border border-quest-border bg-quest-bg text-quest-text text-[10px] outline-none cursor-pointer">
                              <option value="mcq">Multiple Choice</option>
                              <option value="true-false">True/False</option>
                              <option value="fill-blank">Fill in Blank</option>
                              <option value="matching">Matching Pairs (Compare)</option>
                            </select>
                            {questions.length > 1 && (
                              <button onClick={() => handleRemoveQuestion(idx)} className="w-6 h-6 rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-400 flex items-center justify-center text-[10px] hover:bg-rose-500/20"><i className="ri-delete-bin-line" /></button>
                            )}
                          </div>
                        </div>

                        <input type="text" value={q.question} onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)} placeholder="Enter question text..." className="w-full px-3 py-2 rounded-lg border border-quest-border bg-quest-card text-quest-text text-sm outline-none focus:border-emerald-500/50 mb-3" />

                        {q.type === 'mcq' && q.options && (
                          <div className="space-y-2 mb-3">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <span className="text-[10px] text-quest-textDim w-4">{String.fromCharCode(65 + oIdx)}.</span>
                                <input type="text" value={opt} onChange={(e) => handleQuestionChange(idx, `option-${oIdx}`, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oIdx)}...`} className="flex-1 px-3 py-2 rounded-lg border border-quest-border bg-quest-card text-quest-text text-sm outline-none" />
                              </div>
                            ))}
                          </div>
                        )}

                        {(q.type === 'mcq' || q.type === 'fill-blank') && (
                          <div className="mb-3">
                            <label className="block text-[10px] font-semibold text-quest-textDim mb-1">Correct Answer</label>
                            <input type="text" value={typeof q.correctAnswer === 'string' ? q.correctAnswer : ''} onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)} placeholder={q.type === 'mcq' ? 'e.g., Option A' : 'e.g., exact answer'} className="w-full px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm outline-none" />
                          </div>
                        )}

                        {q.type === 'true-false' && (
                          <div className="mb-3">
                            <label className="block text-[10px] font-semibold text-quest-textDim mb-1">Correct Answer</label>
                            <select value={typeof q.correctAnswer === 'string' ? q.correctAnswer : 'True'} onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm outline-none cursor-pointer">
                              <option value="True">True</option>
                              <option value="False">False</option>
                            </select>
                          </div>
                        )}

                        {q.type === 'matching' && (
                          <div className="space-y-2 mb-3">
                            <label className="block text-[10px] font-semibold text-quest-textDim mb-1">Match Pairs (Left Item → Right Item)</label>
                            {(q.matchPairs || [{ left: '', right: '' }, { left: '', right: '' }]).map((pair, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2">
                                <input type="text" value={pair.left} onChange={(e) => handleMatchPairChange(idx, pIdx, 'left', e.target.value)} placeholder={`Left item ${pIdx + 1}`} className="flex-1 px-3 py-2 rounded-lg border border-quest-border bg-quest-card text-quest-text text-xs outline-none" />
                                <i className="ri-arrow-right-line text-slate-500 text-xs" />
                                <input type="text" value={pair.right} onChange={(e) => handleMatchPairChange(idx, pIdx, 'right', e.target.value)} placeholder={`Right item ${pIdx + 1}`} className="flex-1 px-3 py-2 rounded-lg border border-quest-border bg-quest-card text-quest-text text-xs outline-none" />
                                {(q.matchPairs?.length || 0) > 2 && (
                                  <button type="button" onClick={() => handleRemoveMatchPair(idx, pIdx)} className="w-7 h-7 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 flex items-center justify-center text-xs"><i className="ri-close-line" /></button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => handleAddMatchPair(idx)} className="mt-1 text-[11px] font-semibold text-emerald-400 flex items-center gap-1"><i className="ri-add-line" /> Add Matching Pair</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-5 border-t border-quest-border sticky bottom-0 bg-quest-card rounded-b-2xl">
                {step === 'details' ? (
                  <>
                    <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-quest-border text-quest-textDim text-sm font-semibold hover:text-quest-text transition-all">Cancel</button>
                    <button onClick={() => setStep('questions')} className="px-5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-2">Next: Questions <i className="ri-arrow-right-line" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setStep('details')} className="px-4 py-2 rounded-lg border border-quest-border text-quest-textDim text-sm font-semibold hover:text-quest-text transition-all flex items-center gap-2"><i className="ri-arrow-left-line" /> Back to Details</button>
                    <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-2">{saving ? 'Saving...' : 'Save Assessment'}</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}