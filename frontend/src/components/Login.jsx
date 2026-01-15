import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note the trailing slash '/' and the endpoint name 'token/'
            const response = await api.post('token/', { username, password });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Navigate to home/dashboard
        } catch (err) {
            console.error("Login Error:", err.response?.data);
        }
        };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-slate-800 rounded-2xl border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    required
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;