import React, { useState, useEffect} from 'react'
import api from '../api/axios'
import { MessageCircle, Send } from 'lucide-react'

const Comments = ({postId}) => {
    const[comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading,setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    //Fetch Comments for this specific post
    const fetchComments = async () =>{
        try{
            const response = await api.get(`posts/${postId}/comments/`)
            setComments(response.data)
        }catch(error){
            console.error('Error Fetching comments:',error)
        }finally{
            setLoading(false)
        }
    };

    useEffect(()=> {
        fetchComments()
    },[postId])

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
        // Axios automatically sets Content-Type to application/json 
        // when you pass a standard object {}
        await api.post(`posts/${postId}/comments/`, { 
            content: newComment 
        });
        setNewComment('');
        fetchComments();
    } catch (error) {
        console.error("Comment post error:", error.response?.data);
    }
};
    const deleteComment = async (commentId) => {
    try {
        await api.delete(`comments/${commentId}/`);
        setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
        alert("Could not delete comment.");
    }
};
    return(
        <div className='mt-12 space-y-8'>
            <h3 className='text-2xl font-bold text-white flex items-center gap-2'>
                <MessageCircle className='text-blue-500'/>
                Comments({comments.length})
            </h3>
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className='flex gap-4'>
                    <input type='text' placeholder='Write a comment...'
                        className='flex-1 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500'
                        value={newComment}
                        onChange={(e)=> setNewComment(e.target.value)}
                    />
                    <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        <Send size={20} />
                    </button>
                </form>
                
            ):(
                <p className="text-slate-400 italic bg-slate-800/50 p-4 rounded-lg border border-dashed border-slate-700">
                    Please login to join the conversation.
                </p>
            )}
      

        {/* //Comment Lists */}
        
            <div className="space-y-4">
               {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 group">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-blue-400">{comment.author?.username}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                            
                            {/* Delete icon/button (only visible to author) */}
                            <button 
                                onClick={() => deleteComment(comment.id)}
                                className="text-white hover:text-red-500 opacity-100 group-hover:opacity-100 transition-opacity"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-300">{comment.content}</p>
                </div>
            ))}
                {!loading && comments.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No comments yet. Be the first to speak!</p>
                )}
            </div>
        </div>
    );

};
export default Comments;

