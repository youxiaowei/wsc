define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'logiticsDetail',

    events:{
      'click .header-icon-back': 'onBack',
      "click .icomoon-moremore":"menuMore",
    },
    collection:null,
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    onRender:function(){
      //this.setInfo();
        this.collection = this.findComponent(
            "LogiticListView")
            .collection;
    },
    onResume: function(){
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
      /*var logisInfo = app.logisInfo;
      this.findComponent("LogiticListView").collection.reset(logisInfo);*/

      this.initData();
      /*console.log("????????");
      console.log("logisId="+localStorage.getItem("logisId"));
      console.log("sendId="+localStorage.getItem("sendId"))*/;
    },
    onBack:function(){
      window.history.back();
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    setInfo:function(){
      var Info = require('../models/logiticsModel');
      var info = new Info();
      this.$('.logiticsStateDes').append(info.get('state'));
      this.$('.logiticsIdDes').append(info.get('id'));
      this.$('.logsender-office').text(info.get('company'));
      var line_height = this.$('#LogiticListView').height()-115;
      this.$('.component-left').css({
        height: line_height,
      });
    },

      initData: function() {
          var userInfo = application.getUserInfo();
          if(!userInfo) {
              return;
          }

          var logisId = localStorage.getItem("logisId");
          // var sendId = localStorage.getItem("sendId");

          var options = {
              path: "/logisDetail",
              type: "POST",
              data: {
                  userId: userInfo.userid,
                  logisId: logisId,
                  // sendId: sendId
              },
              showLoading: true,
              needReset: true,
              success: this.onSuccess.bind(this),
              error: this.onSuccess.bind(this),   //这里是假数据测试
          }
          this.collection.loadData(options);
      },
      onSuccess: function(data) {
          // var data = {
          //     sendUnitInfo:{
          //         unitName: "用友"
          //     },
          //     logisInfo:{
          //         status: "已出发",
          //         code:"aasd12344231sd"
          //     },
          //     nodeList:[
          //         {
          //             nodeContent:"广州市滨海南路便民服务站,收件员：xxx",
          //             nodeTime:"2016-03-25 11:20：11"
          //         },
          //         {
          //             nodeContent:"广州市滨海南路便民服务站,收件员：xxx",
          //             nodeTime:"2016-03-25 11:20：11"
          //         },
          //         {
          //             nodeContent:"广州市滨海南路便民服务站,收件员：xxx",
          //             nodeTime:"2016-03-25 11:20：11"
          //         }
          //     ]
          // };
          if(data.data != undefined){
              $('.logsender-office').text("快递公司 ：" + data.data.sendUnitInfo.unitName);
              $('.logiticsIdItem').text("运单号 ：" + data.data.logisInfo.code);
              $('.logiticsStateItem').text("状态 ：" + data.data.logisInfo.status);
              this.collection.reset(data.data.nodeList);
          }
          // this.collection.reset(data.nodeList);
      }
  });
});
