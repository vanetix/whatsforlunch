module.exports = function(app) {

  return {
    Location: require('./location')(app),
    Day: require('./day')(app)
  };

};
