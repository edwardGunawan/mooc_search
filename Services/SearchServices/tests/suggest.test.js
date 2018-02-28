/*------------------------------
  Testing Suggest
  -----------------------------*/
let getSuggest = require('../src/suggest.js');
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let {client,type,setup} = require('../src/connection.js');
let jsonFile = require('../../GetCourseServices/data/course_test.json');

const test_index = 'test_index';
const schema = require('../src/mapping.js');
const settings = require('../src/settings.js');

describe('suggest.js', () => {
  beforeEach(`creating ${test_index}`, async () => {
    // create a test_index index and content
    if(await client.indices.exists({index:test_index})){
      await client.indices.delete({index:test_index});
    }
    await client.indices.create({ index:test_index, body:settings });
    if(await client.indices.exists({index:test_index})){
      await client.indices.putMapping({index:test_index,type,body:schema});
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
  });

  it('typing \'ja\' should return title starts with java or javaScript', async () => {
    try {
      const title_arr = await getSuggest('ja',test_index);
      expect(title_arr).is.a('array');
      // loop through array and see if there is a substring of java or javaScript
      title_arr.forEach((title) => {
        if(title.indexOf('jav') !== -1) should.Throw(e);
      });
    } catch(e) {
      should.Throw(e);
    }
  });

  after(`deleting ${test_index}`, async () => {
    if(await client.indices.exists({index:test_index})){
      await client.indices.delete({index: test_index})
    }
  });

});
