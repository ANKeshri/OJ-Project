import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LeetCodeCard from '../components/LeetCodeCard';

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

  useEffect(() => {
    console.log('ProfilePage: user from localStorage:', user);
    if (user) {
      console.log('ProfilePage: leetcodeProfile:', user.leetcodeProfile);
    }
  }, [user]);

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

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center">
        <LeetCodeCard leetcodeProfile={user.leetcodeProfile} />
        <button
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
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
};

export default ProfilePage; 