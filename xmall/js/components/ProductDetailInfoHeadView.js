define(['./BaseView'], function(BaseView){
  return BaseView.extend({

    render: function(){
      var template = library.getTemplate('product-detail-head.html');
      this.$el.append(template);
      return this;
    }
  });
});
