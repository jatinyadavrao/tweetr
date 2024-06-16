const express = require('express');
const { 
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
} = require('../controllers/Chat.controller');
const verifyToken = require('../middlewares/auth.middleware');

const chatRouter = express.Router();

chatRouter.get('/friends', verifyToken, fetchFriends);
chatRouter.delete('/friends/:id', verifyToken, removeFriend);
chatRouter.get('/friendchat/:id', verifyToken, createChat);
chatRouter.post('/group', verifyToken, createGroupChat);
chatRouter.get('/fetchgroup/:id', verifyToken, fetchGroupChat);
chatRouter.get('/groups', verifyToken, fetchAllGroupChats);
chatRouter.post('/message/friend/:id', verifyToken, sendMessageToFriend);
chatRouter.post('/message/group/:id', verifyToken, sendMessageToGroup);
chatRouter.get('/messages/friend/:id', verifyToken, receiveMessagesOfFriend);
chatRouter.get('/messages/group/:id', verifyToken, receiveMessagesOfGroup);

module.exports = chatRouter;
