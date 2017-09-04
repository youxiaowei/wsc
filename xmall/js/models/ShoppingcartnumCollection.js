define(['backbone'], function(Backbone){

  return  Backbone.Collection.extend({
    url:function(){
      return (window.app ? window.app.api :"")+"/shopingcart";
    },
  });
});
