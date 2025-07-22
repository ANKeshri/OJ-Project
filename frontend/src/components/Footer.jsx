import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import logo from '../assets/crazycoders_logo.png'; // Place your logo in src/assets/

const Footer = () => (
  <footer className="w-full bg-navy-dark text-white py-3 px-6 flex items-center justify-between shadow-inner">
    {/* Left: Logo */}
    <div className="flex items-center">
      <img src={logo} alt="Crazy Coders Logo" className="h-10 w-10 mr-3" />
    </div>
    {/* Center: Copyright */}
    <div className="text-center flex-1 text-sm font-medium">
      @2025 Crazy Coder All rights reserved under Aditya Narayan
    </div>
    {/* Right: Social Icons */}
    <div className="flex items-center gap-4">
      <a href="https://www.instagram.com/ankeshri/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition"><FaInstagram size={22} /></a>
      <a href="https://www.linkedin.com/in/aditya-narayan-ank/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><FaLinkedin size={22} /></a>
      <a href="https://github.com/ANKeshri" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition"><FaGithub size={22} /></a>
    </div>
  </footer>
);

export default Footer; 