define(['./PageView', '../models/GoodDetailModel','../models/CommentCollection', 'require'], function(PageView, GoodDetailModel, CommentCollection,require) {

  return PageView.extend({
    events: {
      "click .goods-label-collection": "toMoreDetail",
      "click .item-buy": "createOrder",
      "click .item-shopcart": "gotoshopcart",
      "click .item-cart": "selecteditem",
      "click .shopcart-info-btn": "checkbtn",
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
      "click .goods-label-menu": "menuMore",
      "blur .mui-numbox-input":"numberboxBlur"
    },
    pageScrollTop:0,

    numberboxBlur:function(){
      document.body.scrollTop = this.pageScrollTop;
    },
    min: null,
    max: null,
    num: 0,
    buyState: 0,
    shoppingCart: 0,
    specStack:0,
    specSelect:null,
    shopcart: null,
    addshop: null,
    productStatus: 0,
    commentData:null,
    commentCollection:new CommentCollection(),

    initialize: function(){
      this.commentData = this.commentCollection.toJSON();
       // console.log(this.commentData[0].commentlist[0].username);
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));

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
    toMoreDetail: function() {
      var mySegmentView = this.findComponent('MySegmentedView');
      console.log(this.productInfoObj.salesService)
      if(this.productInfoObj.salesService == undefined){
    	  this.productInfoObj.salesService="<div style='background:#f5f5f5;border-bottom:none' class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words' style='background:#f5f5f5;border-bottom:none'>还没有相关售后哟~</div>"
      }
      mySegmentView.paramInfo = [
        {
          detailInfo: this.productInfoObj.detailMore
        },
        {
          detailInfo: this.productInfoObj.detailParamSpec
        },
        {
          detailInfo: this.productInfoObj.salesService
        }
      ];
      mySegmentView.setActive(0);
      $("#goods-page").hide();
      $(".goods-collection-info").show();
      $(document.body).scrollTop(0);
    },
    hideMoreDetail: function() {
      $(".goods-collection-info").hide();
      $("#goods-page").show();
      $(document.body).scrollTop(0);
      // TODO 这里要重新设置评论数据，隐藏更多组件时评论的数据会消失。
      //this.setCommentInfo(this.productInfoObj);
    },
    // 加入购物车
    selecteditem: function() {
      var userInfo = window.application.getUserInfo();
      if(!userInfo){
    	library.Toast("请先登录",2000);
        Backbone.history.navigate('#my-navigate/login/login', {
               trigger: true
             });
        return;
      }
      // if (!this.shopcart) {
      //   // $(".add-shop-cart").show();
      //   this.openshoppingcart();
      //   this.shoppingCart ++;
      //   return;
      // }
      var info = this.mods.attributes;
      var cartItem = {};
      if (!this.addshop) {
        var addshopcartModel = require('../models/AddShoppingCart');
        this.addshop = new addshopcartModel();
      }
      //准备要提交的数据


      // selectedFirstLevelSpec:null,
      // selectedSecondLevelSpec:null,
      if(!this.selectedFirstLevelSpec){
        library.Toast("没有查询到该规格的商品，请选择其他规格的商品！");
        return;
      }

      var firstLevelSpecID = this.selectedFirstLevelSpec.attr("data-specId");
      if(!firstLevelSpecID){
          library.Toast("请选择规格！");
        return;
      }
      if( this.selectedSecondLevelSpec){
        var secondLevelSpec =  this.selectedSecondLevelSpec.attr("data-specId");
        if(secondLevelSpec){
          firstLevelSpecID = firstLevelSpecID+","+secondLevelSpec;
        }
      }
      if(this.productStatus==1){
          console.log(this.productStatus);
          library.Toast("该商品已下架！");
          return;
      }
      if(this.specStack<=0){
          library.Toast("无货无法加入购物车！");
          return;
      }
      var data = {
        userId: userInfo.userid,
        number:this.$('.mui-numbox-input').val(),
        productId: this.productInfoObj.id,// 产品id
        specId: firstLevelSpecID// 产品数量
      }
      var options = {
        path: '/addCart',
        data: data,
        type:"POST",
        success: function(res) {
          if (res && res.status == 'ok') {
            library.Toast(res.message || "成功加入购物车");
            this.setCartInfo(true);
          } else {
            library.Toast(res ? res.message : "添加失败，网络不给力");
          }
        }.bind(this),
        error: function(res) {
          library.Toast(res ? res.message : "添加失败");
        }.bind(this),
      }
      this.addshop.loadData(options);
    },
    createOrderItem: function() {
      var orderInfo = this.productInfoObj;
      var item = {};
      item.itemNumber = parseInt($(".mui-numbox-input").val());//数量
      item.tradePrice= this.productInfoObj.price;//单价
      item.name = orderInfo.name;
      item.good = orderInfo.id;
      item.goodsId = orderInfo.id;
      item.totalPrice = item.itemNumber * item.tradePrice;
      item.imgurl = orderInfo.images[0]||'';
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
      if(orderInfo.isSoldOut==1){
          library.Toast("该商品已下架！");
          return;
      }
      var productInfo = {};
      var shopInfo = {};

      var index = $('.mui-numbox-input').val();
      
      console.log(index+"======"+this.specStack);
      if(index>this.specStack){
          library.Toast("库存量不足！");
          return;
      }
      var item = this.createOrderItem();
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
      window.app.createOrderType = 0;
      Backbone.history.navigate("#home-navigate/create-order", {
        trigger: true
      });
      return;
    },
    gotoshopcart: function() {
      Backbone.history.navigate("#shopingcart-navigate?back=true&isAnime=true", {
        trigger: true
      });
    },
    /*businessInClick: function() {
      //进入商铺入口
      Backbone.history.navigate("#home-navigate/business?shopid=" + this.productInfoObj.shopid, {
        trigger: true
      });
    },*/
    //选择规格
    checkbtn: function() {
      $(".add-shop-cart").removeClass("add-shop-cart-show");
      $(".common-message-cover-no").hide();
      document.body.scrollTop = this.pageScrollTop;
      // selectedFirstLevelSpec:null,
      // selectedSecondLevelSpec:null,
      if(this.selectedGoodId!=this.productInfoObj.id){
        this.setAjaxOptions(this.selectedGoodId);
        this.mods.loadData();
      }
      //选择规格之后需要重新获取新的商品信息
      // this.setAjaxOptions();
      // this.mods.loadData();
      return;

      var max = this.wareSpec.stock;//库存量
      var min = this.wareSpec.minWholesale;//最小起批量
      var index = $('.mui-numbox-input').val();
      index = parseInt(index);
      if(this.wareSpec)
      {
        if((max<min && this.wareSpec.isPresale==1) || index>max){
          library.Toast("库存不足！！");
          return ;
        }
        else if(index<min){
          library.Toast("小于最小起批量！！");
          return ;
        }
      }
      if ($(".info-method-staple.info-spec-selected").text()) {
        $(".goods-spec-name").text('已选');
        //   $(".goods-spec-selected").text('"大宗交易"');
      } else {
        var spec = $(".info-spec-box.info-spec-selected").text();
        if (spec) {
          $(".goods-spec-name").text('已选');
          $(".goods-spec-selected").text('"' + spec + '" ');
        }
      }
      if ($(".goods-spec-selected").text()) {
        this.shopcart = {};
        this.shopcart.sku = this.wareSpec;//产品规格对象
        this.shopcart.quantity = $(".mui-numbox-input").val();//选择的数量
      }
      // $(".add-shop-cart").hide();
      // if(spec){
        $(".add-shop-cart").removeClass("add-shop-cart-show");
      // }
      $(".common-message-cover-no").hide();
      if(this.buyState>0)
      {
        this.createOrder();
        return;
      }
      if(this.shoppingCart>0)
      {
        this.selecteditem();
        $(".add-shop-cart").removeClass("add-shop-cart-show");
        $(".common-message-cover-no").hide();
      }

    },
    //弹出规模选择
    openshoppingcart: function() {
      // $(".add-shop-cart").show();
      this.pageScrollTop = document.body.scrollTop;
      document.body.scrollTop = document.body.scrollHeight;
      $(".add-shop-cart").addClass("add-shop-cart-show");
      $(".common-message-cover-no").show();
      if(this.wareSpec){
          var min = this.wareSpec.minWholesale;
          $(".mui-numbox-input").val(min);
      }
      this.shopcart = {};
      this.shopcart.sku = this.wareSpec;//产品规格对象
      this.shopcart.quantity = $(".mui-numbox-input").val();//选择的数量
    },

    getProductNumber: function() {
      return $('.mui-numbox-input').val();
    },

    goodstitleselected: function(e) {
      var favBtn = $(e.currentTarget);
      if(favBtn.hasClass('collection-shop')){// 收藏店铺
        if (favBtn.hasClass('collected')) {
          this.favGoods(false,true);
        } else {
          this.favGoods(true,true);
        }
      }else{//收藏商品
        if (favBtn.hasClass('collected')) {
          this.favGoods(false,false);
        } else {
          this.favGoods(true,false);
        }
      }
    },

    favModel:null,
    favGoods: function(status,isShop){
      var path;
      if(status){//收藏
         path = isShop ? '/addFav' : '/addFav';
      }else{//取消收藏
         path = isShop ? '/cancelFav' : '/cancelFav';
      }
      if(!this.favModel){
        var FavModel = require('../models/BaseModel');
        this.favModel = new FavModel();
      }
      var userInfo = window.application.getUserInfo();
      if(!userInfo){
        library.MessageBox("提示信息","请先登录",[{
          leftText:"确定",callback:function(){
            Backbone.history.navigate('#my-navigate/login/login', {
              trigger: true
            });
          }},{rightText:"取消",callback:function(){}}]);
      }
      if(isShop){
        var data = {
          shopid:this.productInfoObj.shopid,
          userid:userInfo.userid
        }
      }else{
        var data = {
          productIds:this.mods.goodsid,
          userId:userInfo.userid
        }
      }
      var options = {
        path: path,
        data: data,
        //type: !status && isShop ? "DELETE" : "POST",
        success: function(res){
          if(res && res.status == '0'){
            if(status){
              this.showTips("收藏成功");
              if(isShop){
                $('.collection-shop').find(".icomoon-starunclick").removeClass('goods-title-collection').addClass('goods-title-collection-selected');
                $('.collection-shop').addClass('collected');
              }else{
                $('.collection-goods').find(".icomoon-starunclick").removeClass('goods-title-collection').addClass('goods-title-collection-selected');
                $('.collection-goods').addClass('collected');
              }
            }else{
              this.showTips("取消收藏");
              //library.Toast("操作成功");
              if(isShop){
                $('.collection-shop').removeClass('collected');
                $('.collection-shop').find(".icomoon-starunclick").removeClass('goods-title-collection-selected').addClass('goods-title-collection');
              }else{
                $('.collection-goods').removeClass('collected');
                $('.collection-goods').find(".icomoon-starunclick").removeClass('goods-title-collection-selected').addClass('goods-title-collection');
              }
            }
          }else{
            library.Toast("操作失败");
          }
        }.bind(this),
        error: function(res){
          if(window.application.getUserInfo())
          {
            library.Toast("操作失败，貌似网络不给力");
          }

        }.bind(this)
      };
      this.favModel.loadData(options);
    },

    muinumboxbtnplus: function() {
      // if($(".info-spec-box.info-spec-selected").length>0||$(".info-method-staple.info-spec-selected").length>0)
      // {
        var index = $(".mui-numbox-input").val();
        index = parseInt(index);
        index = index + 1;
        // var max = this.wareSpec.stock;//库存量
        $(".mui-numbox-input").val(index);
        // if(this.wareSpec.isPresale == '0'){
        //   // if (index <= max) {
        //     $(".mui-numbox-input").val(index);
        //   // }
        // }else{//对预售商品不做限制
        //   $(".mui-numbox-input").val(index);
        // }
      // }
      // else {
      //     library.Toast("请选择规格");
      // }
    },
    muinumboxbtnminus: function() {
      var index = $(".mui-numbox-input").val();
      index = parseInt(index);
      index =index<=1?1:index-1;
      // var max = this.wareSpec.stock;//库存量
      $(".mui-numbox-input").val(index);
      // if($(".info-spec-box.info-spec-selected").length>0||$(".info-method-staple.info-spec-selected").length>0)
      // {
      //   var index = $(".mui-numbox-input").val();
      //   index = parseInt(index);
      //   index = index - 1;
      //   var min = this.wareSpec.minWholesale;//最小起批量
      //   if (index >= min) {
      //     $(".mui-numbox-input").val(index);
      //   }
      // }
      // else {
      //     library.Toast("请选择规格");
      // }
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
      this.shopcart = null;

      this.selectedFirstLevelSpec=null;
      this.selectedSecondLevelSpec=null;
      this.toggleBar && this.toggleBar("hide");
      this.$(".goods-label-return-nav").show();
      this.$(".product-bottom-bar").show();
      if (!this.mods) {
        this.mods = new GoodDetailModel();
      }
      this.setAjaxOptions(window.application.getQueryString('goodsid'));
      var _this =this;
      window.setTimeout(function(){
        _this.mods.loadData();
      },520);
      $(".add-shop-cart").removeClass("add-shop-cart-show");
    },

    onRender: function() {
      this.selectedFirstLevelSpec=null;
      this.selectedSecondLevelSpec=null;
      this.initLayout();
      if(this.commentView == null){
          var commentView = require("../components/CommentListView");
          this.commentView = new commentView;
      }
    },

    setAjaxOptions: function(goodsid){
      var _this = this;
      this.mods.goodsid =goodsid;
      console.log(goodsid);
      var userInfo = window.application.getUserInfo();
      var userid = userInfo ? userInfo.userid : "";
      this.mods.ajaxOptions = {
        path: "/getProductDetail",
        showLoading:true,
        data: {
          productId: this.mods.goodsid,
          userId: userid,
        },
        success: function(data) {
//        	console.log("aaa"+JSON.stringify(data));
          if(data && data.status == "0"){

            var Stack = data.data.productSpec.specValues;
            console.log(Stack);
            if(Stack==undefined){
           	  $(".goods-label-spec").hide();
            }  
            if(!_this.specSelect&&Stack!=undefined){
            	_this.specStack = data.data.productSpec.specValues[0].specParamValues[0].specStack;
            }else{
            	//防止元素未赋值
            	if(_this.selectedSecondLevelSpec){
            		var i = _this.selectedFirstLevelSpec.attr("firstIndex");
            	}else{
            		var i = 0;
            	}
            	if(_this.selectedSecondLevelSpec){
            		var j = _this.selectedSecondLevelSpec.attr("secondIndex");
            	}else{
            		var j = 0;
            	}
          	//_this.specStack = data.data.productSpec.specValues[i].specParamValues[j].specStack;
                /*console.log(">><<");
                console.log(_this.specStack);*/
            }
            this.updateUI(data.data);

          }else{
            library.Toast(data.message || "该产品可能已下架", 2000);
            window.history.back();
          }
        }.bind(this),
        error: function(e) {
          library.Toast("数据出错", 2000);
          window.history.back();
        }.bind(this)
      }
    },

    //产品数据对象
    productInfoObj: null,
    //更新UI
    selectedFirstLevelSpec:null,
    selectedSecondLevelSpec:null,
    secondLevelSpecItemClick:function(target,specValue){
      if(this.selectedSecondLevelSpec){
        this.selectedSecondLevelSpec.removeClass("spec-item-selected");
      }
      this.selectedSecondLevelSpec = target;
      this.selectedGoodId = specValue.goodsId;
      this.selectedSecondLevelSpec.addClass("spec-item-selected");
      this.setSelectedSpecLabel(true);
    },
    setSelectedSpecLabel:function(hasSecondLevel){
      if(this.selectedFirstLevelSpec){
        if(this.specStack <= 0){
            $(".goods-spec-name").html("已选："+this.selectedFirstLevelSpec.text()+" "+(hasSecondLevel?this.selectedSecondLevelSpec.text():"")+"<span style='color:red'>(无货)</span>");
        }
        else{
        	console.log(this.specStack);
            $(".goods-spec-name").html("已选："+this.selectedFirstLevelSpec.text()+" "+(hasSecondLevel?this.selectedSecondLevelSpec.text():""));
        }
      }
    },
    selectedGoodId:null,
    firstLevelSpecItemClick:function(name,values,target,secondLevelSpecWrapper){
      if(this.selectedFirstLevelSpec){
        this.selectedFirstLevelSpec.removeClass("spec-item-selected");
      }
      this.selectedFirstLevelSpec = target;
      if(this.selectedFirstLevelSpec){//加判断防止报错
         this.selectedFirstLevelSpec.addClass("spec-item-selected");
      }
      this.setSelectedSpecLabel(false);
      if(name&&name!=""){
        secondLevelSpecWrapper.html("");
        var secondLevelItemsWrapper = $("<div></div>");
        secondLevelSpecWrapper.append("<div class='spec-title'>"+name+"</div>").append(secondLevelItemsWrapper);
        var firstSecondSpecItem,firstsecondLevelSpec;
        var defaulSecondSpecItem,defaulSecondLevelSpec;
        for(var i=0,j=values.length;i<j;i++){
          var secondLevelSpec = values[i];
          var specValue = secondLevelSpec.specValue;
          var secondLevelItem = $("<span secondIndex='"+ i +"' data-specId='"+secondLevelSpec.specId+"' class='spec-item'>"+specValue+"</span>");
          if(i==0){
            defaulSecondSpecItem = secondLevelItem;
            defaulSecondLevelSpec = secondLevelSpec;
          }

          if(secondLevelSpec.goodsId==this.productInfoObj.id){
             firstSecondSpecItem = secondLevelItem;
             firstsecondLevelSpec = secondLevelSpec;
          }
          (function(_secondLevelItem,_this,_secondLevelSpec){
            _secondLevelItem.bind("click",function(){
            	//刷新评论先去除原评价
            	$(".goods-evaluate-ul").empty();
              _this.secondLevelSpecItemClick(_secondLevelItem,_secondLevelSpec);
            });
          })(secondLevelItem,this,secondLevelSpec);
          secondLevelSpecWrapper.append(secondLevelItem);
          // specImage
          // specStack
          // specPrice
        }
        this.secondLevelSpecItemClick(firstSecondSpecItem||defaulSecondSpecItem,firstsecondLevelSpec||defaulSecondLevelSpec);
      }else{
        this.selectedGoodId = values[0].goodsId;
        if(this.selectedGoodId!=this.productInfoObj.id){
          this.setAjaxOptions(this.selectedGoodId);
          this.mods.loadData();
        }
      }
    },

    updateUI: function(data) {
      this.productInfoObj = data;
      this.selectedGoodId = data.id;
      this.setCarouselInfo(data.images);
      this.productStatus = data.isSoldOut;
      if(this.productStatus == 1 ){
          //状态为1的时候商品为已下架状态
          var html = "<span>"+data.name+"<span class='theme-color'>(该商品已下架)</span></span>";
          this.$(".goods-title-name").append(html);
      }
      else{
          //状态为0时商品为未下架
          this.$(".goods-title-name").html(data.name);
      }
          
      this.$(".goods-title-num").html(data.price);
      this.$(".goods-title-box").hide();//.html(data.detailMore);

      data.isFav==1? this.$('.collection-goods').addClass('collected'): this.$('.collection-goods').removeClass('collected');
      //salesNumber
      this.$(".month-sale-val").html(data.salesNumber);
      // setdiscountInfo
      var discountInfo = data.discountInfo||{};
      this.setDiscountInfo(discountInfo);
      // setSpecInfo
      var productSpec = data.productSpec||{};
      this.setSpecInfo(productSpec,data.id);
      // setCommentInfo
      var comments = data.comments;
      this.setCommentInfo(comments);
    },

    setDiscountInfo:function(discountInfo){
      var points = discountInfo.points||0;
      points = points==0?"无":points;
      this.$(".itemdetail-points").html(points);
      var discount = discountInfo.discount||"无";
      this.$(".itemdetail-points").html(discount);
      var package = discountInfo.package || [];
      if(package.length==0){
        $(".packages-details").hide();
        this.$(".coupon-desc").html("无");
        this.$(".launch-ico").hide();
        this.$(".coupon-row-last").removeClass("coupon-packages");
      }else{
        $(".coupon-desc").html("共"+package.length+"款");
        this.$(".coupon-row-last").addClass("coupon-packages");
        this.setPackageInfo(package);
      }
    },

    setPackageInfo:function(package){
      this.package = package;
      var template = library.getTemplate('package-product-item.html');
      var html = '';
      for(var i = 0; i < package.length ; i ++){
        var p = package[i];
        p.index = i;
        html += template(p);
      }
      this.$(".packages-details-row").html($(html));
    },

    setSpecInfo:function(productSpec,pid){
      this.$(".shopcart-info-spec").html("");
      var specName = productSpec.specName;
      var _this = this;
      var fValName,fParamValues,fSpecItem;
       if(specName){
         var firstLevelSpecWraper = $("<div class='first-spec'></div>");
         var secondLevelSpecWrapper = $("<div class='second-spec'></div>");
         this.$(".shopcart-info-spec").append("<div class='spec-title'>"+specName+"</div>").append(firstLevelSpecWraper).append(secondLevelSpecWrapper);
         var specValues = productSpec.specValues;
         for(var i=0,j=specValues.length;i<j;i++){
           var item = specValues[i];
           var specParamId = item.specParamId;
           var specParamName = item.specParamName;
           var firstLevelSpecItem = $("<span firstIndex='"+ i +"'data-specId='"+specParamId+"' class='spec-item'>"+specParamName+"</span>");

           var specParamValues = item.specParamValues;
           for(var n=0,m=specParamValues.length;n<m;n++){
             if(specParamValues[n]["goodsId"] == pid){
               fValName = item.specParamValueName;
               fParamValues = specParamValues;
               fSpecItem = firstLevelSpecItem;
               _this.$(".info-title-words-num").text(specParamValues[n].specPrice);
               _this.$(".info-title-img").attr('src',specParamValues[n].specImage);
             }
           }
           (function(_firstLevelSpecItem,_this,_item,_secondLevelSpecWrapper){
             _firstLevelSpecItem.bind("click",function(){
            	//刷新评论先去除原评价
            	 $(".goods-evaluate-ul").empty();
                 _this.specStack = _item.specParamValues[0].specStack;
                 _this.specSelect = 1;//以选择规格
               _this.firstLevelSpecItemClick(_item.specParamValueName,_item.specParamValues,_firstLevelSpecItem,_secondLevelSpecWrapper);//specParamValueName specParamValues
             });
           })(firstLevelSpecItem,this,item,secondLevelSpecWrapper);
           firstLevelSpecWraper.append(firstLevelSpecItem);
         }

         this.firstLevelSpecItemClick(fValName,fParamValues,fSpecItem,secondLevelSpecWrapper);
       }
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

    productSpec: null,
    setProductSpec:function(specInfo){
      this.productSpec = specInfo;
      this.$(".info-spec-title").text(specInfo.specName);
      specInfo.specValues.forEach(function(spec,index){

      }.bind(this));
    },

    wareSpace:null,
    setWarespec: function(data) {
      this.initSwareSpecBtn(data);
      var _this = this;
      if(data.smallwarespec && data.smallwarespec.length > 0){//如果有小额批发的规格，显示之
        data.smallwarespec.forEach(function(wareSpec,index){
          if (parseInt(wareSpec.stock) < parseInt(wareSpec.minWholesale)) {
            var li = $("<li class='info-spec-selected-stockout ' data-index = '" + index + "'>");
          } else {
            var li = $("<li class='info-spec-box ' data-index = '" + index + "'>");
            li.addClass("info-spec-selected-no");
          }
          li.text(wareSpec.name);
          this.$(".info-spec-ul").append(li);
        }.bind(this));
        //规格按钮点击事件
        this.$el.find('.info-spec-box').click(function(event) {
          var index = $(event.target).attr('data-index');
          _this.$(".info-spec-box").addClass('info-spec-selected-no').removeClass('info-spec-selected').removeClass('info-spec-selected').removeClass('theme-color').removeClass('theme-backgorund-color-gray').removeClass('theme-border-color');
          _this.$(".info-spec-box[data-index='" + index + "']").addClass('info-spec-selected').removeClass('info-spec-selected-no').addClass('theme-color').addClass('theme-backgorund-color-gray').addClass('theme-border-color');
          _this.wareSpec = data.smallwarespec[index];
          _this.$('.mui-numbox-input').val(_this.wareSpec.minWholesale);
          _this.setCurrentSpecInfo(_this.wareSpec,data);
          //_this.inputchange();
        });
      }else{
        $('.shopcart-info-spec').hide();
      }

    },

    commentInfo:null,
    setCommentInfo: function(comments) {
      this.$(".goods-label-evaluate").show();
      var badComment = [],commonComment = [],goodComment = [];
      if(comments.data != undefined){
	      for(var i = 0; i < comments.data.length; i++){
	        if(comments.data[i].grade <= 1){
	          badComment.push(comments.data[i])
	        }else if(comments.data[i].grade >= 2 && comments.data[i].grade <= 3){
	          commonComment.push(comments.data[i])
	        }else {
	          goodComment.push(comments.data[i]);
	        }
	      }
      }
      this.commentInfo = {
        badComment : badComment,
        commonComment: commonComment,
        goodComment : goodComment,
        comments: comments
      };
      if(comments.data == undefined ){
          this.$(".goods-comments-number").text("0");
          this.$("#allComNum").text("0");
          this.$("#goodComNum").text("0");
          this.$("#comComNum").text("0");
          this.$("#badComNum").text("0");
          $('.no-comment').show();
          $('.more-comment').hide();
          return;
        }else{
        	$('.goods-comments-number').text(comments.data.length);
        	$('#allComNum').text(comments.data.length);
        	$('#goodComNum').text(goodComment.length);
        	$('#comComNum').text(commonComment.length);
        	$('#badComNum').text(badComment.length);
        	$('.no-comment').hide();
        	if(comments.data.length>3){
        		$('.more-comment').show();
        	}else{
        		$('.more-comment').hide();
        	}
        }
      this.setCommentList(comments.data);
    },

    setCommentList:function(commentList){
      $(".goods-evaluate-ul").empty();
      for (var i = 0; i < commentList.length && i<3; i++) {
    	  if(typeof(commentList[i].userName) != "undefined" ){
        var li = $("<li class='goods-evaluate-list-li'>");
        var clear = $("<div class='goods-evaluate-clear'>");
        var toggle = $("<div class='goods-evaluate-li-toggle'>");
        var collection = $("<div class='goods-evaluate-li-collection'>");
        var head = $("<img class='goods-evaluate-li-head'>");
        var name = $("<span class='goods-evaluate-li-name'>");
        //var time = $("<span class='goods-evaluate-li-time'>");
        var said = $("<div class='goods-evaluate-li-said'>");
        collection.append(head);
        //collection.append(time);
        clear.append(collection);
        clear.append(name);
        clear.append(toggle);
        li.append(clear);
        li.append(said);
        $(".goods-evaluate-ul").append(li);
        head.attr('src',commentList[i].userHead);
        name.text(commentList[i].userName);
        console.log(commentList[i].userName);
        //time.text(commentList[i].time);
        said.text(commentList[i].comment);
        for (var j = 0; j < commentList[i].grade; j++) {
          var star = $("<div class='goods-evaluate-li-star icomoon-star'>");
          toggle.append(star);
        }
        for (var j = 0; j < (5 - commentList[i].grade); j++) {
          var star = $("<div class='goods-evaluate-li-star-no icomoon-starunclick'><div>");
          toggle.append(star);
        }
      }else{
    	  var li = $("<li class='goods-evaluate-list-li'>");
          var clear = $("<div class='goods-evaluate-clear'>");
          var toggle = $("<div class='goods-evaluate-li-toggle'>");
          var collection = $("<div class='goods-evaluate-li-collection'>");
          var head = $("<img class='goods-evaluate-li-head'>");
          var name = $("<span class='goods-evaluate-li-name'>");
          //var time = $("<span class='goods-evaluate-li-time'>");
          var said = $("<div class='goods-evaluate-li-said'>");
          collection.append(head);
          //collection.append(time);
          clear.append(collection);
          clear.append(name);
          clear.append(toggle);
          li.append(clear);
          li.append(said);
          $(".goods-evaluate-ul").append(li);
          head.attr('src',commentList[i].userHead);
          name.text('未知用户');
          //time.text(commentList[i].time);
          said.text(commentList[i].comment);
          for (var j = 0; j < commentList[i].grade; j++) {
            var star = $("<div class='goods-evaluate-li-star icomoon-star'>");
            toggle.append(star);
          }
          for (var j = 0; j < (5 - commentList[i].grade); j++) {
            var star = $("<div class='goods-evaluate-li-star-no icomoon-starunclick'><div>");
            toggle.append(star);
          }
      }
      };
    },

    setCartInfo: function(addOne) {
      var userInfo = window.application.getUserInfo();
      if(!userInfo)
      {
        $('.goods-shoppingcart-tips').hide();
        return;
      }
      var cartNumber = userInfo.cartNumber;
      if(cartNumber){
        var num = parseInt(cartNumber);
      }
      num = num || 0;
      if(!addOne && num == 0){
        $('.goods-shoppingcart-tips').hide();
        return;
      }
      if(this.shopcart && addOne)
      {
        num = num + parseInt(this.shopcart.quantity);
      }
      if(num > 0){
        $('.goods-shoppingcart-tips').show();
        $('.goods-shoppingcart-tips').text(num > 99 ? '99' : num);
      }else{
        $('.goods-shoppingcart-tips').hide();
      }
      userInfo.cartNumber = num;
      window.application.setLocalStorage('userinfo',userInfo);

    },
    showBigImg: function(){
        $('.bigImg-view').addClass('bigImg-view-show');
    },
    BigImgHide: function(){
        $('.bigImg-view').removeClass('bigImg-view-show');
    },
    showCoupon: function(){
        if($('.goods-coupon-detail').hasClass('coupon-detail-show')){
           $('.goods-coupon-detail').removeClass('coupon-detail-show');
           $('.coupon-launch-ico').removeClass('icomoon-highpull');
           $('.coupon-launch-ico').addClass('icomoon-details');
        }
        else{
           $('.goods-coupon-detail').addClass('coupon-detail-show');
           $('.coupon-launch-ico').removeClass('icomoon-details');
           $('.coupon-launch-ico').addClass('icomoon-highpull');
        }
    },
    filterComment:function(e){
        $('.evaluate-tab').removeClass('evaluate-tab-active');
        $(e.currentTarget).addClass('evaluate-tab-active');
        var index = this.$(e.currentTarget).attr("data-index");
        if(index == 0){
        	if(this.commentInfo.comments.data != undefined){
        		this.setCommentList(this.commentInfo.comments.data);
        	}
        }else if(index == 1){
          this.setCommentList(this.commentInfo.goodComment);
        }else if(index == 2){
          this.setCommentList(this.commentInfo.commonComment);
        }else if(index == 3){
          this.setCommentList(this.commentInfo.badComment);
        }
    },
    goToCommentPage:function(){
        window.app.commentInfo = this.commentInfo;
        $(".goods-evaluate-ul").empty();
        Backbone.history.navigate('#home-navigate/goodsComments?goodsid='+window.application.getQueryString('goodsid'), {
            trigger: true
        });
    },
    shareWindow:function(){
      this.findComponent("ShareView").show();
    },
    goDiscountPackage:function(){
      window.app.packageList = this.package;
        Backbone.history.navigate('#home-navigate/discountPackage',{
           trigger: true
        });
    },
    shareCancel:function(){
        $('.share-popup-view').removeClass('share-popup-view-show');
        //设为隐藏是为了规避fixed布局在回到本页面时元素停滞的问题，不过这样也是治标不治本。。。
        setTimeout(function(){
            $('.share-popup-view').hide();
        },300);
        $('.common-message-cover-no').hide();
    },
    showTips:function(tips){
       $('.tips-without-cover').text(tips);
       $('.tips-without-cover').show();
       setTimeout(function(){$('.tips-without-cover').hide()},1000);
    },
    updatePackagesDetails:function(PackagesData){
        //生成套餐组横条
       for(var i=1 ; i <= PackagesData.length ; i++){
           var discountGroup = "<div class='coupon-packages-table'>";
           discountGroup += "<div class='coupon-packages-num'>套餐"+i+"</div></div>";
           discountGroup = $(discountGroup);
           var discountDetail = $("<div class='goods-group'></div>");
           var discountImg = "";
           for(var j=0 ; j < PackagesData[i].products.length ; j++){
               discountImg = ""
               if(j==PackagesData[i].products.length-1){
                   discountImg += "<div class='goods-group-img'><img src='"+ PackagesData[i].products[j].productImage +"'></div>"
               }
               else{
                   discountImg += "<div class='goods-group-img'><img src='"+ PackagesData[i].products[j].productImage +"'></div>"
                   discountImg += "<div class='goods-plus'>+</div>"
               }
               discountDetail.append($(discountImg));
           }

           discountGroup.append(discountDetail);
           $('.packages-details-row').append(discountGroup);
       }
    }
  });
});
