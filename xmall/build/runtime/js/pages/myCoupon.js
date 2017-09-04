define(['./PageView','require'], function(PageView,require){
    return PageView.extend({
    events:{
      'click .goback': 'onBack',
      "click .header-menu": "menuMore",
      "click .my-cou-tabs-item": "tabClick",
      "click .overdue-button": "overdue",
      "click .cou-shuoming": "toDescription",
      'click .getCoupon':"getCoupon"
    },
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    getCoupon:function(e){
      var GetCouponModel = require('../models/BaseModel');
      this.getCouponModel = new GetCouponModel();
      // 测试账户id： bd80117ce97049a8b8444989a4161b90
      this.getCouponModel.loadData({
        path:"/getCoupon",
        data:{
          userId:application.getUserInfo().userid,
          couponid:e.target.getAttribute("data-id")
        },
        type:"POST",
        success:this.getSuccess.bind(this),
        error:this.getError.bind(this)
      });
    },
    getSuccess:function(){},
    getError:function(){},
    overdue: function(){
       Backbone.history.navigate('#my-navigate/overdueCoupon', {
        trigger: true
      });
    },
    tabClick:function(e){

      var index = e.target.getAttribute("data-index");
      if(index&&index!=this.curSelected){
        $(".my-cou-tabs-selected").removeClass("my-cou-tabs-selected");
        $(e.target).addClass("my-cou-tabs-selected");
        this.curSelected = index;
      }
      this.onActive(this.curSelected);
    },

    onActive: function(status){
      if(status == 1){
          this.$('.mycoupon-listview').show();
          this.$('.unusecoupon-listview').hide();
          this.loadAllcoupon();
      }else{
          this.$('.mycoupon-listview').hide();
          this.$('.unusecoupon-listview').show();
          this.loadUnusecoupon();
      }
    },
    toDescription: function(){
      Backbone.history.navigate("/my-navigate/coupdes",{
        trigger:true
      });
    },
    loadUnusecoupon:function(){
      /*this.findComponent("unusecouponlistview").collection.loadData({
        path:"/getCouponList",
        type:"POST",
        needReset:false,
        data: {
          userId:"bd80117ce97049a8b8444989a4161b90",//暂时默认这个号码
          type:"2",
          index:1,
          size:100
        },
        success:this.loadUnUseSuccess.bind(this),
        error:this.loadUnUseError.bind(this)
      });*/
    	console.log("aaaaa"+application.getUserInfo().userid);
        this.findComponent("unusecouponlistview").collection.loadData({
            path:"/getCouponList",
            type:"POST",
            needReset:false,
            data: {
                userId:application.getUserInfo().userid,
                type:"2",
                index:1,
                size:100
            },
            success:this.loadUnUseSuccess.bind(this),
            error:this.loadUnUseError.bind(this)
        });
    },
    loadUnUseSuccess:function(data){
    	if(data.data.couponList.length > 0){   		
    		this.findComponent("unusecouponlistview").collection.set(data.data.couponList);
    	}else{
//    		this.$(".table-view").hide();
//    		this.$(".loadmore").hide(); //隐藏查看更多
    	}
    },
    loadUnUseError:function(){},

    curSelected: 2,
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    onBack:function(){
      window.history.back();
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.onActive(this.curSelected);
      /*this.findComponent("mycouponlistview").collection.loadData({
        path:"/getCouponList",
        type:"POST",
        needReset:false,
        data: {
          userId:"bd80117ce97049a8b8444989a4161b90",//暂时默认这个号码,测试使用
          type:"1",
          index:1,
          size:10
        },
        success:this.loadSuccess.bind(this),
        error:this.loadError.bind(this)
      });*/
        this.findComponent("mycouponlistview").collection.loadData({
            path:"/getCouponList",
            type:"POST",
            needReset:false,
            data: {
                userId:application.getUserInfo().userid,
                type:"0",
                index:1,
                size:10
            },
            success:this.loadSuccess.bind(this),
            error:this.loadError.bind(this)
        });
    },
    loadAllcoupon:function(){
    	this.findComponent("mycouponlistview").collection.loadData({
            path:"/getCouponList",
            type:"POST",
            needReset:false,
            data: {
                userId:application.getUserInfo().userid,
                type:"0",
                index:1,
                size:10
            },
            success:this.loadSuccess.bind(this),
            error:this.loadError.bind(this)
        });
    },
    loadSuccess:function(data){
    	this.findComponent("mycouponlistview").collection.add(data.data.couponList);
    },
    loadError:function(){

    }

  });
});
