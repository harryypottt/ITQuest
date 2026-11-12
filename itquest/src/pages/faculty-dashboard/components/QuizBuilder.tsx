import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type FacultyQuiz, type FacultyQuizQuestion } from '@/sampleData/facultyContentData';

const topics = ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Database', 'Cybersecurity', 'UI/UX', 'General'];

// 🌟 ULTIMATE SAFE OPTIONS PARSER
const normalizeOptions = (rawOptions: any): string[] => {
  let result: string[] = [];

  if (Array.isArray(rawOptions)) {
    result = rawOptions.map((o) => String(o || ''));
  } else if (typeof rawOptions === 'string' && rawOptions.trim() !== '') {
    try {
      let parsed = JSON.parse(rawOptions);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) {
        result = parsed.map((o) => String(o || ''));
      }
    } catch (e) {
      result = [];
    }
  }

  // TIYAKIN NA EXACTLY 4 STRINGS LAGI ANG LAMAN NG ARRAY
  return [
    result[0] || '',
    result[1] || '',
    result[2] || '',
    result[3] || '',
  ];
};

export default function QuizBuilder({
  editingQuiz,
  onClose,
  onSuccess,
}: {
  editingQuiz?: FacultyQuiz;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('JavaScript');
  const [passingScore, setPassingScore] = useState(80);
  const [timeLimit, setTimeLimit] = useState(20);
  const [attemptsAllowed, setAttemptsAllowed] = useState(3);
  const [xpReward, setXpReward] = useState(100);
  const [questions, setQuestions] = useState<FacultyQuizQuestion[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 MAPILIT AT AUTOMATIC INITIALIZATION NG STATE
  useEffect(() => {
    if (editingQuiz) {
      setTitle(editingQuiz.title || '');
      setDescription(editingQuiz.description || '');
      setTopic(editingQuiz.topic || 'JavaScript');
      setPassingScore(editingQuiz.passingScore || 80);
      setTimeLimit(editingQuiz.timeLimit || 20);
      setAttemptsAllowed(editingQuiz.attemptsAllowed || 3);
      setXpReward(editingQuiz.xpReward || 100);

      if (editingQuiz.questions && Array.isArray(editingQuiz.questions) && editingQuiz.questions.length > 0) {
        const mapped = editingQuiz.questions.map((q: any, i: number) => ({
          id: String(q.id || `q-${Date.now()}-${i}`),
          type: q.type || 'mcq',
          question: q.question || '',
          options: normalizeOptions(q.options), // 👈 GUARANTEED 4 ITEMS ARRAY
          correctAnswer: String(q.correctAnswer || q.correct_answer || ''),
          explanation: q.explanation || '',
          points: Number(q.points) || 10,
        }));
        setQuestions(mapped);
      } else {
        setQuestions([
          {
            id: `q-${Date.now()}`,
            type: 'mcq',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: '',
            points: 10,
          },
        ]);
      }
    } else {
      setTitle('');
      setDescription('');
      setTopic('JavaScript');
      setPassingScore(80);
      setTimeLimit(20);
      setAttemptsAllowed(3);
      setXpReward(100);
      setQuestions([
        {
          id: `q-${Date.now()}`,
          type: 'mcq',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          points: 10,
        },
      ]);
    }
  }, [editingQuiz]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${questions.length}`,
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 10,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<FacultyQuizQuestion>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const updateOption = (qid: string, idx: number, value: string) => {
    const q = questions.find((qq) => qq.id === qid);
    if (!q) return;

    const currentOptions = normalizeOptions(q.options);
    const oldVal = currentOptions[idx];
    const nextOptions = [...currentOptions];
    nextOptions[idx] = value;

    const isCurrentCorrect = q.correctAnswer === oldVal;

    updateQuestion(qid, {
      options: nextOptions,
      correctAnswer: isCurrentCorrect ? value : q.correctAnswer,
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim()) errs.description = 'Description is required';
    questions.forEach((q, i) => {
      const opts = normalizeOptions(q.options);
      if (!q.question.trim()) errs[`q-${i}-question`] = 'Question text is required';
      if (opts.some((o) => !o.trim())) errs[`q-${i}-options`] = 'All options must be filled';
      if (!q.correctAnswer.trim()) errs[`q-${i}-correct`] = 'Correct answer is required';
      if (!opts.includes(q.correctAnswer)) errs[`q-${i}-correct`] = 'Correct answer must match one of the options';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildQuizPayload = (status: FacultyQuiz['status']) => ({
    title,
    description,
    topic,
    passingScore,
    timeLimit,
    attemptsAllowed,
    questions,
    status,
    createdBy: 'faculty-1',
    creatorName: 'Master Lamac',
    xpReward,
  });

  const handleSave = async (status: FacultyQuiz['status']) => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const payload = buildQuizPayload(status);
      const isEdit = !!editingQuiz?.id;
      const url = isEdit
        ? `http://localhost:5000/api/faculty/quizzes/${editingQuiz.id}`
        : 'http://localhost:5000/api/faculty/quizzes';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        console.error('Failed to save quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz to backend:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-cyan-300 bg-clip-text text-transparent">
            {editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Design multiple choice assessment and set grading criteria.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
        >
          <i className="ri-close-line text-lg" />
        </button>
      </div>

      <div className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title..."
            className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will this quiz assess?"
            rows={2}
            className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
          />
          {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
        </div>

        {/* QUIZ METADATA ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Topic</label>
            <div className="relative inline-flex items-center w-full">
              <i className="ri-filter-3-line absolute left-3 text-xs text-cyan-400 pointer-events-none" />
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full appearance-none bg-slate-950/90 border border-slate-800 rounded-xl pl-8 pr-8 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {topics.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-slate-200">
                    {t}
                  </option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 text-xs text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Passing Score (%)</label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Time Limit (min)</label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Attempts</label>
            <input
              type="number"
              value={attemptsAllowed}
              onChange={(e) => setAttemptsAllowed(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">XP Reward</label>
            <input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* QUESTIONS LIST SECTION */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Questions ({questions.length})
            </label>
            <button
              onClick={addQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <i className="ri-add-line" />
              Add Question
            </button>
          </div>

          {questions.map((q, idx) => {
            const currentOptions = normalizeOptions(q.options);

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-cyan-300">Question {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={q.points}
                      onChange={(e) => updateQuestion(q.id, { points: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-16 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none text-center"
                    />
                    <span className="text-xs text-slate-400">pts</span>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <i className="ri-delete-bin-line text-xs" />
                    </button>
                  </div>
                </div>

                <div>
                  <textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                    placeholder="Enter question text..."
                    rows={2}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                  {errors[`q-${idx}-question`] && <p className="text-xs text-rose-400 mt-1">{errors[`q-${idx}-question`]}</p>}
                </div>

                {/* 🌟 OPTIONS GRID - ALWAYS RENDERS 4 INPUTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentOptions.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 w-4">{String.fromCharCode(65 + optIdx)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                {errors[`q-${idx}-options`] && <p className="text-xs text-rose-400">{errors[`q-${idx}-options`]}</p>}

                {/* CORRECT ANSWER DROPDOWN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Correct Answer</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select correct answer</option>
                      {currentOptions.filter((o) => o && o.trim()).map((o, optionIndex) => (
                        <option key={`${o}-${optionIndex}`} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors[`q-${idx}-correct`] && <p className="text-xs text-rose-400 mt-1">{errors[`q-${idx}-correct`]}</p>}
                  </div>
                </div>

                {/* EXPLANATION */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Explanation</label>
                  <textarea
                    value={q.explanation}
                    onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={() => handleSave('draft')}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={isSubmitting}
          className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer whitespace-nowrap"
        >
          {isSubmitting ? 'Saving...' : editingQuiz ? 'Update & Publish' : 'Publish Quiz'}
        </button>
      </div>
    </div>
  );
}
