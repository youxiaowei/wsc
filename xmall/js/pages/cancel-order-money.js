define(['./PageView','require'], function(PageView,require) {
	return PageView.extend({
		type:"cancle-order-reason",
		 events: {		     
		      "click .select_mode li": "selectReason",
		      "click .cancel-next-button":"nextButton",
		      "click .goback":"goback",
		      
		    },
		    reasionId:null, 
		onResume: function(){
			this.$('.bar-tab').hide();
			var _this=this;
			this.orderId = window.application.getQueryString('orderId');
			var Model = require('../models/BaseModel');
			var cancelModel = new Model();
			var options = {
					path: "/cancelOrderComfirmView",
					type: "POST",
					data: {
						orderId:this.orderId,    	                  
					},
					showLoading: true,
					needReset: true,
					success: function(res){
						console.log(res.data.paytype)
						$(".paytype").html(res.data.paytype),
						$(".orderamount").html(res.data.orderamount),
						$(".integralpaid").html(res.data.integralpaid)												
					},
					error:function(){

					}
			}           
			cancelModel.loadData(options);

		},
		
        goback:function(){
        	window.history.back();
        },
        //提交申请退款原因
        nextButton:function(){        	
        	/*if(this.reasionId==null){
       		 library.Toast("请选择退货原因");
       		 return;
       	     }*/
       	var userInfo = window.application.getUserInfo();
       	this.orderId = window.application.getQueryString('orderId');
       	this.reasionId = window.application.getQueryString('reasionId');
       	var suitId = window.application.getQueryString('suitId');
       	var Model = require('../models/BaseModel');
			var cancelMod = new Model();
			var options = {
					path: "/cancellationcharge",
					type: "POST",
					data: {
						orderId:this.orderId,
						memberId:userInfo.userid,
						reasonId:this.reasionId
					},
					showLoading: true,
					success: function(res){
						if(res.status==0){
							library.Toast("操作成功");
							if(suitId == "null"){
					       		Backbone.history.navigate(
					                    "#my-navigate/order-list?list_type=2", {
					                        trigger: true
					                });
							}else{
								Backbone.history.navigate(
					                    "#my-navigate/package-order-list?list_type=2", {
					                        trigger: true
					                });
							}
						}else{
							library.Toast(res.message);
						}
						 
						 

					},
					error:function(){

					}
			}           
			cancelMod.loadData(options);
        	
        }
	});
});