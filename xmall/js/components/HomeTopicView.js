define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'HomeTopicView',
     //render: function(){
     //  ListView.prototype.render.apply(this,arguments);
     //  return this;
     //},
    getCollection: function(){
      return this.collection;
    },
    index:0,
    getNextPage:function(){
      var c=this.getCollection();
      if(this.index==0){
        c.url=window.app.api+"/activities1";
        this.index=1;
      }else{
        c.url=window.app.api+"/ymall/activities";
        this.index=0;
      }
      c.reset(null);
      //this.trigger("reset");
      c.fetch();
    }

  });
});
