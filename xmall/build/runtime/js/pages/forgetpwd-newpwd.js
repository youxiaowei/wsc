/**
 * Created by Zero Zheng on 15/12/01.
 */
define(['require', './PageView'], function(require, PageView) {
    return PageView.extend({
        defaults: {
            toastTime: null
        },
        serverRes: null,
        // 如果想在页面载入时完成工作
        route: function(options) {
            PageView.prototype.route.apply(this, arguments);
        },
        events: {
            'click .btnforget': 'btnforgetClick',
            'click .header-icon-back': 'onBack',
            'click .bd-agree': 'onAgreeClick',
            'click .btnRegister ': 'btnRegisterClick',
            'input .new-input-account': 'numberChange'
        },
        initialize: function(options) {
            PageView.prototype.initialize.apply(this,
                arguments);
            //监听来自组件的点击切换
            this.listenTo(this.findComponent('switchView'),
                'switchClick', this.switchClick);
        },
        render: function() {
            // this.$el.empty();
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onResume: function() {
            this.toggleBar && this.toggleBar('hide');
            this.$('.bar')
                .show();
        },
        pwdChange: function() {
            this.valueChange();
        },
        numberChange: function() {
            //验证码的样式更改
            var $btn = $('.btn-retransmit');
            if(!$btn.hasClass('is-restransit') && $( '.new-input-account') .val() .trim() .length > 0) {
                $btn.removeClass('btn-retransmit-disabled')
                    .addClass('theme-color')
                    .addClass('theme-border-color');
            } else {
                $btn.addClass('btn-retransmit-disabled')
                    .removeClass('theme-color')
                    .removeClass('theme-border-color');;
            }
            //提交按钮的样式更改
            this.valueChange();
        },
        valueChange: function() {
            //var rpwd = this.$el.find('.reg-input-pwd');
            var raccount = this.$el.find(
                '.new-input-account');
            var btn = this.$el.find('.btnRegister');
            if(raccount.val()
                .trim()
                .length > 0) {
                btn.removeAttr("disabled");
                btn.removeClass(
                        'theme-backgorund-color-contrast')
                    .removeClass(
                        'theme-border-color-contrast')
                    .addClass('theme-border-color')
                    .addClass('theme-backgorund-color');
            } else {
                btn.attr("disabled", "disabled");
                btn.addClass(
                        'theme-backgorund-color-contrast')
                    .addClass('theme-border-color-contrast')
                    .removeClass('theme-border-color')
                    .removeClass('theme-backgorund-color');
            }
        },
        sendData: function(url, data, callback) {
            var BaseModel = require('../models/BaseModel');
            var baseModel = new BaseModel();
            var options = {
                type: "POST",
                url: url,
                data: data,
                datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
                success: callback,
                error: function() {}
            }
            baseModel.loadData(options);
        },
        btnRegisterClick: function() {
            var _this = this;
            if($('.new-input-account') .val() .trim() .length < 1) {
                library.Toast('手机号码不能为空');
            } else {
                var num = 0;
                var p = {
                    userPhone: _this.params.mobile,
                    password: $('.new-input-account') .val() .trim(),
                    sessionId: _this.params.passSessionId
                };
                console.log(p);
                this.sendData(window.app.api +
                    '/resetPassword', p,
                    function(res) {
                        if(res.status == '0') {
                            Backbone.history.navigate(
                                '#my-navigate/modify-success', {
                                    trigger: true
                                });
                        } else {
                            library.Toast(res.message);
                        }
                    },
                    function() {
                        library.DismissLoadingBar();
                        library.Toast('网络错误');
                    });
            }
        },
        checkRetransmit: function() {
            var _this = this;
            if($('.btn-retransmit')
                .hasClass('btn-retransmit-disabled')) {
                return;
            }
            //校验手机格式
            if(!this.checkPhone($('.new-input-account')
                    .val()
                    .trim())) {
                var tip = '手机号格式错误';
                this.toastPop(tip);
            } else {
                var $btn = $('.btn-retransmit');
                $btn.html('重新发送（60s）')
                    .addClass('btn-retransmit-disabled')
                    .addClass('is-restransit')
                    .removeClass('theme-color');
                var count = 60;
                var ret = setInterval(function() {
                    --count;
                    if(count == 0) {
                        $btn.html('获取验证码')
                            .removeClass(
                                'btn-retransmit-disabled'
                            )
                            .removeClass(
                                'is-restransit')
                            .addClass('theme-color');
                        clearInterval(ret);
                    } else {
                        $btn.html('重新发送（' + count +
                            's）');
                    }
                }, 1000);
                //alert("aaa");
                //发起请求
                this.sendDate(
                    'http://app.gootese.com/checkMobile', {
                        userPhone: $('.new-input-account')
                            .val()
                            .trim()
                    },
                    function(res) {
                        if(res.code == "success") {
                            this.sendDate(
                                'http://app.gootese.com/sendMobileVcode', {
                                    mobile: $( '.new-input-account' ) .val() .trim()
                                },
                                function(res) {
                                    if(res.code ==
                                        'success') {
                                        alert(res.message);
                                        this.serverRes =
                                            res.data;
                                        console.log(
                                            this
                                            .serverRes
                                        );
                                    }
                                }.bind(this));
                        }
                    }.bind(this))
            }
        },
        callback: function() {},
        sendDate: function(url, data, callback) {
            var options = {
                path: url,
                type: "POST",
                needReset: true,
                data: data,
                datatype: "json",
                success: function(res) {
                    callback(res);
                },
                error: function() {
                    //请求出错处理
                }
            }
            if(!this.baseModel) {
                var BaseModel = require(
                    '../models/BaseModel');
                this.baseModel = new BaseModel();
            }
            this.baseModel.loadData(options);
            /* $.ajax({
                 //提交数据的类型 POST GET
                 type:"POST",
                 //提交的网址
                 url:url,
                 //提交的数据
                 data:data,
                 //返回数据的格式
                 datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                 //在请求之前调用的函数
                 beforeSend:function(){},
                 //成功返回之后调用的函数
                 success:function(res){
                     callback(res);

                 },
                 //调用执行后调用的函数
                 complete: function(XMLHttpRequest, textStatus){

                     //HideLoading();
                 },
                 //调用出错执行的函数
                 error: function(){
                     //请求出错处理
                 }
             });*/
        },
        checkPhone: function(phone) {
            var pattern = /^1[0-9]{10}$/;
            return pattern.test(phone);
        },
        toastPop: function(tip) {
            if(this.toastTime != null) {
                clearTimeout(this.toastTime);
            }
            $('.register-toast-p')
                .html(tip);
            $('.register-toast')
                .addClass('register-toast-active');
            this.toastTime = setTimeout(function() {
                $('.register-toast')
                    .removeClass(
                        'register-toast-active');
            }, 1000);
        },
        onBack: function() {
            window.history.back();
        },
        //onAgreeClick:function(){
        //  if ($('.bd-st').hasClass('bd-st-nocheck')) {
        //    $('.bd-st').removeClass('bd-st-nocheck');
        //  }else {
        //    $('.bd-st').addClass('bd-st-nocheck');
        //  }
        //  //提交按钮的样式更改
        //  this.valueChange();
        //}
    });
});
