const  mongoose  = require('mongoose');
const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');
const User = require('../models/User.model');

const fetchFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'friends',
            select: '-password'
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.json({
            success: true,
            message: "Friends fetched successfully",
            data: user.friends
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching friends",
            error: error.message
        });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.friends = user.friends.filter(friendId => friendId.toString() !== id);
        await user.save();

        const friend = await User.findById(id);
        if (friend) {
            friend.friends = friend.friends.filter(friendId => friendId.toString() !== req.user.id);
            await friend.save();
        }

        return res.json({
            success: true,
            message: "Friend removed successfully",
            data: user.friends
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in removing friend",
            error: error.message
        });
    }
};

const createChat = async (req, res) => {
    try {
        const { id } = req.params;

        const existingChat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user.id, id] }
        });

        if (existingChat) {
            return res.json({
                success: true,
                message: "Chat already exists",
                data: existingChat
            });
        }

        const otherUser = await User.findById(id);
        const newChat = await Chat.create({
            isGroupChat: false,
            chatName: otherUser.name,
            users: [req.user.id, id]
        });

        return res.json({
            success: true,
            message: "Chat created successfully",
            data: newChat
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Error in creating chat",
            error: error.message
        });
    }
};


const createGroupChat = async (req, res) => {
    try {
        const { name, members } = req.body;

        const newGroupChat = await Chat.create({
            isGroupChat: true,
            chatName: name,
            users: [...members, req.user.id],
            groupAdmin: req.user.id
        });

        return res.json({
            success: true,
            message: "Group chat created successfully",
            data: newGroupChat
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Error in creating group chat",
            error: error.message
        });
    }
};

const fetchGroupChat = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findById(id)
        .populate('users', '-password')
       
    

        if (!chat) {
            return res.json({
                success: false,
                message: "No Chat Found"
            });
        }
        return res.json({
            success: true,
            message: "Group Chat Fetched",
            data: chat
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in fetching Group Chat"
        });
    }
};

const fetchAllGroupChats = async (req, res) => {
    try {
        const groupChats = await Chat.find({ isGroupChat: true }).populate('users', '-password') .sort({ updatedAt: -1 });;

        return res.json({
            success: true,
            message: "Group chats fetched successfully",
            data: groupChats
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in fetching group chats",
            error: error.message
        });
    }
};

const sendMessageToFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user.id, id] }
        });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat Not Found"
            });
        }

        const message = await Message.create({
            sender: req.user.id,
            chat: chat._id,
            content
        }); 
        
        chat.latestMessage = content;
        await chat.save();

        return res.json({
            success: true,
            message: "Message Sent Successfully",
            data: message
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in Sending Message",
            error: error.message
        });
    }
};

const sendMessageToGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const chat = await Chat.findById(id);
        if (!chat) {
            return res.json({
                success: false,
                message: "Chat Not Found"
            });
        }

        const message = await Message.create({
            sender: req.user.id,
            chat: chat._id,
            content
        });

        chat.latestMessage = content;
        await chat.save();

        return res.json({
            success: true,
            message: "Message Sent Successfully",
            data: message
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in Sending Message",
            error: error.message
        });
    }
};

const receiveMessagesOfFriend = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user.id, id] }
        });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat Not Found"
            });
        }

        const messages = await Message.find({ chat: chat._id }).sort({ createdAt: -1 }).populate('sender','-password');

        return res.json({
            success: true,
            message: "Messages Fetched Successfully",
            data: messages
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in Fetching Messages",
            error: error.message
        });
    }
};

const receiveMessagesOfGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await Chat.findById(id);
        if (!chat) {
            return res.json({
                success: false,
                message: "Chat Not Found"
            });
        }

        const messages = await Message.find({ chat: chat._id }).sort({ createdAt: -1 }).populate('sender','-password');

        return res.json({
            success: true,
            message: "Messages Fetched Successfully",
            data: messages
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in Fetching Messages",
            error: error.message
        });
    }
};

module.exports = {
    fetchFriends,
    removeFriend,
    createChat,
    createGroupChat,
    fetchGroupChat,
    fetchAllGroupChats,
    sendMessageToFriend,
    sendMessageToGroup,
    receiveMessagesOfFriend,
    receiveMessagesOfGroup
};
