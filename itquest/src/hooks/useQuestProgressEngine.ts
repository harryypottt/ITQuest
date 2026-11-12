import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchQuests, fetchUserProgress, Quest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
export interface ObjectiveProgress {
  objectiveId: string;
  isCompleted: boolean;
  progressPercent: number;
  progressDetail: string;
}

export interface QuestProgressInfo {
  quest: Quest;
  status: 'not_started' | 'active' | 'completed';
  objectiveProgress: ObjectiveProgress[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  allCompleted: boolean;
  nextObjective: any;
}

const STORAGE_KEY = 'itquest_accepted_quests';
const START_XP_KEY = 'itquest_quest_start_xp';

export const getAcceptedQuestIds = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getQuestStartXPMap = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(START_XP_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const markQuestAccepted = (questId: string | number, currentXP: number = 0) => {
  try {
    const idStr = String(questId);
    const list = getAcceptedQuestIds();
    if (!list.includes(idStr)) {
      const updated = [...list, idStr];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    const startXpMap = getQuestStartXPMap();
    if (startXpMap[idStr] === undefined) {
      startXpMap[idStr] = currentXP;
      localStorage.setItem(START_XP_KEY, JSON.stringify(startXpMap));
    }

    window.dispatchEvent(new Event('quest:accepted'));
  } catch (err) {
    console.error('Failed to mark quest as accepted:', err);
  }
};

export function useQuestProgressEngine() {
  const { user } = useAuth();
  const [questsList, setQuestsList] = useState<Quest[]>([]);
  const [userLessonProgress, setUserLessonProgress] = useState<any[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<string[]>(getAcceptedQuestIds());
  const [startXpMap, setStartXpMap] = useState<Record<string, number>>(getQuestStartXPMap());
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setAcceptedIds(getAcceptedQuestIds());
      setStartXpMap(getQuestStartXPMap());

      const [realQuests, progressData] = await Promise.all([
        fetchQuests(),
        fetchUserProgress(),
      ]);

      const rawProgress = Array.isArray(progressData)
        ? progressData
        : progressData?.data || [];

      setQuestsList(realQuests || []);
      setUserLessonProgress(rawProgress);
    } catch (err) {
      console.error('Error fetching engine data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleQuestUpdate = () => {
      setAcceptedIds(getAcceptedQuestIds());
      setStartXpMap(getQuestStartXPMap());
      refresh();
    };

    window.addEventListener('quest:completed', handleQuestUpdate);
    window.addEventListener('quest:accepted', handleQuestUpdate);
    window.addEventListener('user:stats-updated', handleQuestUpdate);

    return () => {
      window.removeEventListener('quest:completed', handleQuestUpdate);
      window.removeEventListener('quest:accepted', handleQuestUpdate);
      window.removeEventListener('user:stats-updated', handleQuestUpdate);
    };
  }, [refresh]);

  const completedLessonIds = useMemo(() => {
    return userLessonProgress
      .filter((p: any) => Boolean(p.isCompleted || p.is_completed))
      .map((p: any) => String(p.lessonId || p.lesson_id));
  }, [userLessonProgress]);

  // 🌟 FIX: Tinitiyak na maitatala itong COMPLETED kapag tapos na ang objectives o kapag unang quest
  const isQuestDone = useCallback(
    (q: any, isFirstQuest: boolean = false) => {
      if (q.status === 'completed') return true;

      const questIdStr = String(q.id);
      const isAccepted = isFirstQuest || acceptedIds.includes(questIdStr) || q.status === 'in_progress' || q.status === 'active';

      const userXP = user?.total_xp || user?.xp || 0;
      const objectives = q.objectives || [];

      if (objectives.length === 0) {
        return (q.progressPercent || 0) >= 100;
      }

      const questStartXP = startXpMap[questIdStr] ?? userXP;
      const xpEarnedInQuest = Math.max(0, userXP - questStartXP);

      const completedObjs = objectives.filter((o: any) => {
        if (o.isCompleted) return true;
        if (o.type === 'lesson' || o.targetType === 'lesson' || o.targetId || o.target_id) {
          const targetId = String(o.targetId || o.target_id || '');
          return completedLessonIds.includes(targetId);
        }
        if (o.type === 'xp' || o.targetType === 'xp') {
          const targetXp = Number(o.targetXp || o.target_xp || 100);
          return isFirstQuest ? userXP >= targetXp : xpEarnedInQuest >= targetXp;
        }
        return false;
      });

      const allObjectivesFinished = completedObjs.length === objectives.length;

      // Kung tapos na ang lahat ng objectives, mark active/completed na ito agad
      if (allObjectivesFinished) return true;

      if (!isAccepted) return false;

      return false;
    },
    [completedLessonIds, user, acceptedIds, startXpMap]
  );

  const questStatusMap = useMemo(() => {
    const map: Record<string, 'not_started' | 'completed' | 'active'> = {};

    const regionMap: Record<string, any[]> = {};
    questsList.forEach((q: any) => {
      const regionId = q.region || 'default';
      if (!regionMap[regionId]) regionMap[regionId] = [];
      regionMap[regionId].push(q);
    });

    Object.values(regionMap).forEach((regionQuests) => {
      const chainQuests = regionQuests
        .filter((q) => q.type !== 'boss' && q.type !== 'legendary' && !q.isHidden)
        .sort((a, b) => (a.chainPosition ?? a.orderIndex ?? 0) - (b.chainPosition ?? b.orderIndex ?? 0));

      chainQuests.forEach((q, idx) => {
        const questIdStr = String(q.id);
        const isFirstQuest = idx === 0;
        const isDone = isQuestDone(q, isFirstQuest);

        const isExplicitlyAccepted = isFirstQuest || acceptedIds.includes(questIdStr);

        let calculatedStatus: 'not_started' | 'active' | 'completed' = 'not_started';

        if (isDone) {
          calculatedStatus = 'completed';
        } else if (isExplicitlyAccepted) {
          calculatedStatus = 'active';
        } else {
          calculatedStatus = 'not_started';
        }

        let isLocked = false;
        if (idx > 0) {
          const prevQuest = chainQuests[idx - 1];
          if (map[prevQuest.id] !== 'completed') {
            isLocked = true;
          }
        }

        map[q.id] = isLocked ? 'not_started' : calculatedStatus;
      });

      const bossQuest = regionQuests.find((q) => q.type === 'boss');
      if (bossQuest) {
        const allChainDone = chainQuests.every((cq) => map[cq.id] === 'completed');
        const isDone = isQuestDone(bossQuest, false);
        const isAccepted = acceptedIds.includes(String(bossQuest.id));
        map[bossQuest.id] = !allChainDone
          ? 'not_started'
          : isDone
          ? 'completed'
          : isAccepted
          ? 'active'
          : 'not_started';
      }

      const legendaryQuest = regionQuests.find((q) => q.type === 'legendary');
      if (legendaryQuest) {
        const bossDone = bossQuest ? map[bossQuest.id] === 'completed' : false;
        const isDone = isQuestDone(legendaryQuest, false);
        const isAccepted = acceptedIds.includes(String(legendaryQuest.id));
        map[legendaryQuest.id] = !bossDone
          ? 'not_started'
          : isDone
          ? 'completed'
          : isAccepted
          ? 'active'
          : 'not_started';
      }
    });

    return map;
  }, [questsList, isQuestDone, acceptedIds]);

  const allQuestsProgress = useMemo(() => {
    const result: Record<string, QuestProgressInfo> = {};
    const userXP = user?.total_xp || user?.xp || 0;

    questsList.forEach((quest: any) => {
      const status = questStatusMap[quest.id] || 'not_started';
      const isCompleted = status === 'completed';
      const isActive = status === 'active';

      const rawObjectives = quest.objectives || [];
      const questIdStr = String(quest.id);

      const questStartXP = startXpMap[questIdStr] ?? userXP;
      const xpEarnedInQuest = Math.max(0, userXP - questStartXP);

      const objectives = rawObjectives.map((o: any) => {
        let isObjDone = false;

        if (isCompleted) {
          isObjDone = true;
        } else if (isActive) {
          if (Boolean(o.isCompleted)) {
            isObjDone = true;
          } else if (o.type === 'lesson' || o.targetType === 'lesson' || o.targetId || o.target_id) {
            const targetId = String(o.targetId || o.target_id || '');
            isObjDone = completedLessonIds.includes(targetId);
          } else if (o.type === 'xp' || o.targetType === 'xp') {
            const targetXp = Number(o.targetXp || o.target_xp || 100);
            isObjDone = xpEarnedInQuest >= targetXp;
          }
        }

        return {
          objectiveId: o.id || o.objectiveId,
          isCompleted: isObjDone,
          progressPercent: isObjDone ? 100 : 0,
          progressDetail: isObjDone ? 'Completed' : isActive ? 'In Progress' : 'Not Started',
        };
      });

      const completedCount = !isActive && !isCompleted
        ? 0
        : objectives.filter((o: any) => o.isCompleted).length;
      const totalCount = objectives.length;

      const allCompleted = isCompleted || (isActive && totalCount > 0 && completedCount === totalCount);
      const finalStatus = allCompleted ? 'completed' : status;

      const progressPercent =
        finalStatus === 'completed'
          ? 100
          : !isActive
          ? 0
          : totalCount > 0
          ? Math.round((completedCount / totalCount) * 100)
          : 0;

      const nextObjective = objectives.find((o: any) => !o.isCompleted) || null;

      result[quest.id] = {
        quest,
        status: finalStatus,
        objectiveProgress: objectives,
        completedCount,
        totalCount,
        progressPercent,
        allCompleted,
        nextObjective,
      };
    });

    return result;
  }, [questsList, questStatusMap, completedLessonIds, user, startXpMap]);

  const questProgressEntries = useMemo(() => {
    return questsList.map((q: any) => {
      const info = allQuestsProgress[q.id];
      return {
        questId: q.id,
        status: info?.status || 'not_started',
        progressPercent: info?.progressPercent || 0,
      };
    });
  }, [questsList, allQuestsProgress]);

  const getQuestInfo = useCallback(
    (questId: string) => {
      return allQuestsProgress[questId];
    },
    [allQuestsProgress]
  );

  return {
    allQuests: questsList,
    loading,
    allQuestsProgress,
    questStatusMap,
    questProgressEntries,
    getQuestInfo,
    refresh,
  };
}