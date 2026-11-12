import {
  worldRegions,
  questTypeConfig,
  rarityConfig,
} from '@/sampleData/questExpandedData';

// 🌟 Types mula sa questExpandedData
export type {
  Quest,
  WorldRegion,
  QuestObjective,
  QuestProgress,
} from '@/sampleData/questExpandedData';

export {
  worldRegions,
  questTypeConfig,
  rarityConfig,
};

// ============================================================
// MASTERY CONFIGS & TYPES (Para sa MasteryPanel.tsx)
// ============================================================
export interface MasteryPathLevel {
  level: number;
  title: string;
  xpThreshold: number;
  badgeName: string;
  requiredQuests: string[];
}

export interface MasteryPath {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  regionId: string;
  levels: MasteryPathLevel[];
}

export const masteryPaths: MasteryPath[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: 'ri-layout-4-line',
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    regionId: 'region-frontend',
    levels: [
      { level: 1, title: 'HTML/CSS Initiate', xpThreshold: 100, badgeName: 'Web Starter', requiredQuests: [] },
      { level: 2, title: 'JS Practitioner', xpThreshold: 300, badgeName: 'DOM Master', requiredQuests: [] },
      { level: 3, title: 'React Specialist', xpThreshold: 600, badgeName: 'Component Crafter', requiredQuests: [] },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Engineering',
    icon: 'ri-server-line',
    color: '#06b6d4',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    regionId: 'region-backend',
    levels: [
      { level: 1, title: 'Node.js Novice', xpThreshold: 100, badgeName: 'Server Starter', requiredQuests: [] },
      { level: 2, title: 'API Architect', xpThreshold: 350, badgeName: 'REST Specialist', requiredQuests: [] },
      { level: 3, title: 'System Designer', xpThreshold: 700, badgeName: 'Backend Master', requiredQuests: [] },
    ],
  },
  {
    id: 'database',
    name: 'Database Architecture',
    icon: 'ri-database-2-line',
    color: '#8b5cf6',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    regionId: 'region-database',
    levels: [
      { level: 1, title: 'SQL Queryer', xpThreshold: 100, badgeName: 'Data Explorer', requiredQuests: [] },
      { level: 2, title: 'Schema Designer', xpThreshold: 300, badgeName: 'Relation Master', requiredQuests: [] },
      { level: 3, title: 'Database Admin', xpThreshold: 600, badgeName: 'Data Titan', requiredQuests: [] },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Operations',
    icon: 'ri-shield-keyhole-line',
    color: '#f43f5e',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    regionId: 'region-cybersecurity',
    levels: [
      { level: 1, title: 'Sec Guard', xpThreshold: 100, badgeName: 'Shield Bearer', requiredQuests: [] },
      { level: 2, title: 'Pentester', xpThreshold: 400, badgeName: 'Code Auditor', requiredQuests: [] },
      { level: 3, title: 'Security Architect', xpThreshold: 800, badgeName: 'Fortress Warden', requiredQuests: [] },
    ],
  },
  {
    id: 'fullstack',
    name: 'Full-Stack Mastery',
    icon: 'ri-stack-line',
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    regionId: 'region-fullstack',
    levels: [
      { level: 1, title: 'Stack Explorer', xpThreshold: 200, badgeName: 'Versatile Dev', requiredQuests: [] },
      { level: 2, title: 'Fullstack Dev', xpThreshold: 500, badgeName: 'System Integrator', requiredQuests: [] },
      { level: 3, title: 'Master Engineer', xpThreshold: 1000, badgeName: 'Grandmaster', requiredQuests: [] },
    ],
  },
];

export const masteryLevels = [
  { level: 1, title: 'Novice Adventurer', minXp: 0, icon: 'ri-seedling-line' },
  { level: 2, title: 'Apprentice Coder', minXp: 500, icon: 'ri-code-s-slash-line' },
  { level: 3, title: 'Journeyman Developer', minXp: 1500, icon: 'ri-terminal-box-line' },
  { level: 4, title: 'Code Specialist', minXp: 3000, icon: 'ri-cpu-line' },
  { level: 5, title: 'Master Architect', minXp: 5000, icon: 'ri-trophy-line' },
];

// Flexible helper na puwedeng gamitin ng parehong 3-arguments check at 1-argument XP check
export function getMasteryLevel(
  pathIdOrXp: string | number,
  completedQuestIds: string[] = [],
  userXp: number = 0
) {
  if (typeof pathIdOrXp === 'number') {
    const xp = pathIdOrXp;
    let current = masteryLevels[0];
    for (const lvl of masteryLevels) {
      if (xp >= lvl.minXp) current = lvl;
    }
    const currentIndex = masteryLevels.findIndex((l) => l.level === current.level);
    const next = masteryLevels[currentIndex + 1] || null;
    const currentMin = current.minXp;
    const nextMin = next ? next.minXp : currentMin + 2000;
    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round(((xp - currentMin) / (nextMin - currentMin)) * 100))
    );
    return { current, next, progressPercent, level: current.level, title: current.title, badgeName: current.title };
  }

  const path = masteryPaths.find((p) => p.id === pathIdOrXp);
  if (!path) return null;

  let currentLevel: MasteryPathLevel | null = null;
  for (const lvl of path.levels) {
    const questsDone = (lvl.requiredQuests || []).every((qid) => completedQuestIds.includes(qid));
    const xpMet = userXp >= lvl.xpThreshold;
    if (questsDone && xpMet) {
      currentLevel = lvl;
    }
  }
  return currentLevel;
}

// ============================================================
// DYNAMIC HELPERS (Gumagana sa Live Database Data)
// ============================================================

export function getUnlockedQuestIds(completedQuestIds: string[], allQuests: any[] = []): string[] {
  const unlocked: string[] = [];
  allQuests.forEach((q) => {
    if (q.isHidden) return;
    if (!q.requiresQuestIds || q.requiresQuestIds.length === 0) {
      unlocked.push(q.id);
      return;
    }
    const allPrereqsMet = q.requiresQuestIds.every((rq: string) => completedQuestIds.includes(rq));
    if (allPrereqsMet) unlocked.push(q.id);
  });
  return unlocked;
}

export function getRegionProgress(regionId: string, completedQuestIds: string[], allQuests: any[] = []) {
  const region = worldRegions.find((r) => r.id === regionId);
  if (!region) return { completed: 0, total: 0, percentage: 0, bossCompleted: false };
  
  const regionQuests = allQuests.filter((q) => q.region === regionId);
  const total = regionQuests.length;
  
  const completed = regionQuests.filter((q) => completedQuestIds.includes(q.id)).length;
  const bossCompleted = completedQuestIds.includes(region.bossQuestId);
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    bossCompleted,
  };
}

export function getSmartContinueQuest(
  activeQuestIds: string[],
  completedObjectiveIdsFn?: (quest: any) => string[],
  questProgress?: any[],
  allQuests: any[] = []
) {
  if (!activeQuestIds || activeQuestIds.length === 0) return null;
  
  const targetQuestId = activeQuestIds[0];
  const quest = allQuests.find((q) => q.id === targetQuestId);
  if (!quest) return null;

  const completedObjs = completedObjectiveIdsFn ? completedObjectiveIdsFn(quest) : [];
  const nextObjective = (quest.objectives || []).find((o: any) => !completedObjs.includes(o.id || o.objectiveId));

  return {
    quest,
    nextObjective: nextObjective || quest.objectives?.[0] || null,
    action: 'continue',
  };
}