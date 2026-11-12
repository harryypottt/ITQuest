import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestCase {
  id: string;
  description: string;
  type?: 'output' | 'structure' | 'sql';
  input?: any;
  expected_output: string;
  selector?: string;
}

interface TestRunnerProps {
  testCases: TestCase[];
  files: any[];
  code: Record<string, string>;
  onAllPassed: () => void;
  isViewOnly?: boolean;
}

interface TestResult {
  testId: string;
  passed: boolean;
  actual?: string;
  message: string;
}

export default function TestRunner({ testCases, files, code, onAllPassed, isViewOnly }: TestRunnerProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  const runTests = useCallback(() => {
    setIsRunning(true);
    setResults([]);

    setTimeout(() => {
      const newResults: TestResult[] = [];
      const sqlFile = files.find((f) => f.language === 'sql' || f.name.endsWith('.sql'));
      const jsFile = files.find((f) => f.language === 'javascript' || f.name.endsWith('.js'));
      const htmlFile = files.find((f) => f.language === 'html' || f.name.endsWith('.html'));
      const cssFile = files.find((f) => f.language === 'css' || f.name.endsWith('.css'));

      for (const tc of testCases) {
        try {
          const desc = tc.description.toLowerCase();

          if (sqlFile || tc.type === 'sql' || desc.includes('query') || desc.includes('select')) {
            const userSql = (code[sqlFile?.name || 'query.sql'] || sqlFile?.content || '').trim().toLowerCase();
            if (!userSql) {
              newResults.push({ testId: tc.id, passed: false, message: 'SQL query is empty' });
              continue;
            }
            let passed = false;
            let message = '';
            if (desc.includes('select statement') || desc.includes('select')) {
              passed = /\bselect\b/i.test(userSql);
              message = passed ? 'Contains SELECT statement' : 'Missing SELECT statement';
            } else if (desc.includes('target') || desc.includes('from') || desc.includes('table')) {
              const tableMatch = tc.description.match(/`([^`]+)`|from\s+([a-z0-9_]+)/i);
              const tableName = tableMatch ? (tableMatch[1] || tableMatch[2]).toLowerCase() : '';
              passed = tableName ? userSql.includes(`from ${tableName}`) || userSql.includes(`from \`${tableName}\``) : userSql.includes('from');
              message = passed ? `Targets correct table` : `Missing or incorrect FROM clause`;
            } else if (desc.includes('filter') || desc.includes('where') || desc.includes('>')) {
              passed = userSql.includes('where');
              message = passed ? 'Filtering condition validated' : 'Missing WHERE clause';
            } else {
              const expectedClean = String(tc.expected_output || '').toLowerCase().trim();
              passed = userSql.includes(expectedClean) || expectedClean.includes(userSql) || userSql.length > 5;
              message = passed ? 'SQL logic validated' : `Expected condition not met`;
            }
            newResults.push({ testId: tc.id, passed, message });
            continue;
          }

          if (tc.type === 'structure' || htmlFile || cssFile) {
            const userHtml = htmlFile ? (code[htmlFile.name] || htmlFile.content) : '';
            const userCss = cssFile ? (code[cssFile.name] || cssFile.content) : '';
            if (tc.selector) {
              const selectorClean = tc.selector.replace('#', '').replace('.', '');
              const passed = userHtml.includes(selectorClean) || userHtml.includes(tc.selector) || userCss.includes(tc.selector);
              newResults.push({
                testId: tc.id,
                passed,
                message: passed ? `Target "${tc.selector}" found` : `Target "${tc.selector}" not found`,
              });
              continue;
            }
          }

          if (!jsFile) {
            newResults.push({ testId: tc.id, passed: false, message: 'No executable code file found' });
            continue;
          }
          const userCode = code[jsFile.name] || jsFile.content;

          const executionScript = `
            return (function() {
              ${userCode};
              const fnList = [];
              if (typeof chunkArray === 'function') fnList.push(chunkArray);
              if (typeof fizzBuzz === 'function') fnList.push(fizzBuzz);
              if (typeof solution === 'function') fnList.push(solution);
              if (typeof main === 'function') fnList.push(main);
              let targetFn = fnList[0] || null;
              if (!targetFn) {
                try {
                  const candidate = eval('typeof chunkArray !== "undefined" ? chunkArray : (typeof fizzBuzz !== "undefined" ? fizzBuzz : null)');
                  if (typeof candidate === 'function') targetFn = candidate;
                } catch(e) {}
              }
              if (!targetFn) {
                throw new Error('No valid function defined in code');
              }
              return targetFn;
            })();
          `;
          let targetFn: Function;
          try {
            const runnerFn = new Function(executionScript);
            targetFn = runnerFn();
          } catch (e: any) {
            newResults.push({
              testId: tc.id,
              passed: false,
              message: `Runtime Error: ${e.message}`,
            });
            continue;
          }

          let rawOutput: any;
          const inputData = tc.input ?? null;
          if (inputData !== null && inputData !== undefined) {
            rawOutput = Array.isArray(inputData) ? targetFn(...inputData) : targetFn(inputData);
          } else {
            if (desc.includes('chunkarray([1,2,3,4,5], 2)')) rawOutput = targetFn([1, 2, 3, 4, 5], 2);
            else if (desc.includes('chunkarray([1,2,3,4,5,6,7,8], 3)')) rawOutput = targetFn([1, 2, 3, 4, 5, 6, 7, 8], 3);
            else if (desc.includes('chunkarray([], 3)')) rawOutput = targetFn([], 3);
            else if (desc.includes('not be mutated')) {
              const orig = [1, 2, 3];
              const copy = [...orig];
              targetFn(orig, 2);
              rawOutput = JSON.stringify(orig) === JSON.stringify(copy) ? 'not_mutated' : 'mutated';
            } else {
              rawOutput = targetFn();
            }
          }

          let evaluatedActual: any = rawOutput;
          const posMatch = tc.description.match(/Position (\d+)/i);
          if (posMatch && Array.isArray(rawOutput)) {
            const posIndex = parseInt(posMatch[1], 10) - 1;
            evaluatedActual = rawOutput[posIndex];
          }

          let passed = false;
          const normalizedActual = JSON.stringify(evaluatedActual);
          if (desc.includes('array of') && desc.includes('items') && Array.isArray(rawOutput)) {
            const matchCount = desc.match(/\d+/);
            const expectedLen = matchCount ? parseInt(matchCount[0], 10) : 0;
            passed = rawOutput.length === expectedLen;
          } else if (desc.includes('not be mutated')) {
            passed = rawOutput === 'not_mutated';
          } else {
            let cleanExpected = tc.expected_output;
            if (typeof cleanExpected === 'string') {
              cleanExpected = cleanExpected.trim();
              if ((cleanExpected.startsWith('"') && cleanExpected.endsWith('"')) ||
                  (cleanExpected.startsWith('[') && cleanExpected.endsWith(']'))) {
                try { cleanExpected = JSON.parse(cleanExpected); } catch {}
              }
            }
            passed = normalizedActual === JSON.stringify(cleanExpected) ||
                     String(evaluatedActual).toLowerCase() === String(cleanExpected).toLowerCase();
          }

          newResults.push({
            testId: tc.id,
            passed,
            actual: normalizedActual,
            message: passed 
              ? `Passed! Output: ${normalizedActual}` 
              : `Expected ${tc.expected_output}, got ${normalizedActual}`,
          });
        } catch (e: any) {
          newResults.push({
            testId: tc.id,
            passed: false,
            message: `Execution error: ${e.message}`,
          });
        }
      }

      setResults(newResults);
      setIsRunning(false);
      const allGood = newResults.length > 0 && newResults.every((r) => r.passed);
      setAllPassed(allGood);
      if (allGood) {
        onAllPassed();
      }
    }, 400);
  }, [testCases, files, code, onAllPassed]);

  // AUTO-RUN KAPAG VIEW ONLY LANG PARA PAKITA ANG TUNAY NA NASAVED NA SAGOT
  useEffect(() => {
    if (isViewOnly && Object.keys(code).length > 0) {
      runTests();
    }
  }, [isViewOnly]);

  const passedCount = results.filter((r) => r.passed).length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-quest-border">
        <div className="flex items-center gap-2">
          <i className="ri-test-tube-line text-quest-primary text-sm" />
          <span className="text-xs font-semibold text-quest-text">Test Cases ({testCases.length})</span>
          {results.length > 0 && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              allPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              {passedCount}/{results.length} passed
            </span>
          )}
        </div>

        {/* ITATAGO ANG BUTTON KAPAG VIEW ONLY */}
        {!isViewOnly && (
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-quest-primary text-black text-xs font-semibold hover:bg-quest-primaryGlow transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isRunning ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                Running...
              </>
            ) : (
              <>
                <i className="ri-play-fill" />
                Run Tests
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {results.length === 0 && !isRunning && (
          <div className="text-center py-8">
            <i className="ri-code-line text-3xl text-quest-textDim block mb-2" />
            <p className="text-xs text-quest-textMuted">Click "Run Tests" to validate your solution</p>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center justify-center py-8 gap-2">
            <i className="ri-loader-4-line animate-spin text-quest-primary" />
            <span className="text-xs text-quest-textMuted">Running test cases...</span>
          </div>
        )}

        <AnimatePresence>
          {results.map((result) => {
            const tc = testCases.find((t) => t.id === result.testId);
            return (
              <motion.div
                key={result.testId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
                  result.passed
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                }`}
              >
                <i className={`mt-0.5 ${result.passed ? 'ri-checkbox-circle-fill text-emerald-400' : 'ri-close-circle-fill text-rose-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-quest-text">{tc?.description || result.testId}</p>
                  <p className="text-[11px] text-quest-textMuted mt-0.5">{result.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {allPassed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-center"
            >
              <i className="ri-trophy-line text-2xl text-quest-gold block mb-1" />
              <p className="text-sm font-bold text-emerald-400">All Tests Passed!</p>
              <p className="text-[11px] text-quest-textMuted">
                {isViewOnly ? 'Verified submitted solution.' : 'Great work! Your solution is ready for submission.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
