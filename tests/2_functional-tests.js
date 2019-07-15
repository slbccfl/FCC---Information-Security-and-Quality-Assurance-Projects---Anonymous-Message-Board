/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  var testId1 = 'testId1'; //_id of thread 1 created
  var testId2 = 'testId2'; //_id of thread 2 created
  var testId3 = 'testId3'; //_id of reply created

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('create 2 new threads(because we end up deleting 1 in the delete test)', function(done) {
        chai.request(server)
        .post('/api/threads/fcc')
        .send({text:testId1, delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post('/api/threads/fcc')
        .send({text:testId2, delete_password:'pass'})
        .end(function(err, res){ 
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('most recent 10 threads with most recent 3 replies each', function(done) {
        chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isBelow(res.body.length, 11);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isArray(res.body[0].replies);
          assert.isBelow(res.body[0].replies.length, 4);
          testId1 = res.body[0]._id;
          testId2 = res.body[1]._id;
          done();
        });
      });
      
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
