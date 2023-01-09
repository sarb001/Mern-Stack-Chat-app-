
const express = require('express');

const {  getallmessages  , sendmessages }  = require('../Controllers/MessageController');

const { protect }  = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post( protect,sendmessages);
router.route('/:chatid').get( protect ,getallmessages);


module.exports  = router;