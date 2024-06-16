const User = require("../models/User.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

require('dotenv').config()
const signup = async (req, res) => {
  try {
      const { name, email, username, password } = req.body;
      
      const existingUser = await User.findOne({
          $or: [
              { username: username },
              { email: email }
          ]
      });
      
      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: "User already exists"
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
          name,
          email,
          username,
          password: hashedPassword
      });
      
      user.password = undefined;
      
      // Return the new user
      return res.status(201).json({
          success: true,
          user
      });

  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Error in creating user",
          error: error.message
      });
  }
};

const login = async (req, res) => {
  try {
      const { email, password } = req.body;  
     
      const existingUser = await User.findOne({ email });
      
      if (!existingUser) {
          return res.status(400).json({
              success: false,
              message: "No user exists with these credentials"
          });
      }
  
      const matchPassword = await bcrypt.compare(password, existingUser.password);
      

      if (!matchPassword) {
          return res.status(400).json({
              success: false,
              message: "Password is incorrect"
          });
      }
      
  
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      
     
      return res.cookie("token", token, {
          expires: new Date(Date.now() + 59 * 60 * 1000), 
          httpOnly: true
      }).json({
          success: true,
          message: "User logged in successfully",
          data:existingUser
      });

  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Error in login",
          error: error.message
      });
  }
};


const logout = async(req,res)=>{
   try {
     const {token} = req.cookies;
     if(!token) return res.json({success:false,message:"No Token Found"});
return  res.clearCookie('token').json({
         success:true,
         message:"User Logged Out Successfully"
     })
   } catch (error) {
      return res.json({
        success:false,
        message:"Error in Logout",
        error:error.message
      }) 
   }

}

       const isLoggedIn  = async(req,res)=>{
        try {
            const {token}= req.cookies;
            if(!token) {return res.json({
              success:false,
              message:"No Token Found",
              data:null
            })}
            const user = await jwt.verify(token,process.env.jwt_secret_key);
            if(!user) {return res.json({
              success:false,
              message:"Invalid Token",
              data:null
            });}
              const existingUser = await User.findById(user.id).select('-password')
            return res.json({
              success:true,
              message:"Logged In Successfully...",
              data:existingUser
            })
        } catch (error) {
            console.log(error.message);
        }
       }

module.exports = {signup,login,logout,isLoggedIn}