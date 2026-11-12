import { useState } from 'react';
import { motion } from 'framer-motion';
import type {
  FacultyLesson,
  FacultyLessonSection,
} from '@/sampleData/facultyContentData';

const topics = ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Database', 'Cybersecurity', 'UI/UX', 'General'];

export default function LessonBuilder({
  editingLesson,
  onClose,
}: {
  editingLesson?: FacultyLesson;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(editingLesson?.title || '');
  const [description, setDescription] = useState(editingLesson?.description || '');
  const [topic, setTopic] = useState(editingLesson?.topic || 'JavaScript');
  const [difficulty, setDifficulty] = useState(editingLesson?.difficulty || 2);
  const [estimatedMinutes, setEstimatedMinutes] = useState(editingLesson?.estimatedMinutes || 30);
  const [xpReward, setXpReward] = useState(editingLesson?.xpReward || 50);

  // States para sa async HTTP operations
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Direct Structured Sections Setup
  const [sections, setSections] = useState<FacultyLessonSection[]>(
    editingLesson?.sections || [{ id: 's-1', title: '', contentType: 'text', content: '' }]
  );
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    editingLesson?.learningObjectives || ['']
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSection = () => {
    setSections([...sections, { id: `s-${Date.now()}`, title: '', contentType: 'text', content: '' }]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<FacultyLessonSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addObjective = () => setLearningObjectives([...learningObjectives, '']);
  const removeObjective = (idx: number) => {
    if (learningObjectives.length <= 1) return;
    const next = [...learningObjectives];
    next.splice(idx, 1);
    setLearningObjectives(next);
  };
  const updateObjective = (idx: number, value: string) => {
    const next = [...learningObjectives];
    next[idx] = value;
    setLearningObjectives(next);
  };

  // Helper para sa YouTube Embed URL conversion
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim()) errs.description = 'Description is required';

    sections.forEach((s, i) => {
      if (!s.title.trim()) errs[`section-${i}-title`] = 'Section title is required';
      if (!s.content.trim()) errs[`section-${i}-content`] = 'Content is required';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildLesson = (status: FacultyLesson['status']) => ({
    title,
    description,
    topic,
    difficulty: Number(difficulty),
    estimatedMinutes: Number(estimatedMinutes),
    contentType: 'structured',
    sections,
    learningObjectives: learningObjectives.filter((o) => o.trim()),
    status,
    createdBy: editingLesson?.createdBy || 'faculty-1',
    creatorName: editingLesson?.creatorName || 'Master Lamac',
    source: 'faculty',
    xpReward: Number(xpReward),
  });

  // 🔗 DATABASE INTEGRATION HANDLER (BULLETPROOF & ROUTE-SAFE FIX)
  const handleSave = async (status: FacultyLesson['status']) => {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);

    const payload = buildLesson(status);

    try {
      // Check kung totoong may valid ID mula sa database at hindi lang placeholder prefix
      const validId = editingLesson?.id && editingLesson.id !== 'faculty-lesson' ? editingLesson.id : null;
      
      const url = validId
        ? `http://localhost:5000/api/faculty/lessons/${validId}`
        : 'http://localhost:5000/api/faculty/lessons';

      const method = validId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Basahin ang response body NANG ISANG ULIT LANG bilang string para maiwasan ang stream errors
      const rawText = await response.text();

      if (!response.ok) {
        let errorMsg = `Server error status: ${response.status}`;
        try {
          const jsonErr = JSON.parse(rawText);
          errorMsg = jsonErr.error || jsonErr.message || errorMsg;
        } catch (_) {
          if (rawText.includes('Cannot PUT')) {
            errorMsg = 'Backend route error: Paalala na tiyaking nakadefine ang Express route na PUT /api/faculty/lessons/:id.';
          } else {
            errorMsg = rawText.slice(0, 150);
          }
        }
        throw new Error(errorMsg);
      }

      onClose(); // Isara ang modal at i-trigger ang auto-refresh ng Dashboard
    } catch (err: any) {
      console.error('Error saving lesson:', err);
      setServerError(err.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-quest-text">
          {editingLesson ? 'Edit Lesson' : 'Create Lesson'}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors cursor-pointer"
        >
          <i className="ri-close-line" />
        </button>
      </div>

      {serverError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
          {serverError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs text-quest-textDim mb-1.5 block">Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title..."
            className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
          />
          {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="text-xs text-quest-textDim mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the lesson..."
            rows={3}
            className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none resize-none"
          />
          {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-quest-textDim mb-1.5 block">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text focus:border-quest-primary/50 focus:outline-none cursor-pointer"
            >
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-quest-textDim mb-1.5 block">Difficulty (1-5)</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`w-8 h-8 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                    d <= difficulty
                      ? 'border-quest-primary bg-quest-primary/10 text-quest-primary'
                      : 'border-quest-border bg-quest-bg text-quest-textDim'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-quest-textDim mb-1.5 block">Duration (minutes)</label>
            <input
              type="number"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Math.max(5, parseInt(e.target.value) || 5))}
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
        </div>

        {/* Dynamic Section Builder Container */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-quest-textDim font-medium">Content Sections</label>
            <button
              type="button"
              onClick={addSection}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-quest-primary/10 text-quest-primary text-xs font-medium hover:bg-quest-primary/20 transition-colors cursor-pointer"
            >
              <i className="ri-add-line" />
              Add Section
            </button>
          </div>

          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-quest-bg border border-quest-border space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-quest-text">Section {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  disabled={sections.length <= 1}
                  className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <i className="ri-delete-bin-line text-xs" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="Section title..."
                    className="w-full p-2.5 rounded-lg bg-quest-card border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
                  />
                  {errors[`section-${idx}-title`] && <p className="text-xs text-rose-400 mt-1">{errors[`section-${idx}-title`]}</p>}
                </div>

                <select
                  value={section.contentType}
                  onChange={(e) => updateSection(section.id, { contentType: e.target.value as FacultyLessonSection['contentType'] })}
                  className="w-full p-2.5 rounded-lg bg-quest-card border border-quest-border text-sm text-quest-text focus:border-quest-primary/50 focus:outline-none cursor-pointer"
                >
                  <option value="text">📄 Text</option>
                  <option value="video">🎥 Video (YouTube / Link)</option>
                  <option value="image">🖼️ Image (URL)</option>
                  <option value="code">💻 Code Example</option>
                  <option value="tip">💡 Tip / Callout</option>
                </select>
              </div>

              {(section.contentType === 'text' || section.contentType === 'tip') && (
                <div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder={section.contentType === 'tip' ? 'Enter helpful tip or callout notes...' : 'Enter lesson text content...'}
                    rows={4}
                    className={`w-full p-2.5 rounded-lg border text-sm text-quest-text placeholder-quest-textDim focus:outline-none resize-none ${
                      section.contentType === 'tip'
                        ? 'bg-amber-950/20 border-amber-500/40 focus:border-amber-500'
                        : 'bg-quest-card border-quest-border focus:border-quest-primary/50'
                    }`}
                  />
                </div>
              )}

              {section.contentType === 'video' && (
                <div className="space-y-3 bg-quest-card p-3 rounded-lg border border-quest-border">
                  <input
                    type="url"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="Paste YouTube or video URL..."
                    className="w-full p-2.5 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
                  />
                  {section.content && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-quest-border bg-black">
                      {section.content.includes('youtube.com') || section.content.includes('youtu.be') ? (
                        <iframe
                          src={getEmbedUrl(section.content)}
                          title="YouTube Section Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={section.content} controls className="w-full h-full" />
                      )}
                    </div>
                  )}
                </div>
              )}

              {section.contentType === 'image' && (
                <div className="space-y-3 bg-quest-card p-3 rounded-lg border border-quest-border">
                  <input
                    type="url"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="Paste Image URL..."
                    className="w-full p-2.5 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
                  />
                  {section.content && (
                    <div className="max-h-60 rounded-lg overflow-hidden border border-quest-border bg-black/40 flex items-center justify-center p-2">
                      <img src={section.content} alt="Section Preview" className="max-h-56 object-contain rounded" />
                    </div>
                  )}
                </div>
              )}

              {section.contentType === 'code' && (
                <div className="space-y-3">
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="// Enter code sample here..."
                    rows={6}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-quest-border text-sm text-emerald-400 placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none resize-none font-mono"
                  />
                  <input
                    type="text"
                    value={section.language || ''}
                    onChange={(e) => updateSection(section.id, { language: e.target.value })}
                    placeholder="Programming Language..."
                    className="w-full p-2 rounded-lg bg-quest-card border border-quest-border text-xs text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none font-mono"
                  />
                </div>
              )}

              {errors[`section-${idx}-content`] && <p className="text-xs text-rose-400 mt-1">{errors[`section-${idx}-content`]}</p>}
            </motion.div>
          ))}
        </div>

        {/* Learning Objectives Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-quest-textDim">Learning Objectives</label>
            <button
              type="button"
              onClick={addObjective}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-quest-primary/10 text-quest-primary text-xs font-medium hover:bg-quest-primary/20 transition-colors cursor-pointer"
            >
              <i className="ri-add-line" />
              Add Objective
            </button>
          </div>
          {learningObjectives.map((obj, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={obj}
                onChange={(e) => updateObjective(idx, e.target.value)}
                placeholder="Enter a learning objective..."
                className="flex-1 p-2.5 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text placeholder-quest-textDim focus:border-quest-primary/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeObjective(idx)}
                disabled={learningObjectives.length <= 1}
                className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save / Publish Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-quest-border">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSave('draft')}
          className="px-4 py-2.5 rounded-lg bg-quest-bg border border-quest-border text-quest-text text-sm font-medium hover:bg-quest-border/50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSave('published')}
          className="flex-1 px-4 py-2.5 rounded-lg bg-quest-primary text-white text-sm font-medium hover:bg-quest-primaryGlow transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Saving to Database...' : editingLesson ? 'Update & Publish' : 'Publish Lesson'}
        </button>
      </div>
    </div>
  );
}
