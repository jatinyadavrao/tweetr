const express = require('express');

const verifyToken = require('../middlewares/auth.middleware');
const { sendNotification, fetchNotifications, rejectNotification, acceptNotification } = require('../controllers/Notification.controller');
const notificationRouter = express.Router();


 notificationRouter.get('/send/:id',verifyToken,sendNotification);
 notificationRouter.get('/receive',verifyToken,fetchNotifications);
 notificationRouter.get('/accept/:id',verifyToken,acceptNotification);
 notificationRouter.get('/reject/:id',verifyToken,rejectNotification);

module.exports = notificationRouter