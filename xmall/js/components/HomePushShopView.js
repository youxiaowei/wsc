define(['./ListView','../models/AjaxCollection'], function(ListView,AjaxCollection){
  return ListView.extend({
    type: 'HomePushView',
   /* getCollection: function(){
      return this.collection;
    },*/
    getNextPage:function(){
      var c=this.getCollection();
      c.ajaxOptions = {
        url: window.app.api+"/getShop",
        data: {},
        type: "GET",
        datatype: "json",
        success: function(res){
          if(res.status=="ok"){
              c.reset(null);
              c.reset(res.data);
          }else{
              console.log("获取数据失败");
          }
        },
        error: function(){
          //请求出错处理
        }
      }
      c.loadData();
    }
  });
});
