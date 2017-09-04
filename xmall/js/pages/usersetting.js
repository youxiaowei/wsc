define(['require','./PageView'], function(require,PageView){
  return PageView.extend({
    type:'usersetting',
    events:{
      'click .goback': 'onBack',
      'click .us-yjfk': 'feedBack',
      'click .us-about': 'goAbout',
      'click .us-messetting': 'goMessageSetting',
      'click #usersetting-update': 'update',
      'click #usersetting-changetheme': 'changetheme',
      'click .user-logout': 'loginPage',
      'click .header-menu':'menuMore',
    },
    theme_flag: 1,

    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },

    render:function(){
      PageView.prototype.render.apply(this,arguments);
      return this;
    },
    onRender:function(){
      var it= window.localStorage.getItem("userinfo");
      if(!it){
        $('.btnLogin').css({display:'none'});
      }
    },
    onResume: function(){
      if(window.application.getLocalStorage("apptheme")){

        if(window.application.getLocalStorage("apptheme") == "red"){
          $(".style-name").text("红色");
        }else if (window.application.getLocalStorage("apptheme") == "blue") {
          $(".style-name").text("蓝色");
        }
      }
      this.toggleBar && this.toggleBar("hide");
      this.$('.bar').show();
      var it= window.localStorage.getItem("userinfo");
      if(!it){
        $('.btnLogin').css({display:'none'});
      }else{
        $('.btnLogin').css({display:'block'});
      }

    },
    onBack:function(){
      window.history.back();
    },
    goMessageSetting:function(){
      Backbone.history.navigate('#my-navigate/message-setting', {
        trigger: true
      });
    },
    goAbout:function(){
      Backbone.history.navigate('#my-navigate/about', {
        trigger: true
      });
    },
    feedBack:function(){
      Backbone.history.navigate('#my-navigate/feedback', {
        trigger: true
      });
    },
      update:function(){
        library.Toast("当前是最新版本",1200);

    },
    changetheme: function(){
      _this = this;
      var href = $('link');
      if(_this.theme_flag > 2) _this.theme_flag = 0;
      _.map(href,function(index){
        var href = $(index).attr("href");
        switch(_this.theme_flag){
            case 0:
              if(href == "css/style-orange.css" || href == "css/style-blue.css"){
                  $(index).attr("disabled","disabled");
                  $(".style-name").text("红色");
                  window.application.setLocalStorage("apptheme","red");
              }
              else
                 $(index).removeAttr("disabled");
              break;
            case 1:
              if(href == "css/style-red.css" || href == "css/style-blue.css"){
                  $(index).attr("disabled","disabled");
                  $(".style-name").text("橘色");
                  window.application.setLocalStorage("apptheme","orange");
              }
              else
                 $(index).removeAttr("disabled");
              break;
            case 2:
              if(href == "css/style-orange.css" || href == "css/style-red.css"){
                  $(index).attr("disabled","disabled");
                  $(".style-name").text("蓝色");
                  window.application.setLocalStorage("apptheme","blue");
              }
              else
                 $(index).removeAttr("disabled");
              break;
        };
        /*if(href == "css/style-red.css"){
          if($(index).attr("disabled") == "disabled"){
            $(index).removeAttr("disabled");
            $(".style-name").text("红色");
            window.application.setLocalStorage("apptheme","red");
          }
          else {
            $(index).attr("disabled","disabled");
            $(".style-name").text("蓝色");
            window.application.setLocalStorage("apptheme","blue");
          }
        }*/
      });
      _this.theme_flag++;
    },
    loginPage:function(){
      {
        library.MessageBox("提示信息","确认退出登录？",[{
          leftText:"确定",callback:function(){
            if(sessionStorage.getItem("userOpenid")){
                // library.LoadingBar('解绑中...');
                var options = {
                    url: window.app.api +'/unbindWeChat',
                    type: "POST",
                    needReset: true,
                    data: {
                    	userId:window.application.getUserInfo().userid,
                    	openId:sessionStorage.getItem("userOpenid"),
                    },
                    datatype: "json",
                    success: function(res) {
                        if(res.status == '0') {
                            library.DismissLoadingBar();
                            $('.mobile-bind').hide();
                        $('.success-tips-view').show();
                        } else {
                            library.DismissLoadingBar();
                            library.Toast(res.message);
                        }
                    },
                    error: function() {
                        library.DismissLoadingBar();
                        // library.Toast('网络错误');
                    }
                }
                if(!this.baseModel) {
                    var BaseModel = require(
                        '../models/BaseModel');
                    this.baseModel = new BaseModel();
                }
                this.baseModel.loadData(options); //请求数据
        	}else{
        		//  library.Toast('请在公众号打开微商城下解绑');
        	}
          var userInfoCode = application.getLocalStorage('userinfoCode');
          window.localStorage.clear();     
          window.localStorage.setItem("userinfoCode", userInfoCode);
            
            Backbone.trigger('my-reload');
            $('.btnLogin .user-logout').css({display:'none'});
            Backbone.history.navigate('#my-navigate', {
            trigger: true
            });
          }},{rightText:"取消",callback:function(){}}]);
      }





    }
  });
});
