define(['require', './PageView'], function(require, PageView) {
    return PageView.extend({
        defaults: {
            toastTime: null
        },
        events: {
            'click .identifyCode-btn': 'askForCode',
            'click .btnNext': 'nextStep',
            'input .code-input': 'btnStatus',
            'click .goback': 'goBack',
        },
        baseModel: null,
        initialize: function(options) {
            PageView.prototype.initialize.apply(this,
                arguments);
            //this.listenTo(this.findComponent('switchView'), 'switchClick', this.switchClick);
            //this.userinfo.set(JSON.parse(window.localStorage.getItem('userinfo')));
            //window.localStorage.getItem('userinfo'); 得到的是json字符串
            //application.getUserInfo(); application中的getUserInfo方法把json转化为对象，就可以直接用. 来取到值
            this.userinfo = application.getUserInfo(); //获得userinfo
        },
        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onResume: function() {
        	$(".phoneNum").text('');
            this.$el.find('.input-account')
                .val('');
            this.$el.find('.input-pwd')
                .val('');
            this.$el.find('.btnLogin')
                .attr("disabled", "disabled");
            this.$el.find('.btnLogin')
                .removeClass('active');
            this.toggleBar && this.toggleBar('hide');
            if(this.userinfo.phoneNumber) {
                this.$el.find('.phoneNum')
                    .text(this.userinfo.phoneNumber);
            }
            this.$('.bar')
                .show();
        },
        btnStatus: function() {
            var code = this.$el.find('.code-input')
                .val();
            if(code) {
                if($('.identifyCode-btn')
                    .hasClass('identifyCode-btn-disabled')) {
                    this.$el.find('.submit-btn')
                        .removeAttr('disabled');
                    $('.submit-btn')
                        .removeClass(
                            'theme-backgorund-color-contrast'
                        )
                        .removeClass(
                            'theme-border-color-contrast');
                    $('.submit-btn')
                        .addClass('theme-backgorund-color')
                        .addClass('theme-border-color');
                }
            } else {}
        },
        checkPhone: function(phone) {
            var pattern = /^1[0-9]{10}$/;
            return pattern.test(phone);
        },
        askForCode: function() {
            /*console.log($('.phoneNum').text().trim());*/

            var $btn = $(
                '.identifyCode-btn'
            );
            if($btn.hasClass( 'identifyCode-btn-disabled')) return;
            $btn.html('已获取验证码(30)')
                .addClass(
                'identifyCode-btn-disabled'
            )
                .removeClass(
                'theme-color');
            var count = 30;
            var ret = setInterval(
                function() {
                    --count;
                    if(count == 0) {
                        $btn.html( '获取验证码' )
                            .removeClass( 'identifyCode-btn-disabled' )
                            .addClass( 'theme-color' );
                        clearInterval (ret);
                    } else {
                        $btn.html( '已获取验证码(' + count + ')' );
                    }
                }, 1000);


            var _this = this;
            //校验手机格式
            if(!this.checkPhone(this.$('.phoneNum')
                    .text()
                    .trim())) {
                library.Toast('手机号格式错误');
            } else {
                this.sendData(window.app.api +
                    '/getVerifyCode', {
                        userPhone: $('.phoneNum')
                            .text()
                            .trim()
                    },
                    function(res) {
                        if(res.status == "0") {
                            /*var $btn = $(
                                '.identifyCode-btn'
                            );
                            $btn.html('已获取验证码(60)')
                                .addClass(
                                    'identifyCode-btn-disabled'
                                )
                                .removeClass(
                                    'theme-color');
                            var count = 60;
                            var ret = setInterval(
                                function() {
                                    --count;
                                    if(count == 0) {
                                        $btn.html( '获取验证码' )
                                            .removeClass( 'identifyCode-btn-disabled' )
                                            .addClass( 'theme-color' );
                                        clearInterval (ret);
                                    } else {
                                        $btn.html( '已获取验证码(' + count + ')' );
                                    }
                                }, 1000);*/
                                _this.sessionid = res.data.sessionId;
                        } else {
                            library.Toast(res.message);
                        }
                    }.bind(this),
                    function() {
                        library.Toast('网络错误');
                    });
            }
        },
        sendData: function(url, data, callback, errorcallback) {
            var BaseModel = require('../models/BaseModel');
            var baseModel = new BaseModel();
            var options = {
                type: "POST",
                url: url,
                data: data,
                datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
                success: callback,
                error: errorcallback
            }
            baseModel.loadData(options);
        },
        pwdTypeChange: function() {
            if($('.input-pwd') .attr('type') == "password") {
                $('.input-pwd') .attr('type', 'text');
                var pwd_eye = this.$el.find( '.icomoon-conceal');
                pwd_eye.removeClass('icomoon-conceal');
                pwd_eye.addClass('icomoon-display');
            } else {
                $('.input-pwd') .attr('type', 'password');
                var pwd_eye = this.$el.find( '.icomoon-display');
                pwd_eye.removeClass('icomoon-display');
                pwd_eye.addClass('icomoon-conceal');
            }
        },
        pwdChange: function() {
            this.valueChange();
        },
        nameChange: function() {
            this.valueChange();
        },
        valueChange: function() {
            //中文验证
            var reg = /^[\u4e00-\u9fa5]+$/;
            var btnLogin = this.$el.find('.btnLogin');
            var pwd = this.$el.find('.input-pwd');
            var account = this.$el.find('.input-account');
            if(pwd.val()
                .trim()
                .length > 0 && account.val()
                .trim()
                .length > 0 && !reg.test(account.val()
                    .trim())) {
                btnLogin.removeAttr("disabled");
                btnLogin.addClass('active')
                    .removeClass(
                        'theme-backgorund-color-contrast')
                    .removeClass(
                        'theme-border-color-contrast')
                    .addClass('theme-backgorund-color')
                    .addClass('.theme-border-color');
            } else {
                btnLogin.attr("disabled", "disabled");
                btnLogin.removeClass('active')
                    .addClass(
                        'theme-backgorund-color-contrast')
                    .addClass('theme-border-color-contrast')
                    .removeClass('theme-backgorund-color')
                    .removeClass('.theme-border-color');
            }
        },
        /*switchClick:function(){
            if(this.$el.find('.switchview-switch').hasClass('active')){
                this.$el.find('.input-pwd').attr('type','text');
            }else {
                this.$el.find('.input-pwd').attr('type','password');
            }
        },*/
        nextStep: function() {
            if($('.code-input').val()) {
                //   Backbone.history.navigate('#my-navigate/bind-new', {
                //       trigger: true
                //   });
                library.LoadingBar('验证中...');
                var options = {
                    url: window.app.api +
                        '/verifyCheckCode',
                    type: "POST",
                    needReset: true,
                    data: {
                        checkCode: this.$( '.code-input' ) .val(),
                        userPhone: this.$('.phoneNum') .text() .trim(),
                        sessionId: this.sessionid
                    },
                    datatype: "json",
                    success: function(res) {
                        if(res.status == '0') {
                            library.DismissLoadingBar();
                            Backbone.history.navigate(
                                '#my-navigate/bind-new?verifyId=' + res.data.sessionId, {
                                    trigger: true
                                });
                        } else {
                            library.DismissLoadingBar();
                            library.Toast(res.message);
                        }
                    },
                    error: function() {
                        library.DismissLoadingBar();
                        library.Toast('网络错误');
                    }
                }
                if(!this.baseModel) {
                    var BaseModel = require(
                        '../models/BaseModel');
                    this.baseModel = new BaseModel();
                }
                this.baseModel.loadData(options); //请求数据
            } else {
                library.Toast('请输入验证码');
            }
            /* $.ajax({
                 //提交数据的类型 POST GET
                 type: "POST",
                 //提交的网址
                 url: window.app.api + '/validatepassword',
                 //提交的数据
                 data:{userid:JSON.parse(localStorage.getItem('userinfo')).userid,password:passwd},
                 //返回数据的格式
                 datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".

                 //在请求之前调用的函数
                 beforeSend: function () {
                     console.log(this.data);
                 },
                 //成功返回之后调用的函数
                 success: function (res) {
                     if(res.status=='ok'){
                         library.DismissLoadingBar();
                         Backbone.history.navigate('#my-navigate/bind-new?encrypt='+res.data.encrypt+'&passSessionId='+res.data.passSessionId, {
                             trigger: true
                         });
                     }else{
                       library.DismissLoadingBar();
                       library.Toast(res.message);
                     }

                 },
                 //调用执行后调用的函数
                 complete: function (XMLHttpRequest, textStatus) {

                     //HideLoading();
                 },
                 //调用出错执行的函数
                 error: function () {
                   library.DismissLoadingBar();
                     //请求出错处理
                 }
             });*/
            //var num = 0;
            //if(/[0-9]+/.test(username)) num++
            //if(/[a-zA-Z]+/.test(username)) num = num + 2
            //if(/[^0-9a-zA-Z\s\u4e00-\u9fa5]+/.test(username)) num = num + 4
            //if(num>3){
            //  //暂时未认证
            //  if(this.toastTime!=null){
            //    clearTimeout(this.toastTime);
            //  }
            //  $('.login-toast').addClass('login-toast-active');
            //  this.toastTime=setTimeout(function(){
            //    $('.login-toast').removeClass('login-toast-active');
            //  },1000);
            //
            //}
            //else {
            //  Backbone.history.navigate('#my-navigate/bind-new', {
            //      trigger: true
            //  })
            //}
        },
        goBack: function() {
            window.history.back();
        },
    });
});
