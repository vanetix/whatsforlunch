var resourceful = require('resourceful');


var Food = resourceful.define('food', function() {
  this.use('memory');
  
  this.string('name', { required: true });
  this.number('rating', { required: true });
  this.array('voters');

  this.timestamps();
});

exports.Food = Food;
