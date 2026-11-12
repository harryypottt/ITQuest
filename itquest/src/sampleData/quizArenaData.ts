// ============================================================
// RANKED SYSTEM
// ============================================================

export const rankDivisions = [
  {
    tier: "bronze",
    division: 4,
    name: "Bronze IV",
    icon: "ri-shield-line",
    color: "#cd7f32",
    bgClass: "bg-amber-700/10",
    borderClass: "border-amber-700/30",
    textClass: "text-amber-600",
    rpRange: [0, 199],
  },
  {
    tier: "bronze",
    division: 3,
    name: "Bronze III",
    icon: "ri-shield-line",
    color: "#cd7f32",
    bgClass: "bg-amber-700/10",
    borderClass: "border-amber-700/30",
    textClass: "text-amber-600",
    rpRange: [200, 399],
  },
  {
    tier: "bronze",
    division: 2,
    name: "Bronze II",
    icon: "ri-shield-line",
    color: "#cd7f32",
    bgClass: "bg-amber-700/10",
    borderClass: "border-amber-700/30",
    textClass: "text-amber-600",
    rpRange: [400, 599],
  },
  {
    tier: "bronze",
    division: 1,
    name: "Bronze I",
    icon: "ri-shield-line",
    color: "#cd7f32",
    bgClass: "bg-amber-700/10",
    borderClass: "border-amber-700/30",
    textClass: "text-amber-600",
    rpRange: [600, 799],
  },
  {
    tier: "silver",
    division: 4,
    name: "Silver IV",
    icon: "ri-shield-star-line",
    color: "#c0c0c0",
    bgClass: "bg-slate-400/10",
    borderClass: "border-slate-400/30",
    textClass: "text-slate-300",
    rpRange: [800, 999],
  },
  {
    tier: "silver",
    division: 3,
    name: "Silver III",
    icon: "ri-shield-star-line",
    color: "#c0c0c0",
    bgClass: "bg-slate-400/10",
    borderClass: "border-slate-400/30",
    textClass: "text-slate-300",
    rpRange: [1000, 1199],
  },
  {
    tier: "silver",
    division: 2,
    name: "Silver II",
    icon: "ri-shield-star-line",
    color: "#c0c0c0",
    bgClass: "bg-slate-400/10",
    borderClass: "border-slate-400/30",
    textClass: "text-slate-300",
    rpRange: [1200, 1399],
  },
  {
    tier: "silver",
    division: 1,
    name: "Silver I",
    icon: "ri-shield-star-line",
    color: "#c0c0c0",
    bgClass: "bg-slate-400/10",
    borderClass: "border-slate-400/30",
    textClass: "text-slate-300",
    rpRange: [1400, 1599],
  },
  {
    tier: "gold",
    division: 4,
    name: "Gold IV",
    icon: "ri-vip-crown-line",
    color: "#ffd700",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    textClass: "text-amber-400",
    rpRange: [1600, 1799],
  },
  {
    tier: "gold",
    division: 3,
    name: "Gold III",
    icon: "ri-vip-crown-line",
    color: "#ffd700",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    textClass: "text-amber-400",
    rpRange: [1800, 1999],
  },
  {
    tier: "gold",
    division: 2,
    name: "Gold II",
    icon: "ri-vip-crown-line",
    color: "#ffd700",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    textClass: "text-amber-400",
    rpRange: [2000, 2199],
  },
  {
    tier: "gold",
    division: 1,
    name: "Gold I",
    icon: "ri-vip-crown-line",
    color: "#ffd700",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    textClass: "text-amber-400",
    rpRange: [2200, 2399],
  },
  {
    tier: "platinum",
    division: 4,
    name: "Platinum IV",
    icon: "ri-shield-star-line",
    color: "#e5e4e2",
    bgClass: "bg-cyan-400/10",
    borderClass: "border-cyan-400/30",
    textClass: "text-cyan-300",
    rpRange: [2400, 2599],
  },
  {
    tier: "platinum",
    division: 3,
    name: "Platinum III",
    icon: "ri-shield-star-line",
    color: "#e5e4e2",
    bgClass: "bg-cyan-400/10",
    borderClass: "border-cyan-400/30",
    textClass: "text-cyan-300",
    rpRange: [2600, 2799],
  },
  {
    tier: "platinum",
    division: 2,
    name: "Platinum II",
    icon: "ri-shield-star-line",
    color: "#e5e4e2",
    bgClass: "bg-cyan-400/10",
    borderClass: "border-cyan-400/30",
    textClass: "text-cyan-300",
    rpRange: [2800, 2999],
  },
  {
    tier: "platinum",
    division: 1,
    name: "Platinum I",
    icon: "ri-shield-star-line",
    color: "#e5e4e2",
    bgClass: "bg-cyan-400/10",
    borderClass: "border-cyan-400/30",
    textClass: "text-cyan-300",
    rpRange: [3000, 3199],
  },
  {
    tier: "diamond",
    division: 4,
    name: "Diamond IV",
    icon: "ri-shield-flash-line",
    color: "#b9f2ff",
    bgClass: "bg-sky-400/10",
    borderClass: "border-sky-400/30",
    textClass: "text-sky-300",
    rpRange: [3200, 3399],
  },
  {
    tier: "diamond",
    division: 3,
    name: "Diamond III",
    icon: "ri-shield-flash-line",
    color: "#b9f2ff",
    bgClass: "bg-sky-400/10",
    borderClass: "border-sky-400/30",
    textClass: "text-sky-300",
    rpRange: [3400, 3599],
  },
  {
    tier: "diamond",
    division: 2,
    name: "Diamond II",
    icon: "ri-shield-flash-line",
    color: "#b9f2ff",
    bgClass: "bg-sky-400/10",
    borderClass: "border-sky-400/30",
    textClass: "text-sky-300",
    rpRange: [3600, 3799],
  },
  {
    tier: "diamond",
    division: 1,
    name: "Diamond I",
    icon: "ri-shield-flash-line",
    color: "#b9f2ff",
    bgClass: "bg-sky-400/10",
    borderClass: "border-sky-400/30",
    textClass: "text-sky-300",
    rpRange: [3800, 3999],
  },
  {
    tier: "master",
    division: 0,
    name: "Master",
    icon: "ri-star-fill",
    color: "#a855f7",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    textClass: "text-purple-400",
    rpRange: [4000, 4499],
  },
  {
    tier: "grandmaster",
    division: 0,
    name: "Grandmaster",
    icon: "ri-sparkling-fill",
    color: "#f97316",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/30",
    textClass: "text-orange-400",
    rpRange: [4500, 4999],
  },
  {
    tier: "legend",
    division: 0,
    name: "Legend",
    icon: "ri-meteor-fill",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    textClass: "text-red-400",
    rpRange: [5000, 9999],
  },
];

