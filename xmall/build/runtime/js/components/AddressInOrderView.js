define(['./BaseView'], function(BaseView){
	return BaseView.extend({

    model: null,
    paymentType:null,
		render:function(){
      this.$el.empty();
      if(this.paymentType !="afterpayment"){
        if(this.model){
          var template = library.getTemplate("address-in-order1.html");
          this.$el.append(template(this.model.toJSON()));
        }else{
          var template = library.getTemplate("address-in-order-selector.html");
          this.$el.append(template);
        }
      }else{
        if(this.model){
         var template = library.getTemplate("after-payment-address.html");
         this.$el.append(template(this.model.toJSON()));
        }else{
          var template = library.getTemplate("address-in-order-selector.html");
          this.$el.append(template);
        }
      }
			return this;
		},

    setModel: function(model,type){
      if(model == null) return;
      this.model = model;
      this.paymentType = type;
      this.render();



    },

    getModel: function(){
      return this.model;
    }
	});
});
