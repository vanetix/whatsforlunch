var Location,
    resourceful = require('resourceful-redis');


/**
 * `Location` model
 *
 * @attribute {String} name location name
 * @attribute {Boolean} exclude exclude the day from the generation?
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
    required: true
  });
  this.bool('exclude', {
    required: true,
    default: false
  });

  this.timestamps();

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
 * Helper function to validate `instance`
 *
 * @param {Object} instance current instance to validate
 * @param {Function} callback arguments `err`
 * @return {Function}
 */
function validate(instance, callback) {
  if(instance.name) {
    Location.find({ name: instance.name }, function(err, locations) {
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