export function getRankByRP(rp) {
  for (let i = rankDivisions.length - 1; i >= 0; i--) {
    if (rp >= rankDivisions[i].rpRange[0]) return rankDivisions[i];
  }
  return rankDivisions[0];
}

export function getRPFromStorage() {
  try {
    const saved = localStorage.getItem("itquest_ranked_rp");
    return saved ? parseInt(saved, 10) : 800;
  } catch {
    return 800;
  }
}

export function saveRP(rp) {
  localStorage.setItem("itquest_ranked_rp", String(rp));
}

export function calculateRPGain(placement, totalPlayers, currentRP) {
  const rank = getRankByRP(currentRP);
  const baseRP =
    rank.tier === "legend" || rank.tier === "grandmaster"
      ? 15
      : rank.tier === "master" || rank.tier === "diamond"
        ? 20
        : rank.tier === "platinum"
          ? 25
          : 30;

  if (placement === 1)
    return { rpChange: Math.round(baseRP * 2.5), detail: "1st Place Victory" };
  if (placement === 2)
    return { rpChange: Math.round(baseRP * 1.8), detail: "2nd Place" };
  if (placement === 3)
    return { rpChange: Math.round(baseRP * 1.2), detail: "3rd Place" };
  if (placement <= Math.ceil(totalPlayers * 0.4))
    return { rpChange: Math.round(baseRP * 0.7), detail: "Top 40%" };
  if (placement <= Math.ceil(totalPlayers * 0.7))
    return { rpChange: -Math.round(baseRP * 0.5), detail: "Below Average" };
  return { rpChange: -Math.round(baseRP * 1.2), detail: "Bottom 30%" };
}

// ============================================================
// BATTLE MODES
// ============================================================

export const battleModes = [
  {
    id: "ranked",
    name: "Ranked Arena",
    icon: "ri-trophy-line",
    description:
      "Competitive RP battles. Climb the ranks from Bronze to Legend. Seasonal rewards and promotion matches.",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    minPlayers: 2,
    maxPlayers: 8,
  },
  {
    id: "classroom",
    name: "Classroom Battle",
    icon: "ri-school-line",
    description:
      "Faculty-created quiz rooms. Compete with your classmates in instructor-curated battles.",
    color: "#10b981",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    minPlayers: 2,
    maxPlayers: 30,
  },
  {
    id: "team",
    name: "Team Battle",
    icon: "ri-team-line",
    description:
      "3v3 or 5v5 quiz teams. Coordinate with teammates and dominate together.",
    color: "#8b5cf6",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    minPlayers: 6,
    maxPlayers: 10,
  },
  {
    id: "survival",
    name: "Survival Mode",
    icon: "ri-skull-line",
    description:
      "Elimination until one remains. Each wrong answer takes a life. Last one standing wins.",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    minPlayers: 4,
    maxPlayers: 16,
  },
  {
    id: "elite-assessment",
    name: "Elite Assessment",
    icon: "ri-medal-line",
    description:
      "Challenge an AI mentor through quizzes! Advance through assessment stages with correct answers. Stage transitions and escalating difficulty.",
    color: "#d946ef",
    bgClass: "bg-fuchsia-500/10",
    borderClass: "border-fuchsia-500/30",
    minPlayers: 1,
    maxPlayers: 1,
  },
];

// ============================================================
// POWER-UPS
// ============================================================

export const powerUps = [
  {
    id: "time-freeze",
    name: "Time Freeze",
    icon: "ri-timer-2-line",
    description: "Slow the timer for 3 seconds",
    effect: "Timer slows to 50% speed for 3s",
    color: "#0ea5e9",
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/30",
    rarity: "rare",
    unlockLevel: 3,
    maxUses: 2,
    cooldownSeconds: 60,
  },
  {
    id: "double-xp",
    name: "Double XP",
    icon: "ri-flashlight-line",
    description: "Double earned XP this question",
    effect: "2x XP multiplier for current question",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    rarity: "common",
    unlockLevel: 1,
    maxUses: 3,
    cooldownSeconds: 45,
  },
  {
    id: "shield",
    name: "Shield",
    icon: "ri-shield-check-line",
    description: "Protect your combo streak",
    effect: "Combo is not reset on wrong answer",
    color: "#10b981",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    rarity: "common",
    unlockLevel: 2,
    maxUses: 2,
    cooldownSeconds: 90,
  },
  {
    id: "reveal-hint",
    name: "Reveal Hint",
    icon: "ri-lightbulb-line",
    description: "Partial answer clue",
    effect: "Eliminates 2 wrong options (MCQ only)",
    color: "#8b5cf6",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    rarity: "rare",
    unlockLevel: 5,
    maxUses: 1,
    cooldownSeconds: 120,
  },
  {
    id: "combo-booster",
    name: "Combo Booster",
    icon: "ri-fire-line",
    description: "Temporary multiplier boost",
    effect: "+1 to combo multiplier for 2 questions",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    rarity: "epic",
    unlockLevel: 8,
    maxUses: 1,
    cooldownSeconds: 180,
  },
  {
    id: "time-bonus",
    name: "Time Bonus",
    icon: "ri-add-circle-line",
    description: "Add 10 seconds to timer",
    effect: "+10s added to question timer",
    color: "#14b8a6",
    bgClass: "bg-teal-500/10",
    borderClass: "border-teal-500/30",
    rarity: "epic",
    unlockLevel: 10,
    maxUses: 1,
    cooldownSeconds: 150,
  },
];

