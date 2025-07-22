import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const typingText = 'Welcome to CrazyCoder';

const Home = () => {
  const [typed, setTyped] = useState('');
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user;
  };

  const handleGetStarted = () => {
    if (isLoggedIn()) {
      navigate('/problems');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(typingText.slice(0, i + 1));
      i++;
      if (i === typingText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-white p-8">
      <div className="text-2xl font-mono text-accentblue mb-2 h-8">
        {typed}
        <span className="animate-pulse">|</span>
      </div>
      <h1 className="text-4xl font-bold mb-2 text-white">Your Journey. <span className="text-accentblue">Your Success.</span></h1>
      <p className="mb-8 text-lg text-gray-300 max-w-2xl text-center">
        Level up your coding skills, compete in real-time contests, and connect with a vibrant community of passionate developers.<br/>
        Your journey to coding mastery starts here!
      </p>
      <div className="flex gap-4 mb-12">
        <button className="bg-accentblue hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow" onClick={handleGetStarted}>
          {isLoggedIn() ? 'Practice Problems' : 'Get Started'}
        </button>
        <a href="https://github.com/ANKeshri/OJ-Project" target="_blank" rel="noopener noreferrer" className="border border-accentblue text-accentblue px-6 py-2 rounded font-semibold hover:bg-accentblue hover:text-white transition">View on GitHub</a>
      </div>
      <div className="w-full max-w-3xl bg-navy-dark rounded-lg shadow-lg p-6 mt-4">
        <pre className="text-green-400 text-sm overflow-x-auto">
          {`// Example code snippet\nfunction trackProgress(user) {\n  const contests = user.contests;\n  const rating = calculateRating(contests.results);\n  return { rating, progress };\n}`}
        </pre>
      </div>
      {/* Feature Cards Section */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1: Multi-language Code Compilation */}
        <div className="bg-gradient-to-br from-[#232b4e] to-[#1a1f2b] rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-accentblue/40 hover:bg-[#232b4e]/80 group cursor-pointer">
          <svg className="w-10 h-10 mb-3 text-accentblue group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10l4 4 4-4"/></svg>
          <h2 className="text-xl font-semibold text-accentblue mb-1">Multi-language Code Compilation</h2>
          <p className="text-gray-300 text-center">Compile and run code in C++, Java, and Python securely in real-time.</p>
        </div>
        {/* Card 2: AI-Powered Code Analysis */}
        <div className="bg-gradient-to-br from-[#2b234e] to-[#1a1f2b] rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-purple-400/40 hover:bg-[#2b234e]/80 group cursor-pointer">
          <svg className="w-10 h-10 mb-3 text-purple-400 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          <h2 className="text-xl font-semibold text-purple-400 mb-1">AI-Powered Code Analysis</h2>
          <p className="text-gray-300 text-center">Get instant feedback on your code’s time and space complexity using AI.</p>
        </div>
        {/* Card 3: Problem Management System */}
        <div className="bg-gradient-to-br from-[#3a3a1a] to-[#1a1f2b] rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-yellow-300/40 hover:bg-[#3a3a1a]/80 group cursor-pointer">
          <svg className="w-10 h-10 mb-3 text-yellow-300 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <h2 className="text-xl font-semibold text-yellow-300 mb-1">Problem Management System</h2>
          <p className="text-gray-300 text-center">Create, edit, and manage coding problems with test cases and constraints.</p>
        </div>
        {/* Card 4: User Authentication & Profiles */}
        <div className="bg-gradient-to-br from-[#1a3a3a] to-[#1a1f2b] rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-cyan-400/40 hover:bg-[#1a3a3a]/80 group cursor-pointer">
          <svg className="w-10 h-10 mb-3 text-cyan-400 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>
          <h2 className="text-xl font-semibold text-cyan-400 mb-1">User Authentication & Profiles</h2>
          <p className="text-gray-300 text-center">Secure login, Google OAuth, and personalized user profiles with progress tracking.</p>
        </div>
        {/* Card 5: Submission Tracking & Feedback */}
        <div className="bg-gradient-to-br from-[#3a2323] to-[#1a1f2b] rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-orange-400/40 hover:bg-[#3a2323]/80 group cursor-pointer">
          <svg className="w-10 h-10 mb-3 text-orange-400 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
          <h2 className="text-xl font-semibold text-orange-400 mb-1">Submission Tracking & Feedback</h2>
          <p className="text-gray-300 text-center">Track your submissions and get detailed feedback on every attempt.</p>
        </div>
        {/* Card 6: Interactive Code Editor & UI */}
        <div className="bg-gradient-to-br from-[#233a23] to-[#1a1f2b] rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-green-400/40 hover:bg-[#233a23]/80 group cursor-pointer">
          <svg className="w-10 h-10 mb-3 text-green-400 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M4 8h16M8 12h8M10 16h4"/></svg>
          <h2 className="text-xl font-semibold text-green-400 mb-1">Interactive Code Editor & UI</h2>
          <p className="text-gray-300 text-center">Modern, responsive UI with syntax highlighting and language templates.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 