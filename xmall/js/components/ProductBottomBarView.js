define(['./BaseView'], function(BaseView){
  return BaseView.extend({

    render: function(){
      var template = library.getTemplate('product-bottom-bar.html');
      this.$el.append(template);
      return this;
    },
    getCollection: function(){
      return this.collection;
    }
  });
});
