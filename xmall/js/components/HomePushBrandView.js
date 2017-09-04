define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'HomePushBrandView',

    // render: function(){
    //   Listview.prototype.render.apply(this,arguments);
    //   return this;
    // },
    getCollection: function(){
      return this.collection;
    }
  });
});
