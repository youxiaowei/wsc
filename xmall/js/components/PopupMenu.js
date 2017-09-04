define(['./BaseView'], function(BaseView){
	return BaseView.extend({
    type: "PopupMenu",
    events:{
      "click .root-popup-menu":"dismiss",
			"click .menu-home": "toHome",
			"click .menu-message": "toMessage",
			"click .menu-search": "toSearch"
    },

		render:function(){
      var template = library.getTemplate("popup-menu.html");
      this.$el.append(template);
			return this;
		},
    show: function(){
      this.$(".root-popup-menu").show();
      this.$(".popup-menu").addClass("popup-menu-show");
    },
    hide: function(){
      this.$(".popup-menu").removeClass("popup-menu-show");
      this.$(".root-popup-menu").hide();
    },
    dismiss: function(){
      this.hide();
    },
		toHome: function(e){
			this.togo("#home-navigate/home");
		},
		toMessage: function(e){
			this.dismiss();
			this.togo("#my-navigate/messageCenter");
		},
		toSearch: function(e){
			this.dismiss();
			this.trigger("toSearch",this);
		},
		togo: function(path){
			this.dismiss();
			console.log(path);
			Backbone.history.navigate(path,{
				trigger:true
			})
		},
	});
});
