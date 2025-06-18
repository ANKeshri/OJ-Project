import React, { useEffect, useState } from 'react';

const LeetCodeCard = ({ leetcodeProfile }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!leetcodeProfile) return;
    setLoading(true);
    fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeProfile}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStats(data);
          setError('');
        } else {
          setError('Could not fetch LeetCode stats.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch LeetCode stats.');
        setLoading(false);
      });
  }, [leetcodeProfile]);

  if (loading) return <div className="bg-darkblue rounded-xl shadow-lg p-8 w-96 text-white text-center">Loading...</div>;
  if (error) return <div className="bg-darkblue rounded-xl shadow-lg p-8 w-96 text-red-400 text-center">{error}</div>;

  const percent = stats.totalSolved / stats.totalQuestions * 100;

  return (
    <div className="bg-darkblue rounded-xl shadow-lg p-8 w-96">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <img src="https://leetcode.com/static/images/LeetCode_logo_rvs.png" alt="LeetCode" className="w-6 h-6" />
        Leetcode Profile
      </h2>
      <div className="flex flex-col items-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
          <circle cx="60" cy="60" r="50" stroke="#222" strokeWidth="12" fill="none" />
          <circle
            cx="60" cy="60" r="50"
            stroke="#2563eb"
            strokeWidth="12"
            fill="none"
            strokeDasharray={314}
            strokeDashoffset={314 - (314 * percent) / 100}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s' }}
          />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="1.5em" fill="#fff">
            {stats.totalSolved}/{stats.totalQuestions}
          </text>
        </svg>
        <div className="text-green-400 mb-4 text-lg">Solved</div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between text-green-500"><span>Easy</span><span>{stats.easySolved}/{stats.totalEasy}</span></div>
          <div className="flex justify-between text-yellow-400"><span>Medium</span><span>{stats.mediumSolved}/{stats.totalMedium}</span></div>
          <div className="flex justify-between text-red-500"><span>Hard</span><span>{stats.hardSolved}/{stats.totalHard}</span></div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCard; 