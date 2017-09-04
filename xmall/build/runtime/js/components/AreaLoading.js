define(['./BaseView'], function(BaseView){
  return BaseView.extend({
    type: 'AreaLoading',
    show:function(){
        this.$el.css({"display":"block"});
    },
    hide:function(){
      this.$el.css({"display":"none"});
    },
    render: function(){
      this.$el.addClass("ymall-loading-wrapper");
      this.$el.html("<div class='spinner'><div class='spinner-img'></div></div>");
      return this;
    }
  });
});
