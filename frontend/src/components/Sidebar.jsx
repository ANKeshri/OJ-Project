import React from 'react';

const Sidebar = () => (
  <aside className="w-64 h-full bg-navy dark:bg-navy-dark text-white flex flex-col py-8 px-4 shadow-lg">
    <div className="text-2xl font-bold mb-10 tracking-wide">CrazyCoder</div>
    <nav className="flex flex-col gap-6">
    <a href="/profile" className="hover:text-accentblue transition">Profile</a>
      <a href="#" className="hover:text-accentblue transition">Contests</a>
      <a href="#" className="hover:text-accentblue transition">Practice</a>
      <a href="#" className="hover:text-accentblue transition">Code Editor</a>
      <a href="#" className="hover:text-accentblue transition">Leaderboard</a>
    </nav>
  </aside>
);

export default Sidebar; 