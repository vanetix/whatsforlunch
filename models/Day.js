var Location = require('./Location'),
    resourceful = require('resourceful-redis');

/**
 * Day model needs the `app` instance for it's emitter
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
  var Day = resourceful.define('day', function() {
    /**
     * Engine definition
     */
    this.use('memory');


    /**
     * Property definitions
     */
    this.string('day', {
      set: function() {
        var date = new Date(),
            DAYS = [
              'Sunday', 'Monday', 'Tuesday',
              'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ];

        return date.toDateString()
                    .replace(
                      /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/,
                      DAYS[date.getDay()]);
      }
    });
    this.array('votees');
    this.array('locations', {
      set: function(val) {
        generateDay(function(err, day) {
          val = err || day;
        });
      }
    });
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
            if(locations[i].id === attrs.id ||
                  locations[i].name === attrs.name) {

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
     * Emit model events
     *
     * @event {update}
     */
    this.on('update', function(attrs) {
      app.emitter.emit('day:update', attrs);
    });

  });


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
      else if(days && days.length !== 0) {
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
 *
 * @param {Function} callback arguments `err, locations`
 * @return {Function}
 */
function generateDay(callback) {
  var i, j, idx, temp, newLocations, len;

  Location.all(function(err, locations) {
    if(err) return callback(err);
    if(locations.length <= 8) return callback(new Error('too few locations'));

    for(i = 0; i < len; len--) {
      idx = Math.floor(Math.random() * len);

      temp = {
        id: locations[idx]._id,
        name: locations[idx].name,
        rating: 0
      };

      locations.slice(idx, 1);
      newLocations.push(temp);
    }

    return callback(err, locations);
  });
}