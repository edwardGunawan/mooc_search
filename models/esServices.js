var client = require('./connection.js');
var jsonFile = require('../data/course.json');
const mapping = require('./mapping.js');
const settings = require('./settings.js');
/*
  mapping:
  mooc_search: index
  course type
  */
const indexName = 'mooc_search';
const type = 'course';


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
  indexInit : (req,res) =>{
    client.indices.create({
      index:indexName,
      body: settings
    }).then((response) => {
      console.log(response);
      res.status(200).json(response);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err)
    });
  },

  // check index if it exist
  // indexExist : (req,res) => {
  //   client.indices.exists({
  //     index:indexName
  //   }).then((response) => {
  //     console.log(response);
  //     res.status(200).json(response);
  //   }).catch((err) => {
  //     console.log(err);
  //     res.status(500).json(err);
  //   });
  // },

  // importJSON
  importJSONFile : (req,res) => {
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
  mapInit: (req,res) => {
    client.indices.putMapping({
      index:indexName,
      type: type,
      body : body
    }).then((response) => {
      res.status(200).json(response);
    },err => res.status(500).json(err));
  },

  // creating settings
  // settingsInit: (req,res) => {
  //   client.indices.putSettings({
  //     index:indexName,
  //     settings:
  //   }).then(response)
  // }


  // add/update document
  // addDocument : (req,res,indexName, _id, docType, payLoad) =>{
  //   client.index({
  //     index:indexName,
  //     type: docType,
  //     id: _id,
  //     body: payLoad
  //   }).then(response => {
  //     res.status(200).json(response);
  //   },err => res.status(500).json(err));
  // },
  //
  // updateDocument: (req,res,indexName, _id, docType, payLoad) => {
  //   client.update({
  //     index:indexName,
  //     type:docType,
  //     id:_id,
  //     body: payLoad
  //   }).then(response =>{
  //     res.status(200).json(response);
  //   },err=>{
  //     res.status(500).json(err);
  //   })
  // },

  search: async (options) => {
    client.search({
      index:indexName,
      type:docType,
      body:{
        query:{
          bool:{
            filter: filters(options),
            must:{
              multi_match:{
                query:options.input,
                fields:['title^3','title.edge_ngram','description^2','instructors.name','instructors.bio'],
                operator:'and',
                fuzziness:'3',
                type:'most_field' // search for the combination of the score of all
              }
            }
          },
          highlight:{fields:{description:{ }}}
        }
      }

    }).then((res) => {
      return res.hits.hits.map(__searchHitResult);
    }).catch(e => e);

  },

  __searchHitResult: (hit) => {
    return {
      title:hit.title,
      image:hit.image,
      link:hit.link,
      description:hit.description,
      currency:hit.currency_unit+hit.amount,
      instructors:hit.instructors,
      expected_duration:hit.expected_duration,
      start_date:hit.start_date,
      end_date: hit.end_date,
      language:hit.language
    }
  },
  _filter: (options) => {
    // const clauses = [];
    // if(options.since){
    //   clauses.unshift(_since(options.since));
    // }
    return {};
    // return _all(clauses);
  },

  _since: (date) =>{
    return { range: { created: { gte:date}}};
  },

  _all: (clauses)=>{
    return { bool: { must:clauses} };
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
