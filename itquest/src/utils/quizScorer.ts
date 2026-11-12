export interface MatchingResult {
  score: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
  isFullyCorrect: boolean;
  isPartial: boolean;
}

// 🌟 Normalization Helper para sa HTML tags & spaces
const cleanStr = (str: string) =>
  String(str || '')
    .replace(/[<>]/g, '')
    .replace(/^(position|display|flex|grid):\s*/i, '')
    .trim()
    .toLowerCase();

/**
 * Nagco-compute ng Partial Points para sa Matching Questions
 */
export const calculateMatchingScore = (
  userAnswer: string,
  matchPairs: { left: string; right: string }[],
  maxPoints: number = 20
): MatchingResult => {
  if (!matchPairs || matchPairs.length === 0 || !userAnswer) {
    return {
      score: 0,
      correctCount: 0,
      totalCount: matchPairs?.length || 0,
      percentage: 0,
      isFullyCorrect: false,
      isPartial: false,
    };
  }

  // 1. I-parse ang user selections (hal. "<aside>>Tangentially|...")
  const userSelections: Record<string, string> = {};
  userAnswer.split('|').forEach((pairStr) => {
    const splitIdx = pairStr.lastIndexOf('>');
    if (splitIdx !== -1) {
      const left = cleanStr(pairStr.substring(0, splitIdx));
      const right = cleanStr(pairStr.substring(splitIdx + 1));
      userSelections[left] = right;
    }
  });

  // 2. Bilangin ang tamang matches
  let correctCount = 0;
  const totalCount = matchPairs.length;

  matchPairs.forEach((pair) => {
    const expectedLeft = cleanStr(pair.left);
    const expectedRight = cleanStr(pair.right);

    const actualRight = userSelections[expectedLeft];

    if (actualRight && actualRight === expectedRight) {
      correctCount++;
    }
  });

  // 3. Kuhanin ang proportional score
  const percentage = Math.round((correctCount / totalCount) * 100);
  const score = Math.round((correctCount / totalCount) * maxPoints);
  const isFullyCorrect = correctCount === totalCount;
  const isPartial = correctCount > 0 && !isFullyCorrect;

  return {
    score,
    correctCount,
    totalCount,
    percentage,
    isFullyCorrect,
    isPartial,
  };
};