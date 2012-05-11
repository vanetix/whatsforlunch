var should = require('should'),
    Location = require('../../models')({}).Location;


describe('generic', function() {
  it('should create a new location', function(done) {
    Location.create({ name: 'Wallys' }, function(err, location) {
      should.not.exist(err);
      should.exist(location);
      location.should.be.a('object');
      location.should.have.property('name', 'Wallys');
      location.should.have.property('weight').with.lengthOf(0);
      location.should.have.property('used');
      done();
    });
  });

  it('should not allow duplicate names', function(done) {
    Location.create({ name: 'Another Location' }, function(err, location) {
      should.not.exist(err);
      should.exist(location);

      Location.create({ name: 'Another Location' }, function(err, location) {
        should.exist(err);
        err.should.be.instanceof(Error);
        done();
      });
    });
  });
});

describe('attributes', function() {
  before(function(done) {
    Location.create({ name: 'Example' }, function(err, location) {
      if(err) return done(err);
      return done();
    });
  });

  describe('should properly manipulate weight', function() {
    var id;

    before(function(done) {
      Location.find({ name: 'example' }, function(err, location) {
        id = location[0].id;
        done();
      });
    });

    it('add weight with no duplicates', function(done) {
      Location.get(id, function(err, location) {
        should.exist(location);
        location.addWeight('sundizay');
        location.addWeight('sun');
        location.weight.should.have.lengthOf(1);
        location.weight.should.include('sunday');
        done();
      });
    });

    it('remove weight', function(done) {
      Location.get(id, function(err, location) {
        should.exist(location);
        location.addWeight('monday');
        location.weight.should.include('monday');
        location.removeWeight('mon');
        location.weight.should.not.include('monday');
        done();
      });
    });
  });

  it('used should be undefined', function(done) {
    Location.find({ name: 'example' }, function(err, location) {
      should.not.exist(err);
      should.exist(location);
      location.should.have.lengthOf(1);
      location[0].should.have.property('used', undefined);
      done();
    });
  });
});

describe('used', function() {
  it('should set used properly', function(done) {
    Location.create({ name: 'Test Location' }, function(err, location) {
      should.exist(location);
      location.use();
      location.used.should.equal(true);
      done();
    });
  });

  it('return locations .available', function(done) {
    Location.available(function(err, locations) {
      should.not.exist(err);
      should.exist(locations);
      locations.forEach(function(location) {
        location.should.have.property('used', false);
      });
      done();
    });
  });
});