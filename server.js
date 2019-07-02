const express = require('express');
const bodyParser     = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 3003;
const server = require('http').Server(app);

//app.use(express.static(__dirname + '/app/'));
//app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + "/public/"));
app.route('/')
   .get(function(req, res) {
    res.sendfile('./public/index.html');})   

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

server.listen(port, function() {
    console.log("App running on port " + port);
})