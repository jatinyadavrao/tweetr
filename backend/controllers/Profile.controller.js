const User = require("../models/User.model");

const MyProfile = async(req,res)=>{
  try {
      const user = await User.findById(req.user.id).select("-password");
      return res.json({
          success:true,
          message:"my Profile fetched Suceessfully",
          data:user
      })
  } catch (error) {
        return res.json({
            success:false,
            message:"Error in Fetching My Profile"
        })
  }
    
}
const userProfile  = async(req,res)=>{
  try {
      const {id} = req.params;
      const user = await User.findById(id).select("-password");
      return res.json({
          success:true,
          message:"User fetched Successfully",
          data:user
      })
  } catch (error) {
     return res.json({
        success:false,
        message:"Error in fetching User Profile"
     })
  }
}
const followUser = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.json({ success: false, message: "No such user exists" });
      }
     
      const followerIndex = existingUser.followers.indexOf(req.user.id);
      if(followerIndex===-1){
        existingUser.followers.push(req.user.id);
        await existingUser.save(); 
        const currentUser = await User.findByIdAndUpdate(
          req.user.id,
          { $push: { following: existingUser._id } },
          { new: true } 
        );
        return res.json({
          success: true,
          message: `${currentUser.name} followed ${existingUser.name}`,
          user: currentUser, 
        });
      }
      existingUser.followers.splice(followerIndex,1);
      await existingUser.save()
        const crrUser = await User.findByIdAndUpdate(
          req.user.id,
          {$pull:{following:existingUser._id}},
          {new:true}
        )
        return res.json({
          success: true,
          message: `${crrUser.name} unfollowed ${existingUser.name}`,
          user: crrUser, 
        });
  
     }
     catch (error) {
      console.error("Error in following a user:", error);
      return res.status(500).json({
        success: false,
        message: "Error in following a user",
        error: error.message,
     })
      }  }

      const getTotalFollowers = async(req,res)=>{
     try {
           const {id} = req.params;
           if(!id) return res.json({success:false,message:"No Id Found"});
           const user = await User.findById(id);
           if(!user)  return res.json({success:false,message:"No user found with this id"})
           return res.json({
       success:true,
        data:user.followers.length(),
       message:"Total Followers fetched Successfully"})
     } catch (error) {
        return res.json({
            success:false,
            message:"Error in getting Total Followers"
        })
     }
    }
    
    const getTotalFollowing = async(req,res)=>{
        try {
              const {id} = req.params;
              if(!id) return res.json({success:false,message:"No Id Found"});
              const user = await User.findById(id);
              if(!user)  return res.json({success:false,message:"No user found with this id"})
              return res.json({
          success:true,
           data:user.following.length(),
          message:"Total Following fetched Successfully"})
        } catch (error) {
           return res.json({
               success:false,
               message:"Error in getting Total Following"
           })
        }
       }
module.exports ={MyProfile,userProfile,followUser,getTotalFollowers,getTotalFollowing}