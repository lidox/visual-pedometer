var express = require('express');
var path = require('path');
var app = express();
var port = 80;

// middleware
app.use(express.static(__dirname + '/public'));

// index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

app.listen(port, function () {
  console.log('visual pedometer app listening on port: ' + port);
});