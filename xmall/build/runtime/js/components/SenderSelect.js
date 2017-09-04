define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'SenderSelect',

    getCollection: function(){
      return this.collection;
    },

  });
});
