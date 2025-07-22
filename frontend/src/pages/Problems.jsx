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
  // Filter states
  const [difficulty, setDifficulty] = useState('all');
  const [solved, setSolved] = useState('unsolved');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, []);

  useEffect(() => {
    // Build query params
    let query = [];
    if (difficulty !== 'all') query.push(`difficulty=${difficulty}`);
    if (solved !== 'all') query.push(`solved=${solved === 'solved' ? 'true' : 'false'}`);
    const queryString = query.length ? `?${query.join('&')}` : '';
    fetch(`${API_BASE_URL}/api/problems${queryString}`, {
      headers: solved !== 'all' ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}
    })
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
  }, [user, difficulty, solved]);

  // Filtered problems by search (frontend)
  const filteredProblems = problems.filter(problem => {
    const searchLower = search.toLowerCase();
    const titleMatch = problem.title.toLowerCase().includes(searchLower);
    const tagsMatch = (problem.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
    return titleMatch || tagsMatch;
  });

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background dark:bg-background py-12 px-2">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-white tracking-tight drop-shadow">Practice Questions</h1>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mb-8 gap-4 p-4 bg-navy-dark rounded-2xl shadow-lg">
        {/* Search Bar */}
        <div className="flex-1 w-full md:w-auto flex items-center">
          <span className="mr-2 text-xl">🔍</span>
          <input
            type="text"
            className="w-full md:w-80 bg-gray-800 text-white px-4 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            placeholder="Search problems by name or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Difficulty Dropdown */}
        <select
          className="bg-navy-dark text-white px-4 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {/* Solved Dropdown */}
        <select
          className="bg-navy-dark text-pink-400 px-4 py-2 rounded-lg border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={solved}
          onChange={e => setSolved(e.target.value)}
        >
          <option value="unsolved">Unsolved</option>
          <option value="solved">Solved</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProblems.map(problem => {
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