// author Vicent
// 全部订单页面
define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        type: 'order-list',
        events: {
            "click .goback": "goback",
            "click a": "onSelect",
            "click li": "onRowSelect",
            "click .order-type-selector-btn": "typeSelector",
            "click .header-menu": "menuMore",
            "click .order-type-selector": "closeTypeSelector",
            "click .order-type-selector-cover": "closeTypeSelector",
            "click .order-type-selector-menu": "typeItemSelected"
        },
        orderTypeList: [0, 2, 3, 4, 5],
        listCollection: null,
        list_type: null,
        indexTab: 0,
        userInfo: null,
        initialize: function() {
            this.listenTo(this.findComponent('PopupMenu'),
                "toSearch", this.toSearch.bind(this));
        },
        addDate: function(date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            return d.getFullYear() + '-' + this.zeroAdd(m) +
                '-' + this.zeroAdd(d.getDate());
        },
        zeroAdd: function(s) {        
            return s < 10 ? '0' + s : s;
        },
        menuMore: function(e) {
            this.findComponent("PopupMenu")
                .show();
        },
        toSearch: function(e) {
            this.findComponent("SearchMidPageView")
                .show();
        },
        typeSelector: function(e) {
            $(".order-type-selector")
                .removeClass("order-type-selector-hide");
            $(".order-type-selector-icon")
                .removeClass("icomoon-pulldown")
                .addClass("icomoon-pullup");
        },
        closeTypeSelector: function() {
            $(".order-type-selector")
                .addClass("order-type-selector-hide");
            $(".order-type-selector-icon")
                .removeClass("icomoon-pullup")
                .addClass("icomoon-pulldown");
        },
        typeItemSelected: function(e) {
            var targetView = $(e.target);
            var data = targetView.attr("data-name");
            if(!data) {
                return;
            }
            this.$('.common-title').text(targetView.text());
                
            this.setOrderType(data);
            this.closeTypeSelector();
            	this.listCollection.filterType(targetView.attr("data-index"));
        },
        setOrderType: function(type) {
            $(".selector-item")
                .removeClass("selector-item-selected");
            if(type == "allDay") {
            	$(".item-all-day")
            	.addClass("selector-item-selected");
            }else if(type == "sameDay") {
                $(".item-order-day")
                    .addClass("selector-item-selected");
            } else if(type == "sameWeek") {
                $(".item-order-week")
                    .addClass("selector-item-selected");
            } else if(type == "sameMonth") {
                $(".item-order-month")
                    .addClass("selector-item-selected");
            } else if(type == "sameMonthAgo") {
                $(".item-order-monthago")
                    .addClass("selector-item-selected");
            }
        },
        onResume: function() {
            //微信登录
        	this.toggleBar && this.toggleBar("hide");
            var Model = require('../models/BaseModel');
            var listType = application.getQueryString(
            "list_type");
            this.userModel = new Model();
            var url_arr = window.location.href.split("?");
            var list = url_arr[1].split("=");
            //微信登录登录获取用户信息
            if(window.location.href.indexOf("?")>0 && list[0]!="list_type"){
              library.wechatLoad(url_arr,this.userModel);
              window.history.pushState({},0,url_arr[0].toString());
            }
            //重复调用刷新，导致地址栏参数丢失
//            PageView.prototype.onResume.apply(this,
//                arguments);
            if(listType) {
                this.indexTab = listType;
            } else {
                this.indexTab = 0;
            }
            this.$('.order-list-title')
                .text("全部订单");
            this.initData();
        },
        setActive: function(index) {
            this.$("a")
                .removeClass('segmented-item-active')
                .removeClass('theme-color')
                .removeClass('theme-border-color');
            this.$("a[data-index='" + index + "']")
                .addClass('segmented-item-active')
                .addClass('theme-color')
                .addClass('theme-border-color');
            var str = "#my-navigate/order-list?list_type=" + index;
            Backbone.history.navigate(str, {
                trigger: true
            });
        },
        onRender: function() {
            $('.add-blank-leaving-icon')
                .removeClass("icomoon-without")
                .removeClass("add-blank-leaving-icon");
            $('.add-blank-leaving-words')
                .text("")
                .removeClass("add-blank-leaving-words");
            $("#AllOrderListView")
                .show();
        },
        initData: function() {
            this.listCollection = this.findComponent(
                    'AllOrderListView')
                .collection;
            this.userInfo = window.application.getUserInfo();
            if(!this.userInfo) {
                library.Toast("您尚未登录，请前往登录", 2000);
                window.history.back();
            }
            this.listCollection.queryData = {
                userId: this.userInfo.userid,
                status: this.orderTypeList[this.indexTab] + "",
                type: "",
                index: 1,
                size: 10
            }
            $('.add-blank-leaving-icon')
                .removeClass("icomoon-without")
                .removeClass("add-blank-leaving-icon");
            $('.add-blank-leaving-words')
                .text("")
                .removeClass("add-blank-leaving-words");
            $("#AllOrderListView")
                .show();
            this.listCollection.loadData({
                url: this.listCollection.allOrderUrl,
                data: this.listCollection.queryData,
                needReset: true,
                showLoading: true,
                success: this.onSuccess.bind(this),
                error: this.onError.bind(this)
            });
        },
        onSuccess: function(data) {
            if(data && data.status != '0') {
                library.Toast("网络错误，请稍后再试", 2000);
            }
            console.log(data.data);
            this.setPageStatus();
        },
        onError: function() {
            library.Toast("抱歉，网络错误", 2000);
            this.setPageStatus();
        },
        setPageStatus: function() {
            if(!this.listCollection.length || this.listCollection
                .length == 0) {
                $("#AllOrderListView")
                    .hide();
                var blankicon = $(
                    "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还没有相关订单哟~</div>"
                );
                $('.add-blank-leaving-icon')
                .removeClass("icomoon-without")
                .removeClass("add-blank-leaving-icon");
                $('.add-blank-leaving-words')
                .text("")
                .removeClass("add-blank-leaving-words");
                $(".order-list")
                    .append(blankicon);
            } else {
                $("#AllOrderListView")
                    .show();
                $(".icomoon-without")
                    .remove();
                $(".add-blank-leaving-words")
                    .remove();
            }
            this.setActive(this.indexTab);
        },
        onSelect: function(event) {
            $('.add-blank-leaving-icon')
                .removeClass("icomoon-without")
                .removeClass("add-blank-leaving-icon");
            $('.add-blank-leaving-words')
                .text("")
                .removeClass("add-blank-leaving-words");
            $("#AllOrderListView")
                .show();
            var index = $(event.target)
                .attr('data-index');
            this.indexTab = index;
            this.listCollection.filterData(this.orderTypeList[index]);
        },
        onRowSelect: function(e) {
            var index = $(e.currentTarget) .index();
            this.orderInfo = this.listCollection.models[index];
            var orderId = this.orderInfo.get('orderId');
            var productList = this.orderInfo.get('productList');
            var orderStatus = this.orderInfo.get('orderStatus');
            if($(e.target)
                .data('name') == 'ensureOrder') {
                //确认收货
                this.ensureOrder();
                return;
            } else if($(e.target)
                .data('name') == 'cancelOrder') {
                // 取消订单
                this.cancelOrder();
                return;
            } else if($(e.target)
                .data('name') == 'payOrder') {
                // 去支付 TODO
                this.preparePay();
                return;
            } else if($(e.target)
                .data('name') == 'addComment') {
                // 去评论
                this.addComment();
                return;
            } else if($(e.target)
                .data('name') == 'shouhou') {
                // 去售后
                this.goApplyAfterSale(orderId);
                return;
            }else if($(e.target)
                .data('name') == 'checkLog'){
                //查看物流
                var logisId = this.orderInfo.get('logisticId');
                Backbone.history.navigate(
                    "#my-navigate/logiticsDetail?orderId=" +orderId+"&logisId="+ logisId, {
                        trigger: true
                });
                return;
            }else if($(e.target)
                .data('name') == 'tuihuo'){
            	if(orderStatus == 6){
            		library.Toast("退款处理中，请耐心等待", 2000);
            		return;
            	}
            	Backbone.history.navigate(
                        "#my-navigate/cancel-back-money?orderId=" +orderId, {
                            trigger: true
                    });
            	return;
            }else if($(e.target).data('name') == 'buyAgain'){
            	Backbone.history.navigate(
                        "#my-navigate/itemdetail?goodsid=" +productList[0].productId, {
                            trigger: true
                    });
            	return;
            }
            var logisId = this.orderInfo.get('logisticId');
            Backbone.history.navigate(
                "#my-navigate/order-detail?orderId=" +orderId+"&logisId="+ logisId, {
                    trigger: true
                })
        },
        //去申请售后
        goApplyAfterSale: function(orderId) {
            Backbone.history.navigate(
                "#my-navigate/applyAfterSale?orderId=" +
                orderId, {
                    trigger: true
                })
        },
        // 准备支付，获取支付工单--银联订单流水号
        preparePay: function() {
            var orderInfo = this.orderInfo.toJSON();
            window.app.createOrderResult = orderInfo;
            window.app.createOrderResult.parentOrderCode =
                orderInfo.orderCode;
            Backbone.history.navigate(
                '#my-navigate/payMode?fee=' + (
                    orderInfo.orderFee || 900), {
                    trigger: true,
                    replace: true
                });
            // var Model = require('../models/PayModel');
            // var payModel = new Model();
            // payModel.startPay(this.orderInfo.get('orderCode'),this.payHandle.bind(this));
        },
        // 支付成功回调
        // res ： {code:0,msg:'支付成功'}
        // code: 0表示支付成功，其他表示失败
        payHandle: function(res) {
            if(res) {
                if(res.code == 0) {
                    library.Toast("支付成功");
                    this.listCollection.reloadData(); // 刷新数据
                } else {
                    library.Toast(res ? res.msg : "支付失败");
                }
            } else {
                library.Toast("支付失败");
            }
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
            if(!this.orderInfo) {
                return;
            }
            this.updateOrder("cancel");
        },
        addComment: function() {
            window.app.waitCommentOrder = this.orderInfo;
            Backbone.history.navigate(
                '#my-navigate/create-comment', {
                    trigger: true
                });
        },
        updateOrderFinished: function() {
            this.findComponent('AllOrderListView')
                .collection.reset();
        },
        orderInfo: null,
        //确认订单
        ensureOrder: function() {
            param = [];
            leftInfo = {
                leftText: '取消',
                callback: function() {}
            };
            rightInfo = {
                rightText: '确定',
                callback: this.updateOrderOK.bind(this)
            }
            param.push(leftInfo);
            param.push(rightInfo)
            library.MessageBox("确认收货", "您确定已收到货？", param);
        },
        updateOrderOK: function() {
            if(!this.orderInfo) {
                return;
            }
            this.updateOrder("update");
        },
        updateOrder: function(status) {
            //收货
            var OrderInfoModel = require(
                '../models/OrderInfoModel');
            var orderModel = new OrderInfoModel();
            var sendData = {
                orderId: this.orderInfo.get('orderId'),
                parentSn: this.orderInfo.get('parentSn'),
                userId: application.getUserInfo().userid
            }
            var _this = this;
            var options = {
                data: sendData,
                success: function(data){
                    if(data) {
                        if(status == 'cancel') {
                            library.Toast(data.message || "取消成功", 2000);
                        }else{
                            library.Toast(data.message || "确认收货成功", 2000);
                        }
                    } else {
                        library.Toast("取消订单失败，网络错误", 2000);
                    }
                    $('.add-blank-leaving-icon')
                        .removeClass("icomoon-without")
                        .removeClass("add-blank-leaving-icon");
                    $('.add-blank-leaving-words')
                        .text("")
                        .removeClass("add-blank-leaving-words");
                    $("#AllOrderListView")
                        .show();
                    _this.listCollection.reloadData();
                },
                error: function(){
                    library.Toast("网络出错", 2000);
                },
                showLoading: true
            }
            if(status == 'cancel') {
                options.url = orderModel.cancelOrderUrl;
            } else { // 确认收货
                options.url = orderModel.receiveOrderUrl;
            }
            orderModel.loadData(options);
        },
        goback: function() {
        	window.location.href="#my-navigate";
        },
    });
});
