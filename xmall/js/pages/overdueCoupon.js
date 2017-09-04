define(['./PageView','require'], function(PageView,require) {
  return PageView.extend({
    events: {
      'click .icomoon-back': 'onBack',
      "click .icomoon-moremore": "menuMore",
      'click .sender-selector': 'toSender',
      "click .clear-button": "clear"

    },
    initialize: function() {
      this.listenTo(this.findComponent('PopupMenu'), "toSearch", this.toSearch.bind(this));

    },
    toSearch: function(e) {
      this.findComponent("SearchMidPageView").show();
    },
    menuMore: function(e) {
      this.findComponent("PopupMenu").show();
    },
    clear: function() {
      var _this =this;
      library.MessageBox("温馨提示", "确定清除所有吗？", [{
        leftText: "确定",
        callback: function() {
          _this.clearAll();
        }.bind(this)
      }, {
        rightText: "取消",
        callback: function() {}
      }]);

    },
    clearAll:function(){
      var clearModel = require('../models/BaseModel');
      this._clearModel = new clearModel();
      this._clearModel.loadData({
        path:"/clearCoupon",
        data:{
          userId:application.getUserInfo().userid
        },
        type:"POST",
        success:this.clearSuccess.bind(this),
        error:this.clearError.bind(this)
      });
    },
    clearSuccess:function(){
        this.findComponent("OverdueCouponView").collection.set([]);
    },
    clearError:function(){

    },
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onBack: function() {
      window.history.back();
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.$(".bar").show();
      this.findComponent("OverdueCouponView").collection.loadData({
        path:"/getCouponList",
        type:"POST",
        needReset:false,
        data: {
          userId: application.getUserInfo().userid,
          type:"3",
          index:1,
          size:100
        },
        success:this.loadSuccess.bind(this),
        error:this.loadError.bind(this)
      });
    },
    loadSuccess:function(data){
      this.findComponent("OverdueCouponView").collection.set(data.data.couponList);
    },
    loadError:function(){

    }
  });
});
