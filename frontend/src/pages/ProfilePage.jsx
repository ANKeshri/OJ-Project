import React, { useEffect, useState } from 'react';
import LeetCodeCard from '../components/LeetCodeCard';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', leetcodeProfile: '', dob: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setEditForm({
        fullName: u.fullName || '',
        leetcodeProfile: u.leetcodeProfile || '',
        dob: u.dob ? u.dob.slice(0, 10) : ''
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    setStatsLoading(true);
    fetch(`${API_BASE_URL}/api/problems/user/statistics`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setStatsLoading(false);
      })
      .catch(() => setStatsLoading(false));
  }, [user]);

  const handleEdit = () => setShowEdit(true);
  const handleEditChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleEditSave = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setShowEdit(false);
    } catch (err) {
      setEditError('Could not update profile.');
    }
    setEditLoading(false);
  };

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

  // Format date of birth and account creation
  const dob = user.dob ? new Date(user.dob).toLocaleDateString() : '-';
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-';

  // Calculate OJ progress percent
  const solved = stats?.solved || 0;
  const total = stats?.total || 1;
  const percent = Math.round((solved / total) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form className="bg-navy-dark rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 relative" onSubmit={handleEditSave}>
            <button type="button" className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl" onClick={()=>setShowEdit(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-2">Edit Profile</h2>
            <label className="text-gray-300 font-semibold">Full Name
              <input name="fullName" type="text" className="w-full mt-1 p-2 rounded bg-navy text-white border border-navy-dark focus:outline-none" value={editForm.fullName} onChange={handleEditChange} required />
            </label>
            <label className="text-gray-300 font-semibold">LeetCode Username
              <input name="leetcodeProfile" type="text" className="w-full mt-1 p-2 rounded bg-navy text-white border border-navy-dark focus:outline-none" value={editForm.leetcodeProfile} onChange={handleEditChange} required />
            </label>
            <label className="text-gray-300 font-semibold">Date of Birth
              <input name="dob" type="date" className="w-full mt-1 p-2 rounded bg-navy text-white border border-navy-dark focus:outline-none" value={editForm.dob} onChange={handleEditChange} required />
            </label>
            {editError && <div className="text-red-400 text-sm">{editError}</div>}
            <button type="submit" className="bg-accentblue text-white px-6 py-2 rounded font-semibold mt-2 hover:bg-accentblue/90 transition" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      )}

      {/* User Info & OJ Stats Card */}
      <div className="w-full max-w-3xl bg-navy-dark/80 rounded-2xl shadow-2xl p-8 mb-8 glassy-card">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar & Info */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accentblue to-purple-600 flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-lg border-4 border-background">
              {getInitials(user.fullName)}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-2xl font-bold text-white">{user.fullName}</div>
              <button className="ml-2 px-3 py-1 bg-accentblue text-white rounded hover:bg-accentblue/90 text-sm font-semibold" onClick={handleEdit}>Edit</button>
            </div>
            <div className="text-accentblue text-base font-semibold mb-1">{user.email}</div>
            <div className="flex flex-col gap-1 text-gray-300 text-sm mb-2">
              <span>Date of Birth: <span className="text-white font-medium">{dob}</span></span>
              <span>Account Created: <span className="text-white font-medium">{createdAt}</span></span>
            </div>
            <div className="text-gray-400 text-xs mb-1">LeetCode Username: <span className="text-accentblue">{user.leetcodeProfile || <span className='text-red-400'>Not set</span>}</span></div>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold mt-3 hover:bg-red-700 transition"
              onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
          {/* OJ Stats */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">Your OJ Progress</h3>
            {statsLoading ? (
              <div className="text-gray-200">Loading stats...</div>
            ) : stats ? (
              <>
                <div className="flex gap-6 mb-4 w-full justify-center">
                  <div className="flex flex-col items-center bg-gradient-to-br from-green-700/80 to-green-400/60 rounded-xl px-6 py-4 shadow">
                    <span className="text-3xl font-bold text-green-200 flex items-center gap-2">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      {stats.solved}
                    </span>
                    <span className="text-gray-100 text-base font-semibold mt-1">Solved</span>
                  </div>
                  <div className="flex flex-col items-center bg-gradient-to-br from-yellow-700/80 to-yellow-400/60 rounded-xl px-6 py-4 shadow">
                    <span className="text-3xl font-bold text-yellow-200 flex items-center gap-2">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fde047" strokeWidth="2.5"/></svg>
                      {stats.total}
                    </span>
                    <span className="text-gray-100 text-base font-semibold mt-1">Total</span>
                  </div>
                  <div className="flex flex-col items-center bg-gradient-to-br from-red-700/80 to-red-400/60 rounded-xl px-6 py-4 shadow">
                    <span className="text-3xl font-bold text-red-200 flex items-center gap-2">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      {stats.remaining}
                    </span>
                    <span className="text-gray-100 text-base font-semibold mt-1">Remaining</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full max-w-xs mt-2">
                  <div className="h-3 bg-navy rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-accentblue rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{solved} solved</span>
                    <span>{percent}%</span>
                    <span>{total} total</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-red-400">Could not load stats.</div>
            )}
          </div>
        </div>
      </div>
      {/* LeetCode Stats Card */}
      <div className="w-full max-w-3xl bg-navy-dark/80 rounded-2xl shadow-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">LeetCode Statistics</h3>
        {user.leetcodeProfile ? (
          <LeetCodeCard leetcodeProfile={user.leetcodeProfile} />
        ) : (
          <div className="bg-navy rounded-xl p-8 text-center text-red-400 text-lg font-semibold shadow">LeetCode username not set. Please add your LeetCode username to view your LeetCode stats.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 