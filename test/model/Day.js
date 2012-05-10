var should = require('should'),
    EventEmitter = require('events').EventEmitter,
    app = { emitter: new EventEmitter() },
    Day = require('../../models')(app).Day;


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
    day.should.have.property('votees').with.instanceof(Array);
    day.should.have.property('day');
    day.locations.should.have.lengthOf(2);

    console.log(day);
  });
});
