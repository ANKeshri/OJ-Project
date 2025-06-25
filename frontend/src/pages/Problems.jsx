import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const badgeColors = {
  notAttempted: 'bg-gray-700 text-gray-200',
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(setProblems);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background dark:bg-background py-12 px-2">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-white tracking-tight drop-shadow">Practice Questions</h1>
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {problems.slice(0, 5).map(problem => (
          <div
            key={problem._id}
            className="relative group bg-gradient-to-br from-navy via-navy-dark to-navy rounded-2xl shadow-xl border-l-8 border-accentblue p-8 cursor-pointer transition-transform hover:scale-[1.025] hover:shadow-2xl"
            onClick={() => navigate(`/problems/${problem._id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white group-hover:text-accentblue transition-colors">
                {problem.title}
              </h2>
              <span className={`ml-4 px-4 py-1 rounded-full text-xs font-semibold ${badgeColors.notAttempted} shadow-sm border border-gray-600`}>Not Attempted</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {problem.constraints && (
                <span className="bg-accentblue/20 text-accentblue px-3 py-1 rounded-full text-xs font-medium">
                  {problem.constraints}
                </span>
              )}
            </div>
            <p className="text-gray-300 text-base line-clamp-2">
              {problem.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems; 