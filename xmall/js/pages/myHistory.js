define(['./PageView','require'], function(PageView,require) {

  return PageView.extend({

    events: {
      "click .header-icon-back": "goback",
      "click .filters-item": "select",
      "click .history-clear": "clear",
      "click .goods-collector-li": "toDetail",

    },

    collection:null,

    onRender: function(){
      this.userInfo = window.application.getUserInfo();
      this.$('.default-item').addClass("theme-color");
      this.collection = this.findComponent("HistoryView").collection;
    },
    goback: function(e) {
      window.history.back();
    },

    clear: function(e){
        this.$("#HistoryView").remove();
        window.app.temp = 0;
    },
    onResume: function(){
      window.app.temp = 3;
      this.toggleBar && this.toggleBar('hide');
      this.initData();

      var MyHistoryModel = require('../models/BaseModel');
      var _MyHistoryModel = new MyHistoryModel();
      var options = {
        path:"/getScanRecord",
        type:"POST",
        data : {userId : "010091K0W3GX13W9DBHJ",
        index:1,
        size:10
        },showLoading:true,
        needReset:true,
        success:function(data){
          console.log(data);
        },
        error:function(){

        }
      }
      _MyHistoryModel.loadData(options);


      // var ClearHistoryModel = require('../models/BaseModel');
      // var _ClearHistoryModel = new ClearHistoryModel();
      // var options = {
      //   path:"/cleanScanRecord",
      //   type:"POST",
      //   data : {userId : "010091K0W3GX13W9DBHJ",
      //   },showLoading:true,
      //   success:function(){},
      //   error:function(){
      //
      //   }
      // }
      // _ClearHistoryModel.loadData(options);

    },

    initData: function(){
      var userInfo = application.getUserInfo();
      if(!userInfo){
        return;
      }
      var options = {
        path : "/getLogisticList",
        type : "POST",
        data : {userId : userInfo.userid},
        showLoading:true,
        needReset: true,
      }
      this.collection.loadData(options);
    },
    toDetail: function(e){

    }


  });
});
