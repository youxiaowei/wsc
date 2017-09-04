define([ './PageView', 'require' ], function(PageView, require) {
	return PageView.extend({
		events : {
			'click .goback' : 'onBack',
			"click .header-menu" : "menuMore",
			'click .public-detail' : 'godetail',
			'click .order-pay' : 'goShowDietail',
			'click .order-cancel' : 'goBuyAgain',
			'click .order-ensure' : 'goOrderEnsure'
		},
		isEmpty : true,
		initialize : function() {
			this.listenTo(this.findComponent('PopupMenu'), "toSearch",
					this.toSearch.bind(this));

		},
		onResume : function() {		
            this.toggleBar && this.toggleBar("hide");
			var userID =window.application.getUserInfo().userid;
			if(!userID){
				Backbone.history.navigate('#my-navigate/login/login', {
					trigger: true
				});
			   //return;
			}
			var model = this.findComponent("Creditlistingerror").collection;
			_this = this;
			this.findComponent("Creditlistingerror").collection.loadData({
				path : "/getPointOrderList",
				type : "POST",
				needReset : true,
				data : {
					userId : userID,
					index : 1,
					size : 10
				},
				datatype : "json",
				success : function(res) {
					_this.changeDisplay(res);
				},
				error : function() {

				}
			})

		},

		changeDisplay : function(res){
			console.log(res.data.list)
    		if(res.data.list.length>0){
    			this.isEmpty = false;
    		}else{
    			$(".loadmore").hide(); //隐藏查看更多
				if (this.isEmpty) {
					var blankicon = $(
						"<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还没有相关的储粮通宝订单~</div>"
					);
					$("#show_nodata_div").html(blankicon).show();
				}else {
					library.Toast("已加载全部",2000);
				}
    		}
		},
		//确认收货
		goOrderEnsure:function(e){
			var id = this.$(e.currentTarget).prev().text();
			//this.ensureOrder();
			console.log(id);
                return;
		},
		
        //察看商品详情
		goShowDietail:function(e){
			var id = this.$(e.currentTarget).prev().text();
			var orderStatus = this.$(e.currentTarget).prev().prev().text();
			Backbone.history.navigate(
	                '#my-navigate/credit-order-detail?orderId='+id+"&orderStatus="+orderStatus
	                , {
	                    trigger:true
	                });
		},
		

		goBuyAgain:function(){
			Backbone.history.navigate(
	                '#my-navigate/credit', {
	                    trigger:true
	                });
		},
		toSearch : function(e) {
			this.findComponent("SearchMidPageView").show();
		},
		onBack : function() {
			window.history.back();
		},
		menuMore : function(e) {
			this.findComponent("PopupMenu").show();
		}
	});
});