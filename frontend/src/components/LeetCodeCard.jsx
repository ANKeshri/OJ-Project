import React, { useEffect, useState } from 'react';

const COLORS = {
  easy: '#00b8a3', // cyan
  medium: '#ffb800', // yellow
  hard: '#ff3c3c', // red
  track: '#444',
  bg: '#232323',
};

// Helper to get arc path for a segment with a gap
function getArc(startAngle, endAngle, radius) {
  const cx = 60, cy = 60;
  const r = radius;
  const start = {
    x: cx + r * Math.cos((Math.PI * (startAngle - 90)) / 180),
    y: cy + r * Math.sin((Math.PI * (startAngle - 90)) / 180),
  };
  const end = {
    x: cx + r * Math.cos((Math.PI * (endAngle - 90)) / 180),
    y: cy + r * Math.sin((Math.PI * (endAngle - 90)) / 180),
  };
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

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

  // Calculate arc angles and gaps
  const total = stats.totalQuestions || 1;
  const easyAngle = (stats.totalEasy / total) * 360;
  const mediumAngle = (stats.totalMedium / total) * 360;
  const hardAngle = (stats.totalHard / total) * 360;
  const gap = 6; // degrees between arcs

  // Start and end angles for each arc
  const easyStart = 0;
  const easyEnd = easyAngle - gap / 2;
  const mediumStart = easyEnd + gap;
  const mediumEnd = mediumStart + mediumAngle - gap;
  const hardStart = mediumEnd + gap;
  const hardEnd = hardStart + hardAngle - gap / 2;

  // Attempting count
  const attempting = stats.totalQuestions - stats.totalSolved;

  return (
    <div className="bg-[#232323] rounded-2xl p-4 md:p-6 w-full max-w-lg flex flex-col md:flex-row items-center gap-6 shadow-lg" style={{background:'#232323'}}>
      {/* Chart */}
      <div className="relative flex flex-col items-center justify-center" style={{ minWidth: 220, minHeight: 180 }}>
        <svg width="180" height="180" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r="50" stroke={COLORS.track} strokeWidth="8" fill="none" />
          {/* Easy Arc */}
          <path d={getArc(easyStart, easyEnd, 50)} stroke={COLORS.easy} strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Medium Arc */}
          <path d={getArc(mediumStart, mediumEnd, 50)} stroke={COLORS.medium} strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Hard Arc */}
          <path d={getArc(hardStart, hardEnd, 50)} stroke={COLORS.hard} strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center select-none pointer-events-none">
          <span className="text-4xl font-bold text-white leading-none">{stats.totalSolved}</span>
          <span className="text-gray-400 text-xl font-semibold -mt-1">/<span className="text-white">{stats.totalQuestions}</span></span>
          <span className="text-green-400 text-base mt-1 flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Solved</span>
          {attempting > 0 && <span className="text-gray-400 text-base mt-1">{attempting} Attempting</span>}
        </div>
      </div>
      {/* Stat Boxes */}
      <div className="flex flex-col gap-4 ml-0 md:ml-8 w-full max-w-[140px]">
        <div className="rounded-lg bg-[#232323] px-6 py-2 flex flex-col items-center shadow" style={{background:'#232323'}}>
          <span className="text-cyan-400 font-semibold text-lg">Easy</span>
          <span className="text-white text-xl font-bold">{stats.easySolved}<span className="text-gray-400 text-base">/{stats.totalEasy}</span></span>
        </div>
        <div className="rounded-lg bg-[#232323] px-6 py-2 flex flex-col items-center shadow" style={{background:'#232323'}}>
          <span className="text-yellow-400 font-semibold text-lg">Med.</span>
          <span className="text-white text-xl font-bold">{stats.mediumSolved}<span className="text-gray-400 text-base">/{stats.totalMedium}</span></span>
        </div>
        <div className="rounded-lg bg-[#232323] px-6 py-2 flex flex-col items-center shadow" style={{background:'#232323'}}>
          <span className="text-red-400 font-semibold text-lg">Hard</span>
          <span className="text-white text-xl font-bold">{stats.hardSolved}<span className="text-gray-400 text-base">/{stats.totalHard}</span></span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCard; 