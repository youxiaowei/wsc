define(['./PageView','require'], function(PageView,require) {

  return PageView.extend({

    events: {
      "click .header-icon-back": "goback",
      "click .address-select-li": "cellClickChange",
      "click .address-actionBtn":"addressManageClick"
    },

    notifyEdit: null,
    _this: null,
    isDefault:null,
    defaultTarget:null,
    defaultCurrentTarget:null,
    addressCollection:null,
    onRender:function(){
      this.$el.css("background-color","whitesmoke");
      this.initData();
    },

    initData: function(){
      var userInfo = window.application.getUserInfo();
      if(!userInfo){
        library.Toast("您尚未登录");
        window.history.back();
        return;
      }
      this.addressCollection = this.findComponent('AddressListView').collection;
      var options = {
        path:'/my-address/list',
        needReset:true,
        showLoading:true,
        type: 'POST',
        data:{userId:userInfo.userid,index:1,size:10}
      }
      this.addressCollection.loadData(options);
    },


    cellClickChange:function(e){
      window.app.param1 = this.findComponent('AddressListView').collection.models[$(e.currentTarget).index()];
      window.history.back();
    },
    addressManageClick:function(e){
      Backbone.history.navigate('#home-navigate/my-address', {
        trigger: true
      });
    },
    goback: function(e) {
      window.history.back();
    },
    onResume: function(){
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
    }
  });
});
