import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
          });
        }
      });
  }, [user]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background dark:bg-background py-12 px-2">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-white tracking-tight drop-shadow">Practice Questions</h1>
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {problems.slice(0, 5).map(problem => {
          const status = statuses[problem._id] || 'Not Attempted';
          return (
            <div
              key={problem._id}
              className="relative group bg-gradient-to-br from-navy via-navy-dark to-navy rounded-2xl shadow-xl border-l-8 border-accentblue p-8 cursor-pointer transition-transform hover:scale-[1.025] hover:shadow-2xl"
              onClick={() => navigate(`/problems/${problem._id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white group-hover:text-accentblue transition-colors">
                  {problem.title}
                </h2>
                <span className={`ml-4 px-4 py-1 rounded-full text-xs font-semibold ${status === 'Submitted' ? badgeColors.submitted : badgeColors.notAttempted} shadow-sm border border-gray-600`}>
                  {status}
                </span>
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
          );
        })}
      </div>
    </div>
  );
};

export default Problems; 