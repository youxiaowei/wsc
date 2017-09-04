define(['require', './PageView'], function(require, PageView) {
  return PageView.extend({

    defaults: {
      toastTime: null
    },
    // 如果想在页面载入时完成工作
    route: function(options) {
      PageView.prototype.route.apply(this, arguments);
    },
    events: {
      'click .header-icon-back': 'onBack',
      'click .pwdtype-eyeone': 'pwdOldChange',
      'click .pwdtype-eyetwo': 'pwdNewChange',
      'input .pwd-old': 'newpwdChange',
      'input .pwd-new': 'oldpwdChange'
    },
    initialize: function(options) {
      PageView.prototype.initialize.apply(this, arguments);
      //监听来自组件的点击切换
      // this.listenTo(this.findComponent('switchView'), 'switchClick', this.switchClick);
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
    },
    valueChange: function() {
      var btnNext = this.$el.find('.btnNext');
      var old_pwd = this.$el.find('.pwd-old');
      var new_pwd = this.$el.find('.pwd-new');
      if (old_pwd.val().trim().length > 0) {
        btnNext.removeAttr("disabled");
        btnNext.addClass('active').removeClass('theme-backgorund-color-contrast').removeClass('theme-border-color-contrast').addClass('theme-backgorund-color').addClass('.theme-border-color');
      } else {
        btnNext.attr("disabled", "disabled");
        btnNext.removeClass('active').addClass('theme-backgorund-color-contrast').addClass('theme-border-color-contrast').removeClass('theme-backgorund-color').removeClass('.theme-border-color');
      }
    },
    newpwdChange: function() {
      this.valueChange();
    },
    oldpwdChange: function() {
      this.valueChange();
    },
    pwdTypeChange: function(type) {
      if (type == 1) {
        if ($('.pwd-old').attr('type') == "password") {
          $('.pwd-old').attr('type', 'text');
          var pwd_eye = this.$el.find('#eye1');
          pwd_eye.removeClass('icomoon-conceal');
          pwd_eye.addClass('icomoon-display');
        } else {
          $('.pwd-old').attr('type', 'password');
          var pwd_eye = this.$el.find('#eye1');
          pwd_eye.removeClass('icomoon-display');
          pwd_eye.addClass('icomoon-conceal');
        }
      } else {
        if ($('.pwd-new').attr('type') == "password") {
          $('.pwd-new').attr('type', 'text');
          var pwd_eye = this.$el.find('#eye2');
          pwd_eye.removeClass('icomoon-conceal');
          pwd_eye.addClass('icomoon-display');
        } else {
          $('.pwd-new').attr('type', 'password');
          var pwd_eye = this.$el.find('#eye2');
          pwd_eye.removeClass('icomoon-display');
          pwd_eye.addClass('icomoon-conceal');
        }
      }
    },

    onBack: function() {
      window.history.back();
    },
    pwdOldChange: function () {
      if ($('.pwd-old').attr('type') == "password") {
        $('.pwd-old').attr('type', 'text');
        var pwd_eye = this.$el.find('#eye1');
        pwd_eye.removeClass('icomoon-conceal');
        pwd_eye.addClass('icomoon-display');
      } else {
        $('.pwd-old').attr('type', 'password');
        var pwd_eye = this.$el.find('#eye1');
        pwd_eye.removeClass('icomoon-display');
        pwd_eye.addClass('icomoon-conceal');
      }
    },
    pwdNewChange: function() {
      if ($('.pwd-new').attr('type') == "password") {
        $('.pwd-new').attr('type', 'text');
        var pwd_eye = this.$el.find('#eye2');
        pwd_eye.removeClass('icomoon-conceal');
        pwd_eye.addClass('icomoon-display');
      } else {
        $('.pwd-new').attr('type', 'password');
        var pwd_eye = this.$el.find('#eye2');
        pwd_eye.removeClass('icomoon-display');
        pwd_eye.addClass('icomoon-conceal');
      }
    },
    onBack: function() {
      window.history.back();
    },
    btnNext: function() {
      var first = this.$el.find('.pwd-old').val();
      var sec = this.$el.find('.pwd-new').val();
      if (first.trim().length == 0) {
          library.Toast("密码不能为空",1000);
      } else {
        library.LoadingBar('注册中...');
        this.params.password = first;
        if(window.app.referPhone){
          this.params.referencePhone = window.app.referPhone;
        }
        if(window.app.referNum){
          this.params.referenceNumber = window.app.referNum;
        }
        var _this = this;
        this.sendData(window.app.api + '/userRegister', this.params, function(res1) {
          if (res1.status == "0") {
            _this.sendData(window.app.api + '/getUserInfo', {
              userId: res1.data.userId
            }, function(res) {
              if (res.status == "0") {
                window.localStorage.clear();
                var data = res.data;
                data.userid = res1.data.userId;
                window.localStorage.setItem("userinfo", JSON.stringify(data));
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

        });
      }
    },
    sendData: function(url, data, callback) {

        var options = {
              url:url,
              showLoading:true,
              type: "POST",
              needReset:true,
              data:data,
              datatype: "json",
              success:function(res) {
                        callback(res);

                      },
              error:function () {
                  //请求出错处理
                   }
            }

            if (!this.baseModel) {
              var BaseModel = require('../models/BaseModel');
              this.baseModel = new BaseModel();
            }
            this.baseModel.loadData(options);
     /* $.ajax({
        //提交数据的类型 POST GET

        type: "POST",
        //提交的网址
        url: url,
        //提交的数据
        data: data,
        //返回数据的格式
        datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".

        //在请求之前调用的函数
        beforeSend: function() {},
        //成功返回之后调用的函数
        success: function(res) {
          callback(res);

        },
        //调用执行后调用的函数
        complete: function(XMLHttpRequest, textStatus) {

          //HideLoading();
        },
        //调用出错执行的函数
        error: function() {
          //请求出错处理
        }
      });*/
    }
  });
});
