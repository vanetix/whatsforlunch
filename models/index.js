module.exports = function(app) {

  return {
    Day: require('./Day')(app),
    Entity: require('./Location')
  };

};