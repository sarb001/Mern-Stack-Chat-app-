const express = require('express');
const {registerUser , authUser} = require('../Controllers/userControllers');

const router = express.Router();

// Route to Register User 
router.route('/').post(registerUser);

// Route to Login 
router.route('/login').post(authUser);


module.exports = router;