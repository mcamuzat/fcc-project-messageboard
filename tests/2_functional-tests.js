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
var threadToDelete;
var threadToReport;
var replyToDelete;
chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Create', function(done) {
        chai.request(server)
         .post('/api/threads/test')
         .send({
           text: 'message', delete_password: 'delete'
         })
         .end(function(err, res){
           assert.include(res.redirects[0], "/b/test/");
          });
    
        chai.request(server)
         .post('/api/threads/test')
         .send({
           text: 'message2', delete_password: 'delete'
         })
         .end(function(err, res){
           assert.include(res.redirects[0], "/b/test/");
           done();
          });   
      });
    });
      

    
    suite('GET', function() {
      test('list', function(done) {
        chai.request(server)
          .get('/api/threads/test')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'replies');
            assert.notProperty(res.body[0], "delete_password");
            assert.notProperty(res.body[0], "reported");
            assert.isArray(res.body[0].replies);
            threadToDelete = res.body[0]._id;
            threadToReport = res.body[1]._id;
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      test('Delete with good password', function(done) {
        chai.request(server)
         .delete('/api/threads/test')
         .send({
           thread_id: threadToDelete, delete_password: 'delete'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, "success");
           done();
         });
       });

       test('Delete with a bad password', function(done) {
        chai.request(server)
         .delete('/api/threads/test')
         .send({
           thread_id: threadToReport, delete_password: 'not delete'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, "incorrect password");
           done();
         });
       });
    })

    
    suite('PUT', function() {

      test('Report a thread', done => {
        chai.request(server)
        .put('/api/threads/test')
        .send({
          report_id: threadToReport
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    

  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/test')
        .send({
          thread_id: threadToReport, 
          text:'reply', 
          delete_password:'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);

          done();
        });
      });
      
    });
    
    suite('GET', function() {
        test('list', function(done) {
        chai.request(server)
        .get('/api/replies/test')
        .query({
          thread_id: threadToReport
          })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          replyToDelete = res.body.replies[0]._id;
          done();
        });
      }); 
    });
    
    suite('PUT', function() {
        test('report a reply', done => {
        chai.request(server)
        .put('/api/replies/app')
        .send({
          thread_id: threadToReport,
          reply_id: replyToDelete
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('DELETE', function() {

    test('Delete bad password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: threadToReport,
          reply_id: replyToDelete,
          delete_password: 'not a good password'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('delete good password', function(done){
        chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: threadToReport,
          reply_id: replyToDelete,
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
  });

  })
})
