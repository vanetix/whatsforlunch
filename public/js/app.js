var Fooder = window.Fooder || (function() {

  //Save the this value(window)
  var root = this;

  /*
   * Today model, basically just used to fetch today...
   * Model polls in order to refresh any votes
   */
  var Today = function() {
    this.url = '/lunch';
    this.poll();

    //Get the initial attributes
    this.attributes = {};
    var self = this;
    $.getJSON(self.url, function(data) {
      self.set(data);
    });

    return this;
  };
  /*
   * Extend backbone events, so I can bind in the view
   */
  _.extend(Today.prototype, Backbone.Events);

  /*
   * Helper for setting the attributes of the model
   */
  Today.prototype.set = function(attrs) {
    if(_.isEqual(attrs, this.attributes)) {
      this.trigger('sync');
    }
    else {
      this.attributes = attrs;
      this.trigger('change');
    }
  };

  /*
   * Set up the polling on the resource
   * Polls the server every 10 seconds
   */
  Today.prototype.poll = function() {
    var self = this;

    setTimeout(function() {
      $.ajax({
        url: self.url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          self.set(data);
          self.poll();
        }
      });
    }, 10000);
  };

  /*
   * Vote action on the `pseudo` model
   */
  Today.prototype.vote = function(id) {
    var self = this;

    $.ajax({
      url: self.url + '/vote',
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ id: id, voter: 'testing' }),
      success: function(data) {
        self.set(data);
      }
    });
  };


  /*
   * Today View, just a view that shows the top rated location
   */
  var TodayView = Backbone.View.extend({

    //View element is a ol
    tagName: 'ol',
    className: 'today',

    events: {
      "click .vote": "vote"
    },

    initialize: function() {
      this.model.on('change', this.render, this);
    },

    render: function() {
      var self = this,
          entities = this.model.attributes.entities;

      /* Clear the current el */
      this.$el.empty();

      /* Sort and render each */
      _.chain(entities)
        .sortBy(function(thing) {
          return -thing.rating;
        }).each(function(thing) {
          self.renderRankedItem(thing);
        });


      return this;
    },

    renderRankedItem: function(item) {
      this.$el.append(Mustache.to_html(Templates.RankedItem, item));
    },

    vote: function(element) {
      element.preventDefault();

      var id = $(element).data('id');

      this.model.vote(id);
    }

  });

  /*
   * Day model, just used to fetch days to display
   */
  var Day = Backbone.Model.extend({});

  var Days = Backbone.Collection.extend({
    url: '/days',
    model: Day
  });

  /*
   * Day view
   */
  var DayView = Backbone.View.extend({
    tagName: 'div',
    className: 'days',

    initialize: function() {
      this.collection = this.options.collection;
    }

  });


  /*
   * Entities (Locations)
   */

  var Location = Backbone.Model.extend({});

  var Locations = Backbone.Collection.extend({});

  var LocationView = Backbone.View.extend({
    tagName: 'div',
    className: 'locations',

    events: {
      'submit .create': 'createLocation',
      'click .remove': 'removeLocation'
    },

    initialize: function() {
      this.collection.on('add remove reset sync', this.render);
    },

    render: function() {

    },

    createLocation: function(element) {

    },

    removeLocation: function(element) {
      element.preventDefault();

      var id = $(element).data('id');

      if(this.collection.get(id)) {
        this.collection.get(id).destroy();
      }
    }

  });


  /*
   * Fooder router
   */
  var Fooder = Backbone.Router.extend({
    routes: {
      "": "index",
      "/current": "current",
      "/days": "days",
      "/entities": "entities"
    },

    initialize: function() {
      //keep track of the current view
      this.currentView = null;


      //Attach collections
      this.today = new Today();
      this.days = new Days();
      this.locations = new Locations();
    },

    index: function() {
      //Don't navigate to today, just make the view
      this.current();
    },

    current: function() {
      var view = new TodayView({ model: this.today });

      this.renderView(view);
    },

    days: function() {
      console.log('days');
    },

    entities: function() {
      console.log('entities');
    },

    /*
     * Helper function to remove the current view and render the new
     * one.
     */
    renderView: function(view) {
      if(this.currentView) {
        this.currentView.remove();
      }

      this.currentView = view;
      $('#view').html(this.currentView.render().el);
    }

  });


  return Fooder;
}).call(this);