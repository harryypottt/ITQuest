import React, { useState } from 'react';
import { Lightbulb, FileText, ChevronDown, ChevronUp, TestTube } from 'lucide-react';

interface TestCase {
  id?: string;
  description: string;
  expected_output?: string;
}

interface ChallengeDescriptionProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    instructions?: string;
    difficulty: number | string;
    category: string;
    xp_reward?: number;
    estimated_minutes?: number;
    hints?: string[] | string;
    test_cases?: TestCase[];
  };
}

export const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ challenge }) => {
  const [showHints, setShowHints] = useState(false);

  // Format dynamic badge for difficulty
  const getDifficultyLabel = (diff: number | string) => {
    if (typeof diff === 'string') return diff;
    if (diff === 1) return 'Easy';
    if (diff === 2) return 'Medium';
    return 'Hard';
  };

  // Safe JSON/Array parse para sa Hints para lumabas ang Hints (3)
  let hintsList: string[] = [];
  if (Array.isArray(challenge.hints)) {
    hintsList = challenge.hints;
  } else if (typeof challenge.hints === 'string') {
    try {
      const parsed = JSON.parse(challenge.hints);
      hintsList = Array.isArray(parsed) ? parsed : [challenge.hints];
    } catch {
      hintsList = challenge.hints.includes('\n')
        ? challenge.hints.split('\n').filter((h) => h.trim() !== '')
        : [challenge.hints];
    }
  }

  const testCasesList: TestCase[] = challenge.test_cases || [];

  return (
    <div className="p-4 space-y-6 text-gray-200 overflow-y-auto h-full">
      {/* Category & Difficulty Badges */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {challenge.category || 'JavaScript'}
        </span>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {getDifficultyLabel(challenge.difficulty)}
        </span>
      </div>

      {/* Challenge Title & Stats */}
      <div>
        <h1 className="text-xl font-bold text-white mb-1">{challenge.title}</h1>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {challenge.estimated_minutes && (
            <span>⏱ {challenge.estimated_minutes} min</span>
          )}
          {challenge.xp_reward && (
            <span className="text-amber-400 font-medium">⚡ {challenge.xp_reward} XP</span>
          )}
        </div>
      </div>

      {/* Main Description */}
      <p className="text-sm text-gray-300 leading-relaxed">
        {challenge.description}
      </p>

      {/* Instructions Section */}
      {challenge.instructions && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <FileText className="w-4 h-4" />
            <h2>Instructions</h2>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800 text-xs text-gray-300 whitespace-pre-line leading-relaxed">
            {challenge.instructions}
          </div>
        </div>
      )}

      {/* Test Cases List Section (Eksaktong tulad ng nasa screenshot mo) */}
      {testCasesList.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <TestTube className="w-4 h-4 text-emerald-400" />
            <h2>Test Cases ({testCasesList.length})</h2>
          </div>
          <div className="space-y-2">
            {testCasesList.map((tc, idx) => (
              <div 
                key={tc.id || idx} 
                className="flex items-center gap-2.5 p-3 bg-gray-900/60 rounded-lg border border-gray-800 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-gray-300">{tc.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints Dropdown Accordion Section */}
      {hintsList.length > 0 && (
        <div className="pt-2 border-t border-gray-800">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Hints ({hintsList.length})</span>
            </div>
            {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHints && (
            <div className="mt-2 space-y-2 pl-2">
              {hintsList.map((hint, index) => (
                <div 
                  key={index} 
                  className="p-2.5 bg-amber-500/5 rounded-lg border border-amber-500/20 text-xs text-amber-200/90"
                >
                  💡 <span className="font-semibold">Hint {index + 1}:</span> {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengeDescription;
