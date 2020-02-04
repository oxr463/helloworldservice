const port = process.env.PORT || 3000;

var express = require('express');

var helloworldservice = require('./helloworldservice');
var app = express();

app.use('/helloworldservice',helloworldservice);
app.listen(port);

console.log('server running on port ' + port);
