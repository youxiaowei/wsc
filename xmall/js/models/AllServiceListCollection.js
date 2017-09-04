define(['./AjaxCollection'], function(AjaxCollection) {
  return AjaxCollection.extend({
    allDataLoaded: false,

    allServiceUrl: window.app.api+"/getServiceList",
    queryData: {},

    filterData: function(status){
      this.queryData.resultType = status || 0;
      this.ajaxOptions.data = this.queryData;
      this.loadData(this.ajaxOptions);
    },
    filterType: function(type){
      this.queryData.type = type || 0;
      this.queryData.type = this.queryData.type + "";
      this.queryData.index = 1;
      this.ajaxOptions.data = this.queryData;
      this.loadData(this.ajaxOptions);
    },
    reloadData: function(){
      this.ajaxOptions.data.index = 1;
      this.loadData(this.ajaxOptions);
    },
  });
});
