module.exports = function(app) {
  //Get our model from the app instance
  var Location = app.models.Location;

  /**
   * Return our controller functions
   */
  return function() {

    /**
     * Get all locations
     */
    this.get(/\/?/, function() {
      var self = this;

      Location.all(function(err, locations) {
        if(err) return self.res.json(404, { error: err.message });

        locations = locations.map(function(location) {
          return location.toObject();
        });

        return self.res.json(200, locations);
      });
    });

    /**
     * Get available `locations`
     */
    this.get(/\/available\/?/, function() {
      var self = this;

      Location.available(function(err, locations) {
        if(err) return self.res.json(500, { error: err.message });

        locations = locations.map(function(location) {
          return location.toObject();
        });

        return self.res.json(200, locations);
      });
    });

    /**
     * Create a new location
     */
    this.post(/\/?/, function() {
      var self = this,
          data = this.req.body;

      if(data && data.name) {
        Location.create({ name: data.name }, function(err, location) {
          if(err || !location) {
            return self.res.json(500, { error: err.message });
          }

          return self.res.json(201, location);
        });
      }
      else {
        return self.res.json(400, { error: 'Invalid location object' });
      }
    });

    /**
     * Get this particular `location` by id
     */
    this.get(/\/(\d+)\/?/, function (id) {
      var self = this;

      Location.get(id, function(err, location) {
        if(err) return self.res.json(500, { error: err.message });
        if(!location) return self.res.json(404, { error: 'Not found' });
        return self.res.json(200, location.toObject());
      });
    });


    /**
     * Update the `location` weights
     */
    this.put(/\/(\d+)\/?/, function(id) {
      var i, len, weight,
          self = this,
          data = this.req.body;

      if(data && data.weight) {
        Location.get(id, function(err, location) {
          if(err) return self.res.json(500, { error: err.message });
          weight = Array.prototype.concat(data.weight);

          for(i = 0, len = weight.length; i < len; i++) {
            if(~location.weight.indexOf(weight[i])) {
              //Remove the weight
              location.removeWeight(weight[i]);
            }
            else {
              //Add the weight
              location.addWeight(weight[i]);
            }
          }
          location.save(function(err) {
            if(err) return self.res.json(500, { error: err.message });
            return self.res.json(200, location.toObject());
          });
        });
      }
      else {
        return self.res.json(400, { error: 'Invalid location object' });
      }
    });


    /**
     * Delete the `location`
     */
    this.delete(/\/(\d+)\/?/, function(id) {
      var self = this;

      Location.destroy(id, function(err) {
        if(err) return self.res.json(404, { error: err.message });
        return self.res.json(200, { status: 'ok' });
      });
    });

  };
};