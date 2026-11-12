export interface NormalizedQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  timeLimit: number;
  topic?: string;
  category?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  matchPairs?: { left: string; right: string }[];
}

export function normalizeQuestion(q: any): NormalizedQuestion {
  let parsedOptions: string[] = [];

  if (Array.isArray(q.options)) {
    parsedOptions = q.options;
  } else if (typeof q.options === 'string') {
    const trimmed = q.options.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        parsedOptions = JSON.parse(trimmed);
      } catch {
        parsedOptions = trimmed.split('\n').filter(Boolean);
      }
    } else {
      parsedOptions = trimmed.split('\n').filter(Boolean);
    }
  }

  let parsedMatchPairs = undefined;
  if (Array.isArray(q.matchPairs || q.match_pairs)) {
    parsedMatchPairs = q.matchPairs || q.match_pairs;
  } else if (typeof (q.matchPairs || q.match_pairs) === 'string') {
    const str = (q.matchPairs || q.match_pairs).trim();
    if (str.startsWith('[')) {
      try { parsedMatchPairs = JSON.parse(str); } catch {}
    } else {
      parsedMatchPairs = str.split('\n').map((line: string) => {
        const parts = line.split('::').map((s) => s.trim());
        return parts.length >= 2 ? { left: parts[0], right: parts[1] } : null;
      }).filter(Boolean);
    }
  }

  return {
    id: String(q.id),
    type: q.type || 'mcq',
    question: q.question || '',
    options: parsedOptions,
    correctAnswer: String(q.correctAnswer || q.correct_answer || ''),
    explanation: q.explanation || '',
    points: Number(q.points) || 10,
    timeLimit: Number(q.timeLimit || q.time_limit) || 20,
    topic: q.topic || q.category || 'General',
    category: q.category || 'General',
    codeSnippet: q.codeSnippet || q.code_snippet || undefined,
    codeLanguage: q.codeLanguage || q.code_language || undefined,
    matchPairs: parsedMatchPairs,
  };
}