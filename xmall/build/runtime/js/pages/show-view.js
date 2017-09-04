define(['./PageView','require'], function(PageView,require) {
    return PageView.extend({
    	 events:{
     		'click .icomoon-back':'onBack'
     	},
     	onBack: function(){
     		window.history.back();
     	},
     	 onResume: function () {
     		var view = window.app.showView;
     		this.$('.show-view').html(view)
     	 }

    });
});
