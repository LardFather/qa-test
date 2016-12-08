var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    assert       = require('assert'),
    fs           = require('fs'),
    server;

describe('restful-booker-platform - POST /auth - Form', function(){

  beforeEach(function(){
    process.env['payload'] = 'form';
    delete require.cache[require.resolve('../app')];
    server = require('../app');
  })

  it('responds with a 200 when feature switching to application/x-www-form-urlencoded feature', function(done){
      request(server)
        .post('/auth')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('username=admin&password=password')
        .expect(200)
        .end(done);
  });

  it('responds with a 200 when checking to see if a token is valid when switching to application/x-www-form-urlencoded', function(done){
    request(server)
      .post('/auth')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=admin&password=password')
      .then(function(res){
          request(server)
            .post('/validate')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send("token=" + res.text)
            .expect(200, done)
      });
  });

  it('respond with a 200 and the token is removed when calling logout when switching to application/x-www-form-urlencoded', function(done){
    var tokenToUse;

    request(server)
      .post('/auth')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=admin&password=password')
      .then(function(res){
          return tokenToUse = res.text;
      })
      .then(function(){
        return request(server)
          .post('/logout')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send("token=" + tokenToUse)
          .expect(200)
      })
      .then(function(){
        request(server)
          .post('/validate')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send("token=" + tokenToUse)
          .expect(403)
          .end(done)
      });
  });

});
