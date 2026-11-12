import { quests, worldRegions, type Quest } from '@/sampleData/questExpandedData';

// ============================================================
// BOSS QUEST SYSTEM — Integrated with RPG Quest Progression
// ============================================================

export interface BossRequirement {
  id: string;
  description: string;
  validationType: 'structure' | 'behavior' | 'output' | 'responsive' | 'api' | 'database';
  testCaseId?: string;
  selector?: string;
  expectedOutput?: string;
  isAutoValidated: boolean;
  isMet: boolean;
}

export interface BossQuestData {
  id: string;
  title: string;
  storyText: string;
  difficulty: number;
  category: string;
  categoryName: string;
  regionId: string;
  regionName: string;
  xpReward: number;
  badgeReward?: { name: string; rarity: string };
  estimatedMinutes: number;
  deadlineDays: number;
  requirements: BossRequirement[];
  files: { name: string; language: 'html' | 'css' | 'javascript'; content: string }[];
  testCases: {
    id: string;
    description: string;
    expected_output: string;
    type: 'output' | 'structure' | 'behavior';
    selector?: string;
  }[];
  hints: string[];
  solutionHint: string;
  // RPG Progression Integration
  requiresQuestIds: string[];
  requiresXP: number;
  requiresLevel: number;
  requiresStreak: number;
  unlocksRegionId?: string;
  unlocksQuestIds: string[];
  bossType: 'region-boss' | 'legendary-boss' | 'elite-boss';
}

export type BossSubmissionStatus = 'locked' | 'available' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'needs_revision' | 'completed';

export interface BossQuestProgress {
  questId: string;
  status: BossSubmissionStatus;
  startedAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  autoScore?: number;
  facultyScore?: number;
  feedback?: string;
  testsPassed?: number;
  testsTotal?: number;
}

export interface FacultyReview {
  id: string;
  studentName: string;
  studentId: string;
  bossQuestId: string;
  bossQuestTitle: string;
  regionName: string;
  status: 'submitted' | 'under_review' | 'approved' | 'needs_revision';
  submittedAt: string;
  reviewedAt?: string;
  autoScore: number;
  facultyScore?: number;
  feedback?: string;
  files?: { name: string; content: string }[];
}

// ============================================================
// REGION → BOSS QUEST MAPPING
// ============================================================
export const regionBossMapping: Record<string, string> = {
  'frontend-kingdom': 'boss-portfolio',
  'server-citadel': 'boss-api-dashboard',
  'data-vault': 'boss-database-design',
  'cyber-fortress': 'boss-security-audit',
  'networking-nexus': 'boss-cloud-deploy',
  'design-sanctum': 'boss-design-case-study',
  'fullstack-forge': 'boss-todo-app',
};

export const legendBossMapping: Record<string, string> = {
  'frontend-kingdom': 'boss-eternal-frontend',
  'server-citadel': 'boss-infinite-server',
  'data-vault': 'boss-data-vault-guardian',
  'cyber-fortress': 'boss-digital-guardian',
  'design-sanctum': 'boss-design-oracle',
  'networking-nexus': 'boss-nexus-guardian',
  'fullstack-forge': 'boss-omni-stack',
};

