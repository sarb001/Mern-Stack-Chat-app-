
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');
const generatetoken = require('../config/GenerateToken');

const registerUser = asyncHandler(async(req,res) => {

    const {name,email ,password ,pic} = req.body;

    if(!name || !email || !password )
    {
        res.status(400);
        throw new Error("Please Enter All Fields ") ;
    }

    const UserExists = await User.findOne({ email });

    if(UserExists){
        res.status(400);
        throw new Error(' User already Exists ');
    }

    const user = await User.create({
        name,email,password,pic
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token: generatetoken(user._id)
        });
    }else{
        res.status(400);
        throw new Error(' Failed to Create New USER ');
    }
})

const authUser = asyncHandler(async (req,res) => {

    const { email ,password } = req.body;
    const user = await User.findOne({email})    // check if user already exits or not ?

    if(user && (await user.matchpassword(password)))            // matchpassword 
    {
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token: generatetoken(user._id)
        })
    }else{
        res.status(401);
        throw new Error(' Invalid Email or Password  ');
    }
})


module.exports =  { registerUser ,authUser };