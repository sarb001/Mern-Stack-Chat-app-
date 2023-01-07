
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

// create a Group chat 
const creategroupchat = asyncHandler(async(req,res) => {

    if(!req.body.users || !req.body.name)       // if Both DOn'T Exist then 
    {
         return res.status(400).send({ message : " PLease Fill all the Fields " });
    }

    var users = JSON.parse(req.body.users);             // Sending data 

    if(users.length < 2){
         return res.status(400).send("More than 2 users neeeded to make GROUP ")
    }

    users.push(req.user);       // push admin or logged in  user to Group creating 

    try{

        const groupchat = await Chat.create({       // create Group Chat 
            chatName : req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin : req.user,      // itself 
        });

        const fullGroupChat = await Chat.findOne({_id : groupchat._id })        // find by Id 
            .populate("users" , "-password")            // populate - get all data by this reference 
            .populate("groupAdmin" , "-password")

         res.status(200).json(fullGroupChat);

    }catch(error)
        {
             res.status(400);
             throw new Error(error.message);
        }
})

// Rename Group  
const renamegroup   =  asyncHandler(async (req,res) => {
        const {  chatid , chatName } = req.body;

     const updatechat = await Chat.findByIdAndUpdate(
     chatid,
     {
        chatName : chatName,
     },
     {
        new : true,
     }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatechat){

        res.status(400);
        throw new Error(" Chat not Found ");

    }else
    {
        res.json(updatechat);
    }
})

    // Remove from Group 
const removefromgroup = asyncHandler(async(req,res) => {

    const { chatid, userid } = req.body;

    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
        chatid,
      {
        $pull: { users: userid },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
})

    // Add to the  Group 
const addgroup = asyncHandler(async(req,res) => {

    const { chatid, userid } = req.body;

    // check if the requester is admin
  
    const added = await Chat.findByIdAndUpdate(
        chatid,
      {
        $push: { users: userid },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }

})

module.exports =  {accesschat  ,fetchChats ,creategroupchat, renamegroup , removefromgroup , addgroup }