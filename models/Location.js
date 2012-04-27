var Location,
    resourceful = require('resourceful-redis');


/**
 * `Location` model
 *
 * @attribute {String} name location name
 * @attribute {String} used starting date of the week
 * @attribute {Array} specific include this location for the day being generated
 */
Location = module.exports = resourceful.define('location', function() {
  /**
   * Engine definition
   */
  this.use('memory');

  /**
   * Properties
   */
  this.string('name', {
    required: true,
    get: function() {
      var words = this.properties.name.split();
      return words.map(function(word) {
        if(word.length < 2) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }
  }).sanitize('lower');

  this.number('used', {
    get: function() {
      if(!this.properties.used) return false;

      var weekDay = new Date().getDay(),
          lastUsed = new Date(this.properties.used),
          today = new Date(Date.now() - ((3600 * 24 * 1000) * weekDay));
      return lastUsed.toDateString() === today.toDateString();
    }
  });

  this.array('weight', {
    required: false,
    unique: true
  });

  this.timestamps();

  /**
   * Set the `used` attribute on the model
   */
  this.prototype.use = function() {
    var day = new Date().getDay();
    this.properties.used = Date.now() - ((3600 * 24 * 1000) * day);
  };

  /**
   * Add weight on a specific day for the randomization
   *
   * @param {String} day weekday that the weight should be calculated on
   */
  this.prototype.addWeight = function(day) {
    var weekday = sanitizeWeekday(day);

    if(!~this.weight.indexOf(weekday)) this.weight.push(weekday);
  };

  /**
   * Remove weight on a specific day
   *
   * @param {String} day weekday that the weight should be removed from
   */
  this.prototype.removeWeight = function(day) {
    var idx = this.weight.indexOf(sanitizeWeekday(day));
    return idx === -1 ? null : this.weight.splice(idx, 1);
  };


  /**
   * Hooks
   */

  /**
   * Validate that the `name` doesn't exist before creating
   *
   * @event {save}
   */
  this.before('save', function(instance, callback) {
    validate(instance, function(err) {
      return callback(err);
    });
  });
});

/**
 * Static function `available`
 *
 * @return {Array} array of all locations were `used` is false
 */
Location.avaliable = function(callback) {
  Location.all(function(err, locations) {
    if(err) return callback(err);
    if(locations.length < 7) return cb(new Error('not enough locations left'));

  });
};


/**
 * Helper function to validate `instance`
 *
 * @param {Object} instance current instance to validate
 * @param {Function} callback arguments `err`
 * @return {Function}
 */
function validate(instance, callback) {
  if(instance.name) {
    var name = instance.name.toLowerCase();
    Location.find({ name: name }, function(err, locations) {
      if(err) {
        return callback(err);
      }
      else if(locations && locations.length !== 0) {
        return callback(new Error('location is already present'));
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
 * Helper function to sanitize the day of the week at the model level
 *
 * @param {String} day contains the value to add to the weight array
 * @return {String}
 */
function sanitizeWeekday(day) {
  if(!day || !day.match(/sun|mon|tue|wed|thu|fri|sat/i)) {
    return '';
  }
  else {
    if(~day.indexOf('sun')) return 'sunday';
    if(~day.indexOf('mon')) return 'monday';
    if(~day.indexOf('tue')) return 'tuesday';
    if(~day.indexOf('wed')) return 'wednesday';
    if(~day.indexOf('thu')) return 'thursday';
    if(~day.indexOf('fri')) return 'friday';
    if(~day.indexOf('sat')) return 'saturday';
  }
}