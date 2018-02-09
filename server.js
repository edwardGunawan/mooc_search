var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

app.use(express.static('public'));

app.listen(PORT, function() {
  console.log('Express Listen', PORT);
});
