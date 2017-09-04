/**
 * Created by Administrator on 2016/6/15.
 */
define(['./PageView', 'require'], function (PageView, require) {
    return PageView.extend({
    	
        events: {
            'click .goback': 'goback',
            'click .goods-label-return': 'goback',
            'click .delivered-list-btn': 'toCreateOrder',
            'click .order-cancel-bill':"orderCancel",
             'click .logistics-tracking':"logisticsTracking",////////////////////////////youxw5
            'click .order-wait-bill':"orderWait",
            'click .delivered-protuct-button':"changeProduction"
        },
        orderId:null,
        productInfoObj:null,
        gbDetailModel:null,
        initialize: function () {
            this.listenTo(this.findComponent('PopupMenu'), "toSearch", this.toSearch.bind(this));//youxw5解释(this监听"PopMenu上的"toSearch"事件，监听成功后callback,)
        },
        menuMore: function (e) {
            this.findComponent("PopupMenu").show();
        },
        toSearch: function (e) {
            this.findComponent("SearchMidPageView").show();
        },
        goback: function (e) {
            window.history.back();
        },
        onResume: function () {
        	this.toggleBar && this.toggleBar("hide");
            if (!this.gbDetailModel) {
                var _Model = require("../models/ConfirmOrderSetCollection");
                this.gbDetailModel = new _Model();
            }
            this.setAjaxOptions();
           /*var _this = this;
            window.setTimeout(function () {
                _this.gbDetailModel.loadData();
            }, 520);*/
        },
        setAjaxOptions: function () {
        	var Model = require('../models/BaseModel');
        	var model = new Model();
        	var _this=this;
            this.orderId = window.application.getQueryString('orderId');
            var userInfo = window.application.getUserInfo();
            var userid = userInfo ? userInfo.userid : "";
            var options = {
                url: window.app.api + "/getShippingRecord",
                showLoading: true,
                data: {
                	orderId: this.orderId
                    //userid: userid,
                },
                success: function (data) {
                    	_this.updateUI(data);
                    	
                }.bind(this),
                error: function (e) {
                    console.log(e || "数据出错");
                }.bind(this)
            };
            model.loadData(options);
        },

        updateUI: function (data) {
            this.productInfoObj = data;
            console.log(data)
            if(data.data){
            	this.setSupportInfo(data.data);
            }else{
            	this.$("#show_nodata_div").show();
            }
        },
        setSupportInfo: function (data) {
            var disListWait = this.$(".scroller-wait");
            disListWait.html("");
            var disListCancel = this.$(".scroller-cancel");
            disListCancel.html("");
            var disListFinish = this.$(".scroller-finish");
            disListFinish.html("");
            for (var i = 0; i < data.length; i++) {
            	if(data[i].orderStatus == 3){
            		disListWait.append(this.getLevelItem(data[i]));
            	}else if(data[i].orderStatus == 4){
            		disListCancel.append(this.getLevelItem(data[i]));
            	}else{
            		disListFinish.append(this.getLevelItem(data[i]));
            	}
            	
            }
        },
        getLevelItem: function (item) {
            var template = library.getTemplate("confirm-order-set-wait.html");
            return template(item);
        },
        //取消订单
        orderCancel:function(e){
        	var isCancel = this.$(e.currentTarget).next().text();
        	if(isCancel == 1){
        		library.Toast("售后申请中，请耐心等待");
        		return;
        	}
        	var billsId = this.$(e.currentTarget).prev().text();
        	var userInfo = window.application.getUserInfo();
            var userid = userInfo ? userInfo.userid : "";
          	var _this=this;
        	var Model = require('../models/BaseModel');
            var cancelModel = new Model();
            var options = {
                url: window.app.api+'/ShippingCancel',
                type: "post",
                needReset:true,
                data:{
                	billsId:billsId,
                	memberId:userid
                },
                success:function(res) {
                	_this.onResume();
                },
                error:function () {
                	
                }
            }
            cancelModel.loadData(options);
        },
        //物流跟踪(youxw5)
        logisticsTracking:function(e){
           var orderId = this.orderId;
            var logisId;
            var billsId = this.$(e.currentTarget).prev().prev().text();
            for ( var i in this.productInfoObj.data) {
                if(billsId == this.productInfoObj.data[i].billsId){
                    logisId = this.productInfoObj.data[i].logisticsNo;
                }
            }//通过billsid
           // var orderId = this.orderId;
           // var logisId=window.application.getQueryString('logisId');
            Backbone.history.navigate(
                "#my-navigate/logiticsDetail?orderId=" +orderId+"&logisId="+ logisId, {
                    trigger: true
            });    
        },

        //确认收货
        orderWait:function(e){
        	var billsId = this.$(e.currentTarget).prev().text();
        	var userInfo =window.application.getUserInfo();
            var userid = userInfo ? userInfo.userid : "";
          	var _this=this;
        	var Model = require('../models/BaseModel');
            var waitModel = new Model();
            var options = {
                url: window.app.api+'/ShippingComplete',
                type: "post",
                needReset:true,
                data:{
                	billsId:billsId,
                	memberId:userid
                },
                success:function(res) {
                	_this.onResume();
                },
                error:function () {
                	
                }
            }
            waitModel.loadData(options);
        },
        //申请换货
        changeProduction:function(e){
        	var billsId =this.$(e.currentTarget).prev().text();
        	var ogid = this.$(e.currentTarget).next().text(); 
        	var item={};
        	for ( var i in this.productInfoObj.data) {
				if(billsId == this.productInfoObj.data[i].billsId){
					item=this.productInfoObj.data[i];
				}
			}
        	item.orderId=this.orderId;
        	var itemProduct={};
        	for ( var i in item.orderGoodsList) {
        		if(ogid == item.orderGoodsList[i].ogid){
        		    itemProduct=item.orderGoodsList[i];
				}
			}
        	if(itemProduct.isSupport==0){
        		library.Toast("售后处理中，请耐心等待");
        		return;
        	}
        	var shopAfterSale={};
        	shopAfterSale.item=item;
        	shopAfterSale.itemProduct=itemProduct;
        	console.log(shopAfterSale)
        	window.app.shopAfterSale=shopAfterSale;
        	window.app.shopAfterSaleType='10200';
        	Backbone.history.navigate(
                    "#my-navigate/applyAfterSale", {
                        trigger: true
            });
        },
        //去提货
        toCreateOrder:function(){
        	Backbone.history.navigate(
                    "#my-navigate/bill-lading?orderId=" +this.orderId, {
                        trigger: true
            });
        }
    });
});