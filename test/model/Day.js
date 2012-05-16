var should = require('should'),
    EventEmitter = require('events').EventEmitter,
    app = { emitter: new EventEmitter() },
    Day = require('../../models')(app).Day,
    redis = require('redis').createClient();


after(function(done) {
 redis.FLUSHDB();
 done();
});

describe('generic', function() {
  var day;
  before(function(done) {
    Day.create({}, function(err, today) {
      if(err) return done(err);
      day = today;
      done();
    });
  });

  it('should properly create a day object', function() {
    should.exist(day);

    day.should.have.property('locations').with.instanceof(Array);
    day.should.have.property('voters').with.instanceof(Array);
    day.should.have.property('day').and.be.a('string');
    day.locations.should.have.lengthOf(2);
  });

  it('should properly return current', function(done) {
    Day.current(function(err, day) {
      should.not.exist(err);
      should.exist(day);
      day.should.equal(day);
      done();
    });
  });
});
