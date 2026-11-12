export interface LessonModule {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
}

export const lessonModules: Record<string, LessonModule[]> = {
  frontend: [
    {
      id: 'module-fe-1',
      title: 'HTML Foundations',
      description: 'The structure and core elements every web page is built on',
      lessonIds: ['frontend-1', 'frontend-2'],
    },
    {
      id: 'module-fe-2',
      title: 'HTML Content & Structure',
      description: 'Format text and build pages with links, images, lists, and tables',
      lessonIds: ['frontend-3', 'frontend-4'],
    },
    {
      id: 'module-fe-3',
      title: 'HTML Forms & Semantics',
      description: 'Build forms and use meaningful, accessible markup',
      lessonIds: ['frontend-5'],
    },
    {
      id: 'module-fe-4',
      title: 'DOM Manipulation & Events',
      description: 'Make pages interactive by responding to user actions',
      lessonIds: ['frontend-6'],
    },
    {
      id: 'module-fe-5',
      title: 'React Components & Props',
      description: 'Build reusable components and pass data with props',
      lessonIds: ['frontend-7'],
    },
    {
      id: 'module-fe-6',
      title: 'Frontend Foundations',
      description: 'How HTML, CSS, and JavaScript work together',
      lessonIds: ['frontend-8'],
    },
  ],
  backend: [
    {
      id: 'module-be-1',
      title: 'Backend Foundations',
      description: 'Servers, the HTTP protocol, and API design',
      lessonIds: ['backend-1', 'backend-2'],
    },
    {
      id: 'module-be-2',
      title: 'Node.js & Express APIs',
      description: 'Build servers and RESTful APIs with Node.js and Express',
      lessonIds: ['backend-3', 'backend-4'],
    },
    {
      id: 'module-be-3',
      title: 'Databases & Authentication',
      description: 'Work with SQL databases and secure your APIs with JWT',
      lessonIds: ['backend-5', 'backend-6'],
    },
    {
      id: 'module-be-4',
      title: 'Security & Deployment',
      description: 'Harden your APIs and ship them to production with Docker',
      lessonIds: ['backend-7', 'backend-8'],
    },
  ],
  fullstack: [
    {
      id: 'module-fs-1',
      title: 'Full Stack Foundations',
      description: 'How frontend, backend, and data fit together, from the roadmap to JavaScript essentials',
      lessonIds: ['fullstack-1', 'fullstack-2', 'fullstack-3', 'fullstack-4', 'fullstack-5', 'fullstack-6', 'fullstack-7', 'fullstack-8'],
    },
  ],
  cybersecurity: [
    {
      id: 'module-cs-1',
      title: 'Security Foundations',
      description: 'Core security models and the threats to defend against',
      lessonIds: ['cybersec-1', 'cybersec-2'],
    },
    {
      id: 'module-cs-2',
      title: 'Identity & Access',
      description: 'Authentication, authorization, and least privilege',
      lessonIds: ['cybersec-3'],
    },
    {
      id: 'module-cs-3',
      title: 'Network & Cryptography',
      description: 'Protecting data in transit and at rest',
      lessonIds: ['cybersec-4', 'cybersec-5'],
    },
  ],
  database: [
    {
      id: 'module-db-1',
      title: 'Database Foundations',
      description: 'Relational design and the core concepts behind every database',
      lessonIds: ['database-1'],
    },
    {
      id: 'module-db-2',
      title: 'SQL & Querying',
      description: 'Retrieve, filter, sort, and combine data with SQL',
      lessonIds: ['dataadmin-2'],
    },
    {
      id: 'module-db-3',
      title: 'Database Design & Normalization',
      description: 'Model tables, keys, and relationships while reducing redundancy',
      lessonIds: ['dataadmin-3'],
    },
    {
      id: 'module-db-4',
      title: 'Database Administration',
      description: 'Operate databases securely with users, backups, monitoring, and recovery',
      lessonIds: ['dataadmin-4'],
    },
    {
      id: 'module-db-5',
      title: 'Database Security',
      description: 'Protect data with authentication, access control, encryption, and auditing',
      lessonIds: ['dataadmin-5'],
    },
    {
      id: 'module-db-6',
      title: 'Backup & Recovery',
      description: 'Safeguard data with backup types, restore procedures, and disaster recovery planning',
      lessonIds: ['dataadmin-6'],
    },
    {
      id: 'module-db-7',
      title: 'Database Performance & Optimization',
      description: 'Tune performance with indexes, query optimization, and execution plans',
      lessonIds: ['dataadmin-7'],
    },
    {
      id: 'module-db-8',
      title: 'Database Monitoring',
      description: 'Observe database health, metrics, logs, and alerts to prevent problems early',
      lessonIds: ['dataadmin-8'],
    },
    {
      id: 'module-db-9',
      title: 'Database Maintenance',
      description: 'Keep databases healthy with routine checks, index and statistics upkeep, and patches',
      lessonIds: ['dataadmin-9'],
    },
  ],
  uiux: [
    {
      id: 'module-uiux-1',
      title: 'Design Foundations',
      description: 'The UI/UX process and the principles behind good interfaces',
      lessonIds: ['uiux-1', 'uiux-2'],
    },
    {
      id: 'module-uiux-2',
      title: 'Understanding Users',
      description: 'Research, personas, and designing around real needs',
      lessonIds: ['uiux-3'],
    },
    {
      id: 'module-uiux-3',
      title: 'Structure & Flows',
      description: 'Organizing information and mapping user journeys',
      lessonIds: ['uiux-4'],
    },
    {
      id: 'module-uiux-4',
      title: 'Wireframing & Prototyping',
      description: 'Sketching layouts and building interactive prototypes',
      lessonIds: ['uiux-5', 'uiux-6'],
    },
    {
      id: 'module-uiux-5',
      title: 'Validation',
      description: 'Testing designs with real users and iterating on feedback',
      lessonIds: ['uiux-7'],
    },
  ],
};