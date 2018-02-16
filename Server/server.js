var express = require('express');
var bodyParser = require('body-parser');
var validation = require('express-joi-validation');
var joi = require('joi');
var helmet = require('helmet'); // sercure express app setting various http header
var middleware = require('./middleware');

var app = express();
var PORT = process.env.PORT || 3000;

/************ middleware ******************/
app.use(helmet());
app.use(express.urlencoded());
app.use(express.static('public'));
// logging file
app.use(middleware.logger);
app.use(middleware.logErrors);


app.get('/', (req,res) => {
  res.send('home from backend');
});




app.listen(PORT, function(err) {
  if(err) console.error(err);
  console.log('App Listening to', PORT);
});
