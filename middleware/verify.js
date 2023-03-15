const jwt=require('jsonwebtoken');
const User = require('../models/user');

module.exports=async(req,res,next)=>{
 
    const token=req.headers.authorization;
    if(!token)
    {
        const error=new Error("invalid user")
        error.status=400;
        return next(error);
    }
    
    //  verify the token
    const {id}=jwt.verify(token,"secretKey");
    
    const user= await User.findById(id);
    if(!user){
        const error=new Error("unauthorized user")
        error.status=403;
        return next(error);
    }
    console.log(user);
    req.user=user;
    next();
         
    }
    