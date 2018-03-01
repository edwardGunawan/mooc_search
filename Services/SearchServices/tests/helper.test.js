let {client,type,setup} = require('../src/connection.js');
const jsonTestFile = process.env.jsonTestFile || '../../GetCourseServices/data/course_test.json';
let jsonFile = require(jsonTestFile);

const test_index = 'test_index';
const schema = require('../src/mapping.js');
const settings = require('../src/settings.js');

var helper = {
  createWithoutBulk : async () => {
    // create a test_index index and content
    if(await client.indices.exists({index:test_index})){
      await client.indices.delete({index:test_index});
    }
    return client.indices.create({ index:test_index, body:settings });
  },

  createMappingOnly: async () => {
    if(await client.indices.exists({index:test_index})){
      await client.indices.putMapping({index:test_index,type,body:schema});
    }
  },

  bulkImportOnly: async() => {
    if(await client.indices.exists({index:test_index})){
      let bulkBody= [];
      jsonFile.forEach(item => {
        let item_copy = {
          ...item
        };
        // action description
        bulkBody.push({
          index : {
            _index:test_index,
            _type:type
          }
        });

        bulkBody.push(item);
      });

      await client.bulk({refresh:'wait_for',body:bulkBody})
      .then((response) => {
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
  },

  deleteIndex: async () => {
    if(await client.indices.exists({index:test_index})){
      await client.indices.delete({index: test_index})
    }
  },

  testCharacter : `Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                    natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Donec quam felis, ultricies nec,
                    pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec,
                    vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet
                    a, venenatis vitae, justo. Nullam dictum felis`
}

module.exports = helper;
