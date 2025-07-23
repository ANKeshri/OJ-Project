import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { toast } from 'react-toastify';

const languages = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
];
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const defaultCode = {
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // your code goes here\n    }\n}',
  python: '# your code goes here',
};

const badgeColors = {
  easy: 'bg-green-600',
  medium: 'bg-yellow-500',
  hard: 'bg-red-600',
};

const ProblemEditor = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultCode.cpp);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [editorTab, setEditorTab] = useState('code');
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResults, setSubmitResults] = useState([]);
  const [allPassed, setAllPassed] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [status, setStatus] = useState('Not Attempted'); // NEW STATE
  const [user, setUser] = useState(null); // NEW STATE
  const [statusLoading, setStatusLoading] = useState(true); // NEW STATE
  const [submissions, setSubmissions] = useState([]); // NEW STATE for submissions
  const [submissionsLoading, setSubmissionsLoading] = useState(false); // NEW STATE
  const [selectedSubmission, setSelectedSubmission] = useState(null); // NEW STATE

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/problems/${id}`)
      .then(res => res.json())
      .then(setProblem);
    fetch(`${API_BASE_URL}/api/problems/${id}/testcases`)
      .then(res => res.json())
      .then(setSampleTestCases);
  }, [id]);

  // Fetch persistent submission status for this user and problem
  useEffect(() => {
    if (!user) {
      setStatus('Not Attempted');
      setStatusLoading(false);
      return;
    }
    setStatusLoading(true);
    fetch(`${API_BASE_URL}/api/problems/${id}/status`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setStatus(data.status || 'Not Attempted');
        setStatusLoading(false);
      })
      .catch(() => {
        setStatus('Not Attempted');
        setStatusLoading(false);
      });
  }, [id, user]);

  // Function to fetch submissions for this problem
  const fetchSubmissions = async () => {
    if (!user) return;
    setSubmissionsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/problems/${id}/submissions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    }
    setSubmissionsLoading(false);
  };

  // Function to fetch a specific submission's code
  const fetchSubmissionCode = async (submissionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/problems/submissions/${submissionId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSelectedSubmission(data);
    } catch (err) {
      console.error('Error fetching submission code:', err);
      toast.error('Error loading submission details');
    }
  };

  // Fetch submissions when tab changes to submissions
  useEffect(() => {
    if (activeTab === 'submissions' && user) {
      fetchSubmissions();
    }
  }, [activeTab, user, id]);

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const handleRunAll = async () => {
    setIsRunning(true);
    setTestResults([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/problems/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      const data = await res.json();
      setTestResults(data.results || []);
      setEditorTab('testresult');
      if (data.results && data.results.length > 0 && data.results.every(r => r.passed)) {
        toast.success('All sample test cases passed!');
      } else if (data.results && data.results.length > 0) {
        toast.error('Some sample test cases failed.');
      }
    } catch (err) {
      setTestResults([{ error: 'Error running code' }]);
      setEditorTab('testresult');
      toast.error('Error running code');
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResults([]);
    setAllPassed(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/problems/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ language, code })
      });
      const data = await res.json();
      setSubmitResults(data.results || []);
      setAllPassed(data.allPassed);
      setEditorTab('submitresult');
      if (data.allPassed) {
        toast.success('All test cases passed! Submitted successfully.');
        setStatus('Submitted');
      } else {
        toast.error('Some test cases failed. Submission saved.');
      }
      // Refresh submissions if we're on submissions tab
      if (activeTab === 'submissions') {
        fetchSubmissions();
      }
    } catch (err) {
      setSubmitResults([{ error: 'Error submitting code' }]);
      setAllPassed(false);
      setEditorTab('submitresult');
      toast.error('Error submitting code');
    }
    setIsSubmitting(false);
  };

  const handleAnalyseWithAI = async () => {
    setIsAnalysing(true);
    setAiAnalysis('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, prompt: problem.description })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || 'No analysis received.');
    } catch (err) {
      setAiAnalysis('Error analysing code.');
    }
    setIsAnalysing(false);
  };

  if (!problem) return <div className="p-8">Loading...</div>;

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-background dark:bg-background overflow-hidden">
        {/* Left: Problem Description */}
        <div className="w-1/2 h-full overflow-y-auto border-r border-navy-dark bg-navy/80 p-0 custom-scrollbar">
          {/* Tabs */}
          <div className="flex items-center gap-2 px-8 pt-6 pb-2 border-b border-navy-dark bg-navy/90 sticky top-0 z-10">
            <button className={`font-semibold px-3 py-2 rounded-t ${activeTab==='description' ? 'bg-background text-accentblue' : 'text-gray-300 hover:text-accentblue'}`} onClick={()=>setActiveTab('description')}>Description</button>
            <button 
              className={`font-semibold px-3 py-2 rounded-t ${activeTab==='submissions' ? 'bg-background text-accentblue' : (user ? 'text-gray-300 hover:text-accentblue' : 'text-gray-400 cursor-not-allowed')}`} 
              onClick={()=> user && setActiveTab('submissions')}
              disabled={!user}
            >
              Submissions
            </button>
          </div>
          {/* Problem Content */}
          <div className="px-8 py-6">
            {activeTab === 'description' && (
              <div className="rounded-2xl shadow-xl border-l-4 border-blue-500 bg-gradient-to-br from-navy via-navy-dark to-navy/80 p-6 mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-white">{problem.title}</h2>
                  {/* Difficulty badge */}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    (problem.difficulty || 'Medium').toLowerCase() === 'easy' ? 'bg-green-600 text-white' :
                    (problem.difficulty || 'Medium').toLowerCase() === 'hard' ? 'bg-red-600 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {problem.difficulty || 'Medium'}
                  </span>
                  {/* Status badge */}
                  <span className={`ml-2 ${status === 'Submitted' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-200'} text-xs font-semibold px-3 py-1 rounded-full`}>
                    {status}
                  </span>
                </div>
                {/* Tags */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {(problem.tags || []).map((tag, idx) => (
                    <span key={idx} className="bg-blue-900/60 text-blue-300 text-xs px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                <div className="text-gray-200 text-base mb-6 whitespace-pre-line">
                  {problem.description}
                </div>
                <div className="mb-6">
                  <span className="font-semibold text-white">Constraints:</span>
                  <div className="text-gray-300 text-sm mt-1">{problem.constraints}</div>
                </div>
                {/* Examples (from sampleTestCases) */}
                <div className="mb-6">
                  <span className="font-semibold text-white">Examples:</span>
                  {sampleTestCases.map((s, i) => (
                    <div key={i} className="bg-navy-dark/80 rounded-lg p-4 my-2">
                      <div className="text-gray-400 text-xs mb-1">Input:</div>
                      <pre className="bg-navy-dark text-white rounded px-2 py-1 mb-2 whitespace-pre-wrap">{s.input}</pre>
                      <div className="text-gray-400 text-xs mb-1">Output:</div>
                      <pre className="bg-navy-dark text-white rounded px-2 py-1 whitespace-pre-wrap">{s.output}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'submissions' && (
              <div className="rounded-2xl shadow-xl border-l-4 border-purple-500 bg-gradient-to-br from-navy via-navy-dark to-navy/80 p-6 mb-6">
                <h2 className="text-3xl font-bold text-white mb-4">Your Submissions</h2>
                {!user && (
                  <div className="text-gray-300 text-center py-8">
                    Please log in to view your submissions.
                  </div>
                )}
                {user && submissionsLoading && (
                  <div className="text-gray-300 text-center py-8">
                    Loading submissions...
                  </div>
                )}
                {user && !submissionsLoading && submissions.length === 0 && (
                  <div className="text-gray-300 text-center py-8">
                    No submissions yet. Submit your solution to see it here!
                  </div>
                )}
                {user && !submissionsLoading && submissions.length > 0 && (
                  <div className="space-y-3">
                    {submissions.map((submission, idx) => (
                      <div 
                        key={submission._id} 
                        className="bg-navy-dark/80 rounded-lg p-4 hover:bg-navy-dark cursor-pointer transition-colors border border-navy-dark hover:border-accentblue"
                        onClick={() => fetchSubmissionCode(submission._id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">#{idx + 1}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              submission.status === 'Submitted' 
                                ? 'bg-green-700 text-green-200' 
                                : 'bg-red-700 text-red-200'
                            }`}>
                              {submission.status === 'Submitted' ? 'Accepted' : 'Failed'}
                            </span>
                            <span className="text-gray-300 text-sm capitalize">
                              {submission.language}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Submission Code Modal/Details */}
                {selectedSubmission && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-navy rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6 border-b border-navy-dark">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-white">
                            Submission Details
                          </h3>
                          <button 
                            onClick={() => setSelectedSubmission(null)}
                            className="text-gray-400 hover:text-white text-2xl"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            selectedSubmission.status === 'Submitted' 
                              ? 'bg-green-700 text-green-200' 
                              : 'bg-red-700 text-red-200'
                          }`}>
                            {selectedSubmission.status === 'Submitted' ? 'Accepted' : 'Failed'}
                          </span>
                          <span className="text-gray-300 text-sm capitalize">
                            {selectedSubmission.language}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {new Date(selectedSubmission.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Code:</h4>
                        <pre className="bg-navy-dark text-white rounded p-4 overflow-x-auto whitespace-pre-wrap">
                          {selectedSubmission.code}
                        </pre>
                        {selectedSubmission.testResults && selectedSubmission.testResults.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-white mb-3">Test Results:</h4>
                            <div className="space-y-2">
                              {selectedSubmission.testResults.map((result, i) => (
                                <div key={i} className={`rounded-lg p-3 border ${
                                  result.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
                                }`}>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400">Test Case {i + 1}</span>
                                    <span className={`text-sm font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                      {result.passed ? 'Passed' : 'Failed'}
                                    </span>
                                  </div>
                                  {!result.passed && (
                                    <div className="text-xs text-gray-300">
                                      <div className="mb-1"><strong>Expected:</strong> {result.expectedOutput}</div>
                                      <div><strong>Got:</strong> {result.userOutput}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Right: Code Editor */}
        <div className="w-1/2 h-full flex flex-col bg-navy/80 rounded-r-2xl shadow-2xl">
          {/* Editor Tabs */}
          <div className="flex items-center gap-2 px-8 pt-6 pb-2 border-b border-navy-dark bg-navy/90 sticky top-0 z-10">
            <button className={`font-semibold px-3 py-2 rounded-t ${editorTab==='code' ? 'bg-background text-accentblue' : 'text-gray-300 hover:text-accentblue'}`} onClick={()=>setEditorTab('code')}>Code</button>
            <button className={`font-semibold px-3 py-2 rounded-t ${editorTab==='testcase' ? 'bg-background text-accentblue' : 'text-gray-300 hover:text-accentblue'}`} onClick={()=>setEditorTab('testcase')}>Testcase</button>
            <button className={`font-semibold px-3 py-2 rounded-t ${editorTab==='testresult' ? 'bg-background text-accentblue' : 'text-gray-300 hover:text-accentblue'}`} onClick={()=>setEditorTab('testresult')}>Test Result</button>
            <button className={`font-semibold px-3 py-2 rounded-t ${editorTab==='submitresult' ? 'bg-background text-accentblue' : 'text-gray-300 hover:text-accentblue'}`} onClick={()=>setEditorTab('submitresult')}>Submission</button>
          </div>
          {/* Code Editor Content */}
          <div className="flex-1 flex flex-col gap-4 px-8 py-6">
            {editorTab === 'code' && (
              <>
                <div className="flex gap-4 items-center mb-2">
                  <select
                    className="bg-navy-dark text-white px-3 py-2 rounded border border-navy-dark focus:outline-none focus:ring-2 focus:ring-accentblue"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
                {/* Replace textarea for code input with Monaco Editor */}
                <div className="w-full h-64 mb-4">
                  <Editor
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    language={language === "cpp" ? "cpp" : language}
                    value={code}
                    onChange={value => setCode(value || "")}
                    options={{
                      fontSize: 16,
                      minimap: { enabled: false },
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: "on",
                      readOnly: !user,
                      scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'auto',
                      },
                    }}
                  />
                </div>
                {!user && (
                  <div className="text-red-400 font-semibold mt-2">Please log in to write and submit code.</div>
                )}
                <div className="flex gap-4 mt-2">
                  <button className="bg-accentblue text-white px-6 py-2 rounded font-semibold shadow hover:bg-accentblue/80 transition-colors flex items-center justify-center min-w-[100px]" onClick={handleRunAll} disabled={isRunning || !user}>
                    {isRunning ? <span className="loader mr-2"></span> : null}{isRunning ? 'Running...' : 'Run'}
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition-colors flex items-center justify-center min-w-[100px]" onClick={handleSubmit} disabled={isSubmitting || !user}>
                    {isSubmitting ? <span className="loader mr-2"></span> : null}{isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-purple-700 transition-colors flex items-center justify-center min-w-[140px]" onClick={handleAnalyseWithAI} disabled={isAnalysing || !user}>
                    {isAnalysing ? 'Analysing...' : 'Analyse with AI'}
                  </button>
                </div>
                {aiAnalysis && (
                  <div className="mt-4 p-4 bg-navy-dark text-white rounded border border-purple-600 whitespace-pre-line">
                    <strong>AI Analysis:</strong>
                    <div>{aiAnalysis}</div>
                  </div>
                )}
              </>
            )}
            {editorTab === 'testcase' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Sample Test Cases</h3>
                {sampleTestCases.map((tc, i) => (
                  <div key={i} className="bg-navy-dark/80 rounded-lg p-4 my-2">
                    <div className="text-gray-400 text-xs mb-1">Input:</div>
                    <pre className="bg-navy-dark text-white rounded px-2 py-1 mb-2 whitespace-pre-wrap">{tc.input}</pre>
                    <div className="text-gray-400 text-xs mb-1">Output:</div>
                    <pre className="bg-navy-dark text-white rounded px-2 py-1 whitespace-pre-wrap">{tc.output}</pre>
                  </div>
                ))}
              </div>
            )}
            {editorTab === 'testresult' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Test Results</h3>
                {testResults.length === 0 && <div className="text-gray-400">No results yet.</div>}
                {testResults.map((result, i) => (
                  <div key={i} className={`rounded-lg p-4 my-2 border-2 ${result.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                    <div className="text-gray-400 text-xs mb-1">Input:</div>
                    <pre className="bg-navy-dark text-white rounded px-2 py-1 mb-2 whitespace-pre-wrap">{result.input}</pre>
                    <div className="text-gray-400 text-xs mb-1">Expected Output:</div>
                    <pre className="bg-navy-dark text-white rounded px-2 py-1 mb-2 whitespace-pre-wrap">{result.expectedOutput}</pre>
                    <div className="text-gray-400 text-xs mb-1">Your Output:</div>
                    <pre className="bg-navy-dark text-white rounded px-2 py-1 whitespace-pre-wrap">{result.userOutput}</pre>
                    {result.error && <div className="text-red-400 mt-2">Error: {result.error}</div>}
                    <div className={`mt-2 font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>{result.passed ? 'Passed' : 'Failed'}</div>
                  </div>
                ))}
              </div>
            )}
            {editorTab === 'submitresult' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Submission Results</h3>
                {allPassed === true && (
                  <div className="mb-4 p-3 rounded bg-green-900/40 border border-green-500 text-green-300 font-bold text-lg">
                    All test cases passed! <span className="ml-2">✅ Code submitted successfully.</span>
                  </div>
                )}
                {allPassed === false && (
                  <div className="mb-4 p-3 rounded bg-red-900/40 border border-red-500 text-red-300 font-bold text-lg">
                    Some test cases failed. ❌ Code not submitted. Please check your logic and try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemEditor;