define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'HomeTopicView',

    // render: function(){
    //   Listview.prototype.render.apply(this,arguments);
    //   return this;
    // },
    getCollection: function(){
      return this.collection;
    }
  });
});
