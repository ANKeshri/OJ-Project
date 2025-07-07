import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const languages = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
];

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
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);

  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then(res => res.json())
      .then(setProblem);
    fetch(`/api/problems/${id}/testcases`)
      .then(res => res.json())
      .then(setSampleTestCases);
  }, [id]);

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const handleRunAll = async () => {
    setIsRunning(true);
    setTestResults([]);
    try {
      const res = await fetch(`/api/problems/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      const data = await res.json();
      setTestResults(data.results || []);
      setEditorTab('testresult');
      if (data.results && data.results.length > 0 && data.results.every(r => r.passed)) {
        setToastMsg('All sample test cases passed!');
        setToastType('success');
        setShowToast(true);
      } else if (data.results && data.results.length > 0) {
        setToastMsg('Some sample test cases failed.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      setTestResults([{ error: 'Error running code' }]);
      setEditorTab('testresult');
      setToastMsg('Error running code');
      setToastType('error');
      setShowToast(true);
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResults([]);
    setAllPassed(null);
    try {
      const res = await fetch(`/api/problems/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      const data = await res.json();
      setSubmitResults(data.results || []);
      setAllPassed(data.allPassed);
      setEditorTab('submitresult');
      if (data.allPassed) {
        setToastMsg('All test cases passed! Submitted successfully.');
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMsg('Some test cases failed. Not submitted.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      setSubmitResults([{ error: 'Error submitting code' }]);
      setAllPassed(false);
      setEditorTab('submitresult');
      setToastMsg('Error submitting code');
      setToastType('error');
      setShowToast(true);
    }
    setIsSubmitting(false);
  };

  const handleAnalyseWithAI = async () => {
    setIsAnalysing(true);
    setAiAnalysis('');
    try {
      const res = await fetch('/api/ai/analyse', {
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

  // Toast auto-hide
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!problem) return <div className="p-8">Loading...</div>;

  return (
    <>
      {showToast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg font-semibold text-lg transition-all ${toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toastMsg}
        </div>
      )}
      <div className="flex h-[calc(100vh-64px)] bg-background dark:bg-background">
        {/* Left: Problem Description */}
        <div className="w-1/2 h-full overflow-y-auto border-r border-navy-dark bg-navy/80 p-0">
          {/* Tabs */}
          <div className="flex items-center gap-2 px-8 pt-6 pb-2 border-b border-navy-dark bg-navy/90 sticky top-0 z-10">
            <button className={`font-semibold px-3 py-2 rounded-t ${activeTab==='description' ? 'bg-background text-accentblue' : 'text-gray-300 hover:text-accentblue'}`} onClick={()=>setActiveTab('description')}>Description</button>
            <button className="font-semibold px-3 py-2 rounded-t text-gray-400 cursor-not-allowed" disabled>Editorial</button>
            <button className="font-semibold px-3 py-2 rounded-t text-gray-400 cursor-not-allowed" disabled>Solutions</button>
            <button className="font-semibold px-3 py-2 rounded-t text-gray-400 cursor-not-allowed" disabled>Submissions</button>
          </div>
          {/* Problem Content */}
          <div className="px-8 py-6">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-white">{problem.title}</h2>
              {/* Difficulty badge (placeholder: Medium) */}
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">Medium</span>
              {/* Status badge (placeholder: Not Attempted) */}
              <span className="ml-2 bg-gray-700 text-gray-200 text-xs font-semibold px-3 py-1 rounded-full">Not Attempted</span>
            </div>
            {/* Tags (placeholder) */}
            <div className="flex gap-2 mb-4">
              <span className="bg-yellow-900/60 text-yellow-300 text-xs px-2 py-1 rounded">Topics</span>
              <span className="bg-yellow-900/60 text-yellow-300 text-xs px-2 py-1 rounded">Companies</span>
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
        </div>
        {/* Right: Code Editor */}
        <div className="w-1/2 h-full flex flex-col bg-navy/80">
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
                <textarea
                  className="w-full h-64 bg-navy-dark text-green-200 p-4 rounded font-mono resize-none text-base border border-navy-dark focus:outline-none focus:ring-2 focus:ring-accentblue"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <div className="flex gap-4 mt-2">
                  <button className="bg-accentblue text-white px-6 py-2 rounded font-semibold shadow hover:bg-accentblue/80 transition-colors flex items-center justify-center min-w-[100px]" onClick={handleRunAll} disabled={isRunning}>
                    {isRunning ? <span className="loader mr-2"></span> : null}{isRunning ? 'Running...' : 'Run'}
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition-colors flex items-center justify-center min-w-[100px]" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <span className="loader mr-2"></span> : null}{isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-purple-700 transition-colors flex items-center justify-center min-w-[140px]" onClick={handleAnalyseWithAI} disabled={isAnalysing}>
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