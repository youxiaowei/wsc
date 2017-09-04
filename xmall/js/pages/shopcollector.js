define(['./PageView','require'], function(PageView,require) {
  return PageView.extend({

    events: {
      "click .goods-collector-li": "delete",
      "click .shop-collector-li": "delete"
    },

    initStatus: function() {
      var collector = window.app.collector;
      if (collector == "shop") {
        this.$('.add-blank-leaving-icon').removeClass("icomoon-withoutcollect").removeClass("add-blank-leaving-icon");
        this.$('.add-blank-leaving-words').text("").removeClass("add-blank-leaving-words");
        this.$('.collector-shop').addClass("collector-shop-selected").addClass("theme-backgorund-color").removeClass("collector-shop").removeClass("theme-color");
        this.$('.collector-goods-selected').addClass("collector-goods").removeClass("collector-goods-selected").removeClass("theme-backgorund-color").addClass("theme-color");
        this.$("#ShopCollectorView").show();
        this.$("#GoodsCollectorView").hide();
        this.getShopInfo();
      } else {
        this.$('.add-blank-leaving-icon').removeClass("icomoon-withoutcollect").removeClass("add-blank-leaving-icon");
        this.$('.add-blank-leaving-words').text("").removeClass("add-blank-leaving-words");
        this.$('.collector-shop-selected').addClass("collector-shop").addClass("theme-color").removeClass("theme-backgorund-color").removeClass("collector-shop-selected");
        this.$('.collector-goods').addClass("collector-goods-selected").addClass("theme-backgorund-color").removeClass("collector-goods").removeClass("theme-color");
        this.$("#GoodsCollectorView").show();
        this.$("#ShopCollectorView").hide();
        this.getGoodsInfo();
      }
    },
    shopCollection:null,
    goodsCollection:null,
    userInfo: null,
    onResume: function() {
      var _this = this;
      this.initData();
      this.initStatus(_this);
      PageView.prototype.onResume.apply(this,arguments);
    },
    onRender: function() {
      this.initView();
    },

    initData: function(){
      this.shopCollection = this.findComponent('ShopCollectorView').collection;
      this.goodsCollection = this.findComponent('GoodsCollectorView').collection;
      this.userInfo = window.application.getUserInfo();
      if(!this.userInfo){
        library.Toast("您尚未登录");
        window.history.back();
        return;
      }

    },

    getShopInfo: function(){
      var shopPath = "/shopcollected";
      this.shopCollection.loadData(this.getAjaxOptions(shopPath,this.userInfo.userid,this.onShopSuccess.bind(this),this.onShopError.bind(this)));
    },

    getGoodsInfo: function(){
      var goodsPath = '/productcollected';
      this.goodsCollection.loadData(this.getAjaxOptions(goodsPath,this.userInfo.userid,this.onGoodsSuccess.bind(this),this.onGoodsError.bind(this)));
    },

    onGoodsSuccess: function(res){
      if (res && res.data && res.data.length == 0) {
        var blankicon = $("<div class = 'icomoon-withoutcollect add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还未收藏什么商品哟~</div>");
        this.$el.append(blankicon);
      }
    },

    onGoodsError: function(res){
      library.Toast("网络出错");
    },

    onShopSuccess: function(res){

      if (res && res.data && res.data.length == 0) {
        var blankicon = $("<div class = 'icomoon-withoutcollect add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还未收藏什么店铺哟~</div>");
        this.$el.append(blankicon);
      }
    },

    onShopError: function(res){
      library.Toast("网络出错");
    },

    getAjaxOptions: function(path,userid,success,error){
      var options = {
        path:path,
        showLoading: true,
        type: "GET",
        needReset:true,
        data:{userid:userid},
        success:success,
        error:error
      }
      return options;
    },

    initView: function() {
      _this = this;
      this.$el.css({
        "background-color": "white"
      });
      this.$(".table-view").css("border-top", "0px");
      this.$(".table-view").css("padding-top", "1.17333333rem");
      this.$("#ShopCollectorView").css("display", "none");
      var title = $("<div class = 'collector-title'>");
      var icon = $("<div class = 'icomoon-back collector-icon'>")
      var toggle = $("<div class = 'collector-toggle'>");
      var goods = $("<div class = 'collector-goods-selected theme-backgorund-color theme-border-color ' id = 'goods'>");
      var shop = $("<div class = 'collector-shop theme-border-color theme-color' id = 'shop'>");
      var tips = $("<div class = 'collector-tips'> ");
      var box = $("<p class = 'collector-tips-said'>");
      box.text("取消成功");
      shop.text("商铺");
      goods.text("商品");
      tips.append(box);
      toggle.append(tips);
      toggle.append(goods);
      toggle.append(shop);
      toggle.append(tips);
      title.append(icon);
      title.append(toggle);
      this.$el.prepend(title);
      this.$el.find('.icomoon-back').click(function() {
        window.history.back();
      });
      this.$el.find('#shop').click(function() {
        $('.collector-shop').addClass("collector-shop-selected").addClass("theme-backgorund-color").removeClass("collector-shop").removeClass("theme-color");
        $('.collector-goods-selected').addClass("collector-goods").removeClass("collector-goods-selected").removeClass("theme-backgorund-color");
        $('.collector-goods').addClass("theme-color");
        $("#ShopCollectorView").show();
        $("#GoodsCollectorView").hide();
        $('.add-blank-leaving-icon').removeClass("icomoon-withoutcollect").removeClass("add-blank-leaving-icon");
        $('.add-blank-leaving-words').text("").removeClass("add-blank-leaving-words");
        _this.getShopInfo();
      });
      this.$el.find('#goods').click(function() {
        $('.collector-shop-selected').addClass("collector-shop").removeClass("collector-shop-selected").removeClass("theme-backgorund-color");
        $('.collector-goods').addClass("collector-goods-selected").addClass("theme-backgorund-color").removeClass("collector-goods").removeClass("theme-color");
        $('.collector-shop').addClass("theme-color");
        $("#GoodsCollectorView").show();
        $("#ShopCollectorView").hide();
        $('.add-blank-leaving-icon').removeClass("icomoon-withoutcollect").removeClass("add-blank-leaving-icon");
        $('.add-blank-leaving-words').text("").removeClass("add-blank-leaving-words");
        _this.getGoodsInfo();
      });
    },

    delete: function(e) {
      var cid = e.currentTarget.dataset.cid;
      var target = e.currentTarget.className;
      if (e.target.dataset.name == "goods" || e.target.dataset.name == "shop") {
        this.deleteInfo(e.target.dataset.name,cid)
      } else {
        if (target == "shop-collector-li") {
          var url = "#my-navigate/business?shopid="+cid;
          Backbone.history.navigate(url, {
            trigger: true
          });
        } else if(target == "goods-collector-li"){
          var url = "#my-navigate/itemdetail?goodsid="+cid;
          Backbone.history.navigate(url, {
            trigger: true
          });
        }
      }
    },
    baseModel:null,
    deleteInfo: function(type,cid){
      if(!this.baseModel){
        var BaseModel = require('../models/BaseModel');
        this.baseModel = new BaseModel();
      }
      var data = {};
      data.userid = this.userInfo.userid;
      if(type == "shop"){//删除店铺收藏
        data.shopid = cid;
        var path = "/shopcollected";
      }else{//删除商品收藏
        data.productid = cid;
        var path = "/productcollected";
      }
      var options = {
        path : path,
        data:data,
        success: function(res){
          if(res && res.status == 'ok'){
            library.Toast("操作成功");
            if(type == 'shop'){
              this.getShopInfo();
            }else{
              this.getGoodsInfo();
            }
          }else{
            library.Toast("操作失败，请重试");
          }
        }.bind(this),
        error: function(){
          library.Toast("操作失败，请重试");
        }.bind(this),
      }
      this.baseModel.loadData(options);
    },
  });
});
