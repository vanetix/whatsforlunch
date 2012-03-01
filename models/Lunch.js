var Lunch = exports,
    resourceful = require('resourceful-mongo');


resourceful.use('mongodb', {
  database: 'resourceful',
  collection: 'lunch',
  safe: true
});

var Entity = Lunch.Entity = resourceful.define('entity', function() {
  
  this.string('name');

  this.timestamps();
});

var Day = Lunch.Day = resourceful.define('day', function() {  

  this.string('day', {
    default: new Date().toDateString(),
    unique: true
  });

  this.array('voters');
  this.array('entities', {
    assert: function(val) { return val instanceof Object; }
  });
  
  this.timestamps();
});


/*
 * Has today already been generated?
 */
Day.__defineGetter__('isGenerated', function() {
  var today = new Date().toDateString();

  Day.find({ day: today }, function(err, day) {
    if(err || !day || !day.length) {
      return false;
    }
    else {
      return day;
    }
  });
});


/*
 * Today either fetches todays entities, or generates then fetches
 */
Day.today = function(callback) {

  var generated = Day.isGenerated;

  if(!generated) {
    var entityArr;

    Entity.all(function(err, entities) {
      if(err) {
        return callback('Error getting entities');
      }
      else if(entities.length < 3) {
        return callback('Not enough entities');
      }
      else {
        entityArr = generate(entities);
        
        for(var i in entityArr) {
          //TODO: loop through all entitys and push to day
        }
        
        Day.create({
      }
    });
  }
  else {
    console.log(generated);
    return callback(null, generated);
  }
};

function generate(entities) {
  var _i,
      _j,
      idx,
      toDay = [],
      _len = entities.length;

  for(_i = 0, _j = 2; _i < _j; _i++, _len--) {
    idx = Math.floor(Math.random() * _len);
    toDay.push(entities.splice(idx, 1).toString());
  }

  return toDay;
}
