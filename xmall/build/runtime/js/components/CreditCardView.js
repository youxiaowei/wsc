define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'CreditCardView',

    getCollection: function(){
      return this.collection;
    },

  });
});
