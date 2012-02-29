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
app.router.path('/food', controllers.Food);


app.start(3000);
