const express = require('express');
const {registerUser} = require('../Controllers/userControllers');

const router = express.Router();

// Route to Register User 
router.route('/').post(registerUser);

module.exports = router;