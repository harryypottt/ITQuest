import { useState, useEffect, useMemo } from 'react';

export interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points?: number;
  timeLimit?: number;
  topic?: string;
  category?: string;
  codeSnippet?: string;
  code_snippet?: string;
  codeLanguage?: string;
  code_language?: string;
  matchPairs?: { left: string; right: string }[];
}

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  revealedOptions?: string[];
}

export interface MatchingResult {
  score: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
  isFullyCorrect: boolean;
  isPartial: boolean;
}

// 🌟 NORMALIZATION HELPER (Strips HTML tags & extra whitespace)
const normalize = (str?: string) =>
  str
    ? str
        .replace(/^(position|display|flex|grid):\s*/i, '')
        .replace(/^::\s*/, '')
        .replace(/[<>]/g, '') // Tanggalin ang HTML brackets para sa malinis na string matching
        .trim()
        .toLowerCase()
    : '';

// 🌟 EXACT MATCH CHECKER (Pinalitan ang .includes() para iwas bug sa <navigation> vs <nav>)
const isTextMatch = (selectedStr: string, targetStr: string) => {
  const s = normalize(selectedStr);
  const t = normalize(targetStr);
  if (!s || !t) return false;
  return s === t;
};

// 🌟 PARTIAL SCORING CALCULATOR PARA SA MATCHING QUESTIONS
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

  const userSelections: Record<string, string> = {};
  userAnswer.split('|').forEach((pairStr) => {
    const splitIdx = pairStr.lastIndexOf('>');
    if (splitIdx !== -1) {
      const left = normalize(pairStr.substring(0, splitIdx));
      const right = normalize(pairStr.substring(splitIdx + 1));
      userSelections[left] = right;
    }
  });

  let correctCount = 0;
  const totalCount = matchPairs.length;

  matchPairs.forEach((pair) => {
    const expectedLeft = normalize(pair.left);
    const expectedRight = normalize(pair.right);
    const actualRight = userSelections[expectedLeft];

    if (actualRight && actualRight === expectedRight) {
      correctCount++;
    }
  });

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

