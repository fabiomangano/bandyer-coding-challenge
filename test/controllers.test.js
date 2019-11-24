require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const Instant = require('../src/models/instant');
const mongoose = require('mongoose');
const app = require('../src/server');

chai.should();
chai.use(chaiHttp);

describe('Instant API', function() {
  beforeEach(function(done) {
    Instant.deleteMany({}, (err) => {
      if (err) console.log(err);
      done();
    });
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  describe('GET all instants', function() {
    it('should correctly respond with an empty array', function(done) {
      chai.request(app)
        .get('/api/v1/instants')
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('POST instant', function() {
    it('it should not POST an instant without file', function(done) {
      const newInstant = {
        name: 'Amazing image title',
        createdBy: 'Fabio',
      };
      chai.request(app)
        .post('/api/v1/instants')
        .send(newInstant)
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('GET single instant', function() {
    it('should correctly respond', async function() {

      let savedInstant;

      const newInstant = new Instant({
        status: 'Done',
        uploaded: 'http:/localhost:3000/photos-original/photo-1574427664032.jpg',
        name: 'Amazing image title',
        createdBy: 'Fabio',
        weight: 73159,
        height: 140,
        width: 140,
      });

      savedInstant = await newInstant.save();

      chai.request(app)
        .get(`/api/v1/instants/${savedInstant._id}`)
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
        });
    });
  });
});
