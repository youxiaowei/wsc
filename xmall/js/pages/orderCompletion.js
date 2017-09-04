/**
 * Created by Administrator on 2016/6/15.
 */
define(['./PageView','require'], function(PageView,require) {
    return PageView.extend({
    	 events:{
     		'click .order-button-detail':'gotoorder'
     	},
     	gotoorder: function(){
     		var orderID = window.application.getQueryString('orderid');
     		Backbone.history.navigate("#my-navigate/buySuccessDetail?orderid="+orderID,{
     	        trigger:true
     	       })
     	}

    });
});