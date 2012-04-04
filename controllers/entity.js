module.exports = function(app) {
  //Get our model
  var Entity = app.models.Entity;

  /*
   * Return our controller functions
   */
  return function() {
    /*
     * Get all entities
     */
    this.get(/\/?/, function() {
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
    this.post(/\/?/, function() {
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
    this.get(/\/(\d+)\/?/, function (id) {
      var self = this;

      Entity.get(id, function(err, entity) {
        if(err || !entity) {
          return self.res.json(404, { error: 'Entity not found' });
        }
        else {
          return self.res.json(200, entity);
        }
      });
    });


    /*
     * Update the entity
     */
    this.put(/\/(\d+)\/?/, function(id) {
      var self = this,
          data = this.req.body;

      if(!data || !data.name) {
        return self.res.json(400, { error: 'Invalid entity' });
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
    this.delete(/\/(\d+)\/?/, function(id) {
      var self = this;

      Entity.destroy(id, function(err) {
        if(err) {
          return self.res.json(404, { error: 'Error retrieving entity' });
        }

        return self.res.json(200, { status: 'ok' });
      });

    });

  };
};