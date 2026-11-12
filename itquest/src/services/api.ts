import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor: Awtomatikong ikakabit ang Bearer Token sa bawat lalabas na request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchBadges = async (endpoint = '/student/badges') => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching badges in api.ts:', error);
    return { success: false, data: [] };
  }
};

// ==========================================
// 2. Types & Interfaces (CamelCase Formatted)
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  categoryName?: string | null;
  difficulty?: number | null;
  estimatedMinutes?: number | null;
  xpReward?: number | null;
  icon?: string | null;
  thumbnail?: string | null;
  moduleId?: string | null;
  orderIndex?: number | null;
  prerequisites?: string | null;
  content?: string | null;
  learningObjectives?: string | null;
  source?: string | null;
  status?: string | null;
  createdBy?: string | null;
  creatorName?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isCompleted?: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  objectiveType: string;
  targetId?: string | null;
  targetCount?: number | null;
  minScore?: number | null;
  orderIndex?: number | null;
  redirectRoute?: string | null;
  redirectLabel?: string | null;
  objectiveTitle?: string | null;
  contentName?: string | null;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  storyText?: string;
  type?: string;
  difficulty?: string;
  xpReward: number;
  badgeReward?: { name: string; rarity: string } | null;
  category?: string;
  categoryName?: string;
  region?: string;
  icon?: string;
  estimatedMinutes?: number;
  completionHint?: string;
  chainId?: string;
  chainPosition?: number;
  unlocksQuestIds?: string[];
  requiresQuestIds?: string[];
  rarity?: string;
  tags?: string[];
  isHidden?: boolean;
  hiddenCondition?: string;
  isActive?: boolean;
  status: 'not_started' | 'in_progress' | 'completed';
  objectives: QuestObjective[];
}

// ==========================================
// 3. Lessons API Functions
// ==========================================

export const fetchLessons = async () => {
  const response = await api.get('/student/lessons');
  return response.data;
};

export const fetchLessonById = async (id: string | number) => {
  const response = await api.get(`/student/lessons/${id}`);
  return response.data;
};

// ==========================================
// 4. Progress API Functions
// ==========================================

export async function completeLesson(lessonId: string | number) {
  const response = await api.post('/student/progress/update', {
    lessonId: String(lessonId),
    lesson_id: String(lessonId),
    isCompleted: true,
    status: 'completed'
  });
  return response.data;
}

export async function fetchUserProgress() {
  const response = await api.get('/student/progress');
  return response.data?.data || response.data || [];
}

// ==========================================
// 5. Quests API Functions
// ==========================================

export async function fetchQuests(): Promise<Quest[]> {
  const response = await api.get('/student/quests');
  return response.data?.data || response.data || [];
}

export async function startQuest(questId: string) {
  const response = await api.post(`/student/quests/${questId}/start`);
  return response.data;
}

export async function completeQuestApi(questId: string) {
  const response = await api.post(`/student/quests/${questId}/complete`);
  return response.data;
}

export async function updateObjectiveProgressApi(questId: string, objectiveId: string, progress: number) {
  const response = await api.post(`/student/quests/${questId}/objectives/${objectiveId}`, {
    progress,
  });
  return response.data;
}

// ─── FACULTY API ENDPOINTS ───
export const facultyApi = {
  // Content Endpoints
  getLessons: () => api.get('/faculty/lessons'),
  createLesson: (data: any) => api.post('/faculty/lessons', data),
  getQuizzes: () => api.get('/faculty/quizzes'),
  getQuests: () => api.get('/faculty/quests'),

  // Dashboard Stats & Submissions Endpoints
  getStats: () => api.get('/faculty/stats'),
  getSubmissions: (status?: string) => api.get('/faculty/submissions', { params: { status } }),
  reviewSubmission: (id: string, data: { status: string; reviewNote?: string; reviewedBy?: string }) => 
    api.put(`/faculty/submissions/${id}/review`, data),
};

// ==========================================
// Profile Interfaces
// ==========================================

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  specialization?: string;
  avatar_initials?: string;
}

// ==========================================
// Profile API Functions
// ==========================================

export const fetchUserProfile = async (userId?: string) => {
  const endpoint = userId ? `/student/profile/${userId}` : '/student/profile';
  const response = await api.get(endpoint);
  return response.data;
};


 
export const updateUserProfile = async (data: ProfileUpdateData) => {
  const response = await api.put('/student/profile', data);
  return response.data;
};


// ==========================================
// Notifications API Functions
// ==========================================

export async function fetchNotifications() {
  const response = await api.get('/student/notifications');
  return response.data?.data || response.data || [];
}

export async function markNotificationAsReadApi(id: string) {
  const response = await api.patch(`/student/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsReadApi() {
  const response = await api.patch('/student/notifications/read-all');
  return response.data;
}

export async function deleteNotificationApi(id: string) {
  const response = await api.delete(`/student/notifications/${id}`);
  return response.data;
}

export async function fetchDashboardData() {
  const response = await api.get('/student/dashboard');
  return response.data?.data || response.data;
}


export default api;
