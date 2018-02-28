/*----------------------------
  Testing search
------------------------------ */
let search = require('../src/search.js');
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let {client,type,setup} = require('../src/connection.js');
let jsonFile = require('../../GetCourseServices/data/course_test.json');
let helper = require('./helper.test.js');

const test_index = 'test_index';
const schema = require('../src/mapping.js');
const settings = require('../src/settings.js');


describe('search.js', () => {
  beforeEach(`re-create ${test_index}`,async () => {
    await helper.createWithoutBulk();
    await helper.createMappingOnly();
    await helper.bulkImportOnly();
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
    await helper.deleteIndex();
  });

});
