/**
 * Created by Zero Zheng on 15/12/01.
 */
define(['require', './PageView'], function(require, PageView) {

  return PageView.extend({

    defaults: {
      toastTime: null
    },
    referPhone:null,
    referNum: null,
    serverRes: null,
    // 如果想在页面载入时完成工作
    route: function(options) {
      PageView.prototype.route.apply(this, arguments);
    },
    events: {
      'click .btnforget': 'btnforgetClick',
      'click .header-icon-back': 'onBack',
      'click .bd-agree': 'onAgreeClick',
      'click .btnRegister': 'btnRegisterClick',
      'click .btn-retransmit': 'checkRetransmit',
      'click .register-to-login': 'toLogin',
      'input .reg-input-pwd': 'pwdChange',
      'input .reg-input-account': 'numberChange',
        'blur #phone':'blurReg'
    },
    initialize: function(options) {
      PageView.prototype.initialize.apply(this, arguments);

      //监听来自组件的点击切换
      // this.listenTo(this.findComponent('switchView'), 'switchClick', this.switchClick);
    },
    render: function() {
      // this.$el.empty();
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onResume: function() {
      if(window.application.getQueryString('referencePhone')){
        this.referPhone = window.application.getQueryString('referencePhone');
        window.app.referPhone = this.referPhone
      }
      if(window.application.getQueryString('referenceNumber')){
        this.referNum = window.application.getQueryString('referenceNumber');
        window.app.referNum = this.referNum;
      }
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
    },
      /*手机号验证*/
      blurReg:function(){
          var phone=$("#phone").val();
           var regpwd = /^1[3,4,5,8]\d{9}$/;
            if (phone.trim().length == 0) {
                library.Toast("手机号不能为空", 1000);
            } else if (!regpwd.test(phone)) {
                library.Toast("请输入正确的手机号", 1500);
            }
      },
    pwdChange: function() {
      this.valueChange();
    },
    numberChange: function() {
      //验证码的样式更改
      var $btn = $('.btn-retransmit');
      if (!$btn.hasClass('is-restransit') && $('.reg-input-account').val().trim().length > 0) {
        $btn.removeClass('btn-retransmit-disabled').addClass('theme-color').addClass('theme-border-color');
      } else {
        $btn.addClass('btn-retransmit-disabled').removeClass('theme-color').removeClass('theme-border-color');;
      }
      //提交按钮的样式更改
      this.valueChange();
    },
    valueChange: function() {
      var rpwd = this.$el.find('.reg-input-pwd');
      var raccount = this.$el.find('.reg-input-account');
      var btn = this.$el.find('.btnRegister');
      if (rpwd.val().trim().length > 0 && raccount.val().trim().length > 0 && $('.bd-st').hasClass('theme-backgorund-color')) {
        btn.removeAttr("disabled");
        btn.removeClass('theme-backgorund-color-contrast').removeClass('theme-border-color-contrast').addClass('theme-border-color').addClass('theme-backgorund-color');
      } else {
        btn.attr("disabled", "disabled");
        btn.addClass('theme-backgorund-color-contrast').addClass('theme-border-color-contrast').removeClass('theme-border-color').removeClass('theme-backgorund-color');
      }
    },
    //点击下一步
    btnRegisterClick: function() {
      var refNum=this.referNum;
      var refPhone=this.referPhone;
      if (this.$el.find('.reg-input-account').val().trim().length < 1) {
        library.Toast('手机号码不能为空');
      } else if (this.$el.find('#register_input').val().length < 1) {
        library.Toast('验证码不能为空');
      } else if ($('.theme-backgorund-color').length < 1) {
        library.Toast('请同意商城协议');
      } else {
        var num = 0;
        var _this = this;
        var userPhone =this.$el.find('.reg-input-account').val().trim();
        library.LoadingBar('验证中...');
        this.sendData("/verifyCheckCode", {
          userPhone: userPhone,
          checkCode: this.$el.find('#register_input').val(),
          sessionId: this.sessionid
        }, function(res) {
          if (res.status == "0") {
            library.DismissLoadingBar();
            var userInfoCode = application.getLocalStorage('userinfoCode',true);
            var openId = "";
            if(!userInfoCode||userInfoCode.openId.length<1){
              library.Toast("请从微信公众号打开注册");
            }else{
              openId=userInfoCode.openId;
            }
            var parms= {
              password:userPhone.substring(5),
              userPhone: userPhone,
              sessionId: _this.sessionid,
              openId:openId,
              referenceNumber:refNum,
              referencePhone:refPhone
            }
            console.log(parms);
            // var _this = this;
            _this.sendData('/userRegister', parms, function(res1) {
              if (res1.status == "0") {
                //  library.Toast("注册");
                _this.sendData('/getUserInfo', {
                  userId: res1.data.userId
                }, function(res) {
                  if (res.status == "0") {
                    var userInfoCode = application.getLocalStorage('userinfoCode',true);
                    window.localStorage.clear();
                    window.localStorage.setItem("userinfo", JSON.stringify(res.data));
                    window.localStorage.setItem("userinfoCode", JSON.stringify(userInfoCode));
                    application.setLocalStorage('unReadCount', res.data.newMessageCount);
                    Backbone.trigger('my-reload');
                    Backbone.history.navigate('#my-navigate/register-success', {
                      trigger: true
                    });
                  }else{
                    library.Toast("注册失败");
                  }
                });
              }else {
                library.Toast("注册失败,请联系管理员");
              }

            },function (e){
                 library.Toast(JSON.stringify(e));
            });
          } else {
            library.DismissLoadingBar();
            library.Toast(res.message);
          }
        }, function(res) {
          library.DismissLoadingBar();
          library.Toast('请输入正确的手机号码或者验证码');
        });
      }
    },
    userRegister:function(){

    },
    checkRetransmit: function() {

      var _this = this;
      if ($('.btn-retransmit').hasClass('btn-retransmit-disabled')) {
        return;
      }

        var $btn = $('.btn-retransmit');
        $btn.html('重新发送（60s）').addClass('btn-retransmit-disabled').addClass('is-restransit').removeClass('theme-color');
        var count = 60;
        var ret = setInterval(function() {
            --count;
            if (count == 0) {
                $btn.html('获取验证码').removeClass('btn-retransmit-disabled').removeClass('is-restransit').addClass('theme-color');
                clearInterval(ret);
            } else {
                $btn.html('重新发送（' + count + 's）');
            }
        }, 1000);
      //校验手机格式
      if (!this.checkPhone(this.$el.find('.reg-input-account').val().trim())) {
        library.Toast('手机号格式错误');
      } else {
        this.sendData('/getCheckCode', {
          userPhone: this.$el.find('.reg-input-account').val().trim()
        }, function(res) {
          if (res.status == "0") {
            /*var $btn = $('.btn-retransmit');
            $btn.html('重新发送（60s）').addClass('btn-retransmit-disabled').addClass('is-restransit').removeClass('theme-color');
            var count = 60;
            var ret = setInterval(function() {
              --count;
              if (count == 0) {
                $btn.html('获取验证码').removeClass('btn-retransmit-disabled').removeClass('is-restransit').addClass('theme-color');
                clearInterval(ret);
              } else {
                $btn.html('重新发送（' + count + 's）');
              }
            }, 1000);*/
            _this.sessionid = res.data.sessionId;
          } else {
            
            library.Toast(res.message); //手机已注册会提示
            $btn.html('获取验证码').removeClass('btn-retransmit-disabled').removeClass('is-restransit').addClass('theme-color');
            clearInterval(ret);
          }
        }.bind(this), function() {
          $btn.html('获取验证码').removeClass('btn-retransmit-disabled').removeClass('is-restransit').addClass('theme-color');
          clearInterval(ret);
          library.Toast('网络错误');
        });

      }
    },
    callback: function() {

    },


    sendData: function(url, data, callback, errorcallback) {
      var BaseModel = require('../models/BaseModel');
      var baseModel = new BaseModel();
      var options = {
        type: "POST",
        path: url,
        data: data,
        datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
        success: callback,
        error: errorcallback
      }
      baseModel.loadData(options);
    },
    checkPhone: function(phone) {
      var pattern = /^1[0-9]{10}$/;
      return pattern.test(phone);
    },
    onBack: function() {
      window.history.back();
    },
    onAgreeClick: function() {
      if ($('.bd-st').hasClass('theme-backgorund-color')) {
        $('.bd-st').removeClass('theme-backgorund-color');
      } else {
        $('.bd-st').addClass('theme-backgorund-color');
      }
      //提交按钮的样式更改
      this.valueChange();
    },
    toLogin: function() {
      var url = "#my-navigate/login/login";
      Backbone.history.navigate(url, {
        trigger: true
      });
    }
  });
});