// ============================================================
// BOSS QUEST DATA — All 12+ boss quests
// ============================================================
export const bossQuests: BossQuestData[] = [
  // ╔══════════════════════════════════════════════════════════╗
  // ║         FRONTEND KINGDOM BOSS                            ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-portfolio',
    title: 'Build Your Developer Portfolio',
    storyText: 'The Crystal Throne awaits, guarded by the Dragon of Compatibility. You have traversed HTML forests, CSS rivers, JavaScript mountains, and React frontiers. Now the Guild of Master Craftsmen decrees: forge your digital fortress — a Portfolio that showcases your skills to every realm. Build responsive, beautiful, and interactive. The Guild Elders will judge structure, styling, and interactivity. Forge well, warrior. Your portfolio is your banner in the professional world.',
    difficulty: 3,
    category: 'frontend',
    categoryName: 'Frontend Developer',
    regionId: 'frontend-kingdom',
    regionName: 'The Frontend Kingdom',
    xpReward: 500,
    badgeReward: { name: 'Portfolio Forged', rarity: 'Epic' },
    estimatedMinutes: 120,
    deadlineDays: 7,
    requiresQuestIds: ['quest-html-apprentice', 'quest-css-foundations', 'quest-responsive-master', 'quest-js-warrior', 'quest-react-frontiers'],
    requiresXP: 500,
    requiresLevel: 3,
    requiresStreak: 5,
    unlocksRegionId: 'server-citadel',
    unlocksQuestIds: ['quest-frontend-elite'],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-pf-1', description: 'Header with navigation menu exists', validationType: 'structure', testCaseId: 'tc-pf-1', selector: 'header', isAutoValidated: true, isMet: false },
      { id: 'req-pf-2', description: 'About section with bio content', validationType: 'structure', testCaseId: null, selector: '#about', isAutoValidated: true, isMet: false },
      { id: 'req-pf-3', description: 'Projects section with at least 3 project cards', validationType: 'structure', testCaseId: 'tc-pf-3', selector: '.project-card', isAutoValidated: true, isMet: false },
      { id: 'req-pf-4', description: 'Skills section listing technical skills', validationType: 'structure', testCaseId: 'tc-pf-5', selector: '.skills-list li', isAutoValidated: true, isMet: false },
      { id: 'req-pf-5', description: 'Contact section with a functional form', validationType: 'structure', testCaseId: 'tc-pf-4', selector: 'input[type="email"]', isAutoValidated: true, isMet: false },
      { id: 'req-pf-6', description: 'Fully responsive layout (mobile + desktop)', validationType: 'responsive', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-pf-7', description: 'Consistent color scheme and typography', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Developer Portfolio</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header class="site-header">\n    <div class="logo">YourName</div>\n    <nav class="main-nav">\n      <a href="#about">About</a>\n      <a href="#projects">Projects</a>\n      <a href="#skills">Skills</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n\n  <section id="about" class="about-section">\n    <h2>About Me</h2>\n    <p class="bio">Write your bio here...</p>\n  </section>\n\n  <section id="projects" class="projects-section">\n    <h2>My Projects</h2>\n    <div class="project-grid">\n      <div class="project-card"><h3>Project 1</h3><p>Description</p></div>\n      <div class="project-card"><h3>Project 2</h3><p>Description</p></div>\n      <div class="project-card"><h3>Project 3</h3><p>Description</p></div>\n    </div>\n  </section>\n\n  <section id="skills" class="skills-section">\n    <h2>Technical Skills</h2>\n    <ul class="skills-list">\n      <li>HTML5</li><li>CSS3</li><li>JavaScript</li><li>React</li>\n    </ul>\n  </section>\n\n  <section id="contact" class="contact-section">\n    <h2>Get In Touch</h2>\n    <form class="contact-form">\n      <input type="text" placeholder="Your Name">\n      <input type="email" placeholder="Your Email">\n      <textarea placeholder="Your Message"></textarea>\n      <button type="submit">Send</button>\n    </form>\n  </section>\n\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '/* === Developer Portfolio Styles === */\n* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; line-height: 1.6; color: #f1f5f9; background-color: #0a0a0f; }\n/* TODO: Style header, about, projects, skills, contact, responsive */'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// Portfolio interactivity\n// TODO: Smooth scroll, nav active state, form validation\nconsole.log("Portfolio ready!");'
      }
    ],
    testCases: [
      { id: 'tc-pf-1', description: 'Header element must exist', expected_output: 'exists', type: 'structure', selector: 'header' },
      { id: 'tc-pf-2', description: 'Navigation must exist', expected_output: 'exists', type: 'structure', selector: 'nav' },
      { id: 'tc-pf-3', description: 'At least 3 project cards', expected_output: '3', type: 'structure', selector: '.project-card' },
      { id: 'tc-pf-4', description: 'Email input in contact form', expected_output: 'exists', type: 'structure', selector: 'input[type="email"]' },
      { id: 'tc-pf-5', description: 'At least 3 skills listed', expected_output: '3', type: 'structure', selector: '.skills-list li' },
    ],
    hints: [
      'Use semantic HTML5 tags: header, nav, section',
      'Flexbox + media queries at 768px for responsive',
      'CSS Grid for project cards',
      'Keep color scheme to 3-4 colors max'
    ],
    solutionHint: 'Build each section one at a time. Start with HTML structure, add CSS styling, then layer in JavaScript interactions.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         SERVER CITADEL BOSS                              ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-api-dashboard',
    title: 'REST API Dashboard',
    storyText: 'The Oracle of Endpoints has fallen silent. For centuries, this mystical API served data to all corners of the digital kingdom. Now it lies dormant. Having mastered HTTP protocols, REST design, and Node.js sorcery in the Server Citadel, you must resurrect the Oracle. Build an elegant dashboard that fetches live data, handles loading and error states with grace, and presents information beautifully. The Oracle demands a worthy interface befitting the Citadel\'s traditions.',
    difficulty: 3,
    category: 'backend',
    categoryName: 'Backend Developer',
    regionId: 'server-citadel',
    regionName: 'The Server Citadel',
    xpReward: 500,
    badgeReward: { name: 'API Archmage', rarity: 'Epic' },
    estimatedMinutes: 120,
    deadlineDays: 7,
    requiresQuestIds: ['quest-server-awakening', 'quest-api-crafting', 'quest-nodejs-journeyman', 'quest-middleware-auth'],
    requiresXP: 600,
    requiresLevel: 3,
    requiresStreak: 7,
    unlocksRegionId: 'data-vault',
    unlocksQuestIds: ['quest-microservices-mastery'],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-api-1', description: 'Fetch users from API and display in cards', validationType: 'api', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-api-2', description: 'Search bar to filter users by name', validationType: 'structure', testCaseId: 'tc-api-1', selector: '#search-input', isAutoValidated: true, isMet: false },
      { id: 'req-api-3', description: 'Click user to view their posts (lazy load)', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-api-4', description: 'Loading spinner while data is fetched', validationType: 'structure', testCaseId: 'tc-api-3', selector: '#loading-state', isAutoValidated: true, isMet: false },
      { id: 'req-api-5', description: 'Error state handling with retry', validationType: 'structure', testCaseId: 'tc-api-4', selector: '#error-state', isAutoValidated: true, isMet: false },
      { id: 'req-api-6', description: 'Pagination or Load More button', validationType: 'structure', testCaseId: 'tc-api-5', selector: '#load-more-btn', isAutoValidated: true, isMet: false },
      { id: 'req-api-7', description: 'Display post count per user', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Oracle of Endpoints</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="dashboard-container">\n    <header class="dashboard-header">\n      <h1>Oracle of Endpoints</h1>\n      <input type="text" id="search-input" class="search-input" placeholder="Search users...">\n    </header>\n    <div id="loading-state" class="loading-state"><div class="spinner"></div><p>Summoning the Oracle...</p></div>\n    <div id="error-state" class="error-state hidden"><p>Failed to reach the Oracle.</p><button id="retry-btn">Retry</button></div>\n    <div id="users-grid" class="users-grid"></div>\n    <div id="load-more" class="load-more"><button id="load-more-btn">Load More</button></div>\n    <div id="posts-panel" class="posts-panel hidden">\n      <div class="posts-header"><h3 id="posts-title">Posts</h3><button id="close-posts">Close</button></div>\n      <div id="posts-list" class="posts-list"></div>\n    </div>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '/* Oracle Dashboard Styles */\n* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; min-height: 100vh; }\n/* TODO: Style header, loading, error, user cards, posts panel, responsive */'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// Oracle Dashboard Logic\nconst API_BASE = "https://jsonplaceholder.typicode.com";\n// TODO: Fetch users, render cards, search, load more, fetch posts, error handling'
      }
    ],
    testCases: [
      { id: 'tc-api-1', description: 'Search input must exist', expected_output: 'exists', type: 'structure', selector: '#search-input' },
      { id: 'tc-api-2', description: 'Users grid container exists', expected_output: 'exists', type: 'structure', selector: '#users-grid' },
      { id: 'tc-api-3', description: 'Loading state exists', expected_output: 'exists', type: 'structure', selector: '#loading-state' },
      { id: 'tc-api-4', description: 'Error state exists', expected_output: 'exists', type: 'structure', selector: '#error-state' },
      { id: 'tc-api-5', description: 'Load more button exists', expected_output: 'exists', type: 'structure', selector: '#load-more-btn' },
    ],
    hints: [
      'Use fetch() with async/await for API calls',
      'JSONPlaceholder /users returns 10 users',
      'Try/catch blocks for error handling',
      'Debounce search input (300ms)'
    ],
    solutionHint: 'Fetch users on load, render first N. On Load More, increment. Click user to fetch posts into slide-in panel. Filter with search.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         DATA VAULT BOSS                                  ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-database-design',
    title: 'Database Schema Challenge',
    storyText: 'The Grand Architect of the Data Vault has sealed the inner sanctum. Only those who have proven mastery over SQL, normalization rituals, sacred JOINs, and data modeling may enter. Design a complete database schema for a Library Management System — tables for books, authors, borrowers, loans. Your schema must demonstrate normalization, proper relationships, indexing strategy, and query optimization. The Vault Guardians will judge every foreign key, every index, every constraint.',
    difficulty: 4,
    category: 'database',
    categoryName: 'Database Administrator',
    regionId: 'data-vault',
    regionName: 'The Data Vault',
    xpReward: 500,
    badgeReward: { name: 'Data Architect', rarity: 'Epic' },
    estimatedMinutes: 150,
    deadlineDays: 10,
    requiresQuestIds: ['quest-sql-apprentice', 'quest-database-keeper', 'quest-query-master', 'quest-data-modeling'],
    requiresXP: 700,
    requiresLevel: 4,
    requiresStreak: 7,
    unlocksRegionId: 'fullstack-forge',
    unlocksQuestIds: ['quest-performance-tuning'],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-db-1', description: 'Design books table with proper columns', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-db-2', description: 'Design authors table with proper columns', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-db-3', description: 'Design borrowers table with proper columns', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-db-4', description: 'Design loans table with foreign keys', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-db-5', description: 'Normalize to at least 3NF', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-db-6', description: 'Add appropriate indexes', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-db-7', description: 'Write sample queries (JOIN, aggregate, search)', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'schema.sql',
        language: 'javascript',
        content: '-- Library Management System Schema\n-- TODO: Design tables for books, authors, borrowers, loans\n-- Include: PRIMARY KEYs, FOREIGN KEYs, INDEXes, constraints\n\n-- Example:\n-- CREATE TABLE books (\n--   id SERIAL PRIMARY KEY,\n--   title VARCHAR(255) NOT NULL,\n--   ...\n-- );'
      },
      {
        name: 'queries.sql',
        language: 'javascript',
        content: '-- Sample queries for the Library System\n-- TODO: Write JOIN queries, aggregates, search queries\n\n-- 1. Find all books borrowed by a specific user\n-- 2. Count books per author\n-- 3. Find overdue books\n-- 4. Search books by title'
      },
      {
        name: 'schema.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Database Schema Design</title><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div class="schema-doc">\n    <h1>Library Management System — Database Design</h1>\n    <section id="schema-output"><pre>Schema will render here</pre></section>\n    <section id="queries-output"><pre>Query results will render here</pre></section>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// Display schema and queries in the HTML output\n// TODO: Render the schema design and query results'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", monospace; background: #0a0a0f; color: #f1f5f9; padding: 24px; }\n.schema-doc { max-width: 900px; margin: 0 auto; }\nh1 { color: #8b5cf6; font-size: 1.5rem; margin-bottom: 24px; }\npre { background: #1a1a24; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.8; }'
      }
    ],
    testCases: [
      { id: 'tc-db-1', description: 'Schema must contain CREATE TABLE statements', expected_output: 'exists', type: 'structure' },
      { id: 'tc-db-2', description: 'Must have at least 4 tables', expected_output: '4', type: 'structure' },
    ],
    hints: [
      'Books: id, title, isbn, publish_year, author_id (FK)',
      'Authors: id, name, biography',
      'Borrowers: id, name, email, phone',
      'Loans: id, book_id (FK), borrower_id (FK), loan_date, due_date, return_date'
    ],
    solutionHint: 'Start with entity identification, then define relationships (1:N, N:M), then normalize, then add indexes on frequently queried columns.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         CYBER FORTRESS BOSS                              ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-security-audit',
    title: 'Security Audit Challenge',
    storyText: 'The Shadow Lords have breached the outer walls of the Cyber Fortress. Alarms blare across every watchtower. You — having mastered OWASP sacred texts, network defense, and penetration testing arts — are the realm\'s last hope. Audit the fortress systems, identify every vulnerability (XSS, SQL injection, CSRF, insecure auth), document your findings, and implement fixes. The Guardian Council awaits your report. Prove you are the Shadow Defender the digital world needs.',
    difficulty: 4,
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    regionId: 'cyber-fortress',
    regionName: 'The Cyber Fortress',
    xpReward: 500,
    badgeReward: { name: 'Shadow Defender', rarity: 'Epic' },
    estimatedMinutes: 150,
    deadlineDays: 10,
    requiresQuestIds: ['quest-security-initiate', 'quest-owasp-top10', 'quest-network-defense', 'quest-pen-testing'],
    requiresXP: 750,
    requiresLevel: 4,
    requiresStreak: 7,
    unlocksRegionId: 'networking-nexus',
    unlocksQuestIds: ['quest-security-architecture'],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-sa-1', description: 'Identify and document XSS vulnerabilities', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-sa-2', description: 'Identify SQL injection points', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-sa-3', description: 'Check for CSRF protection', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-sa-4', description: 'Audit authentication system', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-sa-5', description: 'Provide fix recommendations', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-sa-6', description: 'Create a security report page', validationType: 'structure', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Security Audit Report</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="audit-container">\n    <h1>Security Audit Report</h1>\n    <div id="vulnerability-list" class="vuln-list">\n      <div class="vuln-card"><h3>Vulnerability 1</h3><p>Describe here...</p></div>\n      <div class="vuln-card"><h3>Vulnerability 2</h3><p>Describe here...</p></div>\n    </div>\n    <div id="recommendations" class="recommendations">\n      <h3>Fix Recommendations</h3>\n      <ul id="fix-list"></ul>\n    </div>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; }\n.audit-container { max-width: 800px; margin: 0 auto; padding: 32px; }\nh1 { color: #f43f5e; font-size: 1.8rem; margin-bottom: 24px; }\n.vuln-card { background: #1a1a24; padding: 16px; border-left: 3px solid #f43f5e; margin-bottom: 12px; border-radius: 8px; }\n.vuln-card h3 { color: #fb7185; font-size: 0.9rem; margin-bottom: 8px; }'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// Security Audit logic\n// TODO: Populate vulnerability list, add fix recommendations, validate inputs\nconst vulns = [];\nconst fixes = [];\n// Render vulnerabilities and fixes\nconsole.log("Security audit initialized");'
      }
    ],
    testCases: [
      { id: 'tc-sa-1', description: 'Vulnerability list must exist', expected_output: 'exists', type: 'structure', selector: '#vulnerability-list' },
      { id: 'tc-sa-2', description: 'Fix recommendations must exist', expected_output: 'exists', type: 'structure', selector: '#recommendations' },
    ],
    hints: [
      'Check for unsanitized user input (XSS)',
      'Look for string concatenation in SQL (SQL injection)',
      'Verify CSRF tokens on forms',
      'Check password hashing and session management'
    ],
    solutionHint: 'Document each vulnerability with: location, type, severity, reproduction steps, and recommended fix. Prioritize critical issues first.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         NETWORKING NEXUS BOSS                            ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-cloud-deploy',
    title: 'Cloud Deployment Challenge',
    storyText: 'The Networking Nexus hums with the traffic of a thousand digital realms. Having mastered networking fundamentals, cloud deployment, and DevOps essentials, the Nexus Guardian challenges you: deploy a complete web application with CI/CD pipeline, container orchestration, monitoring, and auto-scaling. Your deployment must handle traffic surges with grace. The Guardian watches every byte.',
    difficulty: 4,
    category: 'networking',
    categoryName: 'Networking & DevOps',
    regionId: 'networking-nexus',
    regionName: 'The Networking Nexus',
    xpReward: 500,
    badgeReward: { name: 'Nexus Guardian', rarity: 'Epic' },
    estimatedMinutes: 150,
    deadlineDays: 10,
    requiresQuestIds: ['quest-networking-101', 'quest-cloud-deployment', 'quest-devops-essentials'],
    requiresXP: 750,
    requiresLevel: 4,
    requiresStreak: 7,
    unlocksRegionId: undefined,
    unlocksQuestIds: [],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-cd-1', description: 'Create Dockerfile for the application', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-cd-2', description: 'Set up CI/CD pipeline configuration', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-cd-3', description: 'Configure monitoring dashboard', validationType: 'structure', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-cd-4', description: 'Document deployment architecture', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-cd-5', description: 'Implement health check endpoint', validationType: 'api', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-cd-6', description: 'Set up auto-scaling rules', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Cloud Deployment Dashboard</title><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div class="deploy-dashboard">\n    <h1>Deployment Architecture</h1>\n    <div id="architecture-diagram" class="arch-diagram"></div>\n    <div id="deploy-config" class="config-section"><pre>Dockerfile and CI config will appear here</pre></div>\n    <div id="monitoring-panel" class="monitor-panel"></div>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; }\n.deploy-dashboard { max-width: 900px; margin: 0 auto; padding: 32px; }\nh1 { color: #14b8a6; margin-bottom: 24px; }\npre { background: #1a1a24; padding: 16px; border-radius: 8px; font-size: 13px; }'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// Cloud Deployment Dashboard\n// TODO: Render Dockerfile config, CI pipeline, monitoring data\nconsole.log("Deployment dashboard ready");'
      }
    ],
    testCases: [
      { id: 'tc-cd-1', description: 'Configuration section must exist', expected_output: 'exists', type: 'structure', selector: '#deploy-config' },
      { id: 'tc-cd-2', description: 'Monitoring panel must exist', expected_output: 'exists', type: 'structure', selector: '#monitoring-panel' },
    ],
    hints: [
      'Dockerfile: FROM, COPY, RUN, EXPOSE, CMD',
      'CI/CD: GitHub Actions or similar YAML config',
      'Include health check endpoint at /health',
      'Auto-scaling based on CPU > 70% or request count'
    ],
    solutionHint: 'Start with Dockerfile for containerization, then CI pipeline for automated testing/deployment, then monitoring config, finally scaling rules.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         DESIGN SANCTUM BOSS                              ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-design-case-study',
    title: 'UI/UX Design Case Study',
    storyText: 'The Grand Designer of the Design Sanctum has issued the ultimate creative challenge. Having awakened your design senses, mastered wireframing, conquered color theory and typography, and delved into UX research, you must now create a complete case study. Redesign an existing app experience — from user research and personas through wireframes, high-fidelity mockups, prototypes, and usability testing. Every pixel must tell a story. The Guild Masters judge every decision.',
    difficulty: 4,
    category: 'uiux',
    categoryName: 'UI/UX Designer',
    regionId: 'design-sanctum',
    regionName: 'The Design Sanctum',
    xpReward: 500,
    badgeReward: { name: 'Design Virtuoso', rarity: 'Epic' },
    estimatedMinutes: 150,
    deadlineDays: 10,
    requiresQuestIds: ['quest-design-awakening', 'quest-wireframing-proto', 'quest-color-typography', 'quest-advanced-ux-research'],
    requiresXP: 550,
    requiresLevel: 4,
    requiresStreak: 5,
    unlocksRegionId: undefined,
    unlocksQuestIds: ['quest-design-systems'],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-ds-1', description: 'User research summary with personas', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ds-2', description: 'Wireframe designs for key screens', validationType: 'structure', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ds-3', description: 'Color palette and typography documentation', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ds-4', description: 'High-fidelity mockups (HTML/CSS)', validationType: 'structure', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ds-5', description: 'Usability testing findings', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ds-6', description: 'Final recommendations and iterations', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Design Case Study</title><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div class="case-study">\n    <header><h1>UI/UX Case Study: [App Name] Redesign</h1></header>\n    <section id="research"><h2>User Research</h2><div id="personas"></div></section>\n    <section id="wireframes"><h2>Wireframes</h2><div id="wireframe-display"></div></section>\n    <section id="design-system"><h2>Design System</h2><div id="colors"></div><div id="typography"></div></section>\n    <section id="mockups"><h2>High-Fidelity Mockups</h2><div id="mockup-display"></div></section>\n    <section id="testing"><h2>Usability Testing</h2><div id="test-results"></div></section>\n    <section id="conclusion"><h2>Recommendations</h2><div id="recommendations"></div></section>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; line-height: 1.7; }\n.case-study { max-width: 900px; margin: 0 auto; padding: 40px 24px; }\nh1 { font-size: 2rem; color: #d946ef; margin-bottom: 32px; }\nh2 { color: #e879f9; margin: 32px 0 16px; font-size: 1.3rem; }\nsection { margin-bottom: 32px; padding: 20px; background: #1a1a24; border-radius: 12px; }'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// Design Case Study\n// TODO: Render personas, wireframes (ASCII art or div-based), color palette, typography samples\nconsole.log("Design case study ready");'
      }
    ],
    testCases: [
      { id: 'tc-ds-1', description: 'All 6 sections must exist', expected_output: '6', type: 'structure', selector: 'section' },
      { id: 'tc-ds-2', description: 'Personas section must have content', expected_output: 'exists', type: 'structure', selector: '#personas' },
    ],
    hints: [
      'Include 2-3 user personas with demographics and goals',
      'Wireframes can be div-based low-fidelity layouts',
      'Document color palette with hex codes',
      'Include before/after comparisons'
    ],
    solutionHint: 'Structure as a narrative: Problem → Research → Wireframes → Design System → Mockups → Testing → Recommendations.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         FULL STACK FORGE BOSSES                          ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-todo-app',
    title: 'Full-Stack Todo Application',
    storyText: 'The Forge burns bright at the intersection of all realms. Having proven mastery in Frontend, Backend, and Database, the Forge Master presents the ultimate test: the legendary Todo Scroll must be rebuilt — a full-stack application with create, read, update, delete, filter, and persist. But this is no ordinary todo app. It must be beautiful (Frontend), efficient (Backend), and data-persistent (Database). The flame of the Forge judges every layer of your creation.',
    difficulty: 4,
    category: 'fullstack',
    categoryName: 'Full Stack Developer',
    regionId: 'fullstack-forge',
    regionName: 'The Full Stack Forge',
    xpReward: 800,
    badgeReward: { name: 'Forge Master', rarity: 'Legendary' },
    estimatedMinutes: 180,
    deadlineDays: 14,
    requiresQuestIds: ['quest-fullstack-forge', 'quest-frontend-backend-bridge', 'quest-system-design'],
    requiresXP: 900,
    requiresLevel: 5,
    requiresStreak: 10,
    unlocksRegionId: undefined,
    unlocksQuestIds: ['quest-fullstack-architect'],
    bossType: 'region-boss',
    requirements: [
      { id: 'req-td-1', description: 'Create task input with Add button', validationType: 'structure', testCaseId: 'tc-td-2', selector: '#add-btn', isAutoValidated: true, isMet: false },
      { id: 'req-td-2', description: 'Display tasks with checkboxes', validationType: 'structure', testCaseId: 'tc-td-1', selector: '#todo-input', isAutoValidated: true, isMet: false },
      { id: 'req-td-3', description: 'Delete button for each task', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-td-4', description: 'Edit task functionality', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-td-5', description: 'Filter: All, Active, Completed', validationType: 'structure', testCaseId: 'tc-td-3', selector: '.filter-btn', isAutoValidated: true, isMet: false },
      { id: 'req-td-6', description: 'Show remaining task counter', validationType: 'structure', testCaseId: 'tc-td-5', selector: '#task-counter', isAutoValidated: true, isMet: false },
      { id: 'req-td-7', description: 'Clear Completed button', validationType: 'structure', testCaseId: 'tc-td-4', selector: '#clear-completed', isAutoValidated: true, isMet: false },
      { id: 'req-td-8', description: 'Persist tasks in localStorage', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>The Todo Scroll</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="app-container">\n    <h1 class="app-title">The Todo Scroll</h1>\n    <div class="todo-input-group">\n      <input type="text" id="todo-input" class="todo-input" placeholder="What needs to be done?">\n      <button id="add-btn" class="add-btn">Add Task</button>\n    </div>\n    <div class="filter-bar">\n      <button class="filter-btn active" data-filter="all">All</button>\n      <button class="filter-btn" data-filter="active">Active</button>\n      <button class="filter-btn" data-filter="completed">Completed</button>\n    </div>\n    <ul id="todo-list" class="todo-list"></ul>\n    <div class="todo-footer">\n      <span id="task-counter" class="task-counter">0 tasks remaining</span>\n      <button id="clear-completed" class="clear-btn">Clear Completed</button>\n    </div>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>'
      },
      {
        name: 'style.css',
        language: 'css',
        content: '/* The Todo Scroll Styles */\n* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding-top: 60px; background-color: #0a0a0f; color: #f1f5f9; }\n.app-container { width: 100%; max-width: 500px; padding: 0 16px; }\n/* TODO: Style title, input, task list, filter bar, footer */'
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: '// The Todo Scroll Logic\nconst input = document.getElementById("todo-input");\nconst addBtn = document.getElementById("add-btn");\nconst todoList = document.getElementById("todo-list");\nconst taskCounter = document.getElementById("task-counter");\nconst clearBtn = document.getElementById("clear-completed");\nconst filterBtns = document.querySelectorAll(".filter-btn");\nlet tasks = [];\nlet currentFilter = "all";\n// TODO: Load/save, add, toggle, edit, delete, filter, count'
      }
    ],
    testCases: [
      { id: 'tc-td-1', description: 'Input field exists', expected_output: 'exists', type: 'structure', selector: '#todo-input' },
      { id: 'tc-td-2', description: 'Add button exists', expected_output: 'exists', type: 'structure', selector: '#add-btn' },
      { id: 'tc-td-3', description: '3 filter buttons exist', expected_output: '3', type: 'structure', selector: '.filter-btn' },
      { id: 'tc-td-4', description: 'Clear completed button exists', expected_output: 'exists', type: 'structure', selector: '#clear-completed' },
      { id: 'tc-td-5', description: 'Task counter exists', expected_output: 'exists', type: 'structure', selector: '#task-counter' },
    ],
    hints: [
      'Store tasks as { id, text, completed } objects',
      'Use Date.now() for unique IDs',
      'Filter with Array.filter() before rendering',
      'localStorage.setItem/getItem with JSON'
    ],
    solutionHint: 'Build incrementally: add tasks → render → toggle completion → delete → edit → filter → localStorage persistence.'
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║         LEGENDARY BOSS QUESTS (6)                        ║
  // ╚══════════════════════════════════════════════════════════╝
  {
    id: 'boss-eternal-frontend',
    title: 'Legendary: The Eternal Frontend',
    storyText: 'The Eternal Frontend exists beyond the boundaries of ordinary web development. You have conquered every quest in the Frontend Kingdom, defeated the Crystal Throne boss, and pushed beyond into elite territory. Now, the Eternal Guardians invite you to transcend — build something that redefines what the web can do. An advanced web application with real-time updates, animations, and cutting-edge performance.',
    difficulty: 5,
    category: 'frontend',
    categoryName: 'Frontend Developer',
    regionId: 'frontend-kingdom',
    regionName: 'The Frontend Kingdom',
    xpReward: 1000,
    badgeReward: { name: 'Eternal Frontend', rarity: 'Legendary' },
    estimatedMinutes: 300,
    deadlineDays: 21,
    requiresQuestIds: ['quest-frontend-elite', 'quest-legendary-frontend'],
    requiresXP: 1500,
    requiresLevel: 6,
    requiresStreak: 14,
    bossType: 'legendary-boss',
    requirements: [
      { id: 'req-ef-1', description: 'Real-time data integration', validationType: 'api', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ef-2', description: 'Advanced animations and transitions', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ef-3', description: 'Performance optimized (lazy loading, code splitting)', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ef-4', description: 'Responsive across all device sizes', validationType: 'responsive', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-ef-5', description: 'Accessibility features implemented', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      { name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Eternal Frontend</title><link rel="stylesheet" href="style.css"></head>\n<body><div id="app"></div><script src="script.js"></script></body>\n</html>' },
      { name: 'style.css', language: 'css', content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; }' },
      { name: 'script.js', language: 'javascript', content: '// Eternal Frontend — Legendary Boss\n// TODO: Build an advanced web app with real-time features and animation\nconsole.log("Eternal Frontend awakening...");' }
    ],
    testCases: [{ id: 'tc-ef-1', description: 'App container exists', expected_output: 'exists', type: 'structure', selector: '#app' }],
    hints: ['Use WebSocket or polling for real-time', 'GSAP or CSS keyframes for animation', 'IntersectionObserver for lazy loading'],
    solutionHint: 'Design a real-time dashboard or collaborative tool with smooth animations and responsive design.'
  },
  {
    id: 'boss-infinite-server',
    title: 'Legendary: The Infinite Server',
    storyText: 'Beyond the API Archmage lies true enlightenment — the Infinite Server that processes requests at the speed of thought, scales effortlessly, and never fails. Having proven yourself an Archmage, you must design a backend system architecture that could serve millions while maintaining sub-100ms response times.',
    difficulty: 5,
    category: 'backend',
    categoryName: 'Backend Developer',
    regionId: 'server-citadel',
    regionName: 'The Server Citadel',
    xpReward: 1000,
    badgeReward: { name: 'Infinite Architect', rarity: 'Legendary' },
    estimatedMinutes: 300,
    deadlineDays: 21,
    requiresQuestIds: ['quest-microservices-mastery', 'quest-legendary-backend'],
    requiresXP: 1500,
    requiresLevel: 6,
    requiresStreak: 14,
    bossType: 'legendary-boss',
    requirements: [
      { id: 'req-is-1', description: 'Design microservices architecture', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-is-2', description: 'Include caching strategy', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-is-3', description: 'Load balancing configuration', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-is-4', description: 'Database sharding plan', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      { name: 'architecture.html', language: 'html', content: '<!DOCTYPE html>\n<html><head><title>Infinite Server Architecture</title><link rel="stylesheet" href="style.css"></head>\n<body><div class="arch-doc"><h1>Infinite Server Architecture</h1><div id="diagram"></div></div><script src="script.js"></script></body></html>' },
      { name: 'style.css', language: 'css', content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; padding: 32px; }' },
      { name: 'script.js', language: 'javascript', content: '// Infinite Server Architecture\n// TODO: Render architecture diagram, caching strategy, load balancing, sharding plan' }
    ],
    testCases: [{ id: 'tc-is-1', description: 'Architecture diagram section exists', expected_output: 'exists', type: 'structure', selector: '#diagram' }],
    hints: ['Use message queues (RabbitMQ/Kafka) for decoupling', 'Redis/Memcached for caching', 'NGINX/HAProxy for load balancing'],
    solutionHint: 'Document each layer: CDN → Load Balancer → API Gateway → Microservices → Message Queue → Database (with read replicas and sharding).'
  },
  {
    id: 'boss-data-vault-guardian',
    title: 'Legendary: Data Vault Guardian',
    storyText: 'The deepest vault has never been opened. Its lock requires a key forged from every database discipline — normalization, query optimization, performance tuning, data modeling. Having conquered every Data Vault quest, you must design a distributed, high-availability database architecture. The Vault awaits its final Guardian.',
    difficulty: 5,
    category: 'database',
    categoryName: 'Database Administrator',
    regionId: 'data-vault',
    regionName: 'The Data Vault',
    xpReward: 1000,
    badgeReward: { name: 'Data Vault Guardian', rarity: 'Legendary' },
    estimatedMinutes: 300,
    deadlineDays: 21,
    requiresQuestIds: ['quest-performance-tuning', 'quest-legendary-data-vault'],
    requiresXP: 1500,
    requiresLevel: 6,
    requiresStreak: 14,
    bossType: 'legendary-boss',
    requirements: [
      { id: 'req-dvg-1', description: 'Design master-slave replication', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-dvg-2', description: 'Implement sharding strategy', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-dvg-3', description: 'Backup and disaster recovery plan', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      { name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html><head><title>Data Vault Architecture</title><link rel="stylesheet" href="style.css"></head>\n<body><div class="vault-doc"><h1>Distributed Database Architecture</h1><div id="replication"></div><div id="sharding"></div><div id="backup"></div></div><script src="script.js"></script></body></html>' },
      { name: 'style.css', language: 'css', content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; padding: 32px; }' },
      { name: 'script.js', language: 'javascript', content: '// Data Vault Guardian\n// TODO: Render replication, sharding, and backup plan' }
    ],
    testCases: [],
    hints: ['PostgreSQL streaming replication for masters', 'Hash-based sharding by tenant ID', 'Point-in-time recovery with WAL archiving'],
    solutionHint: 'Document a multi-region PostgreSQL setup with primary-replica streaming, sharding by region, and automated backup pipelines.'
  },
  {
    id: 'boss-digital-guardian',
    title: 'Legendary: The Digital Guardian',
    storyText: 'The Digital Guardians are legend — warriors who defended against threats that would make ordinary defenders flee. Having conquered every challenge in the Cyber Fortress, you must design a complete security framework: threat modeling, defense-in-depth, incident response, and security monitoring for a large-scale application.',
    difficulty: 5,
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    regionId: 'cyber-fortress',
    regionName: 'The Cyber Fortress',
    xpReward: 1000,
    badgeReward: { name: 'Digital Guardian', rarity: 'Legendary' },
    estimatedMinutes: 300,
    deadlineDays: 21,
    requiresQuestIds: ['quest-security-architecture', 'quest-legendary-digital-guardian'],
    requiresXP: 1600,
    requiresLevel: 6,
    requiresStreak: 14,
    bossType: 'legendary-boss',
    requirements: [
      { id: 'req-dg-1', description: 'Threat model documentation', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-dg-2', description: 'Defense-in-depth strategy', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-dg-3', description: 'Incident response plan', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-dg-4', description: 'Security monitoring setup', validationType: 'structure', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      { name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html><head><title>Security Framework</title><link rel="stylesheet" href="style.css"></head>\n<body><div class="security-doc"><h1>Security Framework Design</h1><div id="threat-model"></div><div id="defense"></div><div id="incident"></div><div id="monitoring"></div></div><script src="script.js"></script></body></html>' },
      { name: 'style.css', language: 'css', content: '* { margin: 0; padding: 0; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; padding: 32px; }' },
      { name: 'script.js', language: 'javascript', content: '// Digital Guardian Framework\n// TODO: Render threat model, defense layers, IR plan, monitoring dashboard' }
    ],
    testCases: [],
    hints: ['STRIDE methodology for threat modeling', 'Network + App + Data + Identity defense layers', 'NIST framework for incident response'],
    solutionHint: 'Structure as: Threat Model → Defense Layers → Incident Response Playbook → Monitoring & Alerting Dashboard.'
  },
  {
    id: 'boss-design-oracle',
    title: 'Legendary: The Design Oracle',
    storyText: 'The Design Oracle sees not just what interfaces are, but what they could become. Having mastered every discipline in the Design Sanctum, create your vision — a complete design system with components, tokens, documentation, and interactive prototypes. The Oracle\'s Circle awaits your prophecy.',
    difficulty: 5,
    category: 'uiux',
    categoryName: 'UI/UX Designer',
    regionId: 'design-sanctum',
    regionName: 'The Design Sanctum',
    xpReward: 1000,
    badgeReward: { name: 'Design Oracle', rarity: 'Legendary' },
    estimatedMinutes: 300,
    deadlineDays: 21,
    requiresQuestIds: ['quest-design-systems', 'quest-legendary-design-oracle'],
    requiresXP: 1400,
    requiresLevel: 6,
    requiresStreak: 14,
    bossType: 'legendary-boss',
    requirements: [
      { id: 'req-do-1', description: 'Design token system (colors, spacing, typography)', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-do-2', description: 'Component library documentation', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-do-3', description: 'Interactive component demos', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      { name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html><head><title>Design System</title><link rel="stylesheet" href="style.css"></head>\n<body><div class="ds-doc"><h1>Design System</h1><div id="tokens"></div><div id="components"></div></div><script src="script.js"></script></body></html>' },
      { name: 'style.css', language: 'css', content: '* { margin: 0; padding: 0; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; }' },
      { name: 'script.js', language: 'javascript', content: '// Design Oracle — Design System\n// TODO: Render design tokens and component demos' }
    ],
    testCases: [],
    hints: ['Define CSS custom properties for tokens', 'Build button, card, input, modal components', 'Include hover/focus/disabled states'],
    solutionHint: 'Start with design tokens (colors, spacing scale, type scale), then build atomic components with all states documented.'
  },
  {
    id: 'boss-omni-stack',
    title: 'Legendary: The Omni-Stack',
    storyText: 'The Omni-Stack blends frontend beauty, backend power, database integrity, security fortitude, networking reach, and design elegance into one transcendent creation. Having conquered the Full Stack Forge and touched every realm, you must build a complete full-stack application spanning all seven regions. The Grand Architect presents the Omnific Blueprint: create something that will serve as the ultimate proof of your legendary status.',
    difficulty: 5,
    category: 'fullstack',
    categoryName: 'Full Stack Developer',
    regionId: 'fullstack-forge',
    regionName: 'The Full Stack Forge',
    xpReward: 2000,
    badgeReward: { name: 'Omni-Stack Master', rarity: 'Legendary' },
    estimatedMinutes: 480,
    deadlineDays: 30,
    requiresQuestIds: ['quest-fullstack-architect', 'quest-legendary-fullstack'],
    requiresXP: 2500,
    requiresLevel: 7,
    requiresStreak: 21,
    bossType: 'legendary-boss',
    requirements: [
      { id: 'req-os-1', description: 'Full frontend with responsive design', validationType: 'responsive', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-os-2', description: 'Backend API with authentication', validationType: 'api', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-os-3', description: 'Database schema with relationships', validationType: 'database', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-os-4', description: 'Security measures implemented', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-os-5', description: 'Deployment configuration', validationType: 'output', testCaseId: null, isAutoValidated: true, isMet: false },
      { id: 'req-os-6', description: 'Polished UI/UX design', validationType: 'behavior', testCaseId: null, isAutoValidated: true, isMet: false },
    ],
    files: [
      { name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Omni-Stack Application</title><link rel="stylesheet" href="style.css"></head>\n<body><div id="app"></div><script src="script.js"></script></body></html>' },
      { name: 'style.css', language: 'css', content: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0a0a0f; color: #f1f5f9; }' },
      { name: 'script.js', language: 'javascript', content: '// Omni-Stack — The Ultimate Full-Stack Application\n// TODO: Build a complete app spanning frontend, backend, database, security, deployment\nconsole.log("Omni-Stack initializing...");' }
    ],
    testCases: [],
    hints: ['Build a real-world app like a blog platform, e-commerce, or social dashboard', 'Include auth, CRUD, search, filtering', 'Deploy with Docker + CI/CD'],
    solutionHint: 'Choose a project that naturally requires all layers: user auth (security), content CRUD (database+backend), beautiful UI (frontend+design), and deployment (networking).'
  },
];

// ============================================================
// UNLOCK CHECKING FUNCTIONS
// ============================================================

// ============================================================
// CENTRALIZED SYNC — Quest Path controls Boss Quest state
// ============================================================

// Get completed quest IDs from quest path localStorage
export function getCompletedQuestIds(): string[] {
  try {
    const saved = localStorage.getItem('itquest_quest_progress');
    if (!saved) return [];
    const progress: { questId: string; status: string }[] = JSON.parse(saved);
    return progress.filter((p) => p.status === 'completed').map((p) => p.questId);
  } catch {
    return [];
  }
}

// Get user XP from localStorage
export function getUserXP(): number {
  try {
    const saved = localStorage.getItem('itquest_user_xp');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

// Get user level
export function getUserLevel(): number {
  try {
    const saved = localStorage.getItem('itquest_user_level');
    return saved ? parseInt(saved, 10) : 1;
  } catch {
    return 1;
  }
}

// Get user streak
export function getUserStreak(): number {
  try {
    const saved = localStorage.getItem('itquest_user_streak');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

// Check if a boss quest is unlocked based on QUEST PATH progression
export function isBossQuestUnlocked(quest: BossQuestData): {
  isUnlocked: boolean;
  questsCompleted: number;
  questsRequired: number;
  xpCurrent: number;
  xpRequired: number;
  levelCurrent: number;
  levelRequired: number;
  streakCurrent: number;
  streakRequired: number;
  missingQuestIds: string[];
} {
  const completedQuestIds = getCompletedQuestIds();
  const userXP = getUserXP();
  const userLevel = getUserLevel();
  const userStreak = getUserStreak();

  const requiredQuestIds = quest.requiresQuestIds || [];
  const completedRequired = requiredQuestIds.filter((id) => completedQuestIds.includes(id));
  const missingQuestIds = requiredQuestIds.filter((id) => !completedQuestIds.includes(id));

  return {
    isUnlocked:
      completedRequired.length >= requiredQuestIds.length &&
      userXP >= quest.requiresXP &&
      userLevel >= quest.requiresLevel &&
      userStreak >= quest.requiresStreak,
    questsCompleted: completedRequired.length,
    questsRequired: requiredQuestIds.length,
    xpCurrent: userXP,
    xpRequired: quest.requiresXP,
    levelCurrent: userLevel,
    levelRequired: quest.requiresLevel,
    streakCurrent: userStreak,
    streakRequired: quest.requiresStreak,
    missingQuestIds,
  };
}

// Get boss quest progress from localStorage
export function getBossQuestProgress(): BossQuestProgress[] {
  try {
    const saved = localStorage.getItem('itquest_boss_progress');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveBossQuestProgress(progress: BossQuestProgress[]): void {
  localStorage.setItem('itquest_boss_progress', JSON.stringify(progress));
}

export function startBossQuest(questId: string): void {
  const progress = getBossQuestProgress();
  const existing = progress.find((p) => p.questId === questId);
  if (!existing || existing.status === 'available' || existing.status === 'locked') {
    const updated = progress.filter((p) => p.questId !== questId);
    updated.push({ questId, status: 'in_progress', startedAt: new Date().toISOString() });
    saveBossQuestProgress(updated);
  }
}

// ╔════════════════════════════════════════════════════════════╗
// ║ SYNC ENGINE — Quest Path is ALWAYS source of truth       ║
// ╚════════════════════════════════════════════════════════════╝

export function getBossQuestStatus(questId: string): BossSubmissionStatus {
  const quest = bossQuests.find((q) => q.id === questId);

  // STEP 1: Always check quest path prerequisites FIRST
  if (quest) {
    const unlock = isBossQuestUnlocked(quest);
    if (!unlock.isUnlocked) return 'locked';
  }

  // STEP 2: Only if prerequisites ARE met, check saved boss progress
  const progress = getBossQuestProgress();
  const entry = progress.find((p) => p.questId === questId);
  if (entry && entry.status !== 'available' && entry.status !== 'locked') {
    return entry.status;
  }

  // STEP 3: Prerequisites met but no saved progress → available
  return 'available';
}

// Force re-sync: if prerequisites are no longer met, reset status to locked
export function syncBossQuestStatus(questId: string): BossSubmissionStatus {
  const quest = bossQuests.find((q) => q.id === questId);
  if (!quest) return 'locked';

  const unlock = isBossQuestUnlocked(quest);

  if (!unlock.isUnlocked) {
    // Prerequisites not met — reset saved progress if it exists
    const progress = getBossQuestProgress();
    const existing = progress.find((p) => p.questId === questId);
    if (existing && existing.status !== 'locked') {
      const updated = progress.filter((p) => p.questId !== questId);
      saveBossQuestProgress(updated);
    }
    return 'locked';
  }

  return getBossQuestStatus(questId);
}

// Check if a region's boss has been completed
export function isRegionCleared(regionId: string): boolean {
  const bossId = regionBossMapping[regionId];
  if (!bossId) return false;
  const status = getBossQuestStatus(bossId);
  return status === 'completed' || status === 'approved';
}

// Get region boss progress (for page display)
export function getRegionBossProgress(regionId: string): {
  bossQuest: BossQuestData | null;
  legendBossQuest: BossQuestData | null;
  isUnlocked: boolean;
  isCompleted: boolean;
  isLegendUnlocked: boolean;
  unlockProgress: ReturnType<typeof isBossQuestUnlocked>;
} {
  const bossId = regionBossMapping[regionId];
  const legendId = legendBossMapping[regionId];
  const boss = bossQuests.find((q) => q.id === bossId) || null;
  const legendBoss = bossQuests.find((q) => q.id === legendId) || null;
  const status = boss ? getBossQuestStatus(boss.id) : 'locked';
  const unlockProgress = boss ? isBossQuestUnlocked(boss) : null;

  // Legendary boss unlocks only after main boss is completed
  const isCompleted = status === 'completed' || status === 'approved';
  let isLegendUnlocked = false;
  if (legendBoss && isCompleted) {
    const legendUnlock = isBossQuestUnlocked(legendBoss);
    isLegendUnlocked = legendUnlock.isUnlocked;
  }

  return {
    bossQuest: boss,
    legendBossQuest: legendBoss,
    isUnlocked: status !== 'locked',
    isCompleted,
    isLegendUnlocked,
    unlockProgress: unlockProgress || {
      isUnlocked: false, questsCompleted: 0, questsRequired: 0,
      xpCurrent: 0, xpRequired: 0, levelCurrent: 0, levelRequired: 0,
      streakCurrent: 0, streakRequired: 0, missingQuestIds: [],
    },
  };
}

// Get quest chain display info for a boss quest's prerequisite display
export function getBossPrerequisiteQuestNames(quest: BossQuestData): string[] {
  return quest.requiresQuestIds.map((qid) => {
    const q = quests.find((qq) => qq.id === qid);
    return q ? q.title : qid.replace('quest-', '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  });
}

// ============================================================
// FACULTY REVIEW DATA
// ============================================================
export const facultyReviews: FacultyReview[] = [
  {
    id: 'review-1',
    studentName: 'Juan Dela Cruz',
    studentId: 'student-1',
    bossQuestId: 'boss-portfolio',
    bossQuestTitle: 'Build Your Developer Portfolio',
    regionName: 'The Frontend Kingdom',
    status: 'submitted',
    submittedAt: '2026-05-26T14:20:00Z',
    autoScore: 85,
    files: [
      { name: 'index.html', content: '<!DOCTYPE html>...' },
      { name: 'style.css', content: '/* Portfolio styles */' },
    ],
  },
  {
    id: 'review-2',
    studentName: 'Maria Santos',
    studentId: 'student-2',
    bossQuestId: 'boss-api-dashboard',
    bossQuestTitle: 'REST API Dashboard',
    regionName: 'The Server Citadel',
    status: 'under_review',
    submittedAt: '2026-05-25T09:00:00Z',
    autoScore: 92,
  },
  {
    id: 'review-3',
    studentName: 'Carlos Reyes',
    studentId: 'student-3',
    bossQuestId: 'boss-portfolio',
    bossQuestTitle: 'Build Your Developer Portfolio',
    regionName: 'The Frontend Kingdom',
    status: 'submitted',
    submittedAt: '2026-05-26T16:45:00Z',
    autoScore: 72,
  },
  {
    id: 'review-4',
    studentName: 'Angela Mercado',
    studentId: 'student-4',
    bossQuestId: 'boss-todo-app',
    bossQuestTitle: 'Full-Stack Todo Application',
    regionName: 'The Full Stack Forge',
    status: 'submitted',
    submittedAt: '2026-05-24T11:30:00Z',
    autoScore: 88,
  },
  {
    id: 'review-5',
    studentName: 'Rafael Torres',
    studentId: 'student-5',
    bossQuestId: 'boss-design-case-study',
    bossQuestTitle: 'UI/UX Design Case Study',
    regionName: 'The Design Sanctum',
    status: 'submitted',
    submittedAt: '2026-05-23T08:15:00Z',
    autoScore: 95,
  },
  {
    id: 'review-6',
    studentName: 'Sofia Villanueva',
    studentId: 'student-6',
    bossQuestId: 'boss-security-audit',
    bossQuestTitle: 'Security Audit Challenge',
    regionName: 'The Cyber Fortress',
    status: 'submitted',
    submittedAt: '2026-05-22T13:00:00Z',
    autoScore: 78,
  },
];

export const reviewStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  submitted: { label: 'Submitted', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: 'ri-send-plane-line' },
  under_review: { label: 'Under Review', color: 'text-violet-400', bg: 'bg-violet-500/10', icon: 'ri-search-eye-line' },
  approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: 'ri-check-double-line' },
  needs_revision: { label: 'Needs Revision', color: 'text-rose-400', bg: 'bg-rose-500/10', icon: 'ri-close-circle-line' },
};

// Force unlock a boss quest by setting all prerequisite localStorage values
export function forceUnlockBossQuest(questId: string): boolean {
  const quest = bossQuests.find((q) => q.id === questId);
  if (!quest) return false;

  // 1. Mark all required quests as completed
  if (quest.requiresQuestIds.length > 0) {
    try {
      const saved = localStorage.getItem('itquest_quest_progress');
      const progress: { questId: string; status: string; acceptedAt?: string; completedAt?: string }[] = saved ? JSON.parse(saved) : [];
      const now = new Date().toISOString();
      quest.requiresQuestIds.forEach((qid) => {
        const existing = progress.find((p) => p.questId === qid);
        if (existing) {
          existing.status = 'completed';
          existing.completedAt = now;
        } else {
          progress.push({ questId: qid, status: 'completed', acceptedAt: now, completedAt: now });
        }
      });
      localStorage.setItem('itquest_quest_progress', JSON.stringify(progress));
    } catch { /* ignore */ }
  }

  // 2. Set XP to required amount
  if (quest.requiresXP > 0) {
    localStorage.setItem('itquest_user_xp', String(Math.max(quest.requiresXP, parseInt(localStorage.getItem('itquest_user_xp') || '0', 10))));
  }

  // 3. Set level to required amount
  if (quest.requiresLevel > 1) {
    localStorage.setItem('itquest_user_level', String(Math.max(quest.requiresLevel, parseInt(localStorage.getItem('itquest_user_level') || '1', 10))));
  }

  // 4. Set streak to required amount
  if (quest.requiresStreak > 0) {
    localStorage.setItem('itquest_user_streak', String(Math.max(quest.requiresStreak, parseInt(localStorage.getItem('itquest_user_streak') || '0', 10))));
  }

  // 5. Also mark the boss quest itself as available (so it shows up properly)
  try {
    const bossProgress = localStorage.getItem('itquest_boss_progress');
    const bp: { questId: string; status: string }[] = bossProgress ? JSON.parse(bossProgress) : [];
    const existingBp = bp.find((p) => p.questId === questId);
    if (existingBp) {
      if (existingBp.status === 'locked') existingBp.status = 'available';
    } else {
      bp.push({ questId, status: 'available' });
    }
    localStorage.setItem('itquest_boss_progress', JSON.stringify(bp));
  } catch { /* ignore */ }

  return true;
}