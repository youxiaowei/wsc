define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'ShopCollectorView',

    getCollection: function(){
      return this.collection;
    }
  });
});
