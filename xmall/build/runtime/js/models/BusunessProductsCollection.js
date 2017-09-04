
define(['./AjaxCollection'], function(AjaxCollection){

  return AjaxCollection.extend({

    queryData:{},
    url:window.app.api,

    onFilter: function(options){
      console.log(options);
      console.log(this.ajaxOptions);
      if(!options){
        return;
      }
      this.ajaxOptions.data.category = options.category.join(',');
      this.ajaxOptions.data.brandid = options.brand.join(',');
      this.ajaxOptions.data.priceMin = options.price.min;
      this.ajaxOptions.data.priceMax = options.price.max;
      this.ajaxOptions.data.sorttype = 5;
      this.ajaxOptions.data.pageindex = 1;//查询第一页
      this.loadData();
    },
  });
});
