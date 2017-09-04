/**
 * Created by liuqingling on 15/11/28.
 */
define(['require','./PageView','../models/HomeAllModel','../models/HomeADImgsModel'], function(require,PageView,HomeAllModel,HomeADImgsModel) {
  return PageView.extend({
    pageY: 0,
    events: {
       "click .common-search-right": "goMessageCenter",
       "click .common-search-left-inner": "toSearch",
       "click .home-goods-discount": "itemClick",
       "click .home-carousel-package":"toGroupBuy",
       "click .home-zhongchou":"toZhongChou"
    },
    listCollection:null,
    pageCount: 0,
    initialize:function(){
    	var orderID = window.application.getQueryString('orderId');
    	if(orderID){
    		Backbone.history.navigate("#my-navigate/myback?orderId="+orderID,{
    			trigger:true
    		})
    	}
      var _this = this;
      var all =  new HomeAllModel();
      this.listCollection = this.findComponent("HomePushView").collection;
      all.loadData(this.getAdImagsOptions());
      this.listCollection.loadData(this.getHomeListOptions());
    },
    getAdImagsOptions:function(){
      var options = {
        path:"/getHomeInfo",
        type:"POST",
        data: {},
        success:this.onGetAdImagsSuccess.bind(this),
        error:this.onGetAdImagsError.bind(this)
      }
      return options;
    },
    onGetAdImagsSuccess:function(res){
      if(res && res.status == "0"){
        this.findComponent("carousel").collection.reset(res.data.list);
      }
    },
    onGetAdImagsError:function(){
    },
    getHomeListOptions: function(){
      var options = {
        path:"/getHomeList",
        type:"POST",
        data:{
          index: 1,
          size: 10
        },
        needReset:true,
        success: this.onHomeListSuccess.bind(this),
        error:this.onHomeListError.bind(this)
      }
      return options
    },
    onHomeListSuccess: function(res){
      this.findComponent("HomePushViewLoading").$el.hide();
      if(res && res.status == "0"){
        this.findComponent("HomePushView").$el.show();
        //如果全部加载
        if(res.data.list.length <= 0){
        	$(".loadmore-loading").html("已加载全部");
        }
      }
    },
    onHomeListError: function(e){
      library.Toast("加载失败");
    },
    goMessageCenter:function(){
      var userInfo = application.getUserInfo();
      if(!userInfo || !userInfo.userid){
        Backbone.history.navigate('#home-navigate/login/login', {
          trigger: true
        });
      }else{
        Backbone.history.navigate('#home-navigate/messageCenter', {
          trigger: true
        })
      }
    },
    toZhongChou:function(e){
      Backbone.history.navigate("#home-navigate/crowdfunding-list",{
        trigger:true
      })
    },
    toGroupBuy: function(e){
      Backbone.history.navigate("#home-navigate/package-commodity",{
        trigger:true
      })
    },
    itemClick: function(e){
			var itemView = $(e.currentTarget);
      var goodsId = itemView.attr("data-pid");
      if(goodsId){
        Backbone.history.navigate("#home-navigate/itemdetail?goodsid="+goodsId,{
          trigger:true
        });
      }
		},
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    toSearch:function(){
      this.findComponent("SearchMidPageView").show();
    },
    onRender:function(){
      this.findComponent("HomePushView").$el.hide();
      var _this=this;
      var header = this.$el.find("#home_header");
      var home_header_bk = this.$el.find("#home_header_bk");
      var header_height = header[0].offsetHeight;
      var isTouching = false;
      document.body.addEventListener("touchmove",function(e){
            var diff = header_height-document.body.scrollTop/4;
            home_header_bk.css("opacity",(1-diff/header_height).toString());
            isTouching=true;
      });
      document.body.addEventListener("touchend",function(e){
        isTouching=false;
      });
      window.onscroll=(function(e){
        if(!isTouching){
          var diff = header_height-document.body.scrollTop/4;
          home_header_bk.css("opacity",(1-diff/header_height).toString());
          var mValue = document.body.scrollTop + document.body.offsetHeight - document.body.scrollHeight;
          mValue = Math.abs(mValue);
          if(mValue == 0 && !_this.listCollection.isLoading){//自动加载下一页
            _this.toLoadMore();
          }
        }
      });
      this.$('.table-view').css({'overflow':'hidden'});
    },

    toLoadMore: function(){
      setTimeout(this.getNextPage.bind(this),200);
    },

    getNextPage: function(){
        //FIXME
        //需要知道总的条数
      if(this.listCollection.ajaxOptions.data.index >= 5){
        this.listCollection.allDataLoaded = true;
        this.findComponent("HomePushView").refresh();
        return;
      }
      this.listCollection.getNextPage();
    },

  onResume: function () {
      this.listCollection.loadData(this.getHomeListOptions());
      // this.showunReadCount();
      // var shoppingnum = application.getLocalStorage("shoppingnum");
      // if(shoppingnum && shoppingnum!="0")
      // {
      //     $(".shopping-num").show();
      //     var str =shoppingnum;
      //     if(parseInt(str)>99)
      //         {
      //           str = "99+"
      //         }
      //     $(".shopping-num").text(str);
      // }else{
      //     $(".shopping-num").hide();
      //   }
      
      var url_arr = window.location.href.split("?");
      var parms = url_arr[1];
      var p = {};
      if (parms) {
        var param_arr = parms.split("&");
        for (var i = 0, j = param_arr.length; i < j; i++) {
          var keyvalue_arr = param_arr[i].split("=");
          p[keyvalue_arr[0]] = keyvalue_arr[1];
        }
      }
      //key值wxopenid  实际上是code
      var openid = p["wxopenid"];
      var Model = require('../models/BaseModel');
      var openModel = new Model();
      var imageModel = new Model();
      //1 根据code 去openID
      if (openid) {
        var data = {
          code: openid
        }
        var option = {
          url: window.app.api + '/weixin/ajaxGetCode',
          type: "post",
          needReset: true,
          data: data,
          error: function () { },
          success: function (res) {
            if (res.data) {
              var trueOpenid = res.data.openId;
              var nickName = res.data.nickName;
              var headUrl = res.data.headUrl;
              window.sessionStorage.setItem("userOpenid", trueOpenid);
              application.setLocalStorage('userinfoCode', res.data);
              //2.根据openID登录
              var data = {
                openId: trueOpenid
              };
              var option2 = {
                url: window.app.api + '/getWxUserInfo',
                type: "post",
                needReset: true,
                data: data,
                success: function (res) {
                  if (res.data) {
                    var userInfo = res.data;
                    application.setLocalStorage('userinfo', res.data);
                    application.setLocalStorage('unReadCount', res.data.newMessageCount);
                    var unReadCount =res.data.newMessageCount;
                    if(unReadCount){
                      if(unReadCount<=0){
                        $(".icomoon-talk-num").hide();
                      }else if(unReadCount>9){
                        $(".icomoon-talk-num").show();
                        $(".icomoon-talk-num").text("9+");
                      }else{
                        $(".icomoon-talk-num").show();
                        $(".icomoon-talk-num").text(unReadCount);
                      }
                    }else{
                      $(".icomoon-talk-num").hide();
                    }
                    //3.登录成功后获取购物车数量
                    var option3 = {
                      path: '/getCartList',
                      type: "POST",
                      data: { userId: application.getUserInfo().userid },
                      showLoading: true,
                      needReset: false,
                      success: function (res2) {
                        if (res2 && res2.status == '0') {
                          if (res2.data.totalNumber && res2.data.totalNumber != "0") {
                            $(".shopping-num").show();
                            // $(".shopping-num").text(res.data.totalNumber);
                            var str =res.data.totalNumber;
                            if(parseInt(str)>99){
                              str = "99+"
                            }
                            $(".shopping-num").text(str);
                            application.setLocalStorage('shoppingnum', res2.data.totalNumber);
                          } else {
                            $(".shopping-num").hide();
                          }
                        }
                      },
                      error: function(){

                      }
                    }
                    imageModel.loadData(option3);
                  }else{
                    application.setLocalStorage('userinfo', "");
                    application.setLocalStorage('shoppingnum', "");
                    application.setLocalStorage('unReadCount', "");
                    $(".icomoon-talk-num").hide();

                  }
                }
              }
              openModel.loadData(option2);
            }
          }
        }
        openModel.loadData(option);
      }
      var _this = this;

      var options = {
        url: window.app.api + '/getSuitHomeImages',
        type: "post",
        needReset: true,
        data: {},
        success: function (res) {
          if (res.data.length > 0) {
            var carouselCollection = _this.findComponent("packagecarousel").collection;
            var list = [];
            for (var i = 0; i < res.data.length; i++) {
              list.push({
                    src: res.data[i].url
              })
            }
            carouselCollection.reset(list);
          }
        },
        error: function () {

        }
      };
      imageModel.loadData(options);
      /*        var Model = require('../models/BaseModel');
              var url_arr = window.location.href.split("?");
              var parms = url_arr[1];
              var p={};
              if(parms){
                var param_arr = parms.split("&");
                for(var i=0,j=param_arr.length;i<j;i++){
                  var keyvalue_arr = param_arr[i].split("=");
                  p[keyvalue_arr[0]]=keyvalue_arr[1];
                }
              }
              //取得openid，用于微信支付
              var openid = p["wxopenid"];
              if(openid){
                  sessionStorage.setItem("userOpenid", openid);
              }
              var phoneNumber = p["phone"];
              if(phoneNumber){
                  var memberCode = p["code"];
                  this.userModel = new Model();
                  var options = {
                      url: window.app.api+'/getPhoneUserInfo',
                      type: "POST",
                      needReset:true,
                      data:{
                          phone:phoneNumber,
                          ncMember:memberCode
                      },
                      success:function(res) {
                          application.setLocalStorage('userinfo',res.data);
                      },
                      error:function () {
                          //请求出错处理
                      }
                    };
                    this.userModel.loadData(options);
              }
      */
      this.toggleBar && this.toggleBar("show");
      //this.checkVersionInfo();
      var theme = window.application.getLocalStorage("apptheme");
      var href = $('link');
      //主题设置为橙色
      _.map(href, function (index) {
        var href = $(index).attr("href");
        if (href == "css/style-orange.css") {
          $(index).removeAttr("disabled");
        }
        else if (href == "css/style-red.css" || href == "css/style-blue.css")
          $(index).attr("disabled", "disabled");
      });
    },
    model:null,
    checkVersionInfo:function(){
      var Model = require('../models/BaseModel');
      var versionCode = window.application.getLocalStorage('versioncode');
      if(!versionCode)
      {
        versionCode = 0;
      }
      window.application.setLocalStorage('versioncode',versionCode);
      this.versioncodeModel = new Model();
      var options = {
          url: window.app.api+'/app/checkUpdate',
          type: "GET",
          needReset:true,
          data:{
            versionCode:versionCode
          },
          success:function(res) {
            if(this.versioncodeModel.get('needUpdate') == 1)
            {
              this.updateAPP(this.versioncodeModel.get('downloadUrl'));
            }
            }.bind(this),
          error:function () {
              //请求出错处理
               }
        };
        this.versioncodeModel.loadData(options);
    },

    updateAPP: function(url){
      try{
        if(dynamicupdate){
          dynamicupdate.download(function(){
            dynamicupdate.deploy(function(){
              console.log('deploy error');
            });
            window.application.setLocalStorage('versioncode',this.versioncodeModel.get('versionCode'));
          }.bind(this), function(e){
          }, url);
        }
      }catch(e){
        console.log(e);
      }

    },

    goToBrand: function(){
        Backbone.history.navigate('#home-navigate/branddetail', {
            trigger: true
        })
    },
    scanCode: function(e) {
      return;
    }
  });

});