export function getPowerUpUses() {
  try {
    const saved = localStorage.getItem("itquest_powerup_uses");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function consumePowerUp(powerUpId) {
  const uses = getPowerUpUses();
  const powerUp = powerUps.find((p) => p.id === powerUpId);
  if (!powerUp) return false;
  const used = uses[powerUpId] || 0;
  if (used >= powerUp.maxUses) return false;
  uses[powerUpId] = used + 1;
  localStorage.setItem("itquest_powerup_uses", JSON.stringify(uses));
  return true;
}

export function resetPowerUpUses() {
  localStorage.removeItem("itquest_powerup_uses");
}

// ============================================================
// QUIZ ACHIEVEMENTS
// ============================================================

export const quizAchievements = [
  {
    id: "perfect-accuracy",
    name: "Perfect Accuracy",
    description: "Answer every question correctly in a quiz",
    icon: "ri-crosshair-line",
    color: "#10b981",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    condition: "100% correct answers in any quiz",
    reward: "+50 bonus XP & Perfectionist title",
    rarity: "epic",
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Answer correctly within 2 seconds",
    icon: "ri-flashlight-line",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    condition: "Correct answer in under 2 seconds",
    reward: "+25 bonus XP",
    rarity: "rare",
  },
  {
    id: "unstoppable-combo",
    name: "Unstoppable Combo",
    description: "Achieve a 7x combo streak",
    icon: "ri-fire-line",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    condition: "Reach 7x combo in battle",
    reward: "+100 XP & Combo King badge",
    rarity: "epic",
  },
  {
    id: "quiz-champion",
    name: "Quiz Champion",
    description: "Win 10 ranked battles",
    icon: "ri-trophy-line",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    condition: "10 ranked battle wins",
    reward: "+200 XP & Champion title",
    rarity: "legendary",
  },
  {
    id: "arena-conqueror",
    name: "Arena Conqueror",
    description: "Reach Platinum rank",
    icon: "ri-vip-crown-line",
    color: "#06b6d4",
    bgClass: "bg-cyan-500/10",
    borderClass: "border-cyan-500/30",
    condition: "Reach Platinum tier in ranked",
    reward: "+300 XP & Arena Conqueror badge",
    rarity: "legendary",
  },
  {
    id: "first-blood",
    name: "First Blood",
    description: "Win your first ranked battle",
    icon: "ri-sword-line",
    color: "#f43f5e",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    condition: "Win 1 ranked battle",
    reward: "+100 XP",
    rarity: "common",
  },
  {
    id: "hat-trick",
    name: "Hat Trick",
    description: "Win 3 ranked battles in a row",
    icon: "ri-chat-3-line",
    color: "#8b5cf6",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    condition: "3 consecutive ranked wins",
    reward: "+150 XP & Hot Streak title",
    rarity: "rare",
  },
  {
    id: "elite-assessor",
    name: "Elite Assessor",
    description: "Complete an Elite Assessment",
    icon: "ri-medal-line",
    color: "#d946ef",
    bgClass: "bg-fuchsia-500/10",
    borderClass: "border-fuchsia-500/30",
    condition: "Complete an elite assessment",
    reward: "+250 XP & Elite Assessor badge",
    rarity: "epic",
  },
  {
    id: "survivor",
    name: "Survivor",
    description: "Win a Survival Mode match",
    icon: "ri-heart-pulse-line",
    color: "#f43f5e",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    condition: "Win survival mode (last standing)",
    reward: "+200 XP & Survivor badge",
    rarity: "epic",
  },
  {
    id: "grandmaster-ascension",
    name: "Grandmaster Ascension",
    description: "Reach Grandmaster rank",
    icon: "ri-sparkling-line",
    color: "#f97316",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/30",
    condition: "Reach Grandmaster tier",
    reward: "+500 XP & Grandmaster badge",
    rarity: "legendary",
  },
  {
    id: "mastery-scholar",
    name: "Mastery Scholar",
    description: "Achieve 90%+ accuracy across all categories",
    icon: "ri-book-read-line",
    color: "#10b981",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    condition: "90%+ accuracy in 3+ categories",
    reward: "+300 XP & Mastery Scholar title",
    rarity: "legendary",
  },
  {
    id: "retry-champion",
    name: "Retry Champion",
    description: "Improve score by 30%+ on a retake",
    icon: "ri-refresh-line",
    color: "#06b6d4",
    bgClass: "bg-cyan-500/10",
    borderClass: "border-cyan-500/30",
    condition: "Retake a quiz and improve by 30%+",
    reward: "+100 XP & Growth Mindset badge",
    rarity: "rare",
  },
  {
    id: "quest-integrator",
    name: "Quest Integrator",
    description: "Complete a quiz that counts toward a quest objective",
    icon: "ri-git-branch-line",
    color: "#8b5cf6",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    condition: "Quiz completion advances quest progress",
    reward: "+150 XP & Quest Linker badge",
    rarity: "epic",
  },
];

export function getQuizAchievements() {
  try {
    const saved = localStorage.getItem("itquest_quiz_achievements");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function unlockAchievement(achievementId) {
  const achievements = getQuizAchievements();
  if (achievements.includes(achievementId)) return false;
  achievements.push(achievementId);
  localStorage.setItem(
    "itquest_quiz_achievements",
    JSON.stringify(achievements),
  );
  return true;
}

// ============================================================
// ELITE ASSESSMENTS (AI Mentor Challenges)
// ============================================================

export const eliteAssessments = [
  {
    id: "elite-cyber-warden",
    name: "Cyber Warden Assessment",
    title: "Guardian of the Digital Systems",
    description:
      "An advanced AI mentor that challenges your understanding of digital systems and security. Answer correctly to demonstrate mastery, progressing through increasingly complex assessment stages.",
    storyText:
      'The Cyber Warden AI hums with analytical precision: "Welcome, Learner. This assessment will evaluate your understanding of digital systems. Each correct answer demonstrates mastery. Each incorrect answer identifies areas for growth. Are you ready to begin your evaluation?"',
    icon: "ri-shield-user-line",
    emoji: "🤖",
    region: "Cyber Fortress",
    color: "#f43f5e",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    maxProgress: 150,
    difficulty: 3,
    linkedQuestId: "quest-security-initiate",
    linkedRegionId: "cyber-fortress",
    stages: [
      {
        stage: 1,
        name: "Foundation Evaluation",
        progressThreshold: 100,
        masteryMultiplier: 1,
        description: "Basic concepts assessed at standard difficulty.",
        specialCondition: "Standard scoring",
      },
      {
        stage: 2,
        name: "Advanced Analysis",
        progressThreshold: 50,
        masteryMultiplier: 0.7,
        description: "Assessment adapts, requiring deeper understanding.",
        specialCondition: "Questions require deeper analysis",
      },
      {
        stage: 3,
        name: "Mastery Challenge",
        progressThreshold: 25,
        masteryMultiplier: 1.5,
        description: "Final stage — prove complete mastery.",
        specialCondition: "Higher stakes — greater rewards and penalties",
      },
    ],
    dialogue: [
      {
        trigger: "intro",
        text: '"Ah, a motivated learner! My assessment modules have been calibrated. Let us evaluate your cybersecurity knowledge thoroughly."',
      },
      {
        trigger: "stage_start",
        text: '"Beginning Foundation Evaluation. Demonstrate your grasp of core concepts."',
      },
      {
        trigger: "stage_transition",
        text: '"Impressive... you demonstrated strong foundational knowledge. Now — Advanced Analysis awaits. Let us go deeper."',
      },
      {
        trigger: "student_correct",
        text: '"That response... was ACCURATE! Your understanding is solid."',
      },
      {
        trigger: "student_wrong",
        text: '"A learning opportunity identified. Review this concept and try again."',
      },
      {
        trigger: "assessment_passed",
        text: '"ASSESSMENT COMPLETE! You have demonstrated excellent understanding. Your mastery certificate has been issued."',
      },
      {
        trigger: "assessment_failed",
        text: '"ASSESSMENT PAUSED. Review the identified weak areas and attempt the evaluation again when ready."',
      },
    ],
    questions: [],
    xpReward: 400,
    badgeReward: { name: "Cyber Systems Proficient", rarity: "Epic" },
    unlockLevel: 5,
  },
  {
    id: "elite-code-dragon",
    name: "JavaScript Mastery Assessment",
    title: "Advanced JavaScript Evaluation",
    description:
      "A rigorous assessment of JavaScript knowledge. Closures, async patterns, prototypes — demonstrate that you truly understand the language at a deep level.",
    storyText:
      'The JavaScript Assessment Module activates, its algorithms calibrated for depth and precision. "Many have attempted this evaluation," it announces. "Few have achieved mastery certification. Demonstrate your understanding of the event loop, closures, and asynchronous patterns. Prove your JavaScript proficiency."',
    icon: "ri-fire-line",
    emoji: "🐉",
    region: "Frontend Kingdom",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    maxProgress: 180,
    difficulty: 4,
    linkedQuestId: "quest-js-warrior",
    linkedRegionId: "frontend-kingdom",
    stages: [
      {
        stage: 1,
        name: "Core Competency Check",
        progressThreshold: 100,
        masteryMultiplier: 1,
        description: "Core JS concepts evaluated.",
        specialCondition: "Standard scoring",
      },
      {
        stage: 2,
        name: "Deep Knowledge Probe",
        progressThreshold: 50,
        masteryMultiplier: 0.6,
        description: "Advanced concepts require precise answers.",
        specialCondition: "Answers must be precise",
      },
      {
        stage: 3,
        name: "Expert-Level Challenge",
        progressThreshold: 20,
        masteryMultiplier: 1.8,
        description: "Expert-level JavaScript — highest stakes.",
        specialCondition: "High risk, high reward",
      },
    ],
    dialogue: [
      {
        trigger: "intro",
        text: '"Another aspiring developer seeks certification. Let us evaluate your JavaScript knowledge with precision."',
      },
      {
        trigger: "stage_start",
        text: '"Let us begin with core concepts. Explain `this` binding, if you can."',
      },
      {
        trigger: "stage_transition",
        text: '"You understand closures?! Excellent — now let us examine PROTOTYPAL INHERITANCE in depth!"',
      },
      {
        trigger: "student_correct",
        text: '"PRECISE ANSWER! Your JavaScript knowledge runs deep..."',
      },
      {
        trigger: "student_wrong",
        text: '"An error in reasoning. I recommend reviewing the MDN documentation on this concept."',
      },
      {
        trigger: "assessment_passed",
        text: '"You... understood the event loop?! Mastery certification granted. The JavaScript evaluation is complete."',
      },
      {
        trigger: "assessment_failed",
        text: '"Your understanding has gaps. Review the identified topics and reattempt the assessment."',
      },
    ],
    questions: [],
    xpReward: 500,
    badgeReward: { name: "JavaScript Proficient", rarity: "Epic" },
    unlockLevel: 8,
  },
  {
    id: "elite-data-leviathan",
    name: "Database Mastery Assessment",
    title: "Advanced Database Knowledge Evaluation",
    description:
      "A comprehensive assessment of database knowledge. Complex JOINs, recursive CTEs, normalization, indexing — prove your data management expertise.",
    storyText:
      'The Database Assessment Module activates from the Data Vault archives, its knowledge base spanning centuries of SQL wisdom. "SELECT your understanding," it declares. "Your queries must be optimized, your schemas properly normalized. Demonstrate comprehensive database mastery."',
    icon: "ri-database-2-line",
    emoji: "🐋",
    region: "Data Vault",
    color: "#8b5cf6",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    maxProgress: 200,
    difficulty: 4,
    linkedQuestId: "quest-sql-apprentice",
    linkedRegionId: "data-vault",
    stages: [
      {
        stage: 1,
        name: "Fundamental Query Check",
        progressThreshold: 100,
        masteryMultiplier: 1,
        description: "Basic SQL knowledge evaluated.",
        specialCondition: "Standard scoring",
      },
      {
        stage: 2,
        name: "Relational Understanding",
        progressThreshold: 50,
        masteryMultiplier: 0.7,
        description: "Complex relationships tested.",
        specialCondition: "Relationships must be precise",
      },
      {
        stage: 3,
        name: "Database Architecture Challenge",
        progressThreshold: 20,
        masteryMultiplier: 1.6,
        description: "Architecture-level understanding required.",
        specialCondition: "Highest difficulty tier",
      },
    ],
    dialogue: [
      {
        trigger: "intro",
        text: '"A new learner approaches database certification! Have you studied normalization principles?"',
      },
      {
        trigger: "stage_start",
        text: '"Let us start with fundamentals. What does a well-formed SELECT query demonstrate?"',
      },
      {
        trigger: "stage_transition",
        text: '"Your queries are optimized?! Then face the RECURSIVE CTE challenge!"',
      },
      {
        trigger: "student_correct",
        text: '"A PERFECT JOIN demonstration! Your relational understanding is formidable!"',
      },
      {
        trigger: "student_wrong",
        text: '"Incorrect. Perhaps a LEFT JOIN to the study materials would help clarify."',
      },
      {
        trigger: "assessment_passed",
        text: '"Your schemas are normalized correctly. The Database Mastery evaluation is complete. Certification granted."',
      },
      {
        trigger: "assessment_failed",
        text: '"Your database knowledge requires strengthening. Review normalization principles and reattempt."',
      },
    ],
    questions: [],
    xpReward: 500,
    badgeReward: { name: "Database Proficient", rarity: "Epic" },
    unlockLevel: 7,
  },
];

// Legacy alias for compatibility
export const aiBosses = eliteAssessments;

// ============================================================
// CLASSROOM BATTLES (Faculty-created)
// ============================================================

export const classroomBattles = [
  {
    id: "cr-1",
    pin: "501501", // <-- 6-Digit PIN para sa UI input
    roomCode: "HTML501",
    name: "Midterm HTML Review",
    createdBy: "Prof. Reyes",
    quizId: "html-fundamentals",
    quizTitle: "HTML5 Fundamentals",
    scheduledAt: "2026-05-28T10:00:00Z",
    duration: 30,
    maxPlayers: 30,
    currentPlayers: 22,
    status: "upcoming",
    category: "Frontend",
  },
  {
    id: "cr-2",
    pin: "424242", // <-- 6-Digit PIN para sa UI input
    roomCode: "ASYNC42",
    name: "JS Async Battle",
    createdBy: "Prof. Santos",
    quizId: "js-core-concepts",
    quizTitle: "JavaScript Core Concepts",
    scheduledAt: "2026-05-28T14:00:00Z",
    duration: 25,
    maxPlayers: 25,
    currentPlayers: 18,
    status: "upcoming",
    category: "Frontend",
  },
  {
    id: "cr-3",
    pin: "999999", // <-- 6-Digit PIN para sa UI input
    roomCode: "SQL999",
    name: "SQL Showdown",
    createdBy: "Prof. Mercado",
    quizId: "sql-essentials",
    quizTitle: "SQL Essentials",
    scheduledAt: "2026-05-29T09:00:00Z",
    duration: 20,
    maxPlayers: 20,
    currentPlayers: 15,
    status: "upcoming",
    category: "Database",
  },
  {
    id: "cr-4",
    pin: "777777", // <-- 6-Digit PIN para sa UI input
    roomCode: "SEC777",
    name: "Security Sprint",
    createdBy: "Prof. Torres",
    quizId: "cybersecurity-basics",
    quizTitle: "Cybersecurity Basics",
    scheduledAt: "2026-05-27T15:00:00Z",
    duration: 15,
    maxPlayers: 20,
    currentPlayers: 20,
    status: "live",
    category: "Cybersecurity",
  },
];

// ============================================================
// SEASON DATA
// ============================================================

export const currentSeason = {
  id: "season-1",
  name: "Season 1: The Awakening",
  startDate: "2026-05-01",
  endDate: "2026-06-30",
  daysRemaining: 34,
  reward: "Exclusive Season 1 Badge + 500 XP",
};

// ============================================================
// TOP RANKED PLAYERS
// ============================================================

export const topRankedPlayers = [
  {
    id: "rp-1",
    name: "Maria Santos",
    rank: "grandmaster",
    division: "Grandmaster",
    rp: 4780,
    wins: 142,
    losses: 38,
    winRate: 79,
    level: 32,
    isCurrentUser: false,
  },
  {
    id: "rp-2",
    name: "Juan Dela Cruz",
    rank: "master",
    division: "Master",
    rp: 4350,
    wins: 128,
    losses: 45,
    winRate: 74,
    level: 28,
    isCurrentUser: false,
  },
  {
    id: "rp-3",
    name: "Angela Reyes",
    rank: "master",
    division: "Master",
    rp: 4210,
    wins: 115,
    losses: 42,
    winRate: 73,
    level: 26,
    isCurrentUser: false,
  },
  {
    id: "rp-4",
    name: "Paolo Garcia",
    rank: "diamond",
    division: "Diamond I",
    rp: 3950,
    wins: 98,
    losses: 40,
    winRate: 71,
    level: 24,
    isCurrentUser: false,
  },
  {
    id: "rp-5",
    name: "Sofia Mendoza",
    rank: "diamond",
    division: "Diamond III",
    rp: 3520,
    wins: 88,
    losses: 44,
    winRate: 67,
    level: 22,
    isCurrentUser: false,
  },
  {
    id: "rp-6",
    name: "Rafael Lim",
    rank: "platinum",
    division: "Platinum I",
    rp: 3150,
    wins: 72,
    losses: 38,
    winRate: 65,
    level: 20,
    isCurrentUser: false,
  },
  {
    id: "rp-7",
    name: "Bea Villanueva",
    rank: "platinum",
    division: "Platinum II",
    rp: 2890,
    wins: 65,
    losses: 35,
    winRate: 65,
    level: 18,
    isCurrentUser: false,
  },
  {
    id: "rp-8",
    name: "Diego Torres",
    rank: "gold",
    division: "Gold I",
    rp: 2350,
    wins: 52,
    losses: 30,
    winRate: 63,
    level: 16,
    isCurrentUser: false,
  },
  {
    id: "rp-9",
    name: "Camille Ong",
    rank: "silver",
    division: "Silver II",
    rp: 1350,
    wins: 28,
    losses: 22,
    winRate: 56,
    level: 14,
    isCurrentUser: false,
  },
  {
    id: "rp-current-user",
    name: "You",
    rank: "gold",
    division: "Gold III",
    rp: 1950,
    wins: 42,
    losses: 28,
    winRate: 60,
    level: 15,
    isCurrentUser: true,
  },
];

// ============================================================
// MASTERY ANALYTICS & PROGRESSION INTEGRATION
// ============================================================

export interface TopicMastery {
  topic: string;
  category: string;
  accuracy: number;
  questionsAttempted: number;
  lastAttempted: string;
  strength: "mastered" | "proficient" | "developing" | "weak";
}

export interface CategoryAccuracy {
  category: string;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTime: number;
  trend: "improving" | "stable" | "declining";
}

export interface RetryRecord {
  quizId: string;
  attemptNumber: number;
  previousScore: number;
  currentScore: number;
  improvement: number;
  timestamp: string;
  timeSpent: number;
}

export interface RecommendedReview {
  lessonId: string;
  lessonTitle: string;
  category: string;
  reason: string;
  weakTopics: string[];
  priority: "high" | "medium";
}

export function getTopicMastery() {
  try {
    const stored = localStorage.getItem("itquest_topic_mastery");
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }

  return [
    {
      topic: "HTML5 Semantics",
      category: "Frontend",
      accuracy: 85,
      questionsAttempted: 24,
      lastAttempted: "2026-05-26",
      strength: "proficient",
    },
    {
      topic: "CSS Flexbox & Grid",
      category: "Frontend",
      accuracy: 72,
      questionsAttempted: 18,
      lastAttempted: "2026-05-25",
      strength: "developing",
    },
    {
      topic: "JavaScript Closures",
      category: "Frontend",
      accuracy: 45,
      questionsAttempted: 12,
      lastAttempted: "2026-05-24",
      strength: "weak",
    },
    {
      topic: "Async/Await Patterns",
      category: "Frontend",
      accuracy: 58,
      questionsAttempted: 10,
      lastAttempted: "2026-05-23",
      strength: "weak",
    },
    {
      topic: "React Hooks",
      category: "Frontend",
      accuracy: 90,
      questionsAttempted: 16,
      lastAttempted: "2026-05-26",
      strength: "mastered",
    },
    {
      topic: "SQL JOINs",
      category: "Database",
      accuracy: 78,
      questionsAttempted: 20,
      lastAttempted: "2026-05-25",
      strength: "proficient",
    },
    {
      topic: "Database Normalization",
      category: "Database",
      accuracy: 65,
      questionsAttempted: 14,
      lastAttempted: "2026-05-22",
      strength: "developing",
    },
    {
      topic: "Indexing Strategies",
      category: "Database",
      accuracy: 60,
      questionsAttempted: 9,
      lastAttempted: "2026-05-23",
      strength: "developing",
    },
    {
      topic: "Backup & Recovery Types",
      category: "Database",
      accuracy: 52,
      questionsAttempted: 7,
      lastAttempted: "2026-05-21",
      strength: "developing",
    },
    {
      topic: "REST API Design",
      category: "Backend",
      accuracy: 82,
      questionsAttempted: 16,
      lastAttempted: "2026-05-24",
      strength: "proficient",
    },
    {
      topic: "HTTP Methods & Status",
      category: "Backend",
      accuracy: 88,
      questionsAttempted: 22,
      lastAttempted: "2026-05-26",
      strength: "mastered",
    },
    {
      topic: "API Authentication",
      category: "Backend",
      accuracy: 68,
      questionsAttempted: 5,
      lastAttempted: "2026-05-22",
      strength: "developing",
    },
    {
      topic: "XSS Prevention",
      category: "Cybersecurity",
      accuracy: 55,
      questionsAttempted: 8,
      lastAttempted: "2026-05-20",
      strength: "weak",
    },
    {
      topic: "SQL Injection Defense",
      category: "Cybersecurity",
      accuracy: 70,
      questionsAttempted: 10,
      lastAttempted: "2026-05-21",
      strength: "developing",
    },
    {
      topic: "CSRF Protection",
      category: "Cybersecurity",
      accuracy: 58,
      questionsAttempted: 6,
      lastAttempted: "2026-05-21",
      strength: "developing",
    },
    {
      topic: "Design Thinking",
      category: "UI/UX",
      accuracy: 92,
      questionsAttempted: 12,
      lastAttempted: "2026-05-25",
      strength: "mastered",
    },
  ];
}

export function saveTopicMastery(data) {
  localStorage.setItem("itquest_topic_mastery", JSON.stringify(data));
}

export function getCategoryAccuracy() {
  try {
    const stored = localStorage.getItem("itquest_category_accuracy");
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }

  return [
    {
      category: "Frontend",
      accuracy: 72,
      totalQuestions: 80,
      correctAnswers: 58,
      averageTime: 12.5,
      trend: "improving",
    },
    {
      category: "Backend",
      accuracy: 85,
      totalQuestions: 38,
      correctAnswers: 32,
      averageTime: 10.2,
      trend: "stable",
    },
    {
      category: "Database",
      accuracy: 68,
      totalQuestions: 34,
      correctAnswers: 23,
      averageTime: 14.8,
      trend: "improving",
    },
    {
      category: "Cybersecurity",
      accuracy: 61,
      totalQuestions: 18,
      correctAnswers: 11,
      averageTime: 16.3,
      trend: "declining",
    },
    {
      category: "UI/UX",
      accuracy: 92,
      totalQuestions: 12,
      correctAnswers: 11,
      averageTime: 8.7,
      trend: "stable",
    },
    {
      category: "Full Stack",
      accuracy: 76,
      totalQuestions: 22,
      correctAnswers: 17,
      averageTime: 13.1,
      trend: "improving",
    },
  ];
}

export function saveCategoryAccuracy(data: CategoryAccuracy[]): void {
  localStorage.setItem("itquest_category_accuracy", JSON.stringify(data));
}

export function getRetryRecords() {
  try {
    const stored = localStorage.getItem("itquest_retry_records");
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }

  return [
    {
      quizId: "html-fundamentals",
      attemptNumber: 2,
      previousScore: 62,
      currentScore: 88,
      improvement: 26,
      timestamp: "2026-05-20",
      timeSpent: 280,
    },
    {
      quizId: "css-mastery",
      attemptNumber: 2,
      previousScore: 55,
      currentScore: 79,
      improvement: 24,
      timestamp: "2026-05-22",
      timeSpent: 320,
    },
    {
      quizId: "js-core-concepts",
      attemptNumber: 3,
      previousScore: 48,
      currentScore: 72,
      improvement: 24,
      timestamp: "2026-05-24",
      timeSpent: 420,
    },
  ];
}

export function getRecommendedReviews() {
  const mastery = getTopicMastery();
  const weakTopics = mastery.filter(
    (t) => t.strength === "weak" || t.strength === "developing",
  );

  const topicLessonMap = {
    "JavaScript Closures": {
      lessonId: "frontend-3",
      lessonTitle: "JavaScript Basics",
      category: "Frontend",
    },
    "Async/Await Patterns": {
      lessonId: "frontend-3",
      lessonTitle: "JavaScript Basics",
      category: "Frontend",
    },
    "CSS Flexbox & Grid": {
      lessonId: "frontend-2",
      lessonTitle: "CSS Fundamentals",
      category: "Frontend",
    },
    "Database Normalization": {
      lessonId: "database-1",
      lessonTitle: "Introduction to Databases",
      category: "Database",
    },
    "XSS Prevention": {
      lessonId: "cybersec-1",
      lessonTitle: "Cybersecurity Fundamentals",
      category: "Cybersecurity",
    },
    "SQL Injection Defense": {
      lessonId: "cybersec-1",
      lessonTitle: "Cybersecurity Fundamentals",
      category: "Cybersecurity",
    },
  };

  const recommendations = [];
  for (const topic of weakTopics.slice(0, 4)) {
    const lesson = topicLessonMap[topic.topic];
    if (
      lesson &&
      !recommendations.find((r) => r.lessonId === lesson.lessonId)
    ) {
      recommendations.push({
        lessonId: lesson.lessonId,
        lessonTitle: lesson.lessonTitle,
        category: lesson.category,
        reason: `Improve ${topic.topic} (current accuracy: ${topic.accuracy}%)`,
        weakTopics: [topic.topic],
        priority: topic.strength === "weak" ? "high" : "medium",
      });
    }
  }
  return recommendations;
}

export function getQuizQuestLinks() {
  return [
    {
      quizId: "html-fundamentals",
      questId: "quest-html-apprentice",
      questTitle: "HTML Apprentice: The First Gate",
      questObjective: "Complete HTML lesson & quiz",
      requiredScore: 70,
      isCompleted: true,
    },
    {
      quizId: "css-mastery",
      questId: "quest-css-foundations",
      questTitle: "CSS Foundations",
      questObjective: "Prove CSS mastery",
      requiredScore: 70,
      isCompleted: true,
    },
    {
      quizId: "js-core-concepts",
      questId: "quest-js-warrior",
      questTitle: "JavaScript: Path of the Warrior",
      questObjective: "Pass JS quiz with 80%",
      requiredScore: 80,
      isCompleted: false,
    },
    {
      quizId: "react-deep-dive",
      questId: "quest-react-frontiers",
      questTitle: "React Frontiers",
      questObjective: "Complete React assessment",
      requiredScore: 70,
      isCompleted: false,
    },
    {
      quizId: "sql-essentials",
      questId: "quest-sql-apprentice",
      questTitle: "SQL Apprentice: The Ancient Tongue",
      questObjective: "Complete SQL fundamentals quiz",
      requiredScore: 70,
      isCompleted: true,
    },
    {
      quizId: "cybersecurity-basics",
      questId: "quest-security-initiate",
      questTitle: "Security Initiation",
      questObjective: "Pass security fundamentals quiz",
      requiredScore: 70,
      isCompleted: false,
    },
    {
      quizId: "security-siege-battle",
      questId: "quest-owasp-top10",
      questTitle: "OWASP Top 10: The Sacred Vulnerabilities",
      questObjective: "Pass the Security Siege Battle (60%)",
      requiredScore: 60,
      isCompleted: false,
    },
    {
      quizId: "http-api-battle",
      questId: "quest-api-crafting",
      questTitle: "API Crafting: The Sacred Endpoints",
      questObjective: "Pass the HTTP & API Battle (60%)",
      requiredScore: 60,
      isCompleted: false,
    },
    {
      quizId: "sql-indexing-battle",
      questId: "quest-data-modeling",
      questTitle: "Data Modeling: Architect of Truth",
      questObjective: "Pass the SQL Indexing & Schema Battle (60%)",
      requiredScore: 60,
      isCompleted: false,
    },
  ];
}

export function getWeakTopics() {
  return getTopicMastery()
    .filter((t) => t.strength === "weak")
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getMasteredTopics() {
  return getTopicMastery().filter((t) => t.strength === "mastered");
}

export function getOverallMastery() {
  const topics = getTopicMastery();
  if (topics.length === 0) return 0;
  return Math.round(
    topics.reduce((sum, t) => sum + t.accuracy, 0) / topics.length,
  );
}

export function getRecommendedDifficulty(category) {
  const accuracy = getCategoryAccuracy();
  const catAcc = accuracy.find(
    (a) => a.category.toLowerCase() === category.toLowerCase(),
  );
  if (!catAcc) return 2;
  if (catAcc.accuracy >= 85) return 4;
  if (catAcc.accuracy >= 70) return 3;
  if (catAcc.accuracy >= 50) return 2;
  return 1;
}

// ============================================================
// QUIZ → QUEST OBJECTIVE + MASTERY TAB INTEGRATION
// Recording a finished quiz feeds the quest progress engine and
// updates the topic/category mastery shown on the Mastery tab.
// ============================================================

const quizTopicMap: Record<string, string[]> = {
  "sql-indexing-battle": [
    "SQL JOINs",
    "Database Normalization",
    "Indexing Strategies",
    "Backup & Recovery Types",
  ],
  "database-duel": ["SQL JOINs", "Database Normalization"],
  "sql-essentials": ["SQL JOINs"],
  "http-api-battle": [
    "HTTP Methods & Status",
    "REST API Design",
    "API Authentication",
  ],
  "cybersecurity-basics": ["XSS Prevention", "SQL Injection Defense"],
  "security-siege-battle": [
    "XSS Prevention",
    "SQL Injection Defense",
    "CSRF Protection",
  ],
};

function strengthFromAccuracy(accuracy: number): TopicMastery["strength"] {
  if (accuracy >= 85) return "mastered";
  if (accuracy >= 70) return "proficient";
  if (accuracy >= 50) return "developing";
  return "weak";
}

export interface QuizAttemptRecord {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  won: boolean;
  type: string;
  category: string;
  timestamp: string;
  attemptNumber: number;
  recordedAt: number;
}

export function getStoredQuizResults(): QuizAttemptRecord[] {
  try {
    const raw = localStorage.getItem("itquest_quiz_results");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getQuizResultsMap(): Record<string, number> {
  const map: Record<string, number> = {};
  getStoredQuizResults().forEach((r) => {
    map[r.quizId] = Math.max(map[r.quizId] || 0, r.percentage);
  });
  return map;
}

function applyTopicMasteryImpact(
  quizId: string,
  category: string,
  percentage: number,
  attemptCount: number,
): void {
  const affected = quizTopicMap[quizId];
  if (!affected || affected.length === 0) return;
  const topics = getTopicMastery();
  const today = new Date().toISOString().slice(0, 10);
  affected.forEach((name) => {
    const idx = topics.findIndex((t) => t.topic === name);
    if (idx === -1) {
      topics.push({
        topic: name,
        category,
        accuracy: percentage,
        questionsAttempted: attemptCount,
        lastAttempted: today,
        strength: strengthFromAccuracy(percentage),
      });
    } else {
      const t = topics[idx];
      const newAcc = Math.round(t.accuracy * 0.5 + percentage * 0.5);
      topics[idx] = {
        ...t,
        accuracy: newAcc,
        questionsAttempted: t.questionsAttempted + attemptCount,
        lastAttempted: today,
        strength: strengthFromAccuracy(newAcc),
      };
    }
  });
  saveTopicMastery(topics);
}

function applyCategoryAccuracyImpact(
  categoryName: string,
  percentage: number,
  attemptCount: number,
): void {
  const accuracy = getCategoryAccuracy();
  const idx = accuracy.findIndex((c) => c.category === categoryName);
  if (idx === -1) return;
  const c = accuracy[idx];
  const correct = Math.round((percentage / 100) * attemptCount);
  const newTotal = c.totalQuestions + attemptCount;
  const newCorrect = c.correctAnswers + correct;
  const newAcc = Math.round((newCorrect / newTotal) * 100);
  accuracy[idx] = {
    ...c,
    totalQuestions: newTotal,
    correctAnswers: newCorrect,
    accuracy: newAcc,
    trend:
      newAcc > c.accuracy
        ? "improving"
        : newAcc < c.accuracy
          ? "declining"
          : "stable",
  };
  saveCategoryAccuracy(accuracy);
}

export function recordQuizAttempt(params: {
  quizId: string;
  quizType: string;
  category: string;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  won: boolean;
}): void {
  const {
    quizId,
    quizType,
    category,
    correctCount,
    totalQuestions,
    percentage,
    won,
  } = params;
  const attempts = getStoredQuizResults();
  const now = Date.now();
  const lastSame = [...attempts].reverse().find((a) => a.quizId === quizId);
  // Guard against React StrictMode double-mount recording the same attempt twice
  if (
    lastSame &&
    lastSame.score === correctCount &&
    lastSame.totalQuestions === totalQuestions &&
    now - (lastSame.recordedAt || 0) < 3000
  ) {
    return;
  }
  const attemptNumber = attempts.filter((a) => a.quizId === quizId).length + 1;
  attempts.push({
    quizId,
    score: correctCount,
    totalQuestions,
    percentage,
    won,
    type: quizType,
    category,
    timestamp: new Date().toISOString().slice(0, 10),
    attemptNumber,
    recordedAt: now,
  });
  localStorage.setItem("itquest_quiz_results", JSON.stringify(attempts));
  applyTopicMasteryImpact(quizId, category, percentage, totalQuestions);
  applyCategoryAccuracyImpact(category, percentage, totalQuestions);
}
