// modules =================================================
var express = require('express');
var app = express();
var indexRouter = require("./server/routes");
var cors = require('cors')

// configuration ===========================================
var port = process.env.port || 8080; // set our port

app.use(express.json({ limit: '50mb' }));
app.use(express.json({
    type: 'application/vnd.api+json'
}));
app.use(cors())

app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    next();
});

app.use("/api", indexRouter);

app.listen(port, () => {
    console.log('Magic happens on port ' + port); // shoutout to the user
});

exports = module.exports = app;
