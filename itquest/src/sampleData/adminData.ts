export const platformStats = {
  totalUsers: 92,
  activeUsers: 62,
  totalContent: 53,
  totalSubmissions: 128,
  avgEngagementRate: 73,
  retentionRate: 68,
  newUsersThisMonth: 14,
  completionRate: 58,
};

export const userManagement = [
  { id: 'u-001', name: 'Alex Chen', email: 'alex.chen@email.com', role: 'student', specialization: 'Full Stack Developer', level: 12, totalXp: 3450, streak: 7, status: 'active', joinedAt: '2026-01-15T00:00:00Z' },
  { id: 'u-002', name: 'James Reyes', email: 'james.reyes@email.com', role: 'student', specialization: 'Frontend Developer', level: 15, totalXp: 7200, streak: 21, status: 'active', joinedAt: '2025-11-20T00:00:00Z' },
  { id: 'u-003', name: 'Patricia Lim', email: 'patricia.lim@email.com', role: 'student', specialization: 'Full Stack Developer', level: 18, totalXp: 9100, streak: 35, status: 'active', joinedAt: '2025-09-10T00:00:00Z' },
  { id: 'u-004', name: 'Angela Cruz', email: 'angela.cruz@email.com', role: 'student', specialization: 'Backend Developer', level: 12, totalXp: 4800, streak: 8, status: 'active', joinedAt: '2026-02-01T00:00:00Z' },
  { id: 'u-005', name: 'Maria Santos', email: 'maria.santos@email.com', role: 'student', specialization: 'UI/UX Designer', level: 8, totalXp: 2200, streak: 5, status: 'active', joinedAt: '2026-03-10T00:00:00Z' },
  { id: 'u-006', name: 'Kevin Tan', email: 'kevin.tan@email.com', role: 'student', specialization: 'Frontend Developer', level: 10, totalXp: 3600, streak: 12, status: 'active', joinedAt: '2026-01-28T00:00:00Z' },
  { id: 'u-007', name: 'Prof. Juana Mendoza', email: 'j.mendoza@ptc.edu.ph', role: 'faculty', specialization: 'Web Development', level: 1, totalXp: 0, streak: 0, status: 'active', joinedAt: '2025-08-01T00:00:00Z' },
  { id: 'u-008', name: 'Prof. Miguel Reyes', email: 'm.reyes@ptc.edu.ph', role: 'faculty', specialization: 'Database Systems', level: 1, totalXp: 0, streak: 0, status: 'active', joinedAt: '2025-08-01T00:00:00Z' },
  { id: 'u-009', name: 'Prof. Elena Santos', email: 'e.santos@ptc.edu.ph', role: 'faculty', specialization: 'Cybersecurity', level: 1, totalXp: 0, streak: 0, status: 'active', joinedAt: '2025-08-15T00:00:00Z' },
  { id: 'u-010', name: 'Admin Rodriguez', email: 'admin@ptc.edu.ph', role: 'admin', specialization: 'System Administration', level: 1, totalXp: 0, streak: 0, status: 'active', joinedAt: '2025-07-01T00:00:00Z' },
  { id: 'u-011', name: 'Sofia Mendoza', email: 'sofia.mendoza@email.com', role: 'student', specialization: 'Backend Developer', level: 14, totalXp: 6200, streak: 14, status: 'active', joinedAt: '2025-12-05T00:00:00Z' },
  { id: 'u-012', name: 'Diego Fernando', email: 'diego.fernando@email.com', role: 'student', specialization: 'Frontend Developer', level: 6, totalXp: 1100, streak: 2, status: 'inactive', joinedAt: '2026-04-01T00:00:00Z' },
  { id: 'u-013', name: 'Rafael Lopez', email: 'rafael.lopez@email.com', role: 'student', specialization: 'Full Stack Developer', level: 9, totalXp: 2800, streak: 4, status: 'active', joinedAt: '2026-02-14T00:00:00Z' },
  { id: 'u-014', name: 'Beatriz Ong', email: 'beatriz.ong@email.com', role: 'student', specialization: 'UI/UX Designer', level: 13, totalXp: 5500, streak: 18, status: 'active', joinedAt: '2025-10-20T00:00:00Z' },
  { id: 'u-015', name: 'Carlos Villanueva', email: 'carlos.villanueva@email.com', role: 'student', specialization: 'Backend Developer', level: 7, totalXp: 1800, streak: 3, status: 'inactive', joinedAt: '2026-03-22T00:00:00Z' },
];

