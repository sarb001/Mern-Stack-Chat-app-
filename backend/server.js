const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');

const app = express();
dotenv.config();

app.get('/' , (req,res) => {
    res.send('API is running Successfully ');
})

        // For Displaying Chat   
app.get('/api/chat' , (req,res) => {
    res.send(chats);
})

        // For Displaying Chat   
app.get('/api/chat/:id' , (req,res) => {
            // res.send(req.params.id);    To get ID 
            const singlechat = chats.find((c) => c._id === req.params.id);
            res.send(singlechat);
})




const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Running Server at port ${PORT} Bro`))