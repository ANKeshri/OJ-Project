import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Problems from './pages/Problems';
import ProblemEditor from './pages/ProblemEditor';
import Compiler from './pages/Compiler';
import './App.css'

function App() {
  return (
    <div className="fixed inset-0 min-h-screen min-w-screen bg-gradient-to-br from-[#181824] to-[#23232e]">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <div className="flex h-screen w-screen bg-background dark:bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                  <Home />
                </main>
              </div>
            </div>
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/problems" element={
            <div className="flex h-screen w-screen bg-background dark:bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                  <Problems />
                </main>
              </div>
            </div>
          } />
          <Route path="/problems/:id" element={
            <div className="flex h-screen w-screen bg-background dark:bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                  <ProblemEditor />
                </main>
              </div>
            </div>
          } />
          <Route path="/compiler" element={
            <div className="flex h-screen w-screen bg-background dark:bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                  <Compiler />
                </main>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
