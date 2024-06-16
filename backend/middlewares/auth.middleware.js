const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyToken = async(req,res,next)=>{
   try {
     const {token} = req.cookies;
   
     if(!token) return res.json({success:false,message:"No Token Found"})
     const verifiedUser = await jwt.verify(token,process.env.jwt_secret_key);
     if(!verifiedUser) return res.json({success:false,message:"Invalid Token"});
   
     req.user = verifiedUser;
     next()
   } catch (error) {
       return res.json({success:false,
    message:"Error in auth Middleware"})
   }
};
module.exports = verifyToken