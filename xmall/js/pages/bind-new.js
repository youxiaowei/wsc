define(['require', './PageView'], function(require, PageView) {
    return PageView.extend({
        defaults: {
            toastTime: null
        },
        // 如果想在页面载入时完成工作
        route: function(options) {
            PageView.prototype.route.apply(this, arguments);
        },
        postRoute: function() {
            /*隐藏tabBar*/
            this.triggerEvent("barHide");
        },
        events: {
            'click .goback': 'goBack',
            'click .back-btn': 'comeBack',
            'click .btnNext': 'nextStep',
            'click .bind-new-code-btn': 'askForCode',
            'input .phoneNum-input': 'btnStatus',
            'input .code-input': 'btnStatus',
        },
        initialize: function(options) {
            PageView.prototype.initialize.apply(this, arguments);
        },
        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onResume: function() {
            this.toggleBar && this.toggleBar('hide');
            this.$('.bar') .show();
        },
        btnStatus: function() {
            var code = this.$el.find('.code-input')
                .val();
            var phone = this.$el.find('.phoneNum-input')
                .val();
            if(code && phone) {
                if($('.bind-new-code-btn').hasClass('identifyCode-btn-disabled')) {
                    this.$el.find('.submit-btn').removeAttr('disabled');
                    $('.submit-btn').removeClass('theme-backgorund-color-contrast')
                        .removeClass('theme-border-color-contrast');
                    $('.submit-btn').addClass('theme-backgorund-color').addClass('theme-border-color');
                }
            } else {}
        },
        checkPhone: function(phone) {
            var pattern = /^1[0-9]{10}$/;
            return pattern.test(phone);
        },
        askForCode: function() {
            var _this = this;
            //校验手机格式
            var phoneNum = this.$el.find('.phoneNum-input')
                .val();
            if(!this.checkPhone(phoneNum.trim())) {
                library.Toast('手机号格式错误');
            } else {

                var $btn = $('.bind-new-code-btn');

                if($btn.hasClass( 'identifyCode-btn-disabled')) return;

                $btn.html('已获取验证码(30)').addClass('identifyCode-btn-disabled').removeClass('theme-color');
                var count = 30;
                var ret = setInterval(
                    function() {
                        --count;
                        if(count == 0) {
                            $btn.html('获取验证码').removeClass('identifyCode-btn-disabled')
                                .addClass('theme-color');
                            clearInterval(ret);
                        } else {
                            $btn.html('已获取验证码(' + count + 's)');
                        }
                    }, 1000);


                this.sendData(window.app.api +
                    '/getVerifyCode', {
                        userPhone: phoneNum.trim()
                    },
                    function(res) {
                        console.log(res);
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
                                        $btn.html(
                                                '获取验证码'
                                            )
                                            .removeClass(
                                                'identifyCode-btn-disabled'
                                            )
                                            .addClass(
                                                'theme-color'
                                            );
                                        clearInterval
                                            (ret);
                                    } else {
                                        $btn.html(
                                            '已获取验证码(' +
                                            count +
                                            ')'
                                        );
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
        nextStep: function() {
            var code = this.$el.find('.code-input')
                .val();
            var phone = this.$el.find('.phoneNum-input')
                .val();
            var verifyId = this.params.verifyId;
            if(!verifyId){
                library.Toast('请验证原手机号码再进行绑定');
                return ;
            }
            if(code && phone) {
                var userinfo = JSON.parse( localStorage.getItem(
                    'userinfo' ) );
                //上面这里用于测试
                /*下面这段暂时屏蔽，因为没有响应的接口*/
                library.LoadingBar('验证中...');
                var options = {
                    url: window.app.api +
                        '/bandUserPhone',
                    type: "POST",
                    needReset: true,
                    data: {
                        userid: userinfo.userid,
                        checkCode: code,
                        userPhone: phone,
                        sessionId: this.sessionid,
                        verifyId: verifyId
                    },
                    datatype: "json",
                    success: function(res) {
                        if(res.status == '0') {
                            $('.mobile-bind')
                                .hide();
                            $('.success-tips-view')
                                .show();
                            library.DismissLoadingBar();
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
        comeBack: function(e) {
            Backbone.history.navigate('#my-navigate/my', {
                trigger: true
            })
        },
        goBack: function() {
            window.history.back();
        },
    });
});
