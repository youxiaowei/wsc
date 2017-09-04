define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'crowdfunding-detail',

    events:{
      'click .goback': 'goback',
      'click .goods-label-return': 'goback',
      'click .header-menu':'menuMore',
      'click .goods-label-menu':'menuMore',
      'click .discount-title':'disItemClick',
      'click .item-detail':'toDetail',
      'click .cf-support-btn':'createOrder'
    },

    gbDetailModel:null,// 团购详情数据模型
    levelListShow:true,

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
      $(".product-bottom-bar").show();
      $(".group-buy-detail").hide();
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
      this.gbDetailModel.goodsid = '010041JZG8PN11VNAD8J';//window.application.getQueryString('goodsid');
      var userInfo = window.application.getUserInfo();
      var userid = userInfo ? userInfo.userid : "";
      this.gbDetailModel.ajaxOptions = {
        //path: "/product",
        url: window.app.api + "/product",
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
            this.updateUI(data);
          }
        }.bind(this),
        error: function(e) {
          console.log(e || "数据出错");
        }.bind(this)
      }
    },

    updateUI: function(data){
      this.productInfoObj = data;
      $(".group-buy-detail").show();
      var carouselCollection = this.findComponent("carousel").collection;
      carouselCollection.reset(data.images);
      this.setSupportInfo(this.getTestDisData());
    },

    getTestDisData: function(){
      var data = [];
      data.push({
        id: "1",
        price: 1000,
        name: "古井贡酒原浆特酿",
        description: "感谢您的支持，您将获得低于市场价古井贡原浆特酿一瓶， 好喝的不得了",
        supportMember: "2"
      });
      data.push({
        id: "2",
        price: 2000,
        name: "古井贡酒原浆特酿",
        description: "感谢您的支持，您将获得低于市场价古井贡原浆特酿一瓶， 好喝的不得了",
        supportMember: "1"
      });
      data.push({
        id: "3",
        price: 2000,
        name: "古井贡酒原浆特酿",
        description: "感谢您的支持，您将获得低于市场价古井贡原浆特酿一瓶， 好喝的不得了",
        supportMember: "3"
      });

      return data;
    },

    setSupportInfo: function(data){
      var disList = this.$(".cf-buy-content");
      for(var i = 0 ; i < data.length; i++){
        disList.append(this.getLevelItem(data[i]));
      }
    },

    getLevelItem: function(item){
      var template = library.getTemplate("crowdfunding-detail-buy-item.html");
      return template(item);
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
        //e.stopPropagation();
        //e.preventDefault();
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

    createOrderItem: function() {
      var orderInfo = this.productInfoObj;
      console.log(orderInfo);
      var item = {};
      item.itemNumber = 1;
      item.type = "小额批发";
      item.spec = "testname";
      item.itemId = "testid";
      item.goodsId = orderInfo.goodsid;
      item.name = orderInfo.warename;
      item.good = orderInfo.good;
      item.cartId = '';
      item.totalPrice = 96;
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
      if(orderInfo.isSoldOut==1){
          library.Toast("该商品已下架！");
          return;
      }
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
      window.app.createOrderType = 6;
      Backbone.history.navigate("#home-navigate/create-order", {
        trigger: true
      });
    },

  });
});
