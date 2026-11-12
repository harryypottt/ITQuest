import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Quest, QuestProgress, QuestObjective } from '@/sampleData/questData';
import { getSmartContinueQuest, questTypeConfig } from '@/sampleData/questData';

interface SmartContinueButtonProps {
  questProgress: QuestProgress[];
  completedObjectiveIdsFn: (quest: Quest) => string[];
  onAcceptQuest: (quest: Quest) => void;
}

export default function SmartContinueButton({
  questProgress,
  completedObjectiveIdsFn,
  onAcceptQuest,
}: SmartContinueButtonProps) {
  const navigate = useNavigate();

  const recommendation = useMemo(
    () => getSmartContinueQuest(
      questProgress.filter((p) => p.status === 'active').map((p) => p.questId),
      completedObjectiveIdsFn,
      questProgress,
    ),
    [questProgress, completedObjectiveIdsFn],
  );

  const handleContinue = () => {
    if (!recommendation) return;

    const { quest, nextObjective, action } = recommendation;

    if (action === 'accept') {
      onAcceptQuest(quest);
      return;
    }

    // For active quests, redirect to next incomplete objective
    if (nextObjective?.redirectRoute) {
      navigate(nextObjective.redirectRoute);
      return;
    }

    // Fallback based on objective type
    if (nextObjective) {
      switch (nextObjective.objectiveType) {
        case 'lesson':
          if (nextObjective.targetId) {
            navigate(`/lessons/${nextObjective.targetId}`);
          } else {
            navigate('/lessons');
          }
          break;
        case 'coding':
          navigate('/coding');
          break;
        case 'quiz':
          navigate('/quiz-battle');
          break;
        case 'boss':
          if (nextObjective.redirectRoute) {
            navigate(nextObjective.redirectRoute);
          } else {
            navigate('/boss-quests');
          }
          break;
        default:
          navigate('/quests');
      }
      return;
    }

    // Default: go to quest detail
    navigate(`/quests/${quest.id}`);
  };

  if (!recommendation) return null;

  const { quest, nextObjective, action } = recommendation;
  const typeCfg = questTypeConfig[quest.type];

  const getActionLabel = () => {
    if (action === 'accept') return 'Begin Quest';
    if (nextObjective?.redirectLabel) return nextObjective.redirectLabel;
    if (nextObjective?.objectiveType === 'lesson') return 'Go to Lesson';
    if (nextObjective?.objectiveType === 'coding') return 'Go to Challenge';
    if (nextObjective?.objectiveType === 'quiz') return 'Go to Quiz';
    if (nextObjective?.objectiveType === 'boss') return 'Go to Boss Quest';
    return 'Continue Quest';
  };

  const getActionIcon = () => {
    if (action === 'accept') return 'ri-sword-line';
    if (nextObjective?.objectiveType === 'lesson') return 'ri-book-open-line';
    if (nextObjective?.objectiveType === 'coding') return 'ri-code-box-line';
    if (nextObjective?.objectiveType === 'quiz') return 'ri-brain-line';
    if (nextObjective?.objectiveType === 'boss') return 'ri-fire-line';
    return 'ri-play-circle-line';
  };

  return (
    <motion.button
      onClick={handleContinue}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-quest-card to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Animated background shimmer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 35%, rgba(16,185,129,0.05) 45%, rgba(16,185,129,0.1) 50%, rgba(16,185,129,0.05) 55%, transparent 65%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />

      <div className="relative w-12 h-12 rounded-xl bg-quest-primary/15 border border-quest-primary/30 flex items-center justify-center flex-shrink-0">
        <motion.i
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`${getActionIcon()} text-xl text-quest-primary`}
        />
      </div>

      <div className="relative flex-1 text-left min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.color}`}>
            {typeCfg.label}
          </span>
          {quest.rarity === 'legendary' && (
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              LEGENDARY
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-quest-text">
          {action === 'accept' ? quest.title : getActionLabel()}
        </p>
        {nextObjective && (
          <p className="text-xs text-quest-textDim truncate mt-0.5">
            {nextObjective.description}
          </p>
        )}
      </div>

      <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-quest-primary text-white text-sm font-semibold group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all whitespace-nowrap">
        <span>{getActionLabel()}</span>
        <i className="ri-arrow-right-line" />
      </div>

      {/* Pulsing dot */}
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-3 right-3 w-2 h-2 rounded-full bg-quest-primary"
      />
    </motion.button>
  );
}