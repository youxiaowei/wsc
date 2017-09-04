define(['./PageView'], function(PageView){
    return PageView.extend({
    events:{
      'click .goback': 'onBack',
      'click .cdt-detail':'gotoDetail',
      'click .cdt-transform':'gotoTransform',
      'click .cdt-cell': 'gotogoodsDetail',
      "click .header-menu":"menuMore"
    },
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));

    },

    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    gotoDetail:function(){
      Backbone.history.navigate('#my-navigate/credit-detail', {
        trigger: true
      })
    },
    onResume:function(){
      PageView.prototype.onResume.apply(this,arguments);
      var userInfo = application.getUserInfo();
        var point = userInfo.myPoints;
        var pointFloor  = Math.floor(Number(point));
        var numInt = pointFloor .toString();
      this.$(".cdt-my-value").text(numInt);
    },
    gotoTransform:function(){
      Backbone.history.navigate('#my-navigate/transferPoint', {
        trigger: true
      })
    },

    onBack:function(){
      window.history.back();
    },

    refreshList:function(shopitem,categoryitem){
      shopitem = shopitem||{};
      categoryitem = categoryitem||{};
      // // alert("～"+shopitem.name+" "+categoryitem.name+"");
      //
      this.findComponent("creditlistview").collection.loadData(
        {
          path:"/getCreditGoods",
          type:"POST",
          needReset:false,
          data: {
            channelId:shopitem.id,
            categoryId:categoryitem.id,
            index:1,
            size:10
          },
          success:this.loadSuccess.bind(this),
          error:this.loadError.bind(this)
        }
      )
    },
    loadSuccess:function(data){
      this.findComponent("creditlistview").collection.set(data.data.productlist);
    },
    loadError:function(){},
    gotogoodsDetail:function(e){
        Backbone.history.navigate('#my-navigate/pointitemdetail?goodsid='+e.currentTarget.getAttribute("productid"), {
            trigger: true
        });
    }
  });
});
