let chai = require('chai');
let request = require('superagent');
let chaiHttp = require('chai-http');
let {client,type,setup} = require('../src/connection.js');
let should = chai.should();
let expect = chai.expect;
let elasticsearch = require('elasticsearch');
const jsonTestFile = process.env.jsonTestFile || '../../GetCourseServices/data/course_test.json';
let jsonFile = require(jsonTestFile);
let helper = require('./helper.test.js');

const test_index = 'test_index';
const schema = require('../src/mapping.js');
const settings = require('../src/settings.js');


describe('elasticsearch', () => {
  beforeEach(`re-create ${test_index}`,async () => {
    await helper.createWithoutBulk();
  });


  describe('check health status', () => {
    it('should equal yellow', (done) => {
      setup.checkConnection().then((health) => {
        // console.log('health ', health);
        health.status.should.satisfy((color) => {
          return (color === 'yellow') || (color === 'green');
        });
        done();
      }).catch(err => done(err));
    });
  });


  describe('checkIndices', () => {
    before(async () => {
      await helper.createMappingOnly();
    });

    it('should print indices health status', async () => {
      try {
        let response = await setup.checkIndices();
        should.exist(response);
      }catch(e) {
        should.Throw(e);
      }
    });

    it('should exist when there is index', async () => {
      try{
        let bool = await client.indices.exists({index:test_index});
        // console.log('bool here',bool);
        expect(bool).to.be.true;
      }catch(e) {
        should.Throw(e);
      }
    });

    it('should not exist when index is deleted', async () => {
      try{
        await client.indices.delete({index:test_index});
        let bool = await client.indices.exists({index:test_index});
        expect(bool).to.be.false;
      } catch(e) {
        should.Throw(e);
      }
    });
  });

  describe('putMapping', () => {
    it(`should insert mapping to ${test_index}`, async() => {
      try {
        let response = await setup.putMapping(test_index);
        expect(response.acknowledged).to.be.true;
      }catch (e) {
        should.Throw(e);
      }
    });
  });


  describe('resetIndex', () => {
    beforeEach(`Creating bulk import on ${test_index}`, async () => {
      await helper.createMappingOnly();
      await helper.bulkImportOnly()
    });

    it('should first exist some content in index', async () => {
      try {
        const {count} = await client.count({index:test_index,type});
        expect(count).to.equal(8);
      }catch(e) {
        should.Throw(e);
      }
    });

    it('should not contain any data in the index', async () => {
      try {
        await setup.resetIndex(test_index);
        const {count} = await client.count({index:test_index});
        expect(count).to.equal(0);
      } catch(e) {
        should.Throw(e);
      }
    });
  });


  describe('bulkImport', () => {
    beforeEach(`creating mapping for ${test_index} before bulkImport`, async () => {
      await helper.createMappingOnly();
    });

    it(`should bulk import test_json file to ${test_index}`, async () => {
      try {
        await setup.bulkImport(jsonFile,test_index);
        const {count} = await client.count({index:test_index,type});
        expect(count).to.equal(8);
      } catch(e) {
        should.Throw(e);
      }
    });
  });





  after(`deleting ${test_index}`,async () => {
    await helper.deleteIndex();
  });
});
