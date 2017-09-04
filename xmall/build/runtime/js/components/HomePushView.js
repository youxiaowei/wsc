define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'HomePushShopView',
    getCollection: function(){
      return this.collection;
    },

  });
});
