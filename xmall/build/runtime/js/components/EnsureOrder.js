// 确认订单
// author Vicent
define(['./BaseView'], function(BaseView){
  return BaseView.extend({

    events: {
      'click .ensure-order-back': 'goback',
      'click .order-comment': 'addComment'
    },

    initialize: function(){

    },
    render: function(){
      this.$el.empty();
      var template = library.getTemplate("ensure-order.html");
      this.$el.append(template);
      return this;
    },

    orderInfo:null,
    callback:null,

    setData: function(orderInfo,callback){
      this.orderInfo = orderInfo;
      this.$("#order_product_pic").attr('src',orderInfo.imgurl);
      this.callback = callback;
    },

    addComment: function(){
      //TODO 添加评价
      this.goback();
    },

    goback: function(e){
      this.remove();
      this.callback && this.callback();
    },
    remove: function(){
      Backbone.View.prototype.remove.apply(this, arguments);
    }

  });
});
