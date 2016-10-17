var express = require('express');
var app = express();
var path = require('path');
var users = require('./users/router');
var bodyParser = require('body-parser');
var open = require('opn');

const PORT = 3000;
//Middleware
var setHeader = function (req, res, next) {
  res.set('content-type','application/json');
  res.set('data',Date.now());
  //Hack
  var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
  
};

app.use(setHeader);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(bodyParser.text());



//Serve index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
    res.end();
});



//Serve static files
app.use('/static', express.static(path.join(__dirname, '..', 'client', 'files')));

//Serve users
app.use('/users', users);


//Start Server
app.listen(PORT, function() {
    open('http://localhost:' + PORT);
});
