define(['./PageView'], function(PageView){
    return PageView.extend({
    events:{
      'click .header-icon-back': 'onBack',
      "click .icomoon-moremore":"menuMore",
      "click .meset-toggle":"isReceiveMessage",
      "click #msset-hytz":"hytzClick",
      "click #msset-cxtz":"cxtzClick",
      "click #msset-spdd":"spddClick",
      "click #msset-wltz":"wlClick",
    },
    //

    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    hytzClick:function(e){
      //会员通知
      //data-check='true'
      var target = e.target;
      if(!target.getAttribute("data-check")){
        target = target.parentNode;
        if(!target.getAttribute("data-check")){
          return;
        }
      }
      if(target.classList.contains("meset-item-checked")){
        target.classList.remove("meset-item-checked")
      }else{
        target.classList.add("meset-item-checked")
      }
    },cxtzClick:function(e){
      //促销通知
      var target = e.target;
      if(!target.getAttribute("data-check")){
        target = target.parentNode;
        if(!target.getAttribute("data-check")){
          return;
        }
      }
      if(target.classList.contains("meset-item-checked")){
        target.classList.remove("meset-item-checked")
      }else{
        target.classList.add("meset-item-checked")
      }
    },spddClick:function(e){
      // 商品订单通知
      var target = e.target;
      if(!target.getAttribute("data-check")){
        target = target.parentNode;
        if(!target.getAttribute("data-check")){
          return;
        }
      }
      if(target.classList.contains("meset-item-checked")){
        target.classList.remove("meset-item-checked")
      }else{
        target.classList.add("meset-item-checked")
      }
    },wlClick:function(e){
      //物流通知
      var target = e.target;
      if(!target.getAttribute("data-check")){
        target = target.parentNode;
        if(!target.getAttribute("data-check")){
          return;
        }
      }
      if(target.classList.contains("meset-item-checked")){
        target.classList.remove("meset-item-checked")
      }else{
        target.classList.add("meset-item-checked")
      }
    },
    isReceiveMessage:function(e){
      if(e.target.classList.contains("meset-toggle-selected")){
        e.target.classList.remove("meset-toggle-selected");
        $('.meset-item-type').hide();
      }else{
        e.target.classList.add("meset-toggle-selected");
        $('.meset-item-type').show();
      }
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onBack:function(){
      window.history.back();
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
    },
  });
});