export const activityLogs = [
  { id: 'log-001', action: 'User registered', detail: 'Maria Santos created an account', timestamp: '2026-05-25T15:30:00Z', type: 'user' },
  { id: 'log-002', action: 'Submission received', detail: 'James Reyes submitted Landing Page for a Startup', timestamp: '2026-05-25T10:15:00Z', type: 'submission' },
  { id: 'log-003', action: 'Content created', detail: 'Prof. Mendoza created lesson: Introduction to React Hooks', timestamp: '2026-05-25T08:00:00Z', type: 'content' },
  { id: 'log-004', action: 'Badge earned', detail: 'Patricia Lim earned Unbroken Will (Legendary)', timestamp: '2026-05-24T23:45:00Z', type: 'achievement' },
  { id: 'log-005', action: 'Level up', detail: 'Angela Cruz reached level 12', timestamp: '2026-05-24T20:00:00Z', type: 'achievement' },
  { id: 'log-006', action: 'Submission approved', detail: 'Prof. Mendoza approved Rafael Lopez portfolio submission', timestamp: '2026-05-23T08:30:00Z', type: 'submission' },
  { id: 'log-007', action: 'Content created', detail: 'Prof. Reyes created quiz: Database Normalization Quiz', timestamp: '2026-05-22T15:00:00Z', type: 'content' },
  { id: 'log-008', action: 'Submission rejected', detail: 'Prof. Mendoza rejected Carlos Villanueva todo app submission', timestamp: '2026-05-21T09:15:00Z', type: 'submission' },
  { id: 'log-009', action: 'Quest completed', detail: 'Kevin Tan completed API Integration Mastery quest', timestamp: '2026-05-21T18:30:00Z', type: 'achievement' },
  { id: 'log-010', action: 'User warning', detail: 'Admin warned Diego Fernando for inactivity', timestamp: '2026-05-20T10:00:00Z', type: 'moderation' },
  { id: 'log-011', action: 'Content updated', detail: 'Prof. Santos updated Cybersecurity Basics quest', timestamp: '2026-05-19T14:00:00Z', type: 'content' },
  { id: 'log-012', action: 'Batch import', detail: 'Admin imported 15 new student accounts via CSV', timestamp: '2026-05-18T09:00:00Z', type: 'system' },
];

export const analyticsData = {
  dailyActiveUsers: [
    { date: 'May 19', count: 48 },
    { date: 'May 20', count: 52 },
    { date: 'May 21', count: 55 },
    { date: 'May 22', count: 47 },
    { date: 'May 23', count: 58 },
    { date: 'May 24', count: 63 },
    { date: 'May 25', count: 62 },
  ],
  contentByCategory: [
    { category: 'Frontend', count: 12 },
    { category: 'Backend', count: 9 },
    { category: 'Database', count: 7 },
    { category: 'Cybersecurity', count: 5 },
    { category: 'UI/UX', count: 6 },
    { category: 'Full Stack', count: 8 },
    { category: 'Networking', count: 4 },
    { category: 'SE', count: 2 },
  ],
  submissionsPerDay: [
    { date: 'May 19', count: 3 },
    { date: 'May 20', count: 5 },
    { date: 'May 21', count: 4 },
    { date: 'May 22', count: 6 },
    { date: 'May 23', count: 4 },
    { date: 'May 24', count: 7 },
    { date: 'May 25', count: 5 },
  ],
  xpDistribution: {
    ranges: ['0-1K', '1K-3K', '3K-5K', '5K-7K', '7K-9K', '9K+'],
    counts: [18, 24, 20, 14, 8, 6],
  },
};

export const systemConfig = {
  platformName: 'IT Quest',
  version: '1.0.0',
  lastBackup: '2026-05-25T00:00:00Z',
  supabaseStatus: 'Not connected',
  totalStorage: '2.4 GB',
  uptimeDays: 47,
};