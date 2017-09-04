define(['backbone', 'backbone.paginator'], function(Backbone, PageableCollection){

  /*
   * 需要支持：
   * 客户端搜索
   * 服务端搜索
   */
  return PageableCollection.extend({

    id:'', //数据源id

    url: '', //数据源路径

    mode: "infinite",

    //初始化状态
    state:{
      pageSize: 10,
      firstPage: 1,
    },

    search: function(query){
      console.log("searching")
      if (_.isEmpty(query)) {
        //过滤条件为空，恢复全集
        this.trigger("reset", this.fullCollection.models );
      } else if (_.isFunction(query)) {
        // 使用迭代器过滤
        var filtered = this.fullCollection.filter(query).map(function(each){
          return each.clone();
        });
        this.trigger("reset", filtered );
      } else {
        // 使用map条件过滤
        var filtered = this.fullCollection.where(query).map(function(each){
          return each.clone();
        });
        this.trigger("reset", filtered );
      }
    },

    groupBy: function(){

    },

    onError: function(collection, response, options){
      console.log('on error');
      this.trigger('error', this);
    },
    hasNextPage: function(){
      return true;
    },
  });
});
