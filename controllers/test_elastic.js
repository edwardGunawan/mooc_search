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
routes.post('/index/next',(req,res) => {
  // res.send('get to index next');
  method.indexInit(req,res,req.body.index_name);
});

//indexExist
routes.get('/index/check',(req,res) => {
  res.send('get to index check');
});

// import jsonFile
routes.post('/index/bulk', (req,res) => {
  // res.send('get to bulk');
  method.importJSONFile(req,res,'courses','cs');
});

// mapInit
routes.post('/index/map/new', (req,res) => {
  res.send('Get to index map init');
});


// addDocument
routes.post('/add', (req,res) => {
  res.send('get to add');
});

// updateDocument
routes.put('/:id/update', (req,res) => {
  res.send('get to id update');
});

// search
routes.post('/search',(req,res) => {
  res.send('get to search');

});

routes.delete('/:id/delete-document',(req,res) => {
  res.send('get to delte-document');
});

routes.delete('/delete_all',(req,res) => {
  res.send('get to delete_all');
});

module.exports = routes;
