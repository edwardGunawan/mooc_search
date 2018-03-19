var express = require('express');
console.log(__dirname, ' here in server.js');
const fs = require('fs');
const path = require('path');
// path.join(__dirname, '../..')
// fs.readdirSync(__dirname+'/data').forEach(file => {
//   console.log(file);
// })
var bodyParser = require('body-parser');
var validate = require('express-joi');
var helmet = require('helmet'); // sercure express app setting various http header
var middleware = require('./src/middleware');
var getSearch = require('./src/search.js'); // search functionality
var getSuggest = require('./src/suggest.js');
var cors = require('cors');


var app = express();
var PORT = process.env.PORT || 3000;

/************ middleware ******************/

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// logging file
// enable CORS
app.use(cors());
app.use(middleware.logger);
app.use(middleware.logErrors);
app.use(middleware.errorHandler);






app.get('/search', validate.joiValidate(middleware.search_validate),async (req,res) => {
  const {q, offset=0} = req.query;
  await getSearch(q,offset)
  .then(response =>{
    res.status(200).json(response);
  })
  .catch(e => res.status(500).send(e.message));
});

app.get('/suggest',validate.joiValidate(middleware.suggest_validate),async(req,res) => {
  const {q=''} = req.query;
  try{
    const titles = await getSuggest(q);
    if(titles) res.status(200).json(titles);
  } catch(e) {
    res.status(500).json(e);
  }
});

app.get('/', async (req,res) => {
  res.status(200).send('home from backend');
});




app.listen(PORT, function(err) {
  if(err) console.error(err);
  console.log('App Listening to', PORT);
});


module.exports = app;
