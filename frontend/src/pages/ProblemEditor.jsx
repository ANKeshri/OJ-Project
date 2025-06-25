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

  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then(res => res.json())
      .then(setProblem);
  }, [id]);

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  if (!problem) return <div className="p-8">Loading...</div>;

  return (
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
          {/* Examples */}
          <div className="mb-6">
            <span className="font-semibold text-white">Examples:</span>
            {problem.samples.map((s, i) => (
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
          <button className="font-semibold px-3 py-2 rounded-t text-gray-400 cursor-not-allowed" disabled>Testcase</button>
          <button className="font-semibold px-3 py-2 rounded-t text-gray-400 cursor-not-allowed" disabled>Test Result</button>
        </div>
        {/* Code Editor Content */}
        <div className="flex-1 flex flex-col gap-4 px-8 py-6">
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="mb-1 text-sm text-gray-400">Input</div>
              <textarea
                className="w-full h-20 bg-navy-dark text-white p-2 rounded border border-navy-dark"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <div className="mb-1 text-sm text-gray-400">Output</div>
              <textarea
                className="w-full h-20 bg-navy-dark text-white p-2 rounded border border-navy-dark"
                value={output}
                readOnly
              />
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <button className="bg-accentblue text-white px-6 py-2 rounded font-semibold shadow hover:bg-accentblue/80 transition-colors" disabled>Run</button>
            <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition-colors" disabled>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor; 