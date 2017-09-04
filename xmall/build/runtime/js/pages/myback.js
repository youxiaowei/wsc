define(['./PageView','require'], function(PageView,require) {
    return PageView.extend({
    	 events:{
     		'click .order-button-detail':'onBack',
 			'click .order-button-share':'onSave'
     	},
     	onBack: function(){
     		var orderID = window.application.getQueryString('orderId');
     		console.log(orderID.indexOf("#"))
     		orderID = orderID.substring(0,orderID.indexOf("#"));
     	    window.location.href='index.html#my-navigate/order-detail?orderId='+ orderID;
     		/*Backbone.history.navigate("#my-navigate/order-detail?orderId="+orderID,{
    	        trigger:true
   	       })*/
     	},
     	onSave:function(){
     		/*Backbone.history.navigate("#my-navigate",{
    	        trigger:true
   	       })*/
	       window.location.href='index.html';
	    }

    });
});
