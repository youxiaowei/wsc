define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'CouponView',

    getCollection: function(){
      return this.collection;
    },

  });
});
