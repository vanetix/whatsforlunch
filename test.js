var Lunch = require('./models').Lunch,
    Day = Lunch.Day,
    Entity = Lunch.Entity;

Entity.create({name: 'Taco Hello'});
Entity.create({name: 'Mexican'});
Entity.create({name: 'Random Third thing'});
Entity.create({name: 'Taco Hell'});


Day.today(function(err, day) {
  console.dir(arguments);
});
