import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('content', content);
    formData.append('published', 'true');
    
    // Crucial: Only append if 'image' is an actual File object
    if (image) {
        formData.append('image', image);
    }

    try {
    // Just send the formData. Axios does the heavy lifting.
    await api.post('posts/', formData); 
    navigate('/');
} catch (error) {
    console.error("Upload error details:", error.response?.data);
    alert("Error: " + error.response?.data?.detail || "Upload failed");
}};

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-slate-800 rounded-2xl border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6">Create New Story</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-400 mb-2">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2">Content</label>
                    <textarea
                        required
                        rows="6"
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 outline-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2">Cover Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*" // Restricts browser to image files only
                        className="text-slate-400"
                        onChange={(e) => {
                            // e.target.files is an array. We want the first file [0].
                            if (e.target.files.length > 0) {
                                setImage(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all">
                    Publish Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;