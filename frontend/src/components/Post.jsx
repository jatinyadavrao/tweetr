
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaTrash } from 'react-icons/fa';
import { backendUrl } from '../variable';
import {UserContext} from './UserContext'
const Post = ({ post }) => {
    const [likes, setLikes] = useState(post.likes.length);
   
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
   const {user} = useContext(UserContext)
   const [isLiked, setIsLiked] = useState(post.likes.indexOf(user._id)!==-1);
    const fetchComments = async()=>{
        try {
            const response = await axios.get(`${backendUrl}/api/v1/comments/${post._id}`,{withCredentials:true});
            setComments(response.data.data);
            console.log(response.data)
        } catch (error) {
           console.log(error)
        }
      }
   useEffect(()=>{
       fetchComments()
   },[])
    const handleLike = async () => {
        try {
            if (isLiked) {
                await axios.get(`${backendUrl}/api/v1/like/${post._id}`,{withCredentials:true});
                setLikes(likes - 1);
            } else {
                await axios.get(`${backendUrl}/api/v1/like/${post._id}`,{withCredentials:true});
                setLikes(likes + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error liking/unliking post', error);
        }
    };

    const handleAddComment = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/v1/comment/${post._id}`, { comment: newComment },{withCredentials:true});
            setComments([...comments, response.data.data]);
            fetchComments()
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.get(`${backendUrl}/api/v1/deletecomment/${commentId}`,{withCredentials:true});
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">{post.content}</h3>
            <div className="flex items-center mb-4">
                <button onClick={handleLike} className="flex items-center text-blue-500 mr-4">
                    {isLiked ? <FaThumbsDown /> : <FaThumbsUp />} <span className="ml-2">{likes}</span>
                </button>
            </div>
            <div className="comments">
                <h4 className="text-lg font-semibold mb-2">Comments</h4>
                {comments.map((comment,index) => (
                    <div key={index} className="flex justify-between items-center border-b py-2">
                        <p>{comment.comment}</p>
                        { user._id ===comment.user.toString() ? <div>
                        <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500">
                            <FaTrash />
                        </button>
                        </div>:<div>{console.log(user._id,"",comment.user)}</div>}
                       
                    </div>
                ))}
                <div className="mt-4">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                        className="border rounded-lg p-2 mr-2 w-full md:w-3/4"
                    />
                    <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;
