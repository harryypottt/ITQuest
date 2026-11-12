import { useState, useEffect, useCallback, useRef, type ReactElement } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ChallengeCard from './components/ChallengeCard';
import FileTabs from './components/FileTabs';
import CodeEditor from './components/CodeEditor';
import LivePreview from './components/LivePreview';
import TestRunner from './components/TestRunner';
import ChallengeDescription from './components/ChallengeDescription';
import { fetchCodingChallenges, fetchCodingChallengeById, submitChallengeSolution } from '@/services/coding.service';

export default function CodingPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <CodingDashboardList />;
  }

  return <ChallengeWorkspaceView id={id} />;
}

// 1. DASHBOARD LIST COMPONENT (Full width / sakop na ang buong screen)
function CodingDashboardList() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetchCodingChallenges();
        const challengesList = Array.isArray(response) ? response : response?.data || [];
        setChallenges(challengesList);
      } catch (err: any) {
        console.error('Failed to fetch coding challenges:', err);
        setError('Hindi ma-load ang mga coding challenges.');
      } finally {
        setLoading(false);
      }
    };
    loadChallenges();
  }, []);

  const totalAvailable = challenges.length;
  const completedCount = challenges.filter(c => c.is_completed || c.submission_status === 'passed').length;
  const totalXpAvailable = challenges.reduce((acc, curr) => acc + (curr.xp_reward || 0), 0);
  const xpEarned = challenges
    .filter(c => c.is_completed || c.submission_status === 'passed')
    .reduce((acc, curr) => acc + (curr.xp_reward || 0), 0);

  const progressPercentage = totalAvailable > 0 ? Math.round((completedCount / totalAvailable) * 100) : 0;

  const filteredChallenges = challenges.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      {/* Ginawa nating w-full at px-6 para sakop ang buong lapad ng screen */}
      <div className="w-full px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="ri-code-box-line text-quest-primary" /> Coding Challenges
          </h1>
          <p className="text-xs text-quest-textMuted mt-1">
            Sharpen your skills with hands-on coding problems. Solve challenges, earn XP, and level up.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-quest-card border border-quest-border p-4 rounded-xl">
            <p className="text-xs text-quest-textDim">Available</p>
            <p className="text-2xl font-bold text-white mt-1">{totalAvailable}</p>
          </div>
          <div className="bg-quest-card border border-quest-border p-4 rounded-xl">
            <p className="text-xs text-quest-textDim">Completed</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
          </div>
          <div className="bg-quest-card border border-quest-border p-4 rounded-xl">
            <p className="text-xs text-quest-textDim">Total XP Available</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{totalXpAvailable}</p>
          </div>
          <div className="bg-quest-card border border-quest-border p-4 rounded-xl">
            <p className="text-xs text-quest-textDim">XP Earned</p>
            <p className="text-2xl font-bold text-quest-primary mt-1">{xpEarned}</p>
          </div>
        </div>

        {/* Overall Progress Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-quest-card border border-quest-border px-4 py-3 rounded-xl text-xs">
          <span className="text-quest-textDim font-medium">Overall Progress</span>
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="flex-1 bg-quest-bg h-2 rounded-full overflow-hidden border border-quest-border">
              <div 
                className="bg-quest-primary h-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-quest-text font-semibold whitespace-nowrap">{completedCount}/{totalAvailable} completed</span>
          </div>
        </div>

        {/* Filter & Search Bar Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-quest-card border border-quest-border p-4 rounded-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['All', 'JavaScript', 'HTML/CSS/JS', 'Database'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-quest-primary text-gray-950 font-bold'
                    : 'bg-quest-bg text-quest-textDim hover:text-white border border-quest-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-quest-textDim text-xs" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-quest-bg border border-quest-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-quest-textDim focus:outline-none focus:border-quest-primary"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 gap-2">
            <i className="ri-loader-4-line animate-spin text-quest-primary text-xl" />
            <span className="text-xs text-quest-textMuted">Naglo-load ng challenges...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Challenge Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge) => {
                const isCompleted = challenge.is_completed || challenge.submission_status === 'passed';
                const submissionData = {
                  status: challenge.submission_status,
                  tests_passed: challenge.tests_passed,
                  tests_total: challenge.tests_total,
                };

                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={{ ...challenge, submission: submissionData }}
                    isCompleted={Boolean(isCompleted)}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-quest-textDim text-xs">
                Walang nakitang coding challenges na tumutugma sa iyong hinahanap.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// 2. WORKSPACE COMPONENT (Para sa iisang challenge)
type RightPanel = 'preview' | 'tests';

function ChallengeWorkspaceView({ id }: { id: string }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isViewOnly = searchParams.get('viewOnly') === 'true';

  const rightPanelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const loadWorkspaceData = async () => {
      try {
        const dbChallenge = await fetchCodingChallengeById(id);
        const challengeData = dbChallenge?.data || dbChallenge;
       
        setChallenge(challengeData);

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
  }, [id]);

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

        <div className="flex-1 flex overflow-hidden">
          {showDescription && (
            <div className="w-[340px] border-r border-quest-border bg-quest-card flex-shrink-0 h-full">
              <ChallengeDescription challenge={challenge} />
            </div>
          )}

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