define(['./BaseView'], function(BaseView){
  return BaseView.extend({
    type: 'ProductListHeader',

    render: function(){
      var header = library.getTemplate('product-list-header.html');
      this.$el.append(header);
      return this;
    }
  });
});
