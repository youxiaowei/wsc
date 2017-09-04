define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'LogiticInfoView',

    getCollection: function(){
      return this.collection;
    },
    addItem:function(item){
      ListView.prototype.addItem.apply(this,arguments);
      if(this.collection.indexOf(item) == 0){
        $(this.currentItem.find('.logidetail-address')).css({
          color: '#4da41e'
        });
        $(this.currentItem.find('.logidetail-time')).css({
          color: '#4da41e'
        });
        $(this.currentItem.find('.logitics-circle')).hide();
      }
       
      var len = (this.getCollection().length-1);
         if(this.collection.indexOf(item) == len){
          $(this.currentItem.find('.logitics-detail')).css({
            "border-bottom":"0px solid #ffffff"
        });
      }
    }


  });
});
