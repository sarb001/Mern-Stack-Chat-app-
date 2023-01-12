const express = require('express');
const {accesschat , fetchChats  , creategroupchat , renamegroup , removefromgroup , addgroup } = require('../Controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect,accesschat)     // Verified user is able to post data or create specific user 

router.route('/').get(protect ,fetchChats);     // Fetch All chats 

router.route('/group').post(protect , creategroupchat);  // create Group Chat 

router.route('/rename').put(protect , renamegroup);      // Rename  Group Chat 

router.route('/groupremove').put(protect , removefromgroup);  // Remove  from Group 

router.route('/groupadd').put(protect , addgroup);  // Add to the  Group 

module.exports = router;
