const express = require('express');
const dotenv = require('dotenv');
const connectdb = require('./config/db');

const UserRoutes = require('./Routes/UserRoutes');

const ChatRoutes = require('./Routes/ChatRoutes');

const app = express();
dotenv.config();

//connecting to DB 
connectdb();

app.use(express.json());        // to Accept json data 

app.use('/api/user' , UserRoutes);       // Route for users only 

app.use('/api/chat' ,ChatRoutes);                                // Route for Authenticated user to Create Chat Only     


const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Running Server at port ${PORT} Bro`))



// app.get('/' , (req,res) => {
//     res.send('API is running Successfully ');
// })

//         // For Displaying Chat   
// app.get('/api/chat/' , (req,res) => {
//     res.send(chats);
// })

//         // For Displaying Chat   
// app.get('/api/chat/:id' , (req,res) => {
//             // res.send(req.params.id);    To get ID 
//             const singlechat = chats.find((c) => c._id === req.params.id);
//             res.send(singlechat);
// })