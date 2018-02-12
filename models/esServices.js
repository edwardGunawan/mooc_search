var client = require('./connection.js');
var jsonFile = require('../data/course.json');

module.exports = {
  // ping server if it connected or not
  ping : (req,res) => {
    client.ping({
      requestTimeout: 1000
    }, (err) => {
      if(err){
        console.trace('elasticsearch cluster is down!');
        res.status(500).json(err);
      } else{
        console.log('All is well');
        res.status(200).json('All is well');
      }
    });
  },
  checkHealth : (req,res) => {
    // deployment health check
    // client.cluster.health({}, (err,res,status) => {
    //   console.log('Client health -- ', res);
    //   res.json(res);
    // });
    client.cat.indices({v:true}).then((response) => {
      res.status(400).json(response);
    }).catch(err => {
      res.status(500).json(err)
    });
  },

  // create index
  indexInit : (req,res, indexName) =>{
    client.indices.create({
      index:indexName
    }).then((res) => {
      console.log(res);
      res.status(200).json(res);
    },(err) => {
      console.log(err);
      res.status(500).json(err)
    });
  },

  // check index if it exist
  indexExist : (req,res,indexName) => {
    client.indices.exist({
      index:indexName
    }).then((res) => {
      console.log(res);
      res.status(200).json(res);
    },(err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  // importJSON
  importJSONFile : (req,res, indexName, type) => {
    let bulkBody= [];
    jsonFile.forEach(item => {
      // action description
      bulkBody.push({
        index : {
          _index:indexName,
          _type:type,
          _id : item.id
        }
      });
      // the document to index
      bulkBody.push(item);
    });

    client.bulk({body:bulkBody}).then((response) => {
      console.log('here in response')
      let errorCount = 0;
      response.items.forEach(item => {
        if(item.index && item.index.error) {
          console.log(++errorCount, item.index.error); // count the number of error
          res.status(item.index.status).json(item.index.error);
        }
      });

      console.log(` Successfully indexed ${jsonFile.length - errorCount} out of ${jsonFile.length} items`);

      res.status(200).send(` Successfully indexed ${jsonFile.length - errorCount} out of
        ${jsonFile.length} items`);
    }).catch(err => {
      res.status(500).json(err)
    });
  },

  // creating mapping
  mapInit: (req,res,indexName, docType, payLoad) => {
    client.indices.putMapping({
      index:indexName,
      type:docType,
      body : payLoad
    }).then((response) => {
      res.status(200).json(response);
    },err => res.status(500).json(err));
  },


  // add/update document
  addDocument : (req,res,indexName, _id, docType, payLoad) =>{
    client.index({
      index:indexName,
      type: docType,
      id: _id,
      body: payLoad
    }).then(response => {
      res.status(200).json(response);
    },err => res.status(500).json(err));
  },

  updateDocument: (req,res,indexName, _id, docType, payLoad) => {
    client.update({
      index:indexName,
      type:docType,
      id:_id,
      body: payLoad
    }).then(response =>{
      res.status(200).json(response);
    },err=>{
      res.status(500).json(err);
    })
  },

  search: (req,res,indexName, docType, payLoad) => {
    client.search({
      index:indexName,
      type:docType,
      body:payLoad
    }).then(response => {
      console.log(response);
      return res.json(response);
    },(err) => {
      console.log(err);
      res.json(err);
    });
  },


  /* ================== Danger Zone =============== [RESTRICTED USE]*/
  deleteDocument : (req,res, indexName, _id, docType) => {
    client.delete({
      index:indexName,
      type:docType,
      id:_id
    }).then(response => {
      res.status(200).json(response);
    },err => {
      res.status(500).json(err);
    });
  },

  deleteAll : (req,res,indexName) => {
    client.indices.delete({
      index:indexName,
      ignore:[404] // prevent 404 errors by telling the client to ignore them
    }).then((response) => {
      // since we told client to ignore 404 the promise is resolved even if the
      // index doesn't exist
      res.send('index was deleted or never exist');
    }).catch(err => {
      // oh no!
    })
  }

}
