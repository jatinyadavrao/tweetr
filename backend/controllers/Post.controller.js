const Post = require("../models/Post.model");
const User = require('../models/User.model')
const Comment = require("../models/Comment.model")
const postController = async (req, res) => {
    try {
        const { content } = req.body;
        const createdPost = await Post.create({ content, owner: req.user.id });
        return res.json({
            success: true,
            message: "Post Created Successfully",
            data:createdPost
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in posting a post",
            error:error.message
        });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postToDelete = await Post.findById(id);
        if (!postToDelete) {
            return res.json({
                success: false,
                message: "Post not found"
            });
        }
        if (req.user.id !== postToDelete.owner.toString()) {
            return res.json({
                success: false,
                message: "You are not the owner of this post"
            });
        }
        await Post.findByIdAndDelete(id)
        return res.json({
            success: true,
            message: "Post deleted Successfully"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in deleting post",
            error:error.message
        });
    }
}

const likeOrUnlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const fetchPost = await Post.findById(id);
        if (!fetchPost) {
            return res.json({
                success: false,
                message: "No post found"
            });
        }

        const userId = req.user.id;
        const likeIndex = fetchPost.likes.indexOf(userId);

        if (likeIndex === -1) {
            fetchPost.likes.push(userId);
            await fetchPost.save();
            return res.json({
                success: true,
                message: "Post liked"
            });
        } else {
            // Unlike the post
            fetchPost.likes.splice(likeIndex, 1);
            await fetchPost.save();
            return res.json({
                success: true,
                message: "Post unliked"
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in liking/unliking post"
        });
    }
}
const fetchAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find({});
        return res.json({
            success:true,
            message:"All posts fetched Successfully",
            data:posts
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"Error in fetching Posts"
        })
    }
}
const fetchAllPostsOfUser = async(req,res)=>{
    try {
        const posts = await Post.find({owner:req.user.id});
        return res.json({
            success:true,
            message:"All posts of User fetched Successfully",
            data:posts
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"Error in fetching Posts"
        })
    }
}
const fetchOtherUserPost = async(req,res)=>{
    try {
        const posts = await Post.find({owner:req.params.id});
        return res.json({
            success:true,
            message:"All posts of User fetched Successfully",
            data:posts
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"Error in fetching Posts"
        })
    }
}
const fetchAllCommentsofPost = async(req,res)=>{
    try {
        const {id} = req.params;
        const postExists = await Post.findById(id);
        if (!postExists) {
            return res.json({
                success: false,
                message: "Post not found"
            });
        }

        const allComments = await Comment.find({ post: id }); 

        return res.json({
            success: true,
            message: "All comments fetched successfully",
            data: allComments
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Error in fetching comments"
        });
    }
}
const fetchMyCommentsofPost = async(req,res)=>{
    try {
        const {id} = req.params;
        const postExists = await Post.findById(id);
        if (!postExists) {
            return res.json({
                success: false,
                message: "Post not found"
            });
        }

        const allComments = await Comment.find({ post: id ,user:req.user.id}).populate('user', 'username'); 

        return res.json({
            success: true,
            message: "All comments fetched successfully",
            data: allComments
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Error in fetching comments"
        });
    }
}
const addCommentToPost = async (req, res) => {
    try {
        const { id } = req.params; 
        const { comment } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(id);
        if (!post) {
            return res.json({
                success: false,
                message: "Post not found"
            })
        }

        const newComment = await Comment.create({
            comment,
            post: id,
            user: userId
        });


        post.comments.push(newComment._id);
        await post.save();

        return res.json({
            success: true,
            message: "Comment added successfully",
            data:newComment
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in adding comment"
        });
    }
}
const deleteComment = async(req,res)=>{
    try {
        const {id} = req.params;
  
        const comment = await Comment.findById(id);
        
        if(!comment) return res.json({
            success:false,
            message:'No Comment Found'
        })
        if(req.user.id===comment.user.toString()){
            const post = await Post.findOne({ comments: id });

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'No Post Found containing the comment'
                });
            }

            // Remove the comment reference from the post
            post.comments.pull(id);
            await post.save();

            await Comment.findByIdAndDelete(id);
            return res.json({
                success:true,
                message:"Comment Deleted Successfully"
            })
        }
        else{
            return res.json({
                success:false,
                message:"You didn't write the comment"
            })
        }
    } catch (error) {
        return res.json({
            success:false,
            message:"Error in deleting Comment",
            error:error.message
        })
    }
}

const fetchAllLikes = async (req, res) => {
    try {
        const { id } = req.params; 
        const post = await Post.findById(id);
        if (!post) {
            return res.json({
                success: false,
                message: "Post not found"
            });
        }
        const allLikes = post.likes;
        return res.json({
            success: true,
            message: "All likes fetched successfully",
            data: allLikes
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Error in fetching all likes"
        });
    }
}
const getPostsofFollowing = async(req,res)=>{
    try {
        const {id}  = req.params;
        const user = await User.findById(id).populate('following');
        if (!user) {
            return res.json({
                success: false,
                message: "No user found with this ID"
            });
        }


        const followingUserIds = user.following.map(followedUser => followedUser._id);

        const posts = await Post.find({ owner: { $in: followingUserIds } });

        return res.json({
            success: true,
            message: "Posts of following users fetched successfully",
            data: posts
        });}  catch (error) {
        return res.json({
            success:false,
            message:"Error in fetching Posts of Following"
        })
    }
}

const fetchAllUsers = async(req,res)=>{
   try {
    const otherUsers = await User.find({_id: { $ne: req.user.id } }).select("-password");
     return res.json({
         success:true,
         message:"Other Users",
         data:otherUsers
     })
   } catch (error) {
    console.log(error)
        return res.json({
            success:false,
            message:"Error in fetching Users",
            error:error.message
        })
   }
}
module.exports = { postController, fetchOtherUserPost,deletePost, fetchAllUsers,likeOrUnlikePost,addCommentToPost,fetchMyCommentsofPost,deleteComment,fetchAllCommentsofPost,fetchAllPosts,fetchAllLikes ,getPostsofFollowing,fetchAllPostsOfUser};
