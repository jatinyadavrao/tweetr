import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { backendUrl } from '../variable';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import ChatScreen from './ChatScreen';
import GroupChatScreen from './GroupChatScreen';

const Messages = () => {
    const { user, setUser } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFriends();
        fetchGroups();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/chat/friends`, { withCredentials: true });
            setFriends(response.data.data);
        } catch (error) {
            console.error("Error fetching friends", error);
            toast.error("Failed to fetch friends");
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/chat/groups`, { withCredentials: true });
           console.log(response.data)
            setGroups(response.data.data);
        } catch (error) {
            console.error("Error fetching groups", error);
            toast.error("Failed to fetch groups");
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await axios.delete(`${backendUrl}/api/v1/chat/friends/${friendId}`, { withCredentials: true });
            setFriends(friends.filter(friend => friend._id !== friendId));
            toast.success("Friend removed successfully");
        } catch (error) {
            console.error("Error removing friend", error);
            toast.error("Failed to remove friend");
        }
    };

    const initiateChat = async (id, isGroup = false) => {
        if (isGroup) {
            navigate(`/messages/group-chat/${id}`);
        } else {
            navigate(`/messages/chat/${id}`);
        }
    };

    const openGroupModal = () => {
        setIsGroupModalOpen(true);
    };

    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        setSelectedFriends([]);
        setGroupName('');
    };

    const handleFriendSelect = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const createGroupChat = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/v1/chat/group`, {
                name: groupName,
                members: selectedFriends
            }, { withCredentials: true });
            console.log(selectedFriends)

            console.log(response.data)
            
            
            toast.success("Group chat created successfully");
            setSelectedFriends([])
            closeGroupModal();
            fetchGroups(); // Fetch groups again to update the list
        } catch (error) {
            console.error("Error creating group chat", error);
            toast.error("Failed to create group chat");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
            <Toaster />
            <div className="p-6 bg-blue-500 text-white text-center">
                <h2 className="text-3xl font-bold">Messages</h2>
                <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
                    onClick={openGroupModal}
                >
                    Create Group Chat
                </button>
            </div>
            <div className="p-6">
                {friends.length > 0 ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Friends</h3>
                        {friends.map(friend => (
                            <div key={friend._id} className="flex justify-between items-center p-4 border-b border-gray-200">
                                <div onClick={() => initiateChat(friend._id)} className="cursor-pointer">
                                    <p className="text-lg font-semibold">{friend.username}</p>
                                </div>
                                <div>
                                    <button
                                        className="ml-4 text-red-500 hover:text-red-600 transition-colors duration-300"
                                        onClick={() => handleRemoveFriend(friend._id)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No friends found</p>
                )}

                {groups.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 mt-4">Groups</h3>
                        {groups.map(group => (
                            <div key={group._id} className="flex justify-between items-center p-4 border-b border-gray-200">
                                <div onClick={() => initiateChat(group._id, true)} className="cursor-pointer">
                                    <p className="text-lg font-semibold">{group.chatName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isGroupModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Create Group Chat</h3>
                        <input
                            type="text"
                            placeholder="Group Chat Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {friends.map((friend) => (
                                <button
                                    key={friend._id}
                                    onClick={() => handleFriendSelect(friend._id)}
                                    className={`p-2 text-center border border-gray-300 rounded-lg transition-colors duration-300 ${
                                        selectedFriends.includes(friend._id) ? 'bg-blue-500 text-white' : ''
                                    }`}
                                >
                                    {friend.username}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2 hover:bg-gray-500 transition-colors duration-300"
                                onClick={closeGroupModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                onClick={createGroupChat}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Routes>
                <Route path="chat/:friendId" element={<ChatScreen />} />
               
                <Route path="group-chat/:groupId" element={<GroupChatScreen />} />
            </Routes>
        </div>
    );
};

export default Messages;
