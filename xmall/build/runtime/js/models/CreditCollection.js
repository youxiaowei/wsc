define(['./AjaxCollection'], function(AjaxCollection) {
  return AjaxCollection.extend({
    /*
      参数  页码,过滤控件左边的商家id,过滤控价的右边的分类ID
    */
    queryData: {},

    testData:[],

    initialize:function(){
      // this.reset([{
      //   "id":"1",
      //   "image":"http://img5.imgtn.bdimg.com/it/u=2682982557,2493750816&fm=21&gp=0.jpg",
      //   "price":"23",
      //   "point":"322",
      //   "limit":"900",
      //   "name":"燕麦牛奶-饿了就喝国际扛饿大品牌谷粒多燕麦牛奶"
      // },{
      //   "id":"12",
      //   "image":"http://p1.meituan.net/deal/c0ebec5e9ef599c2b1b726cb6a19150c400364.jpg",
      //   "price":"23",
      //   "point":"322",
      //   "limit":"900",
      //   "name":"燕麦牛奶-饿了就喝国际扛饿大品牌谷粒多燕麦牛奶"
      // },{
      //   "id":"21",
      //   "image":"http://img5.imgtn.bdimg.com/it/u=2682982557,2493750816&fm=21&gp=0.jpg",
      //   "price":"23",
      //   "point":"322",
      //   "limit":"900",
      //   "name":"燕麦牛奶"
      // }]);
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
