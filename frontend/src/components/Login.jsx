import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } 
    catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img src="/background-coding.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#181824]/90 to-[#23232e]/90 z-10" />
      <div className="bg-[#181824] rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center z-20">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-6">Please sign in to your account</p>
        {error && (
          <div className="mb-4 p-4 bg-red-900/40 border-l-4 border-red-500 text-red-300 w-full">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-[#23232e] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            className="bg-[#23232e] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition mt-4"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 w-full flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
                    { token: credentialResponse.credential }
                  );
                  localStorage.setItem('token', res.data.token);
                  localStorage.setItem('user', JSON.stringify(res.data.user));
                  navigate('/');
                } catch (err) {
                  setError('Google login failed');
                }
              }}
              onError={() => {
                setError('Google login failed');
              }}
              useOneTap
            />
            <span className="text-gray-500 text-sm mt-2">or</span>
          </div>
          <a href="/signup" className="text-purple-400 mt-2 hover:underline">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 