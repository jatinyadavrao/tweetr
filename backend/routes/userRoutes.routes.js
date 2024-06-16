const express = require('express');
const { signup, login, logout, isLoggedIn } = require('../controllers/Auth.controller');
const verifyToken = require('../middlewares/auth.middleware');
const userRouter = express.Router();
  
 userRouter.post('/signup',signup);
 userRouter.post('/login',login);
 userRouter.get('/logout',logout);
 userRouter.get('/isloggedin',isLoggedIn)
module.exports = userRouter