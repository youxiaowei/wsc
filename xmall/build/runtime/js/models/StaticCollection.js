define(['backbone'], function(Backbone){

  return Backbone.Collection.extend({

    // stop it from making request，overridden for custom behavior.
    sync: function() {
      this.reset(this.models);
    },

    hasNextPage: function(){
      return false;
    },
  });
});
