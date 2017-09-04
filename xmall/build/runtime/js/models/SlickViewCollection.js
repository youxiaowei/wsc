define(['./StaticCollection'], function(StaticCollection){

  return StaticCollection.extend({

    items: [
      {"src": "./images/carousel/chuangmeigongyi.jpg","linkurl":"http://ymall.yonyou.com/"},
      {"src": "./images/carousel/yonyoududu.jpg","linkurl":"http://ymall.yonyou.com/"},
      {"src": "./images/carousel/dianshang.jpg","linkurl":"http://ymall.yonyou.com/"},
      {"src": "./images/carousel/changjiewangyin.jpg","linkurl":"http://ymall.yonyou.com/"},
      {"src": "./images/carousel/chaoke.jpg","linkurl":"http://ymall.yonyou.com/"}
    ],

    initialize: function(){

      this.reset(this.items);
    },

    sync : function(){
      Backbone.trigger('sync');
      this.reset(this.models);
    }
  });
});
