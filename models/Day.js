var Day,
    Location = require('./Location'),
    resourceful = require('resourceful-redis'),
    WEEKDAYS = [
      'Sunday,', 'Monday,', 'Tuesday,',
      'Wednesday,', 'Thursday,', 'Friday,', 'Saturday,' ];

/**
 * Day model needs the `app` instance for it's emitter
 *
 * TODO: remove day attribute, and use ctime instead.
 *
 * @param {Object} app application instance
 */
module.exports = function(app) {

  /**
   * `Day` model
   *
   * @attribute {String} day current date string
   * @attribute {Array} votees people who voted on the day
   * @attribute {Array} locations locations up for vote on the day
   */
  Day = resourceful.define('day', function() {
    /**
     * Engine definition
     */
    this.use('redis' ,{
      uri: 'redis://127.0.0.1:6379',
      namespace: 'days'
    });


    /**
     * Property definitions
     */
    this.string('day', {
      set: function() {
        var date = new Date();
        return date.toDateString()
                .replace(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/, WEEKDAYS[date.getDay()]);
      }
    });
    this.array('voters');
    this.array('locations');
    this.timestamps();


    /**
     * Instance methods
     */

     /**
      * add a rating to the specified location
      *
      * @param {Object} attrs holds an id or name attribute of the day
      * @param {Function} callback arguments `err, updated object`
      * @return {Function} callback
      * @api public
      */
    this.prototype.vote = function(attrs, callback) {
      if((attrs.id || attrs.name) && attrs.voter) {
        if(!~this.voters.indexOf(attrs.voter)) {
          var i,
              len = this.locations.length,
              locations = this.locations,
              voters = this.voters;

          for(i = 0; i < len; i++) {
            if((attrs.id && locations[i]._id === attrs.id) || (attrs.name &&
                  locations[i].name.toLowerCase() === attrs.name.toLowerCase())) {

              locations[i].rating += 1;
              voters.push(attrs.voter);

              return callback(null, this);
            }
          }

          return callback(new Error('location not found'));
        }
        else {
          return callback(new Error('voter has voted'));
        }
      }
      else {
        return callback(new Error('invalid vote'));
      }
    };

    /**
     * Controller helper function
     *
     * @return {Object}
     */
    this.prototype.toObject = function() {
      return {
        id: this._id,
        day: this.day,
        voters: this.voters,
        locations: this.locations,
        resource: this.resource
      };
    };

    /**
     * Hooks
     */

    /**
     * Validate that the day doesn't exist before creating
     *
     * @event {save}
     */
    this.before('save', function(instance, callback) {
      validate(instance, function(err) {
        return callback(err);
      });
    });

    /**
     * Generate the new days on `create`
     *
     * @event {create}
     */
    this.before('create', function(instance, callback) {
      generateDay(function(err, arr) {
        if(err) return callback(err);
        instance.locations = arr;
        return callback(null);
      });
    });

    /**
     * Emit model events
     */
    this.on('save', function(attrs) {
      app.emitter.emit('day:update', attrs);
    });

  });

  /**
   * Get the current day
   *
   * @param {Function} cb callback function invoked with err, day
   */
  Day.current = function(callback) {
    var today = new Date();
    today = today.toDateString()
              .replace(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/, WEEKDAYS[today.getDay()]);

    Day.find({ day: today }, function(err, current) {
      if(err) return callback(err);
      if(current && current.length) return callback(null, current[0]);

      Day.create({}, function(err, day) {
        if(err) return callback(err);
        return callback(null, day);
      });
    });
  };


  return Day;
};


/**
 * Helper function to validate `instance`
 *
 * @param {Object} instance current instance to validate
 * @param {Function} callback arguments err
 * @return {Function}
 */
function validate(instance, callback) {
  if(instance.day) {
    Day.find({ day: instance.day }, function(err, days) {
      if(err) {
        return callback(err);
      }
      else if(days && days.length !== 0 &&
        !(instance._id && instance._id === days[0]._id)) {

        return callback(new Error('day is already present'));
      }
      else {
        return callback(null);
      }
    });
  }
  else {
    return callback(null);
  }
}

/**
 * Helper function to generate an array of `Day` models
 * triggered on `create` event
 *
 * @param {Function} callback arguments `err, locations`
 * @return {Function}
 */
function generateDay(callback) {
  var top, error = null;

  Location.available(function(err, locations) {
    if(err) return callback(err);

    top = reorderWeight(locations).slice(0, 2).map(function(location) {
      //Once a location is picked for the week it's considered used
      location.use();
      location.save(function(err) {
        error = error || err;
      });

      //`Clone` the object
      return {
        id: location._id,
        name: location.name,
        rating: 0,
        resource: location.resource
      };
    });

    //Set used status
    return callback(error, top);
  });
}

/**
 * Shuffle the specified `arr` used be `reorderWeight` function
 *
 * @param {Array} arr array to shuffle
 * @return {Array}
 */
function shuffleArray(arr) {
  var shuffled = [], rand, i, len;

  for(i = 0, len = arr.length; i < len; i++) {
    rand = Math.floor(Math.random() * (i + 1));
    shuffled[i] = shuffled[rand];
    shuffled[rand] = arr[i];
  }

  return shuffled;
}

/**
 * Reorder the array depending on the `element.weight`
 * used by `generateDay` function
 *
 * @param {Array} arr array to reorder
 */
function reorderWeight(arr) {
  var i, len, swap,
      weekday = new Date().getDay();

  weekday = WEEKDAYS[weekday].replace(/,$/, '').toLowerCase();
  arr = shuffleArray(arr);

  for(i = 0, len = arr.length; i < len; i++) {
    if(arr[i].weight && arr[i].weight.length &&
        ~arr[i].weight.indexOf(weekday)) {
      swap = arr.splice(i, 1)[0];
      arr.unshift(swap);
    }
  }

  return arr;
}