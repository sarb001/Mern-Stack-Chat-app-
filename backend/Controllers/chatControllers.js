
const Chat = require('../models/ChatModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

const accesschat =  asyncHandler(async (req,res) => {

     const {  userid  } = req.body;         // get the user id current 

    if(!userid){                
        console.log(' Userid param not sent with Request ');
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({               // if Both Condition satisfy then put data in isChat 
        isGroupChat : false,
         $and : [           // Both CONdition
            { users : { $elemMatch : {$eq : req.user._id}} },
            { users : { $elemMatch : {$eq : req.userid}}   },
         ],   
    })
    .populate("users" ,"-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat , {          // We also need sender field from Message Model 
        path : "latestMessage.sender",
        select : "name pic email",
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName : "sender",
            isGroupChat : false,
            users : [req.user._id , userid],
        };

        try{
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id : createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).send(FullChat);
        }catch(error)
        {
            res.status(400);
            throw new Error(error.message);
        }
    }
})


// fetch all chats for Logged User in Order 
const fetchChats = asyncHandler(async (req,res) => {
    try{
        Chat.find({users :{$elemMatch : {$eq : req.user._id }}})        // find data by mathcing specfic user id 
        .populate("users" , "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")              // Get all 3 fields 
        .sort({ updateAt : -1 })                // SORT here 
        .then(async (results) => {
         results  = await User.populate(results , {
            path : "latestMessage.sender",
            select : "name pic email",
         });
         res.status(200).send(results);  
        })

    }catch(error)
    {
        res.status(400);
        throw new Error(error.message);
    }
})
module.exports =  {accesschat  ,fetchChats}