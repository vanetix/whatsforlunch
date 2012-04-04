var flatiron = require('flatiron'),
    connect = require('connect'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    Publisher = require('node-redis-events').Publisher,
    controllers = require('./controllers'),
    models = require('./models'),
    app = flatiron.app;


app.config.file({ file: path.join(__dirname, 'config', 'config.json') });
app.use(flatiron.plugins.http);

//Static middleware
app.http.before = [
  connect.static(__dirname + '/public')
];


/*
 * Initialize our event emitter and bind the publish events
 * 'day:vote' and 'day:new'
 */
app.emitter = new EventEmitter();
app.publisher = new Publisher({
  hostname: '127.0.0.1',
  emitter: app.emitter,
  namespace: 'lunch'
});
app.publisher.bindEvent([ 'day:vote', 'day:new' ]);


/*
 * Place our models on the app and invoke the controllers
 */
app.models = models(app);
app.controllers = controllers(app);


//Load all controllers
app.router.path('/[Ll]unch/', app.controllers.Lunch);
app.router.path(/[Dd]ay/i, app.controllers.Day);
app.router.path(/[Ee]ntity/i, app.controllers.Entity);


//Start the app
app.start(3000);