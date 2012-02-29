var Fooder = window.Fooder || (function() {
  
  var Food = Backbone.Model.extend({
    
    upvote: function() {
      var rating = this.get('rating');
      this.set({ rating: rating + 1 });
  
      this.save();
    },
    
    downvote: function() {
      var rating = this.get('rating');
      this.set({ rating: rating - 1 });
  
      this.save();
    }

  });

  var Foods = Backbone.Collection.extend({

    url: '/food/',
    model: Food,

    initialize: function() {
    },

  });

  return Fooder;
});
