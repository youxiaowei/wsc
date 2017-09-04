define(['./AjaxCollection'], function(AjaxCollection) {
  return AjaxCollection.extend({
    /*
      参数  页码,过滤控件左边的商家id,过滤控价的右边的分类ID
    */
    queryData: {},

    testData:[],

    initialize:function(){
      // this.reset([{
      //   "point":"-322",
      //   "desc":"兑换什么",
      //   "time":"2013-02-12 23:23:22"
      // },{
      //   "point":"10",
      //   "desc":"评论晒图",
      //   "time":"2013-02-12 23:23:22"
      // },{
      //   "point":"10",
      //   "desc":"评论晒图-速度速度速度",
      //   "time":"2013-02-12 23:23:22"
      // }]);
    },

    getNextPage:function(){
      //this.add([{"name":"ssss"}]);
    },
    parse:function(data){
      console.log(data);
      alert("s");
      return data.productlist;
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
