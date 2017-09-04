/**
 * Created by Zero Zheng on 15/12/01.
 */
define(['require', './PageView'], function(require, PageView) {
  return PageView.extend({

    defaults: {
      toastTime: null
    },
    paramData: null,
    // 如果想在页面载入时完成工作
    route: function(options) {
      PageView.prototype.route.apply(this, arguments);
    },

    events: {
      'click .btnforget': 'btnforgetClick',
      'click .header-icon-back': 'onBack',
      'click .login-phone-register': 'onRemmberClick',
      'click .login-forgetpwd': 'onForgetpwdClick',
      'click .eyeView': 'pwdConceal',
      'input .input-account':'nameChange',
      'input .input-pwd':'pwdChange',
      'click .btnLogin': 'btnLoginClick',
      'click .wechat-button':"weixinLogin"
    },
      userid:null,
    initialize: function(options) {
      PageView.prototype.initialize.apply(this, arguments);
      /*//微信注册
      var weixinLogin = WeixinLogin;
      weixinLogin.registerApp(this.onSuccess, this.onFail, {
        AppKey : "QUNFNUFGRkU0MEU1OEY1REUxRUZEMTEyMEI2MkMwMDU1RUVCQUY2RDY4MUE3ODk4NjYyNkFCN0RDOUU2M0RFMTgxQTY1QTY4QUMzNUVGMDZDQURDNDBCMEZEMEIxMEIwRTlGRkVEQTJBNzUyMEMzODBGMjM2QUNGQUJGMDUyRjA="
      });*/

      //监听来自组件的点击切换
      this.listenTo(this.findComponent('switchView'), 'switchClick', this.switchClick);
      this.getLogo();
    },
    onSuccess: function(){

    },
    onFail: function(){

    },

    getLogo: function(){
        var BaseModel = require('../models/BaseModel');
        var baseModel = new BaseModel();
        var data = {
        };
        var options = {
            type: "POST",
            path: "/getWXShopLogo",
            data: data,
            showLoading:true,  //显示加载图
            datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
            success: function(res){
               if(res.status == 0){
                   $("this").attr("src",res.data.logoUrl);
               }
            },
            error: function(){
                //library.Toast("网络错误");
            }
        }
        baseModel.loadData(options);
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
      console.log(this.paramData);
      if(this.paramData && this.paramData.data.status == "0"){
          if(this.paramData.data.sessionId)
            this.bindPhone(this.paramData);
      }
    },
    pwdChange: function() {
      this.valueChange();
    },
    nameChange: function() {
      this.valueChange();
    },
    valueChange: function() {
      var btnLogin = this.$el.find('.btnLogin');
      var pwd = this.$el.find('#login-input-pwd');
      var account = this.$el.find('#login-input-account');
      if (pwd.val().trim().length > 0 && account.val().trim().length > 0) {
        btnLogin.removeAttr("disabled");
        btnLogin.addClass('active').removeClass('theme-backgorund-color-contrast').removeClass('theme-border-color-contrast').addClass('theme-backgorund-color').addClass('.theme-border-color');
      } else {
        btnLogin.attr("disabled", "disabled");
        btnLogin.removeClass('active').addClass('theme-backgorund-color-contrast').addClass('theme-border-color-contrast').removeClass('theme-backgorund-color').removeClass('.theme-border-color');
      }
    },
    pwdConceal: function() {
      if (this.$el.find('.eyeview-box').hasClass('icomoon-conceal')) {
        this.$el.find('#login-input-pwd').attr('type', 'text');
        this.$el.find('.eyeview-box').removeClass('icomoon-conceal').addClass('icomoon-display');
      } else {
        this.$el.find('#login-input-pwd').attr('type', 'password');
        this.$el.find('.eyeview-box').removeClass('icomoon-display').addClass('icomoon-conceal');
      }
    },
    switchClick: function() {
      if (this.$el.find('.switchview-switch').hasClass('active')) {
        this.$el.find('#login-input-pwd').attr('type', 'text');
      } else {
        this.$el.find('#login-input-pwd').attr('type', 'password');
      }
    },
    baseModel : null,
    btnLoginClick: function() {
      var _this = this;
      var username = this.$el.find('#login-input-account').val().trim();
      var passwd = this.$el.find('#login-input-pwd').val();
      var userInfoCode = application.getLocalStorage('userinfoCode',true);
      if (username.length < 1) {
        alert('账号不能为空');
      } else if (passwd.length < 1) {
        alert('密码不能为空');
      } else {
        var openId = "";
        if(!userInfoCode||userInfoCode.openId.length<1){
          library.Toast("请从微信公众号登录");
        }else{
          openId=userInfoCode.openId;
        }
        if(!this.baseModel){
          var _Model = require("../models/BaseModel");
          this.baseModel = new _Model();
        }

        var options = {
          path:'/userlogin',
          type:'POST',
          showLoading: true,
          data:{
            openId:openId,
            userName: username,
            password: passwd
          },
          success:this.loginSuccess.bind(this),
          //调用出错执行的函数
          error: function() {
              library.Toast("请求出错");
            //请求出错处理
          }
        }
        this.baseModel.loadData(options);
      }
    },
    // FIXME 优贸的接口
    // ...............................................................................
    loginSuccess: function(res1){
      if(!res1.data){
        library.Toast(res1.message);
        return;
      }
      this.userId = res1.data.userId;
      if (res1.status == "0") {
        var options = {
          path:'/getUserInfo',
          type:"POST",
          data:{
            userId: res1.data.userId
          },
          success:this.getUserInfoSuccess.bind(this),
          error: function(e){

          },
        }
        this.baseModel.loadData(options);
      }else{
        library.Toast(res1.message);
      }
    },
    getUserInfoSuccess: function(res){
      if (res.status == "0") {

        var userInfo = res.data;
        userInfo.userid = this.userId;
        var userInfoCode = application.getLocalStorage('userinfoCode');
        window.localStorage.clear();
        window.localStorage.setItem("userinfo", JSON.stringify(userInfo));
        window.localStorage.setItem("userinfoCode", userInfoCode);
        var url = "#home-navigate";
        Backbone.history.navigate(url, {
          trigger: true
        });
        Backbone.trigger('my-reload');

        
      }else{
         library.Toast("登录失败");
      }
    },

    onBack: function() {
      window.history.back();
    },
    onRemmberClick: function() {
      //sad a 
      var url = "#my-navigate/register";
      Backbone.history.navigate(url, {
        trigger: true
      });
    },

    weixinLogin:function(){

    var Model = require('../models/BaseModel');
    //var mWeixinLogin = WeixinLogin;


     this.weixinModel = new Model();
        var options = {
          path: "/bandWeiXin",
          type: "POST",
          needReset:true,
          data:{
             wxHeadUrl: "http:\/\/wx.qlogo.cn\/mmopen\/PiajxSqBRaEKTJpCphMjVT77UOGY83Sfscd0zsaOnyCUpJuXKGTQLvb8AJZFWRBkqxK84pOhHXvEoL3icSFbhXdg\/0",
             wxNickName: "Droid",
             wxTokenId: "o18IvRs3yvXm2XkHCGj79wU05D4T0"
          },
          success:function(res) {

              this.paramData = res;
              console.log(this.paramData);
              if(res && res.data.status == "0"){
                if(!res.data.sessionId){
                  //微信已经绑定手机号
                }
                else{
                  var url = "#my-navigate/weixinlogin";
                  Backbone.history.navigate(url, {
                    trigger: true
                  });
                }
              }
            }.bind(this),
          error:function () {
              //请求出错处理
               }
        };
        this.weixinModel.loadData(options);













    /*mWeixinLogin.login(
      function(result) {
        this.weixinModel = new Model();
        var options = {
          url: window.app.api+'/app/bandWeiXin',
          type: "POST",
          needReset:true,
          data:{
             wxHeadUrl: result.data.headimgurl,
             wxNickName: result.data.nickname,
             wxTokenId: result.data.openid
          },
          success:function(res) {
              if(res && res.status == "0"){
                if(res.data.sessionId){
                  //微信已经绑定手机号
                }
                else{
                  this.bindPhone.bind(this);

                }
              }
            },
          error:function () {
              //请求出错处理
               }
        };
        this.weixinModel.loadData(options);
      },
      function() { },  {});*/
     /* */
    },


    bindPhone: function(r){
      console.log(window.app.bandPhoneNum);
      var Model = require('../models/BaseModel');
       this.bindModel = new Model();
       var options = {
          path: '/wxBandPhone',
          type: "POST",
          needReset:true,
          data:{
             sessionId: r.data.sessionId,
             userPhone: window.app.bandPhoneNum

          },
          success:function(res) {
              if(res && res.status == "0"){
                if(res.data.sessionId){
                  //微信已经绑定手机号
                }
                else{


                }
              }
            },
          error:function () {
              //请求出错处理
               }
        };
        this.bindModel.loadData(options);
    },

    onForgetpwdClick: function() {
      var url = "#my-navigate/forgetpasswd";
      Backbone.history.navigate(url, {
        trigger: true
      });
    }

  });
});
