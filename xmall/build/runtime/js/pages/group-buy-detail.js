define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'group-buy-detail',

    events:{
      'click .goback': 'goback',
      'click .goods-label-return': 'goback',
      'click .header-menu':'menuMore',
      'click .goods-label-menu':'menuMore',
      'click .discount-title':'disItemClick',
      'click .item-detail':'toDetail',
      'click .public-load-img': 'toMoreDetail',
      'click .backToGoods': 'hideMoreDetail',
      'click .item-buy-btn':'createOrder'
    },

    gbDetailModel:null,// 团购详情数据模型
    levelListShow:true,
    shortCounts: null,
    good_id : null,
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    goback: function(e) {
      window.history.back();
    },
    toDetail: function(e){
      var goodsId = this.gbDetailModel.goodsid;
      Backbone.history.navigate("#home-navigate/itemdetail?goodsid="+this.good_id,{
        trigger:true
      });
    },
    disItemClick: function(e){
      if(this.levelListShow){
        this.$(".discount-content").hide(200);
        this.$(".discount-title-icon").removeClass("icomoon-highpull").addClass("icomoon-spread");
      }else{
        this.$(".discount-content").show(200);
        this.$(".discount-title-icon").addClass("icomoon-highpull").removeClass("icomoon-spread");
      }
      this.levelListShow = !this.levelListShow;
    },

    onRender: function(){
      this.initLayout();
    },

    onResume: function(){
      PageView.prototype.onResume.apply(this,arguments);
      this.$(".product-bottom-bar").show();
      //$(".group-buy-detail").hide();
      if (!this.gbDetailModel) {
        var _Model = require("../models/GoodDetailModel");
        this.gbDetailModel = new _Model();
      }
      this.setAjaxOptions();
      var _this =this;
      window.setTimeout(function(){
        _this.gbDetailModel.loadData();
      },520);
    },

    setAjaxOptions: function(){
      _this = this;
      this.gbDetailModel.goodsid = window.application.getQueryString('goodsid');
      var userInfo = window.application.getUserInfo();
      var userid = userInfo ? userInfo.userid : "";
      this.gbDetailModel.ajaxOptions = {
        //path: "/product",
        url: window.app.api + "/getGroupDetail",
        showLoading:true,
        data: {
          id: this.gbDetailModel.goodsid,
          userid: userid,
        },
        success: function(data) {
          if (!data) {
            library.Toast("数据出错", 2000);
            window.history.back();
          } else if (data.status == 'error') {
            library.Toast(data.message || "该产品可能已下架", 2000);
            window.history.back();
          } else {
            data = data.data;
            _this.good_id = data.id;
            this.updateUI(data);
          }
        }.bind(this),
        error: function(e) {
          console.log(e || "数据出错");
        }.bind(this)
      }
    },

    updateUI: function(data){
    	var peoplenum = data.allCounts-data.member;
    	if(peoplenum < 0){
    		peoplenum = 0;
    	}
      this.productInfoObj = data;
      this.$(".group-buy-detail").show();
      this.$(".product-name").text(data.name);
      this.$(".price-value").text(data.price);
      this.$(".price-original").text("¥"+data.originPrice);
      
      
      var carouselCollection = this.findComponent("carousel").collection;
      var list = [];
      for(var i = 0; i < data.images.length; i++){
        list.push({
          src:data.images[i]
        })
      }
      carouselCollection.reset(list);

      //this.setDiscountInfo(this.getTestDisData());
      this.setDiscountInfo(data.discountInfo);
      if(data.groupStatus != 2){
        this.$(".item-buy").addClass("unable-btn");
        this.$(".item-buy").removeClass("item-buy-btn");
      }else{
    	this.$(".item-buy").removeClass("unable-btn");
        this.$(".item-buy").addClass("item-buy-btn");
      }
      if(data.groupStatus == 1){
    	this.$(".info-time-des").text("敬请期待");
    	this.$(".product-status").text("敬请期待");
    	this.$(".info-group-member").text("还差"+peoplenum+"人成团");
    	this.$(".info-time-value").show();
      }
      if(data.groupStatus == 2){
    	  this.$(".info-time-des").text("剩余时间 ");
    	  this.$(".info-time-value").show();
    	  this.$(".product-status").text("拼团中");
    	  this.$(".info-group-member").text("还差"+peoplenum+"人成团");
      }
      if(data.groupStatus == 3){
    	this.$(".info-time-des").text("拼团成功等待发货");
    	this.$(".product-status").text("拼团成功");
    	this.$(".info-group-member").text("已达到拼团人数");
    	this.$(".info-time-value").hide();
    	
      }
      if(data.groupStatus == 4){
    	  this.$(".info-time-des").text("拼团失败");
    	  this.$(".product-status").text("拼团失败");
    	  this.$(".info-time-value").hide();
    	  this.$(".info-group-member").text("没有达到拼团人数");
      }
      window.clearInterval(window.app.timeId);
    	  this.initTimer(data);
    },

    /*getTestDisData: function(){
      var data = [];
      data.push({
        id: "1",
        level: "第一阶梯",
        member: 20,
        price: 1000
      });
      data.push({
        id: "2",
        level: "第二阶梯",
        member: 50,
        price: 800
      });
      data.push({
        id: "3",
        level: "第三阶梯",
        member: 100,
        price: 600
      });
      return data;
    },*/

    setDiscountInfo: function(data){
      var disList = this.$(".discount-content");
      disList.empty();
      for(var i = 0 ; i < data.length; i++){
        disList.append(this.getLevelItem(data[i]));
      }
    },

    getLevelItem: function(item){
      var itemView = $("<div></div>");
      itemView.addClass("discount-item");
      itemView.attr("data-id",item.id);

      var levelView = $("<span></span>");
      levelView.addClass("dis-level").addClass("theme-backgorund-color");
      levelView.text(item.disName);
      itemView.append(levelView);

      var memberView = $("<span></span>");
      memberView.addClass("member");
      memberView.text("满"+item.fullMember+"人");
      itemView.append(memberView);

      var priceView = $("<span></span>");
      priceView.addClass("price");
      priceView.text("团购价￥"+item.price);
      itemView.append(priceView);

      return itemView;
    },

    initLayout: function() {
      //圆形返回
      var details_radius_bk = this.$el.find(".goods-label-return");
      var details_radius_menu = this.$el.find(".goods-label-menu");
      var details_radius_height = 70;
      //导航返回
      var details_nav_bk = this.$el.find(".goods-label-return-nav");
      var details_nav_height = 88;
      var isTouching = false;
      document.body.addEventListener("touchstart", touchstart, false);
      document.body.addEventListener("touchmove", touchmove, false);
      document.body.addEventListener("touchend", touchend, false);

      function touchstart(e) {
      }

      function touchmove(e) {
        var radius_height = details_radius_height - document.body.scrollTop / 4;
        details_radius_bk.css("opacity", (radius_height / details_radius_height - 0.5).toString());
        details_radius_menu.css("opacity", (radius_height / details_radius_height - 0.5).toString());
        var nav_height = details_nav_height - document.body.scrollTop / 4;
        var nav_opacity = (1 - nav_height / details_nav_height).toString();
        //if(nav_opacity>0.5) nav_opacity = 0.5;
        details_nav_bk.css("opacity", nav_opacity);
        isTouching = true;
      }

      function touchend(e) {
        isTouching = false;
      }
      $(window).scroll(function(e) {
        //if(!isTouching){
        var radius_height = details_radius_height - document.body.scrollTop / 4;
        details_radius_bk.css("opacity", (radius_height / details_radius_height - 0.5).toString());
        details_radius_menu.css("opacity", (radius_height / details_radius_height - 0.5).toString());
        var nav_height = details_nav_height - document.body.scrollTop / 4;
        var nav_opacity = (1 - nav_height / details_nav_height).toString();
        //if(nav_opacity>0.5) nav_opacity = 0.5;
        details_nav_bk.css("opacity", nav_opacity);
        //}
      });
    },

    curDate: new Date(),

    initTimer: function(res){
      _this = this;
      time = res.time;
      this.curDate.setDate(this.curDate.getDate()+1);
      var getTimer = function(){
        var dd = new Date();
        //var t = _this.curDate.getTime() - dd.getTime();
        this.time -= 1000;
        var t = this.time;
        var d = Math.floor(t/1000/60/60/24);
        var h = Math.floor(t/1000/60/60%24);
        var m = Math.floor(t/1000/60%60);
        var s = Math.floor(t/1000%60);
        var str =d + "天" + h + "时" + m + "分" + s + "秒";
        _this.$(".info-time-value").text(str);
        if(this.time == 0){
          window.clearInterval(this.id);
        }

      };
       id = setInterval(getTimer,1000);
       window.app.timeId = id;     //用来清除setInterval

    },

    createOrderItem: function() {
      var orderInfo = this.productInfoObj;
      var item = {};
      item.itemNumber = 1;
      item.type = "小额批发";
      item.spec = "testname";
      item.itemId = "testid";
      item.goodsId = orderInfo.id? orderInfo.id: "0022";
      item.name = orderInfo.name? orderInfo.name: "测试名字";
      item.good = orderInfo.good? orderInfo.good: "测试产品";
      item.cartId = '';
      item.totalPrice = orderInfo.price;
      item.imgurl = orderInfo.images[0] ? orderInfo.images[0].src : "";
      return item;
    },
    createOrder: function() {
      var userInfo = window.application.getUserInfo();
      if (!userInfo) {
         Backbone.history.navigate('#my-navigate/login/login', {
              trigger: true
            });
        return;
      }

      var orderInfo = this.productInfoObj;
      var shopInfo = {};

      var item = this.createOrderItem();
      shopInfo.shopName = orderInfo.shopname;
      shopInfo.shopId = orderInfo.shopid;
      shopInfo.shopTel = orderInfo.tel;
      if (orderInfo.delivery && isNaN(orderInfo.delivery)) {
        shopInfo.postage = parseInt(orderInfo.price);
      } else {
        shopInfo.postage = orderInfo.delivery || 0;
      }
      shopInfo.items = [];
      shopInfo.items.push(item);
      var shops = [];
      shops.push(shopInfo)
      window.app.shopsOrder = shops;
      window.app.createOrderType = 5;
      window.app.groupId = orderInfo.groupId? orderInfo.groupId: ""; //团购ID
      Backbone.history.navigate("#home-navigate/create-order", {
        trigger: true
      });
    },
    toMoreDetail: function() {
      var mySegmentView = this.findComponent('MySegmentedView');
      mySegmentView.paramInfo = [
        {
          detailInfo: this.productInfoObj.mark
        },
        {
          detailInfo: this.productInfoObj.detailParamSpec
        },
        {
          detailInfo: this.productInfoObj.salesService
        }
      ];
      mySegmentView.setActive(0);
      $(".group-buy-detail").hide();
      $(".goods-collection-info").show();
      $(document.body).scrollTop(0);
    },
    hideMoreDetail: function() {
      $(".goods-collection-info").hide();
      $(".group-buy-detail").show();
      $(document.body).scrollTop(0);
      // TODO 这里要重新设置评论数据，隐藏更多组件时评论的数据会消失。
      //this.setCommentInfo(this.productInfoObj);
    },

  });
});
