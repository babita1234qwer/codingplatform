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
    // eslint-disable-next-line
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialcode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submissions/runcode/${problemId}`, {
        code,
        language: selectedLanguage,
      });
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
        contestId
        
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

  const getLanguageForMonaco = (language) => {
    switch (language) {
      case 'cpp':
        return 'cpp';
      case 'java':
        return 'java';
      case 'javascript':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  if (!problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* Left: Problem Description */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <div className="badge badge-outline text-green-500">
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </div>
              <div className="badge badge-primary">{problem.tags}</div>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {problem.description}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Examples:</h3>
              <div className="space-y-4">
                {problem.visibletestcases.map((example, index) => (
                  <div key={index} className="bg-base-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
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
        </div>
      </div>

      {/* Right: Code Editor and Tabs */}
      <div className="w-1/2 flex flex-col">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button
            className={`tab ${activeTab === 'code' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
          <button
            className={`tab ${activeTab === 'testcase' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('testcase')}
          >
            Testcase
          </button>
          <button
            className={`tab ${activeTab === 'result' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            Result
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          {activeTab === 'code' && (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
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
              <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult && runResult.testResults ? (
                <div className={`alert ${runResult.testResults.every(tc => tc.status_id === 3)
                  ? 'alert-success'
                  : 'alert-error'
                  } mb-4`}>
                  <div>
                    {runResult.testResults.every(tc => tc.status_id === 3) ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">
                          Runtime: {runResult.testResults.reduce((acc, tc) => acc + parseFloat(tc.time || 0), 0).toFixed(3)} sec
                        </p>
                        <p className="text-sm">
                          Memory: {runResult.testResults.reduce((acc, tc) => acc + (tc.memory || 0), 0)} KB
                        </p>
                        <div className="mt-4 space-y-2">
                          {runResult.testResults.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-600'}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Some test cases failed</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testResults.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id === 3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult && submitResult.submission ? (
                <div className={`alert ${submitResult.submission.status === 'accepted' ? 'alert-success' : 'alert-error'}`}>
                  <div>
                    {submitResult.submission.status === 'accepted' ? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.submission.testcasespassed}/{submitResult.submission.totalTestcases}</p>
                          <p>Runtime: {submitResult.submission.runTime + " sec"}</p>
                          <p>Memory: {submitResult.submission.memory + " KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitResult.submission.status.toUpperCase()}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Error: {submitResult.submission.errorMessage || 'No additional error info'}</p>
                          <p>Test Cases Passed: {submitResult.submission.testcasespassed}/{submitResult.submission.totalTestcases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolveContestProblem;