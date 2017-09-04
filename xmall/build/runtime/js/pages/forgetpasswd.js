/**
 * Created by Zero Zheng on 15/12/01.
 */
define( [ 'require', './PageView' ], function( require, PageView ) {
    return PageView.extend( {
        defaults: {
            toastTime: null
        },
        // 如果想在页面载入时完成工作
        route: function( options ) {
            PageView.prototype.route.apply( this, arguments );
        },
        postRoute: function() {
            /*隐藏tabBar*/
            this.triggerEvent( "barHide" );
        },
        events: {
            'click .btnRegister': 'btnRegisterClick',
            'click .header-icon-back': 'onBack',
            'click .bd-agree': 'onAgreeClick',
            'input #forget-reg-input-pwd': 'pwdChange',
            'input #forget-reg-input-account': 'numberChange',
            'click .btn-retransmit': 'checkRetransmit'
        },
        initialize: function( options ) {
            PageView.prototype.initialize.apply( this,
                arguments );
            //监听来自组件的点击切换
            this.listenTo( this.findComponent( 'switchView' ),
                'switchClick', this.switchClick );
        },
        render: function() {
            // this.$el.empty();
            PageView.prototype.render.apply( this,
                arguments );
            return this;
        },
        onResume: function() {
            this.toggleBar && this.toggleBar( 'hide' );
            this.$( '.bar' )
                .show();
        },
        pwdChange: function() {
            this.valueChange();
        },
        numberChange: function() {
            //验证码的样式更改
            var account = this.$el.find(
                '#forget-reg-input-account' );
            var $btn = $( '.btn-retransmit' );
            if( !$btn.hasClass( 'is-restransit' ) &&
                account.val()
                .trim()
                .length > 0 ) {
                $btn.removeClass( 'btn-retransmit-disabled' )
                    .addClass( 'theme-color' )
                    .addClass( 'theme-border-color' );
            } else {
                $btn.addClass( 'btn-retransmit-disabled' )
                    .removeClass( 'theme-color' )
                    .removeClass( 'theme-border-color' );;
            }
            //提交按钮的样式更改
            this.valueChange();
        },
        valueChange: function() {
            if( $( '#forget-reg-input-pwd' )
                .val()
                .trim()
                .length > 0 && $(
                    '#forget-reg-input-account' )
                .val()
                .trim()
                .length > 0 && !$( '.bd-st' )
                .hasClass( 'theme-backgorund-color' ) ) {
                $( '.btnRegister' )
                    .removeAttr( "disabled" );
                $( '.btnRegister' )
                    .removeClass(
                        'theme-backgorund-color-contrast' )
                    .removeClass(
                        'theme-border-color-contrast' )
                    .addClass( 'theme-border-color' )
                    .addClass( 'theme-backgorund-color' );
            } else {
                $( '.btnRegister' )
                    .attr( "disabled", "disabled" );
                $( '.btnRegister' )
                    .addClass(
                        'theme-backgorund-color-contrast' )
                    .addClass(
                        'theme-border-color-contrast' )
                    .removeClass( 'theme-border-color' )
                    .removeClass( 'theme-backgorund-color' );
            }
        },
        //点击下一步
        btnRegisterClick: function() {
            var _this = this;
            if( $( '#forget-reg-input-account' )
                .val()
                .trim()
                .length < 1 && !_this.checkPhone( $(
                        '#forget-reg-input-account' )
                    .val()
                    .trim() ) ) {
                library.Toast( '手机号码不能为空', 1000 );
            } else if( $( '#forget-reg-input-pwd' )
                .val()
                .length < 1 ) {
                library.Toast( '验证码不能为空', 1000 );
            } else {
                var p = {
                    checkCode: $( '#forget-reg-input-pwd' )
                        .val(),
                    userPhone: _this.mobile,
                    sessionId: _this.sessionid
                };
                library.LoadingBar( '验证中...' );
                this.sendData( window.app.api +
                    '/verifyCheckCode', p,
                    function( res ) {
                        res.status = '0';
                        if( res.status == '0' ) {
                            library.DismissLoadingBar();
                            Backbone.history.navigate(
                                '#my-navigate/forgetpwd-newpwd?passSessionId=' +
                                    res.data.sessionId +
                                '&mobile=' + _this.mobile, {
                                    trigger: true
                                } );
                        } else {
                            library.DismissLoadingBar();
                            library.Toast( res.message );
                        }
                    },
                    function() {
                        library.DismissLoadingBar();
                        library.Toast( '验证码失效，请重新获取' );
                    } );
            }
        },
        //发送验证码
        checkRetransmit: function() {

            //校验手机格式
            if( !this.checkPhone( $(
                        '#forget-reg-input-account' )
                    .val()
                    .trim() ) ) {
                var tip = '手机号格式错误';
                this.toastPop( tip );
            } else { //手机号没问题时请求验证码

                if( $( '.btn-retransmit' )
                        .hasClass( 'btn-retransmit-disabled' ) ) {
                    return;
                }

                var $btn = $(
                    '.btn-retransmit' );
                $btn.html( '重新发送（60s）' ) .addClass( 'btn-retransmit-disabled' )
                    .addClass( 'is-restransit' )
                    .removeClass( 'theme-color' );
                var count = 60;
                var ret = setInterval(
                    function() {
                        --count;
                        if( count == 0 ) {
                            $btn.html( '获取验证码' ) .removeClass( 'btn-retransmit-disabled' )
                                .removeClass( 'is-restransit' )
                                .addClass( 'theme-color' );
                            clearInterval ( ret );
                        } else {
                            $btn.html( '重新发送（' + count + 's）' );
                        }
                    }, 1000 );

                var _this = this;
                this.sendData( window.app.api +
                    '/getVerifyCode', {
                        userPhone: $(
                                '#forget-reg-input-account'
                            )
                            .val()
                            .trim()
                    },
                    function( res ) {
                        if( res.status == '0' ) {
                            /*var $btn = $(
                                '.btn-retransmit' );
                            $btn.html( '重新发送（60s）' ) .addClass( 'btn-retransmit-disabled' )
                                .addClass( 'is-restransit' )
                                .removeClass( 'theme-color' );
                            var count = 60;
                            var ret = setInterval(
                                function() {
                                    --count;
                                    if( count == 0 ) {
                                        $btn.html( '获取验证码' ) .removeClass( 'btn-retransmit-disabled' )
                                            .removeClass( 'is-restransit' )
                                            .addClass( 'theme-color' );
                                        clearInterval ( ret );
                                    } else {
                                        $btn.html( '重新发送（' + count + 's）' );
                                    }
                                }, 1000 );*/
                            //library.Toast(res.);
                            _this.mobile = $( '#forget-reg-input-account' ) .val() .trim();
                            _this.sessionid = res.data.sessionId;
                            //console.log(this.serverRes);
                        } else {
                            library.Toast( res ? res.message : '网络错误' );
                        }
                    }.bind( this ),
                    function( res ) {
                        library.Toast( res ? res.message : '网络错误' );
                    } );
            }
        },
        checkPhone: function( phone ) {
            var pattern = /^1[0-9]{10}$/;
            return pattern.test( phone );
        },
        toastPop: function( tip ) {
            if( this.toastTime != null ) {
                clearTimeout( this.toastTime );
            }
            $( '.register-toast-p' )
                .html( tip );
            $( '.register-toast' )
                .addClass( 'register-toast-active' );
            this.toastTime = setTimeout( function() {
                $( '.register-toast' )
                    .removeClass(
                        'register-toast-active' );
            }, 1000 );
        },
        onBack: function() {
            window.history.back();
        },
        onAgreeClick: function() {
            if( $( '.bd-st' )
                .hasClass( 'theme-backgorund-color' ) ) {
                $( '.bd-st' )
                    .removeClass( 'theme-backgorund-color' );
            } else {
                $( '.bd-st' )
                    .addClass( 'theme-backgorund-color' );
            }
            //提交按钮的样式更改
            this.valueChange();
        },
        sendData: function( url, data, callback, errorcallback ) {
            var BaseModel = require( '../models/BaseModel' );
            var baseModel = new BaseModel();
            var options = {
                type: "POST",
                url: url,
                data: data,
                datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
                success: callback,
                error: errorcallback
            }
            baseModel.loadData( options );
        },
    } );
} );
