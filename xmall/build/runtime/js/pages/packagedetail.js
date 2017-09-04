/**
 * Created by Administrator on 2016/6/15.
 */
define(['./PageView', 'require'], function (PageView, require) {
    return PageView.extend({

        events: {
            'click .goback': 'goback',
            'click .goods-label-return': 'goback',
            'click .header-menu': 'menuMore',
            'click .goods-label-menu': 'menuMore',
            'click .detail-reduce': 'reduceClick',
            'click .detail-add': 'plusClick',
            'click .packagedetail-footer-btn': 'toCreateOrder',
            'click .goods-label-collection': 'toShowView'
            
        },
        gcfNum:1,
        productInfoObj:null,
        initialize: function () {
            this.listenTo(this.findComponent('PopupMenu'), "toSearch", this.toSearch.bind(this));
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
        	this.gcfNum=1;
        	this.$(".center-div").text(this.gcfNum);
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
            this.goodsid = window.application.getQueryString('packageId');
            var userInfo = window.application.getUserInfo();
            var userid = userInfo ? userInfo.userid : "";
            this.gbDetailModel.ajaxOptions = {
                url: window.app.api + "/viewSuit",
                showLoading: true,
                data: {
                    suitId: this.goodsid,
                    //userid: userid,
                },
                
                success: function (data) {
                    if (!data) {
                        library.Toast("数据出错", 2000);
                        window.history.back();
                    } else if (data.status == 'error') {
                        library.Toast(data.message || "该产品可能已下架", 2000);
                        window.history.back();
                    } else {
                        this.updateUI(data);
                    }
                }.bind(this),
                error: function (e) {
                    console.log(e || "数据出错");
                }.bind(this)
            }
        },

        updateUI: function (data) {
            this.productInfoObj = data;
            //$(".group-buy-detail").show();
            if(data.data.IMG_URL.length>0){
            	var carouselCollection = this.findComponent("carousel").collection;
            	var list = [];
            	for (var i = 0; i < data.data.IMG_URL.length; i++) {
            		console.log(data.data.IMG_URL[i].suitImage)
            		list.push({
            			src: data.data.IMG_URL[i].suitImage
            		})
            	}
            	carouselCollection.reset(list);
            }
            this.$(".package-list-title").text(data.data.SUIT_TITLE); //套餐标题
            this.$(".package-list-desc").text(data.data.REMARK); //套餐说明
            this.$(".package-list-price-marketmoney").text("￥"+data.data.SALE_PRICE); //套餐价格
            this.$(".package-list-marketmoney").text("￥"+data.data.MARKET_PRICE); //市场价格
            
            this.setSupportInfo(data.data.SUIT_GOODS);
        },
        setSupportInfo: function (data) {
            var disList = this.$(".scroller");
            disList.html("");
            for (var i = 0; i < data.length; i++) {
                disList.append(this.getLevelItem(data[i]));
            }
        },

        getLevelItem: function (item) {
            var template = library.getTemplate("package-detail-buy-item.html");
            return template(item);
        },
        
        plusClick: function() {
            this.gcfNum++;
            this.gcfChange();
        },
        reduceClick: function() {
            if(this.gcfNum > 1) {
                this.gcfNum--;
            }
            this.gcfChange();
        },
        //购买套餐份数变化
        gcfChange: function() {
            this.$(".center-div").text(this.gcfNum);
        },
        toCreateOrder:function(){
	    	  var userInfo = window.application.getUserInfo();
	          if(!userInfo){
	                Backbone.history.navigate('#my-navigate/login/login', {
	                  trigger: true
	                });
	            return;
	          }
        	var items={}
            items.packageId=this.productInfoObj.data.SUIT_ID;
            items.packageNumber=this.gcfNum;
            items.IMG_URL=this.productInfoObj.data.IMG_URL[0].suitImage;
            items.MARKET_PRICE=this.productInfoObj.data.MARKET_PRICE;
            items.REMARK=this.productInfoObj.data.REMARK;
            items.SALE_PRICE=this.productInfoObj.data.SALE_PRICE;
            items.SUIT_TITLE=this.productInfoObj.data.SUIT_TITLE;
            var shops = [];
            shops.push(items)
            window.app.shopsOrder=shops;
            window.app.createOrderType='10200';
            Backbone.history.navigate("#home-navigate/create-order", {
                trigger: true
              });
        },
        toShowView:function(){
        	if(this.productInfoObj.data.SUIT_DESC){
        		window.app.showView=this.productInfoObj.data.SUIT_DESC;
        		Backbone.history.navigate("#home-navigate/show-view", {
                    trigger: true
                 });
        	}else{
        		library.Toast("暂无图文详情", 2000);
        	}
        }
    });
});