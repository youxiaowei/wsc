define(['./AjaxCollection'], function(AjaxCollection) {
  return AjaxCollection.extend({
    /*
      参数  页码,过滤控件左边的商家id,过滤控价的右边的分类ID
    */
    queryData: {},

    testData:[],

    initialize:function(){
    
    },

    getNextPage:function(){
      this.add([{"name":"ssss"}]);
    },

    filterData: function(type){
      this.queryData.orderStatus = type;
      this.queryData.pageindex = 1;
      this.ajaxOptions.data = this.queryData;
      this.loadData(this.ajaxOptions);
    },
    reloadData: function(){
      this.ajaxOptions.data.pageindex = 1;
      this.loadData(this.ajaxOptions);
    },
  });
});
