//物流信息 订单详情页中使用
// author Vicent
define(['./BaseView'], function(BaseView){
	return BaseView.extend({
    type:"LogisticInfoView",
    model: null,

		render:function(){
      this.$el.empty();
      if(this.model){
				this.$el.show();
        var template = library.getTemplate("logistics.html");
        this.$el.append(template(this.model.toJSON()));
      }else{
				this.$el.hide();
			}
			return this;
		},

    setModel: function(model){
      this.model = model;
      this.render();
    },

    getModel: function(){
      return this.model;
    }
	});
});
