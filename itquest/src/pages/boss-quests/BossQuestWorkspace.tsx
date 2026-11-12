import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  bossQuests,
  getBossQuestStatus,
  startBossQuest,
  saveBossQuestProgress,
  getBossQuestProgress,
  isBossQuestUnlocked,
  getBossPrerequisiteQuestNames,
  type BossQuestData,
} from '@/sampleData/bossQuestData';
import { worldRegions } from '@/sampleData/questExpandedData';
import FileTabs from '@/pages/coding/components/FileTabs';
import CodeEditor from '@/pages/coding/components/CodeEditor';
import LivePreview from '@/pages/coding/components/LivePreview';
import TestRunner from '@/pages/coding/components/TestRunner';
import BriefPanel from './components/BriefPanel';
import SubmissionModal from './components/SubmissionModal';
import RegionClearedModal from './components/RegionClearedModal';

type RightPanel = 'preview' | 'tests';
type AcceptancePhase = 'idle' | 'cinematic' | 'complete';

// Cinematic particle config
const PARTICLE_COUNT = 40;
const colors = ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#f1f5f9', '#10b981', '#34d399'];

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 1.5,
    angle: Math.random() * 360,
    distance: Math.random() * 150 + 50,
  }));
}

export default function BossQuestWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const quest = bossQuests.find((q) => q.id === id);

  const [code, setCode] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [rightPanel, setRightPanel] = useState<RightPanel>('preview');
  const [showBrief, setShowBrief] = useState(true);
  const [metRequirements, setMetRequirements] = useState<string[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showRegionCleared, setShowRegionCleared] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [acceptancePhase, setAcceptancePhase] = useState<AcceptancePhase>('idle');
  const [particles] = useState(generateParticles);

  // Compute unlocked region for Region Cleared modal
  const newlyUnlockedRegion = useMemo(() => {
    if (!quest?.unlocksRegionId) return null;
    const region = worldRegions.find((r) => r.id === quest.unlocksRegionId);
    if (!region) return null;
    return { id: region.id, name: region.name, icon: region.icon, color: region.color };
  }, [quest]);

  // Check if user even has access (unlocked)
  const unlockCheck = useMemo(() => {
    if (!quest) return null;
    return isBossQuestUnlocked(quest);
  }, [quest]);

  // Prerequisite quest names for display — must be computed before early returns
  const prerequisiteNames = useMemo(() => {
    if (!quest || !unlockCheck || unlockCheck.isUnlocked) return [];
    return getBossPrerequisiteQuestNames(quest);
  }, [quest, unlockCheck]);

  useEffect(() => {
    if (quest) {
      const initial: Record<string, string> = {};
      quest.files.forEach((f) => {
        initial[f.name] = f.content;
      });
      setCode(initial);
      setActiveFile(quest.files[0]?.name || '');

      // Load saved met requirements
      try {
        const saved = localStorage.getItem(`itquest_boss_reqs_${quest.id}`);
        if (saved) {
          setMetRequirements(JSON.parse(saved));
        }
      } catch { /* ignore */ }

      // Check if tests were already passed
      try {
        const testSaved = localStorage.getItem(`itquest_boss_tests_${quest.id}`);
        if (testSaved === 'true') {
          setAllTestsPassed(true);
        }
      } catch { /* ignore */ }

      // Check if already in progress
      const currentStatus = getBossQuestStatus(quest.id);
      if (currentStatus !== 'available') {
        setAcceptancePhase('complete');
      }
    }
  }, [quest]);

  const status = quest ? getBossQuestStatus(quest.id) : 'available';

  const handleCodeChange = useCallback(
    (fileName: string, value: string) => {
      setCode((prev) => ({ ...prev, [fileName]: value }));
    },
    []
  );

  const handleStartQuest = useCallback(() => {
    if (quest) {
      startBossQuest(quest.id);
      setAcceptancePhase('cinematic');

      setTimeout(() => {
        setAcceptancePhase('complete');
      }, 4200);
    }
  }, [quest]);

  const handleSubmit = useCallback(() => {
    setShowSubmissionModal(true);
  }, []);

  const handleConfirmSubmission = useCallback(() => {
    if (quest) {
      const progress = getBossQuestProgress();
      const updated = progress.filter((p) => p.questId !== quest.id);
      updated.push({
        questId: quest.id,
        status: 'submitted',
        startedAt: progress.find((p) => p.questId === quest.id)?.startedAt,
        submittedAt: new Date().toISOString(),
      });
      saveBossQuestProgress(updated);
      setShowSubmissionModal(false);
      setShowRegionCleared(true);
    }
  }, [quest]);

  const handleAllTestsPassed = useCallback(() => {
    if (quest) {
      setAllTestsPassed(true);
      localStorage.setItem(`itquest_boss_tests_${quest.id}`, 'true');
      // Auto-validate all structure/output requirements when tests pass
      const autoValidatedIds = quest.requirements
        .filter((r) => r.validationType === 'structure' || r.validationType === 'output')
        .map((r) => r.id);
      setMetRequirements((prev) => {
        const merged = [...new Set([...prev, ...autoValidatedIds])];
        localStorage.setItem(`itquest_boss_reqs_${quest.id}`, JSON.stringify(merged));
        return merged;
      });
    }
  }, [quest]);

  const handleResetCode = () => {
    if (quest) {
      const initial: Record<string, string> = {};
      quest.files.forEach((f) => {
        initial[f.name] = f.content;
      });
      setCode(initial);
    }
  };

  if (!quest) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <i className="ri-error-warning-line text-4xl text-quest-textDim block mb-3" />
          <h2 className="text-xl font-bold text-quest-text mb-2">Boss Quest Not Found</h2>
          <p className="text-sm text-quest-textMuted mb-4">This boss quest doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/boss-quests')}
            className="px-5 py-2 rounded-lg bg-quest-danger text-white text-sm font-semibold hover:bg-quest-dangerGlow transition-colors whitespace-nowrap"
          >
            Back to Boss Quests
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ╔══════════════════════════════════════════════════════════╗
  // ║ ACCESS CONTROL — Locked state for unmet prerequisites   ║
  // ╚══════════════════════════════════════════════════════════╝
  const isAccessLocked = !unlockCheck?.isUnlocked;

  if (isAccessLocked && unlockCheck) {
    const region = worldRegions.find((r) => r.id === quest.regionId);
    const regionColor = region?.color || '#f43f5e';

    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-0px)] lg:h-screen flex flex-col">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-quest-card border-b border-quest-border">
            <button
              onClick={() => navigate('/boss-quests')}
              className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors"
            >
              <i className="ri-arrow-left-line" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-quest-text flex items-center gap-2">
                <i className="ri-lock-line text-quest-textDim" />
                {quest.title}
              </h2>
              <p className="text-[11px] text-quest-textDim">{quest.regionName} • Locked</p>
            </div>
          </div>

          {/* Locked cinematic screen */}
          <div className="flex-1 flex items-center justify-center bg-[#0d0d14] relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-radial from-quest-textDim/5 via-transparent to-transparent" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[600px] h-[600px] rounded-full border border-quest-border/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[450px] h-[450px] rounded-full border border-quest-border/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            <div className="text-center max-w-xl px-6 relative z-10">
              {/* Lock emblem */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-quest-bg to-quest-card border-2 border-quest-border flex items-center justify-center mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 rounded-3xl bg-quest-border/5" />
                <motion.i
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="ri-lock-line text-5xl text-quest-textDim relative z-10"
                />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-quest-textDim mb-3 block">
                  Access Denied
                </span>
                <h1 className="text-3xl font-black text-quest-text font-display tracking-wider mb-3">
                  REGION LOCKED
                </h1>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-quest-border to-transparent mb-6"
                />
              </motion.div>

              {/* Quest title */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-base font-semibold text-quest-textMuted mb-3"
              >
                {quest.title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-xs text-quest-textDim leading-relaxed mb-8 max-w-md mx-auto"
              >
                This Boss Quest requires you to complete prerequisite quests in the Quest Path before you can access the workspace. Return to the Quest Hub and clear the required quests.
              </motion.p>

              {/* Unlock requirements grid */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 max-w-md mx-auto"
              >
                <div className={`p-3 rounded-xl border text-center ${unlockCheck.questsCompleted >= unlockCheck.questsRequired ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/20'}`}>
                  <div className={`text-lg font-bold ${unlockCheck.questsCompleted >= unlockCheck.questsRequired ? 'text-emerald-400' : 'text-quest-textDim'}`}>
                    {unlockCheck.questsCompleted}/{unlockCheck.questsRequired}
                  </div>
                  <div className="text-[10px] text-quest-textDim">Quests</div>
                </div>
                <div className={`p-3 rounded-xl border text-center ${unlockCheck.xpCurrent >= unlockCheck.xpRequired ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/20'}`}>
                  <div className={`text-lg font-bold ${unlockCheck.xpCurrent >= unlockCheck.xpRequired ? 'text-emerald-400' : 'text-quest-textDim'}`}>
                    {unlockCheck.xpCurrent}/{unlockCheck.xpRequired}
                  </div>
                  <div className="text-[10px] text-quest-textDim">XP</div>
                </div>
                <div className={`p-3 rounded-xl border text-center ${unlockCheck.levelCurrent >= unlockCheck.levelRequired ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/20'}`}>
                  <div className={`text-lg font-bold ${unlockCheck.levelCurrent >= unlockCheck.levelRequired ? 'text-emerald-400' : 'text-quest-textDim'}`}>
                    Lv.{unlockCheck.levelCurrent}→{unlockCheck.levelRequired}
                  </div>
                  <div className="text-[10px] text-quest-textDim">Level</div>
                </div>
                <div className={`p-3 rounded-xl border text-center ${unlockCheck.streakCurrent >= unlockCheck.streakRequired ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/20'}`}>
                  <div className={`text-lg font-bold ${unlockCheck.streakCurrent >= unlockCheck.streakRequired ? 'text-emerald-400' : 'text-quest-textDim'}`}>
                    {unlockCheck.streakCurrent}/{unlockCheck.streakRequired}d
                  </div>
                  <div className="text-[10px] text-quest-textDim">Streak</div>
                </div>
              </motion.div>

              {/* Missing quests */}
              {unlockCheck.missingQuestIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="mb-8 max-w-md mx-auto"
                >
                  <p className="text-[10px] text-quest-textDim uppercase tracking-wider mb-3">Missing Prerequisites</p>
                  <div className="space-y-1.5">
                    {unlockCheck.missingQuestIds.map((qid, i) => (
                      <div key={qid} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-quest-bg/30 border border-quest-border/30">
                        <span className="w-5 h-5 rounded-full bg-quest-border/20 border border-quest-border/30 flex items-center justify-center flex-shrink-0">
                          <i className="ri-close-line text-[10px] text-quest-textDim" />
                        </span>
                        <span className="text-quest-textDim">{prerequisiteNames[i] || qid}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Progress percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="max-w-xs mx-auto mb-8"
              >
                <div className="flex items-center justify-between text-[10px] text-quest-textDim mb-2">
                  <span>Unlock Progress</span>
                  <span>
                    {unlockCheck.questsCompleted + (unlockCheck.xpCurrent >= unlockCheck.xpRequired ? 1 : 0) + (unlockCheck.levelCurrent >= unlockCheck.levelRequired ? 1 : 0) + (unlockCheck.streakCurrent >= unlockCheck.streakRequired ? 1 : 0)}
                    /{unlockCheck.questsRequired + (unlockCheck.xpRequired > 0 ? 1 : 0) + (unlockCheck.levelRequired > 1 ? 1 : 0) + (unlockCheck.streakRequired > 0 ? 1 : 0)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-quest-border/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(() => {
                      const total = unlockCheck.questsRequired + (unlockCheck.xpRequired > 0 ? 1 : 0) + (unlockCheck.levelRequired > 1 ? 1 : 0) + (unlockCheck.streakRequired > 0 ? 1 : 0);
                      const met = unlockCheck.questsCompleted + (unlockCheck.xpCurrent >= unlockCheck.xpRequired ? 1 : 0) + (unlockCheck.levelCurrent >= unlockCheck.levelRequired ? 1 : 0) + (unlockCheck.streakCurrent >= unlockCheck.streakRequired ? 1 : 0);
                      return total > 0 ? Math.round((met / total) * 100) : 0;
                    })()}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-quest-textDim to-quest-border"
                  />
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 }}
                className="flex items-center justify-center gap-3"
              >
                <button
                  onClick={() => navigate('/quests')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-compass-3-line" />
                  Quest Hub
                </button>
                <button
                  onClick={() => navigate('/boss-quests')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-quest-bg border border-quest-border text-quest-textDim hover:text-quest-text text-sm transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-arrow-left-line" />
                  Back
                </button>
              </motion.div>
            </div>

            {/* Edge vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const activeFileObj = quest.files.find((f) => f.name === activeFile);
  const activeLanguage = activeFileObj?.language || 'javascript';
  const metCount = metRequirements.length;
  const allMet = metCount >= quest.requirements.filter(r => r.isAutoValidated).length;

  const isWorkspaceVisible = acceptancePhase === 'complete';

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-0px)] lg:h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-quest-card border-b border-quest-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/boss-quests')}
              className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors"
            >
              <i className="ri-arrow-left-line" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-quest-text flex items-center gap-2">
                <i className="ri-fire-line text-quest-danger" />
                {quest.title}
              </h2>
              <div className="text-[11px] text-quest-textDim flex items-center gap-2">
                <span>{quest.categoryName}</span>
                <span>•</span>
                <span className="text-quest-gold">{quest.xpReward} XP</span>
                {status === 'submitted' && (
                  <span className="text-cyan-400">• Submitted</span>
                )}
                {(status === 'approved' || status === 'completed') && (
                  <span className="text-emerald-400">• Completed</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Req progress badge */}
            {status === 'in_progress' && isWorkspaceVisible && (
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-quest-textDim bg-quest-bg border border-quest-border rounded-full px-3 py-1.5">
                <i className="ri-list-check-3" />
                {metCount}/{quest.requirements.length} reqs
              </span>
            )}

            {isWorkspaceVisible && (
              <>
                <button
                  onClick={() => setShowBrief(!showBrief)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    showBrief
                      ? 'bg-quest-danger/10 text-quest-danger border border-quest-danger/30'
                      : 'bg-quest-bg border border-quest-border text-quest-textDim hover:text-quest-text'
                  }`}
                >
                  <i className="ri-file-list-3-line" />
                  <span className="hidden sm:inline">Brief</span>
                </button>
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-bg border border-quest-border text-xs text-quest-textDim hover:text-quest-text transition-all whitespace-nowrap"
                >
                  <i className="ri-refresh-line" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <div className="flex items-center rounded-lg bg-quest-bg border border-quest-border overflow-hidden">
                  <button
                    onClick={() => setRightPanel('preview')}
                    className={`px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                      rightPanel === 'preview'
                        ? 'bg-quest-primary/10 text-quest-primary'
                        : 'text-quest-textDim hover:text-quest-text'
                    }`}
                  >
                    <i className="ri-eye-line mr-1" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={() => setRightPanel('tests')}
                    className={`px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                      rightPanel === 'tests'
                        ? 'bg-quest-primary/10 text-quest-primary'
                        : 'text-quest-textDim hover:text-quest-text'
                    }`}
                  >
                    <i className="ri-test-tube-line mr-1" />
                    <span className="hidden sm:inline">Tests</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Brief */}
          <AnimatePresence>
            {showBrief && isWorkspaceVisible && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-r border-quest-border bg-quest-card overflow-hidden flex-shrink-0 hidden lg:block"
              >
                <BriefPanel
                  quest={quest}
                  metRequirements={metRequirements}
                  onStartQuest={handleStartQuest}
                  onSubmit={handleSubmit}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center: Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            {acceptancePhase === 'idle' ? (
              /* Available state - show cinematic acceptance prompt */
              <div className="flex-1 flex items-center justify-center bg-[#0d0d14] relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-radial from-quest-danger/5 via-transparent to-transparent" />

                {/* Floating accent rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[500px] h-[500px] rounded-full border border-quest-danger/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[400px] h-[400px] rounded-full border border-quest-gold/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />

                <div className="text-center max-w-md px-6 relative z-10">
                  {/* Boss emblem */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-quest-danger/20 to-quest-danger/5 border-2 border-quest-danger/30 flex items-center justify-center mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-quest-danger/10 to-transparent animate-pulse-slow" />
                    <i className="ri-fire-fill text-5xl text-quest-danger relative z-10" />
                  </motion.div>

                  {/* Quest title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-quest-danger mb-2 block">
                      Boss Quest
                    </span>
                    <h2 className="text-2xl font-bold text-quest-text mb-3 font-display tracking-wider">
                      {quest.title}
                    </h2>
                  </motion.div>

                  {/* Story text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-xs text-quest-textMuted leading-relaxed mb-6 max-w-sm mx-auto"
                  >
                    {quest.storyText}
                  </motion.p>

                  {/* Stat pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="flex items-center justify-center gap-4 mb-8"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-quest-textMuted bg-quest-card/80 border border-quest-border rounded-full px-4 py-2">
                      <i className="ri-list-check-3 text-quest-textDim" />
                      <span>{quest.requirements.length} requirements</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-quest-gold bg-quest-gold/5 border border-quest-gold/20 rounded-full px-4 py-2">
                      <i className="ri-flashlight-line" />
                      <span>{quest.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-quest-textMuted bg-quest-card/80 border border-quest-border rounded-full px-4 py-2">
                      <i className="ri-timer-line text-quest-textDim" />
                      <span>{quest.deadlineDays} days</span>
                    </div>
                  </motion.div>

                  {/* Accept button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                    onClick={handleStartQuest}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-quest-danger to-quest-dangerGlow hover:from-quest-dangerGlow hover:to-quest-danger text-white text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 mx-auto group shadow-lg shadow-quest-danger/20 hover:shadow-quest-danger/40"
                  >
                    <motion.i
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="ri-fire-line text-xl"
                    />
                    <span>Accept Boss Quest</span>
                    <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-[10px] text-quest-textDim mt-4"
                  >
                    Accepting unlocks the code editor and starts your {quest.deadlineDays}-day deadline
                  </motion.p>

                  {/* Badge preview if exists */}
                  {quest.badgeReward && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quest-bg/50 border border-quest-border/50"
                    >
                      <i className="ri-medal-line text-quest-gold" />
                      <span className="text-[11px] text-quest-textMuted">
                        Reward: <span className="text-quest-text font-semibold">{quest.badgeReward.name}</span>
                        <span className="text-quest-textDim ml-1">({quest.badgeReward.rarity})</span>
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : acceptancePhase === 'cinematic' ? (
              /* Cinematic acceptance overlay */
              <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
                {/* Dark backdrop that fades in */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-black/80 z-0"
                />

                {/* Center burst glow */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 2.5, 1.8],
                    opacity: [0, 0.4, 0.15],
                  }}
                  transition={{ duration: 2, times: [0, 0.3, 1], ease: 'easeOut' }}
                  className="absolute w-64 h-64 rounded-full bg-gradient-radial from-quest-danger via-quest-danger/40 to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                />

                {/* Secondary gold burst */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 3, 1.5],
                    opacity: [0, 0.3, 0.1],
                  }}
                  transition={{ duration: 2.5, delay: 0.3, times: [0, 0.3, 1], ease: 'easeOut' }}
                  className="absolute w-48 h-48 rounded-full bg-gradient-radial from-quest-gold via-quest-gold/30 to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                />

                {/* Particles */}
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: Math.cos(p.angle * (Math.PI / 180)) * p.distance,
                      y: Math.sin(p.angle * (Math.PI / 180)) * p.distance - 30,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: p.duration,
                      delay: 0.3 + p.delay,
                      ease: 'easeOut',
                    }}
                    className="absolute top-1/2 left-1/2 rounded-full z-10"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                    }}
                  />
                ))}

                {/* Central content */}
                <div className="relative z-20 text-center">
                  {/* Fire ring */}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 100, damping: 12 }}
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-quest-danger/30 via-quest-danger/15 to-transparent border-2 border-quest-danger/40 flex items-center justify-center mx-auto mb-6 relative"
                  >
                    <motion.div
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-quest-danger/10"
                    />
                    <i className="ri-fire-fill text-6xl text-quest-danger relative z-10" />
                  </motion.div>

                  {/* QUEST ACCEPTED text */}
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.0, type: 'spring', stiffness: 120, damping: 12 }}
                  >
                    <h1 className="text-5xl font-black text-white font-display tracking-widest mb-2">
                      QUEST
                      <span className="text-quest-gold"> ACCEPTED</span>
                    </h1>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                      className="h-0.5 w-48 mx-auto bg-gradient-to-r from-transparent via-quest-danger to-transparent mb-6"
                    />
                  </motion.div>

                  {/* Quest name */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    className="text-lg font-semibold text-quest-textMuted mb-4"
                  >
                    {quest.title}
                  </motion.p>

                  {/* Rewards strip */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1, duration: 0.5 }}
                    className="flex items-center justify-center gap-3 mb-6"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quest-gold/10 border border-quest-gold/20">
                      <i className="ri-flashlight-line text-quest-gold text-lg" />
                      <span className="text-quest-gold font-bold text-lg">+{quest.xpReward} XP</span>
                    </div>
                    {quest.badgeReward && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quest-danger/10 border border-quest-danger/20">
                        <i className="ri-medal-line text-quest-danger text-lg" />
                        <div className="text-left">
                          <span className="text-quest-text font-semibold text-sm block leading-tight">{quest.badgeReward.name}</span>
                          <span className="text-quest-textDim text-[10px]">{quest.badgeReward.rarity}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Progress bar (loading into workspace) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className="max-w-xs mx-auto"
                  >
                    <p className="text-[10px] text-quest-textDim mb-2 tracking-wider uppercase">Preparing your workspace</p>
                    <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 2.8, duration: 1.2, ease: 'easeInOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-quest-danger via-quest-gold to-quest-primary"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Edge vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 z-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-30 pointer-events-none" />
              </div>
            ) : (
              /* Workspace active */
              <>
                <FileTabs
                  files={quest.files}
                  activeFile={activeFile}
                  onSelectFile={setActiveFile}
                />
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    code={code[activeFile] || ''}
                    language={activeLanguage}
                    onChange={(value) => handleCodeChange(activeFile, value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Right panel: Preview or Tests */}
          {isWorkspaceVisible && (
            <div className="w-[380px] flex-shrink-0 border-l border-quest-border bg-quest-card flex flex-col hidden xl:flex">
              {rightPanel === 'preview' ? (
                <LivePreview
                  files={quest.files}
                  activeFile={activeFile}
                  code={code}
                />
              ) : (
                <TestRunner
                  testCases={quest.testCases}
                  files={quest.files}
                  code={code}
                  onAllPassed={handleAllTestsPassed}
                />
              )}
            </div>
          )}
        </div>

        {/* Mobile bottom panel */}
        {isWorkspaceVisible && (
          <div className="xl:hidden border-t border-quest-border bg-quest-card h-[200px]">
            {rightPanel === 'preview' ? (
              <LivePreview
                files={quest.files}
                activeFile={activeFile}
                code={code}
              />
            ) : (
              <TestRunner
                testCases={quest.testCases}
                files={quest.files}
                code={code}
                onAllPassed={handleAllTestsPassed}
              />
            )}
          </div>
        )}

        {/* Mobile brief panel (bottom sheet for lg-) */}
        {showBrief && isWorkspaceVisible && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[60vh] overflow-y-auto bg-quest-card border-t border-quest-border rounded-t-2xl">
            <div className="sticky top-0 bg-quest-card flex items-center justify-between px-4 py-3 border-b border-quest-border">
              <span className="text-xs font-semibold text-quest-text">Mission Brief</span>
              <button
                onClick={() => setShowBrief(false)}
                className="w-7 h-7 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <BriefPanel
              quest={quest}
              metRequirements={metRequirements}
              onStartQuest={handleStartQuest}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmissionModal && (
          <SubmissionModal
            quest={quest}
            metCount={metCount}
            totalReqs={quest.requirements.length}
            onConfirm={handleConfirmSubmission}
            onCancel={() => setShowSubmissionModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Region Cleared Modal */}
      <AnimatePresence>
        {showRegionCleared && (
          <RegionClearedModal
            isOpen={showRegionCleared}
            bossQuest={quest}
            newlyUnlockedRegion={newlyUnlockedRegion}
            onClose={() => { setShowRegionCleared(false); navigate('/boss-quests'); }}
            onExploreRegion={(regionId) => { setShowRegionCleared(false); navigate(`/quests?region=${regionId}`); }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}