define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'AddressListView',

    // render: function(){
    //   Listview.prototype.render.apply(this,arguments);
    //   return this;
    // },
    getCollection: function(){
      return this.collection;
    },
    addItem:function(item){
        ListView.prototype.addItem.apply(this,arguments);
        if(this.collection.indexOf(item) == this.collection.length-1){
            this.itemRenderFinished && this.itemRenderFinished();
        }
    }
  });
});
