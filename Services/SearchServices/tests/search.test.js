/*----------------------------
  Testing search
------------------------------ */
let search = require('../src/search.js');
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let {client,type,setup} = require('../src/connection.js');
let jsonFile = require('../../GetCourseServices/data/course_test.json');

const test_index = 'test_index';
const schema = require('../src/mapping.js');
const settings = require('../src/settings.js');


describe('search.js', () => {
  beforeEach(`re-create ${test_index}`,async () => {
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

  it('writing \'java\' should return \'java\' or substring with \'java\'', async () => {
    try {
      const resp = await search('java',0,test_index);
      // console.log('resp',resp);
      let title_map = resp.map(obj => obj.title.toLowerCase());
      // console.log(title_map);
      expect(resp).to.be.an('array');
      let numSubstring = 0;
      title_map.forEach((title) => {
        if(title.indexOf('java')) numSubstring++;
      })
      expect(numSubstring).to.equal(3);


    } catch (e) {
      should.Throw(e.message);
    }
  });


  it('should return the same input when insert \'jva\'', async () => {
    try {
      const resp = await search('jva',0,test_index);
      // console.log('resp',resp);
      let title_map = resp.map(obj => obj.title.toLowerCase());
      // console.log(title_map);
      expect(resp).to.be.an('array');
      let numSubstring = 0;
      title_map.forEach((title) => {
        if(title.indexOf('java')) numSubstring++;
      })
      expect(numSubstring).to.be.above(3);


    } catch (e) {
      should.Throw(e.message);
    }
  });

  after(`deleting ${test_index}`, async () => {
    if(await client.indices.exists({index:test_index})){
      await client.indices.delete({index: test_index})
    }
  });

});
