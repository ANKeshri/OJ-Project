import React, { useState } from 'react';

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

const Compiler = () => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultCode.cpp);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...');
    try {
      const res = await fetch(`${import.meta.env.VITE_COMPILER_URL}run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input })
      });
      const data = await res.json();
      if (data.output) {
        setOutput(data.output);
      } else if (data.error) {
        setOutput(data.error.toString());
      } else {
        setOutput('No output');
      }
    } catch (err) {
      setOutput('Error running code');
    }
    setIsRunning(false);
  };

  const handleAnalyseWithAI = async () => {
    setIsAnalysing(true);
    setAiAnalysis('');
    try {
      const res = await fetch('/api/ai/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || 'No analysis received.');
    } catch (err) {
      setAiAnalysis('Error analysing code.');
    }
    setIsAnalysing(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-navy/80 p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Online Compiler</h2>
      <div className="flex gap-4 items-center mb-4">
        <select
          className="bg-navy-dark text-white px-3 py-2 rounded border border-navy-dark focus:outline-none focus:ring-2 focus:ring-accentblue"
          value={language}
          onChange={e => {
            setLanguage(e.target.value);
            setCode(defaultCode[e.target.value]);
          }}
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>
      <textarea
        className="w-full h-64 bg-navy-dark text-green-200 p-4 rounded font-mono resize-none text-base border border-navy-dark focus:outline-none focus:ring-2 focus:ring-accentblue mb-4"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <textarea
        className="w-full h-20 bg-navy-dark text-white p-2 rounded border border-navy-dark mb-4"
        placeholder="Custom input (optional)"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm text-gray-400">Output</label>
        <textarea
          className="w-full h-32 bg-navy-dark text-white p-2 rounded border border-navy-dark"
          value={output}
          readOnly
        />
      </div>
      <button
        className="bg-accentblue text-white px-6 py-2 rounded font-semibold shadow hover:bg-accentblue/80 transition-colors w-32"
        onClick={handleRun}
        disabled={isRunning}
      >
        {isRunning ? 'Running...' : 'Run'}
      </button>
      <button
        className="bg-purple-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-purple-700 transition-colors w-48 mt-2"
        onClick={handleAnalyseWithAI}
        disabled={isAnalysing}
      >
        {isAnalysing ? 'Analysing...' : 'Analyse with AI'}
      </button>
      {aiAnalysis && (
        <div className="mt-4 p-4 bg-navy-dark text-white rounded border border-purple-600 whitespace-pre-line">
          <strong>AI Analysis:</strong>
          <div>{aiAnalysis}</div>
        </div>
      )}
    </div>
  );
};

export default Compiler; 