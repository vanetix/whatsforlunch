var Day = require('../models').Lunch.Day,
    Entity = require('../models').Lunch.Entity;

module.exports = function() {

  /* ---------------- All entity routes -------------------------- */
  /*                   
   * Get all entities
   */
  this.get(/[Ee]ntity\/?/, function() {
    var self = this;

    Entity.all(function(err, entities) {
      if(err || !entities) {
        return self.res.json(404, { error: 'Resources not found' });
      }
      else {
        return self.res.json(200, entities);
      }
    });
  });


  /*
   * Create a new entity
   * TODO: name should be unique
   */
  this.post(/[Ee]ntity\/?/, function() {
    var self = this,
        data = this.req.body;

    if(data && data.name) {
      Entity.create({ name: data.name }, function(err, entity) {
        if(err || !entity) {
          return self.res.json(500, { error: 'Unable to create entity' });
        }
        
        return self.res.json(201, entity);
      });
    }
    else {
      return self.res.json(400, { error: 'Invalid entity object' });
    }
  });


  /*
   * Get this particular entity
   */
  this.get(/[Ee]ntity\/(\d+)\/?/, function (id) {
    var self = this;

    Entity.get(id, function(err, entity) {
      if(err || !food) {
        return self.res.json(404, { error: 'Entity not found' });
      }
      else {
        return self.res.json(200, entity);
      }
    });
  });


  /*
   * Update the food
   */
  this.put(/[Ee]ntity\/(\d+)\/?/, function(id) {
    var self = this,
        data = this.req.body;

    if(!data || !data.name) {
      return self.res.json(400, { error: 'Invalid food' });
    }

    /* Currently resource.update doesn't catch an error that is throw if the
     * resource doesn't exist before the update, this is nasty, but frankly
     * keeps the code cleaner than an async lookup
     */
    try {
      Entity.update(id, { name: data.name }, function(err, entity) {
        if(err || !entity) {
          return self.res.json(500, { error: 'Error updating entity' });
        }

        return self.res.json(200, entity);
      });
    } catch(Error) {
      return self.res.json(404, { error: 'Entity not found' });
    }
  });


  /*
   * Delete the food
   */
  this.delete(/[Ee]ntity\/(\d+)\/?/, function(id) {
    var self = this;

    Entity.destroy(id, function(err, entity) {

      console.dir(arguments);

      if(err || !entity) {
        return self.res.json(404, { error: 'Error retrieving entity' });
      }
      
    });

  });

  
  /* ------------- Day specific routes ------------------- */
  this.get(/[Dd]ay\/?(\d*)\/?/, function(id) {
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
  

  /*
   * ---------------------- All Day methods -----------------------
   * votee = this.req.response.connection.address().address;
   */
  /* 
   * Lunch index route
   */
  this.get('', function() {
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
   */
  this.put(/vote\/?/, function() {
    var self = this,
        data = this.req.body;

    if(!data) {
      return self.res.json(400, { error: 'Invalid update object' });
    }

    console.dir(data);

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
