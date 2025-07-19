import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const badgeColors = {
  notAttempted: 'bg-gray-700 text-gray-200',
  submitted: 'bg-green-700 text-green-200',
};
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [statuses, setStatuses] = useState({}); // NEW STATE
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // NEW STATE

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/problems`)
      .then(res => res.json())
      .then(probs => {
        setProblems(probs);
        // Fetch status for each problem if logged in
        if (user) {
          Promise.all(
            probs.map(p =>
              fetch(`${API_BASE_URL}/api/problems/${p._id}/status`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              })
                .then(res => res.json())
                .then(data => [p._id, data.status || 'Not Attempted'])
                .catch(() => [p._id, 'Not Attempted'])
            )
          ).then(results => {
            const statusMap = {};
            results.forEach(([id, status]) => {
              statusMap[id] = status;
            });
            setStatuses(statusMap);
          }).catch(() => {
            toast.error('Failed to fetch problem statuses.');
          });
        }
      })
      .catch(() => {
        toast.error('Failed to fetch problems.');
      });
  }, [user]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background dark:bg-background py-12 px-2">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-white tracking-tight drop-shadow">Practice Questions</h1>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {problems.map(problem => {
          const status = statuses[problem._id] || 'Unsolved';
          const isSubmitted = status === 'Submitted';
          const difficulty = (problem.difficulty || 'Medium').toLowerCase();
          return (
            <div
              key={problem._id}
              className="relative flex flex-col justify-between h-64 bg-navy-dark rounded-2xl shadow-xl p-7 transition-transform hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Title and Difficulty */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-white leading-tight">
                  {problem.title}
                </h2>
                <span className={`text-sm font-bold px-4 py-1 rounded-full capitalize absolute top-6 right-7 ${
                  difficulty === 'easy' ? 'bg-green-500 text-white' :
                  difficulty === 'hard' ? 'bg-red-600 text-white' :
                  'bg-yellow-400 text-black'
                }`}>
                  {problem.difficulty || 'Medium'}
                </span>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(problem.tags || []).map((tag, idx) => (
                  <span key={idx} className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full font-medium">#{tag}</span>
                ))}
              </div>
              {/* Status and Solve link at bottom */}
              <div className="flex items-end justify-between flex-1">
                <div className="flex items-center gap-2">
                  <span className={isSubmitted ? "text-green-400 text-lg" : "text-red-400 text-lg"}>●</span>
                  <span className={isSubmitted ? "text-green-400 font-semibold text-base" : "text-red-400 font-semibold text-base"}>
                    {isSubmitted ? 'Submitted' : 'Unsolved'}
                  </span>
                </div>
                <button
                  className="text-accentblue font-semibold text-base hover:underline focus:outline-none"
                  onClick={() => navigate(`/problems/${problem._id}`)}
                >
                  Solve →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Problems; 