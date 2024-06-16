import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { backendUrl } from '../variable';
import toast, { Toaster } from 'react-hot-toast';
import { SocketContext } from './SocketContext';
const GroupChatScreen = () => {
    const { user } = useContext(UserContext);
    const { groupId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chat, setChat] = useState({});
    const {socket} = useContext(SocketContext)
    useEffect(() => {
        fetchMessages();
        fetchChat();
        if (groupId) {
            socket.emit('joinChat', groupId);
        }

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [message, ...prevMessages]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [groupId]);

    const fetchChat = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/chat/fetchgroup/${groupId}`, { withCredentials: true });
            setChat(response.data.data);
        } catch (error) {
            console.error("Error fetching chat", error);
            toast.error("Failed to fetch chat");
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/chat/messages/group/${groupId}`, { withCredentials: true });
            setMessages(response.data.data);
        } catch (error) {
            console.error("Error fetching messages", error);
            toast.error("Failed to fetch messages");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const messageData = {
                chatId:groupId,
                senderId: user,
                content: newMessage
            };
            const response = await axios.post(`${backendUrl}/api/v1/chat/message/group/${groupId}`, { content: newMessage }, { withCredentials: true });
            const sentMessage = response.data.data;
            socket.emit('sendMessage', messageData);
            setMessages([messageData, ...messages]);
            setNewMessage('');
            toast.success("Message sent successfully");
        } catch (error) {
            console.error("Error sending message", error);
            toast.error("Failed to send message");
        }
    };
    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
            <Toaster />
            <div className="p-6 bg-green-500 text-white text-center">
                <h2 className="text-3xl font-bold">Group {chat.chatName}</h2>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`p-4 mb-2 rounded-lg ${message.sender === user._id ? 'bg-green-100 text-right' : 'bg-gray-100 text-left'}`}>
                         <div className='flex gap-1'> <div className='font-bold'>{message.sender?.name}</div>  {message.content}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatScreen;
