import React, { useEffect, useState } from 'react';

const typingText = 'Welcome to CrazyCoder';

const Home = () => {
  const [typed, setTyped] = useState('');

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
    <div className="flex flex-col items-center justify-center h-full bg-background text-white p-8">
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
        <button className="bg-accentblue hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow">Get Started</button>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="border border-accentblue text-accentblue px-6 py-2 rounded font-semibold hover:bg-accentblue hover:text-white transition">View on GitHub</a>
      </div>
      <div className="w-full max-w-3xl bg-navy-dark rounded-lg shadow-lg p-6 mt-4">
        <pre className="text-green-400 text-sm overflow-x-auto">
          {`// Example code snippet\nfunction trackProgress(user) {\n  const contests = user.contests;\n  const rating = calculateRating(contests.results);\n  return { rating, progress };\n}`}
        </pre>
      </div>
    </div>
  );
};

export default Home; 