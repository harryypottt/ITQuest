import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Quest, QuestObjective } from "@/sampleData/questData";
import { questTypeConfig } from "@/sampleData/questData";
import type {
  QuestProgressInfo,
  ObjectiveProgress,
} from "@/hooks/useQuestProgressEngine";

interface QuestDetailProps {
  quest: Quest;
  questInfo: QuestProgressInfo;
  status: "not_started" | "active" | "completed";
  completedLessonIds?: string[];
  onAccept: () => void;
  onClose: () => void;
}

const objectiveTypeMeta: Record<
  string,
  { icon: string; color: string; bg: string; label: string }
> = {
  lesson: {
    icon: "ri-book-open-line",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Lesson",
  },
  coding: {
    icon: "ri-code-box-line",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    label: "Coding",
  },
  quiz: {
    icon: "ri-brain-line",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    label: "Quiz",
  },
  boss: {
    icon: "ri-fire-line",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    label: "Boss",
  },
  xp: {
    icon: "ri-flashlight-line",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "XP",
  },
};

function ObjectiveNode({
  objective,
  progress,
  index,
  isLocked,
  isActive,
  questStatus,
  onNavigate,
}: {
  objective: QuestObjective;
  progress: ObjectiveProgress;
  index: number;
  isLocked: boolean;
  isActive: boolean;
  questStatus: string;
  onNavigate: (route: string) => void;
}) {
  const meta =
    objectiveTypeMeta[objective.objectiveType] || objectiveTypeMeta.lesson;
  const isCompleted = progress.isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 * index }}
      className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
        isLocked
          ? "border-quest-border/30 bg-quest-bg/20 opacity-40"
          : isCompleted
            ? "border-emerald-500/20 bg-emerald-500/5"
            : isActive
              ? "border-quest-primary/30 bg-quest-primary/5 ring-1 ring-quest-primary/10"
              : "border-quest-border bg-quest-card"
      }`}
    >
      <div
        className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isLocked
            ? "bg-quest-border/20 border border-quest-border/30"
            : isCompleted
              ? "bg-emerald-500/15 border-2 border-emerald-500/30"
              : "bg-quest-primary/15 border-2 border-quest-primary/40"
        }`}
      >
        {isCompleted ? (
          <i className="ri-check-line text-lg text-emerald-400" />
        ) : (
          <span className="text-sm font-bold text-quest-textMuted">
            {index + 1}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.bg} ${meta.color}`}
          >
            <i className={`${meta.icon} text-[10px]`} />
            {meta.label}
          </span>
        </div>
        <p
          className={`text-sm leading-relaxed ${isCompleted ? "text-emerald-400/80" : "text-quest-textMuted"}`}
        >
          {objective.description}
        </p>
      </div>

      {!isLocked &&
        !isCompleted &&
        isActive &&
        questStatus === "active" &&
        objective.redirectRoute && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(objective.redirectRoute!);
            }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-primary/10 border border-quest-primary/20 text-quest-primary text-xs font-semibold hover:bg-quest-primary/20 transition-all cursor-pointer"
          >
            <i className="ri-arrow-right-line text-sm" />
            {objective.redirectLabel || "Go"}
          </button>
        )}
    </motion.div>
  );
}

export default function QuestDetail({
  quest,
  questInfo,
  status,
  completedLessonIds = [],
  onAccept,
  onClose,
}: QuestDetailProps) {
  const navigate = useNavigate();
  // ✅ Safe Lookup gamit ang Record<string, any>
  const questType = quest.type || "learning";
  const typeCfg = (questTypeConfig as Record<string, any>)[questType] || {
    label: "Quest",
    bg: "bg-emerald-500/10",
    color: "text-emerald-400",
  };

  const xpReward = quest.xpReward ?? (quest as any).xp_reward ?? 0;
  const estimatedMinutes =
    quest.estimatedMinutes ?? (quest as any).estimated_minutes ?? 15;
  const storyText =
    quest.storyText ?? (quest as any).story_text ?? quest.description ?? "";
  const objectives = quest.objectives || [];

  const isActive = status === "active";
  const isCompleted = status === "completed";
 const objectiveStates = useMemo(() => {
  let previousCompleted = true;

  // 🌟 Tinitiyak na active o completed lang ang quest bago mag-check
  const isQuestStarted = status === 'active' || status === 'completed';

  return objectives.map((obj) => {
    const progress = (questInfo?.objectiveProgress || []).find((p) => p.objectiveId === obj.id);

    // 🌟 Magse-set lang na true ang Lesson Auto-check KUNG sinimulan/in-accept na ang quest
    const isLessonDone =
      isQuestStarted &&
      (obj.objectiveType === 'lesson' || obj.type === 'lesson' || (obj as any).objective_type === 'lesson') &&
      completedLessonIds?.includes(obj.targetId || (obj as any).target_id || '');

    const isCompleted = isQuestStarted && (progress?.isCompleted || isLessonDone || false);

    const isLocked = !isActive ? false : !previousCompleted;
    previousCompleted = isCompleted;

    return {
      objective: obj,
      progress: progress
        ? { ...progress, isCompleted }
        : {
            objectiveId: obj.id,
            isCompleted,
            progressPercent: isCompleted ? 100 : 0,
            progressDetail: isCompleted ? 'Completed' : 'Not started',
          },
      isLocked,
    };
  });
}, [objectives, questInfo, status, isActive, completedLessonIds]);

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-all cursor-pointer z-10"
      >
        <i className="ri-close-line" />
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeCfg.bg} ${typeCfg.color}`}
          >
            {typeCfg.label}
          </span>
          <span className="text-xs text-quest-textDim">
            {estimatedMinutes} min
          </span>
        </div>
        <h2 className="text-xl font-bold text-quest-text mb-2">
          {quest.title}
        </h2>
        <p className="text-sm text-quest-textMuted leading-relaxed">
          {quest.description}
        </p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-quest-bg/50 border border-quest-border/50 italic">
        <p className="text-sm text-quest-textDim leading-relaxed">
          {storyText}
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <h3 className="text-sm font-bold text-quest-text uppercase tracking-wider mb-2">
          Objectives
        </h3>
        {objectiveStates.map(({ objective, progress, isLocked }, i) => (
          <ObjectiveNode
            key={objective.id}
            objective={objective}
            progress={progress}
            index={i}
            isLocked={isLocked}
            isActive={isActive}
            questStatus={status}
            onNavigate={(route) => navigate(route)}
          />
        ))}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <i className="ri-flashlight-line text-amber-400" />
          <span className="text-sm font-bold text-amber-400">
            +{xpReward} XP
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isCompleted ? (
          <div className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
            Quest Completed
          </div>
        ) : !isActive ? (
          <button
            onClick={onAccept}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-quest-primary text-white font-semibold text-sm hover:shadow-lg transition-all cursor-pointer"
          >
            <i className="ri-sword-line" />
            Accept Quest
          </button>
        ) : null}
      </div>
    </div>
  );
}
