import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/profile');
  };

  return (
    <header className="w-full flex items-center justify-end py-4 bg-darkblue text-white shadow">
      {user ? (
        <button
          className="bg-accentblue hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition shadow-lg mr-12"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <button
          className="bg-accentblue hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition shadow-lg mr-12"
          onClick={() => navigate('/login')}
        >
          Login / Signup
        </button>
      )}
    </header>
  );
};

export default Topbar; 