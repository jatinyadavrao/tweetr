// src/components/PostList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import { backendUrl } from '../variable';

const Center = () => {
    const [posts, setPosts] = useState([]);
   
    useEffect(() => {
        fetchPosts();
    }, []);
  
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/posts`,{withCredentials:true});
            console.log(response.data.data)
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            {posts?<div> {posts.map((post,index) => (
                <Post key={index} post={post} />
            ))}</div>: "No Post Found"}
           
        </div>
    );
};

export default Center;

