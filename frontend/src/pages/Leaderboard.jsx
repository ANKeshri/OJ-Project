import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const medalIcons = [
  <span key="gold" className="text-4xl">🥇</span>,
  <span key="silver" className="text-4xl">🥈</span>,
  <span key="bronze" className="text-4xl">🥉</span>
];

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-white tracking-tight drop-shadow">Leaderboard</h1>
      {/* Top 3 Cards */}
      <div className="w-full flex flex-col md:flex-row justify-center gap-8 mb-10">
        {top3.map((user, idx) => (
          <div key={user.email} className="flex-1 bg-navy-dark rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[250px]">
            <div>{medalIcons[idx]}</div>
            <div className="text-xl font-bold text-white mt-2 mb-1 text-center">{user.name}</div>
            <div className="text-gray-400 text-sm mb-2 text-center">{user.email}</div>
            <div className="text-blue-400 font-bold text-lg mb-1">Rating: {user.rating}</div>
            <div className="text-green-400 font-semibold">Solved: {user.solved}</div>
          </div>
        ))}
      </div>
      {/* Table for the rest */}
      <div className="w-full bg-navy-dark rounded-2xl shadow-lg overflow-x-auto mb-10">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-sm">
              <th className="py-3 px-4">RANK</th>
              <th className="py-3 px-4">NAME</th>
              <th className="py-3 px-4">EMAIL</th>
              <th className="py-3 px-4">SOLVED</th>
              <th className="py-3 px-4">RATING</th>
            </tr>
          </thead>
          <tbody>
            {rest.map(user => (
              <tr key={user.email} className="border-t border-gray-700 hover:bg-gray-800 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-300">#{user.rank}</td>
                <td className="py-3 px-4 text-white">{user.name}</td>
                <td className="py-3 px-4 text-gray-400">{user.email}</td>
                <td className="py-3 px-4 text-green-400 font-bold">{user.solved}</td>
                <td className="py-3 px-4 text-blue-400 font-bold">{user.rating}</td>
              </tr>
            ))}
            {(!loading && rest.length === 0) && (
              <tr><td colSpan={5} className="text-center text-gray-400 py-6">No more users to display.</td></tr>
            )}
          </tbody>
        </table>
        {loading && <div className="text-center text-gray-400 py-6">Loading...</div>}
      </div>
    </div>
  );
};

export default Leaderboard; 