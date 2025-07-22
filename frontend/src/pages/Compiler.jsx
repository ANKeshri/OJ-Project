
import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { toast } from 'react-toastify';

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
      const res = await fetch(`${import.meta.env.VITE_COMPILER_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input })
      });
      const data = await res.json();
      if (data.output) {
        setOutput(data.output);
        toast.success('Code ran successfully!');
      } else if (data.error) {
        setOutput(data.error.toString());
        toast.error('Error running code');
      } else {
        setOutput('No output');
        toast.info('No output');
      }
    } catch (err) {
      setOutput('Error running code');
      toast.error('Error running code');
    }
    setIsRunning(false);
  };

  const handleAnalyseWithAI = async () => {
    setIsAnalysing(true);
    setAiAnalysis('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || 'No analysis received.');
      toast.success('AI analysis complete!');
    } catch (err) {
      setAiAnalysis('Error analysing code.');
      toast.error('Error analysing code.');
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
      <div className="flex flex-1 min-h-[500px] h-[70vh] gap-6">
        {/* Left: Code Editor */}
        <div className="w-1/2 h-full bg-navy-dark rounded-2xl shadow-lg p-2 flex flex-col">
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
            }}
          />
        </div>
        {/* Right: Input/Output Split */}
        <div className="w-1/2 h-full flex flex-col gap-4">
          {/* Top: Custom Input and Buttons */}
          <div className="flex-1 bg-navy-dark rounded-2xl shadow-lg p-4 flex flex-col mb-2">
            <label className="text-white font-semibold mb-2">Custom Input (optional)</label>
            <textarea
              className="w-full h-24 bg-gray-800 text-white p-2 rounded border border-navy-dark mb-4 resize-none"
              placeholder="Enter custom input..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className="flex gap-4 mt-auto">
              <button
                className="bg-accentblue text-white px-6 py-2 rounded font-semibold shadow hover:bg-accentblue/80 transition-colors w-32"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-purple-700 transition-colors w-48"
                onClick={handleAnalyseWithAI}
                disabled={isAnalysing}
              >
                {isAnalysing ? 'Analysing...' : 'Analyse with AI'}
              </button>
            </div>
          </div>
          {/* Bottom: Output and AI Analysis */}
          <div className="flex-1 bg-navy-dark rounded-2xl shadow-lg p-4 flex flex-col">
            <label className="text-white font-semibold mb-2">Output</label>
            <textarea
              className="w-full h-24 bg-gray-800 text-white p-2 rounded border border-navy-dark mb-2 resize-none"
              value={output}
              readOnly
            />
            {aiAnalysis && (
              <div className="mt-2 p-3 bg-gray-900 text-white rounded border border-purple-600 whitespace-pre-line">
                <strong>AI Analysis:</strong>
                <div>{aiAnalysis}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler; 
