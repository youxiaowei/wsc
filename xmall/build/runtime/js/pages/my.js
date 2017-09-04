define(['./PageView', 'require'], function(PageView, require) {
  var UserInfo = Backbone.Model.extend({

  });

  return PageView.extend({

    events: {
      'click .head-image': 'onLoginClick',
      'click .my-account': 'onAccount',
      'click .user-security': 'onSecurity',
      'click .my-address': 'onAddressClick',
      'click .all-order': 'onAllOrder',
      'click #wait-pay': 'onWaitPay',
      'click #wait-send': 'onWaitSend',
      'click #wait-comment': 'onWaitComment',
      'click #wait-accept': 'onWaitAccept',
      'click .person-ps-left ': 'onLeftClick',
      'click .person-ps-right ': 'onRightClick',
      'click .my-header-left': "goSetting",
      'click .my-credit': 'goCredit',
      'click .my-balance': 'goBalance',
      'click .my-coupon': 'goCoupon',
      'click .my-memberorders':'goMemberOrders',
      'click .my-header-right': 'goMessageCenter',
      'click .my-address-manager': 'toAddress',
      'click .my-customerservice': 'toMyService',
      'click .my-credit-list':'goCreditlist',
      'click .my-package-list':'goPackagelist'
    },

    userinfo: null,
    userid: null,
    initialize: function() {
    },
    goCreditlist:function(){
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/credit-list', {
          trigger: true
        })
      }
    },
    goMessageCenter: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/messageCenter', {
          trigger: true
        })
      }
    },
    goMemberOrders:function(){
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/myMembersOrders', {
          trigger: true
        });
      }
    },
    goCoupon: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/myCoupon', {
          trigger: true
        });
      }
    },
    goBalance: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/myBalance', {
          trigger: true
        });
      }
    },
    goSetting: function() {
      Backbone.history.navigate('#my-navigate/usersetting', {
        trigger: true
      });
    },
    goCredit: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/credit', {
          trigger: true
        });
      }
    },
    onLeftClick: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        window.app.collector = "goods";
        Backbone.history.navigate('#my-navigate/goodCollected', {
          trigger: true
        })
      }
    },
    onRightClick: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        window.app.collector = "shop";
        Backbone.history.navigate('#my-navigate/logistic-list', {
          trigger: true
        })
      }
    },
    onWaitPay: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/order-list?list_type=1', {
          trigger: true
        })
      }
    },
    onWaitComment: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/order-list?list_type=4', {
          trigger: true
        })
      }
    },
    onWaitSend: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/order-list?list_type=2', {
          trigger: true
        })
      }
    },
    onWaitAccept: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/order-list?list_type=3', {
          trigger: true
        })
      }
    },
    updateUI: function() {
        // var myPoints=Number(this.userinfo.get('myPoints')).toFixed();
      var point = this.userinfo.get('myPoints');
      var pointFloor  = Math.floor(Number(point));
      var myPoints = pointFloor .toString();
      this.$("#my-name").text(this.userinfo.get('nickName') || this.userinfo.get('phoneNumber'));
      this.$(".person-ps-left .person-number").text(this.userinfo.get('myFavCount'));
      this.$(".person-ps-right .person-number").text(this.userinfo.get('myFootCount'));
      this.$(".my-huiyuan").text(this.userinfo.get('level'));

      // if (this.userinfo.get('headImage') != "无")
      //   this.$("#my-tx").attr('src', this.userinfo.get('headImage'));
      if (this.userinfo.get('headImage'))
        this.$("#my-tx").attr('src', this.userinfo.get('headImage'));
      //lb_credit lb_balance lb_couple
      this.$("#lb_credit").text(myPoints || "");
      this.$("#lb_balance").text(this.userinfo.get('myBalance') || "");
      this.$("#lb_couple").text(this.userinfo.get('myCoupon') || "");
      
    },

    onLoginClick: function(e) {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/my-account', {
          trigger: true
        })
      }
    },
    toLogin: function() {
      Backbone.history.navigate('#my-navigate/login/login', {
        trigger: true
      })
    },

    onAccount: function(e) {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/my-account', {
          trigger: true
        })
      }

    },
    onAddressClick: function(e) {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/my-address?userid=' + this.userinfo.get('userid'), {
          trigger: true
        })
      }
    },

    onSecurity: function(e) {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/security', {
          trigger: true
        })
      }
    },
    onAllOrder: function(e) {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate("#my-navigate/order-list?list_type=0", {
          trigger: true
        });
      }
    },
    onRender:function(){
      this.$(".service-comment").bind("click",this.toEvaluation.bind(this));
    },

    onResume: function() {
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
      var openid = p["wxopenid"];
      //console.log(this.userinfo.toJSON());

      this.toggleBar && this.toggleBar("show");

      this.userinfo = new UserInfo();
      var u = application.getUserInfo() || {};
      this.userinfo.set(u);
      var _this = this;
      if (window.app.temp || window.app.temp == 0)
        this.$(".history-num").text(window.app.temp);
      var _this = this;
      if (this.userinfo.get('userid')||openid) {
        var path =openid?"/getWxUserInfo":"/getUserInfo";
        var data = {
          userId: _this.userinfo.get('userid')
        };
        if(openid){
            sessionStorage.setItem("userOpenid", openid);
            data = {
                openId: openid
            };
        }
        _this.$("#my-ydl").removeClass("ydl-hide").addClass("ydl-show");
        _this.$("#my-wdl").css({
          "display": "none"
        });
        _this.updateUI(_this.userinfo);
        console.log();
        var callback = function(res) {
          if (res.status == '0') {
            _this.$("#my-ydl").removeClass("ydl-hide").addClass("ydl-show");
            _this.$("#my-wdl").css({
              "display": "none"
            });
            var userInfo = res.data;
            userInfo.userid = userInfo.userid||_this.userinfo.get('userid');
            application.setLocalStorage('userinfo',res.data);
            _this.userinfo.set(userInfo);
            _this.updateUI();
          } else {
            _this.$("#my-ydl").addClass("ydl-hide").removeClass("ydl-show");
            _this.$("#my-wdl").css({
              "display": "block"
            });
          }
        };
        this.getData(path,data,callback);
      }else{
        this.$("#my-ydl").addClass("ydl-hide").removeClass("ydl-show");
        this.$("#my-wdl").css({
          "display": "block"
        });
        this.$(".wait-pay-count").text("0");
        this.$(".wait-accept-count").text("0");
        this.$(".wait-send-count").text("0");
        this.$(".finish-count").text("0");
        this.$(".person-ps-left .person-number").text("0");
        this.$(".person-ps-right .person-number").text("0");
        this.$("#lb_credit").text("0");
        this.$("#lb_balance").text("0");
        this.$("#lb_couple").text("0");
      }
    },
    getData: function(url, data, callback) {
      _this = this;
      var options = {
        path: url,
        type: "POST",
        needReset: true,
        data: data,
        datatype: "json",
        success: function(res) {
        	console.log("获取成功"+res);
         //_this.$(".circle-count").hide();
          if(res.data.waitPay){
           // _this.$(".circle-pay").show();
            _this.$(".wait-pay-count").text(res.data.waitPay);
          }else{
            _this.$(".wait-pay-count").text("0");
          }
          if(res.data.waitSend){
            // _this.$(".circle-send").show();
            _this.$(".wait-send-count").text(res.data.waitSend);
          }else{
            _this.$(".wait-accept-count").text("0");
          }
          if(res.data.waitAccept){
            // _this.$(".circle-accept").show();
            _this.$(".wait-accept-count").text(res.data.waitAccept);
          }else{
            _this.$(".wait-accept-count").text("0");
          }
          if(res.data.waitComment){ 
             //_this.$(".circle-finish").show();
            _this.$(".finish-count").text(res.data.waitComment);
          }else{
            _this.$(".finish-count").text("0");
          }
          callback(res);
        },
        error: function() {
        	console.log("获取失败");
        }
      };
      if (!this.baseModel) {
        var BaseModel = require('../models/BaseModel');
        this.baseModel = new BaseModel();
      }
      this.baseModel.loadData(options);

    },
    toAddress: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/my-address?userid=' + this.userinfo.get('userid'), {
          trigger: true
        });
      }
    },
    toMyService: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/my-customerservice?list_type=0', {
          trigger: true
        });
      }
    },
    toEvaluation: function() {
      if (!this.userinfo.get('userid')) {
        this.toLogin();
      } else {
        Backbone.history.navigate('#my-navigate/service-evalution?userid=' + this.userinfo.get('userid'), {
          trigger: true
        });
      }
    },
    goPackagelist:function(){
    	 Backbone.history.navigate('#my-navigate/package-order-list?list_type='+1, {
             trigger: true
           });
      //library.Toast('功能开发中...');
    }
  });
});
