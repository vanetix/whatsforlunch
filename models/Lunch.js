var Lunch = exports,
    resourceful = require('resourceful-mongo');


var Entity = Lunch.Entity = resourceful.define('entity', function() {
  this.use('memory');
//  this.use('mongodb', {
//    database: 'whatsforlunch',
//    collection: 'entity',
//    safe: true
//  });
  
  this.string('name', {
    unique: true,
    required: true
  });

  this.timestamps();
});

var Day = Lunch.Day = resourceful.define('day', function() {  
  this.use('memory');
//  this.use('mongodb' {
//    database: 'whatsforlunch',
//    collection: 'lunch',
//    safe: true
//  });

  this.string('day', {
    default: new Date().toDateString(),
    unique: true
  });

  this.array('votees');
  this.array('entities', {
    assert: function(val) { return val instanceof Object; }
  });
  
  this.timestamps();
});


/*
 * Upvote the entity with the specific id or name
 * Obj = { id, name, voter }
 */
Day.prototype.incRating = function(obj, callback) {
  
  if((obj.id || obj.name) && obj.voter) {
    var _i,
        _len = this.entities.length;

    //Return if the obj.voter is already in votees
    if(~this.votees.indexOf(obj.voter)) {
      return callback('Votee has already voted');
    }

    if(obj.id) {
      //Increment elements based of id
      for(_i = 0; _i < _len; _i++) {
        if(this.entities[_i].id == obj.id) {
          this.entities[_i].rating++;
          this.votees.push(obj.voter);
          return callback(null, this);
        }
      }

      return callback('Id not found');
    }
    else {
      //Increment element based off name
      for(_i = 0; _i < _len; _i++) {
        if(this.entities[_i].name == obj.name) {
          this.entities[_i].rating++;
          this.votees.push(obj.voter);
          return callback(null, this);
        }
      }
      
      return callback('Name not found'); 
    }
  }
  else {
    return callback('Invalid object passed');
  }
};

/*
 * Downvote the entity with the specified id
 * obj = { id, name, voter }
 */
Day.prototype.decRating = function(obj, callback) {

  if((obj.id || obj.name) && obj.voter) {
    var _i,
        _len = this.entities.length;

    //Return if the obj.voter is already in votees
    if(~this.votees.indexOf(obj.voter)) {
      return callback('Votee has already voted');
    }
    
    if(obj.id) {
      //Increment elements based of id
      for(_i = 0; _i < _len; _i++) {
        if(this.entities[_i].id == obj.id) {
          this.entities[_i].rating--;
          this.votees.push(obj.voter);
          return callback(null, this);
        }
      }
      
      return callback('Id not found');
    }
    else {
      //Increment element based off name
      for(_i = 0; _i < _len; _i++) {
        if(this.entities[_i].name == obj.name) {
          this.entities[_i].rating--;
          this.votees.push(obj.voter);
          return callback(null, this);
        }
      }
      
      return callback('Name not found'); 
    }
  }
  else {
    return callback('Invalid object passed');
  }  
};


/*
 * Has today already been generated?
 */
Day.isGenerated = function(callback) {
  var today = new Date().toDateString();

  Day.find({ day: today }, function(err, day) {
    if(err || !day || !day.length) {
      return callback(err, false);
    }
    else {
      return callback(null, day[0]);
    }
  });
};


/*
 * Today either fetches the current day, or generates then fetches
 */
Day.today = function(callback) {

  Day.isGenerated(function(err, generated) {

    if(err) {
      return callback(err);
    }

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
      //Invoke callback with any err and generated
      return callback(err, generated);
    }
  });
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
