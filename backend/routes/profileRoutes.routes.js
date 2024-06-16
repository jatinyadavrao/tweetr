const express = require('express');
const { followUser, getTotalFollowers, getTotalFollowing, MyProfile, userProfile } = require('../controllers/Profile.controller');
const verifyToken = require('../middlewares/auth.middleware');
const profileRouter = express.Router();

 profileRouter.get('/follow/:id',verifyToken,followUser);
 profileRouter.get('/totalfollowers/:id',verifyToken,getTotalFollowers);
 profileRouter.get('/totalfollowing/:id',verifyToken,getTotalFollowing);
profileRouter.get('/myprofile',verifyToken,MyProfile);
profileRouter.get('/profile/:id',verifyToken,userProfile);
module.exports = profileRouter