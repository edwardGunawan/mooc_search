/* ------------------
  Server js
  ------------------- */

let chai = require('chai');
let mocha = require('mocha');
let should = chai.should();
let expect = chai.expect;
let server = require('../server.js');
let chaiHttp = require('chai-http');
let helper = require('./helper.test.js');


chai.use(chaiHttp);

describe('server.js', () => {

  it('responds to /', async () => {
    try {
      const res = await chai.request(server).get('/');
      res.should.have.status(200);
    }catch(e) {
      should.Throw(e);
    }
  });

  describe('responds to /search', () => {
    it('should return 400 Bad Request when no query string is entered', async () => {
      try{
        const res = await chai.request(server).get('/search');
        expect(res).to.be.undefined;
      } catch(e) {
        e.should.have.status(400);
        expect(e.response.res.statusMessage).to.equal('Bad Request');
      }

    });

    it('should return 200 when query string is entered', async () => {
      try {
        const res = await chai.request(server).get('/search')
                              .query({q:'java'});
        // console.log('res',res);
        res.should.have.status(200);
        expect(res.body).to.be.a('array');
      }catch(e) {
        should.Throw(e);
      }
    });

    it('should return 400 when query string is over 60 character length', async () => {
      try {
        const res = await chai.request(server)
                              .get('/search')
                              .query({q: helper.testCharacter});
        expect(res).to.be.undefined;
      }catch (e) {
        e.should.have.status(400);
        expect(e.response.res.statusMessage).to.equal('Bad Request');
      }
    });
  });

  describe('responds to /suggest', () => {
    it('should return 500 when query string is over 60 character length', async () => {
      try {
        const res = await chai.request(server)
                              .get('/suggest')
                              .query({q: helper.testCharacter});
        expect(res).to.be.undefined;
      }catch (e) {
        e.should.have.status(400);
        expect(e.response.res.statusMessage).to.equal('Bad Request');
      }
    });

    it('should return 200 when query string less than 60', async () => {
      try {
        const res = await chai.request(server)
                              .get('/suggest')
                              .query({q: 'jva'});
        res.should.have.status(200);
        expect(res.body).to.be.a('array');
      } catch(e) {
        should.Throw(e);
      }
    });
  });
});
