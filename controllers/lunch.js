var Food = require('../models').Food;

//TODO: Nest the routes

module.exports = function() {

  /*                   
   * Get all foods
   */
  this.get(/\/?/, function() {
    var self = this;

    Food.all(function(err, foods) {
      if(err || !foods) {
        self.res.json(404, { Error: 'Resources not found' });
      }
      else {
        self.res.json(200, foods);
      }
    });
  });


  /*
   * Create a new food
   */
  this.post(/\/?/, function() {
    var self = this,
        data = this.req.body;

    if(!data || !data.name) {
      return self.req.json(400, { Error: 'Invalid food' });
    }
    
    Food.find({ name: data.name }, function(err, food) {

      if(err) return self.res.json(500, { Error: 'Problem finding duplicate' });
      if(food.length) return self.res.json(400, { Error: 'Duplicate food exists' });

      Food.create({ name: data.name, rating: 0 }, function(err, food) {
        if(err) {
          return self.res.json(500, { Error: 'Problem creating food' });
        }
        else {
          return self.res.json(201, food);
        }
      }); 
    });

  });


  /*
   * Get this particular food
   */
  this.get(/\/(\d+)/, function (id) {
    var self = this;

    Food.get(id, function(err, food) {
      if(err || !food) {
        self.res.json(404, { Error: 'Resource not found' });
      }
      else {
        self.res.json(200, food);
      }
    });
  });


  /*
   * Update the food
   */
  this.put(/\/(\d+)/, function(id) {
    var self = this,
        data = this.req.body,
        votee = this.req.response.connection.address().address;

    if(!data || !id) {
      return self.res.json(400, { Error: 'Invalid food' });
    }

    Food.get(id, function(err, food) {
      if(err || !food) {
        return self.res.json(404, { Error: 'Food not found' });
      }

      var dup = food.voters.some(function(voter) {
        return voter === votee;
      });

      if(!dup) {
        food.voters.push(votee);
        
        food.rating = data.rating;
        
        food.save(function(err) {
          if(err) {
            console.log(err);
            return self.res.json(500, { Error: 'Problem updating food' });
          }
          return self.res.json(200, food);
        });
      }
      else {
        self.res.json(400, { Error: 'You already voted on this item' });
      }
    });
  });


  /*
   * Delete the food
   */
  this.delete(/\/(d+)/, function(id) {
    var self = this;

    if(!id) {
      return self.res.json(404, { Error: 'Invalid food' });
    }
    else {
      Food.get(id, function(err, food) {
        if(err || !food) {
          return self.res.json(404, { Error: 'Food not found' });
        }
        else {
          food.destroy(function(err) {
            if(err) return self.res.json(500, { Error: 'Unable to delete food' });
            return self.res.json(200, { Status: 'ok' });
          });
       }
      });
    }
  });

};
