var Lunch = exports,
    resourceful = require('resourceful-mongo');


//this.use('mongodb', {
//  database: 'resourceful',
//  collection: 'lunch',
//  safe: true
//});

var Entity = Lunch.Entity = resourceful.define('entity', function() {
  this.use('memory');
  
  this.string('name');

  this.timestamps();
});

var Day = Lunch.Day = resourceful.define('day', function() {  
  this.use('memory');

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
 * Upvote the entity with the specific id
 */
Day.prototype.incRating = function(obj, callback) {
  //TODO: Find the record and ++ the rating
};

/*
 * Downvote the entity with the specified id
 */
Day.prototype.decRating = function(obj, callback) {
  //TODO: find the record and -- the rating
};


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
 * Today either fetches the current day, or generates then fetches
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
        
        Day.create({ entities: entityArr }, function(err, day) {
          if(err) {
            return callback('Error creating new day');
          }
          else {
            return callback(null, day);
          }
        });
      }
    });
  }
  else {
    return callback(null, generated);
  }
};


function generate(entities) {
  var _i,
      _j,
      idx,
      temp,
      toDay = [],
      _len = entities.length;

  for(_i = 0, _j = 2; _i < _j; _i++, _len--) {
    idx = Math.floor(Math.random() * _len);
    
    temp = {}
    temp.id = entities[idx]._id;
    temp.name = entities[idx].name;
    temp.rating = 0;

    entities.splice(idx, 1);
    toDay.push(temp);
  }

  return toDay;
}
