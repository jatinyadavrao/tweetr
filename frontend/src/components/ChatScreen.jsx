import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaVideo } from 'react-icons/fa';
import { UserContext } from './UserContext';
import { backendUrl } from '../variable';
import { SocketContext } from './SocketContext';

const ChatScreen = () => {
    const { user } = useContext(UserContext);
    const { friendId } = useParams();
    const { socket } = useContext(SocketContext);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [calling, setCalling] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const userVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);

    useEffect(() => {
        console.log("before fetching chat")
          fetchChat()
          console.log("after fetching chat")
        fetchMessages();
      
        if (socket) {
            socket.on('receiveMessage', handleMessageReceive);
            socket.on('receive-call', handleReceiveCall);
            socket.on('call-rejected', handleCallRejected);
            socket.on('accept-call', async (data) => {
                console.log('Received answer:', data);
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            });
            socket.on('candidate', handleNewICECandidate);
            socket.on('call:end',callEnded)
        }
        return () => {
            if (socket) {
                socket.off('receiveMessage', handleMessageReceive);
                socket.off('receive-call', handleReceiveCall);
                socket.off('call-rejected', handleCallRejected);
                socket.off('accept-call')
                socket.off('candidate', handleNewICECandidate);
                socket.off('call:end',callEnded)
            }
        };
    }, [friendId, socket]);
  
    const callEnded = ()=>{
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        peerConnectionRef.current = null
        setCalling(false);
    }

    const fetchChat = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/chat/friendchat/${friendId}`, { withCredentials: true });
            setChat(response.data.data);
            console.log('setting chat');
            console.log(response.data.data._id)
            if ( socket) {
                console.log('joining room')
                socket.emit('joinChat', response.data.data._id);
            }
        } catch (error) {
            console.error("Error fetching chat", error);
            toast.error("Failed to fetch chat");
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/chat/messages/friend/${friendId}`, { withCredentials: true });
            setMessages(response.data.data);
        } catch (error) {
            console.error("Error fetching messages", error);
            toast.error("Failed to fetch messages");
        }
    };

    const handleMessageReceive = (message) => {
        setMessages((prevMessages) => [message, ...prevMessages]);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const messageData = {
                chatId: chat._id,
                sender: user,
                content: newMessage
            };
            await axios.post(`${backendUrl}/api/v1/chat/message/friend/${friendId}`, { content: newMessage }, { withCredentials: true });
            socket.emit('sendMessage', messageData);
            setMessages([messageData, ...messages]);
            setNewMessage('');
            toast.success("Message sent successfully");
        } catch (error) {
            console.error("Error sending message", error);
            toast.error("Failed to send message");
        }
    };

    const handleVideoCall = async () => {
        try {
            setCalling(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            userVideoRef.current.srcObject = stream;
           
          await createOffer(stream);
            socket.emit('call-user', { name: user.name, room: chat._id, offer: peerConnectionRef.current.localDescription });
        } catch (error) {
            console.error("Error starting video call", error);
            toast.error("Failed to start video call");
        }
    };

    const createOffer = async (stream) => {
        if (!peerConnectionRef.current) {
            peerConnectionRef.current = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
        }
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('candidate', event.candidate);
                }
            }

            peerConnectionRef.current.ontrack = handleTrackEvent;
            stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
        

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
    };

    const handleReceiveCall = async (data) => {
        setIncomingCall(data);
    };

    const handleAcceptCall = async (data) => {
        try {
            setCalling(true);
            setIncomingCall(null)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            userVideoRef.current.srcObject = stream;
            

            if (!peerConnectionRef.current) {
                peerConnectionRef.current = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
            }
                peerConnectionRef.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('candidate', event.candidate);
                    }
                };

                peerConnectionRef.current.ontrack = handleTrackEvent;
                stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
            

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket.emit('accept-call', { room: chat._id, answer:peerConnectionRef.current.localDescription });
        } catch (error) {
            console.error("Error accepting call", error);
            toast.error("Failed to accept call");
        }
    };

    const handleCallRejected = () => {
        setCalling(false);
        toast.error("Call rejected.");
        
    };

    const handleRejectCall = () => {
        socket.emit('reject-call', { room: chat._id });
        setIncomingCall(null);
    };

    const handleTrackEvent = (event) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };

    const handleEndCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setCalling(false);
        setIncomingCall(null);
        peerConnectionRef.current = null
        socket.emit('call:ended',{room:chat._id})
    };

    const handleNewICECandidate = async (candidate) => {
        try {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(candidate);
            }
        } catch (error) {
            console.error("Error adding ICE candidate", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
            <Toaster />
            <div className="p-6 bg-blue-500 text-white text-center flex justify-between items-center">
                <h2 className="text-3xl font-bold">Chat with {chat && chat.chatName}</h2>
                {!calling && (
                    <button onClick={handleVideoCall} className="bg-white text-blue-500 rounded-full p-2">
                        <FaVideo size={24} />
                    </button>
                )}
            </div>
            {!calling && (
                <div className="p-6">
                    <div className="mb-4">
                        {messages && messages.map((message, index) => (
                            <div key={index} className={`p-4 mb-2 rounded-lg ${message.sender._id === user._id ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                                <div className='flex gap-1'> <div className='font-bold'>{message.sender.name}</div> {message.content}</div>
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
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
           
            {calling && (
                <div className="relative w-full h-auto">
                    <video ref={userVideoRef} autoPlay className="w-full h-auto object-cover" />
                    <video ref={remoteVideoRef} autoPlay className="w-full h-auto object-cover" />
                    <div className="absolute bottom-2 right-2">
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={handleEndCall}>
                            End Call
                        </button>
                    </div>
                </div>
            )}
            {incomingCall && (
                <div className="fixed bottom-10 right-10 bg-white p-4 shadow-lg rounded-xl">
                    <p className="font-bold">{incomingCall.name} is calling...</p>
                    <div className="mt-2">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2" onClick={() => handleAcceptCall(incomingCall)}>
                            Accept
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={handleRejectCall}>
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatScreen;
