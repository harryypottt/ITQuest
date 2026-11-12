import { Request, Response } from 'express';
import {
  findAllFacultyLessons,
  createFacultyLesson,
  updateFacultyLesson,
  updateFacultyLessonStatus,
  deleteFacultyLesson,
  findAllFacultyQuizzes,
  createFacultyQuiz,
  updateFacultyQuiz,
  updateFacultyQuizStatus,
  deleteFacultyQuiz,
  findAllFacultyQuests,
  createFacultyQuest,
  updateFacultyQuest,
  updateFacultyQuestStatus,
  deleteFacultyQuest,
  findFacultyStudentProgress,
  findFacultyDashboardStats,
} from '../../repositories/faculty.repository.js';

// Lessons Controllers
export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await findAllFacultyLessons();
    res.json(lessons);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    await createFacultyLesson(req.body);
    res.status(201).json({ message: 'Lesson created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await updateFacultyLesson(id, req.body);
    res.json({ message: 'Lesson updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLessonStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateFacultyLessonStatus(id, status);
    res.json({ message: 'Lesson status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    await deleteFacultyLesson(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Quizzes Controllers
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await findAllFacultyQuizzes();
    res.json(quizzes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createQuiz = async (req: Request, res: Response) => {
  try {
    await createFacultyQuiz(req.body);
    res.status(201).json({ message: 'Quiz created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await updateFacultyQuiz(id, req.body);
    res.json({ message: 'Quiz updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuizStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateFacultyQuizStatus(id, status);
    res.json({ message: 'Quiz status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    await deleteFacultyQuiz(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Quests Controllers
export const getQuests = async (req: Request, res: Response) => {
  try {
    const quests = await findAllFacultyQuests();
    res.json(quests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createQuest = async (req: Request, res: Response) => {
  try {
    await createFacultyQuest(req.body);
    res.status(201).json({ message: 'Quest created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await updateFacultyQuest(id, req.body);
    res.json({ message: 'Quest updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateFacultyQuestStatus(id, status);
    res.json({ message: 'Quest status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuest = async (req: Request, res: Response) => {
  try {
    await deleteFacultyQuest(req.params.id);
    res.json({ message: 'Quest deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Progress & Stats Controllers
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const progress = await findFacultyStudentProgress();
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await findFacultyDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
