import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';

function App() {
  // 1. Set up a state to track if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage whenever the app loads
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Navigation Bar */}
        <nav className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-50">
          <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400">
            Blog
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white">Home</Link>
            
            {/* 2. Show 'New Post' ONLY if authenticated */}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/create" 
                  className="text-green-400 hover:text-green-300 font-medium border border-green-900/50 px-3 py-1 rounded-lg bg-green-900/10"
                >
                  + New Post
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
        
        {/* Main Page Layout */}
        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;