
const jwt  = require('jsonwebtoken');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res , next) => {

    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
             token = req.headers.authorization.split(' ')[1];
             // decodes token id 
             const decoded = jwt.verify(token, process.env.JWT_SECRET);
             
             // Find the User by ID without Selecting Password   
              req.user = await User.findById(decoded.id).select('-password');  
             next();

        }catch(error)
        {
            res.status(401);
            throw new Error(" Not Authorized  ,token Failed");
        }
    }
    
    if(!token){                          // If Token Doesn't Exist 
        res.status(401);
        throw new Error(" Not Authorized , No Token ");
    }
});  

module.exports = { protect };