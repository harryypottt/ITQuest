import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createFacultyQuest,
  updateFacultyQuest,
  getPublishedFacultyLessons,
  getPublishedFacultyQuizzes,
  type FacultyQuest,
  type FacultyQuestObjective,
  type FacultyLesson,
  type FacultyQuiz,
} from '@/sampleData/facultyContentData';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const difficulties = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
  { value: 4, label: 'Expert' },
  { value: 5, label: 'Master' },
];

export default function QuestBuilder({
  editingQuest,
  onClose,
}: {
  editingQuest?: FacultyQuest;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);

  // Step 1: Quest Info
  const [title, setTitle] = useState(editingQuest?.title || '');
  const [subtitle, setSubtitle] = useState(editingQuest?.subtitle || '');
  const [description, setDescription] = useState(editingQuest?.description || '');
  const [difficulty, setDifficulty] = useState(editingQuest?.difficulty || 2);
  const [estimatedMinutes, setEstimatedMinutes] = useState(editingQuest?.estimatedMinutes || 60);
  const [xpReward, setXpReward] = useState(editingQuest?.xpReward || 300);
  const [badgeReward, setBadgeReward] = useState(editingQuest?.badgeReward || '');

  // Step 2: Select Content
  const availableLessons = getPublishedFacultyLessons();
  const availableQuizzes = getPublishedFacultyQuizzes();
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>(
    editingQuest?.objectives
      .filter((o) => o.type === 'lesson')
      .map((o) => o.contentId || '')
      .filter(Boolean) || []
  );
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>(
    editingQuest?.objectives
      .filter((o) => o.type === 'quiz')
      .map((o) => o.contentId || '')
      .filter(Boolean) || []
  );

  // Step 3: Objectives
  const [objectives, setObjectives] = useState<FacultyQuestObjective[]>(
    editingQuest?.objectives || []
  );

  // Step 4: Rewards (already covered in step 1)

  // Step 5: Preview
  // Step 6: Publish

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleLesson = (id: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleQuiz = (id: string) => {
    setSelectedQuizIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const buildObjectivesFromSelection = () => {
    const objs: FacultyQuestObjective[] = [];
    let order = 1;

    selectedLessonIds.forEach((id) => {
      const lesson = availableLessons.find((l) => l.id === id);
      if (lesson) {
        objs.push({
          id: `obj-${order}`,
          type: 'lesson',
          contentId: lesson.id,
          title: `Complete "${lesson.title}"`,
          description: lesson.description,
        });
        order++;
      }
    });

    selectedQuizIds.forEach((id) => {
      const quiz = availableQuizzes.find((q) => q.id === id);
      if (quiz) {
        objs.push({
          id: `obj-${order}`,
          type: 'quiz',
          contentId: quiz.id,
          title: `Pass "${quiz.title}"`,
          description: quiz.description,
          minScore: quiz.passingScore,
        });
        order++;
      }
    });

    return objs;
  };

  const validateStep = (s: Step) => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!title.trim()) errs.title = 'Title is required';
      if (!subtitle.trim()) errs.subtitle = 'Subtitle is required';
      if (!description.trim()) errs.description = 'Description is required';
    }
    if (s === 2) {
      if (selectedLessonIds.length === 0 && selectedQuizIds.length === 0) {
        errs.content = 'Select at least one lesson or quiz';
      }
    }
    if (s === 3) {
      if (objectives.length === 0) errs.objectives = 'At least one objective is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    if (step === 2) {
      const objs = buildObjectivesFromSelection();
      setObjectives(objs);
    }
    if (step < 6) setStep((step + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const goToStep = (s: Step) => {
    if (s < step) setStep(s);
  };

 const buildQuest = (status: FacultyQuest['status']): Omit<FacultyQuest, 'id'> => ({
    title,
    subtitle,
    description,
    difficulty,
    estimatedMinutes,
    xpReward,
    objectives,
    status,
    createdBy: 'faculty-1',
    creatorName: 'Master Lamac',
    createdAt: editingQuest?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'faculty',
    badgeReward: badgeReward || undefined,
    prerequisites: [],
  });

  const handlePublish = () => {
    if (!validateStep(step)) return;
    if (editingQuest) {
      updateFacultyQuest(editingQuest.id, buildQuest('published') as Partial<FacultyQuest>);
    } else {
      createFacultyQuest(buildQuest('published'));
    }
    onClose();
  };

  const stepLabels = ['Info', 'Content', 'Objectives', 'Rewards', 'Preview', 'Publish'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-quest-text">
          {editingQuest ? 'Edit Quest' : 'Create Faculty Quest'}
        </h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors cursor-pointer">
          <i className="ri-close-line" />
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {stepLabels.map((label, idx) => {
          const s = (idx + 1) as Step;
          const isActive = step === s;
          const isDone = step > s;
          return (
            <button
              key={label}
              onClick={() => goToStep(s)}
              disabled={step <= s}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-quest-primary text-white'
                  : isDone
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-quest-bg border border-quest-border text-quest-textDim'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                isActive ? 'bg-white/20' : isDone ? 'bg-emerald-500/20' : 'bg-quest-border/30'
              }`}>
                {isDone ? <i className="ri-check-line" /> : s}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Step 1: Quest Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-quest-textDim mb-1.5 block">Quest Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Lamac's Quest"
                  className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
                />
                {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="text-xs text-quest-textDim mb-1.5 block">Quest Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. JavaScript DOM Challenge"
                  className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
                />
                {errors.subtitle && <p className="text-xs text-rose-400 mt-1">{errors.subtitle}</p>}
              </div>
              <div>
                <label className="text-xs text-quest-textDim mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what students will learn..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none resize-none"
                />
                {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-quest-textDim mb-1.5 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text focus:border-quest-primary/50 focus:outline-none cursor-pointer"
                  >
                    {difficulties.map((d) => (
                      <option key={d.value} value={d.value}>{d.value} — {d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-quest-textDim mb-1.5 block">Duration (min)</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text focus:border-quest-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-quest-textDim mb-1.5 block">XP Reward</label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text focus:border-quest-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-quest-textDim mb-1.5 block">Badge Reward (optional)</label>
                  <input
                    type="text"
                    value={badgeReward}
                    onChange={(e) => setBadgeReward(e.target.value)}
                    placeholder="e.g. DOM Warrior"
                    className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Content */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-quest-text mb-3">Select Lessons</h3>
                {availableLessons.length === 0 ? (
                  <p className="text-sm text-quest-textDim">No published lessons available. Create and publish a lesson first.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableLessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => toggleLesson(lesson.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedLessonIds.includes(lesson.id)
                            ? 'border-quest-primary bg-quest-primary/10'
                            : 'border-quest-border bg-quest-bg hover:border-quest-textDim/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedLessonIds.includes(lesson.id)
                            ? 'bg-quest-primary border-quest-primary'
                            : 'border-quest-border'
                        }`}>
                          {selectedLessonIds.includes(lesson.id) && <i className="ri-check-line text-xs text-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-quest-text">{lesson.title}</div>
                          <div className="text-xs text-quest-textDim">{lesson.topic} · {lesson.estimatedMinutes} min</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-quest-text mb-3">Select Quizzes</h3>
                {availableQuizzes.length === 0 ? (
                  <p className="text-sm text-quest-textDim">No published quizzes available. Create and publish a quiz first.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableQuizzes.map((quiz) => (
                      <button
                        key={quiz.id}
                        onClick={() => toggleQuiz(quiz.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedQuizIds.includes(quiz.id)
                            ? 'border-quest-primary bg-quest-primary/10'
                            : 'border-quest-border bg-quest-bg hover:border-quest-textDim/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedQuizIds.includes(quiz.id)
                            ? 'bg-quest-primary border-quest-primary'
                            : 'border-quest-border'
                        }`}>
                          {selectedQuizIds.includes(quiz.id) && <i className="ri-check-line text-xs text-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-quest-text">{quiz.title}</div>
                          <div className="text-xs text-quest-textDim">{quiz.topic} · {quiz.questions.length} questions · {quiz.passingScore}% to pass</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {errors.content && <p className="text-xs text-rose-400">{errors.content}</p>}
            </div>
          )}

          {/* Step 3: Objectives */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-quest-text">Quest Objectives</h3>
              {objectives.length === 0 ? (
                <p className="text-sm text-quest-textDim">No objectives configured. Go back to Step 2 and select content.</p>
              ) : (
                <div className="space-y-3">
                  {objectives.map((obj, idx) => (
                    <div key={obj.id} className="p-4 rounded-xl bg-quest-bg border border-quest-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-quest-primary/10 border border-quest-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-quest-primary font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-xs font-medium text-quest-text uppercase">
                          {obj.type === 'lesson' ? 'Lesson' : 'Quiz'}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-quest-text">{obj.title}</div>
                      <div className="text-xs text-quest-textDim mt-1">{obj.description}</div>
                      {obj.minScore && (
                        <div className="text-xs text-amber-400 mt-1">
                          Required score: {obj.minScore}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {errors.objectives && <p className="text-xs text-rose-400">{errors.objectives}</p>}
            </div>
          )}

          {/* Step 4: Rewards (summary) */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-quest-text">Reward Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-quest-bg border border-quest-border text-center">
                  <div className="text-xs text-quest-textDim mb-1">XP Reward</div>
                  <div className="text-xl font-bold text-quest-primary">{xpReward}</div>
                </div>
                <div className="p-4 rounded-xl bg-quest-bg border border-quest-border text-center">
                  <div className="text-xs text-quest-textDim mb-1">Difficulty</div>
                  <div className="text-xl font-bold text-quest-text">{difficulty}/5</div>
                </div>
                <div className="p-4 rounded-xl bg-quest-bg border border-quest-border text-center">
                  <div className="text-xs text-quest-textDim mb-1">Objectives</div>
                  <div className="text-xl font-bold text-quest-text">{objectives.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-quest-bg border border-quest-border text-center">
                  <div className="text-xs text-quest-textDim mb-1">Duration</div>
                  <div className="text-xl font-bold text-quest-text">{estimatedMinutes}m</div>
                </div>
              </div>
              {badgeReward && (
                <div className="p-4 rounded-xl bg-quest-bg border border-quest-border">
                  <div className="text-xs text-quest-textDim mb-1">Badge Reward</div>
                  <div className="text-sm font-bold text-amber-400">{badgeReward}</div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Preview */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-quest-bg border border-quest-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    Faculty Quest
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-quest-primary/10 text-quest-primary text-xs font-medium border border-quest-primary/20">
                    {difficulties.find((d) => d.value === difficulty)?.label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-quest-text mb-1">{title}</h3>
                <p className="text-sm text-quest-textMuted mb-1">{subtitle}</p>
                <p className="text-sm text-quest-textDim mb-4">{description}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-book-open-line" />
                    {objectives.filter((o) => o.type === 'lesson').length} Lessons
                  </span>
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-questionnaire-line" />
                    {objectives.filter((o) => o.type === 'quiz').length} Quizzes
                  </span>
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-flashlight-line" />
                    {xpReward} XP
                  </span>
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-time-line" />
                    {estimatedMinutes} min
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-quest-text uppercase tracking-wider">Objectives</h4>
                  {objectives.map((obj, idx) => (
                    <div key={obj.id} className="flex items-center gap-2 p-2 rounded-lg bg-quest-card border border-quest-border">
                      <span className="text-xs text-quest-textDim w-5">{idx + 1}.</span>
                      <span className="text-xs">
                        {obj.type === 'lesson' ? <i className="ri-book-open-line text-emerald-400 mr-1" /> : <i className="ri-questionnaire-line text-rose-400 mr-1" />}
                      </span>
                      <span className="text-sm text-quest-text">{obj.title}</span>
                      {obj.minScore && <span className="text-xs text-amber-400 ml-auto">{obj.minScore}% needed</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Publish */}
          {step === 6 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <i className="ri-check-double-line text-3xl text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-quest-text">Ready to Publish!</h3>
              <p className="text-sm text-quest-textMuted max-w-md mx-auto">
                Your quest "{title}" with {objectives.length} objectives will be published and available to students immediately.
              </p>
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-lg bg-quest-primary text-white text-sm font-medium hover:bg-quest-primaryGlow transition-colors cursor-pointer whitespace-nowrap"
                >
                  Publish Quest
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 6 && (
        <div className="flex items-center justify-between pt-4 border-t border-quest-border">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg bg-quest-bg border border-quest-border text-quest-text text-sm font-medium hover:bg-quest-border/50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <i className="ri-arrow-left-line mr-1" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="px-4 py-2 rounded-lg bg-quest-primary text-white text-sm font-medium hover:bg-quest-primaryGlow transition-colors cursor-pointer whitespace-nowrap"
          >
            {step === 5 ? 'Review' : 'Next'}
            <i className="ri-arrow-right-line ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
