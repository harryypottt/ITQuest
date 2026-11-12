import type { Quiz } from '@/sampleData/quizData';
import type { FacultyQuiz } from '@/sampleData/facultyContentData';

/**
 * Converts a faculty-authored quiz into the shape used by QuizCard / QuizPlayer
 * so students can open and play it inside the Quiz Battle hub.
 */
export function facultyQuizToQuiz(facultyQuiz: FacultyQuiz): Quiz {
  return {
    id: facultyQuiz.id,
    title: facultyQuiz.title,
    description: facultyQuiz.description,
    category: facultyQuiz.topic,
    difficulty: 2,
    xpReward: facultyQuiz.xpReward,
    timeLimit: facultyQuiz.timeLimit * 60,
    passingScore: facultyQuiz.passingScore,
    questionCount: facultyQuiz.questions.length,
    type: 'solo',
    questions: facultyQuiz.questions.map((q) => ({
      id: q.id,
      type: 'mcq',
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points,
    })),
  } as Quiz;
}