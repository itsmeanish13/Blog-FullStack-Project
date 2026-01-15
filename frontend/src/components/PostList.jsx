import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {Calendar, User, MessageCircle} from 'lucide-react';
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //This function runs as soon as the component appears on screen
        const fetchPosts = async () => {
            try {
                const response = await api.get('posts/'); // Adjust the endpoint as needed
                setPosts(response.data);

            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);
    if (loading) {
        return <div className='text-center mt-10 text-white'>Loading...</div>
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
            {posts.map((post) => (
                <article key={post.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all group">
                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.title}
                            className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                    )}
                    <div className='p-4'>
                        <Link to={`/post/${post.id}`}>
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">
                                {post.title}
                            </h2>
                        </Link>
                        <p className='text-slate-300 mb-4'>{post.content}</p>
                        <div className='flex items-center justify-between text-sm text-slate-500 border-t border-slate-700 pt-4'>
                            <div className='flex items-center gap-1'>
                                <User size={14} />
                                <span>{post.author.username}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <MessageCircle size={14} />
                                <span>{post.comments_count}</span>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};
export default PostList;

