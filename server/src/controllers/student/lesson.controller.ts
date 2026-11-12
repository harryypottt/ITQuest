import { Request, Response } from 'express';
import * as lessonRepo from '../../repositories/lesson.repository.js';

// GET: Kunin ang lahat ng lessons
export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await lessonRepo.findAllLessons();

    return res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error: any) {
    console.error('Error fetching lessons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lessons',
      error: error.message,
    });
  }
};

// GET: Kunin ang partikular na lesson gamit ang ID
export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await lessonRepo.findLessonById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error: any) {
    console.error('Error fetching lesson by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lesson',
      error: error.message,
    });
  }
};