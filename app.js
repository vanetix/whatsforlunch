var flatiron = require('flatiron'),
    connect = require('connect'),
    path = require('path'),
    controllers = require('./controllers'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

app.http.before = [
  connect.static(__dirname + '/public')
];


//Load all controllers
app.router.path('/[Ll]unch/', controllers.Lunch);
app.router.path(/[Dd]ay/i, controllers.Day);
app.router.path(/[Ee]ntity/i, controllers.Entity);


//Start the app
app.start(3000);