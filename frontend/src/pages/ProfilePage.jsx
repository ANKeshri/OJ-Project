import React, { useEffect, useState } from 'react';
import LeetCodeCard from '../components/LeetCodeCard';

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-navy-dark rounded-xl shadow-lg p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-6">Please log in to continue</h1>
          <a href="/login" className="bg-accentblue text-white px-8 py-4 rounded-lg text-lg font-semibold mb-2">Go to Login Page →</a>
          <p className="text-gray-300">Don't have an account? <a href="/signup" className="text-accentblue underline">Sign up now</a></p>
        </div>
      </div>
    );
  }

  if (user && !user.leetcodeProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-navy-dark rounded-xl shadow-lg p-10 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white mb-6">LeetCode username not set</h1>
          <p className="text-gray-300 mb-4">Please add your LeetCode username to your profile to view your stats.</p>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={() => {
              localStorage.removeItem('user');
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Format date of birth and account creation
  const dob = user.dob ? new Date(user.dob).toLocaleDateString() : '-';
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-';

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="flex flex-col md:flex-row gap-12 bg-navy-dark rounded-2xl shadow-2xl p-10 w-full max-w-4xl">
        {/* User Info Card */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-accentblue flex items-center justify-center text-4xl font-bold text-white mb-6">
            {getInitials(user.fullName)}
          </div>
          <div className="text-2xl font-bold text-white mb-2">{user.fullName}</div>
          <div className="text-gray-300 text-base mb-1">{user.email}</div>
          <div className="text-gray-400 text-sm mb-1">Date of Birth: <span className="text-white">{dob}</span></div>
          <div className="text-gray-400 text-sm mb-1">LeetCode Username: <span className="text-accentblue">{user.leetcodeProfile}</span></div>
          <div className="text-gray-400 text-sm mb-6">Account Created: <span className="text-white">{createdAt}</span></div>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold mt-4"
            onClick={() => {
              localStorage.removeItem('user');
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
        {/* LeetCode Stats Card */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <LeetCodeCard leetcodeProfile={user.leetcodeProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 