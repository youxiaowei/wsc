define(['./PageView', '../models/GoodDetailModel','../models/CommentCollection', 'require'], function(PageView, GoodDetailModel, CommentCollection,require) {

  return PageView.extend({
    events: {
      "click .point-buy-btn": "createOrder",
      "click .goods-label-spec": "openshoppingcart",
      "change .mui-numbox-input": "inputchange",
      "click .goods-title-selected": "goodstitleselected",
      "click .mui-numbox-btn-plus": "muinumboxbtnplus",
      "click .mui-numbox-btn-minus": "muinumboxbtnminus",
      "click .goods-label-return": "goodslabelreturn",

      "click .info-title-svg": "infotitlesvg",
      "click .common-message-cover-no": "infotitlesvg",
      "click .goods-button-check": "goodsbuttoncheck",
      "click .backToGoods": "hideMoreDetail",
      "click .CarouselView": "showBigImg",
      "click .bigImg-view-show": "BigImgHide",
      "click .goods-coupon-title": "showCoupon",
      "click .evaluate-tab" :"filterComment",
      "click .more-comment": "goToCommentPage",
      "click .goods-title-share": "shareWindow",
      "click .coupon-packages": "goDiscountPackage",
      "click .cancel-share": "shareCancel",
      "click .header-menu":"menuMore",
      "click .goods-label-menu":"menuMore",
      "blur .mui-numbox-input":"numberboxBlur"
    },
    pageScrollTop:0,

    min: null,
    max: null,
    num: 0,
    buyState: 0,
    shoppingCart: 0,
    shopcart: null,
    addshop: null,
    commentData:null,
    productStock:0,     //库存量
    commentCollection:new CommentCollection(),

    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
      this.commentData = this.commentCollection.toJSON();
       
        $(this.findComponent("carousel1")).find(".slick-dots").css({
         "position":"relative",
        "top":"300px"
        });

    },

    menuMore: function(e){
        this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
        this.findComponent("SearchMidPageView").show();
    },
    goodslabelreturn: function() {
      window.history.back();
    },
    infotitlesvg: function() {
      // $(".add-shop-cart").hide();
      $(".add-shop-cart").removeClass("add-shop-cart-show");
      $('.share-popup-view').removeClass('share-popup-view-show');
      $(".common-message-cover-no").hide();
      this.buyState  = 0;
      this.shoppingCart = 0;
    },

    // mods 获取数据的model
    mods: null,
    onResume: function() {

      this.toggleBar && this.toggleBar("hide");
      /*this.$el.find('.product-bottom-bar').show();   //积分商品的底部按钮只有购买（微商城） */
      if (!this.mods) {
        this.mods = new GoodDetailModel();
      }
      this.setAjaxOptions(window.application.getQueryString('goodsid'));
      var _this =this;
      window.setTimeout(function(){
        _this.mods.loadData();
      },520);



      /*var options = {
        path: "/ceatePointOrder",
        type: "POST",
        needReset: true,
        data: {
         userId : "0100C1K0Q3TW164VFDUM",
         productId:"1456820099911",
         number:"2",
         receiveId : "eb15a7e5c6b8451fb08537be303081eb",
         sendWay : "73d796c2bab14a97978522e8bcdf103c",
         mark : "xxx",
         totalFee : "2"
        },
        datatype: "json",
        success: function(res) {
          alert("sd1111111s");

        },
        error: function() {}
      };
      if (!this.CreateOrder) {
        var BaseModel = require('../models/BaseModel');
        this.CreateOrder = new BaseModel();
      }
      this.CreateOrder.loadData(options); */
    },
    CreateOrder:null,

    onRender: function() {

    },

    setAjaxOptions: function(goodsid){
      this.mods.goodsid =goodsid;
      var userInfo = window.application.getUserInfo();
      var userid = userInfo ? userInfo.userid : "";
      this.mods.ajaxOptions = {
        path: "/getPointProductDetail",
        type:"POST",
        showLoading:true,
        data: {
          productId: this.mods.goodsid
        },
        success: function(data) {
          if(data && data.status == "0"){
            this.updateUI(data.data);
          }else{
            library.Toast(data.message || "该产品可能已下架", 2000);
            //window.history.back();
          }
        }.bind(this),
        error: function(e) {
          library.Toast("数据出错", 2000);
          //window.history.back();
        }.bind(this)
      }
    },

    updateUI: function(data) {
      this.productInfoObj = data;
      this.selectedGoodId = data.id;
      this.productStock = data.stock;
      this.setCarouselInfo(data.images);
      /*var productStatus = data.isSoldOut;
      if(productStatus == 1 ){
            //状态为1的时候商品为已下架状态
            var html = "<span>"+data.name+"<span class='theme-color'>(该商品已下架)</span></span>";
            this.$(".goods-title-name").append(html);
      }
      else{
            //状态为0时商品为未下架
            this.$(".goods-title-name").html(data.name);
      }*/

      if(this.productStock == 0){
          var html = "<span class='theme-color'>(该商品暂时无货)</span>";
          this.$(".goods-title-name").html(data.name+html);
      }else{
          this.$(".goods-title-name").html(data.name);
      }

      this.$(".goods-title-num").html(data.point);
      //this.$(".goods-title-piontNum").html(data.price);
      this.$(".goods-title-box").hide();//.html(data.detailMore);

      data.isFav==1? this.$('.collection-goods').addClass('collected'): this.$('.collection-goods').removeClass('collected');
      //salesNumber
      this.$(".month-sale-val").html(data.salesNumber);
      // setdiscountInfo
      /*var discountInfo = data.discountInfo||{};
      this.setDiscountInfo(discountInfo);*/
      // setSpecInfo
      /*var productSpec = data.productSpec||{};*/
     // this.setSpecInfo(productSpec,data.id);
      // setCommentInfo
      /*var comments = data.comments;*/
     // this.setCommentInfo(comments);
    },
    
    setCarouselInfo:function(images){
      var carouselCollection = this.findComponent("carousel").collection;
      var list = [];
      for(var i = 0; i < images.length; i++){
        list.push({
          src:images[i]
        })
      }
      carouselCollection.reset(list);
    },

    createOrderItem: function() {
          var orderInfo = this.productInfoObj;
          var item = {};
          item.itemNumber = parseInt(1);//积分商品数量限制为1
          item.tradePrice= this.productInfoObj.price;//市场单价
          item.point= this.productInfoObj.point;//兑换所需积分
          item.name = orderInfo.name;
          item.good = orderInfo.id;
          item.goodsId = orderInfo.id;
          item.totalPrice = item.itemNumber * item.tradePrice;
          item.imgurl = orderInfo.images[0]||'';
          console.log(item);
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
          var productInfo = {};
          var shopInfo = {};
          var orderInfo = this.productInfoObj;
          if(this.productStock == 0){
              library.Toast("无货不能兑换！");
              return;
          }
          var item = this.createOrderItem();
          /*if (orderInfo.delivery && isNaN(orderInfo.delivery)) {
              shopInfo.postage = parseInt(orderInfo.price);
          } else {
              shopInfo.postage = orderInfo.delivery || 0;
          }*/
          shopInfo.items = [];
          shopInfo.items.push(item);
          var shops = [];
          shops.push(shopInfo)
          window.app.shopsOrder = shops;
          Backbone.history.navigate("#my-navigate/create-order-for-point", {
              trigger: true
          });
          return;
    },

  });
});
