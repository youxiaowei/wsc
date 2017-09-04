define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'HistoryView',

    getCollection: function(){
      return this.collection;
    },

  });
});
