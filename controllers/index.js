module.exports = function(app) {

  return {
    Lunch: require('./lunch')(app),
    Entity: require('./entity')(app),
    Day: require('./day')(app)
  };

};
