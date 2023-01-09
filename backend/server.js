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

app.use('/api/chat' , ChatRoutes);                                // Route for Authenticated user to Create Chat Only     

app.use('/api/message' , MessageRoutes)           // Routes for Messages

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Running Server at port ${PORT} Bro`))

