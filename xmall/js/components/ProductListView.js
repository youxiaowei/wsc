define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'ProductListView',

    getCollection: function(){
      return this.collection;
    },

    initData: function(paramInfo){
      if(!paramInfo || !paramInfo.detailInfo){
        this.$el.empty();
        return;
      }
      this.collection.reset(paramInfo.detailInfo);
    },
  });
});
