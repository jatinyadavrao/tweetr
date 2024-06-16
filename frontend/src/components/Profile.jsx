import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { backendUrl } from '../variable';
import { useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const { profileUserId } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
        fetchPosts();
    }, [profileUserId]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/profile/${profileUserId}`, { withCredentials: true });
            const profileData = response.data.data;
            setProfileUser(profileData);
            setIsFollowing(user.following.includes(profileUserId));
        } catch (error) {
            console.error("There was an error fetching the profile data!", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/otheruserposts/${profileUserId}`, { withCredentials: true });
            console.log(response.data);
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const toggleFollow = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/follow/${profileUserId}`, { withCredentials: true });
            setIsFollowing(!isFollowing);
            setUser(response.data.user);
            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        } catch (error) {
            toast.error('There was an error toggling the follow status!');
            console.error("There was an error toggling the follow status!", error);
        }
    };

    const sendFriendRequest = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/notification/send/${profileUserId}`, { withCredentials: true });
            toast.success(response.data.message);
        } catch (error) {
            toast.error("There was an error sending the friend request!");
            console.error("There was an error sending the friend request!", error);
        }
    };

    if (!profileUser) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
            <Toaster />
            <div className="p-6 bg-blue-500 text-white text-center">
                <h2 className="text-3xl font-bold">{profileUser.name}</h2>
                <p className="text-lg">@{profileUser.username}</p>
                <p className="mt-2">{profileUser.email}</p>
                {user._id !== profileUser._id && (
                    <div className="mt-4">
                        <button
                            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                            onClick={toggleFollow}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                        {user.friends.includes(profileUser._id) ? (
                            <button
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300"
                                onClick={() => navigate('/messages')}
                            >
                                Message
                            </button>
                        ) : (
                            <button
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300"
                                onClick={sendFriendRequest}
                            >
                                Send Friend Request
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="p-6 border-t border-gray-200">
                <div className="flex justify-around text-center text-gray-700">
                    <div>
                        <span className="font-bold text-xl">{profileUser.followers.length}</span>
                        <p>Followers</p>
                    </div>
                    <div>
                        <span className="font-bold text-xl">{profileUser.following.length}</span>
                        <p>Following</p>
                    </div>
                </div>
            </div>
            <div className="px-6 pb-6">
                <h3 className="text-xl font-semibold mt-4 mb-2">Tweets</h3>
                {posts.length > 0 ? (
                    <div>
                        {posts.map((post, index) => (
                            <Post key={index} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">This user hasn't tweeted yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
