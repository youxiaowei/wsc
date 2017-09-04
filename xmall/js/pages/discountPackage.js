define(['./PageView', 'require'], function(PageView,require) {
    return PageView.extend({
        events:{
            "click .discount-list-title":"spreadDetail",
            "click .goback":"goBack",
            "click .buy-now-btn":"toBuy"
        },

        packageList : null,

        initialize:function(){

        },
        onRender:function(){

        },
        onResume:function(){
          this.packageList = window.app.packageList;
          this.setInfo();
        },

        setInfo:function(){
          if(!this.packageList) return;
          //var template = library.getTemplate("discount-package-list-item.html");
          //var listView = this.$(".package-content");
          //listView.empty();
          for(var i = 0; i < this.packageList.length; i++){
            this.packageList[i].index = i;
            //listView.append($(template(package)));
          }
          this.findComponent("PackageListView").collection.reset(this.packageList);
        },

        spreadDetail:function(e){
           var targetGroup = $(e.currentTarget).parent().find('.discount-group');
           var targetIco =  $(e.currentTarget).find('.right-icomoon');
           var targetImgGroup = $(e.currentTarget).parent().find('.discount-img-group');
           if(targetGroup.hasClass('group-list-active')){
               targetIco.removeClass('icomoon-highpull');
               targetIco.addClass('icomoon-spread');
               targetGroup.removeClass('group-list-active');
               targetImgGroup.show();
           }
            else{
               targetIco.removeClass('icomoon-spread');
               targetIco.addClass('icomoon-highpull');
               targetGroup.addClass('group-list-active');
               targetImgGroup.hide();
           }
        },

        toBuy:function(e){
          var view = $(e.currentTarget);
          var packageId = view.attr("data-pid");
          var package = this.findComponent("PackageListView").collection.find({packageId:packageId});
          var orderInfo = this.getOrderInfo(package);
          window.app.shopsOrder = orderInfo;
          Backbone.history.navigate("#home-navigate/create-order",{
            trigger:true
          });
        },

        getOrderInfo:function(package){
          var orderObj = {};
          orderObj.packageId = package.get("packageId");
          orderObj.packageNumber = 1;
          orderObj.packagePrice = package.get("packagePrice");
          orderObj.items = [];
          var products = package.get("products");
          for(var i = 0; i < products.length; i++){
            var item = {};
            item.name = products[i].goodsTitle;
            item.goodsSpec = products[i].goodsSpec;
            item.totalPrice = products[i].productPrice;
            item.itemNumber = products[i].goodsNum;
            item.imgurl = products[i].productImage;
            item.productId = products[i].productId;
            orderObj.items.push(item);
          }
          var orderInfo = [];
          orderInfo.push(orderObj);
          return orderInfo;
        },

        goBack:function(){
            window.history.back();
        }
    });
});
