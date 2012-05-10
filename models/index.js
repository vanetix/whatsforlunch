module.exports = function(app) {

  return {
    Day: require('./Day')(app),
    Location: require('./Location')
  };

};