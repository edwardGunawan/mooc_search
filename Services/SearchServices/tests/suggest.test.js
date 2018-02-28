/*------------------------------
  Testing Suggest
  -----------------------------*/
let getSuggest = require('../src/suggest.js');
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let {client,type,setup} = require('../src/connection.js');
let jsonFile = require('../../GetCourseServices/data/course_test.json');
let helper = require('./helper.test.js');

const test_index = 'test_index';
const schema = require('../src/mapping.js');
const settings = require('../src/settings.js');

describe('suggest.js', () => {
  beforeEach(`creating ${test_index}`, async () => {
    await helper.createWithoutBulk();
    await helper.createMappingOnly();
    await helper.bulkImportOnly();
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
    await helper.deleteIndex();
  });

});
