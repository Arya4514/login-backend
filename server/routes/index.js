const express = require('express')
const route = express.Router();
const auth = require('./user')


route.use(
    "/",
    auth,
);




module.exports = route
