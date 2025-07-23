import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosclient';
import SubmissionHistory from '../components/sumbissionhistory';
import ChatAi from '../components/chatai';
import Editorial from '../components/editorial';
import CommentSection from '../components/comment';
import ProblemUserCounter from '../components/livecount';
import EditorialAccessChecker from '../components/editorialaccess';

const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javascript',
};

const ProblemPage = () => {
  const [problem, setproblem] = useState(null);
  const [selectedlanguage, setselectedlanguage] = useState('javascript');
  const [code, setcode] = useState('');
  const [loading, setloading] = useState(false);
  const [runresult, setrunresult] = useState(null);
  const [submitresult, setsubmitresult] = useState(null);
  const [activelefttab, setactivelefttab] = useState('description');
  const [activerighttab, setactiverighttab] = useState('code');
  const [solvedProblems, setSolvedProblems] = useState([]);
  const editorRef = useRef(null);
  let { problemId } = useParams();
  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setloading(true);
      try {
        const response = await axiosClient.get(`/problem/problembyid/${problemId}`);
        setproblem(response.data);
        setloading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setloading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    fetchSolvedProblems();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(
        sc => sc.language.toLowerCase() === langMap[selectedlanguage].toLowerCase()
      )?.initialcode;
      setcode(initialCode);
    }
  }, [selectedlanguage, problem]);

  const handleEditorChange = (value) => setcode(value || '');
  const handleEditorDidMount = (editor) => editorRef.current = editor;
  const handleLanguageChange = (language) => setselectedlanguage(language);

  const handleRun = async () => {
    setloading(true);
    setrunresult(null);
    try {
      const response = await axiosClient.post(`/submissions/runcode/${problemId}`, { code, language: selectedlanguage });
      setrunresult(response.data);
      setloading(false);
      setactiverighttab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setloading(false);
      setrunresult({ success: false, error: 'internal server error' });
      setactiverighttab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setloading(true);
    setsubmitresult(null);
    try {
      const response = await axiosClient.post(`/submissions/submit/${problemId}`, { code, language: selectedlanguage });
      setsubmitresult(response.data);
      setloading(false);
      setactiverighttab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setloading(false);
      setsubmitresult({ success: false, error: 'internal server error' });
      setactiverighttab('result');
    }
  };

  const getlanguageformonaco = (language) => {
    switch (language) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'javascript': return 'javascript';
      default: return 'javascript';
    }
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#18181a]">
        <span className="loading loading-spinner loading-lg text-[#ffa116]"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#18181a] text-[#e2e2e2]">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-[#232323] bg-[#18181a]">
        {/* Title, Tags, Difficulty, Live Counter (Responsive Wrap) */}
        <div className="flex flex-wrap md:flex-nowrap items-start md:items-center justify-between px-6 pt-6 gap-4">
          <div className="flex flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-[#ffa116] break-words">{problem?.title}</h1>
            <div className="badge badge-primary bg-[#333] text-[#ffa116] border-none">{problem?.tags}</div>
            <div className={`badge badge-outline ${getDifficultyBadgeColor(problem?.difficulty)} border-2`}>
              {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-green-400 font-bold text-lg">
              <ProblemUserCounter />
            </span>
            {problem?.solvedByUser && (
              <span className="flex items-center gap-1 text-green-400 font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Solved
              </span>
            )}
          </div>
        </div>
   <div className="tabs tabs-bordered bg-[#232323] px-4 mt-2">
  <button 
    className={`tab tab-bordered ${activelefttab === 'description' ? 'tab-active border-[#ffa116]' : ''} text-[#ffa116]`}
    onClick={() => setactivelefttab('description')}
  >
    Description
  </button>
  <button 
    className={`tab tab-bordered ${activelefttab === 'editorial' ? 'tab-active border-[#ffa116]' : ''} text-[#ffa116]`}
    onClick={() => setactivelefttab('editorial')}
  >
    Editorial
  </button>
  <button 
    className={`tab tab-bordered ${activelefttab === 'solutions' ? 'tab-active border-[#ffa116]' : ''} text-[#ffa116]`}
    onClick={() => setactivelefttab('solutions')}
  >
    Solutions
  </button>
  <button 
    className={`tab tab-bordered ${activelefttab === 'submissions' ? 'tab-active border-[#ffa116]' : ''} text-[#ffa116]`}
    onClick={() => setactivelefttab('submissions')}
  >
    Submissions
  </button>
  <button 
    className={`tab tab-bordered ${activelefttab === 'chatai' ? 'tab-active border-[#ffa116]' : ''} text-[#ffa116]`}
    onClick={() => setactivelefttab('chatai')}
  >
    CHAT with AI
  </button>
  <button 
    className={`tab tab-bordered ${activelefttab === 'comments' ? 'tab-active border-[#ffa116]' : ''} text-[#ffa116]`}
    onClick={() => setactivelefttab('comments')}
  >
    Discussions
  </button>
</div>

                <div className="flex-1 overflow-y-auto p-6">
                    {problem && (
                        <>
                            {activelefttab === 'description' && (
                                <div>
                                    <div className="prose max-w-none">
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {problem.description}
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold mb-4 text-[#ffa116]">Examples:</h3>
                                        <div className="space-y-4">
                                            {problem.visibletestcases.map((example, index) => (
                                                <div key={index} className="bg-[#232323] p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2 text-[#ffa116]">Example {index + 1}:</h4>
                                                    <div className="space-y-2 text-sm font-mono">
                                                        <div><strong>Input:</strong> {example.input}</div>
                                                        <div><strong>Output:</strong> {example.output}</div>
                                                        <div><strong>Explanation:</strong> {example.explanation}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activelefttab === 'editorial' && (
                                <div className="prose max-w-none">
                                    <h2 className="text-xl font-bold mb-4 text-[#ffa116]">Editorial</h2>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                       <EditorialAccessChecker 
        secureUrl={problem.secureUrl}
        thumbnailUrl={problem.thumbnailUrl}
        duration={problem.duration}
      />
                                    </div>
                                </div>
                            )}
{activelefttab === 'solutions' && (
  <div>
    <h2 className="text-xl font-bold mb-4 text-[#ffa116]">Solutions</h2>
    <div className="space-y-6">
      {problem.referenceCode?.length > 0 && 
      solvedProblems.some(sp => sp._id === problem._id) ? (
        problem.referenceCode.map((solution, index) => (
          <div
            key={index}
            className="border border-[#303030] rounded-lg overflow-hidden shadow bg-[#1e1e1e]"
          >
            <div className="flex items-center justify-between bg-[#252525] px-4 py-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#e2e2e2]">{problem?.title}</span>
                <span className="badge border-[#444] text-[#b0b0b0] bg-[#2a2a2a]">
                  {solution?.language}
                </span>
              </div>
              <span className="text-xs text-[#888]">#{index + 1}</span>
            </div>
            <div className="p-0">
              <pre className="bg-[#1a1a1a] p-4 rounded-b text-sm overflow-x-auto font-mono leading-relaxed text-[#d4d4d4]">
                <code>{solution?.completecode}</code>
              </pre>
            </div>
          </div>
        ))
      ) : (
        <p className="text-[#888]">Solutions will be available after you solve the problem.</p>
      )}
    </div>
  </div>
)}

                            {activelefttab === 'submissions' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-[#ffa116]">My Submissions</h2>
                                    <div className="text-gray-500">
                                        <SubmissionHistory problemId={problemId} />
                                    </div>
                                </div>
                            )}
                            {activelefttab === 'chatai' && (
                                <div className="prose max-w-none">
                                    <h2 className="text-xl font-bold mb-4 text-[#ffa116]">CHAT with AI</h2>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        <ChatAi problem={problem}></ChatAi>
                                    </div>
                                </div>
                            )}
                            {activelefttab === 'comments' && (
                                <CommentSection />
                            )}
                        </>
                    )}
                </div>
              
            </div>
{/* Right Panel */}
            <div className="w-1/2 flex flex-col bg-[#18181a] relative">
                <div className="tabs tabs-bordered bg-[#232323] px-4">
                    <button 
                        className={`tab ${activerighttab === 'code' ? 'tab-active text-[#ffa116]' : 'text-[#e2e2e2]'}`}
                        onClick={() => setactiverighttab('code')}
                    >
                        Code
                    </button>
                    <button 
                        className={`tab ${activerighttab === 'testcase' ? 'tab-active text-[#ffa116]' : 'text-[#e2e2e2]'}`}
                        onClick={() => setactiverighttab('testcase')}
                    >
                        Testcase
                    </button>
                    <button 
                        className={`tab ${activerighttab === 'result' ? 'tab-active text-[#ffa116]' : 'text-[#e2e2e2]'}`}
                        onClick={() => setactiverighttab('result')}
                    >
                        Result
                    </button>
                </div>
                <div className="flex-1 flex flex-col">
                    {/* Code Editor */}
                    {activerighttab === 'code' && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-[#333] bg-[#232323]">
                                <div className="flex gap-2">
                                    {['javascript', 'java', 'cpp'].map((lang) => (
                                        <button
                                            key={lang}
                                            className={`btn btn-sm ${selectedlanguage === lang ? 'bg-[#ffa116] text-[#232323]' : 'btn-ghost text-[#e2e2e2]'}`}
                                            onClick={() => handleLanguageChange(lang)}
                                        >
                                            {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 bg-[#18181a]">
                                <Editor
                                    height="100%"
                                    language={getlanguageformonaco(selectedlanguage)}
                                    value={code}
                                    onChange={handleEditorChange}
                                    onMount={handleEditorDidMount}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 2,
                                        insertSpaces: true,
                                        wordWrap: 'on',
                                        lineNumbers: 'on',
                                        glyphMargin: false,
                                        folding: true,
                                        lineDecorationsWidth: 10,
                                        lineNumbersMinChars: 3,
                                        renderLineHighlight: 'line',
                                        selectOnLineNumbers: true,
                                        roundedSelection: false,
                                        readOnly: false,
                                        cursorStyle: 'line',
                                        mouseWheelZoom: true,
                                    }}
                                />
                            </div>
                            <div className="p-4 border-t border-[#333] flex justify-between bg-[#232323]">
                                <div className="flex gap-2">
                                    <button 
                                        className="btn btn-ghost btn-sm text-[#e2e2e2]"
                                        onClick={() => setactiverighttab('testcase')}
                                    >
                                        Console
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className={`btn btn-outline btn-sm ${loading ? 'loading' : ''} border-[#ffa116] text-[#ffa116]`}
                                        onClick={handleRun}
                                        disabled={loading}
                                    >
                                        Run
                                    </button>
                                    <button
                                        className={`btn btn-primary btn-sm ${loading ? 'loading' : ''} bg-[#ffa116] text-[#232323] border-none`}
                                        onClick={handleSubmitCode}
                                        disabled={loading}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Result Panel - LeetCode style, below editor */}
                    {(activerighttab === 'testcase' || activerighttab === 'result') && (
                        <div className="w-full">
                            {/* Status Bar */}
                            {(activerighttab === 'testcase' && runresult && runresult.testResults) && (
                                <div className={`w-full px-4 py-2 flex items-center justify-between ${runresult.testResults.every(tc => tc.status_id === 3) ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'} rounded-t`}>
                                    <span className="font-bold text-lg">
                                        {runresult.testResults.every(tc => tc.status_id === 3) ? 'Accepted' : 'Wrong Answer'}
                                    </span>
                                    <span className="text-sm">
                                        Runtime: {runresult.testResults.reduce((acc, tc) => acc + parseFloat(tc.time || 0), 0).toFixed(3)} sec
                                    </span>
                                    <span className="text-sm">
                                        Memory: {runresult.testResults.reduce((acc, tc) => acc + (tc.memory || 0), 0)} KB
                                    </span>
                                </div>
                            )}
                            {(activerighttab === 'result' && submitresult && submitresult.submission) && (
                                <div className={`w-full px-4 py-2 flex items-center justify-between ${submitresult.submission.status === 'accepted' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'} rounded-t`}>
                                    <span className="font-bold text-lg">
                                        {submitresult.submission.status === 'accepted' ? 'Accepted' : submitresult.submission.status.toUpperCase()}
                                    </span>
                                    <span className="text-sm">
                                        Runtime: {submitresult.submission.runTime} sec
                                    </span>
                                    <span className="text-sm">
                                        Memory: {submitresult.submission.memory} KB
                                    </span>
                                </div>
                            )}
                            {/* Test Case Details */}
                            {(activerighttab === 'testcase' && runresult && runresult.testResults) && (
                                <div className="bg-[#232323] px-4 py-2 rounded-b">
                                    {runresult.testResults.map((tc, i) => (
                                        <details key={i} className="mb-2">
                                            <summary className={`cursor-pointer font-mono text-sm ${tc.status_id === 3 ? 'text-green-400' : 'text-red-400'}`}>
                                                {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'} - Test Case {i + 1}
                                            </summary>
                                            <div className="pl-4 pt-2 text-xs">
                                                <div><strong>Input:</strong> {tc.stdin}</div>
                                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                                <div><strong>Output:</strong> {tc.stdout}</div>
                                                {tc.status_id !== 3 && <div className="text-red-400"><strong>Error:</strong> {tc.stderr}</div>}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            )}
                            {(activerighttab === 'result' && submitresult && submitresult.submission) && (
                                <div className="bg-[#232323] px-4 py-2 rounded-b">
                                    <div className="text-sm">
                                        <div>Test Cases Passed: {submitresult.submission.testcasespassed}/{submitresult.submission.totalTestcases}</div>
                                        {submitresult.submission.status !== 'accepted' && (
                                            <div className="text-red-400">Error: {submitresult.submission.errorMessage || 'No additional error info'}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemPage; 