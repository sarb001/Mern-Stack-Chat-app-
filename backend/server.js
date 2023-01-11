const express = require('express');
const dotenv = require('dotenv');
const connectdb = require('./config/db');

const UserRoutes = require('./Routes/UserRoutes');

const ChatRoutes = require('./Routes/ChatRoutes');

const MessageRoutes = require('./Routes/MessageRoutes');

const app = express();
dotenv.config();

//connecting to DB 
connectdb();

app.use(express.json());        // to Accept json data 

app.use('/api/user' , UserRoutes);       // Route for users only 

app.use('/api/chat' , ChatRoutes);        // Route for Authenticated user to Create Chat Only     

app.use('/api/message' , MessageRoutes)    // Routes for Messages

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, console.log(`Running Server at port ${PORT} Bro`))

const io = require('socket.io')(server , {
    pingTimeout : 60000,
    cors : {
        origin :'http://localhost:3000',
    }
});

io.on('connection' , (socket) => {
    console.log(' Connected to socket.io ');

    // For  Setup  use this  Connection 
    socket.on("setup" , (userdata) => {
        socket.join(userdata._id);                // On Joining Create user id which is Unique 
        console.log('Unique id of User is-',userdata._id);
        socket.emit(" connected ");
    });

    // For Joining Chat use this 
    socket.on('join-chat' , (room) => {
        socket.join(room);
        console.log(' User Joined this ROOM '+ room);   // Foxr specific user join the Room 
    })

    // For Recieving New  Message 
    socket.on('new message' , (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return  console.log('chat.users not Defined ');

        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id) return ;

            socket.in(chat._id).emit("message recieved" , newMessageRecieved);
        });
    });


    //when left the chat or  user Disconncted 
    socket.off("setup" , () => {
        console.log("USER DISCONNECTED");
        socket.leave(userdata._id);
    })

})

