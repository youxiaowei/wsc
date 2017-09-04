define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        type: 'order-detail',
        events: {
            'click .goback': 'goback',
            'click .order-link-seller': 'telClick',
            'click .logistics': 'toLogiDetail',
            'click .order-btm-bar-cell': 'orderOperation',
            'click .header-menu': 'menuMore',
            'click .order-operation1': 'ensureOrder',
        },
        addressModel: null,
        logisModel: null,
        orderInfoModel: null,
        initialize: function() {
            this.listenTo(this.findComponent('PopupMenu'),
                "toSearch", this.toSearch.bind(this));
        },
        menuMore: function(e) {
            this.findComponent("PopupMenu") .show();
        },
        toSearch: function(e) {
            this.findComponent("SearchMidPageView") .show();
        },
        onResume: function() {
        	$(".pay-send-selector").hide();
        	$(".psb-selector").hide();
        	$(".pay-send-selector").hide();
        	$(".order-delivery-fee").hide();
            PageView.prototype.onResume.apply(this, arguments);
            //this.findComponent("PushForYouView").$el.hide();
            this.$(".address-in-order") .hide();
            var OrderInfo = require( '../models/OrderInfoModel');
            this.orderInfoModel = new OrderInfo();
            var orderId = application.getQueryString( "orderId");
            var userId = application.getUserInfo() .userid;
            var options = {
                url: window.app.api+'/getPointOrderDetail',
                data: {
                    orderId: orderId
                   // userId: userId
                },
                showLoading: true,
                needReset: true,
                success: this.onSuccess.bind(this),
                error: this.onError.bind(this)
            }
            this.orderInfoModel.orderId = orderId;
            this.orderInfoModel.loadData(options);
        },
        onSuccess: function(data) {
            this.setAddressInfo();
            this.$(".order-address-icon-right") .hide();
            this.$(".address-in-order") .show();
            this.setProductInfo();
            this.setOrderInfo();
            //this.initHeaderAnime();
            this.$(".send-method-order") .hide();
            this.setOrderLogistModel(this.orderInfoModel.get( 'logisticInfo'));
        },
        setAddressInfo: function() {
            var addModel = require( '../models/OrderAddressModel');
            var addressInfo = this.orderInfoModel.get( 'receiveInfo');
            if(!addressInfo) {
                return;
            }
            //addressInfo.receiverAddr = "测试详细地址";
            this.addressModel = new addModel(addressInfo);
            this.setAddressModel(this.addressModel);
        },
        setOrderLogistModel: function(data) {
            if(data) {
                var _Model = require( '../models/LogisticsModel');
                var lModel = new _Model(data);
                this.setLogisModel(lModel);
            } else {
                this.setLogisModel();
            }
        },
        onError: function() {},
        initHeaderAnime: function() {
            var _this = this;
            var header = this.$el.find(
                "#order_detail_header");
            var home_header_bk = this.$el.find(
                "#order_detail_header_bk");
            if(!header || !header[0]) {
                return;
            }
            var header_height = header[0].offsetHeight;
            var isTouching = false;
            document.body.addEventListener("touchmove",
                function(e) {
                    var diff = header_height - document
                            .body.scrollTop / 4;
                    home_header_bk.css("opacity", (1 -
                    diff / header_height)
                        .toString());
                    isTouching = true;
                });
            document.body.addEventListener("touchend",
                function(e) {
                    isTouching = false;
                });
            window.onscroll = (function(e) {
                if(!isTouching) {
                    var diff = header_height -
                        document.body.scrollTop / 4;
                    home_header_bk.css("opacity", (
                    1 - diff /
                    header_height)
                        .toString());
                }
            });
        },
        setAddressModel: function(addModel) {
            this.findComponent('AddressInOrderView')
                .setModel(addModel);
        },
        setLogisModel: function(model) {
            this.findComponent('LogisticInfoView')
                .setModel(model);
        },
        goback: function(e) {
            window.history.back();
        },
       
        logisticDetail: function() {
            Backbone.history.navigate(
                "#my-navigate/logiticsDetail", {
                    trigger: true
                });
        },
       
        toComment: function() {
            window.app.waitCommentOrder = this.orderInfoModel;
            Backbone.history.navigate(
                '#my-navigate/create-comment', {
                    trigger: true
                });
        },
       
        setProductInfo: function() {
            var productList = this.orderInfoModel.get('productList');
            this.$('.order-product-fee-number')
                .text(this.orderInfoModel.get('orderFee'));
            var items = this.orderInfoModel.get('items');
            this.findComponent('OrderDetailListView').collection.reset(productList);               
            //联系卖家
            // var salerTel = shopInfo.shopTel;
            // $('.order-link-seller').attr('href','tel:'+salerTel);
        },
        setOrderInfo: function() {
            var orderInfo = this.orderInfoModel.attributes;
            this.$('.order-code-value')
                .text(orderInfo.orderCode);
            if(orderInfo.orderDate) {
                this.$('.create-order-time')
                    .text(orderInfo.orderDate);
            } /*else {
                this.$(".order-create-time-sub")
                    .hide();
            }*/
            if(orderInfo.payWayInfo){
                this.$(".detail-pay-method-value")
                    .text(orderInfo.payWayInfo.payWayName);
            }
            if(orderInfo.sendWayInfo){
                this.$(".detail-send-method-value")
                    .text(orderInfo.sendWayInfo ? orderInfo.sendWayInfo
                        .sendWayName : "");
            }

            this.setBillInfo(orderInfo.billInfo);
        },
        setBillInfo: function(result) {
            $(".bill-method-value")
                .empty();
            if(result && result.billTitle) {
                var title = $(
                    "<div class='bill-result-title'></div>"
                );
                var content = $(
                    "<div class='bill-result-content'></div>"
                );
                var resTitle = result.billTitle;
                /*if (resTitle && resTitle.length > 4) {
                 resTitle = resTitle.substring(0, 4) + "...";
                 }*/
                var resContent = result.billContent;
                /*if (resContent && resContent.length > 4) {
                 resContent = resContent.substring(0, 4) + "...";
                 }*/
                title.append(resTitle);
                content.append(resContent);
                $(".bill-method-value")
                    .append(title)
                    .append(content);
            } else {
                $(".bill-method-value")
                    .text("无")
            }
        },
        goback: function() {
            window.history.back();
        },
        toLogiDetail: function() {
            Backbone.history.navigate(
                '#my-navigate/logiticsDetail', {
                    trigger: true
                });
        },
        //确认订单
        ensureOrder: function() {
            param = [];
            leftInfo = {
                leftText: '取消',
                callback: this.ensureOrderCancel.bind(
                    this)
            };
            rightInfo = {
                rightText: '确定',
                callback: this.ensureOrderOK.bind(this)
            }
            param.push(leftInfo);
            param.push(rightInfo)
            library.MessageBox("确认收货", "您确定已收到货？", param);
        },
        ensureOrderOK: function() {
            /*if(!this.orderInfo) {
                return;
            }*/
            this.updateOrder("receive");
        },
        ensureOrderCancel: function(){

        },
        updateOrder: function(type) {
            //收货
            var reqUrl;
            var OrderInfoModel = require(
                '../models/OrderInfoModel');
            var orderModel = new OrderInfoModel();
            var userInfo = window.application.getUserInfo();
            if(!userInfo) {
                library.Toast("您尚未登录，请前往登录", 2000);
                window.history.back();
            }
            var data;

            if(type=="cancel"){
                data = {
                    userId: userInfo.userid,
                    orderId: this.orderInfoModel.get(
                        'orderId')
                }
                reqUrl = orderModel.cancelOrderUrl;
            }
            else if(type=="receive"){
                var orderId = application.getQueryString( "orderId");
                data = {
                    
                    orderId: orderId
                }
                reqUrl = orderModel.receiveCreditOrderUrl;
            }

            var options = {
                url: type ? reqUrl : orderModel
                    .orderInfoUrl,
                data: data,
                success: this.updateOrderSuccess.bind(
                    this),
                error: this.updateOrderCancel.bind(this),
                showLoading: true
            }
            orderModel.loadData(options);
        },
        updateOrderSuccess: function(data) {
            if(data) {
                library.Toast(data.message || "操作成功", 2000);
                //this.orderInfoModel.loadData();
                /*var orderId = application.getQueryString( "orderId");
                var orderStatus = "2";
                Backbone.history.navigate(
                    '#my-navigate/credit-order-detail?orderId='+id+"&orderStatus="+orderStatus
                    , {
                        trigger:true
                    });*/
                this.$(".order-operation1").hide();

            } else {
                library.Toast("操作失败", 2000);
            }
        },
        updateOrderCancel: function() {
            library.Toast("网络出错", 2000);
        },
    });
});
