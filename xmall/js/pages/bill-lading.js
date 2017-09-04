/**
 * Created by Administrator on 2016/6/15.
 */
define(['./PageView','require'], function(PageView,require) {
	return PageView.extend({
		events: {
			'click .header-icon-back': 'goback',
			"click #AddressInOrderView": "onChangeAddress",
			"click .send-way": "sendSelector",
			"click .delivered-btn":"createOrder"
		},
		addressModel: null,
		product:null,
		orderMap:{},
		initialize: function() {
			//监听
			this.listenTo(this.findComponent('PopupMenu'));
		},
		goback: function (e) {
			window.history.back();
		},
		//点击更多
		menuMore: function(e) {
			this.findComponent("PopupMenu").show();
		},
		onResume: function() {
			this.orderMap={};
			this.$('.invoice-info').hide();//隐藏发票信息
			this.toggleBar && this.toggleBar("hide");
			// 收货地址选择
			if(window.app.param1) {
				this.addressModel = window.app.param1;
				this.setAddressModel(this.addressModel);
			} else {
				// 获取默认地址
				var info = window.application.getUserInfo();
				console.log(info);
				var _this = this;
				var Address = require('../models/AjaxCollection');
				var address = new Address();
				address.loadData({
					path: '/my-address/list',
					type: "POST",
					needReset: true,
					data: {
						userId: JSON.parse( localStorage.getItem( 'userinfo')) .userid,
						//userId: info.userid;
						index: 1,
						size: 10
					},
					success: function(res) {
						var Model = address.findWhere({
							isdefault: "true"
						}) || address.models[
						                     0];
						_this.addressModel = Model;
						_this.setAddressModel(Model);
					}
				});
			};
			// 配送方式
			this.$('.send-way-value').text("");
            if(window.app.sendmode) {
                this.orderMap.sendmode = window.app.sendmode;
                this.$('.send-way-value').text(window.app.sendmode.sendWayName);
                window.app.sendmode = null;
            }else{
            	this.initdata();
            }
		},
		onChangeAddress: function() {
			Backbone.history.navigate(
					'#home-navigate/addressSelect', {
						trigger: true
					});
		},
		setAddressModel: function(addModel) {
			if(!addModel) return;
			var Model = require('../models/BaseModel');
			var temp = addModel.toJSON();
			localStorage.setItem('receiverRegionId',temp.receiverRegionId);
			var model = new Model(temp);
			model.set('receiverDetailAddress', model.get(
			'receiverProvince') + model.get(
			'receiverCity') + model.get(
			'receiverRegion') + model.get(
			'receiverAddr'));
			this.findComponent('AddressInOrderView')
			.setModel(model, "afterPayment");
		},
		 //选择配送方式
        sendSelector: function(e) {
            Backbone.history.navigate(
                '#home-navigate/distributionMode', {
                    trigger: true
                });
        },
		initdata:function(){
			var _this = this;
			var userInfo = window.application.getUserInfo();
			var userid = userInfo ? userInfo.userid : "";
			orderId = window.application.getQueryString('orderId');
			var model = this.findComponent("GroupBuyListView").collection;
			var options={
					path: '/addBillOfLading',
					type: "POST",
					needReset: true,
					data: {
						memberId: userid,
						orderId:orderId
					},
					success: function(res) {
						if(res.data.goodsListData.length > 0){
							_this.product = res.data
						}else{
							$(".loadmore").hide();
						}
					},
					error:function(res){
					}
			};
			model.loadData(options);
		},
		//生成提货单
		createOrder:function(){
			var _this=this;
			orderId = window.application.getQueryString('orderId');
			var i = 0;
			for ( var j in this.product.selectGoods) {
				if(this.product.selectGoods[i].goodsRestNum != 0){
					i++;
				}
			}
			if(i == 0){
				library.Toast("没有可提的货物", 2000);
				return;
			};
			if(this.addressModel) {
				receiveId = this.addressModel.attributes["addressId"];
				if(!receiveId) {
					library.Toast('请选择收货地址！', 2000);
					return;
				}
			} else {
				library.Toast('请选择收货地址！', 2000);
				return;
			};
			console.log(this.orderMap.sendmode)
			 if(!this.orderMap.sendmode){
	               library.Toast("请选择配送方式");
	               return;
           }
            var reg=/^[0-9]*$/;
			var ogids='';
			var nums='';
			this.$("li").each(function(){
				var num = $(this).find(".num").val();
				var numnum = $(this).find(".numnum").text();
				var ogid = $(this).find(".ogids").text();
				if(num != ""){
					if(!reg.test(num)){
						library.Toast('请输入正整数');
						return false;
					}else if(num > parseInt(numnum)){
						library.Toast('请输入正确的提货数量');
						return false;
					}
					nums +="," + $(this).find(".num").val();
					ogids +=","+$(this).find(".ogids").text();
				}
			});
			if(!ogids){
				library.Toast('数量不能为空');
				return;
			}
			nums=nums.substring(1);
			ogids=ogids.substring(1);
			var Model = require('../models/BaseModel');
			var model = new Model();
			var options={
					path: '/submitShipping',
					type: "POST",
					needReset: true,
					data: {
						addressId:receiveId,
						networkId:"",
						dealerId:"",
						ogids:ogids,
						goodsNums:nums,
						orderId:orderId,
						invoiceTitle:"",
						invoiceContent:"",
						companyName:"",
						shippingId:this.orderMap.sendmode.sendWayId
					},
					success: function(res) {
						if(res.status==0){
							library.Toast('提货单提交成功！', 2000);
							window.history.back();
						}else{
							library.Toast('提交失败！', 2000);
						}
					},
					error:function(res){
					}
			};
			model.loadData(options);
		}

	});
});