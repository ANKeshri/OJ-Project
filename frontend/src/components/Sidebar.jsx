import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaUser, FaTrophy, FaDumbbell, FaEdit, FaMedal } from 'react-icons/fa';
import crazycodersLogo from '../assets/crazycoders_logo.png';

const Sidebar = () => (
  <aside className="w-64 h-full bg-navy dark:bg-navy-dark text-white flex flex-col py-8 px-4 shadow-lg">
    <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-10 tracking-wide hover:text-accentblue transition">
      <img src={crazycodersLogo} alt="CrazyCoder Logo" className="w-8 h-8" />
      CrazyCoder
    </Link>
    <nav className="flex flex-col gap-6">
      <Link to="/profile" className="flex items-center gap-2 bg-blue-700/20 border border-blue-500 rounded-lg px-3 py-2 font-semibold text-blue-300 hover:text-white hover:bg-blue-700/40 transition shadow">
        <FaUser className="text-blue-400" />
        Profile
      </Link>
      <Link to="/problems" className="flex items-center gap-2 bg-blue-700/20 border border-blue-500 rounded-lg px-3 py-2 font-semibold text-blue-300 hover:text-white hover:bg-blue-700/40 transition shadow">
        <FaEdit className="text-blue-400" />
        Practise
      </Link>
      <Link to="/compiler" className="flex items-center gap-2 bg-blue-700/20 border border-blue-500 rounded-lg px-3 py-2 font-semibold text-blue-300 hover:text-white hover:bg-blue-700/40 transition shadow">
        <FaCode className="text-blue-400" />
        Compiler
      </Link>
      <Link to="/leaderboard" className="flex items-center gap-2 bg-blue-700/20 border border-blue-500 rounded-lg px-3 py-2 font-semibold text-blue-300 hover:text-white hover:bg-blue-700/40 transition shadow">
        <FaMedal className="text-blue-400" />
        Leaderboard
      </Link>
    </nav>
  </aside>
);

export default Sidebar; 