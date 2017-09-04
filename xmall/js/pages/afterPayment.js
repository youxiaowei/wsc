define(['./PageView','require'], function(PageView,require){
    return PageView.extend({
    events:{
      'click .icomoon-back': 'onBack',
      "click .icomoon-moremore":"menuMore",
      "click .left-button":"toOrderDetail",
      "click .right-button":"toShareMenu",
    },
    orderMap:{},
    orderId:null,
    suitId:null,
    productInfo:null,
    createOrderResult:null,
    initialize: function(){
       this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },

    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    onBack:function(){
      this.onRemove();
       Backbone.history.navigate("#home-navigate/",{
          trigger:true
        });
    },

    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
      this.createOrderResult = window.app.createOrderResult;
      // FIXME 测试方便，对象存入loalstorage
      //this.createOrderResult = this.createOrderResult || application.getLocalStorage("testresult",true);
      if(!this.createOrderResult){
        window.history.back();
        return;
      }
      console.log(this.createOrderResult);
      //application.setLocalStorage("testresult",this.createOrderResult);
      this.productInfo = this.createOrderResult.orderInfo.productInfo;
      this.orderId = this.createOrderResult.orderInfo.orderId;
      this.suitId = this.createOrderResult.orderInfo.productInfo.suitId;
      if(window.app.createOrderType == 5){// 团购
        this.$(".paysuccess-common-order").hide();
        this.$(".paysuccess-group-cf-order").show();
        this.$(".group-cf-order-des").text("参团成功，请您耐心等待订单后续通知");
      }else if (window.app.createOrderType == 6){// 众筹
        this.$(".paysuccess-common-order").hide();
        this.$(".paysuccess-group-cf-order").show();
        this.$(".group-cf-order-des").text("众筹成功，请您耐心等待订单后续通知");
      }else if(this.suitId){
        this.$(".paysuccess-common-order").show();
        this.$(".paysuccess-group-cf-order").hide();
        this.setSuitOrderInfo();       
      }else if(this.orderId){
    	  this.$(".paysuccess-common-order").show();
          this.$(".paysuccess-group-cf-order").hide();
          this.setCommonOrderInfo();
      }
      window.app.createOrderResult = null;
    },
    // 普通订单
    setCommonOrderInfo: function(){
    	var taoc={};
    	taoc.discountPrice=this.productInfo.discountPrice;
    	taoc.freightPrice=this.productInfo.freightPrice;
    	taoc.isSuit=this.productInfo.isSuit;
    	/*taoc.suitId=this.productInfo.suitId;*/
    	taoc.suitNumber=this.productInfo.suitNumber;
    	taoc.totalPrice=this.productInfo.totalPrice;
    	var items=[];
    	for(var i=0;i<this.productInfo.goodsList.length;i++){
    		var listItem = {};
    		 listItem.goodName=this.productInfo.goodsList[i].goodName;
    		 listItem.goodsId=this.productInfo.goodsList[i].goodsId;
    		 listItem.goodsImage=this.productInfo.goodsList[i].goodsImage;
    		 listItem.goodsPrice=this.productInfo.goodsList[i].goodsPrice;
    		 listItem.goodsSpec=this.productInfo.goodsList[i].goodsSpec;
    		 listItem.isDiscount=this.productInfo.goodsList[i].isDiscount;
    		 listItem.number=this.productInfo.goodsList[i].number;
    		 listItem.startTime=this.productInfo.goodsList[i].startTime;
    		 items.push(listItem);
    		
    	}
    	taoc.items=items; 
      this.setAddressModel(this.createOrderResult.orderInfo.addressModel);
      this.findComponent('OrderShopListView').collection.reset(taoc);
      this.$(".shop-info").css({"margin-top":"0"});

      this.$(".paid-number").text("￥"+this.createOrderResult.orderFee);
      this.$(".jifen-paid-number").text("￥"+this.createOrderResult.orderInfo.productInfo.totalPrice);
    },
    
    
    //套餐订单
    setSuitOrderInfo: function(){
    	var taoc={};
    	taoc.discountPrice=this.productInfo.discountPrice;
    	taoc.freightPrice=this.productInfo.freightPrice;
    	taoc.isSuit=this.productInfo.isSuit;
    	/*taoc.suitId=this.productInfo.suitId;*/
    	taoc.suitNumber=this.productInfo.suitNumber;
    	taoc.totalPrice=this.productInfo.totalPrice;
    	var items=[];
    	for(var i=0;i<this.productInfo.goodsList.length;i++){
    		var listItem = {};
    		 listItem.goodName=this.productInfo.goodsList[i].goodName;
    		 listItem.goodsId=this.productInfo.goodsList[i].goodsId;
    		 listItem.goodsImage=this.productInfo.goodsList[i].goodsImage;
    		 listItem.goodsPrice=this.productInfo.goodsList[i].goodsPrice;
    		 listItem.goodsSpec=this.productInfo.goodsList[i].goodsSpec;
    		 listItem.isDiscount=this.productInfo.goodsList[i].isDiscount;
    		 listItem.number=this.productInfo.goodsList[i].number;
    		 listItem.startTime=this.productInfo.goodsList[i].startTime;
    		 items.push(listItem);
    		
    	}
    	taoc.items=items;   	
      this.setAddressModel(this.createOrderResult.orderInfo.addressModel);
      this.findComponent('OrderShopListView').collection.reset(taoc);
      this.$(".shop-info").css({"margin-top":"0"});

      this.$(".paid-number").text("￥"+this.createOrderResult.orderFee);
      this.$(".jifen-paid-number").text("￥"+this.createOrderResult.orderInfo.productInfo.totalPrice);
    },
    
    onRemove: function(){
      console.log("onRemove");
      window.app.createOrderType = 0;
      window.app.createOrderResult = null;
    },


    setAddressModel: function(addModel) {
      if(!addModel) return;
      this.findComponent('AddressInOrderView').setModel(addModel,"afterpayment");
      this.$(".order-address-icon-right").hide();
      this.$(".address-icon-map").hide();
      this.$(".order-address").css({"margin-left":"0"});
    },

    toOrderDetail: function(){
      if(this.suitId){ 
    	  Backbone.history.navigate("#my-navigate/confirm-order-completion?orderId=" + this.orderId+
            		"&suitId="+this.suitId, {
              trigger: true
            }) 
       
      }else if(this.orderId){
    	  Backbone.history.navigate("#my-navigate/order-detail?orderId=" + this.orderId, {
              trigger: true
            })
      }
    },
    toShareMenu: function(){
      //this.findComponent("ShareView").show();
	Backbone.history.navigate("#home-navigate", {
        trigger: true
      })
    }

  });
});
