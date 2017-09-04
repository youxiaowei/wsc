define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        type: 'order-detail',
        events: {
            'click .goback': 'goback',
            'click .order-link-seller': 'telClick',
            'click .logistics': 'toLogiDetail',
            'click .order-btm-bar-cell': 'orderOperation',
            'click .header-menu': 'menuMore',
        	'click .customer-service-button': 'toSaleService',
        	'click .goods-details-listitem': 'togoods',
		    'click #goods-id':'gogoods'
        },
        addressModel: null,
        logisModel: null,
        orderInfoModel: null,
        orderType :null,
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
            PageView.prototype.onResume.apply(this, arguments);
            //this.findComponent("PushForYouView").$el.hide();
            this.$(".address-in-order") .hide();
           // this.$('.order-detail-info').empty();
            var OrderInfo = require( '../models/OrderInfoModel');
            this.orderInfoModel = new OrderInfo();
            var orderId = application.getQueryString( "orderId");
            var type = application.getQueryString("type");
            this.orderType = type;
            var userId = application.getUserInfo().userid;
            var options = {};
            if(type== "1"){
                 options = {
                    url: window.app.api+'/getWfxOrderDetail',
                    data: {
                        orderSn: orderId,
                    },
                    showLoading: true,
                    needReset: true,
                    success: this.onSuccess.bind(this),
                    error: this.onError.bind(this)
                }
            }else if(type == "2"){
                options = {
                    url: window.app.api + '/getPointOrderDetail',
                    data: {
                        orderId: orderId,
                    },
                    showLoading: true,
                    needReset: true,
                    success: this.onSuccess.bind(this),
                    error: this.onError.bind(this)
                }
            } else {
                 options = {
                    url: this.orderInfoModel.orderInfoUrl,
                    data: {
                        orderId: orderId,
                        userId: userId
                    },
                    showLoading: true,
                    needReset: true,
                    success: this.onSuccess.bind(this),
                    error: this.onError.bind(this)
                }
            }

            this.orderInfoModel.orderId = orderId;
            this.orderInfoModel.loadData(options);
        },
        onSuccess: function(data) {
        	//console.log(JSON.stringify(data));
        	this.$(".order-detail-success-time").text(data.data.describe)
            this.setAddressInfo();
            this.setOrderType();
            this.$(".order-address-icon-right") .hide();
            this.$(".address-in-order") .show();
            this.setOrderStatus();
            this.setProductInfo();
            this.setOrderInfo();
            //this.initHeaderAnime();
            this.$(".send-method-order") .hide();
            this.setOrderLogistModel(this.orderInfoModel.get( 'logisticInfo'));
            //显示隐藏模板
            $(".order-detail").show();
            $(".order-bottom-bar").show();
            $(".order-detail-nothing").hide();
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
        onError: function(res) {
        	 library.Toast(res.message?res.message:"网络错误！")
             $(".order-detail-nothing").show();
            setTimeout(function(){
                window.history.back();
            },2000)
        },
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
        cancelOrder: function() {
        	
            param = [];
            leftInfo = {
                leftText: '取消',
                callback: function() {}
            };
            rightInfo = {
                rightText: '确定',
                callback: this.cancelOrderOk.bind(this)
            }
            param.push(leftInfo);
            param.push(rightInfo)
            library.MessageBox("取消订单", "您确定取消订单吗？", param);
        },
        cancelOrderOk: function() {
            this.updateOrder("cancel");
        },
        // 准备支付，获取支付工单--银联订单流水号
        preparePay: function() {
            var orderInfo = this.orderInfoModel.toJSON();
            window.app.createOrderResult = orderInfo;
            Backbone.history.navigate(
                '#my-navigate/payMode', {
                    trigger:true,replace:true
                });
            // var Model = require('../models/PayModel');
            // var payModel = new Model();
            // payModel.startPay(this.orderInfoModel.get('orderCode'),this.payHandle.bind(this));
        },
        // 支付成功回调
        // res ： {code:0,msg:'支付成功'}
        // code: 0表示支付成功，其他表示失败
        payHandle: function(res) {
            if(res) {
                if(res.code == 0) {
                    library.Toast("支付成功");
                    this.orderInfoModel.loadData();
                } else {
                    library.Toast(res ? res.msg : "支付失败");
                }
            } else {
                library.Toast("支付失败");
            }
        },
        logisticDetail: function() {
            var userInfo = application.getUserInfo();
            var orderId = application.getQueryString( "orderId");
            var logisId = application.getQueryString( "logisId");
            Backbone.history.navigate(
                    "#my-navigate/logiticsDetail?orderId=" +orderId+"&logisId="+ logisId, {
                        trigger: true
                });
                return;
        },
        orderOperation: function(e) {
            var status = this.orderInfoModel.get(
                'orderStatus');
            var isComment = "1";
            var products = this.orderInfoModel.get(
            'productList');
            products.forEach(function(item) {
                if(item.isComment == "0") {
                    isComment = "0";
                }
            })
            var url = "";
            var targetView = $(e.target);
            if(status == "2") { // 支付
                if(targetView.hasClass("order-operation1")) {
                    this.preparePay();
                } else if(targetView.hasClass(
                        "order-operation2")) {
                    this.cancelOrder();
                }
            } else if(status == "3") { // 待发货
            	if(targetView.hasClass("order-operation1")) {
            		
                    this.tuikuan();
                }
            } else if(status == "4") { // 确认订单
                if(targetView.hasClass("order-operation1")) {
                    this.logisticDetail();
                } else if(targetView.hasClass(
                        "order-operation2")) {
                    this.ensureOrder();
                } else if(targetView.hasClass(
                        "order-operation3")) {
                    library.Toast("功能开发中");
                }
            } else if(status == "5") { // 去评价
                if(targetView.hasClass("order-operation1")) {
                	if(isComment == 0){
                		library.Toast("您已经评价过");
                	}else{
                		this.toComment();
                	}
                } else if(targetView.hasClass(
                        "order-operation2")) {
                    library.Toast("功能开发中");
                } else if(targetView.hasClass(
                        "order-operation3")) {
                    this.logisticDetail();
                }
            }else if(status == "6"){
            	if(targetView.hasClass("order-operation1")) {
                    this.buyAgain();
                }
            }
        },
        tuikuan:function(){
        	var orderId = application.getQueryString( "orderId");
        	Backbone.history.navigate(
                    "#my-navigate/cancel-back-money?orderId=" +orderId, {
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
        setOrderType: function() {
            var orderType = this.orderInfoModel.get(
                'orderType');
            var orderStatus = this.orderInfoModel.get(
                'orderStatus');
            if(orderType == 4) {
                this.$(".order-detail-success-time")
                    .hide();
                this.$(".order-detail-success-group-cf")
                    .show();
                if(orderStatus == 9) {
                    this.findComponent("PushForYouView")
                        .$el.show();
                    this.$(".order-fee")
                        .hide();
                    this.$("#AddressInOrderView")
                        .hide();
                    this.$("#LogisticInfoView")
                        .hide();
                    this.$(".order-detail-success-group-cf")
                        .css({
                            "text-align": "left",
                            "padding-left": "15px",
                            "padding-top": "18px",
                            "line-height": "normal"
                        });
                    this.$(".order-detail-success-group-cf")
                        .html(
                        "人数不足，无法成团<div style='font-size:0.3rem;margin-top:0.2rem'>订单已取消，该订单货款会于x天之后退回到您的账户，请您 耐心等待</div>"
                    );
                } else {
                    this.$(".order-detail-success-group-cf")
                        .text("参团成功！");
                }
                this.$(".pay-send-selector")
                    .hide();
                this.$(".order-detail-info")
                    .hide();
                // this.$(".order-bottom-bar").hide();
            } else if(orderType == 5) {
                this.$(".order-detail-success-time")
                    .hide();
                this.$(".order-detail-success-group-cf")
                    .show();
                var mes = "无法达到预期目标,无法众筹";
                this.$(".order-detail-success-group-cf")
                    .text("众筹成功！");
                this.$(".pay-send-selector")
                    .hide();
                this.$(".order-detail-info")
                    .hide();
                this.$(".order-bottom-bar")
                    .hide();
            } else {
                this.$(".order-detail-success-time")
                    .show();
                this.$(".order-detail-success-group-cf")
                    .hide();
            }
        },
        setOrderStatus: function() {
            var products = this.orderInfoModel.get(
                'productList');
            var isComment = "0";
            products.forEach(function(item) {
                if(item.isComment == "1") {
                    isComment = "1";
                }
            })
            var status = this.orderInfoModel.get(
                'orderStatus');
            var url = "";
            var btn1 = $(".order-operation1");
            var btn2 = $(".order-operation2");
            var btn3 = $(".order-operation3");
            btn1.show();
            btn2.show();
            btn3.show();
            $('.pay-send-selector').show();
            this.$('.order-detail').removeClass("wait-send-bottom");
            if(status == "2") {
                btn1.text("立即支付");
                btn2.text("取消订单");
                btn3.hide();
                $('.pay-send-selector').hide();
                this.$(".order-detail-success-time") .text("订单待付款");
            } else if(status == "1") {
                btn1.hide();
                btn2.hide();
                btn3.hide();
                this.$(".order-detail-success-time") .text("订单已取消");
                this.$(".order-bottom-bar")
                    .hide();
                this.$('.order-detail')
                    .css({
                        bottom: 0
                    });
                $('.pay-send-selector').hide();
            } else if(status == "3") {
                //btn1.hide();
            	btn1.text("申请退款");
                btn2.hide();
                btn3.hide();
             //   this.$('.order-detail').addClass("wait-send-bottom");
                this.$(".order-detail-success-time") .text("订单待发货");
            } else if(status == "4") {
            	btn3.hide();
                btn1.text("查看物流");
                btn2.text("确认收货");
                //btn3.text("申请售后");
                this.$(".order-detail-success-time") .text("订单待收货");
            } else if(status == "5") {
                //btn2.text("申请售后");
                btn2.hide();
                if(isComment == '1') {
                    btn1.text("去评价");
                    btn3.hide();
                }
                this.$(".order-detail-success-time") .text("订单交易成功");
            } else if(status == "6"){
            	btn1.text("再次购买");
            	btn2.hide();
            	btn3.hide();
            }else{
                this.$(".order-bottom-bar")
                    .hide();
                this.$('.order-detail')
                    .css({
                        bottom: 0
                    });
            }
            if(this.orderType == "1"||this.orderType == "2"){
                btn3.hide();
                btn1.hide();
                btn2.hide();
            }

        },
        setProductInfo: function() {
            var productList = this.orderInfoModel.get(
                'productList');
            for (var i= 0;i<productList.length;i++){

                if (!productList[i].ogid){
                    productList[i].ogid= "";
                }
                if (!productList[i].specInfo){
                    productList[i].specInfo= "";
                }
            }

            var status = this.orderInfoModel.get(
            'orderStatus');
            this.$('.order-delivery-fee-number')
                .text(this.orderInfoModel.get('deliveryFee'));
            this.$('.order-points-fee-number')
            .text(this.orderInfoModel.get('pointFee'));
            if(this.orderInfoModel.get('deliveryFee')){
                this.$('.order-product-fee-number')
                    .text((this.orderInfoModel.get('orderFee')+this.orderInfoModel.get('deliveryFee')).toFixed(2));
            }else {
                this.$('.order-product-fee-number')
                    .text((this.orderInfoModel.get('orderFee')).toFixed(2));
            }
            var items = this.orderInfoModel.get('items');
            console.log(productList);
         //   var applystate = productList[0].applystate;
           // console.log(applystate);
            console.log(this.findComponent(
                'OrderDetailListView')
                .options);
            this.findComponent('OrderDetailListView')
                .collection.reset(productList);
            var isSupport = productList[0].isSupport;
            if(isSupport == 0){
            	$(".customer-service-button").removeClass("customer-service-button").addClass("customer-service-button-gray");
            }
          //隐藏申请售后按钮
        	if(status != 5){
        		this.$('.customer-service').hide();
        	}
        	
            //联系卖家
            // var salerTel = shopInfo.shopTel;
            // $('.order-link-seller').attr('href','tel:'+salerTel);
        },
        setOrderInfo: function() {
            var orderInfo = this.orderInfoModel.attributes;
            this.$('.order-code-value')
                .text(orderInfo.orderCode);
            if(orderInfo.createTime) {
                this.$('.create-order-time')
                    .text(orderInfo.createTime);
            } else {
                this.$(".order-create-time-sub")
                    .hide();
            }
            if(orderInfo.payTime) {
                this.$('.order-pay-time')
                    .text(orderInfo.payTime);
            } else {
                this.$(".order-pay-time-sub")
                    .hide();
            }
            if(orderInfo.sendTime) {
                this.$('.order-send-time')
                    .text(orderInfo.sendTime);
            } else {
                this.$(".order-send-time-sub")
                    .hide();
            }
            if(orderInfo.successTime) {
                this.$(".order-success-time")
                    .text(orderInfo.successTime);
            } else {
                this.$(".order-success-time-sub")
                    .hide();
            }

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
            var userInfo = application.getUserInfo();
            var orderId = application.getQueryString( "orderId");
            var logisId = application.getQueryString( "logisId");
            Backbone.history.navigate(
                    "#my-navigate/logiticsDetail?orderId=" +orderId+"&logisId="+ logisId, {
                        trigger: true
                });
                return;
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
        toSaleService:function(e){
        	var status = this.orderInfoModel.get(
            'orderStatus');
        	var orderId=this.orderInfoModel.orderId;
            var ogid = this.$(e.currentTarget).parent().parent().find(".goods-details-ogid").text();
            var productId = this.$(e.currentTarget).parent().parent().find(".goods-details-id").text();
            var number = this.$(e.currentTarget).parent().parent().find(".goods-details-number").text();
            number=number.substring(1);
            var productList = this.orderInfoModel.get(
            'productList');
            var isSupport = productList[0].isSupport;
            console.log(isSupport);
            if(isSupport == 1){
        	Backbone.history.navigate(
                    '#my-navigate/applyAfterSale?orderId='+orderId+"&ogid="+ogid+"&productId="+productId+"&number="+number, {
                        trigger: true
                    });
            }
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
                data = {
                    orderId: this.orderInfoModel.get(
                        'orderId')
                }
                reqUrl = orderModel.receiveOrderUrl;
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
                this.orderInfoModel.loadData();
            } else {
                library.Toast("操作失败", 2000);
            }
        },
        gogoods: function(e){
           var goodid=this.$(e.currentTarget).attr('data-goodid');/*商品*/
           Backbone.history.navigate("#home-navigate/itemdetail?goodsid="+goodid,{
	       trigger:true
           });
   
       },
       togoods: function(e){
    	   var productId = this.$(e.currentTarget).find(".goods-details-id").text();
           Backbone.history.navigate("#home-navigate/itemdetail?goodsid="+productId,{
    	       trigger:true
               });
       },
        updateOrderCancel: function() {
            library.Toast("网络出错", 2000);
        },
        buyAgain:function(){
        	var productList = this.orderInfoModel.get('productList');
        	Backbone.history.navigate(
                    "#my-navigate/itemdetail?goodsid=" +productList[0].productId, {
                        trigger: true
                });
        }
    });
});
