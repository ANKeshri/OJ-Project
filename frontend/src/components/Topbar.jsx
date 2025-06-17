import React from 'react';

const Topbar = () => (
  <header className="w-full flex items-center justify-end py-4 bg-darkblue text-white shadow">
    <button
      className="bg-accentblue hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition shadow-lg mr-12"
      onClick={() => window.location.href = '/login'}
    >
      Login / Signup
    </button>
  </header>
);

export default Topbar; 