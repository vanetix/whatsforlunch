module.exports = function(app) {
  //Get our model
  var Day = app.models.Day;

  /*
   * Return the routing functions
   */
  return function() {
    /*
     * Lunch index route
     */
    this.get(/\/?/, function() {
      var self = this;

      Day.today(function(err, today) {
        if(err) {
          return self.res.json(500, { error: err });
        }

        return self.res.json(200, today);
      });
    });


    /*
     * Vote on a lunch
     * post data must include the id of the voted item
     * data = { id: 0, voter: "testing" } ||
     *        { name: "Testing entity", voter: "testing" }
     */
    this.put(/vote\/?/, function() {
      var self = this,
          data = this.req.body;

      if(!data) {
        return self.res.json(400, { error: 'Invalid update object' });
      }

      Day.today(function(err, today) {
        if(err) {
          return self.res.json(500, { error: err });
        }

        today.incRating(data, function(err, today) {
          if(err) {
            return self.res.json(500, { error: err });
          }

          return self.res.json(200, today);
        });
      });
    });
  };
};
