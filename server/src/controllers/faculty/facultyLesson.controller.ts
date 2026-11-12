import { Request, Response } from 'express';
import { createLesson } from '../../repositories/lesson.repository.js';

/**
 * Controller para sa paglikha ng bagong leksyon mula sa Faculty Portal (LessonBuilder)
 */
export const createFacultyLesson = async (req: Request, res: Response) => {
  try {
    const lessonData = req.body;

    // 1. Validation: Siguraduhing may title ang leksyon
    if (!lessonData.title || lessonData.title.trim() === '') {
      return res.status(400).json({ 
        error: 'Kailangan ng title para sa leksyon.' 
      });
    }

    // 2. Pagtawag sa Repository function para mag-insert sa database
    const newLesson = await createLesson({
      title: lessonData.title,
      description: lessonData.description,
      category: lessonData.category,
      category_name: lessonData.category_name || lessonData.category,
      difficulty: lessonData.difficulty ? Number(lessonData.difficulty) : 1,
      estimated_minutes: lessonData.estimated_minutes ? Number(lessonData.estimated_minutes) : 15,
      xp_reward: lessonData.xp_reward ? Number(lessonData.xp_reward) : 50,
      icon: lessonData.icon,
      thumbnail: lessonData.thumbnail,
      module_id: lessonData.module_id,
      order_index: lessonData.order_index ? Number(lessonData.order_index) : 1,
      prerequisites: lessonData.prerequisites,
      content: lessonData.content,
      learning_objectives: lessonData.learning_objectives,
      source: lessonData.source || 'core',
      status: lessonData.status || 'published',
      created_by: lessonData.created_by,
      creator_name: lessonData.creator_name || 'Faculty',
    });

    // 3. Mag-return ng success response sa frontend
    return res.status(201).json({
      message: 'Matagumpay na naisa-save ang leksyon sa database!',
      lesson: newLesson,
    });
  } catch (error) {
    console.error('Error sa createFacultyLesson controller:', error);
    return res.status(500).json({ 
      error: 'Nagkaroon ng problema sa server habang isinasa-save ang leksyon.' 
    });
  }
};
