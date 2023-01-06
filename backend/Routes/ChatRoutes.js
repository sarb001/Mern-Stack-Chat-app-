const express = require('express');
const {accesschat , fetchChats } = require('../Controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect,accesschat)     // Verified user is able to post data or create specific user 

router.route('/').get(protect ,fetchChats);

module.exports = router;
