define(['./PageView', 'require'], function(PageView,require){
    return PageView.extend({
    events:{
      'click .icomoon-back': 'onBack',
      "click .icomoon-moremore":"menuMore",
      "click .mc-setting":"goSetting",
      "click .mc-clear": "clear",
      "click .mc-row": "itemClick"
    },
    listView: null,
    clearModel:null,
    initialize: function(){
       this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
       this.listView = this.findComponent("mc-list");
    },
    clear: function(){
      var _this = this;
      if(this.$el.find('.mc-row').length==0){
          library.Toast("没有消息可删除！");
          return;
      }
      if(!this.clearModel){
        var ClearModel = require('../models/BaseModel');
        this.clearModel = new ClearModel();
      }
       var userInfo = window.application.getUserInfo();
      library.MessageBox("提示信息","确认清空所有消息吗？",[{
        leftText:"确定",callback:function(){
              // $('.mc-row').remove();
              _this.clearModel.loadData({
                path:"/clearMessage",
                type:"POST",
                needReset:false,
                data: {
                  userId: userInfo.userid,//暂时默认这个号码
                },
                success:_this.clearSuccess.bind(_this),
                error:_this.clearError.bind(_this)
              });

        }},{rightText:"取消",callback:function(){}}]);
    },
    clearSuccess:function(){
      $('.mc-row').remove();
      library.Toast("成功清空所有消息！");
    },
    clearError:function() {

    },
    goSetting:function(){
      var url = "#my-navigate/usersetting";
      Backbone.history.navigate(url, {
          trigger: true
      });
    },
    onListViewRowClick:function(para){

    },
    itemClick: function(e){
      var index = $(e.currentTarget).index();
      var item = this.listView.collection.models[index];
      window.app.msgData = item;
      Backbone.history.navigate("#my-navigate/message-detail",{
        trigger:true
      });
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
      // this.$('.bar').show();
      var userInfo = window.application.getUserInfo();

        this.findComponent("mc-list").collection.loadData({
        path:"/getMessageList",
        type:"POST",
        needReset:false,
        data: {
          userId:userInfo.userid,//暂时默认这个号码
          index:1,
          size:10
        },
        success:this.loadSuccess.bind(this),
        error:this.loadError.bind(this)
      });
    },
    loadSuccess:function(data){
      $('.mc-row').remove();
      this.findComponent("mc-list").collection.set(data.data);
    },
    loadError:function(){

    }
  });
});
