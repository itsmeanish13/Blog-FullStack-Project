import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, User } from 'lucide-react';
import Comments from './Comments';

const PostDetail = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`posts/${id}/`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-white text-xl">Loading story...</div>;
    if (!post) return <div className="text-center mt-20 text-white text-xl">Story not found.</div>;
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await api.delete(`posts/${id}/`);
                alert("Post deleted successfully");
                navigate('/'); // Send user back to home page
            } catch (error) {
                alert("You are not authorized to delete this post.");
            }
        }
    };

    // Inside your return, near the Title or Author name:
    {post.is_author && (
        <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-500/30 px-3 py-1 rounded-lg transition-all"
        >
            Delete Post
        </button>
    )}

    return (
        <div className="max-w-4xl mx-auto p-6">
            {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-96 object-cover rounded-3xl mb-8 shadow-2xl" />
            )}
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-slate-400 mb-10 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <User size={20} className="text-blue-500" />
                    <span className="font-medium text-slate-200">{post.author.username}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
            </div>

            {/* Comment Section Placeholder */}
            {/* <section className="mt-16 pt-10 border-t border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-8">Comments ({post.comments_count})</h3>
                <p className="text-slate-500 italic text-center p-10 bg-slate-800/50 rounded-xl">
                    Comment section coming in the next step!
                </p>
            </section> */}
            <Comments postId={id} />
        </div>
    );
};

export default PostDetail;