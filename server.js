var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./controllers/test_elastic.js');
var app = express();
var PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.get('/', (req,res) => {
  res.send('home from backend');
});

app.use('/elastic',routes);
// app.use(express.static('public'));

app.listen(PORT, function() {
  console.log('App Listening to', PORT);
});
