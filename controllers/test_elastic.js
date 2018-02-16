var method = require('../models/esServices.js');
const routes = require('express').Router();

// ping
routes.get('/ping',(req,res) => {
    method.ping(req,res);
});

// checkHealth
routes.get('/checkHealth',(req,res) =>{
  method.checkHealth(req,res);
})

// indexInit
routes.post('/index',(req,res) => {
  // res.send('get to index next');
  method.indexInit(req,res);
});

//indexExist (check index exist)
routes.get('/check',(req,res) => {
  // index will be in the req.query
  // res.send('get to index check');
  method.indexExist(req,res);
});

// import jsonFile
routes.post('/index/bulk', (req,res) => {
  // res.send('get to bulk');
  method.importJSONFile(req,res);
});

// mapInit (create maps)
routes.post('/maps', (req,res) => {
  console.log(req.body);
  // req.body will have index in it
  method.mapInit(req,res)
  // res.send('Get to index map init');
});


// addDocument (create documents)
routes.post('/documents', (req,res) => {
  // the documents type and index will be in req.body
  res.send('get to add');
});

// updateDocument (update documents)
routes.put('/documents/:id', (req,res) => {
  res.send('get to id update');
});

// search
routes.get('/search',(req,res) => {
  console.log(req.query.q);
  // res.status(200).send();
  method.search(req.query.q).then((response) => {
    console.log('response is ', response);
    res.status(200).json(response);
  }).catch((e) => res.status(500).json(e.message));
});

/* ---------------***** [RESTRICTED] ******/
// routes.delete('/documents/:id',(req,res) => {
//   res.send('get to delte-document');
// });
//
// routes.delete('/documents',(req,res) => {
//   // delete all documents
//   res.send('get to delete_all');
// });

module.exports = routes;
