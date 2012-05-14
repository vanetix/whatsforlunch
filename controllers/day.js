module.exports = function(app) {
  //Shorthand our model from the app instance
  var Day = app.models.Day;

  /**
   * Return our controller functions
   */
  return function() {

    this.get(/\/?(\d*)\/?/, function(id) {
      var self = this;

      if(id) {
        Day.get(id, function(err, day) {
          if(err) return self.res.json(500, { error: 'Error while fetching day' });
          return self.res.json(200, day);
        });
      }
      else {
        Day.all(function(err, days) {
          if(err) return self.res.json(500, { error: 'Error wile fetching days' });
          return self.res.json(200, days);
        });
      }
    });

  /**
   * Functions for the current poll
   */
    this.get(/\/today\/?/, function() {
      var self = this;

      Day.current(function(err, today) {
        if(err) return self.res.json(500, { error: err.message });
        return self.res.json(200, today);
      });
    });

    /**
     * Vote on a lunch
     * post data must include the id of the voted item
     * data = { id: 0, voter: "testing" } ||
     *        { name: "Testing entity", voter: "testing" }
     */
    this.put(/\/today\/?/, function() {
      var self = this,
          data = this.req.body;

      if(!data) return self.res.json(400, { error: 'Invalid update object' });

      Day.current(function(err, today) {
        if(err) return self.res.json(500, { error: err.message });

        today.vote(data, function(err, today) {
          if(err) return self.res.json(500, { error: err.message });
          return self.res.json(200, today);
        });
      });
    });

  };
};