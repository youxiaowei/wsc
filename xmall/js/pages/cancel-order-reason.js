/**
 * Created by Administrator on 2016/6/15.
 */
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
					path: "/cancelOrderView",
					type: "POST",
					data: {
						orderId:this.orderId,    	                  
					},
					showLoading: true,
					needReset: true,
					success: function(res){
						console.log(res)
						_this.updateUI(res);

					},
					error:function(){

					}
			}           
			cancelModel.loadData(options);

		},
		updateUI: function (data) {
	        this.productInfoObj = data;
	        this.setSupportInfo(data.data);
		},
		setSupportInfo: function (data) {
			this.$('#cancel').text(data.ordersn)
            var disListWait = this.$(".cancel-title");
            disListWait.html("");
            for (var i = 0; i < data.reasonList.length; i++) {
            	disListWait.append(this.getLevelItem(data.reasonList[i]));
            }
        },
        getLevelItem: function (item) {
            var template = library.getTemplate("cancel-order-reasion-list.html");
            return template(item);
        },
        selectReason:function(e){
        	this.reasionId =$(e.currentTarget).prev().text();
        	$("li").find("i").removeClass("select").addClass("no_select");
        	$(e.currentTarget).find("i").removeClass("no_select").addClass("select");
        	
        },
        goback:function(){
        	window.history.back();
        },
        //提交退款原因
        nextButton:function(){
        	if(this.reasionId==null){
        		 library.Toast("请选择退货原因");
        		 return;
        	}
        	var userInfo = window.application.getUserInfo();
        	this.orderId = window.application.getQueryString('orderId');
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
					needReset: true,
					success: function(res){
						if(res.status==0){
							library.Toast(res.message);
							window.history.back();
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