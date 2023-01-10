const express = require('express');
const {registerUser , authUser , allUsers } = require('../Controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to Register User 
router.route('/').post(registerUser)

// For Get Request 
// Protect is Middleware which to used to Verify Author 
router.route('/').get(protect ,allUsers);


// Route to Login 
router.route('/login').post(authUser);

module.exports = router;