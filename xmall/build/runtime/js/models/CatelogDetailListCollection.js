define(['./AjaxCollection'], function(MongoRestCollection){
  return MongoRestCollection.extend({
    //id:"",
    //url:function(){
    //      return (window.app ? window.app.api :"")+"/categorydetaillist";
    //},
    //loadData:function(id,calbacks){
    //  this.id = id;
    //  this.fetch(
    //    {
    //      success:function(data){
    //        calbacks.success&&calbacks.success(data);
    //      },
    //      error:function(){
    //        calbacks.error&&calbacks.error();
    //      }
    //    }
    //  );
    //},
    //parse:function(data,options){
    //  var current_cate = {},
    //      _this = this;
    //  data.forEach(function(item, index){
    //      if(item.catelogymemuid == _this.id) {
    //          current_cate = item;
    //          return;
    //      }
    //  })
    //  return current_cate;
    //}
  });
});
