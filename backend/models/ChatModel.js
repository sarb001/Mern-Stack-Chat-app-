const mongoose = require('mongoose');


const chatModel = mongoose.Schema(
    {
        chatName : {type : String , trim: true},
        isGroupChat : {type : Boolean , default : false},
              users: [                                          // Will help to Get User 
                {
                    type :  mongoose.Schema.Types.ObjectId,
                    ref : 'User',       // will be used in Controller 
                }
                ],
                latestMessage:                                  // will help to get LatestMessage 
                {
                        type :  mongoose.Schema.Types.ObjectId,
                        ref : 'Message',
                },
                groupAdmin : 
                {
                        type :  mongoose.Schema.Types.ObjectId,
                        ref : 'User',
                },               
    },
    {
        timestamps : true ,
    }
);

const Chat =  mongoose.model('Chat' ,chatModel);

module.exports = Chat;



