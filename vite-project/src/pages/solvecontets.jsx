import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosclient';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript',
};

const SolveContestProblem = () => {
  const { contestId, problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const editorRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${problemId}`);
        setProblem(res.data);
        const initialCode = res.data.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialcode || '';
        setCode(initialCode);
      } catch (err) {
        console.error('Error fetching problem:', err);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialcode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => (editorRef.current = editor);
  const handleLanguageChange = (lang) => setSelectedLanguage(lang);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submissions/runcode/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setActiveTab('testcase');
    } catch (error) {
      setRunResult({ success: false, error: 'Internal server error' });
      setActiveTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submissions/submit/${problemId}`, {
        code,
        language: selectedLanguage,
        contestId,
      });
      setSubmitResult(response.data);
      setActiveTab('result');
    } catch (error) {
      setSubmitResult({ success: false, error: 'Internal server error' });
      setActiveTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => lang;

  if (!problem) {
    return <div className="flex justify-center items-center min-h-screen bg-[#1e1e1e] text-white">Loading...</div>;
  }

  return (
    <div className="h-screen flex text-white bg-[#1e1e1e]">
      {/* Problem Description */}
      <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="bg-gray-800 px-3 py-1 rounded">⏱ {formatTime(timeLeft)}</div>
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{problem.description}</div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Examples</h3>
          <div className="space-y-4">
            {problem.visibletestcases.map((example, idx) => (
              <div key={idx} className="bg-gray-800 p-4 rounded">
                <div><strong>Input:</strong> {example.input}</div>
                <div><strong>Output:</strong> {example.output}</div>
                <div><strong>Explanation:</strong> {example.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor and Controls */}
      <div className="w-1/2 flex flex-col">
        <div className="bg-[#252526] px-4 py-2 flex justify-between items-center border-b border-gray-700">
          <div className="space-x-2">
            {['javascript', 'java', 'cpp'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded ${selectedLanguage === lang ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleRun}
              disabled={loading}
              className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
            >
              {loading ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSubmitCode}
              disabled={loading}
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        <Editor
          height="100%"
          language={getLanguageForMonaco(selectedLanguage)}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
        {activeTab !== 'code' && (
          <div className="p-4 bg-[#2d2d2d] h-60 overflow-y-auto">
            {activeTab === 'testcase' && (
              <>
                <h4 className="font-semibold mb-2">Test Results</h4>
                {runResult?.testResults?.map((tc, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs">Input: {tc.stdin}</p>
                    <p className="text-xs">Expected: {tc.expected_output}</p>
                    <p className="text-xs">Output: {tc.stdout}</p>
                    <p className={`text-xs ${tc.status_id === 3 ? 'text-green-400' : 'text-red-400'}`}>
                      {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                    </p>
                  </div>
                )) || 'No results yet.'}
              </>
            )}
            {activeTab === 'result' && (
              <>
                <h4 className="font-semibold mb-2">Submission Result</h4>
                {submitResult?.submission ? (
                  <>
                    <p>Status: {submitResult.submission.status}</p>
                    <p>Testcases Passed: {submitResult.submission.testcasespassed}/{submitResult.submission.totalTestcases}</p>
                    <p>Runtime: {submitResult.submission.runTime} sec</p>
                    <p>Memory: {submitResult.submission.memory} KB</p>
                  </>
                ) : 'No submission yet.'}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolveContestProblem;
