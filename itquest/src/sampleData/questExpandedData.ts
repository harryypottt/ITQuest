// ============================================================
// ITQuest RPG QUEST ECOSYSTEM — 55+ Interconnected Quests
// 7 World Regions · 7 Mastery Paths · Boss · Legendary · Hidden
// ============================================================

// ============================================================
// RARITY CONFIG
// ============================================================
export const rarityConfig = {
  common: { label: 'Common', glow: '', ring: '', particle: '' },
  rare: { label: 'Rare', glow: 'shadow-emerald-500/20', ring: 'ring-emerald-500/20', particle: '#10b981' },
  epic: { label: 'Epic', glow: 'shadow-fuchsia-500/30', ring: 'ring-fuchsia-500/30', particle: '#d946ef' },
  legendary: { label: 'Legendary', glow: 'shadow-amber-500/40', ring: 'ring-amber-500/40', particle: '#f59e0b' },
};

// ============================================================
// TYPE CONFIG
// ============================================================
export const questTypeConfig = {
  learning: { label: 'Learning Quest', icon: 'ri-book-read-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  coding: { label: 'Coding Quest', icon: 'ri-code-box-line', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  quiz: { label: 'Quiz Quest', icon: 'ri-brain-line', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  boss: { label: 'Boss Quest', icon: 'ri-fire-line', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  daily: { label: 'Daily Quest', icon: 'ri-sun-line', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  weekly: { label: 'Weekly Quest', icon: 'ri-calendar-check-line', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' },
  achievement: { label: 'Achievement', icon: 'ri-trophy-line', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  hidden: { label: 'Hidden Quest', icon: 'ri-eye-off-line', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  legendary: { label: 'Legendary Quest', icon: 'ri-star-smile-line', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
};

// ============================================================
// SHARED TYPES (used across the RPG quest ecosystem)
// ============================================================
export interface QuestBadgeReward {
  name: string;
  rarity: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  objectiveType: string;
  targetId?: string;
  targetCount?: number;
  minScore?: number;
  orderIndex: number;
  isCompleted: boolean;
  redirectRoute?: string;
  redirectLabel?: string;
  objectiveTitle?: string;
  contentName?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  storyText?: string;
  type: 'learning' | 'coding' | 'quiz' | 'boss' | 'achievement' | 'daily' | 'weekly' | 'legendary';
  difficulty: number | string;
  xpReward: number;
  badgeReward?: {
    name: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  };
  category: string;
  categoryName?: string;
  region: string;
  icon: string;
  estimatedMinutes?: number;
  completionHint?: string;
  chainId?: string;
  chainPosition?: number;
  unlocksQuestIds?: string[];
  requiresQuestIds?: string[];
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  tags?: string[];
  isHidden?: boolean;
  hiddenCondition?: string;
  isActive?: boolean;
  objectives?: any[];
  status?: string; // <-- Idagdag ang linyang ito
}
export interface WorldRegion {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  color?: string;
  bgClass?: string;
  borderClass?: string;
  textClass?: string;
  glowClass?: string;
  questIds: string[];
  bossQuestId: string;
  requiredRegionIds: string[];
  gridPosition: { x: number; y: number };
  themes?: string[];
}

export interface QuestProgress {
  questId: string;
  status: string;
  startedAt?: string;
  completedAt?: string | null;
}

// ============================================================
// WORLD REGIONS (7 total: 6 paths + Full Stack convergence)
// ============================================================
export const worldRegions: WorldRegion[] = [
  {
    id: 'frontend-kingdom',
    name: 'The Frontend Kingdom',
    subtitle: 'Realm of Browsers & Interfaces',
    description: 'A vast kingdom where HTML structures, DOM manipulation, and React components come alive.',
    icon: 'ri-html5-line', color: '#10b981',
    bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-400', glowClass: 'shadow-emerald-500/20',
    questIds: [
      'quest-html-foundations',
      'quest-html-formatting-links',
      'quest-html-forms-tables',
      'quest-dom-basics',
      'quest-dom-counter-master',
      'quest-react-components',
      'quest-react-state-todo'
    ],
    bossQuestId: 'quest-frontend-boss',
    requiredRegionIds: [],
    gridPosition: { x: 1, y: 0 },
    themes: ['HTML5', 'DOM', 'Events', 'React', 'State'],
  },
  {
    id: 'server-citadel',
    name: 'The Server Citadel',
    subtitle: 'Halls of API Sorcery',
    description: 'Deep beneath the digital surface lies the Server Citadel, where Node.js and Express REST APIs process data.',
    icon: 'ri-server-line', color: '#06b6d4',
    bgClass: 'bg-cyan-500/10', borderClass: 'border-cyan-500/30',
    textClass: 'text-cyan-400', glowClass: 'shadow-cyan-500/20',
    questIds: [
      'quest-backend-intro',
      'quest-express-routing',
      'quest-express-middleware',
      'quest-backend-auth',
      'quest-backend-security'
    ],
    bossQuestId: 'quest-backend-boss',
    requiredRegionIds: ['frontend-kingdom'],
    gridPosition: { x: 0, y: 1 },
    themes: ['Node.js', 'Express', 'Middleware', 'JWT Auth', 'Prisma ORM'],
  },
  {
    id: 'data-vault',
    name: 'The Data Vault',
    subtitle: 'Vault of Eternal Knowledge',
    description: 'A fortress of relational SQL data, JOIN queries, schema design, and query performance tuning.',
    icon: 'ri-database-2-line', color: '#8b5cf6',
    bgClass: 'bg-violet-500/10', borderClass: 'border-violet-500/30',
    textClass: 'text-violet-400', glowClass: 'shadow-violet-500/20',
    questIds: [
      'quest-sql-intro',
      'quest-sql-joins',
      'quest-db-design',
      'quest-db-security-backup',
      'quest-db-indexing-perf',
      'quest-db-monitoring-maint'
    ],
    bossQuestId: 'quest-database-boss',
    requiredRegionIds: ['server-citadel'],
    gridPosition: { x: 0, y: 2 },
    themes: ['SQL CRUD', 'Relational Joins', 'Normalization', 'Indexing', 'Backup'],
  },
  {
    id: 'cyber-fortress',
    name: 'The Cyber Fortress',
    subtitle: 'Bastion of Digital Defense',
    description: 'Learn cybersecurity principles, threat analysis, access control, network security, and cryptography.',
    icon: 'ri-shield-check-line', color: '#f43f5e',
    bgClass: 'bg-rose-500/10', borderClass: 'border-rose-500/30',
    textClass: 'text-rose-400', glowClass: 'shadow-rose-500/20',
    questIds: [
      'quest-cyber-intro',
      'quest-cyber-threats',
      'quest-cyber-access-control',
      'quest-cyber-network-sec',
      'quest-cyber-crypto'
    ],
    bossQuestId: 'quest-cybersec-boss',
    requiredRegionIds: ['server-citadel'],
    gridPosition: { x: 2, y: 1 },
    themes: ['CIA Triad', 'Threats', 'RBAC/MFA', 'Firewalls', 'Cryptography'],
  },
  {
    id: 'fullstack-forge',
    name: 'The Full Stack Forge',
    subtitle: 'Where All Paths Converge',
    description: 'Connect frontend interfaces to backend servers, master Git workflows, and build fullstack systems.',
    icon: 'ri-stack-line', color: '#f59e0b',
    bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/30',
    textClass: 'text-amber-400', glowClass: 'shadow-amber-500/20',
    questIds: [
      'quest-fullstack-architecture',
      'quest-client-server-flow',
      'quest-js-mastery',
      'quest-git-collaboration'
    ],
    bossQuestId: 'quest-fullstack-boss',
    requiredRegionIds: ['frontend-kingdom', 'server-citadel', 'data-vault'],
    gridPosition: { x: 1, y: 1 },
    themes: ['Architecture', 'API Integration', 'Async JS', 'Git & GitHub'],
  },
  {
    id: 'design-sanctum',
    name: 'The Design Sanctum',
    subtitle: 'Temple of Creative Vision',
    description: 'User interface research, design principles, wireframing, and user experience workflows.',
    icon: 'ri-palette-line', color: '#d946ef',
    bgClass: 'bg-fuchsia-500/10', borderClass: 'border-fuchsia-500/30',
    textClass: 'text-fuchsia-400', glowClass: 'shadow-fuchsia-500/20',
    questIds: ['quest-uiux-foundations'],
    bossQuestId: 'quest-uiux-boss',
    requiredRegionIds: ['frontend-kingdom'],
    gridPosition: { x: 2, y: 0 },
    themes: ['UI/UX', 'Wireframing', 'User Research'],
  },
];

// ============================================================
// MASTERY PATHS (7 total)
// ============================================================
export const masteryPaths = [
  {
    id: 'frontend-mastery', name: 'Frontend Mastery', regionId: 'frontend-kingdom',
    icon: 'ri-html5-line', color: '#10b981',
    levels: [
      { level:1, title:'HTML Apprentice', requiredQuests:['quest-html-apprentice'], badgeName:'HTML Apprentice', badgeRarity:'Common', xpThreshold:100 },
      { level:2, title:'CSS Builder', requiredQuests:['quest-css-foundations'], badgeName:'CSS Builder', badgeRarity:'Rare', xpThreshold:250 },
      { level:3, title:'Responsive Warrior', requiredQuests:['quest-responsive-master','quest-js-warrior'], badgeName:'Responsive Warrior', badgeRarity:'Epic', xpThreshold:500 },
      { level:4, title:'React Champion', requiredQuests:['quest-react-frontiers','quest-frontend-elite'], badgeName:'React Champion', badgeRarity:'Epic', xpThreshold:1000 },
      { level:5, title:'Frontend Master', requiredQuests:['quest-frontend-boss','quest-legendary-frontend'], badgeName:'Frontend Master', badgeRarity:'Legendary', xpThreshold:2000 },
    ],
  },
  {
    id: 'backend-mastery', name: 'Backend Mastery', regionId: 'server-citadel',
    icon: 'ri-server-line', color: '#06b6d4',
    levels: [
      { level:1, title:'Server Novice', requiredQuests:['quest-server-awakening'], badgeName:'Server Novice', badgeRarity:'Common', xpThreshold:150 },
      { level:2, title:'API Crafter', requiredQuests:['quest-api-crafting'], badgeName:'API Crafter', badgeRarity:'Rare', xpThreshold:350 },
      { level:3, title:'Node.js Adept', requiredQuests:['quest-nodejs-journeyman','quest-middleware-auth'], badgeName:'Node.js Adept', badgeRarity:'Epic', xpThreshold:700 },
      { level:4, title:'API Archmage', requiredQuests:['quest-backend-boss'], badgeName:'API Archmage', badgeRarity:'Epic', xpThreshold:1200 },
      { level:5, title:'Backend Master', requiredQuests:['quest-microservices-mastery','quest-legendary-backend'], badgeName:'Backend Master', badgeRarity:'Legendary', xpThreshold:2500 },
    ],
  },
  {
    id: 'database-mastery', name: 'Database Mastery', regionId: 'data-vault',
    icon: 'ri-database-2-line', color: '#8b5cf6',
    levels: [
      { level:1, title:'SQL Apprentice', requiredQuests:['quest-sql-apprentice'], badgeName:'SQL Apprentice', badgeRarity:'Common', xpThreshold:100 },
      { level:2, title:'Query Scribe', requiredQuests:['quest-database-keeper','quest-query-master'], badgeName:'Query Scribe', badgeRarity:'Rare', xpThreshold:400 },
      { level:3, title:'Schema Architect', requiredQuests:['quest-data-modeling'], badgeName:'Schema Architect', badgeRarity:'Epic', xpThreshold:800 },
      { level:4, title:'Data Architect', requiredQuests:['quest-database-boss'], badgeName:'Data Architect', badgeRarity:'Epic', xpThreshold:1400 },
      { level:5, title:'Data Vault Guardian', requiredQuests:['quest-performance-tuning','quest-legendary-data-vault'], badgeName:'Data Vault Guardian', badgeRarity:'Legendary', xpThreshold:2500 },
    ],
  },
  {
    id: 'cyber-mastery', name: 'Cybersecurity Mastery', regionId: 'cyber-fortress',
    icon: 'ri-shield-check-line', color: '#f43f5e',
    levels: [
      { level:1, title:'Cyber Initiate', requiredQuests:['quest-security-initiate'], badgeName:'Cyber Initiate', badgeRarity:'Common', xpThreshold:150 },
      { level:2, title:'OWASP Guardian', requiredQuests:['quest-owasp-top10'], badgeName:'OWASP Guardian', badgeRarity:'Rare', xpThreshold:350 },
      { level:3, title:'Network Defender', requiredQuests:['quest-network-defense','quest-pen-testing'], badgeName:'Network Defender', badgeRarity:'Epic', xpThreshold:750 },
      { level:4, title:'Shadow Defender', requiredQuests:['quest-cybersec-boss'], badgeName:'Shadow Defender', badgeRarity:'Epic', xpThreshold:1300 },
      { level:5, title:'Cyber Sentinel', requiredQuests:['quest-security-architecture','quest-legendary-digital-guardian'], badgeName:'Cyber Sentinel', badgeRarity:'Legendary', xpThreshold:2500 },
    ],
  },
  {
    id: 'networking-mastery', name: 'Networking Mastery', regionId: 'networking-nexus',
    icon: 'ri-global-line', color: '#14b8a6',
    levels: [
      { level:1, title:'Network Novice', requiredQuests:['quest-networking-101'], badgeName:'Network Novice', badgeRarity:'Common', xpThreshold:150 },
      { level:2, title:'Cloud Deployer', requiredQuests:['quest-cloud-deployment'], badgeName:'Cloud Deployer', badgeRarity:'Rare', xpThreshold:400 },
      { level:3, title:'DevOps Engineer', requiredQuests:['quest-devops-essentials'], badgeName:'DevOps Engineer', badgeRarity:'Epic', xpThreshold:750 },
      { level:4, title:'Nexus Guardian', requiredQuests:['quest-networking-boss'], badgeName:'Nexus Guardian', badgeRarity:'Epic', xpThreshold:1300 },
      { level:5, title:'Infrastructure Master', requiredQuests:[], badgeName:'Infrastructure Master', badgeRarity:'Legendary', xpThreshold:2500 },
    ],
  },
  {
    id: 'uiux-mastery', name: 'UI/UX Mastery', regionId: 'design-sanctum',
    icon: 'ri-palette-line', color: '#d946ef',
    levels: [
      { level:1, title:'Design Novice', requiredQuests:['quest-design-awakening'], badgeName:'Design Novice', badgeRarity:'Common', xpThreshold:100 },
      { level:2, title:'Visual Crafter', requiredQuests:['quest-wireframing-proto','quest-color-typography'], badgeName:'Visual Crafter', badgeRarity:'Rare', xpThreshold:350 },
      { level:3, title:'UX Architect', requiredQuests:['quest-advanced-ux-research'], badgeName:'UX Architect', badgeRarity:'Epic', xpThreshold:650 },
      { level:4, title:'Design Virtuoso', requiredQuests:['quest-uiux-boss'], badgeName:'Design Virtuoso', badgeRarity:'Epic', xpThreshold:1100 },
      { level:5, title:'Design Oracle', requiredQuests:['quest-design-systems','quest-legendary-design-oracle'], badgeName:'Design Oracle', badgeRarity:'Legendary', xpThreshold:2000 },
    ],
  },
  {
    id: 'fullstack-mastery', name: 'Full Stack Mastery', regionId: 'fullstack-forge',
    icon: 'ri-stack-line', color: '#f59e0b',
    levels: [
      { level:1, title:'Stack Apprentice', requiredQuests:['quest-fullstack-forge'], badgeName:'Stack Apprentice', badgeRarity:'Rare', xpThreshold:300 },
      { level:2, title:'Bridge Builder', requiredQuests:['quest-frontend-backend-bridge'], badgeName:'Bridge Builder', badgeRarity:'Epic', xpThreshold:600 },
      { level:3, title:'System Designer', requiredQuests:['quest-system-design'], badgeName:'System Designer', badgeRarity:'Epic', xpThreshold:1000 },
      { level:4, title:'Forge Master', requiredQuests:['quest-fullstack-boss'], badgeName:'Forge Master', badgeRarity:'Legendary', xpThreshold:1800 },
      { level:5, title:'Omni-Stack Master', requiredQuests:['quest-fullstack-architect','quest-legendary-fullstack'], badgeName:'Omni-Stack Master', badgeRarity:'Legendary', xpThreshold:3500 },
    ],
  },
];

// ============================================================
// DAILY QUEST TEMPLATES (6 rotating types)
// ============================================================
export const dailyQuestTemplates = [
  { id:'daily-grind', title:'Daily Grind: Sharpen Your Blade', description:'A true warrior trains every day.', storyText:'The Training Grounds never sleep.', objectives:[{ id:'obj-dg-1', description:'Complete 1 lesson today', objectiveType:'lesson', minScore:1, orderIndex:1, isCompleted:false },{ id:'obj-dg-2', description:'Earn 50 XP today', objectiveType:'xp', targetCount:50, orderIndex:2, isCompleted:false },{ id:'obj-dg-3', description:'Log in to the platform', objectiveType:'streak', targetCount:1, orderIndex:3, isCompleted:false }], xpReward:60, icon:'ri-sun-line' },
  { id:'daily-code-rush', title:'Code Rush: Lightning Reflexes', description:'Speed is power.', storyText:'The Lightning Dojo opens at dawn.', objectives:[{ id:'obj-cr-1', description:'Complete 1 coding challenge today', objectiveType:'coding', minScore:1, orderIndex:1, isCompleted:false },{ id:'obj-cr-2', description:'Finish a lesson from a new category', objectiveType:'lesson', targetCount:1, orderIndex:2, isCompleted:false }], xpReward:80, icon:'ri-flashlight-line' },
  { id:'daily-knowledge-hunt', title:'Knowledge Hunt: Seek & Learn', description:'Explore different realms.', storyText:'The Scholars Guild has scattered scrolls.', objectives:[{ id:'obj-kh-1', description:'Complete at least 1 lesson from 2 different categories', objectiveType:'lesson', targetCount:2, orderIndex:1, isCompleted:false },{ id:'obj-kh-2', description:'Earn 80 XP today', objectiveType:'xp', targetCount:80, orderIndex:2, isCompleted:false }], xpReward:70, icon:'ri-book-2-line' },
  { id:'daily-quiz-victory', title:'Quiz Victory: Mental Fortitude', description:'Test your knowledge.', storyText:'The Quiz Arena buzzes.', objectives:[{ id:'obj-qv-1', description:'Complete 1 quiz battle today', objectiveType:'quiz', minScore:1, orderIndex:1, isCompleted:false },{ id:'obj-qv-2', description:'Complete 1 lesson today', objectiveType:'lesson', minScore:1, orderIndex:2, isCompleted:false }], xpReward:75, icon:'ri-brain-line' },
  { id:'daily-boss-prep', title:'Daily: Boss Preparation', description:'The Boss awaits.', storyText:'A distant roar echoes.', objectives:[{ id:'obj-bp-1', description:'Complete 2 lessons today', objectiveType:'lesson', minScore:2, orderIndex:1, isCompleted:false },{ id:'obj-bp-2', description:'Earn 100 XP today', objectiveType:'xp', targetCount:100, orderIndex:2, isCompleted:false }], xpReward:100, icon:'ri-fire-line' },
  { id:'daily-streak-guardian', title:'Daily: Streak Guardian', description:'Protect your streak.', storyText:'The Streak Flame flickers.', objectives:[{ id:'obj-sg-1', description:'Complete 1 lesson today', objectiveType:'lesson', minScore:1, orderIndex:1, isCompleted:false },{ id:'obj-sg-2', description:'Log in and maintain your streak', objectiveType:'streak', targetCount:1, orderIndex:2, isCompleted:false }], xpReward:50, icon:'ri-shield-flash-line' },
];

export const weeklyQuestTemplates = [
  { id:'weekly-gauntlet', title:'Weekly Challenge: The Gauntlet', description:'A week-long trial.', storyText:'The Gauntlet appears once every seven days.', objectives:[{ id:'obj-wc-1', description:'Complete 3 lessons this week', objectiveType:'lesson', minScore:3, orderIndex:1, isCompleted:false },{ id:'obj-wc-2', description:'Earn 300 XP this week', objectiveType:'xp', targetCount:300, orderIndex:2, isCompleted:false },{ id:'obj-wc-3', description:'Complete lessons from 2+ different categories', objectiveType:'lesson', targetCount:2, orderIndex:3, isCompleted:false }], xpReward:350, icon:'ri-calendar-check-line' },
  { id:'weekly-code-marathon', title:'Code Marathon: Endurance Trial', description:'Push your limits.', storyText:'The Marathon stretches across seven sunrises.', objectives:[{ id:'obj-cm-1', description:'Complete 3 coding challenges this week', objectiveType:'coding', minScore:3, orderIndex:1, isCompleted:false },{ id:'obj-cm-2', description:'Earn 400 XP this week', objectiveType:'xp', targetCount:400, orderIndex:2, isCompleted:false },{ id:'obj-cm-3', description:'Maintain a 5-day streak', objectiveType:'streak', targetCount:5, orderIndex:3, isCompleted:false }], xpReward:400, icon:'ri-run-line' },
  { id:'weekly-boss-hunter', title:'Weekly: Boss Hunter', description:'Prepare for Boss Quests.', storyText:'The Boss Hunter Lodge opens once a week.', objectives:[{ id:'obj-bh-1', description:'Complete 4 lessons this week', objectiveType:'lesson', minScore:4, orderIndex:1, isCompleted:false },{ id:'obj-bh-2', description:'Earn 500 XP this week', objectiveType:'xp', targetCount:500, orderIndex:2, isCompleted:false },{ id:'obj-bh-3', description:'Complete lessons from 3+ different categories', objectiveType:'lesson', targetCount:3, orderIndex:3, isCompleted:false }], xpReward:500, icon:'ri-sword-line' },
];

// ============================================================
// ALL QUESTS — 55+ Interconnected RPG Quests
// ============================================================
export const quests = [

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE FRONTEND KINGDOM (26 quests)               ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-html-apprentice', title: 'HTML Apprentice: The First Gate',
    description: 'Master the fundamental building blocks of the web. Learn HTML5 to construct the skeleton of every digital creation.',
    storyText: 'The ancient gates of the Web Temple stand before you, carved from pure markup stone. The Gatekeeper speaks: "Before you can craft interfaces, you must understand structure. Prove your mastery over headings, paragraphs, lists, and forms. Only then shall the gates open."',
    type: 'learning', difficulty: 1, xpReward: 100,
    badgeReward: { name: 'HTML Apprentice', rarity: 'Common' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-ha-1', description: 'Complete "Introduction to HTML5" lesson', objectiveType: 'lesson', targetId: 'frontend-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-ha-2', description: 'Reach 50 total XP', objectiveType: 'xp', targetCount: 50, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-html5-line', estimatedMinutes: 45,
    completionHint: 'Complete the HTML5 lesson and earn 50 XP to unlock the next gate.',
    chainId: 'frontend-path', chainPosition: 1, unlocksQuestIds: ['quest-css-foundations'], requiresQuestIds: [], rarity: 'common',
  },
  {
    id: 'quest-css-foundations', title: "CSS Foundations: The Stylist's Awakening",
    description: 'Colors, layouts, and visual magic await. Master CSS3 fundamentals to transform bare HTML structures into beautiful, styled interfaces.',
    storyText: 'Beyond the HTML Gate lies the Garden of Styles, where CSS sprites dance among cascading rules. The Stylist offers you a brush: "Structure is the bones, but style is the soul. Learn to paint with selectors, color with properties, and arrange with Flexbox. Your creations shall breathe."',
    type: 'learning', difficulty: 1, xpReward: 150,
    badgeReward: { name: 'CSS Stylist', rarity: 'Common' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-cf-1', description: 'Complete "CSS Fundamentals" lesson', objectiveType: 'lesson', targetId: 'frontend-2', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-2', redirectLabel: 'Go to Lesson' },
      { id: 'obj-cf-2', description: 'Reach 150 total XP', objectiveType: 'xp', targetCount: 150, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-css3-line', estimatedMinutes: 50,
    completionHint: 'Master the CSS Fundamentals lesson and hit 150 XP.',
    chainId: 'frontend-path', chainPosition: 2, unlocksQuestIds: ['quest-responsive-master'], requiresQuestIds: ['quest-html-apprentice'], rarity: 'common',
  },
  {
    id: 'quest-responsive-master', title: 'Responsive Warrior: The Shifting Realm',
    description: 'Conquer responsive design. Build layouts that seamlessly adapt across every screen size from watch to widescreen. Pass the CSS quiz and prove your layout mastery.',
    storyText: 'The Responsive Realm is a dimension of endless transformation where screens shift from phone to tablet to desktop in a blink. Master media queries, flexible grids, and adaptive imagery to survive this ever-changing battleground. The Realm Guardians demand proof — complete the sacred lessons, pass the CSS quiz, and demonstrate your skills.',
    type: 'learning', difficulty: 2, xpReward: 250,
    badgeReward: { name: 'Responsive Warrior', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-rm-1', description: 'Complete "CSS Fundamentals: Styling the Web" lesson', objectiveType: 'lesson', targetId: 'frontend-2', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-2', redirectLabel: 'Go to Lesson', objectiveTitle: 'CSS Fundamentals', contentName: 'CSS Fundamentals: Styling the Web' },
      { id: 'obj-rm-2', description: 'Complete "Responsive Design Essentials" lesson', objectiveType: 'lesson', targetId: 'frontend-4', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/lessons/frontend-4', redirectLabel: 'Go to Lesson', objectiveTitle: 'Responsive Design', contentName: 'Responsive Web Design' },
      { id: 'obj-rm-3', description: 'Pass "CSS Layout Mastery Quiz" with minimum 80% score', objectiveType: 'quiz', targetId: 'css-mastery', minScore: 80, orderIndex: 3, isCompleted: false, redirectRoute: '/quiz-battle/css-mastery', redirectLabel: 'Take Quiz', objectiveTitle: 'CSS Layout Quiz', contentName: 'CSS Layout Mastery' },
      { id: 'obj-rm-4', description: 'Complete "Responsive Landing Page" coding challenge', objectiveType: 'coding', targetId: 'challenge-8', minScore: 1, orderIndex: 4, isCompleted: false, redirectRoute: '/coding/challenge-8', redirectLabel: 'Start Challenge', objectiveTitle: 'Coding Challenge', contentName: 'Responsive Profile Card' },
      { id: 'obj-rm-5', description: 'Reach 250 total XP', objectiveType: 'xp_requirement', targetCount: 250, orderIndex: 5, isCompleted: false },
    ],
    isActive: true, icon: 'ri-smartphone-line', estimatedMinutes: 90,
    completionHint: 'Complete CSS + Responsive Design lessons, ace the CSS quiz at 80%+, solve the coding challenge, and reach 250 XP.',
    chainId: 'frontend-path', chainPosition: 3, unlocksQuestIds: ['quest-js-warrior'], requiresQuestIds: ['quest-css-foundations'], rarity: 'rare',
    tags: ['responsive-design', 'css', 'media-queries', 'flexbox'],
  },
  {
    id: 'quest-js-warrior', title: 'JavaScript: Path of the Warrior',
    description: 'Forge your skills in JavaScript fires. Complete core programming challenges, pass the JS quiz, and win a battle to ascend from stylist to true frontend warrior.',
    storyText: 'The JavaScript Dojo sits atop Misty Mountain. Master Sensei Array declares: "CSS paints the world, but JavaScript brings it to life. Learn to bend the DOM to your will, pass the trial of knowledge, and prove yourself in the Arena. Only then shall no interface resist you."',
    type: 'learning', difficulty: 2, xpReward: 300,
    badgeReward: { name: 'Code Warrior', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-jw-1', description: 'Complete "JavaScript Basics" lesson', objectiveType: 'lesson', targetId: 'frontend-3', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-3', redirectLabel: 'Go to Lesson', objectiveTitle: 'JavaScript Basics', contentName: 'JavaScript Basics' },
      { id: 'obj-jw-2', description: 'Pass "JavaScript Core Concepts Quiz" with minimum 70%', objectiveType: 'quiz', targetId: 'js-core-concepts', minScore: 70, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/js-core-concepts', redirectLabel: 'Take Quiz', objectiveTitle: 'JS Core Concepts Quiz', contentName: 'JavaScript Core Concepts' },
      { id: 'obj-jw-3', description: 'Complete "FizzBuzz Classic" coding challenge', objectiveType: 'coding', targetId: 'challenge-1', minScore: 1, orderIndex: 3, isCompleted: false, redirectRoute: '/coding/challenge-1', redirectLabel: 'Start Challenge', objectiveTitle: 'FizzBuzz Challenge', contentName: 'FizzBuzz Classic' },
      { id: 'obj-jw-4', description: 'Complete "Palindrome Checker" coding challenge', objectiveType: 'coding', targetId: 'challenge-3', minScore: 1, orderIndex: 4, isCompleted: false, redirectRoute: '/coding/challenge-3', redirectLabel: 'Start Challenge', objectiveTitle: 'Palindrome Challenge', contentName: 'Palindrome Checker' },
      { id: 'obj-jw-5', description: 'Maintain a 3-day login streak', objectiveType: 'streak_requirement', targetCount: 3, orderIndex: 5, isCompleted: false },
      { id: 'obj-jw-6', description: 'Reach 350 total XP', objectiveType: 'xp_requirement', targetCount: 350, orderIndex: 6, isCompleted: false },
    ],
    isActive: true, icon: 'ri-javascript-line', estimatedMinutes: 100,
    completionHint: 'Complete JS lesson, pass the JS quiz at 70%+, solve 2 coding challenges, maintain a 3-day streak, and reach 350 XP.',
    chainId: 'frontend-path', chainPosition: 4, unlocksQuestIds: ['quest-react-frontiers'], requiresQuestIds: ['quest-responsive-master'], rarity: 'rare',
    tags: ['javascript', 'algorithms', 'coding-challenges', 'quiz'],
  },
  {
    id: 'quest-react-frontiers', title: 'React Frontiers: The Component Crusade',
    description: 'Venture into the modern frontend frontier. Master React components, state management, and hooks to build dynamic, production-grade interfaces.',
    storyText: 'Beyond the Dojo lies the React Frontier — a land where components are living entities and hooks bind the very fabric of the UI. The Component Crusaders teach JSX, props, and the sacred useEffect. Prove yourself through lessons, assessments, and challenges.',
    type: 'learning', difficulty: 3, xpReward: 350,
    badgeReward: { name: 'React Crusader', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-rf-1', description: 'Complete "Introduction to React" lesson', objectiveType: 'lesson', targetId: 'frontend-5', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-5', redirectLabel: 'Go to Lesson', objectiveTitle: 'React Fundamentals', contentName: 'Introduction to React' },
      { id: 'obj-rf-2', description: 'Pass "React Deep Dive Quiz" with minimum 70%', objectiveType: 'quiz', targetId: 'react-deep-dive', minScore: 70, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/react-deep-dive', redirectLabel: 'Take Quiz', objectiveTitle: 'React Deep Dive Quiz', contentName: 'React Deep Dive' },
      { id: 'obj-rf-3', description: 'Complete "DOM Counter App" coding challenge', objectiveType: 'coding', targetId: 'challenge-2', minScore: 1, orderIndex: 3, isCompleted: false, redirectRoute: '/coding/challenge-2', redirectLabel: 'Start Challenge', objectiveTitle: 'DOM Counter App', contentName: 'DOM Counter App' },
      { id: 'obj-rf-4', description: 'Complete "Build a Todo Input" coding challenge', objectiveType: 'coding', targetId: 'challenge-6', minScore: 1, orderIndex: 4, isCompleted: false, redirectRoute: '/coding/challenge-6', redirectLabel: 'Start Challenge', objectiveTitle: 'Todo Input', contentName: 'Build a Todo Input' },
      { id: 'obj-rf-5', description: 'Maintain a 5-day streak', objectiveType: 'streak_requirement', targetCount: 5, orderIndex: 5, isCompleted: false },
    ],
    isActive: true, icon: 'ri-reactjs-line', estimatedMinutes: 120,
    completionHint: 'Master React, pass the quiz, solve 2 coding challenges, and hold a 5-day streak.',
    chainId: 'frontend-path', chainPosition: 5, unlocksQuestIds: ['quest-frontend-elite'], requiresQuestIds: ['quest-js-warrior'], rarity: 'epic',
    tags: ['react', 'components', 'hooks', 'state-management'],
  },
  {
    id: 'quest-frontend-boss', title: 'Build Your Developer Portfolio',
    description: 'The ultimate frontend trial. Combine HTML, CSS, JavaScript, and React to build a complete, responsive portfolio that showcases your skills to every realm.',
    storyText: 'The Guild of Master Craftsmen decrees: forge your digital fortress — a Portfolio that showcases your skills to every realm. Build responsive, beautiful, and interactive. The Guild Elders will judge structure, styling, and interactivity. Forge well, warrior. Your portfolio is your banner in the professional world.',
    type: 'boss', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'Portfolio Forged', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fb-1', description: 'Submit "Build Your Developer Portfolio" boss project', objectiveType: 'boss_project', targetId: 'boss-portfolio', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-portfolio', redirectLabel: 'Go to Boss Quest', objectiveTitle: 'Portfolio Boss Project', contentName: 'Build Your Developer Portfolio' },
      { id: 'obj-fb-2', description: 'Complete "CSS Flexbox Card Grid" coding challenge', objectiveType: 'coding', targetId: 'challenge-4', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-4', redirectLabel: 'Start Challenge', objectiveTitle: 'Flexbox Grid', contentName: 'CSS Flexbox Card Grid' },
      { id: 'obj-fb-3', description: 'Reach 600 total XP', objectiveType: 'xp_requirement', targetCount: 600, orderIndex: 3, isCompleted: false },
      { id: 'obj-fb-4', description: 'Maintain a 7-day streak', objectiveType: 'streak_requirement', targetCount: 7, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-vip-crown-line', estimatedMinutes: 180,
    completionHint: 'Submit the boss project, solve the Flexbox challenge, reach 600 XP, and maintain a 7-day streak.',
    chainId: 'frontend-path', chainPosition: 25, unlocksQuestIds: ['quest-legendary-frontend'], requiresQuestIds: ['quest-frontend-tooling'], rarity: 'epic',
    tags: ['portfolio', 'boss-project', 'frontend-mastery'],
  },
  {
    id: 'quest-frontend-elite', title: 'Frontend Elite: Advanced Patterns',
    description: 'Transcend the ordinary. Master advanced React patterns, performance optimization, and state architecture before facing the Boss.',
    storyText: 'In the Elite Sanctum, masters push browser boundaries with lazy loading, code splitting, memo optimization, and advanced state management. The Elite Council only admits those who make applications sing at 60fps. Prove yourself before attempting the Portfolio Boss.',
    type: 'learning', difficulty: 4, xpReward: 400,
    badgeReward: { name: 'Frontend Elite', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fe-1', description: 'Complete at least 1 lesson from another region (Backend, Database, or Cybersecurity)', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-fe-2', description: 'Complete "Title Case Converter" coding challenge', objectiveType: 'coding', targetId: 'challenge-7', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-7', redirectLabel: 'Start Challenge', objectiveTitle: 'Title Case', contentName: 'Title Case Converter' },
      { id: 'obj-fe-3', description: 'Pass "JavaScript Core Concepts Quiz" with minimum 80%', objectiveType: 'quiz', targetId: 'js-core-concepts', minScore: 80, orderIndex: 3, isCompleted: false, redirectRoute: '/quiz-battle/js-core-concepts', redirectLabel: 'Take Quiz', objectiveTitle: 'JS Quiz Mastery', contentName: 'JavaScript Core Concepts' },
      { id: 'obj-fe-4', description: 'Reach 1000 total XP', objectiveType: 'xp_requirement', targetCount: 1000, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-sparkling-line', estimatedMinutes: 120,
    completionHint: 'Cross-train in another region, solve a coding challenge, ace the JS quiz at 80%+, and reach 1000 XP.',
    chainId: 'frontend-path', chainPosition: 6, unlocksQuestIds: ['quest-frontend-semantics'], requiresQuestIds: ['quest-react-frontiers'], rarity: 'epic',
    tags: ['advanced', 'performance', 'optimization', 'cross-discipline'],
  },
  {
    id: 'quest-legendary-frontend', title: 'Legendary: The Eternal Frontend',
    description: 'Having conquered the Portfolio Boss, transcend into legend. Build something that pushes the boundaries of what the web can do.',
    storyText: 'Beyond the Kingdom lies the Eternal Frontend — where the rules of the web are rewritten. The Crystal Throne was your proving ground for the Portfolio Boss. Now Legendary warriors craft experiences that blur the line between application and art. The Eternal Guardians invite you to create your legacy.',
    type: 'legendary', difficulty: 5, xpReward: 1000,
    badgeReward: { name: 'Eternal Frontend', rarity: 'Legendary' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-lf-1', description: 'Complete all Frontend Kingdom quests before this one', objectiveType: 'prerequisite_quest', targetId: 'quest-frontend-boss', orderIndex: 1, isCompleted: false },
      { id: 'obj-lf-2', description: 'Reach 1500 total XP', objectiveType: 'xp_requirement', targetCount: 1500, orderIndex: 2, isCompleted: false },
      { id: 'obj-lf-3', description: 'Submit "The Eternal Frontend" legendary boss project', objectiveType: 'boss_project', targetId: 'boss-eternal-frontend', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-eternal-frontend', redirectLabel: 'Go to Boss Quest', objectiveTitle: 'Eternal Frontend', contentName: 'The Eternal Frontend' },
      { id: 'obj-lf-4', description: 'Maintain a 14-day streak', objectiveType: 'streak_requirement', targetCount: 14, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-star-smile-line', estimatedMinutes: 480,
    completionHint: 'Prove absolute mastery: complete frontend boss, 1500 XP, a legendary project, and a 14-day streak.',
    chainId: 'frontend-path', chainPosition: 26, unlocksQuestIds: [], requiresQuestIds: ['quest-frontend-boss'], isHidden: true, hiddenCondition: 'Complete Build Your Developer Portfolio', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║     FRONTEND KINGDOM — ADVANCED MASTERY TRIALS (18)      ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-frontend-semantics', title: 'HTML Semantics & Structure',
    description: 'Go beyond basic tags. Master semantic HTML, document structure, and the elements that give real meaning to your markup.',
    storyText: 'The Archivist of the Web Temple pulls ancient scrolls from the shelf: "Anyone can stack div tags, but a true builder crafts meaning. Semantic tags are runes of intent. Master them, and both machines and mortals shall understand your work."',
    type: 'learning', difficulty: 2, xpReward: 250,
    badgeReward: { name: 'Semantic Scribe', rarity: 'Common' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fes-1', description: 'Complete "Introduction to HTML5" lesson', objectiveType: 'lesson', targetId: 'frontend-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-1', redirectLabel: 'Go to Lesson', objectiveTitle: 'HTML5 Semantics', contentName: 'Introduction to HTML5' },
      { id: 'obj-fes-2', description: 'Pass "HTML5 Fundamentals Quiz" with minimum 80%', objectiveType: 'quiz', targetId: 'html-fundamentals', minScore: 80, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/html-fundamentals', redirectLabel: 'Take Quiz', objectiveTitle: 'HTML5 Quiz', contentName: 'HTML5 Fundamentals' },
      { id: 'obj-fes-3', description: 'Reach 650 total XP', objectiveType: 'xp_requirement', targetCount: 650, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-html5-line', estimatedMinutes: 55,
    completionHint: 'Review the HTML5 lesson, ace the HTML quiz at 80%+, and reach 650 XP.',
    chainId: 'frontend-path', chainPosition: 7, unlocksQuestIds: ['quest-frontend-accessibility'], requiresQuestIds: ['quest-frontend-elite'], rarity: 'common',
    tags: ['html', 'semantics', 'structure'],
  },
  {
    id: 'quest-frontend-accessibility', title: 'Accessibility Champion: Design for Everyone',
    description: 'Build interfaces everyone can use. Learn ARIA, keyboard navigation, contrast, and inclusive design principles that separate good developers from great ones.',
    storyText: 'The Gatekeeper of the Open Temple bars your path: "Your interfaces must welcome all who arrive, whether they see, hear, or touch the world differently. Build for everyone, or build for no one."',
    type: 'learning', difficulty: 2, xpReward: 280,
    badgeReward: { name: 'Accessibility Champion', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fac-1', description: 'Complete "Design Thinking & Principles" lesson', objectiveType: 'lesson', targetId: 'uiux-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/uiux-1', redirectLabel: 'Go to Lesson', objectiveTitle: 'Inclusive Design', contentName: 'Design Thinking & Principles' },
      { id: 'obj-fac-2', description: 'Complete "Responsive Web Design" lesson', objectiveType: 'lesson', targetId: 'frontend-4', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/lessons/frontend-4', redirectLabel: 'Go to Lesson', objectiveTitle: 'Adaptive Layouts', contentName: 'Responsive Web Design' },
      { id: 'obj-fac-3', description: 'Reach 700 total XP', objectiveType: 'xp_requirement', targetCount: 700, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-user-heart-line', estimatedMinutes: 60,
    completionHint: 'Learn inclusive design and adaptive layouts, then reach 700 XP.',
    chainId: 'frontend-path', chainPosition: 8, unlocksQuestIds: ['quest-frontend-seo'], requiresQuestIds: ['quest-frontend-semantics'], rarity: 'rare',
    tags: ['accessibility', 'aria', 'inclusive-design'],
  },
  {
    id: 'quest-frontend-seo', title: 'Frontend SEO & Discoverability',
    description: 'Make your pages findable. Learn metadata, structured data, and on-page SEO that helps search engines understand and rank your work.',
    storyText: 'The Herald of the Kingdom shouts into the void: "A masterpiece hidden is a masterpiece lost! Craft metadata runes so the great search spirits may find and proclaim your work to all."',
    type: 'learning', difficulty: 2, xpReward: 300,
    badgeReward: { name: 'Search Herald', rarity: 'Common' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fseo-1', description: 'Complete "Introduction to HTML5" lesson', objectiveType: 'lesson', targetId: 'frontend-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-1', redirectLabel: 'Go to Lesson', objectiveTitle: 'Document Structure', contentName: 'Introduction to HTML5' },
      { id: 'obj-fseo-2', description: 'Complete "Title Case Converter" coding challenge', objectiveType: 'coding', targetId: 'challenge-7', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-7', redirectLabel: 'Start Challenge', objectiveTitle: 'Content Formatting', contentName: 'Title Case Converter' },
      { id: 'obj-fseo-3', description: 'Reach 750 total XP', objectiveType: 'xp_requirement', targetCount: 750, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-search-eye-line', estimatedMinutes: 60,
    completionHint: 'Master document structure, solve the formatting challenge, and reach 750 XP.',
    chainId: 'frontend-path', chainPosition: 9, unlocksQuestIds: ['quest-frontend-css-layout'], requiresQuestIds: ['quest-frontend-accessibility'], rarity: 'common',
    tags: ['seo', 'metadata', 'discoverability'],
  },
  {
    id: 'quest-frontend-css-layout', title: 'Modern CSS Layouts: Flexbox & Grid',
    description: 'Command the two mightiest layout systems of the modern web. Build complex, responsive structures with Flexbox and CSS Grid like a true architect.',
    storyText: 'The Layout Architect unfurls two glowing blueprints: "Flexbox bends and flows with content. Grid commands the two-dimensional plane. Master both, and no screen shall ever resist your designs."',
    type: 'learning', difficulty: 3, xpReward: 350,
    badgeReward: { name: 'Layout Architect', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fcl-1', description: 'Complete "CSS Fundamentals" lesson', objectiveType: 'lesson', targetId: 'frontend-2', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-2', redirectLabel: 'Go to Lesson', objectiveTitle: 'CSS Layout', contentName: 'CSS Fundamentals' },
      { id: 'obj-fcl-2', description: 'Complete "CSS Flexbox Card Grid" coding challenge', objectiveType: 'coding', targetId: 'challenge-4', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-4', redirectLabel: 'Start Challenge', objectiveTitle: 'Flexbox Grid', contentName: 'CSS Flexbox Card Grid' },
      { id: 'obj-fcl-3', description: 'Pass "CSS Layout Mastery Quiz" with minimum 75%', objectiveType: 'quiz', targetId: 'css-mastery', minScore: 75, orderIndex: 3, isCompleted: false, redirectRoute: '/quiz-battle/css-mastery', redirectLabel: 'Take Quiz', objectiveTitle: 'CSS Quiz', contentName: 'CSS Layout Mastery' },
      { id: 'obj-fcl-4', description: 'Reach 820 total XP', objectiveType: 'xp_requirement', targetCount: 820, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-layout-line', estimatedMinutes: 90,
    completionHint: 'Learn CSS layout, build the Flexbox grid, pass the CSS quiz at 75%+, and reach 820 XP.',
    chainId: 'frontend-path', chainPosition: 10, unlocksQuestIds: ['quest-frontend-css-animation'], requiresQuestIds: ['quest-frontend-seo'], rarity: 'rare',
    tags: ['css', 'flexbox', 'grid', 'layout'],
  },
  {
    id: 'quest-frontend-css-animation', title: 'CSS Animation & Interaction',
    description: 'Bring your interfaces to life. Master transitions, keyframe animations, and micro-interactions that make designs feel responsive and alive.',
    storyText: 'The Motion Weaver waves a hand and the still stones begin to dance: "Static is death to attention. A button that breathes, a card that lifts, a page that flows — motion is the soul of experience."',
    type: 'learning', difficulty: 2, xpReward: 320,
    badgeReward: { name: 'Motion Weaver', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fca-1', description: 'Complete "CSS Fundamentals" lesson', objectiveType: 'lesson', targetId: 'frontend-2', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-2', redirectLabel: 'Go to Lesson', objectiveTitle: 'CSS Transitions', contentName: 'CSS Fundamentals' },
      { id: 'obj-fca-2', description: 'Maintain a 5-day login streak', objectiveType: 'streak_requirement', targetCount: 5, orderIndex: 2, isCompleted: false },
      { id: 'obj-fca-3', description: 'Reach 900 total XP', objectiveType: 'xp_requirement', targetCount: 900, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-magic-line', estimatedMinutes: 70,
    completionHint: 'Study CSS motion, keep a 5-day streak, and reach 900 XP.',
    chainId: 'frontend-path', chainPosition: 11, unlocksQuestIds: ['quest-frontend-responsive-advanced'], requiresQuestIds: ['quest-frontend-css-layout'], rarity: 'rare',
    tags: ['css', 'animation', 'transitions'],
  },
  {
    id: 'quest-frontend-responsive-advanced', title: 'Advanced Responsive Techniques',
    description: 'Go deeper than media queries. Master fluid typography, container queries, and mobile-first strategies for flawless layouts on every device.',
    storyText: 'The Shifting Realm tests you once more: "Media queries are but the first step. Fluid grids, adaptive imagery, container queries — true responsive mastery bends to the user, never the device."',
    type: 'learning', difficulty: 3, xpReward: 360,
    badgeReward: { name: 'Adaptive Master', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fra-1', description: 'Complete "Responsive Web Design" lesson', objectiveType: 'lesson', targetId: 'frontend-4', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-4', redirectLabel: 'Go to Lesson', objectiveTitle: 'Responsive Design', contentName: 'Responsive Web Design' },
      { id: 'obj-fra-2', description: 'Complete "Responsive Profile Card" coding challenge', objectiveType: 'coding', targetId: 'challenge-8', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-8', redirectLabel: 'Start Challenge', objectiveTitle: 'Responsive Card', contentName: 'Responsive Profile Card' },
      { id: 'obj-fra-3', description: 'Reach 980 total XP', objectiveType: 'xp_requirement', targetCount: 980, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-smartphone-line', estimatedMinutes: 85,
    completionHint: 'Master responsive patterns, build the profile card, and reach 980 XP.',
    chainId: 'frontend-path', chainPosition: 12, unlocksQuestIds: ['quest-frontend-js-scope'], requiresQuestIds: ['quest-frontend-css-animation'], rarity: 'rare',
    tags: ['responsive', 'mobile-first', 'fluid-layout'],
  },
  {
    id: 'quest-frontend-js-scope', title: 'JavaScript Scope & Closures',
    description: 'Peer into the mind of JavaScript. Master scope chains, lexical environments, and closures — the concepts that separate scripters from engineers.',
    storyText: 'The JavaScript Sensei traces a circle in the sand: "A closure remembers the world in which it was born. Understand scope, and you understand why functions are the most powerful runes in the language."',
    type: 'learning', difficulty: 3, xpReward: 380,
    badgeReward: { name: 'Closure Adept', rarity: 'Rare' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fjs-1', description: 'Complete "JavaScript Basics" lesson', objectiveType: 'lesson', targetId: 'frontend-3', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-3', redirectLabel: 'Go to Lesson', objectiveTitle: 'JS Scope', contentName: 'JavaScript Basics' },
      { id: 'obj-fjs-2', description: 'Pass "JavaScript Core Concepts Quiz" with minimum 75%', objectiveType: 'quiz', targetId: 'js-core-concepts', minScore: 75, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/js-core-concepts', redirectLabel: 'Take Quiz', objectiveTitle: 'JS Concepts Quiz', contentName: 'JavaScript Core Concepts' },
      { id: 'obj-fjs-3', description: 'Reach 1060 total XP', objectiveType: 'xp_requirement', targetCount: 1060, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-braces-line', estimatedMinutes: 80,
    completionHint: 'Study JS scope, pass the core concepts quiz at 75%+, and reach 1060 XP.',
    chainId: 'frontend-path', chainPosition: 13, unlocksQuestIds: ['quest-frontend-js-async'], requiresQuestIds: ['quest-frontend-responsive-advanced'], rarity: 'rare',
    tags: ['javascript', 'scope', 'closures'],
  },
  {
    id: 'quest-frontend-js-async', title: 'Asynchronous JavaScript',
    description: 'Tame the asynchronous beast. Master callbacks, promises, async/await, and the event loop that powers responsive web applications.',
    storyText: 'The Time Bender speaks from a chamber where moments overlap: "JavaScript never waits. It schedules, resolves, and moves on. Learn to command promises, or the async depths will command you."',
    type: 'learning', difficulty: 3, xpReward: 400,
    badgeReward: { name: 'Async Wrangler', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fja-1', description: 'Complete "JavaScript Basics" lesson', objectiveType: 'lesson', targetId: 'frontend-3', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-3', redirectLabel: 'Go to Lesson', objectiveTitle: 'Async Fundamentals', contentName: 'JavaScript Basics' },
      { id: 'obj-fja-2', description: 'Complete "FizzBuzz Classic" coding challenge', objectiveType: 'coding', targetId: 'challenge-1', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-1', redirectLabel: 'Start Challenge', objectiveTitle: 'Logic Challenge', contentName: 'FizzBuzz Classic' },
      { id: 'obj-fja-3', description: 'Reach 1150 total XP', objectiveType: 'xp_requirement', targetCount: 1150, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-time-line', estimatedMinutes: 90,
    completionHint: 'Learn async JavaScript, solve FizzBuzz, and reach 1150 XP.',
    chainId: 'frontend-path', chainPosition: 14, unlocksQuestIds: ['quest-frontend-dom-events'], requiresQuestIds: ['quest-frontend-js-scope'], rarity: 'epic',
    tags: ['javascript', 'async', 'promises'],
  },
  {
    id: 'quest-frontend-dom-events', title: 'DOM Manipulation & Events',
    description: 'Command the document. Master DOM traversal, event handling, delegation, and dynamic rendering to make pages truly interactive.',
    storyText: 'The Puppet Master of the DOM pulls invisible strings: "The page is a living tree. Learn to walk its branches, listen to its whispers of clicks and keystrokes, and rewrite its story in real time."',
    type: 'learning', difficulty: 3, xpReward: 420,
    badgeReward: { name: 'DOM Commander', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fde-1', description: 'Complete "JavaScript Basics" lesson', objectiveType: 'lesson', targetId: 'frontend-3', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-3', redirectLabel: 'Go to Lesson', objectiveTitle: 'DOM Fundamentals', contentName: 'JavaScript Basics' },
      { id: 'obj-fde-2', description: 'Complete "DOM Counter App" coding challenge', objectiveType: 'coding', targetId: 'challenge-2', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-2', redirectLabel: 'Start Challenge', objectiveTitle: 'DOM App', contentName: 'DOM Counter App' },
      { id: 'obj-fde-3', description: 'Reach 1250 total XP', objectiveType: 'xp_requirement', targetCount: 1250, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-cursor-line', estimatedMinutes: 95,
    completionHint: 'Master DOM and events, build the counter app, and reach 1250 XP.',
    chainId: 'frontend-path', chainPosition: 15, unlocksQuestIds: ['quest-frontend-es6'], requiresQuestIds: ['quest-frontend-js-async'], rarity: 'epic',
    tags: ['javascript', 'dom', 'events'],
  },
  {
    id: 'quest-frontend-es6', title: 'Modern ES6+ Features',
    description: 'Wield the modern JavaScript arsenal. Master destructuring, spread/rest, modules, template literals, and the features that define contemporary code.',
    storyText: 'The Modernist Guild hands you a gleaming toolkit: "Old scripts are heavy with ceremony. ES6 is elegant — arrows, destructuring, spreads. Write less, express more, and join the modern age."',
    type: 'learning', difficulty: 3, xpReward: 440,
    badgeReward: { name: 'ES6 Modernist', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fes6-1', description: 'Complete "Title Case Converter" coding challenge', objectiveType: 'coding', targetId: 'challenge-7', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/coding/challenge-7', redirectLabel: 'Start Challenge', objectiveTitle: 'String Methods', contentName: 'Title Case Converter' },
      { id: 'obj-fes6-2', description: 'Complete "Array Chunk Splitter" coding challenge', objectiveType: 'coding', targetId: 'challenge-5', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-5', redirectLabel: 'Start Challenge', objectiveTitle: 'Array Methods', contentName: 'Array Chunk Splitter' },
      { id: 'obj-fes6-3', description: 'Pass "JavaScript Core Concepts Quiz" with minimum 80%', objectiveType: 'quiz', targetId: 'js-core-concepts', minScore: 80, orderIndex: 3, isCompleted: false, redirectRoute: '/quiz-battle/js-core-concepts', redirectLabel: 'Take Quiz', objectiveTitle: 'JS Concepts Quiz', contentName: 'JavaScript Core Concepts' },
      { id: 'obj-fes6-4', description: 'Reach 1350 total XP', objectiveType: 'xp_requirement', targetCount: 1350, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-code-s-slash-line', estimatedMinutes: 100,
    completionHint: 'Solve 2 coding challenges, ace the JS quiz at 80%+, and reach 1350 XP.',
    chainId: 'frontend-path', chainPosition: 16, unlocksQuestIds: ['quest-frontend-datastructures'], requiresQuestIds: ['quest-frontend-dom-events'], rarity: 'epic',
    tags: ['javascript', 'es6', 'modern-js'],
  },
  {
    id: 'quest-frontend-datastructures', title: 'JavaScript Data Structures',
    description: 'Organize data with precision. Master arrays, objects, maps, sets, and the algorithmic thinking behind efficient data manipulation.',
    storyText: 'The Data Smith stands before an anvil of pure logic: "Raw data is ore. Arrays, maps, sets — these are your molds. Shape them well, and your applications will run swift and true."',
    type: 'learning', difficulty: 4, xpReward: 460,
    badgeReward: { name: 'Data Smith', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fds-1', description: 'Complete "Array Chunk Splitter" coding challenge', objectiveType: 'coding', targetId: 'challenge-5', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/coding/challenge-5', redirectLabel: 'Start Challenge', objectiveTitle: 'Array Manipulation', contentName: 'Array Chunk Splitter' },
      { id: 'obj-fds-2', description: 'Complete "Palindrome Checker" coding challenge', objectiveType: 'coding', targetId: 'challenge-3', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-3', redirectLabel: 'Start Challenge', objectiveTitle: 'Algorithm Challenge', contentName: 'Palindrome Checker' },
      { id: 'obj-fds-3', description: 'Reach 1460 total XP', objectiveType: 'xp_requirement', targetCount: 1460, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-node-tree', estimatedMinutes: 105,
    completionHint: 'Solve 2 data challenges and reach 1460 XP.',
    chainId: 'frontend-path', chainPosition: 17, unlocksQuestIds: ['quest-frontend-functional'], requiresQuestIds: ['quest-frontend-es6'], rarity: 'epic',
    tags: ['javascript', 'data-structures', 'algorithms'],
  },
  {
    id: 'quest-frontend-functional', title: 'Functional Programming in JS',
    description: 'Think in transformations. Master pure functions, immutability, higher-order functions, and the map/filter/reduce trio for cleaner, testable code.',
    storyText: 'The Functional Sage speaks in flowing chants: "Map transforms. Filter discerns. Reduce unifies. Compose small pure functions, and complex problems dissolve like mist."',
    type: 'learning', difficulty: 4, xpReward: 480,
    badgeReward: { name: 'Functional Sage', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-ffp-1', description: 'Complete "FizzBuzz Classic" coding challenge', objectiveType: 'coding', targetId: 'challenge-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/coding/challenge-1', redirectLabel: 'Start Challenge', objectiveTitle: 'Logic Challenge', contentName: 'FizzBuzz Classic' },
      { id: 'obj-ffp-2', description: 'Complete "Palindrome Checker" coding challenge', objectiveType: 'coding', targetId: 'challenge-3', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-3', redirectLabel: 'Start Challenge', objectiveTitle: 'Pure Logic', contentName: 'Palindrome Checker' },
      { id: 'obj-ffp-3', description: 'Reach 1580 total XP', objectiveType: 'xp_requirement', targetCount: 1580, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-function-line', estimatedMinutes: 105,
    completionHint: 'Apply functional thinking to 2 challenges and reach 1580 XP.',
    chainId: 'frontend-path', chainPosition: 18, unlocksQuestIds: ['quest-frontend-react-core'], requiresQuestIds: ['quest-frontend-datastructures'], rarity: 'epic',
    tags: ['javascript', 'functional', 'pure-functions'],
  },
  {
    id: 'quest-frontend-react-core', title: 'React Components Deep Dive',
    description: 'Return to the React Frontier with deeper intent. Master props, composition, reconciliation, and the component model that powers modern UIs.',
    storyText: 'The Component Crusaders welcome you back: "You have seen the surface of React. Now descend into the engine — how components compose, reconcile, and render with breathtaking efficiency."',
    type: 'learning', difficulty: 3, xpReward: 500,
    badgeReward: { name: 'Component Master', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-frc-1', description: 'Complete "Introduction to React" lesson', objectiveType: 'lesson', targetId: 'frontend-5', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-5', redirectLabel: 'Go to Lesson', objectiveTitle: 'React Components', contentName: 'Introduction to React' },
      { id: 'obj-frc-2', description: 'Pass "React Deep Dive Quiz" with minimum 75%', objectiveType: 'quiz', targetId: 'react-deep-dive', minScore: 75, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/react-deep-dive', redirectLabel: 'Take Quiz', objectiveTitle: 'React Deep Dive', contentName: 'React Deep Dive' },
      { id: 'obj-frc-3', description: 'Reach 1700 total XP', objectiveType: 'xp_requirement', targetCount: 1700, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-reactjs-line', estimatedMinutes: 95,
    completionHint: 'Study React components, pass the deep dive quiz at 75%+, and reach 1700 XP.',
    chainId: 'frontend-path', chainPosition: 19, unlocksQuestIds: ['quest-frontend-react-hooks'], requiresQuestIds: ['quest-frontend-functional'], rarity: 'epic',
    tags: ['react', 'components', 'composition'],
  },
  {
    id: 'quest-frontend-react-hooks', title: 'React Hooks Mastery',
    description: 'Harness the power of hooks. Master useState, useEffect, useRef, and custom hooks to manage state and side effects with elegance.',
    storyText: 'The Hook Keeper reveals a rack of glowing hooks: "Each hook binds a piece of the component to a piece of logic. Master them, and your components shall hold state, react to time, and reach into the raw DOM."',
    type: 'learning', difficulty: 4, xpReward: 520,
    badgeReward: { name: 'Hook Keeper', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-frh-1', description: 'Complete "Introduction to React" lesson', objectiveType: 'lesson', targetId: 'frontend-5', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-5', redirectLabel: 'Go to Lesson', objectiveTitle: 'Hooks & State', contentName: 'Introduction to React' },
      { id: 'obj-frh-2', description: 'Complete "Build a Todo Input" coding challenge', objectiveType: 'coding', targetId: 'challenge-6', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-6', redirectLabel: 'Start Challenge', objectiveTitle: 'Stateful Component', contentName: 'Build a Todo Input' },
      { id: 'obj-frh-3', description: 'Reach 1830 total XP', objectiveType: 'xp_requirement', targetCount: 1830, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-anchor-line', estimatedMinutes: 100,
    completionHint: 'Master React hooks, build the todo input, and reach 1830 XP.',
    chainId: 'frontend-path', chainPosition: 20, unlocksQuestIds: ['quest-frontend-react-patterns'], requiresQuestIds: ['quest-frontend-react-core'], rarity: 'epic',
    tags: ['react', 'hooks', 'state'],
  },
  {
    id: 'quest-frontend-react-patterns', title: 'React Component Patterns',
    description: 'Architect scalable React. Master compound components, render props, higher-order components, and context for maintainable, reusable codebases.',
    storyText: 'The Pattern Architect lays out architectural blueprints: "Anyone can build one component. Masters build systems of components that compose, share state, and scale across entire empires of code."',
    type: 'learning', difficulty: 4, xpReward: 540,
    badgeReward: { name: 'Pattern Architect', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-frp-1', description: 'Pass "React Deep Dive Quiz" with minimum 85%', objectiveType: 'quiz', targetId: 'react-deep-dive', minScore: 85, orderIndex: 1, isCompleted: false, redirectRoute: '/quiz-battle/react-deep-dive', redirectLabel: 'Take Quiz', objectiveTitle: 'React Mastery Quiz', contentName: 'React Deep Dive' },
      { id: 'obj-frp-2', description: 'Complete "Build a Todo Input" coding challenge', objectiveType: 'coding', targetId: 'challenge-6', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-6', redirectLabel: 'Start Challenge', objectiveTitle: 'Reusable Component', contentName: 'Build a Todo Input' },
      { id: 'obj-frp-3', description: 'Reach 1970 total XP', objectiveType: 'xp_requirement', targetCount: 1970, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-apps-line', estimatedMinutes: 110,
    completionHint: 'Ace the React quiz at 85%+, rebuild the todo component, and reach 1970 XP.',
    chainId: 'frontend-path', chainPosition: 21, unlocksQuestIds: ['quest-frontend-performance'], requiresQuestIds: ['quest-frontend-react-hooks'], rarity: 'epic',
    tags: ['react', 'patterns', 'architecture'],
  },
  {
    id: 'quest-frontend-performance', title: 'Frontend Performance Optimization',
    description: 'Make it fly. Master code splitting, lazy loading, memoization, and rendering optimization to deliver buttery-smooth experiences.',
    storyText: 'The Speed Sage stops a frame mid-flight: "A slow page is a broken promise. Every millisecond is a battle. Optimize rendering, split your bundles, and your interfaces shall glide at sixty frames per second."',
    type: 'learning', difficulty: 4, xpReward: 560,
    badgeReward: { name: 'Speed Sage', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-fpf-1', description: 'Complete "Introduction to React" lesson', objectiveType: 'lesson', targetId: 'frontend-5', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-5', redirectLabel: 'Go to Lesson', objectiveTitle: 'Rendering Basics', contentName: 'Introduction to React' },
      { id: 'obj-fpf-2', description: 'Complete "Responsive Profile Card" coding challenge', objectiveType: 'coding', targetId: 'challenge-8', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-8', redirectLabel: 'Start Challenge', objectiveTitle: 'Optimized UI', contentName: 'Responsive Profile Card' },
      { id: 'obj-fpf-3', description: 'Maintain a 7-day login streak', objectiveType: 'streak_requirement', targetCount: 7, orderIndex: 3, isCompleted: false },
      { id: 'obj-fpf-4', description: 'Reach 2120 total XP', objectiveType: 'xp_requirement', targetCount: 2120, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-speed-up-line', estimatedMinutes: 115,
    completionHint: 'Study rendering, build the optimized card, hold a 7-day streak, and reach 2120 XP.',
    chainId: 'frontend-path', chainPosition: 22, unlocksQuestIds: ['quest-frontend-testing'], requiresQuestIds: ['quest-frontend-react-patterns'], rarity: 'epic',
    tags: ['performance', 'optimization', 'code-splitting'],
  },
  {
    id: 'quest-frontend-testing', title: 'Testing & Debugging Frontend',
    description: 'Build with confidence. Master debugging tools, unit testing, and a testing mindset that catches bugs before your users ever see them.',
    storyText: 'The Bug Hunter sharpens a blade made of assertions: "Bugs lurk in the shadows of every feature. Debug with the dev tools, write tests that guard your logic, and ship without fear."',
    type: 'learning', difficulty: 4, xpReward: 580,
    badgeReward: { name: 'Bug Hunter', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-ftg-1', description: 'Complete "JavaScript Basics" lesson', objectiveType: 'lesson', targetId: 'frontend-3', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-3', redirectLabel: 'Go to Lesson', objectiveTitle: 'Debugging Logic', contentName: 'JavaScript Basics' },
      { id: 'obj-ftg-2', description: 'Complete "DOM Counter App" coding challenge', objectiveType: 'coding', targetId: 'challenge-2', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-2', redirectLabel: 'Start Challenge', objectiveTitle: 'Testable App', contentName: 'DOM Counter App' },
      { id: 'obj-ftg-3', description: 'Reach 2280 total XP', objectiveType: 'xp_requirement', targetCount: 2280, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-bug-line', estimatedMinutes: 110,
    completionHint: 'Master debugging, build a testable counter app, and reach 2280 XP.',
    chainId: 'frontend-path', chainPosition: 23, unlocksQuestIds: ['quest-frontend-tooling'], requiresQuestIds: ['quest-frontend-performance'], rarity: 'epic',
    tags: ['testing', 'debugging', 'quality'],
  },
  {
    id: 'quest-frontend-tooling', title: 'Build Tooling & Modern Workflow',
    description: 'Master the modern frontend toolchain. Bundlers, dev servers, package managers, and CI workflows that power professional development.',
    storyText: 'The Forge of Builds rumbles with mechanical precision: "Great code is nothing without the tools that shape it. Bundlers compress, dev servers hot-reload, pipelines deploy. Master the workflow, and ship like a professional."',
    type: 'learning', difficulty: 4, xpReward: 620,
    badgeReward: { name: 'Workflow Master', rarity: 'Epic' },
    category: 'frontend', categoryName: 'Frontend Developer', region: 'frontend-kingdom',
    objectives: [
      { id: 'obj-ftw-1', description: 'Complete "Introduction to React" lesson', objectiveType: 'lesson', targetId: 'frontend-5', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-5', redirectLabel: 'Go to Lesson', objectiveTitle: 'Modern React Setup', contentName: 'Introduction to React' },
      { id: 'obj-ftw-2', description: 'Complete "CSS Flexbox Card Grid" coding challenge', objectiveType: 'coding', targetId: 'challenge-4', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/coding/challenge-4', redirectLabel: 'Start Challenge', objectiveTitle: 'Build Output', contentName: 'CSS Flexbox Card Grid' },
      { id: 'obj-ftw-3', description: 'Maintain a 10-day login streak', objectiveType: 'streak_requirement', targetCount: 10, orderIndex: 3, isCompleted: false },
      { id: 'obj-ftw-4', description: 'Reach 2450 total XP', objectiveType: 'xp_requirement', targetCount: 2450, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-terminal-box-line', estimatedMinutes: 120,
    completionHint: 'Master the modern toolchain, build the grid, hold a 10-day streak, and reach 2450 XP.',
    chainId: 'frontend-path', chainPosition: 24, unlocksQuestIds: ['quest-frontend-boss'], requiresQuestIds: ['quest-frontend-testing'], rarity: 'epic',
    tags: ['tooling', 'bundlers', 'workflow'],
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE SERVER CITADEL (7 quests)                  ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-server-awakening', title: 'Server Awakening: Echoes of the Backend',
    description: 'The server realm calls from beneath the surface web. Learn server-side programming fundamentals and awaken your backend potential.',
    storyText: 'Deep beneath the surface web lies the Server Underworld. As you descend into the citadel, the first runes glow: HTTP methods, status codes, and the sacred request-response cycle.',
    type: 'learning', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'Server Apprentice', rarity: 'Rare' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-sa-1', description: 'Complete "Server-side Programming 101" lesson', objectiveType: 'lesson', targetId: 'backend-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/backend-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-sa-2', description: 'Reach 250 total XP', objectiveType: 'xp', targetCount: 250, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-server-line', estimatedMinutes: 55,
    completionHint: 'Complete the Server-side Programming lesson and reach 250 XP.',
    chainId: 'backend-path', chainPosition: 1, unlocksQuestIds: ['quest-api-crafting'], requiresQuestIds: [], rarity: 'common',
  },
  {
    id: 'quest-api-crafting', title: 'API Crafting: The Sacred Endpoints',
    description: 'Learn the sacred art of REST API design. Craft elegant endpoints that serve data with precision and grace.',
    storyText: 'In the Hall of Endpoints, API runes line the walls: GET, POST, PUT, DELETE. The Endpoint Scribes teach that a well-crafted API is poetry. Craft your first RESTful service.',
    type: 'learning', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'API Crafter', rarity: 'Rare' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-ac-1', description: 'Complete "REST API Design" lesson', objectiveType: 'lesson', targetId: 'backend-2', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/backend-2', redirectLabel: 'Go to Lesson' },
      { id: 'obj-ac-2', description: 'Pass "HTTP & API Battle" with minimum 60%', objectiveType: 'quiz', targetId: 'http-api-battle', minScore: 60, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/http-api-battle', redirectLabel: 'Enter Battle', objectiveTitle: 'HTTP & API Battle', contentName: 'HTTP & API Battle' },
      { id: 'obj-ac-3', description: 'Reach 400 total XP', objectiveType: 'xp', targetCount: 400, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-terminal-box-line', estimatedMinutes: 65,
    completionHint: 'Complete the REST API Design lesson and reach 400 XP.',
    chainId: 'backend-path', chainPosition: 2, unlocksQuestIds: ['quest-nodejs-journeyman'], requiresQuestIds: ['quest-server-awakening'], rarity: 'rare',
  },
  {
    id: 'quest-nodejs-journeyman', title: 'Node.js Journeyman: The Async Depths',
    description: 'Dive deeper into the Server Citadel. Master Node.js, asynchronous programming, and the event loop that powers modern backends.',
    storyText: 'The Async Depths are a labyrinth of callbacks, promises, and event loops. The Journeyman Guild teaches that true mastery comes from understanding the event loop — the heartbeat of every server.',
    type: 'learning', difficulty: 3, xpReward: 300,
    badgeReward: { name: 'Node.js Adept', rarity: 'Epic' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-nj-1', description: 'Complete 1 lesson from the Database category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-nj-2', description: 'Complete 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 2, isCompleted: false },
      { id: 'obj-nj-3', description: 'Maintain a 5-day streak', objectiveType: 'streak', targetCount: 5, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-nodejs-line', estimatedMinutes: 90,
    completionHint: 'Cross-train in databases, solve a coding challenge, and keep a 5-day streak.',
    chainId: 'backend-path', chainPosition: 3, unlocksQuestIds: ['quest-middleware-auth'], requiresQuestIds: ['quest-api-crafting'], rarity: 'epic',
  },
  {
    id: 'quest-middleware-auth', title: 'Middleware & Auth: The Guardian Spells',
    description: 'Master the middleware chain and authentication systems. Protect your APIs with JWT, OAuth, and session management.',
    storyText: 'The Guardian Spells are the oldest incantations in the Citadel. Middleware chains form barriers around your APIs. JWT tokens, OAuth flows, session cookies — only the worthy may pass.',
    type: 'learning', difficulty: 3, xpReward: 300,
    badgeReward: { name: 'Guardian Caster', rarity: 'Epic' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-ma-1', description: 'Complete 2 lessons from any region', objectiveType: 'lesson', minScore: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-ma-2', description: 'Reach 600 total XP', objectiveType: 'xp', targetCount: 600, orderIndex: 2, isCompleted: false },
      { id: 'obj-ma-3', description: 'Maintain a 7-day streak', objectiveType: 'streak', targetCount: 7, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-shield-keyhole-line', estimatedMinutes: 100,
    completionHint: 'Complete 2 more lessons, reach 600 XP, and maintain a 7-day streak.',
    chainId: 'backend-path', chainPosition: 4, unlocksQuestIds: ['quest-backend-boss'], requiresQuestIds: ['quest-nodejs-journeyman'], rarity: 'epic',
  },
  {
    id: 'quest-backend-boss', title: 'Boss: The API Archmage',
    description: 'Design and build a complete REST API system with authentication, error handling, and database integration.',
    storyText: 'The Archmage of APIs declares: "Craft an API worthy of the ancient scrolls — with authentication, error handling, data persistence, and documentation. Show me what you have learned."',
    type: 'boss', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'API Archmage', rarity: 'Epic' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-bb-1', description: 'Submit "Build a REST API" boss quest', objectiveType: 'boss', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-api-dashboard', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-bb-2', description: 'Reach 800 total XP', objectiveType: 'xp', targetCount: 800, orderIndex: 2, isCompleted: false },
      { id: 'obj-bb-3', description: 'Complete 1 lesson from the Cybersecurity category', objectiveType: 'lesson', targetCount: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-cloud-line', estimatedMinutes: 200,
    completionHint: 'Submit the backend boss quest, reach 800 XP, and learn some cybersecurity.',
    chainId: 'backend-path', chainPosition: 5, unlocksQuestIds: ['quest-microservices-mastery'], requiresQuestIds: ['quest-middleware-auth'], rarity: 'epic',
  },
  {
    id: 'quest-microservices-mastery', title: 'Microservices Mastery: The Shattered Monolith',
    description: 'Break the monolith. Learn microservices architecture, container orchestration, and distributed systems design.',
    storyText: 'The ancient Monolith stood as a single structure — powerful but brittle. The Shattering broke it into microservices: independent, scalable, resilient. Now orchestrate these pieces like a cosmic conductor.',
    type: 'learning', difficulty: 4, xpReward: 400,
    badgeReward: { name: 'Service Orchestrator', rarity: 'Epic' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-mm-1', description: 'Complete at least 2 lessons from regions outside the Citadel', objectiveType: 'lesson', targetCount: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-mm-2', description: 'Reach 1200 total XP', objectiveType: 'xp', targetCount: 1200, orderIndex: 2, isCompleted: false },
      { id: 'obj-mm-3', description: 'Submit 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-git-branch-line', estimatedMinutes: 140,
    completionHint: 'Explore 2+ other regions, reach 1200 XP, and solve a coding challenge.',
    chainId: 'backend-path', chainPosition: 6, unlocksQuestIds: ['quest-legendary-backend'], requiresQuestIds: ['quest-backend-boss'], rarity: 'epic',
  },
  {
    id: 'quest-legendary-backend', title: 'Legendary: The Infinite Server',
    description: 'Beyond the API Archmage lies true enlightenment. Design a backend system that scales to infinity and never fails.',
    storyText: 'The Infinite Server exists outside normal space — where requests process at the speed of thought. Having proven yourself an Archmage, attempt the impossible: design a system that could run forever.',
    type: 'legendary', difficulty: 5, xpReward: 1000,
    badgeReward: { name: 'Infinite Architect', rarity: 'Legendary' },
    category: 'backend', categoryName: 'Backend Developer', region: 'server-citadel',
    objectives: [
      { id: 'obj-lb-1', description: 'Complete all Server Citadel quests before this one', objectiveType: 'lesson', minScore: 5, orderIndex: 1, isCompleted: false },
      { id: 'obj-lb-2', description: 'Reach 1500 total XP', objectiveType: 'xp', targetCount: 1500, orderIndex: 2, isCompleted: false },
      { id: 'obj-lb-3', description: 'Submit "Advanced Backend System" boss quest', objectiveType: 'boss', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-infinite-server', redirectLabel: 'Go to Boss Quest' },
    ],
    isActive: true, icon: 'ri-global-line', estimatedMinutes: 480,
    completionHint: 'Complete all Citadel quests, reach 1500 XP, and submit the legendary backend project.',
    chainId: 'backend-path', chainPosition: 7, unlocksQuestIds: [], requiresQuestIds: ['quest-microservices-mastery'], isHidden: true, hiddenCondition: 'Complete Microservices Mastery', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE DATA VAULT (7 quests)                      ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-sql-apprentice', title: 'SQL Apprentice: The Ancient Tongue',
    description: 'Enter the sacred vault of data. Learn SQL — the language that has commanded databases for decades.',
    storyText: 'The Vault doors creak open. The Oracle of SELECT speaks: "Before you can guard knowledge, you must learn to speak with it. SQL is the ancient tongue — learn to SELECT, INSERT, UPDATE, and DELETE."',
    type: 'learning', difficulty: 1, xpReward: 100,
    badgeReward: { name: 'SQL Apprentice', rarity: 'Common' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-sp-1', description: 'Complete "Introduction to Databases" lesson', objectiveType: 'lesson', targetId: 'database-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/database-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-sp-2', description: 'Reach 100 total XP', objectiveType: 'xp', targetCount: 100, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-code-s-slash-line', estimatedMinutes: 40,
    completionHint: 'Complete the Databases lesson and reach 100 XP.',
    chainId: 'database-path', chainPosition: 1, unlocksQuestIds: ['quest-database-keeper'], requiresQuestIds: [], rarity: 'common',
  },
  {
    id: 'quest-database-keeper', title: 'Keeper of the Database: Normalization Rituals',
    description: 'Deepen your connection to the data realm. Master database normalization — 1NF, 2NF, 3NF — and organize information with sacred precision.',
    storyText: 'The Keepers perform daily rituals of normalization. First Normal Form strips repeating groups. Second removes partial dependencies. Third eliminates transitive dependencies. Each ritual brings data closer to perfection.',
    type: 'learning', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'Data Keeper', rarity: 'Rare' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-dk-1', description: 'Complete 1 additional lesson from any category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-dk-2', description: 'Reach 300 total XP', objectiveType: 'xp', targetCount: 300, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-database-2-line', estimatedMinutes: 55,
    completionHint: 'Expand your knowledge with another lesson and reach 300 XP.',
    chainId: 'database-path', chainPosition: 2, unlocksQuestIds: ['quest-query-master'], requiresQuestIds: ['quest-sql-apprentice'], rarity: 'rare',
  },
  {
    id: 'quest-query-master', title: 'Query Master: The Sacred JOINs',
    description: 'Ascend to Query Master rank. Wield complex JOINs, subqueries, and aggregations like a true data warrior.',
    storyText: 'The Sacred JOINs are the most powerful incantations. INNER JOIN brings harmony, LEFT JOIN shows compassion. Master GROUP BY, HAVING, and window functions, and no question shall remain unanswered.',
    type: 'learning', difficulty: 3, xpReward: 250,
    badgeReward: { name: 'Query Master', rarity: 'Epic' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-qm-1', description: 'Complete 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-qm-2', description: 'Maintain a 5-day streak', objectiveType: 'streak', targetCount: 5, orderIndex: 2, isCompleted: false },
      { id: 'obj-qm-3', description: 'Reach 500 total XP', objectiveType: 'xp', targetCount: 500, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-search-line', estimatedMinutes: 80,
    completionHint: 'Solve a coding challenge, keep a 5-day streak, and reach 500 XP.',
    chainId: 'database-path', chainPosition: 3, unlocksQuestIds: ['quest-data-modeling'], requiresQuestIds: ['quest-database-keeper'], rarity: 'epic',
  },
  {
    id: 'quest-data-modeling', title: 'Data Modeling: Architect of Truth',
    description: 'Learn to design database schemas that reflect reality. Master entity-relationship modeling and schema architecture.',
    storyText: 'The Architects of Truth shape reality through data models. Every entity, relationship, and constraint tells a story. Learn to model complex domains with elegance, and your schemas shall outlive their applications.',
    type: 'learning', difficulty: 3, xpReward: 300,
    badgeReward: { name: 'Schema Architect', rarity: 'Epic' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-dm-1', description: 'Complete 1 lesson from the Backend category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-dm-2', description: 'Pass "SQL Indexing & Schema Battle" with minimum 60%', objectiveType: 'quiz', targetId: 'sql-indexing-battle', minScore: 60, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/sql-indexing-battle', redirectLabel: 'Enter Battle', objectiveTitle: 'SQL Indexing & Schema Battle', contentName: 'SQL Indexing & Schema Battle' },
      { id: 'obj-dm-3', description: 'Reach 700 total XP', objectiveType: 'xp', targetCount: 700, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-pencil-ruler-2-line', estimatedMinutes: 100,
    completionHint: 'Learn backend concepts, ace a quiz battle, and reach 700 XP.',
    chainId: 'database-path', chainPosition: 4, unlocksQuestIds: ['quest-database-boss'], requiresQuestIds: ['quest-query-master'], rarity: 'epic',
  },
  {
    id: 'quest-database-boss', title: 'Boss: The Data Architect',
    description: 'Design a complete database schema for a real application. Prove mastery of normalization, indexing, and query optimization.',
    storyText: 'The Grand Architect challenges all who enter the inner Vault. Design a schema balancing normalization with performance, create blazing indexes, and write procedures for complex business logic.',
    type: 'boss', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'Data Architect', rarity: 'Epic' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-db-1', description: 'Submit "Database Design Challenge" boss quest', objectiveType: 'boss', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-database-design', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-db-2', description: 'Reach 900 total XP', objectiveType: 'xp', targetCount: 900, orderIndex: 2, isCompleted: false },
      { id: 'obj-db-3', description: 'Complete 1 lesson from the Full Stack category', objectiveType: 'lesson', targetCount: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-archive-line', estimatedMinutes: 200,
    completionHint: 'Submit the database boss quest, reach 900 XP, and touch the Full Stack realm.',
    chainId: 'database-path', chainPosition: 5, unlocksQuestIds: ['quest-performance-tuning'], requiresQuestIds: ['quest-data-modeling'], rarity: 'epic',
  },
  {
    id: 'quest-performance-tuning', title: 'Performance Tuning: The Speed Enchantment',
    description: 'Master the dark art of database performance. Query optimization, execution plans, caching — make your databases fly.',
    storyText: 'The Speed Enchanters work their magic in the deepest chamber. A query taking seconds becomes milliseconds with the right index. Caching runes make databases seem prescient.',
    type: 'learning', difficulty: 4, xpReward: 400,
    badgeReward: { name: 'Speed Enchanter', rarity: 'Epic' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-pt-1', description: 'Complete 2 lessons from any region', objectiveType: 'lesson', minScore: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-pt-2', description: 'Reach 1200 total XP', objectiveType: 'xp', targetCount: 1200, orderIndex: 2, isCompleted: false },
      { id: 'obj-pt-3', description: 'Maintain a 10-day streak', objectiveType: 'streak', targetCount: 10, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-speed-up-line', estimatedMinutes: 130,
    completionHint: 'Complete 2 more lessons, reach 1200 XP, and hold a 10-day streak.',
    chainId: 'database-path', chainPosition: 6, unlocksQuestIds: ['quest-legendary-data-vault'], requiresQuestIds: ['quest-database-boss'], rarity: 'epic',
  },
  {
    id: 'quest-legendary-data-vault', title: 'Legendary: Data Vault Guardian',
    description: 'The ultimate data challenge. Design a distributed, high-availability database architecture worthy of legend.',
    storyText: 'The deepest vault has never been opened. Its lock requires a key forged from every database discipline. Those who craft this key become Data Vault Guardians — protectors of the most precious resource: truth.',
    type: 'legendary', difficulty: 5, xpReward: 1000,
    badgeReward: { name: 'Data Vault Guardian', rarity: 'Legendary' },
    category: 'database', categoryName: 'Database Administrator', region: 'data-vault',
    objectives: [
      { id: 'obj-lg-1', description: 'Complete all Data Vault quests before this one', objectiveType: 'lesson', minScore: 5, orderIndex: 1, isCompleted: false },
      { id: 'obj-lg-2', description: 'Reach 1500 total XP', objectiveType: 'xp', targetCount: 1500, orderIndex: 2, isCompleted: false },
      { id: 'obj-lg-3', description: 'Submit "Distributed Database Design" boss quest', objectiveType: 'boss', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-data-vault-guardian', redirectLabel: 'Go to Boss Quest' },
    ],
    isActive: true, icon: 'ri-shield-star-line', estimatedMinutes: 480,
    completionHint: 'Conquer all Vault quests, reach 1500 XP, and submit the legendary database architecture.',
    chainId: 'database-path', chainPosition: 7, unlocksQuestIds: [], requiresQuestIds: ['quest-performance-tuning'], isHidden: true, hiddenCondition: 'Complete Performance Tuning', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE CYBER FORTRESS (7 quests)                  ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-security-initiate', title: "Security Initiation: The Shadow's Edge",
    description: 'The shadows of cyberspace hold many dangers. Learn cybersecurity fundamentals and take your first step into the Fortress.',
    storyText: 'The Cyber Fortress looms on the horizon. The first lesson echoes through the halls: "Every input is hostile. Every user is unverified. Trust nothing, verify everything."',
    type: 'learning', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'Cyber Initiate', rarity: 'Rare' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-si-1', description: 'Complete "Cybersecurity Fundamentals" lesson', objectiveType: 'lesson', targetId: 'cybersec-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/cybersec-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-si-2', description: 'Pass "Cybersecurity Basics" quiz with minimum 70%', objectiveType: 'quiz', targetId: 'cybersecurity-basics', minScore: 70, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/cybersecurity-basics', redirectLabel: 'Take Quiz', objectiveTitle: 'Cybersecurity Basics Quiz', contentName: 'Cybersecurity Basics' },
      { id: 'obj-si-3', description: 'Maintain a 2-day login streak', objectiveType: 'streak', targetCount: 2, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-shield-check-line', estimatedMinutes: 50,
    completionHint: 'Complete the Cybersecurity lesson and maintain a 2-day streak.',
    chainId: 'cyber-path', chainPosition: 1, unlocksQuestIds: ['quest-owasp-top10'], requiresQuestIds: [], rarity: 'common',
  },
  {
    id: 'quest-owasp-top10', title: 'OWASP Top 10: The Sacred Vulnerabilities',
    description: 'Study the sacred texts of web security. Master the OWASP Top 10 and learn to defend against the most dangerous threats.',
    storyText: 'The OWASP Scrolls list ten sacred vulnerabilities. Injection attacks corrupt databases. XSS turns browsers into weapons. CSRF tricks users into betrayal. Learn to build defenses worthy of ancient fortresses.',
    type: 'learning', difficulty: 2, xpReward: 250,
    badgeReward: { name: 'OWASP Guardian', rarity: 'Rare' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-ow-1', description: 'Complete 1 lesson from the Backend category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-ow-2', description: 'Pass "Security Siege Battle" with minimum 60%', objectiveType: 'quiz', targetId: 'security-siege-battle', minScore: 60, orderIndex: 2, isCompleted: false, redirectRoute: '/quiz-battle/security-siege-battle', redirectLabel: 'Enter Battle', objectiveTitle: 'Security Siege Battle', contentName: 'Security Siege Battle' },
      { id: 'obj-ow-3', description: 'Reach 350 total XP', objectiveType: 'xp', targetCount: 350, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-shield-flash-line', estimatedMinutes: 60,
    completionHint: 'Learn backend fundamentals and reach 350 XP.',
    chainId: 'cyber-path', chainPosition: 2, unlocksQuestIds: ['quest-network-defense'], requiresQuestIds: ['quest-security-initiate'], rarity: 'rare',
  },
  {
    id: 'quest-network-defense', title: 'Network Defense: The Perimeter Watch',
    description: 'Guard the digital perimeter. Master network security, firewalls, and intrusion detection.',
    storyText: 'The Watchtowers scan the digital horizon. Firewalls stand as the first line, IDS systems detect intrusion traces, VPNs create secure tunnels through hostile territory. The Perimeter Watch never sleeps.',
    type: 'learning', difficulty: 3, xpReward: 300,
    badgeReward: { name: 'Network Defender', rarity: 'Epic' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-nd-1', description: 'Complete 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-nd-2', description: 'Reach 550 total XP', objectiveType: 'xp', targetCount: 550, orderIndex: 2, isCompleted: false },
      { id: 'obj-nd-3', description: 'Maintain a 5-day streak', objectiveType: 'streak', targetCount: 5, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-radar-line', estimatedMinutes: 85,
    completionHint: 'Solve a coding challenge, reach 550 XP, and maintain a 5-day streak.',
    chainId: 'cyber-path', chainPosition: 3, unlocksQuestIds: ['quest-pen-testing'], requiresQuestIds: ['quest-owasp-top10'], rarity: 'epic',
  },
  {
    id: 'quest-pen-testing', title: 'Penetration Testing: The Shadow Arts',
    description: 'Enter the shadow realm of ethical hacking. Learn penetration testing methodologies and think like an attacker.',
    storyText: 'The Shadow Arts are taught in the darkest chambers. Guardians learn to think like attackers — probing weaknesses, exploiting vulnerabilities, breaching defenses — all in the name of protection.',
    type: 'learning', difficulty: 4, xpReward: 350,
    badgeReward: { name: 'Shadow Tester', rarity: 'Epic' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-pt-cyber-1', description: 'Complete 1 quiz battle', objectiveType: 'quiz', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-pt-cyber-2', description: 'Reach 750 total XP', objectiveType: 'xp', targetCount: 750, orderIndex: 2, isCompleted: false },
      { id: 'obj-pt-cyber-3', description: 'Complete 2 lessons from any region', objectiveType: 'lesson', minScore: 2, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-spy-line', estimatedMinutes: 100,
    completionHint: 'Ace a quiz battle, reach 750 XP, and complete 2 more lessons.',
    chainId: 'cyber-path', chainPosition: 4, unlocksQuestIds: ['quest-cybersec-boss'], requiresQuestIds: ['quest-network-defense'], rarity: 'epic',
  },
  {
    id: 'quest-cybersec-boss', title: 'Boss: The Shadow Defender',
    description: 'Conduct a comprehensive security audit. Identify vulnerabilities, implement fixes, and become the guardian the digital world needs.',
    storyText: 'The Shadow Lords have breached the outer walls. You must audit the fortress, identify every vulnerability, and patch them before the next assault. The Guardian Council awaits your report.',
    type: 'boss', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'Shadow Defender', rarity: 'Epic' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-cb-1', description: 'Submit "Security Audit" boss quest', objectiveType: 'boss', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-security-audit', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-cb-2', description: 'Reach 950 total XP', objectiveType: 'xp', targetCount: 950, orderIndex: 2, isCompleted: false },
      { id: 'obj-cb-3', description: 'Maintain a 7-day streak', objectiveType: 'streak', targetCount: 7, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-shield-flash-line', estimatedMinutes: 200,
    completionHint: 'Submit the security boss quest, reach 950 XP, and keep a 7-day streak.',
    chainId: 'cyber-path', chainPosition: 5, unlocksQuestIds: ['quest-security-architecture'], requiresQuestIds: ['quest-pen-testing'], rarity: 'epic',
  },
  {
    id: 'quest-security-architecture', title: 'Security Architecture: The Fortress Blueprint',
    description: 'Design security at the system level. Architect defense-in-depth strategies across every layer of the stack.',
    storyText: 'The Fortress Architects design systems where vulnerabilities cannot exist. Defense-in-depth: network, application, data, identity. Zero-trust: nobody trusted by default. Think holistically.',
    type: 'learning', difficulty: 4, xpReward: 400,
    badgeReward: { name: 'Security Architect', rarity: 'Epic' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-sa-arch-1', description: 'Complete 2 lessons from the Networking Nexus', objectiveType: 'lesson', targetCount: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-sa-arch-2', description: 'Reach 1300 total XP', objectiveType: 'xp', targetCount: 1300, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-building-2-line', estimatedMinutes: 140,
    completionHint: 'Master networking concepts and reach 1300 XP.',
    chainId: 'cyber-path', chainPosition: 6, unlocksQuestIds: ['quest-legendary-digital-guardian'], requiresQuestIds: ['quest-cybersec-boss'], rarity: 'epic',
  },
  {
    id: 'quest-legendary-digital-guardian', title: 'Legendary: The Digital Guardian',
    description: 'The ultimate security challenge. Design a complete security framework worthy of the Cyber Fortress legends.',
    storyText: 'The Digital Guardians are legend — warriors who defended against threats that would make ordinary defenders flee. Now you are called to join their ranks. Design a security framework for generations.',
    type: 'legendary', difficulty: 5, xpReward: 1000,
    badgeReward: { name: 'Digital Guardian', rarity: 'Legendary' },
    category: 'cybersecurity', categoryName: 'Cybersecurity', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-dg-1', description: 'Complete all Cyber Fortress quests before this one', objectiveType: 'lesson', minScore: 5, orderIndex: 1, isCompleted: false },
      { id: 'obj-dg-2', description: 'Reach 1600 total XP', objectiveType: 'xp', targetCount: 1600, orderIndex: 2, isCompleted: false },
      { id: 'obj-dg-3', description: 'Submit "Security Framework Design" boss quest', objectiveType: 'boss', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-digital-guardian', redirectLabel: 'Go to Boss Quest' },
    ],
    isActive: true, icon: 'ri-shield-user-line', estimatedMinutes: 480,
    completionHint: 'Conquer all Fortress quests, reach 1600 XP, and submit the legendary security design.',
    chainId: 'cyber-path', chainPosition: 7, unlocksQuestIds: [], requiresQuestIds: ['quest-security-architecture'], isHidden: true, hiddenCondition: 'Complete Security Architecture', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE NETWORKING NEXUS (4 quests)                ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-networking-101', title: 'Networking 101: The Digital Crossroads',
    description: 'Enter the Nexus — where all digital traffic flows. Master networking fundamentals: protocols, IP addressing, and the OSI model.',
    storyText: 'The Networking Nexus is the crossroads of the digital world. TCP and UDP are twin deities of transport. DNS is the great translator. The ancient OSI scrolls map the seven layers.',
    type: 'learning', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'Network Novice', rarity: 'Rare' },
    category: 'networking', categoryName: 'Networking & DevOps', region: 'networking-nexus',
    objectives: [
      { id: 'obj-nn-1', description: 'Complete 1 lesson from the Backend category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-nn-2', description: 'Reach 300 total XP', objectiveType: 'xp', targetCount: 300, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-global-line', estimatedMinutes: 55,
    completionHint: 'Learn backend concepts and reach 300 XP.',
    chainId: 'networking-path', chainPosition: 1, unlocksQuestIds: ['quest-cloud-deployment'], requiresQuestIds: [], rarity: 'rare',
  },
  {
    id: 'quest-cloud-deployment', title: 'Cloud Deployment: The Sky Citadels',
    description: 'Ascend to the cloud. Learn deployment strategies, CI/CD pipelines, and launch applications into the digital stratosphere.',
    storyText: 'The Sky Citadels float above — AWS, Azure, GCP — each a fortress of computing power. CI/CD pipelines are automated supply lines. Command the clouds.',
    type: 'learning', difficulty: 3, xpReward: 300,
    badgeReward: { name: 'Cloud Deployer', rarity: 'Epic' },
    category: 'networking', categoryName: 'Networking & DevOps', region: 'networking-nexus',
    objectives: [
      { id: 'obj-cd-1', description: 'Complete 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-cd-2', description: 'Reach 550 total XP', objectiveType: 'xp', targetCount: 550, orderIndex: 2, isCompleted: false },
      { id: 'obj-cd-3', description: 'Maintain a 5-day streak', objectiveType: 'streak', targetCount: 5, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-cloud-line', estimatedMinutes: 85,
    completionHint: 'Solve a coding challenge, reach 550 XP, and maintain a 5-day streak.',
    chainId: 'networking-path', chainPosition: 2, unlocksQuestIds: ['quest-devops-essentials'], requiresQuestIds: ['quest-networking-101'], rarity: 'epic',
  },
  {
    id: 'quest-devops-essentials', title: 'DevOps Essentials: The Bridge Between Worlds',
    description: 'Master the sacred DevOps practices. Docker containers, orchestration, monitoring — bridge dev and ops.',
    storyText: 'In ancient times, Dev and Ops lived in separate realms. Then came DevOps — the unification. Docker containers, Kubernetes orchestration, monitoring systems. Bridge these worlds.',
    type: 'learning', difficulty: 3, xpReward: 350,
    badgeReward: { name: 'DevOps Engineer', rarity: 'Epic' },
    category: 'networking', categoryName: 'Networking & DevOps', region: 'networking-nexus',
    objectives: [
      { id: 'obj-de-1', description: 'Complete 2 lessons from any 2 different regions', objectiveType: 'lesson', targetCount: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-de-2', description: 'Reach 750 total XP', objectiveType: 'xp', targetCount: 750, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-tools-line', estimatedMinutes: 90,
    completionHint: 'Explore 2 different regions and reach 750 XP.',
    chainId: 'networking-path', chainPosition: 3, unlocksQuestIds: ['quest-networking-boss'], requiresQuestIds: ['quest-cloud-deployment'], rarity: 'epic',
  },
  {
    id: 'quest-networking-boss', title: 'Boss: The Nexus Guardian',
    description: 'Orchestrate a complete cloud deployment with CI/CD, monitoring, and auto-scaling. Command the digital infrastructure.',
    storyText: 'The Nexus Guardian controls the flow of all traffic. Deploy a complete infrastructure: containers orchestrated, pipelines flowing, monitors watching, auto-scaling responding to digital tides.',
    type: 'boss', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'Nexus Guardian', rarity: 'Epic' },
    category: 'networking', categoryName: 'Networking & DevOps', region: 'networking-nexus',
    objectives: [
      { id: 'obj-nb-1', description: 'Submit "Cloud Infrastructure Deployment" boss quest', objectiveType: 'boss', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-cloud-deploy', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-nb-2', description: 'Reach 950 total XP', objectiveType: 'xp', targetCount: 950, orderIndex: 2, isCompleted: false },
      { id: 'obj-nb-3', description: 'Complete 1 lesson from the Cybersecurity category', objectiveType: 'lesson', targetCount: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-router-line', estimatedMinutes: 200,
    completionHint: 'Submit the Nexus boss quest, reach 950 XP, and learn some cybersecurity.',
    chainId: 'networking-path', chainPosition: 4, unlocksQuestIds: [], requiresQuestIds: ['quest-devops-essentials'], rarity: 'epic',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE DESIGN SANCTUM (7 quests)                  ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-design-awakening', title: 'Design Awakening: The Creative Spark',
    description: 'Unlock your creative potential. Master design thinking, visual hierarchy, and the principles that transform interfaces into experiences.',
    storyText: 'The Design Sanctum sits atop the highest peak. The Grand Designer speaks: "Every pixel is a choice. Every color tells a story. Every layout guides a journey."',
    type: 'learning', difficulty: 1, xpReward: 100,
    badgeReward: { name: 'Design Novice', rarity: 'Common' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-da-1', description: 'Complete "Design Thinking & Principles" lesson', objectiveType: 'lesson', targetId: 'uiux-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/uiux-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-da-2', description: 'Reach 100 total XP', objectiveType: 'xp', targetCount: 100, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-palette-line', estimatedMinutes: 40,
    completionHint: 'Complete the Design Thinking lesson and reach 100 XP.',
    chainId: 'uiux-path', chainPosition: 1, unlocksQuestIds: ['quest-wireframing-proto'], requiresQuestIds: [], rarity: 'common',
  },
  {
    id: 'quest-wireframing-proto', title: 'Wireframing & Prototyping: The Blueprint Art',
    description: 'Before beauty comes structure. Master wireframing and prototyping — the architectural blueprints of great interfaces.',
    storyText: 'In the Blueprint Chamber, designers sketch the bones of future masterpieces. Wireframes are architectural plans. Prototypes bring those plans to life.',
    type: 'learning', difficulty: 2, xpReward: 150,
    badgeReward: { name: 'Blueprint Crafter', rarity: 'Rare' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-wp-1', description: 'Complete 1 lesson from the Frontend category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-wp-2', description: 'Reach 250 total XP', objectiveType: 'xp', targetCount: 250, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-layout-line', estimatedMinutes: 55,
    completionHint: 'Learn some frontend and reach 250 XP.',
    chainId: 'uiux-path', chainPosition: 2, unlocksQuestIds: ['quest-color-typography'], requiresQuestIds: ['quest-design-awakening'], rarity: 'rare',
  },
  {
    id: 'quest-color-typography', title: 'Color & Typography: The Sensory Arts',
    description: 'Master the two most powerful tools in design. Color theory and typography — where science meets art.',
    storyText: 'The Sensory Halls are alive with color. Red evokes urgency, blue conveys trust. The right typeface can whisper or roar. Great design is felt before understood.',
    type: 'learning', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'Visual Crafter', rarity: 'Rare' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-ct-1', description: 'Complete 1 quiz battle', objectiveType: 'quiz', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-ct-2', description: 'Reach 400 total XP', objectiveType: 'xp', targetCount: 400, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-paint-brush-line', estimatedMinutes: 65,
    completionHint: 'Ace a quiz battle and reach 400 XP.',
    chainId: 'uiux-path', chainPosition: 3, unlocksQuestIds: ['quest-advanced-ux-research'], requiresQuestIds: ['quest-wireframing-proto'], rarity: 'rare',
  },
  {
    id: 'quest-advanced-ux-research', title: 'Advanced UX Research: The Empathy Engine',
    description: 'Dive deep into user research. Master usability testing, user interviews, and data-driven design decisions.',
    storyText: 'The Empathy Engine hums in the Sanctum heart, channeling thousands of user voices. Personas emerge from data. Journey maps reveal pain points. True empathy is the ultimate superpower.',
    type: 'learning', difficulty: 3, xpReward: 250,
    badgeReward: { name: 'UX Architect', rarity: 'Epic' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-ur-1', description: 'Complete 2 lessons from any region', objectiveType: 'lesson', minScore: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-ur-2', description: 'Maintain a 5-day streak', objectiveType: 'streak', targetCount: 5, orderIndex: 2, isCompleted: false },
      { id: 'obj-ur-3', description: 'Reach 550 total XP', objectiveType: 'xp', targetCount: 550, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-user-heart-line', estimatedMinutes: 85,
    completionHint: 'Complete 2 more lessons, keep a 5-day streak, and reach 550 XP.',
    chainId: 'uiux-path', chainPosition: 4, unlocksQuestIds: ['quest-uiux-boss'], requiresQuestIds: ['quest-color-typography'], rarity: 'epic',
  },
  {
    id: 'quest-uiux-boss', title: 'Boss: The Design Virtuoso',
    description: 'Create a complete UI/UX case study. From research to high-fidelity prototype, prove your mastery of the design craft.',
    storyText: 'The Virtuoso\'s Gallery awaits your masterpiece. Present a complete case study: user research, wireframing, prototyping, visual design, usability testing. The Guild Masters judge every pixel.',
    type: 'boss', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'Design Virtuoso', rarity: 'Epic' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-ub-1', description: 'Submit "UI/UX Case Study" boss quest', objectiveType: 'boss', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-design-case-study', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-ub-2', description: 'Reach 700 total XP', objectiveType: 'xp', targetCount: 700, orderIndex: 2, isCompleted: false },
      { id: 'obj-ub-3', description: 'Complete 1 lesson from the Frontend Kingdom', objectiveType: 'lesson', targetCount: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-brush-line', estimatedMinutes: 180,
    completionHint: 'Submit the design boss quest, reach 700 XP, and touch the Frontend realm.',
    chainId: 'uiux-path', chainPosition: 5, unlocksQuestIds: ['quest-design-systems'], requiresQuestIds: ['quest-advanced-ux-research'], rarity: 'epic',
  },
  {
    id: 'quest-design-systems', title: 'Design Systems: The Harmonious Universe',
    description: 'Create order from chaos. Build comprehensive design systems for consistency, scalability, and harmony across product ecosystems.',
    storyText: 'Design Systems bring harmony to digital universes. A button defined once, used everywhere. Color palettes speaking with one voice. Typography scales in perfect rhythm.',
    type: 'learning', difficulty: 4, xpReward: 400,
    badgeReward: { name: 'Design System Architect', rarity: 'Epic' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-ds-1', description: 'Complete 1 lesson from 2 different regions outside Design', objectiveType: 'lesson', targetCount: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-ds-2', description: 'Reach 1100 total XP', objectiveType: 'xp', targetCount: 1100, orderIndex: 2, isCompleted: false },
      { id: 'obj-ds-3', description: 'Maintain a 10-day streak', objectiveType: 'streak', targetCount: 10, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-layout-grid-line', estimatedMinutes: 140,
    completionHint: 'Explore 2 new regions, reach 1100 XP, and hold a 10-day streak.',
    chainId: 'uiux-path', chainPosition: 6, unlocksQuestIds: ['quest-legendary-design-oracle'], requiresQuestIds: ['quest-uiux-boss'], rarity: 'epic',
  },
  {
    id: 'quest-legendary-design-oracle', title: 'Legendary: The Design Oracle',
    description: 'Reach the pinnacle of design mastery. Create a visionary design that redefines what interfaces can be.',
    storyText: 'The Design Oracle sees not just what interfaces are, but what they could become. Having mastered every discipline, create your vision. The Oracle\'s Circle awaits your prophecy.',
    type: 'legendary', difficulty: 5, xpReward: 1000,
    badgeReward: { name: 'Design Oracle', rarity: 'Legendary' },
    category: 'uiux', categoryName: 'UI/UX Designer', region: 'design-sanctum',
    objectives: [
      { id: 'obj-lo-1', description: 'Complete all Design Sanctum quests before this one', objectiveType: 'lesson', minScore: 5, orderIndex: 1, isCompleted: false },
      { id: 'obj-lo-2', description: 'Reach 1400 total XP', objectiveType: 'xp', targetCount: 1400, orderIndex: 2, isCompleted: false },
      { id: 'obj-lo-3', description: 'Submit "Visionary Design Project" boss quest', objectiveType: 'boss', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-design-oracle', redirectLabel: 'Go to Boss Quest' },
    ],
    isActive: true, icon: 'ri-eye-2-line', estimatedMinutes: 480,
    completionHint: 'Conquer all Sanctum quests, reach 1400 XP, and submit the legendary design project.',
    chainId: 'uiux-path', chainPosition: 7, unlocksQuestIds: [], requiresQuestIds: ['quest-design-systems'], isHidden: true, hiddenCondition: 'Complete Design Systems', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           THE FULL STACK FORGE (7 quests)                ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-fullstack-forge', title: 'The Full Stack Forge: Cross-Discipline Initiation',
    description: 'Enter the legendary Forge. Complete lessons across frontend, backend, and database to prove cross-discipline worth.',
    storyText: 'The Forge burns at the intersection of all realms. The Forgekeeper greets you: "Prove you can work the frontend hammer, the backend anvil, and the database flame."',
    type: 'achievement', difficulty: 3, xpReward: 300,
    badgeReward: { name: 'Stack Apprentice', rarity: 'Rare' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-ff-1', description: 'Complete "Introduction to HTML5" lesson', objectiveType: 'lesson', targetId: 'frontend-1', minScore: 1, orderIndex: 1, isCompleted: false, redirectRoute: '/lessons/frontend-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-ff-2', description: 'Complete "Server-side Programming 101" lesson', objectiveType: 'lesson', targetId: 'backend-1', minScore: 1, orderIndex: 2, isCompleted: false, redirectRoute: '/lessons/backend-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-ff-3', description: 'Complete "Introduction to Databases" lesson', objectiveType: 'lesson', targetId: 'database-1', minScore: 1, orderIndex: 3, isCompleted: false, redirectRoute: '/lessons/database-1', redirectLabel: 'Go to Lesson' },
      { id: 'obj-ff-4', description: 'Reach 400 total XP', objectiveType: 'xp', targetCount: 400, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-stack-line', estimatedMinutes: 150,
    completionHint: 'Complete lessons from frontend, backend, and database plus reach 400 XP.',
    chainId: 'fullstack-path', chainPosition: 1, unlocksQuestIds: ['quest-frontend-backend-bridge'], requiresQuestIds: [], rarity: 'rare',
  },
  {
    id: 'quest-frontend-backend-bridge', title: 'Frontend-Backend Bridge: The Two-Way Path',
    description: 'Build the bridge between frontend and backend. Master API integration, data fetching, and state synchronization.',
    storyText: 'The Bridge is the most traveled path in the digital world. Data flows both ways: user actions triggering API calls, server responses rendering into interfaces.',
    type: 'learning', difficulty: 3, xpReward: 350,
    badgeReward: { name: 'Bridge Builder', rarity: 'Epic' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-fbb-1', description: 'Complete 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-fbb-2', description: 'Reach 600 total XP', objectiveType: 'xp', targetCount: 600, orderIndex: 2, isCompleted: false },
      { id: 'obj-fbb-3', description: 'Complete 1 lesson from the Cybersecurity category', objectiveType: 'lesson', targetCount: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-links-line', estimatedMinutes: 90,
    completionHint: 'Solve a coding challenge, reach 600 XP, and learn some security.',
    chainId: 'fullstack-path', chainPosition: 2, unlocksQuestIds: ['quest-system-design'], requiresQuestIds: ['quest-fullstack-forge'], rarity: 'epic',
  },
  {
    id: 'quest-system-design', title: 'System Design: The Grand Architecture',
    description: 'Think at scale. Master system design principles, architecture patterns, and applications that serve millions.',
    storyText: 'The Grand Architects design systems that stand the test of time. Load balancers distribute millions. Caching layers serve at speed. Message queues decouple services like cosmic strings.',
    type: 'learning', difficulty: 4, xpReward: 400,
    badgeReward: { name: 'System Designer', rarity: 'Epic' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-sd-1', description: 'Complete 2 lessons from 2 different regions', objectiveType: 'lesson', targetCount: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-sd-2', description: 'Reach 900 total XP', objectiveType: 'xp', targetCount: 900, orderIndex: 2, isCompleted: false },
      { id: 'obj-sd-3', description: 'Submit 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-building-line', estimatedMinutes: 120,
    completionHint: 'Explore 2 more regions, reach 900 XP, and solve a coding challenge.',
    chainId: 'fullstack-path', chainPosition: 3, unlocksQuestIds: ['quest-fullstack-boss'], requiresQuestIds: ['quest-frontend-backend-bridge'], rarity: 'epic',
  },
  {
    id: 'quest-fullstack-boss', title: 'Boss: The Forge Master',
    description: 'Build a complete full stack application from scratch. Frontend, backend, database - forge every layer.',
    storyText: 'The Forge Master stands before the eternal flame: "Craft an application spanning every layer. Beautiful frontend, robust backend, normalized database, flawless deployment."',
    type: 'boss', difficulty: 5, xpReward: 800,
    badgeReward: { name: 'Forge Master', rarity: 'Legendary' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-flb-1', description: 'Submit "Full Stack Application" boss quest', objectiveType: 'boss', orderIndex: 1, isCompleted: false, redirectRoute: '/boss-quests/boss-todo-app', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-flb-2', description: 'Reach 1200 total XP', objectiveType: 'xp', targetCount: 1200, orderIndex: 2, isCompleted: false },
      { id: 'obj-flb-3', description: 'Complete at least 1 boss quest from 2 different regions', objectiveType: 'boss', targetCount: 2, orderIndex: 3, isCompleted: false },
      { id: 'obj-flb-4', description: 'Maintain a 10-day streak', objectiveType: 'streak', targetCount: 10, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-hammer-line', estimatedMinutes: 360,
    completionHint: 'Submit the full stack boss, reach 1200 XP, beat 2 other bosses, and keep a 10-day streak.',
    chainId: 'fullstack-path', chainPosition: 4, unlocksQuestIds: ['quest-fullstack-architect'], requiresQuestIds: ['quest-system-design'], rarity: 'legendary',
  },
  {
    id: 'quest-fullstack-architect', title: 'Full Stack Architect: The Omni-Designer',
    description: 'Transcend individual stacks. Design full-stack architectures integrating across all seven regions.',
    storyText: 'The Full Stack Architect doesn\'t just build - they design ecosystems. Every technology choice ripples across the stack. Think holistically.',
    type: 'learning', difficulty: 4, xpReward: 500,
    badgeReward: { name: 'Full Stack Architect', rarity: 'Epic' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-fa-1', description: 'Complete at least 1 lesson from 4 different regions', objectiveType: 'lesson', targetCount: 4, orderIndex: 1, isCompleted: false },
      { id: 'obj-fa-2', description: 'Reach 1800 total XP', objectiveType: 'xp', targetCount: 1800, orderIndex: 2, isCompleted: false },
      { id: 'obj-fa-3', description: 'Maintain a 14-day streak', objectiveType: 'streak', targetCount: 14, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-layout-masonry-line', estimatedMinutes: 150,
    completionHint: 'Touch 4 different regions, reach 1800 XP, and keep a 14-day streak.',
    chainId: 'fullstack-path', chainPosition: 5, unlocksQuestIds: ['quest-legendary-fullstack'], requiresQuestIds: ['quest-fullstack-boss'], rarity: 'epic',
  },
  {
    id: 'quest-legendary-fullstack', title: 'Legendary: The Omni-Stack',
    description: 'Unite all realms into one transcendent creation spanning the entire digital universe.',
    storyText: 'The Omni-Stack blends frontend beauty, backend power, database integrity, security fortitude, networking reach, and design elegance into one. The Forge Master steps aside: "Create something remembered for generations."',
    type: 'legendary', difficulty: 5, xpReward: 2000,
    badgeReward: { name: 'Omni-Stack Master', rarity: 'Legendary' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-os-1', description: 'Complete at least 1 boss quest from 3 different regions', objectiveType: 'boss', targetCount: 3, orderIndex: 1, isCompleted: false },
      { id: 'obj-os-2', description: 'Reach 2500 total XP', objectiveType: 'xp', targetCount: 2500, orderIndex: 2, isCompleted: false },
      { id: 'obj-os-3', description: 'Submit "Omni-Stack Capstone" boss quest', objectiveType: 'boss', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-omni-stack', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-os-4', description: 'Complete quests from all 6 main regions', objectiveType: 'lesson', targetCount: 6, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-meteor-line', estimatedMinutes: 600,
    completionHint: 'Beat 3 region bosses, reach 2500 XP, touch all 6 realms, and submit the capstone.',
    chainId: 'fullstack-path', chainPosition: 6, unlocksQuestIds: ['quest-legendary-infinite-builder'], requiresQuestIds: ['quest-fullstack-architect'], isHidden: true, hiddenCondition: 'Complete Full Stack Architect', rarity: 'legendary',
  },
  {
    id: 'quest-legendary-infinite-builder', title: 'Legendary: The Infinite Builder',
    description: 'Having completed the Omni-Stack, build something infinite - a project that keeps evolving and inspiring.',
    storyText: 'The Infinite Builder creates systems that create systems. Their work spawns ecosystems. The Grand Architect presents the Infinite Blueprint: "Build something that will outlive us all."',
    type: 'legendary', difficulty: 5, xpReward: 2000,
    badgeReward: { name: 'The Infinite Builder', rarity: 'Legendary' },
    category: 'fullstack', categoryName: 'Full Stack Developer', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-ib-1', description: 'Reach 4000 total XP', objectiveType: 'xp', targetCount: 4000, orderIndex: 1, isCompleted: false },
      { id: 'obj-ib-2', description: 'Complete at least 5 boss quests', objectiveType: 'boss', targetCount: 5, orderIndex: 2, isCompleted: false },
      { id: 'obj-ib-3', description: 'Submit "Infinite Builder Capstone" boss quest', objectiveType: 'boss', orderIndex: 3, isCompleted: false, redirectRoute: '/boss-quests/boss-omni-stack', redirectLabel: 'Go to Boss Quest' },
      { id: 'obj-ib-4', description: 'Complete quests from all 7 regions', objectiveType: 'lesson', targetCount: 7, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-infinity-line', estimatedMinutes: 800,
    completionHint: 'The ultimate prize: 4000 XP, 5 bosses, all 7 realms, and the capstone.',
    isHidden: true, hiddenCondition: 'Complete the Omni-Stack legendary quest', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           HIDDEN QUESTS (3)                              ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-hidden-crossroads', title: 'Hidden: The Crossroads',
    description: 'A hidden path opens between realms. Knowledge from the intersections of disciplines awaits.',
    storyText: 'At the crossroads, a mysterious figure awaits: "Few find this place. Only those refusing to be bound by a single path. You\'ve walked multiple worlds - now see what lies between."',
    type: 'hidden', difficulty: 2, xpReward: 300,
    badgeReward: { name: 'Pathfinder', rarity: 'Rare' },
    category: 'general', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-hc-1', description: 'Complete 1 additional lesson from a third category', objectiveType: 'lesson', targetCount: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-hc-2', description: 'Reach 500 total XP', objectiveType: 'xp', targetCount: 500, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-compass-3-line', estimatedMinutes: 30,
    completionHint: 'Explore a third category and reach 500 XP.',
    isHidden: true, hiddenCondition: 'Complete quests from 2 different regions', rarity: 'rare',
  },
  {
    id: 'quest-hidden-midnight-oil', title: 'Hidden: The Midnight Oil',
    description: 'A secret quest for the dedicated. Your streak burns bright enough to reveal hidden knowledge.',
    storyText: 'The Library of Lost Knowledge materializes in the darkest hours. The Librarian nods: "Your streak has earned entry. But knowledge demands action."',
    type: 'hidden', difficulty: 2, xpReward: 250,
    badgeReward: { name: 'Night Scholar', rarity: 'Rare' },
    category: 'general', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-mo-1', description: 'Complete 2 lessons today', objectiveType: 'lesson', minScore: 2, orderIndex: 1, isCompleted: false },
      { id: 'obj-mo-2', description: 'Earn 100 XP today', objectiveType: 'xp', targetCount: 100, orderIndex: 2, isCompleted: false },
      { id: 'obj-mo-3', description: 'Maintain your streak above 5 days', objectiveType: 'streak', targetCount: 5, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-moon-line', estimatedMinutes: 60,
    completionHint: 'Complete 2 lessons, earn 100 XP, all while holding a 5+ day streak.',
    isHidden: true, hiddenCondition: 'Maintain a 5+ day streak', rarity: 'rare',
  },
  {
    id: 'quest-hidden-shadow-realm', title: 'Hidden: The Shadow Realm',
    description: 'A dark portal opens. This hidden quest appears to those who have tasted both creation and defense.',
    storyText: 'A crack in the digital fabric reveals the Shadow Realm. The Shadow Walkers patrol: "You\'ve proven yourself in both building and breaking. Now learn what truly lurks in the shadows."',
    type: 'hidden', difficulty: 3, xpReward: 350,
    badgeReward: { name: 'Shadow Walker', rarity: 'Epic' },
    category: 'general', region: 'cyber-fortress',
    objectives: [
      { id: 'obj-sr-1', description: 'Complete 1 coding challenge', objectiveType: 'coding', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-sr-2', description: 'Complete 1 quiz battle', objectiveType: 'quiz', minScore: 1, orderIndex: 2, isCompleted: false },
      { id: 'obj-sr-3', description: 'Reach 700 total XP', objectiveType: 'xp', targetCount: 700, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-ghost-line', estimatedMinutes: 75,
    completionHint: 'Solve a coding challenge, ace a quiz, and reach 700 XP.',
    isHidden: true, hiddenCondition: 'Complete quests from Cybersecurity AND at least 1 other region', rarity: 'epic',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           LEGENDARY CROSS-REALM QUESTS (2)               ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-legendary-five-pillars', title: 'Legendary: The Five Pillars',
    description: 'You have touched every major discipline. Prove your breadth by completing quests across all five pillars.',
    storyText: 'The Temple of Five Pillars has stood since the dawn of the digital age. The prophecy states one who masters all five shall unlock wisdom beyond any single specialty.',
    type: 'legendary', difficulty: 5, xpReward: 1200,
    badgeReward: { name: 'Master of Five Pillars', rarity: 'Legendary' },
    category: 'general', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-fp-1', description: 'Complete at least 1 boss quest from 3 different regions', objectiveType: 'boss', targetCount: 3, orderIndex: 1, isCompleted: false },
      { id: 'obj-fp-2', description: 'Reach 2000 total XP', objectiveType: 'xp', targetCount: 2000, orderIndex: 2, isCompleted: false },
      { id: 'obj-fp-3', description: 'Complete quests from 5 different regions', objectiveType: 'lesson', targetCount: 5, orderIndex: 3, isCompleted: false },
      { id: 'obj-fp-4', description: 'Maintain a 14-day streak', objectiveType: 'streak', targetCount: 14, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-building-4-line', estimatedMinutes: 500,
    completionHint: 'Conquer 3 bosses, touch 5 regions, reach 2000 XP, and keep 14-day streak.',
    isHidden: true, hiddenCondition: 'Complete quests from 4 different regions', rarity: 'legendary',
  },
  {
    id: 'quest-legendary-digital-realms', title: 'Legendary: Master of the Digital Realms',
    description: 'The ultimate cross-disciplinary challenge. Prove mastery across every realm of the digital universe.',
    storyText: 'The Council of Realm Masters convenes once a century. Standing before them, you present your body of work across every realm. The fate of your legend hangs in the balance.',
    type: 'legendary', difficulty: 5, xpReward: 1500,
    badgeReward: { name: 'Master of the Digital Realms', rarity: 'Legendary' },
    category: 'general', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-dr-1', description: 'Complete at least 1 quest from all 7 regions', objectiveType: 'lesson', targetCount: 7, orderIndex: 1, isCompleted: false },
      { id: 'obj-dr-2', description: 'Reach 3000 total XP', objectiveType: 'xp', targetCount: 3000, orderIndex: 2, isCompleted: false },
      { id: 'obj-dr-3', description: 'Complete at least 3 boss quests', objectiveType: 'boss', targetCount: 3, orderIndex: 3, isCompleted: false },
      { id: 'obj-dr-4', description: 'Maintain a 21-day streak', objectiveType: 'streak', targetCount: 21, orderIndex: 4, isCompleted: false },
    ],
    isActive: true, icon: 'ri-earth-line', estimatedMinutes: 700,
    completionHint: 'Touch all 7 regions, reach 3000 XP, beat 3 bosses, and keep a 21-day streak.',
    isHidden: true, hiddenCondition: 'Complete at least 1 Legendary quest', rarity: 'legendary',
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║           UNIVERSAL QUESTS (4)                           ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 'quest-overachiever', title: 'Overachiever: Knowledge Seeker',
    description: 'Push beyond ordinary limits. Complete lessons from ALL major specialization categories.',
    storyText: 'The Overachiever touches every pillar of knowledge and emerges transformed.',
    type: 'achievement', difficulty: 3, xpReward: 450,
    badgeReward: { name: 'Overachiever', rarity: 'Epic' },
    category: 'general', region: 'fullstack-forge',
    objectives: [
      { id: 'obj-oa-1', description: 'Complete at least 1 lesson in Frontend', objectiveType: 'lesson', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-oa-2', description: 'Complete at least 1 lesson in Backend', objectiveType: 'lesson', minScore: 1, orderIndex: 2, isCompleted: false },
      { id: 'obj-oa-3', description: 'Complete at least 1 lesson in Database', objectiveType: 'lesson', minScore: 1, orderIndex: 3, isCompleted: false },
      { id: 'obj-oa-4', description: 'Complete at least 1 lesson in Cybersecurity', objectiveType: 'lesson', minScore: 1, orderIndex: 4, isCompleted: false },
      { id: 'obj-oa-5', description: 'Complete at least 1 lesson in UI/UX', objectiveType: 'lesson', minScore: 1, orderIndex: 5, isCompleted: false },
      { id: 'obj-oa-6', description: 'Reach 600 total XP', objectiveType: 'xp', targetCount: 600, orderIndex: 6, isCompleted: false },
    ],
    isActive: true, icon: 'ri-trophy-line', estimatedMinutes: 300,
    completionHint: 'Complete at least one lesson in each of the 5 main categories and reach 600 XP.',
  },
  {
    id: 'quest-streak-warrior', title: 'Streak Warrior: The Unbroken Chain',
    description: 'Consistency is the deadliest weapon. Maintain your login streak to unlock the power of daily discipline.',
    storyText: 'The ancient scrolls say: The warrior who trains one day defeats one enemy. The warrior who trains every single day becomes unstoppable.',
    type: 'achievement', difficulty: 2, xpReward: 200,
    badgeReward: { name: 'Streak Warrior', rarity: 'Rare' },
    category: 'general', region: 'universal',
    objectives: [
      { id: 'obj-sw-1', description: 'Maintain a 5-day login streak', objectiveType: 'streak', targetCount: 5, orderIndex: 1, isCompleted: false },
      { id: 'obj-sw-2', description: 'Reach 300 total XP', objectiveType: 'xp', targetCount: 300, orderIndex: 2, isCompleted: false },
    ],
    isActive: true, icon: 'ri-fire-line', estimatedMinutes: 0,
    completionHint: 'Log in for 5 consecutive days and earn 300 XP total.',
  },
  {
    id: 'quest-daily-grind', title: 'Daily Grind: Sharpen Your Blade',
    description: 'A true warrior trains every day. Complete daily tasks to keep skills sharp and earn bonus rewards.',
    storyText: 'The Training Grounds never sleep. Every morning, fresh challenges appear.',
    type: 'daily', difficulty: 1, xpReward: 60,
    category: 'general', region: 'universal',
    objectives: [
      { id: 'obj-dg-quest-1', description: 'Complete 1 lesson today', objectiveType: 'lesson', minScore: 1, orderIndex: 1, isCompleted: false },
      { id: 'obj-dg-quest-2', description: 'Earn 50 XP today', objectiveType: 'xp', targetCount: 50, orderIndex: 2, isCompleted: false },
      { id: 'obj-dg-quest-3', description: 'Log in to the platform', objectiveType: 'streak', targetCount: 1, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-sun-line', estimatedMinutes: 35,
    completionHint: 'Daily quests reset each day. Complete a lesson, earn 50 XP, and log in.',
  },
  {
    id: 'quest-weekly-challenge', title: 'Weekly Challenge: The Gauntlet',
    description: 'A week-long trial of endurance. Complete multiple lessons across different categories.',
    storyText: 'The Gauntlet appears once every seven days.',
    type: 'weekly', difficulty: 3, xpReward: 350,
    badgeReward: { name: 'Gauntlet Champion', rarity: 'Epic' },
    category: 'general', region: 'universal',
    objectives: [
      { id: 'obj-wcq-1', description: 'Complete 3 lessons this week', objectiveType: 'lesson', minScore: 3, orderIndex: 1, isCompleted: false },
      { id: 'obj-wcq-2', description: 'Earn 300 XP this week', objectiveType: 'xp', targetCount: 300, orderIndex: 2, isCompleted: false },
      { id: 'obj-wcq-3', description: 'Complete 1 lesson from 2 different categories', objectiveType: 'lesson', targetCount: 2, orderIndex: 3, isCompleted: false },
    ],
    isActive: true, icon: 'ri-calendar-check-line', estimatedMinutes: 180,
    completionHint: 'Complete 3 lessons across 2+ categories and earn 300 XP within the week.',
  },
];