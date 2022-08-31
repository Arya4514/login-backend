const express = require('express')
const route = express.Router();
const authController = require('../controller/auth')


route.post('/sign-in', authController.login);
route.post('/signUp', authController.signup);
route.post('/verify-otp', authController.verifyPersonalPin);




module.exports = route
