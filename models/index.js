module.exports = function(app) {

  return {
    Day: require('./Lunch').Day(app),
    Entity: require('./Lunch').Entity
  };

};