const express = require('express');
const { postController, deletePost, addCommentToPost, likeOrUnlikePost, fetchAllPosts, fetchAllPostsOfUser, getPostsofFollowing, deleteComment, fetchAllCommentsofPost, fetchMyCommentsofPost, fetchAllLikes, fetchAllUsers, fetchOtherUserPost } = require('../controllers/Post.controller');
const verifyToken = require('../middlewares/auth.middleware');
const postRouter = express.Router();
  
 postRouter.post('/post',verifyToken,postController);
 postRouter.get('/deletepost/:id',verifyToken,deletePost);
 postRouter.post('/comment/:id',verifyToken,addCommentToPost);
 postRouter.get('/like/:id',verifyToken,likeOrUnlikePost);
 postRouter.get('/userposts',verifyToken,fetchAllPostsOfUser);
 postRouter.get('/otheruserposts/:id',verifyToken,fetchOtherUserPost);
 postRouter.get('/posts',verifyToken,fetchAllPosts)
 postRouter.get('/followingposts/:id',verifyToken,getPostsofFollowing)
 postRouter.get('/deletecomment/:id',verifyToken,deleteComment)
 postRouter.get('/comments/:id',verifyToken,fetchAllCommentsofPost)
 postRouter.get('/mycomments/:id',verifyToken,fetchMyCommentsofPost)
 postRouter.get('/likes/:id',verifyToken,fetchAllLikes)
 postRouter.get('/users',verifyToken,fetchAllUsers)

module.exports = postRouter