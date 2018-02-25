var express = require('express');
var bodyParser = require('body-parser');
var validate = require('express-joi');
var helmet = require('helmet'); // sercure express app setting various http header
var middleware = require('./src/middleware');
var getSearch = require('./src/search.js'); // search functionality
var getSuggest = require('./src/suggest.js');

var app = express();
var PORT = process.env.PORT || 3000;

/************ middleware ******************/
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.static('public'));
// logging file
app.use(middleware.logger);
app.use(middleware.logErrors);




app.get('/search', validate.joiValidate(middleware.search_validate),async(req,res) => {
  const {q, offset=0} = req.query;
  console.log(q);
  await getSearch(q,offset)
  .then(response =>{
    res.json(response);
  })
  .catch(e => res.send(e.message));
});

app.get('/suggest',validate.joiValidate(middleware.suggest_validate),async(req,res) => {
  const {q} = req.query;
  try{
    const titles = await getSuggest(q);
    if(titles) res.json(titles);
  } catch(e) {
    res.status(500).json(e);
  }


})

app.get('/', async (req,res) => {
  res.send('home from backend');
});




app.listen(PORT, function(err) {
  if(err) console.error(err);
  console.log('App Listening to', PORT);
});