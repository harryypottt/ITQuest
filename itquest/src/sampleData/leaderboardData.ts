export const leaderboardUsers = [
  { id: 'user-001', fullName: 'Marco Reyes', avatarInitials: 'MR', level: 28, rank: 'Elite', specialization: 'Full Stack Developer', streakDays: 42 },
  { id: 'user-002', fullName: 'Angela Cruz', avatarInitials: 'AC', level: 24, rank: 'Elite', specialization: 'Frontend Developer', streakDays: 18 },
  { id: 'user-003', fullName: 'Jasmine Tan', avatarInitials: 'JT', level: 22, rank: 'Challenger', specialization: 'Backend Developer', streakDays: 31 },
  { id: 'user-004', fullName: 'Kevin Santos', avatarInitials: 'KS', level: 21, rank: 'Challenger', specialization: 'Cybersecurity', streakDays: 14 },
  { id: 'user-005', fullName: 'Dianne Lopez', avatarInitials: 'DL', level: 19, rank: 'Challenger', specialization: 'UI/UX Designer', streakDays: 25 },
  { id: 'user-006', fullName: 'Ralph Mendoza', avatarInitials: 'RM', level: 18, rank: 'Challenger', specialization: 'Database Administrator', streakDays: 9 },
  { id: 'user-007', fullName: 'Bea Villanueva', avatarInitials: 'BV', level: 17, rank: 'Challenger', specialization: 'Full Stack Developer', streakDays: 22 },
  { id: 'user-008', fullName: 'Paolo Garcia', avatarInitials: 'PG', level: 16, rank: 'Apprentice', specialization: 'Frontend Developer', streakDays: 7 },
  { id: 'user-009', fullName: 'Nicole Fernandez', avatarInitials: 'NF', level: 15, rank: 'Apprentice', specialization: 'Backend Developer', streakDays: 12 },
  { id: 'user-010', fullName: 'Adrian Bautista', avatarInitials: 'AB', level: 14, rank: 'Apprentice', specialization: 'Cybersecurity', streakDays: 5 },
  { id: 'user-011', fullName: 'Chloe Rivera', avatarInitials: 'CR', level: 13, rank: 'Apprentice', specialization: 'UI/UX Designer', streakDays: 3 },
  { id: 'user-012', fullName: 'Miguel dela Cruz', avatarInitials: 'MD', level: 12, rank: 'Apprentice', specialization: 'Database Administrator', streakDays: 8 },
  { id: 'user-013', fullName: 'Sofia Mercado', avatarInitials: 'SM', level: 11, rank: 'Apprentice', specialization: 'Full Stack Developer', streakDays: 15 },
  { id: 'user-014', fullName: 'Gabriel Torres', avatarInitials: 'GT', level: 10, rank: 'Apprentice', specialization: 'Frontend Developer', streakDays: 4 },
  { id: 'user-015', fullName: 'Andrea Castillo', avatarInitials: 'ACs', level: 9, rank: 'Novice', specialization: 'Backend Developer', streakDays: 6 },
  { id: 'user-016', fullName: 'Luis Domingo', avatarInitials: 'LD', level: 8, rank: 'Novice', specialization: 'Cybersecurity', streakDays: 2 },
  { id: 'user-017', fullName: 'Mikaela Ramos', avatarInitials: 'MRq', level: 7, rank: 'Novice', specialization: 'Database Administrator', streakDays: 11 },
  { id: 'user-018', fullName: 'John Patrick Sy', avatarInitials: 'JS', level: 6, rank: 'Novice', specialization: 'UI/UX Designer', streakDays: 1 },
  { id: 'user-019', fullName: 'Patricia Ong', avatarInitials: 'PO', level: 5, rank: 'Novice', specialization: 'Frontend Developer', streakDays: 3 },
  { id: 'user-020', fullName: 'Carlos Gutierrez', avatarInitials: 'CG', level: 4, rank: 'Novice', specialization: 'Full Stack Developer', streakDays: 2 },
];

export const categories = [
  { value: 'all', label: 'All Categories', icon: 'ri-global-line' },
  { value: 'frontend', label: 'Frontend', icon: 'ri-html5-line' },
  { value: 'backend', label: 'Backend', icon: 'ri-server-line' },
  { value: 'database', label: 'Database', icon: 'ri-database-2-line' },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: 'ri-shield-check-line' },
  { value: 'uiux', label: 'UI/UX', icon: 'ri-palette-line' },
  { value: 'fullstack', label: 'Full Stack', icon: 'ri-stack-line' },
];

export function generateLeaderboardEntries(period) {
  const multiplier = period === 'weekly' ? 1 : period === 'monthly' ? 4 : 12;
  return leaderboardUsers.map((user, index) => ({
    id: `entry-${period}-${user.id}`,
    user,
    category: 'all',
    period,
    xpEarned: (user.level * 85 + (user.streakDays * 10)) * multiplier,
    questsCompleted: Math.round((user.level * 1.8 + user.streakDays * 0.3) * multiplier / 4),
    challengesSolved: Math.round((user.level * 0.8 + (user.rank === 'Elite' ? 5 : 0)) * multiplier / 3),
    quizWins: Math.round((user.level * 0.5 + (user.streakDays > 20 ? 3 : 0)) * multiplier / 5),
    bossQuestsCleared: Math.round((user.level * 0.3 + (user.rank === 'Elite' ? 3 : user.rank === 'Challenger' ? 1 : 0)) * multiplier / 6),
    position: index + 1,
  }));
}

export function getCategoryEntries(period, category) {
  const entries = generateLeaderboardEntries(period);
  if (category === 'all') return entries;

  const categoryUserMap = {
    frontend: ['Angela Cruz', 'Paolo Garcia', 'Gabriel Torres', 'Patricia Ong'],
    backend: ['Jasmine Tan', 'Nicole Fernandez', 'Andrea Castillo'],
    database: ['Ralph Mendoza', 'Miguel dela Cruz', 'Mikaela Ramos'],
    cybersecurity: ['Kevin Santos', 'Adrian Bautista', 'Luis Domingo'],
    uiux: ['Dianne Lopez', 'Chloe Rivera', 'John Patrick Sy'],
    fullstack: ['Marco Reyes', 'Bea Villanueva', 'Sofia Mercado', 'Carlos Gutierrez'],
  };

  const allowedNames = categoryUserMap[category] || [];
  const filtered = entries
    .filter((e) => allowedNames.includes(e.user.fullName))
    .map((e, i) => ({ ...e, position: i + 1 }));

  return filtered;
}

export const rankColors = {
  Legend: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  Master: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  Elite: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  Challenger: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Apprentice: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  Novice: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30' },
};

export const positionMedals = {
  1: { icon: 'ri-medal-fill', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  2: { icon: 'ri-medal-fill', color: 'text-slate-300', bg: 'bg-slate-500/10' },
  3: { icon: 'ri-medal-fill', color: 'text-amber-600', bg: 'bg-amber-700/10' },
};