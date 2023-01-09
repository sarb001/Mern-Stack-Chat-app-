
const asyncHandler = require('express-async-handler'); 
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');
const Chat  = require('../models/ChatModel');

const sendmessages = asyncHandler(async (req,res) => {

    const { content ,chatid } = req.body;

    if(!content || !chatid){            // if not Present then  
        console.log(' Invalid data passed into Request ');
        return res.statusCode(400);
    }
    // New Message structure be like 
     var newmessage = {
         sender : req.user._id,
         content : content ,
         chat : chatid,
     };

        try{
            var message = await Message.create(newmessage);     // create New Message 

            message = await message.populate('sender' , "name pic")    // Populate for sender 
            message = await message.populate('chat')        // for chat 
            message = await User.populate(message, {            // In this get all this 
                path : 'chat.users',
                select : "name pic email",
            }); 

            await Chat.findByIdAndUpdate(req.body.chatid , {        // BY id update the message 
                latestMessage : message,                // make the Latest Message 
            });

            res.json(message);

        }catch(error)
        {
            res.statusCode(400);
            throw new Error(error);
        }
})

const getallmessages = asyncHandler(async (req,res) => {

    try{
        const messages = await Message.find({chat : req.params.chatid})     // find all data by id  
        .populate("sender" , 'name pic email')
        .populate("chat");

         res.json(messages);
    }catch(error)
    {
        res.statusCode(400);
        throw new Error(error.message);
    }
})

module.exports = { sendmessages  ,getallmessages };