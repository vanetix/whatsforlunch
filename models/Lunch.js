var resourceful = require('resourceful');


var Day = exports.Day = resourceful.define('day', function() {  
  this.use('memory');

  this.object('day', {
    default: new Date().toDateString(),
    format: 'date',
    unique: true
  });

  this.array('voters');
  
  this.timestamps();
});


var Entity = exports.Entity = resourceful.define('entity', function() {
  this.use('memory');

  this.parent('Day');

  this.string('name', {
    required: true
  });
  
  this.number('rating', {
    default: 0
  });

  this.timestamps();
});


/*
 * Static functions on resources
 */
Day.generate = function(possibilities, callback) {
  if(possibilities instanceof Array) {
    var _i,
        _j,
        idx,
        entities = [],
        _len = possibilities.length;

    for(_i = 0, _j = 3; _i < _j; _i++, _len--) {
      idx = Math.floor(Math.random() * _len);
      console.log(idx);
      entities.push(possibilities.splice(idx, 1).toString());
    }

    console.log(entities);
  }
  else {
    throw new Error('Possibilities must be an array');
  }
};
