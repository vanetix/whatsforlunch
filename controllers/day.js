module.exports = function(app) {
  //Get our model
  var Day = app.models.Day;

  /*
   * Return our controller functions
   */
  return function() {

    this.get(/\/?(\d*)\/?/, function(id) {
      var self = this;

      if(id) {
        Day.get(id, function(err, day) {
          if(err) {
            return self.res.json(500, { error: 'Error while fetching day' });
          }

          return self.res.json(200, day);
        });
      }
      else {
        Day.all(function(err, days) {
          if(err) {
            return self.res.json(500, { error: 'Error wile fetching days' });
          }

          return self.res.json(200, days);
        });
      }
    });

  };
};