export default function QuestionRenderer({
  question,
  onAnswer,
  userAnswer,
  showResult,
  isCorrect,
  disabled,
  revealedOptions,
}: QuestionRendererProps) {
  const [fillValue, setFillValue] = useState('');
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});

  const snippetText = question.codeSnippet || question.code_snippet;
  const snippetLang = question.codeLanguage || question.code_language || 'css';

  // 🌟 SAFE PARSER FOR USER MATCHING ANSWERS (Handled HTML Tags safely)
  useEffect(() => {
    if (userAnswer && question.type === 'matching') {
      const initialSelections: Record<string, string> = {};
      const pairs = userAnswer.split('|');
      pairs.forEach((pair) => {
        let left = '';
        let right = '';
        if (pair.includes('>>')) {
          const idx = pair.indexOf('>>');
          left = pair.substring(0, idx + 1);
          right = pair.substring(idx + 2);
        } else if (pair.includes('->')) {
          const parts = pair.split('->');
          left = parts[0].trim();
          right = parts[1].trim();
        } else {
          const splitIdx = pair.lastIndexOf('>');
          if (splitIdx !== -1) {
            left = pair.substring(0, splitIdx);
            right = pair.substring(splitIdx + 1);
          }
        }
        if (left && right) {
          initialSelections[left] = right;
        }
      });
      setMatchSelections(initialSelections);
    }
  }, [userAnswer, question.type]);

  const correctAnswerStr = useMemo(() => {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.join('|');
    }
    return String(question.correctAnswer || '');
  }, [question.correctAnswer]);

  const matchingRightItems = useMemo(() => {
    if (!question.matchPairs || question.type !== 'matching') return [];
    if (showResult) return question.matchPairs.map((p) => p.right);
    return [...question.matchPairs.map((p) => p.right)].sort(() => Math.random() - 0.5);
  }, [showResult, question.matchPairs, question.type]);

  const renderMCQ = () => {
    if (!question.options) return null;
    const revealedSet = new Set(revealedOptions || []);

    return (
      <div className="space-y-2.5">
        {question.options.map((option, idx) => {
          const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
          const isSelected = userAnswer === option;
          const isCorrectOption = showResult && isTextMatch(option, correctAnswerStr);
          const isWrongSelected = showResult && isSelected && !isCorrectOption;
          const isRevealedAsWrong = !showResult && revealedSet.has(option);

          let borderClass = 'border-quest-border hover:border-quest-textMuted/60';
          let bgClass = 'bg-quest-card';
          let icon = null;

          if (isRevealedAsWrong) {
            borderClass = 'border-quest-border';
            bgClass = 'bg-quest-bg/50';
          }
          if (isSelected) {
            borderClass = 'border-quest-primary/60';
            bgClass = 'bg-quest-primary/5';
            icon = <i className="ri-checkbox-circle-fill text-quest-primary text-sm" />;
          }
          if (isCorrectOption) {
            borderClass = 'border-quest-primary';
            bgClass = 'bg-quest-primary/10';
            icon = <i className="ri-checkbox-circle-fill text-quest-primary text-sm" />;
          }
          if (isWrongSelected) {
            borderClass = 'border-quest-danger';
            bgClass = 'bg-quest-danger/5';
            icon = <i className="ri-close-circle-fill text-quest-danger text-sm" />;
          }

          return (
            <button
              key={idx}
              disabled={disabled || showResult || isRevealedAsWrong}
              onClick={() => onAnswer(option)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all group ${borderClass} ${bgClass} ${
                isRevealedAsWrong ? 'opacity-30 line-through cursor-not-allowed' : ''
              }`}
            >
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold border flex-shrink-0 ${
                  isSelected
                    ? 'border-quest-primary/60 bg-quest-primary/10 text-quest-primary'
                    : isRevealedAsWrong
                    ? 'border-quest-border bg-quest-bg text-quest-textDim/30'
                    : 'border-quest-border bg-quest-bg text-quest-textDim'
                }`}
              >
                {letters[idx]}
              </span>
              <span className={`text-sm flex-1 ${isRevealedAsWrong ? 'text-quest-textDim/30 line-through' : 'text-quest-text'}`}>
                {option}
              </span>
              {!isRevealedAsWrong && icon && <span className="flex-shrink-0">{icon}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = () => {
    return (
      <div className="flex gap-3">
        {['True', 'False'].map((option) => {
          const isSelected = userAnswer === option;
          const isCorrectOption = showResult && isTextMatch(option, correctAnswerStr);
          const isWrongSelected = showResult && isSelected && !isCorrectOption;

          let borderClass = 'border-quest-border hover:border-quest-textMuted/60';
          let bgClass = 'bg-quest-card';

          if (isSelected) {
            borderClass = 'border-quest-primary/60';
            bgClass = 'bg-quest-primary/5';
          }
          if (isCorrectOption) {
            borderClass = 'border-quest-primary';
            bgClass = 'bg-quest-primary/10';
          }
          if (isWrongSelected) {
            borderClass = 'border-quest-danger';
            bgClass = 'bg-quest-danger/5';
          }

          return (
            <button
              key={option}
              disabled={disabled || showResult}
              onClick={() => onAnswer(option)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border text-base font-semibold transition-all ${borderClass} ${bgClass}`}
            >
              <i
                className={`text-lg ${
                  option === 'True' ? 'ri-check-line text-emerald-400' : 'ri-close-line text-rose-400'
                }`}
              />
              <span className="text-quest-text">{option}</span>
              {isCorrectOption && <i className="ri-checkbox-circle-fill text-quest-primary text-sm" />}
              {isWrongSelected && <i className="ri-close-circle-fill text-quest-danger text-sm" />}
            </button>
          );
        })}
      </div>
    );
  };

  const renderFillBlank = () => {
    const handleSubmit = () => {
      if (fillValue.trim()) {
        onAnswer(fillValue.trim());
      }
    };

    const isCorrectResult = showResult && isTextMatch(userAnswer || '', correctAnswerStr);
    const isWrongResult = showResult && userAnswer && !isCorrectResult;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={fillValue}
            onChange={(e) => setFillValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Type your answer..."
            disabled={disabled || showResult}
            className={`flex-1 px-4 py-3 rounded-lg border bg-quest-bg text-quest-text text-sm placeholder:text-quest-textDim/40 outline-none transition-all ${
              isCorrectResult
                ? 'border-quest-primary'
                : isWrongResult
                ? 'border-quest-danger'
                : 'border-quest-border focus:border-quest-primary/60'
            }`}
          />
          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={!fillValue.trim()}
              className="px-5 py-3 rounded-lg bg-quest-primary text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              Submit
            </button>
          )}
        </div>
        {isCorrectResult && (
          <div className="flex items-center gap-2 text-sm text-quest-primary">
            <i className="ri-check-line" /> Correct! Answer: <strong>{correctAnswerStr}</strong>
          </div>
        )}
        {isWrongResult && (
          <div className="flex items-center gap-2 text-sm text-quest-danger">
            <i className="ri-close-line" /> Your answer: "{userAnswer}" — Correct answer: <strong>{correctAnswerStr}</strong>
          </div>
        )}
      </div>
    );
  };

  const renderMatching = () => {
    if (!question.matchPairs) return null;

    const leftItems = question.matchPairs.map((p) => p.left);
    const rightItems = matchingRightItems;

    const handleMatchSelect = (leftItem: string, rightItem: string) => {
      setMatchSelections((prev) => ({ ...prev, [leftItem]: rightItem }));
    };

    const correctPairs = useMemo(() => {
      if (question.matchPairs && question.matchPairs.length > 0) {
        return question.matchPairs.map((p) => ({
          left: p.left,
          right: p.right,
          displayLeft: p.left,
          displayRight: p.right,
        }));
      }

      return correctAnswerStr.split('|').map((pair) => {
        let left = pair;
        let right = '';
        if (pair.includes('>>')) {
          const idx = pair.indexOf('>>');
          left = pair.substring(0, idx + 1);
          right = pair.substring(idx + 2);
        } else if (pair.includes('->')) {
          const parts = pair.split('->');
          left = parts[0].trim();
          right = parts[1].trim();
        } else {
          const splitIdx = pair.lastIndexOf('>');
          if (splitIdx !== -1) {
            left = pair.substring(0, splitIdx);
            right = pair.substring(splitIdx + 1);
          }
        }
        return {
          left: left.trim(),
          right: right.trim(),
          displayLeft: left.trim(),
          displayRight: right.trim(),
        };
      });
    }, [question.matchPairs, correctAnswerStr]);

    const handleMatchSubmit = () => {
      const answer: string[] = [];
      for (const left of leftItems) {
        const selected = matchSelections[left];
        if (selected) {
          answer.push(`${left}>${selected}`);
        }
      }
      if (answer.length === leftItems.length) {
        onAnswer(answer.join('|'));
      }
    };

    const isAllSelected = leftItems.every((left) => matchSelections[left]);

    const matchingStats = useMemo(() => {
      if (!showResult || !question.matchPairs || !userAnswer) return null;
      return calculateMatchingScore(userAnswer, question.matchPairs, question.points || 20);
    }, [showResult, question.matchPairs, userAnswer, question.points]);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column (Question items) */}
          <div className="space-y-2">
            {leftItems.map((leftItem) => {
              const selected = matchSelections[leftItem];
              const correctPair = correctPairs.find((p) => isTextMatch(p.left, leftItem));
              const isMatchCorrect = showResult && !!selected && isTextMatch(selected, correctPair?.right || '');

              return (
                <div
                  key={leftItem}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    isMatchCorrect
                      ? 'border-quest-primary bg-quest-primary/5 text-quest-text'
                      : showResult && selected && !isTextMatch(selected, correctPair?.right || '')
                      ? 'border-quest-danger bg-quest-danger/5 text-quest-text'
                      : selected
                      ? 'border-quest-primary/40 bg-quest-primary/5 text-quest-text'
                      : 'border-quest-border bg-quest-card text-quest-text'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i className="ri-draggable text-quest-textDim text-xs" />
                    {leftItem}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Draggable / Selectable targets) */}
          <div className="space-y-2">
            {rightItems.map((rightItem) => {
              const isUsed =
                Object.values(matchSelections).includes(rightItem) &&
                !Object.entries(matchSelections).some(
                  ([left]) => matchSelections[left] === rightItem && !leftItems.includes(left)
                );

              return (
                <button
                  key={rightItem}
                  disabled={disabled || showResult || isUsed}
                  onClick={() => {
                    const unselectedLeft = leftItems.find((l) => !matchSelections[l]);
                    if (unselectedLeft) {
                      handleMatchSelect(unselectedLeft, rightItem);
                    }
                  }}
                  className={`w-full p-3 rounded-lg border text-sm text-left transition-all ${
                    isUsed && !showResult
                      ? 'border-quest-border bg-quest-bg text-quest-textDim/40 cursor-not-allowed'
                      : 'border-quest-border bg-quest-card hover:border-quest-primary/40 text-quest-text cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i className="ri-link text-quest-textDim text-xs" />
                    {rightItem}
                    {isUsed && !showResult && <i className="ri-check-line text-quest-primary text-xs ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {!showResult && (
          <button
            onClick={handleMatchSubmit}
            disabled={!isAllSelected}
            className="w-full py-3 rounded-lg bg-quest-primary text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            Lock In Matches
          </button>
        )}

        {/* 🌟 PARTIAL & FULL SCORE UI FEEDBACK BANNERS */}
        {showResult && matchingStats && (
          <div className="space-y-2 pt-2">
            {matchingStats.isFullyCorrect && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <i className="ri-checkbox-circle-fill text-lg" />
                  All Matches Correct! (+{matchingStats.score} pts)
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 font-mono font-bold">
                  {matchingStats.correctCount}/{matchingStats.totalCount} Correct
                </span>
              </div>
            )}

            {matchingStats.isPartial && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <i className="ri-star-half-line text-lg" />
                  Partial Credit (+{matchingStats.score} / {question.points || 20} pts)
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/20 font-mono font-bold">
                  {matchingStats.correctCount}/{matchingStats.totalCount} Matches ({matchingStats.percentage}%)
                </span>
              </div>
            )}

            {matchingStats.correctCount === 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <i className="ri-close-circle-fill text-lg" />
                  No Matches Correct (0 pts)
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 font-mono font-bold">
                  0/{matchingStats.totalCount}
                </span>
              </div>
            )}

            {!matchingStats.isFullyCorrect && (
              <div className="p-3 rounded-xl bg-quest-bg/60 border border-quest-border space-y-1.5">
                <p className="text-xs font-semibold text-quest-textDim uppercase tracking-wider mb-1">
                  Correct Answer Key:
                </p>
                {question.matchPairs?.map((pair, idx) => (
                  <p key={idx} className="text-xs text-quest-textMuted flex items-center gap-2">
                    <span className="font-mono text-emerald-400">{pair.left}</span>
                    <i className="ri-arrow-right-line text-quest-textDim" />
                    <span>{pair.right}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {Boolean(snippetText) && (
        <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
              {snippetLang}
            </span>
            <i className="ri-code-s-slash-line text-slate-500" />
          </div>
          <pre className="p-4 text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
            <code>{snippetText}</code>
          </pre>
        </div>
      )}

      <p className="text-base text-quest-text font-medium leading-relaxed">
        {question.question}
      </p>

      {question.type === 'mcq' && renderMCQ()}
      {question.type === 'true-false' && renderTrueFalse()}
      {question.type === 'fill-blank' && renderFillBlank()}
      {question.type === 'matching' && renderMatching()}

      {showResult && (
        <div
          className={`p-4 rounded-lg border ${
            isCorrect
              ? 'bg-quest-primary/5 border-quest-primary/20'
              : 'bg-quest-danger/5 border-quest-danger/20'
          }`}
        >
          <div className="flex items-start gap-2">
            <i
              className={`text-sm mt-0.5 ${
                isCorrect ? 'ri-lightbulb-line text-quest-gold' : 'ri-information-line text-quest-danger'
              }`}
            />
            <div>
              <p className="text-xs font-semibold text-quest-textMuted mb-1">
                Explanation
              </p>
              <p className="text-sm text-quest-textMuted leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}