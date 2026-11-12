import { useState, useCallback, useEffect, useRef, type ReactElement } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import FileTabs from './components/FileTabs';
import CodeEditor from './components/CodeEditor';
import LivePreview from './components/LivePreview';
import TestRunner from './components/TestRunner';
import ChallengeDescription from './components/ChallengeDescription';
import { submitChallengeSolution, fetchCodingChallengeById } from '@/services/coding.service';

type RightPanel = 'preview' | 'tests';

export default function ChallengeWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isViewOnly = searchParams.get('viewOnly') === 'true';

  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  // State para sa dynamic challenge data mula sa backend database
  const [challenge, setChallenge] = useState<any>(null);
  const [filesState, setFilesState] = useState<any[]>([]);
  const [code, setCode] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [rightPanel, setRightPanel] = useState<RightPanel>('preview');
  const [showDescription, setShowDescription] = useState(true);
  const [isPanelFullscreen, setIsPanelFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(isViewOnly);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Pagkuha ng challenge data mula sa Backend API gamit ang ID
useEffect(() => {
    const loadWorkspaceData = async () => {
      if (!id) return;
      try {
        const response = await fetchCodingChallengeById(id);
        console.log('API Response Debug:', response); // 🔍 Tingnan ito sa Browser Console (F12)

        // Kunin ang totoong data kung naka-wrap man sa .data
        const challengeData = response?.data || response;
        setChallenge(challengeData);

        // Siguraduhing may files array, kung wala ay gawan ng default index.js para hindi mag-blank
        let initialFiles = challengeData?.files || [];
        if (initialFiles.length === 0) {
          initialFiles = [{ name: 'index.js', language: 'javascript', content: challengeData?.instructions || '// Write your code here' }];
        }

        let savedUserCode = challengeData?.submitted_code || challengeData?.submittedCode || '';
        const initialCode: Record<string, string> = {};

        initialFiles.forEach((f: any, idx: number) => {
          if (savedUserCode && (idx === 0 || f.name === 'index.js' || f.name === 'index.html')) {
            initialCode[f.name] = savedUserCode;
          } else {
            initialCode[f.name] = f.content || '';
          }
        });

        setFilesState(initialFiles);
        setCode(initialCode);
        setActiveFile(initialFiles[0]?.name || 'index.js');
      } catch (err) {
        console.error('Failed to load workspace data from backend:', err);
      }
    };
    loadWorkspaceData();
  }, [id, isViewOnly]);
  const handleCodeChange = useCallback((fileName: string, value: string) => {
    if (isViewOnly) return;
    setCode((prev) => ({ ...prev, [fileName]: value }));
    setAllTestsPassed(false);
  }, [isViewOnly]);

  const togglePanelFullscreen = () => {
    if (!rightPanelRef.current) return;
    if (!document.fullscreenElement) {
      rightPanelRef.current.requestFullscreen().catch(() => {});
      setIsPanelFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsPanelFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsPanelFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleAddFile = (fileName: string, language: string) => {
    if (isViewOnly || filesState.some((f) => f.name === fileName)) return;
    const newFile = { name: fileName, language, content: '' };
    setFilesState((prev) => [...prev, newFile]);
    setCode((prev) => ({ ...prev, [fileName]: '' }));
    setActiveFile(fileName);
    setAllTestsPassed(false);
  };

  const handleDeleteFile = (fileName: string) => {
    if (isViewOnly || fileName === 'index.js' || filesState.length <= 1) return;
    setFilesState((prev) => prev.filter((f) => f.name !== fileName));
    setCode((prev) => {
      const copy = { ...prev };
      delete copy[fileName];
      return copy;
    });
    if (activeFile === fileName) {
      const remaining = filesState.filter((f) => f.name !== fileName);
      setActiveFile(remaining[0]?.name || 'index.js');
    }
    setAllTestsPassed(false);
  };

  const handleResetCode = () => {
    if (isViewOnly) return;
    if (challenge && challenge.files) {
      const resetCode: Record<string, string> = {};
      challenge.files.forEach((f: any) => {
        resetCode[f.name] = f.content || '';
      });
      setCode(resetCode);
      setFilesState(challenge.files);
      setActiveFile(challenge.files[0]?.name || 'index.js');
      setAllTestsPassed(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (isViewOnly) {
      navigate('/coding');
      return;
    }
    if (!allTestsPassed) return;
    if (!id || !challenge) return;
    try {
      setIsSubmitting(true);
      const submittedCode = code[activeFile] || Object.values(code)[0] || '';
      const testCasesList = challenge.testCases || challenge.test_cases || [];
      const totalTests = testCasesList.length || 1;
      
      const result = await submitChallengeSolution(id, {
        status: 'passed',
        testsPassed: totalTests,
        testsTotal: totalTests,
        submittedCode,
        xpReward: challenge.xp_reward || 50
      });

      if (result.success) {
        setIsCompleted(true);
        navigate('/coding');
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      navigate('/coding');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <DashboardLayout>
        <div className="h-screen flex items-center justify-center bg-quest-bg text-quest-textDim text-xs">
          Loading challenge workspace...
        </div>
      </DashboardLayout>
    );
  }

  const testCasesList = challenge.testCases || challenge.test_cases || [];

  const TestRunnerWithExpectedProps = TestRunner as unknown as (props: {
    testCases: typeof testCasesList;
    files: any[];
    code: Record<string, string>;
    onAllPassed: () => void;
    isViewOnly?: boolean;
  }) => ReactElement;

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col bg-quest-bg overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-quest-card border-b border-quest-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/coding')}
              className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text"
            >
              <i className="ri-arrow-left-line" />
            </button>
            <h2 className="text-sm font-semibold text-quest-text">{challenge.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isViewOnly && (
              <button
                onClick={handleResetCode}
                title="Reset code to original starter code"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-bg border border-quest-border text-xs text-quest-textDim hover:text-quest-text"
              >
                <i className="ri-refresh-line" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={() => setShowDescription(!showDescription)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showDescription ? 'bg-quest-primary/10 text-quest-primary border border-quest-primary/30' : 'bg-quest-bg border border-quest-border text-quest-textDim'
              }`}
            >
              <i className="ri-file-list-3-line" />
              <span>Description</span>
            </button>
            <div className="flex items-center rounded-lg bg-quest-bg border border-quest-border overflow-hidden">
              <button
                onClick={() => setRightPanel('preview')}
                className={`px-3 py-1.5 text-xs font-medium ${rightPanel === 'preview' ? 'bg-quest-primary/10 text-quest-primary' : 'text-quest-textDim'}`}
              >
                Preview
              </button>
              <button
                onClick={() => setRightPanel('tests')}
                className={`px-3 py-1.5 text-xs font-medium ${rightPanel === 'tests' ? 'bg-quest-primary/10 text-quest-primary' : 'text-quest-textDim'}`}
              >
                Tests
              </button>
            </div>
            <button
              onClick={togglePanelFullscreen}
              title={isPanelFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview/Tests'}
              className="w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors"
            >
              <i className={isPanelFullscreen ? 'ri-fullscreen-exit-line text-amber-400' : 'ri-fullscreen-line'} />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Instructions (Left Panel) */}
          {showDescription && (
            <div className="w-[340px] border-r border-quest-border bg-quest-card flex-shrink-0 h-full">
              <ChallengeDescription challenge={challenge} />
            </div>
          )}

          {/* Editor Area (Center Panel) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d14]">
            <FileTabs
              files={filesState}
              activeFile={activeFile}
              onSelectFile={setActiveFile}
              onAddFile={isViewOnly ? undefined : handleAddFile}
              onDeleteFile={isViewOnly ? undefined : handleDeleteFile}
            />
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                code={code[activeFile] || ''}
                onChange={(value) => handleCodeChange(activeFile, value)}
              />
            </div>
          </div>

          {/* Preview / Tests Panel (Right Panel) */}
          <div
            ref={rightPanelRef}
            className={`w-[360px] border-l border-quest-border bg-quest-card flex-shrink-0 flex flex-col ${
              isPanelFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : ''
            }`}
          >
            <div className="flex-1 overflow-hidden">
              {rightPanel === 'preview' ? (
                <LivePreview files={filesState} activeFile={activeFile} code={code} />
              ) : (
                <TestRunnerWithExpectedProps 
                  testCases={testCasesList} 
                  files={filesState} 
                  code={code} 
                  onAllPassed={() => setAllTestsPassed(true)} 
                  isViewOnly={isViewOnly}
                />
              )}
            </div>

            {/* SUBMIT / BACK BUTTON */}
            <div className="p-3 border-t border-quest-border bg-quest-bg flex flex-col gap-1.5 items-center justify-end">
              <button
                onClick={handleSubmitSolution}
                disabled={!isViewOnly && (!allTestsPassed && !isCompleted || isSubmitting)}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isViewOnly
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/20'
                    : isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 cursor-pointer'
                    : allTestsPassed
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-md cursor-pointer'
                    : 'bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <span>
                  {isViewOnly
                    ? 'View Solution (Completed) ✓ — Back to Coding'
                    : isSubmitting
                    ? 'Submitting...'
                    : isCompleted 
                    ? 'Finish Challenge ✓' 
                    : allTestsPassed 
                    ? 'Submit Solution' 
                    : 'Pass All Tests to Submit'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}