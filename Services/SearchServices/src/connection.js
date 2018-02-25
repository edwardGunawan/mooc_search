var elasticsearch = require('elasticsearch');
var port = 9200;
var host = process.env.ES_HOST || 'localhost';
var client = new elasticsearch.Client({ host :{host,port}/*,log:'trace' */});
const schema = require('./mapping.js');
const settings = require('./settings.js');
var jsonFile = require('../../Static/data/course.json');

/*
  mapping:
  mooc_search: index
  course type
  */
const index = 'mooc_search';
const type = 'course';

var setup = {
  checkConnection: async () => {
    let isConnected = false;
    while(!isConnected) {
      console.log('Connecting to ES');
      try {
        const health = await client.cluster.health({});
        console.log(health);
        isConnected = true;
      } catch(err) {
        console.log('Connection failed, retrying ... ', err);
      }
    }
  },

  checkIndices : async () => {
    client.cat.indices({v:true}).then((response) => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    });
  },

  resetIndex: async () =>{
    if(await client.indices.exists({index})){
      await client.indices.delete({index});
    }
    await client.indices.create({ index, body:settings });
    console.log(`Checking Indices =====`);
    await setup.checkIndices();
    await setup.putMapping();
  },

  putMapping: async () =>{
    return client.indices.putMapping({ index, type, body : schema });
  },

  bulkImport : async () => {
    let bulkBody= [];
    jsonFile.forEach(item => {
      let item_copy = {
        ...item
        // when there is a suggest field in mapping.js, completor suggestor for all field
        // suggest:{
        //   input: item.title
        // }
      };
      // action description
      bulkBody.push({
        index : {
          _index:index,
          _type:type
        }
      });
      // console.log('item tag', item.title_tag);

      // console.log('item_copy', item_copy);


      // console.log(`${item}`);
      // the document to index
      bulkBody.push(item_copy);
    });

    client.bulk({body:bulkBody}).then((response) => {
      console.log('here in response')
      let errorCount = 0;
      response.items.forEach(item => {
        if(item.index && item.index.error) {
          console.log(++errorCount, item.index.error); // count the number of error
          console.log(item.index);
        }
      });

      console.log(` Successfully indexed ${jsonFile.length - errorCount} out of ${jsonFile.length} items`);
    }).catch(err => {
      console.log(err);
    });
  }
}




// setup.checkConnection();

module.exports = {client, index,type, setup};
