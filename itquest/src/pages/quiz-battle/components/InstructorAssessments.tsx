import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getPublishedFacultyQuizzes, getFacultyQuizResults } from '@/sampleData/facultyContentData';
import type { FacultyQuiz } from '@/sampleData/facultyContentData';
import InstructorFilterBar from '@/components/feature/InstructorFilterBar';
import type { InstructorOption } from '@/components/feature/InstructorFilterBar';
import QuizCard from './QuizCard';
import { facultyQuizToQuiz } from '../facultyQuizAdapter';

interface InstructorAssessmentsProps {
  onExit: () => void;
}

/**
 * "My Instructor" view for the Quiz Battle hub.
 * Lists published assessments created by teachers and lets students filter by instructor.
 */
export default function InstructorAssessments({ onExit }: InstructorAssessmentsProps) {
  const [facultyQuizzes, setFacultyQuizzes] = useState<FacultyQuiz[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState('all');

  useEffect(() => {
    setFacultyQuizzes(getPublishedFacultyQuizzes());
  }, []);

  const instructors = useMemo<InstructorOption[]>(() => {
    const map = new Map<string, InstructorOption>();
    facultyQuizzes.forEach((q) => {
      const existing = map.get(q.createdBy);
      if (existing) existing.count += 1;
      else map.set(q.createdBy, { id: q.createdBy, name: q.creatorName, count: 1 });
    });
    return Array.from(map.values());
  }, [facultyQuizzes]);

  const bestScores = useMemo(() => {
    const results = getFacultyQuizResults();
    const map: Record<string, number> = {};
    results.forEach((r: { quizId: string; score: number; totalQuestions: number }) => {
      const pct = r.totalQuestions > 0 ? Math.round((r.score / r.totalQuestions) * 100) : 0;
      map[r.quizId] = Math.max(map[r.quizId] || 0, pct);
    });
    return map;
  }, [facultyQuizzes]);

  const filtered = useMemo(() => {
    if (selectedInstructor === 'all') return facultyQuizzes;
    return facultyQuizzes.filter((q) => q.createdBy === selectedInstructor);
  }, [facultyQuizzes, selectedInstructor]);

  const activeName = selectedInstructor === 'all'
    ? null
    : instructors.find((i) => i.id === selectedInstructor)?.name || null;

  return (
    <div className="space-y-5">
      <InstructorFilterBar
        instructors={instructors}
        selectedInstructor={selectedInstructor}
        onSelectInstructor={setSelectedInstructor}
        totalCount={facultyQuizzes.length}
        itemNoun="assessment"
        onBack={onExit}
        backLabel="Assessments"
      />

      <div className="flex items-center gap-2">
        <i className="ri-user-star-line text-amber-400" />
        <h3 className="text-sm font-bold text-quest-text">
          {activeName ? `${activeName}'s Assessments` : 'Assessments From Your Instructors'}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-quest-card border border-quest-border flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-star-line text-2xl text-quest-textDim" />
          </div>
          <h3 className="text-lg font-semibold text-quest-text mb-1">No instructor assessments found</h3>
          <p className="text-sm text-quest-textMuted">Try another instructor or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((fq, idx) => (
            <motion.div
              key={fq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <QuizCard
                quiz={facultyQuizToQuiz(fq)}
                completed={bestScores[fq.id] !== undefined}
                bestScore={bestScores[fq.id]}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}