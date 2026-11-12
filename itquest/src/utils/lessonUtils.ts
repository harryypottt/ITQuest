export function isLessonUnlocked(lesson: any, progressList: any[]): boolean {
  if (!lesson) return false;

  let prereqs = lesson.prerequisites;
  if (typeof prereqs === 'string') {
    try { prereqs = JSON.parse(prereqs); } catch { prereqs = []; }
  }

  if (!Array.isArray(prereqs) || prereqs.length === 0) return true;

  // I-check kung natapos na ang LAHAT ng prerequisites (flexible String comparison)
  return prereqs.every((prereqId: any) =>
    progressList.some(
      (p: any) => String(p.lessonId || p.lesson_id) === String(prereqId) && (p.isCompleted || p.is_completed)
    )
  );
}