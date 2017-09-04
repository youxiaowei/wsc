define(['./PageView', 'require','../libs/wechat'], function(PageView, require, wechat) {
    return PageView.extend({
        type: 'payMode',
        events: {
            'click .header-icon-back': 'onBack',
            'click .balance-select': 'balanceSelect',
            'click .balance-cancel': 'balanceCancel',
            'click .balance-sure': 'balanceSure',
            'click .unionpay-select': 'unionPay',
            'click .wxpay-select': 'wxPay',
            'click .alipay-select': 'aliPay',
            'click .point-select': 'pointPay',
            'click .btn-pay': "toPay"
        },
        initialize: function() {
            var Model = require('../models/PayModel');
            this.payModel = new Model();
            //微信jssdk签名
            this.initWechat();
        },
        onResume: function() {          
            this.toggleBar && this.toggleBar("hide");
            this.$('.bar').show();

            this.orderMap = window.app.createOrderResult;
            console.log(this.orderMap);
            console.log(this.orderMap.orderFee);
            //支付金额为零的情况
            if(this.orderMap.orderFee=="0.00"){
                $(".send-mode-zf").hide();
                $(".payway-wrapper").hide();
            }                       
            // FIXME 测试方便，对象存入loalstorage
            //this.orderMap = this.orderMap || application.getLocalStorage("testmode",true);
            if(!this.orderMap) {
                library.Toast("数据出错");
                window.history.back();
                return;
            }
            //application.setLocalStorage("testmode",this.orderMap);
            if(this.orderMap.orderFee && this.orderMap.orderFee< 0) {
                this.$(".total-pay-num")
                    .text('¥' + 0 + '');
            } else {
                if(!this.orderMap.orderFee){
                    this.$(".total-pay-num")
                        .text('¥' + this.orderMap.parentAmont + '');
                }else{
                    this.$(".total-pay-num")
                        .text('¥' + this.orderMap.orderFee + '');
                }
                
            }
            this.initPayWay();
            window.app.createOrderResult = null;
        },
        initWechat: function(){
            var Model = require('../models/BaseModel');
            var wechatModel = new Model();
            var options = {
                url: window.app.api+'/getSignUrl',
                type: "POST",
                needReset:true,
                data:{
                    url: document.location.origin + document.location.pathname
                },
                success:function(res) {
                    if (res.status == '0') {
                        wechat.init(res.data);
                    }else{
                        library.Toast('JS-SDK签名失败');
                    }
                },
                error:function () {
                    library.Toast('JS-SDK签名失败');
                }
            };
            wechatModel.loadData(options);
        },
        
        
        
        
        //发起微信支付
        payWechat: function(data, orderId){
            var Model = require('../models/BaseModel');
            var wechatModel = new Model();
            var options = {
                url: window.app.api+'/getPrePayId',
                type: "POST",
                needReset:true,
                data: data,
                showLoading: true,
                success:function(res) {
                    if (res.status == '0') {
                        var option = {
                            config: res.data,
                            success:  function(res){
                                Backbone.history.navigate('#my-navigate/order-detail?orderId=' + orderId, {
                                  trigger:true,replace:true
                                });
                            },
                            error: function(res){
                                library.Toast('支付失败');
                                // Backbone.history.navigate('#my-navigate/order-detail?orderId=' +  data.orderId, {
                                //   trigger: true
                                // });
                            },
                        };
                        wechat.chooseWXPay(option);
                        //请求成功，调起微信支付
                    }else{
                        library.Toast('支付签名失败');
                        //微信签名失败
                    }
                },
                error:function () {
                    library.Toast('网络错误');
                }
            };
            wechatModel.loadData(options);
        },
        initPayWay: function() {
            var _this = this;
           // this.$(".unionpay-select")
                //.hide();
            this.$(".wxpay-select")
                .hide();
            this.$(".alipay-select")
                .hide();
            this.$(".balance-select")
                .hide();
            this.$(".point-select")
                .hide();
            var paywayModel = require('../models/BaseModel');
            var payway = new paywayModel();
            payway.loadData({
                path: "/getPayWay",
                type: "POST",
                success: function(data) {
                    if(data.status == "0") {
                        payList = data.data;
                        _this.createPayWayItems(
                            payList);
                    } else {
                        library.Toast("数据出错");
                    }
                }.bind(this),
                error: function() {
                    library.Toast("数据出错");
                }
            });
        },
        createPayWayItems: function(data) {
            //payWayId payWayName
            this.$(".payway-wrapper").html("");
            var firstPayWayItem;
            for(var i = 0, j = data.length; i < j; i++) {
                var item_data = data[i];
                // if(data[i].payWayName=="支付宝") continue;  //暂时屏蔽支付宝
                var pay_item = $("<div data-payid='" + data[
                        i].payWayId +
                    "' class='pay-way-item'>" + data[i]
                    .payWayName + "</div>");
                if(i == 0) {
                    firstPayWayItem = pay_item;
                }
                (function($pay_item, $this, $item_data) {
                    $pay_item.bind("click", function() {
                        $this.initSendWayData(
                            $item_data,
                            $pay_item);
                    });
                })(pay_item, this, item_data);
                this.$(".payway-wrapper").append(pay_item);                    
            }
            this.initSendWayData(data[0], firstPayWayItem);
        },
        payWayInfo: {},
        sendWayInfo: {},
        selectedPayWayItem: null,
        initSendWayData: function(sendItemData, item) {
            //sendway-wrapper
            var _this = this;
            this.payWayInfo = {};
            this.sendWayInfo = {};
            if(this.selectedPayWayItem) {
                this.selectedPayWayItem.removeClass(
                    "pay-way-item-selected");
            }
            this.selectedPayWayItem = item;
            this.selectedPayWayItem.addClass(
                "pay-way-item-selected");
            this.$(".btn-pay")
                .attr("disabled", "disabled");
            this.$(".btn-pay")
                .removeClass("btn-pay-active");
            var sendWayModel = require('../models/BaseModel');
                
            var sendWay = new sendWayModel();
            sendWay.loadData({
                path: "/getSendWay",
                type: "POST",
                data: {
                    payWayId: sendItemData.payWayId
                },
                success: function(data) {
                    if(data.status == "0") {
                        console.log(data)
                        var sendList = data.data;
                        this.payWayInfo =sendItemData;
                            
                        _this.createSendWayItems(
                            sendList);
                        //sendWayId sendWayName
                    }
                }.bind(this),
                error: function() {}
            });
        },
        //
        createSendWayItems: function(data) {
            $(".sendway-wrapper")
                .html("");
            this.$(".btn-pay")
                .removeAttr("disabled");
            var first_send_item_data, first_send_item;
            for(var i = 0, j = data.length; i < j; i++) {
                var send_item_data = data[i];
                var send_item = $("<div data-sendid='" +
                    send_item_data.sendWayId +
                    "' class='pay-way-item'>" +
                    send_item_data.sendWayName +
                    "</div>");
                if(i == 0) {
                    first_send_item_data = send_item_data;
                    first_send_item = send_item;
                }
                (function($send_item, $this,
                    $send_item_data) {
                    $send_item.bind("click", function() {
                        $this.sendWayInfo =
                            $send_item_data;
                        $this.$(".btn-pay")
                            .addClass(
                                "btn-pay-active"
                            );
                        $this.sendWaySelectedClick(
                            $send_item_data,
                            $send_item);
                    });
                })(send_item, this, send_item_data);
                $(".sendway-wrapper")
                    .append(send_item);
            }
            this.sendWaySelectedClick(first_send_item_data,
                first_send_item);
        },
        selectedSendWayItem: null,
        sendWaySelectedClick: function(itemdata, item) {
            this.sendWayInfo = itemdata;
            if(this.selectedSendWayItem) {
                this.selectedSendWayItem.removeClass(
                    "pay-way-item-selected");
            }
            this.selectedSendWayItem = item;
            this.selectedSendWayItem.addClass(
                "pay-way-item-selected");
            this.$(".btn-pay")
                .addClass("btn-pay-active");
        },
        userInfo: null,
        getUserInfo: function() {
            var userid = application.getUserInfo()
                .userid;
            var Model = require("../models/BaseModel");
            var mode = new Model();
            var _this = this;
            var options = {
                path: "/getUserInfo",
                type: "POST",
                data: {
                    userId: userid
                },
                success: function(data) {
                    if(data.status == "0") {
                        this.userInfo = data.data;
                        this.userInfo.userid =
                            userid;
                        this.$(".balance-num")
                            .text("￥" + this.userInfo
                                .myBalance);
                        this.$(".point-num")
                            .text(this.userInfo.myPoints);
                        //application.setUserInfo(this.userInfo);
                    } else {
                        library.Toast("支付方式初始化错误");
                        window.history.back();
                        return;
                    }
                }.bind(this),
                error: function(e) {
                    library.Toast("支付方式初始化错误");
                    window.history.back();
                    return;
                },
            }
            mode.loadData(options);
        },
        onBack: function() {
            window.history.back();
        },
        balanceSelect: function(e) {
            // var myBalance = parseInt(this.userInfo.myBalance);
            // if(this.orderMap.orderFee > myBalance){
            //   library.Toast("余额不足");
            //   return;
            // }
            var balancePayment = this.findComponent(
                "balancePayment");
            balancePayment.$el.show();
        },
        balanceCancel: function() {
            this.findComponent("balancePayment")
                .$el.hide();
        },
        balanceSure: function() {
            //this.paySuccess();
            //return;
            var password = this.$(".balance-password-text")
                .val();
            if(!password) {
                library.Toast("请输入密码");
                return;
            }
            this.toBalancePay(password);
            this.balanceCancel();
        },
        toBalancePay: function(password) {
            var data = {
                userId: this.userInfo.userid,
                payWayId: this.orderMap.paymode.payWayId,
                orderId: this.orderMap.orderInfo.parentSn,
                password: password
            }
            this.payModel.startBalancePay(data, this.balancePayHandle
                .bind(this), "/payByBalance");
        },
        balancePayHandle: function(res) {
            console.log(res);
            if(res && res.status == "0") {
                library.Toast("支付成功");
                this.paySuccess();
            } else {
                library.Toast("支付失败，" + (res ? res.message : ""));
            }
        },
        paySuccess: function() {
            window.app.createOrderResult = this.orderMap;
            navigateTo("#home-navigate/afterPayment", {
                trigger: true
            });
        },
        paySuccess2: function() {
            window.app.createOrderResult = this.orderMap;
//            navigateTo("#home-navigate/afterPayment", {
//                trigger: true
//            });
            Backbone.history.navigate("#home-navigate/afterPayment",{
               trigger:true
                });
        },
        
        
        
        
        
        
        
        
        // 银联支付
        unionPay: function(e) {
            this.preparePay();
        },
        pointPay: function(e) {},
        wxPay: function() {},
        aliPay: function() {},
        payModel: null,
        // 准备支付，获取支付工单--银联订单流水号
        preparePay: function() {
            this.payModel.startPay(this.orderMap.orderInfo.orderId,
                this.payHandle.bind(this),"/getPrePayId");
                
        },
        isWeiXin: function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        toPay: function() {
            //支付金额为零的情况
            
            if(this.orderMap.orderFee=="0.00"){
                library.Toast("支付成功");
                this.paySuccess2();
                return;
            }
            //startPay: function(orderNo,userId,payWapayyId,callback, path)
            console.log(">>>M<<<");
            console.log(this.orderMap);
            var userInfo = window.application.getUserInfo();
            var userid = userInfo ? userInfo.userid : "";
            var parentSn = this.orderMap.billInfo ? this.orderMap.billInfo.parentSn : this.orderMap.orderInfo.parentSn;
            var orderId;
            console.log(parentSn)
            //return;
            if(this.orderMap.orderInfo){
                orderId = this.orderMap.orderInfo.orderId ? this.orderMap.orderInfo.orderId : this.orderMap.orderInfo.parentSn;
            }
            else{
                orderId = this.orderMap.orderId ? this.orderMap.orderId : this.orderMap.parentSn;
            }
            var bodytext;
            if(this.orderMap.suitName){
                bodytext=this.orderMap.suitName; //取套餐名称
            }else if(this.orderMap.productList){
                bodytext=this.orderMap.productList[0].productName; //从订单详情直接跳支付页面，取普通套餐的的名称
            }else if(this.orderMap.orderInfo){
                bodytext=this.orderMap.orderInfo.productInfo.goodsList[0].goodName; //从确认订单跳到支付页面，去普通套餐的名称
            }
            console.log(bodytext);
            if(this.payWayInfo.payWayName == '微信'){
            /*if(this.isWeiXin()){*/
                var openid = sessionStorage.getItem("userOpenid");
                // var openid = "o2DZtuLZdpeJIpp-zQ_CwWtRx_vQ";
                var data = {
                    userId: userid,
                    bodytext:bodytext,
                    payWayId: this.payWayInfo.payWayId,
                    orderId: parentSn,
                    sendWayId: this.sendWayInfo.sendWayId,
                    openId: openid
                };
                if(openid){
                    this.payWechat(data, orderId);
                }else{
                    library.Toast('请在公众号打开微商城下单支付');
                }
                //未来要实现调微信APP支付
            /*}else{
                library.Toast('请在微信浏览器中打开');
            }*/
            }
            if(this.payWayInfo.payWayName == '支付宝'){

                 var data = {
                    userId: userid,
                    bodytext:bodytext,
                    payWayId: this.payWayInfo.payWayId,
                    orderId: parentSn,
                    sendWayId: this.sendWayInfo.sendWayId,
                };
                var Model = require('../models/BaseModel');
                var AlipayModel = new Model();
                options = {
                    //localhost:8080/
                    url: window.app.api +'/getAlipay',
                    type: "get",
                    needReset:true,
                    data: data,
                    showLoading: true,
                    success:function(res) {
                        if (res.status == '0') {
                            //成功请求的话,解析传回来的data,获取相关的appID,公钥,密钥.还有签名.
                            //partner(appid):签约账号.
                            //_input_charset:"UTF-8"
                            //sign_type:"MD5",
                            //sign:这个跟微信的不一样,调用支付宝的方法应该可以生成.
                            //return_url:接下来要去的界面.
                            var option = {
                                config: res.data,
                                success:  function(res){
                                    // 如果请求支付宝成功,这里返回一串链接,直接打开这串链接,进入支付宝的付款界面,
                                },
                                error: function(res){
                                    library.Toast('支付失败');
                                    // Backbone.history.navigate('#my-navigate/order-detail?orderId=' +  data.orderId, {
                                    //   trigger: true
                                    // });
                                },
                            };
                            //新打开一个窗口
                            window.location.href = res.data.url;
                            
                           
                            // Backbone.history.navigate(res.data.url,{
                            //             trigger: true,
                            //             replace: true
                            //         });  
                            // $("body").html(res.data.url);                  
                        }else{
                            library.Toast('支付签名失败');
                        }
                     
                    },
                    error:function () {
                        library.Toast('网络错误');
                    }
                }
                //通过继承自baseModel中类的方法,实现ajax请求,并把回调传入success中.
                AlipayModel.loadData(options);
            }
           if(this.payWayInfo.payWayName =='银联'){
                $("#orderId").val(parentSn);
                console.log(parentSn)
                $("#payWayId").val(this.payWayInfo.payWayId)
                $("#sendWayId").val(this.sendWayInfo.sendWayId)
                var url=window.app.api+"/testDoPay";
                //$("#payId").attr("action","/testDoPay");
                //$("#payId").attr("action",'http://api.gootese.com/testDoPay')
                /*url = location.href
                url = url.substring(location.href.indexOf('//')+2);
                url = "http://"+url.substring(0,url.indexOf('/'));
                $("#payId").attr("action",url+"/testDoPay")*/
                //document.payId.action=window.app.api+"/testDoPay";
                $("#payId").attr("action","http://szlapi.gootese.com/testDoPay");
                $("#payId").submit()
//                this.payModel.startPay( parentSn,
//                    userid, this.payWayInfo.payWayId, this.sendWayInfo
//                    .sendWayId, this.payHandle.bind(this),
//                    "/testDoPay");
            }
        },
        // 支付成功回调
        // res ： {code:0,msg:'支付成功'}
        // code: 0表示支付成功，其他表示失败
        payHandle: function(res) {
            if(res) {
                if(res.code == 0) {
                    library.Toast("支付成功");
                    this.paySuccess();
                    return;
                } else {
                    library.Toast(res ? res.msg : "支付失败");
                }
            } else {
                library.Toast("支付失败，请稍后再试");
            }
        }
    });
});
