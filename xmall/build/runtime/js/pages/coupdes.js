define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'coupdes',
    events:{
      'click .goback': 'onBack',
      "click .header-menu": "menuMore",
    },
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },

    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    onBack:function(){
      window.history.back();
    },
    onResume: function() {
      var CoupdesModel = require('../models/BaseModel');
      this.coupdesModel = new CoupdesModel();
      this.toggleBar && this.toggleBar('hide');
      this.coupdesModel.loadData({
        path:"/getCouponReadme",
        type:"GET",
        success:this.loadSuccess.bind(this),
        error:this.loadError.bind(this)
      });
    },
    loadSuccess:function(data){
      // this.findComponent("mycouponlistview").collection.set(data.data.balanceList);
      this.$(".main-content").html("这里是优惠券说明这里是优惠券说明这里是优惠券说明这里是优惠券说明这里是优惠券说明这里是优惠券说明");
    },
    loadError:function(){

    }
  });
});
