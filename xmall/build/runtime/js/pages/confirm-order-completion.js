
/**
 * Created by Administrator on 2016/6/15.
 */
define(['./PageView','require'], function(PageView,require) {
	return PageView.extend({
		events: {
			'click .header-icon-back': 'goback',
			'click .evaluate-appraise': 'addComment', //去评价
			'click .evaluate-checkout': 'cancelPayMoney',  //申请退款
			'click .evaluate-getpackage': 'getPackage',  //提货
			'click .evaluate-cancel': 'toCancelOrder', //取消订单
			'click .evaluate-list': 'showList', //查看提货记录
			'click .evaluate-topay': 'toPay',//去支付
			'click .customer-comment':'addPackageComment',//去评价
			'click .customer-service-sale':'toSaleAfter',	
			'click .evaluate-checkLog':'checkLog',	//查看物流
			'click .evaluate-ensureOrder':'ensureOrder',	//确认收货
			'click .evaluate-buyAgain':'buyAgain'	//再次购买

		},
		productInfoObj:null,
		gbDetailModel:null,
		initialize: function () {
			this.listenTo(this.findComponent('PopupMenu'));
		},
		menuMore: function (e) {
			this.findComponent("PopupMenu").show();
		},
		goback: function (e) {
			window.history.back();
		},
		onResume: function () {
			this.$(".evaluate").hide();//隐藏所有按钮
			PageView.prototype.onResume.apply(this, arguments);
			$(".product-bottom-bar").show();
			if (!this.gbDetailModel) {
				var _Model = require("../models/GoodDetailModel");
				this.gbDetailModel = new _Model();
			}
			this.setAjaxOptions();
			var _this = this;
			window.setTimeout(function () {
				_this.gbDetailModel.loadData();
			}, 520);
		},
		setAjaxOptions: function () {
			var _this=this;
			this.goodsid = window.application.getQueryString('orderId');
			var suitId = window.application.getQueryString('suitId');
			var userInfo = window.application.getUserInfo();
			var userid = userInfo ? userInfo.userid : "";
			this.gbDetailModel.ajaxOptions = {
					url: window.app.api+'/getOrderDetail',
					showLoading: true,
					data: {
						orderId: this.goodsid,
						userId: userid,
						suitId:suitId
					},
					success: function (data) {
						if (!data) {
							library.Toast("数据出错", 2000);
							window.history.back();
						} else {
							_this.updateUI(data);
						}
					}.bind(this),
					error: function (e) {
						console.log(e || "数据出错");
					}.bind(this)
			}
		},

		updateUI: function (data) {
			this.productInfoObj = data;
			this.$("#confirm-name").text(data.data.receiveInfo.receiver);
			this.$(".order-address-user-phone").text(data.data.receiveInfo.receiverPhone);
			this.$("#confirm-address").text(data.data.receiveInfo.receiverDetailAddress);
			this.$('.confirm-order-completion').text("订单"+data.data.describe)
			this.$(".package-list-title").text(data.data.suitName); //套餐标题
			this.$(".confirm-order-img").attr("src",data.data.suitImages[0].suitImage)//套餐图片
			this.$("#packageDetailDesc").text(data.data.remark); //套餐说明
			this.$(".package-list-money").text("￥"+data.data.suitPrice); //套餐价格
			this.$(".monney-fee").text("￥"+data.data.deliveryFee); //运费
			this.$(".monney-points").text("￥"+data.data.pointFee); //积分抵款
			this.$(".money-total").text("￥"+data.data.orderFee); //总价格
			this.$(".order-code-value").text(data.data.orderCode); //订单编号
			this.$(".create-order-time").text(data.data.createTime); //创建时间
			this.$(".order-pay-time").text(data.data.payTime); //付款时间
            //改商品对象里面添加是否是10200套餐的判断
			if(data.data.suitType == 1){
				for ( var i in data.data.productList) {
					
				}
			}
			this.setSupportInfo(data.data);
			

			if(data.data.orderStatus==2){
				this.$(".evaluate-cancel").show();//取消订单
				this.$(".evaluate-topay").show();//去支付
			}else if(data.data.orderStatus==3){
				if(data.data.suitType==1){
					if(data.data.ladingFlag == 1){
						this.$(".evaluate-checkout").hide();//申请退款
					}else{
						this.$(".evaluate-checkout").show();//申请退款
					}
					this.$(".evaluate-getpackage").show();//提货
					this.$(".evaluate-list").show();//提货记录
				}else{
					this.$(".evaluate-checkout").show();//申请退款
				}
			}else if(data.data.orderStatus==4){	
				if(data.data.suitType==1){
					this.$(".evaluate-list").show();//提货记录
				}else{
					this.$(".evaluate-ensureOrder").show();//确认收货
					this.$(".evaluate-checkLog").show();//查看物流
				}
				
			}else if(data.data.orderStatus==5){
				this.$(".evaluate-list").show();//提货记录
				this.$('.customer-service').show(); //显示售后和去评价按钮
			}else if(data.data.orderStatus==6){
				this.$('.evaluate-buyAgain').show();  //显示再次购买的按钮
			}
		},
		setSupportInfo: function (data) {
			var disList = this.$(".scroller");
			disList.html("");
			for (var i = 0; i < data.productList.length; i++) {
				data.productList[i].suitType=data.suitType;
				disList.append(this.getLevelItem(data.productList[i]));
			}
		},

		getLevelItem: function (item) {
			var template = library.getTemplate("confirm-order-completion-item.html");
			return template(item);
		},
		//查看提货记录
		showList:function(){
			var orderId=this.productInfoObj.data.orderId;
			Backbone.history.navigate(
                    "#my-navigate/confirm-order-set?orderId=" +orderId, {
                        trigger: true
                });
		},
		//提货
		getPackage:function(){
			var orderId=this.productInfoObj.data.orderId;
			console.log(orderId)
			Backbone.history.navigate(
                    "#my-navigate/bill-lading?orderId=" +orderId, {
                        trigger: true
                });
		},
		//取消订单
		toCancelOrder:function(){
			var orderId=this.productInfoObj.data.orderId;
			Backbone.history.navigate(
                    "#my-navigate/cancel-order-reason?orderId=" +orderId, {
                        trigger: true
                });
		},
		//去支付
		toPay:function(){
			var orderInfo =this.productInfoObj.data;
			window.app.createOrderResult = orderInfo;
			Backbone.history.navigate(
	                '#my-navigate/payMode', {
	                    trigger: true
	                })
		},
		//申请退款
		cancelPayMoney:function(){
			var orderId=this.productInfoObj.data.orderId;
			var suitId = this.productInfoObj.data.suitId;
			Backbone.history.navigate(
                    "#my-navigate/cancel-back-money?orderId=" +orderId+"&suitId="+suitId, {
                        trigger: true
                });
		},
		//去评价
		addPackageComment:function(e){
			var ogid = this.$(e.currentTarget).next().text();
			console.log(ogid)
			var item={};
			for (var i in this.productInfoObj.data.productList) {
				if(ogid == this.productInfoObj.data.productList[i].ogid){
					item=this.productInfoObj.data.productList[i];
				}
			}
			item.orderId=this.productInfoObj.data.orderId;
			if(item.isComment==0){
				library.Toast("评价已完成", 2000);
				return;
			}
			var productList=[];
			productList.push(item);
			window.app.waitCommentOrderType='10200';
			window.app.waitCommentOrder=productList;
            Backbone.history.navigate(
                '#my-navigate/create-comment', {
                    trigger: true
                });
		},
		//申请售后
		toSaleAfter:function(e){
			var orderId=this.productInfoObj.data.orderId;
			var ogid = this.$(e.currentTarget).prev().text();
			var item={};
			for ( var i in this.productInfoObj.data.productList) {
				if(ogid == this.productInfoObj.data.productList[i].ogid){
					item=this.productInfoObj.data.productList[i];
				}
			}
			if(item.isSupport==0){
				library.Toast("正在售后中，请耐心等待", 2000);
				return;
			}
			var productId=item.productId;
			var number=item.number;
        	Backbone.history.navigate(
                    '#my-navigate/applyAfterSale?orderId='+orderId+"&ogid="+ogid+"&productId="+productId+"&number="+number, {
                        trigger: true
                    });
		},
		//查看物流
		checkLog:function(){
			var orderId=this.productInfoObj.data.orderId;
			var logisId=this.productInfoObj.data.logisId;
            Backbone.history.navigate(
                "#my-navigate/logiticsDetail?orderId=" +orderId+"&logisId="+ logisId, {
                    trigger: true
            });
		},
		//再次购买
		buyAgain:function(){
			var suitId=this.productInfoObj.data.suitId;
			Backbone.history.navigate(
                    "#my-navigate/packagedetail?packageId=" +suitId, {
                        trigger: true
                });
		},
		//确认收货
		ensureOrder:function(){
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
		updateOrderOK:function(){
			if(!this.productInfoObj.data){
				return;
			}
            this.updateOrder("update");
		},
        updateOrder: function(status) {
        	var userInfo = window.application.getUserInfo();
            //收货
            var OrderInfoModel = require(
                '../models/OrderInfoModel');
            var orderModel = new OrderInfoModel();
            var sendData = {
                orderId: this.productInfoObj.data.orderId,
                parentSn: this.productInfoObj.data.billInfo.parentSn,
                userId: userInfo.userid
            }
            var _this = this;
            var options = {
                data: sendData,
                success: function(data){
	                    if(data) {
	                        library.Toast("确认收货成功", 2000);
	                    } else {
	                        library.Toast("确认收货失败，网络错误", 2000);
	                    }
                        _this.gbDetailModel.loadData();
                    },
                error: function(){
                    library.Toast("网络出错", 2000);
                },
                showLoading: true
            }
            // 确认收货
            options.url = orderModel.receiveOrderUrl;
            orderModel.loadData(options);
        }
	});
});