define(['./BaseView'], function(BaseView){
  return BaseView.extend({
    type: 'ProductListFilter',
    
    render: function(){
      var header = library.getTemplate('branddetail-list-filter.html');
      this.$el.append(header);
      return this;
    }
  });
});
