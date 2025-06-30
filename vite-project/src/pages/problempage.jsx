
import {useState,useEffect,useRef} from 'react';
import {useForm} from 'react-hook-form';
import Editor from '@monaco-editor/react';
import {useParams} from 'react-router';
import axiosClient from '../utils/axiosclient';
import SubmissionHistory from '../components/sumbissionhistory';
import ChatAi from '../components/chatai';
import Editorial from '../components/editorial';
import CommentSection from '../components/comment';
import ProblemUserCounter from '../components/livecount';
const langMap={
    cpp:'C++',
    java:'Java',
    javascript:'JavaScript',
};
const ProblemPage=()=>{
    const [problem,setproblem]=useState(null);
    const [selectedlanguage,setselectedlanguage]=useState('javascript');
    const [code,setcode]=useState('');
    const [loading,setloading]=useState(false);
    const [runresult,setrunresult]=useState(null);
    const [submitresult,setsubmitresult]=useState(null);
    const [activelefttab,setactivelefttab]=useState('description');
    const [activerighttab,setactiverighttab]=useState('code');
    const editorRef= useRef(null);
    let {problemId} = useParams();
    const {handleSubmit}= useForm();
    useEffect(()=>{
        const fetchProblem=async()=>{
            setloading(true);
            try{
                const response=await axiosClient.get(`/problem/problembyid/${problemId}`);
                const initialCode=response.data.startCode.find(sc=>sc.language==langMap[selectedlanguage])?.initialcode;
                setproblem(response.data);
                setcode(initialCode);
                setloading(false);
            }
            catch(error){
                console.error('Error fetching problem:',error);
                setloading(false);
            }
        };
        fetchProblem();
    },[problemId]);
    useEffect(()=>{
        if(problem){
            const initialCode=problem.startCode.find(sc=>sc.language==langMap[selectedlanguage])?.initialcode;
            setcode(initialCode);
        }
    },[selectedlanguage, problem]);
    const handleEditorChange=(value)=>{
        setcode(value||'');
    };
    const handleEditorDidMount=(editor)=>{
        editorRef.current=editor;
        
    }
    const handleLanguageChange=(language)=>{
        setselectedlanguage(language);
    }
    const handleRun=async()=>{
        setloading(true);
        setrunresult(null);
        try{console.log('Running code with payload:', {
  code,
  language: selectedlanguage
});

            const response=await axiosClient.post(`/submissions/runcode/${problemId}`,{code,language:selectedlanguage});
            
            console.log('Run response:', response.data);
            setrunresult(response.data);        
            setloading(false);
            setactiverighttab('testcase');

    
    
        }
        catch(error){
            console.error('Error running code:',error);
            setloading(false);
            setrunresult({ success:false,
                error:'internal server error'});

            setactiverighttab('testcase');
        }

};
const handleSubmitCode=async()=>{
    setloading(true);
    setsubmitresult(null);
    try{
        const response=await axiosClient.post(`/submissions/submit/${problemId}`,{code,language:selectedlanguage});
        setsubmitresult(response.data);
        setloading(false);
        setactiverighttab('result');
    }
    catch(error){
        console.error('Error submitting code:',error);
        setloading(false);
        setsubmitresult({ success:false,
            error:'internal server error'});
        setactiverighttab('result');
    }
};
const getlanguageformonaco=(language) => {
    switch (language) {
        case 'cpp':
            return 'cpp';
        case 'java':
            return 'java';
        case 'javascript':
            return 'javascript';
        default:
            return 'javascript';
    }}
    const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
        case 'easy':
            return 'text-green-500';
        case 'medium':
            return 'text-yellow-500';
        case 'hard':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }};
    if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return(
    <div className="h-screen flex bg-base-100">
        <div className="w-1/2 flex flex-col border-r border-base-300">
<div className="tabs tabs-bordered bg-base-200 px-4">
          <button 
            className={`tab ${activelefttab === 'description' ? 'tab-active' : ''}`}
            onClick={() => setactivelefttab('description')}
          >

            Description
          </button>
           <button 
            className={`tab ${activelefttab === 'editorial' ? 'tab-active' : ''}`}
            onClick={() => setactivelefttab('editorial')}
          >
            Editorial
          </button>
          <button 
            className={`tab ${activelefttab === 'solutions' ? 'tab-active' : ''}`}
            onClick={() => setactivelefttab('solutions')}
          >
            Solutions
          </button>
          <button 
            className={`tab ${activelefttab === 'submissions' ? 'tab-active' : ''}`}
            onClick={() => setactivelefttab('submissions')}
          >
            Submissions
          </button>
          <button className={`tab${activelefttab==='chatai'?'tab-active':''}`}
          onClick={()=>setactivelefttab('chatai')}>
           CHAT with AI 
          </button>
          <button
  className={`tab ${activelefttab === 'comments' ? 'tab-active' : ''}`}
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
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyBadgeColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>
                  <ProblemUserCounter />
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
              )}
                    
                 {activelefttab === 'editorial' && (
                                 <div className="prose max-w-none">
                                   <h2 className="text-xl font-bold mb-4">Editorial</h2>
                                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                     <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                                   </div>
                                 </div>
                               )}

                {activelefttab === 'solutions' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Solutions</h2>
                    <div className="space-y-6">
                      {problem.referenceCode?.length > 0 ? (
                        problem.referenceCode.map((solution, index) => (
                          <div
                            key={index}
                            className="border border-base-300 rounded-lg overflow-hidden shadow bg-base-100"
                          >
                            <div className="flex items-center justify-between bg-base-200 px-4 py-2 rounded-t-lg">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{problem?.title}</span>
                                <span className="badge badge-outline badge-info">{solution?.language}</span>
                              </div>
                              <span className="text-xs text-base-content/60">#{index + 1}</span>
                            </div>
                            <div className="p-0">
                              <pre className="bg-base-300 p-4 rounded-b text-sm overflow-x-auto font-mono leading-relaxed">
                                <code>{solution?.completecode}</code>
                              </pre>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Solutions will be available after you solve the problem.</p>
                      )}
                    </div>
                  </div>
                )}
               {activelefttab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-gray-500">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

                {activelefttab === 'chatai' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
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
      <div className="w-1/2 flex flex-col">
      <div className="tabs tabs-bordered bg-base-200 px-4">
<button 
            className={`tab ${activerighttab === 'code' ? 'tab-active' : ''}`}
            onClick={() => setactiverighttab('code')}
          >
            Code
          </button>
          <button 
            className={`tab ${activerighttab === 'testcase' ? 'tab-active' : ''}`}
            onClick={() => setactiverighttab('testcase')}
          >
            Testcase
          </button>
          <button 
            className={`tab ${activerighttab === 'result' ? 'tab-active' : ''}`}
            onClick={() => setactiverighttab('result')}
          >
            Result
          </button>
        </div>

        
        <div className="flex-1 flex flex-col">
          {activerighttab === 'code' && (
            <div className="flex-1 flex flex-col">
              
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${selectedlanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
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

            
              <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setactiverighttab('testcase')}
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

          {activerighttab === 'testcase' && (
  <div className="flex-1 p-4 overflow-y-auto">
    <h3 className="font-semibold mb-4">Test Results</h3>
    {runresult && runresult.testResults ? (
      <div className={`alert ${
        runresult.testResults.every(tc => tc.status_id === 3)
          ? 'alert-success'
          : 'alert-error'
      } mb-4`}>
        <div>
          {runresult.testResults.every(tc => tc.status_id === 3) ? (
            <div>
              <h4 className="font-bold">✅ All test cases passed!</h4>
              <p className="text-sm mt-2">
                Runtime: {runresult.testResults.reduce((acc, tc) => acc + parseFloat(tc.time || 0), 0).toFixed(3)} sec
              </p>
              <p className="text-sm">
                Memory: {runresult.testResults.reduce((acc, tc) => acc + (tc.memory || 0), 0)} KB
              </p>
              <div className="mt-4 space-y-2">
                {runresult.testResults.map((tc, i) => (
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
                {runresult.testResults.map((tc, i) => (
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

          {activerighttab === 'result' && (
  <div className="flex-1 p-4 overflow-y-auto">
    <h3 className="font-semibold mb-4">Submission Result</h3>
    {submitresult && submitresult.submission ? (
      <div className={`alert ${submitresult.submission.status === 'accepted' ? 'alert-success' : 'alert-error'}`}>
        <div>
          {submitresult.submission.status === 'accepted' ? (
            <div>
              <h4 className="font-bold text-lg">🎉 Accepted</h4>
              <div className="mt-4 space-y-2">
                <p>Test Cases Passed: {submitresult.submission.testcasespassed}/{submitresult.submission.totalTestcases}</p>
                <p>Runtime: {submitresult.submission.runTime + " sec"}</p>
                <p>Memory: {submitresult.submission.memory + " KB"} </p>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-bold text-lg">❌ {submitresult.submission.status.toUpperCase()}</h4>
              <div className="mt-4 space-y-2">
                <p>Error: {submitresult.submission.errorMessage || 'No additional error info'}</p>
                <p>Test Cases Passed: {submitresult.submission.testcasespassed}/{submitresult.submission.totalTestcases}</p>
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

export default ProblemPage;