define(['./BaseView','../models/AjaxCollection'], function(BaseView,AjaxCollection){
  var CommentCollection = AjaxCollection.extend({
  });
  return BaseView.extend({

    type: "ProductComment",
    commentsData:null,

    initialize: function(){
        this.commentsData = new CommentCollection();
    },
    initData: function(paramInfo){
      if(!paramInfo || !paramInfo.productId){
        return;
      }
      var data = {
        id: paramInfo.productId,
        pagesize: 10,
        pageindex: 1
      }
      var me = this;
      var options = {
          url: window.app.api+"/product-detailevaluate",
          type: 'GET',
          data: data,
          success: this.setData.bind(this),
          error: function(){
          }
      }
      this.commentsData.loadData(options);
    },

    setData: function(data){
      if(!data || data.status == 'error'){
        library.Toast(data ? data.message : "网络出错",2000);
        return;
      }
      else if(data.data.evaluateList.length<1){
          $('#goods-all-comments').hide();
          $('.blank_tips').show();
      }
      else{
          $('.blank_tips').hide();
          $('#goods-all-comments').show();

      data = data.data;
      $('.goods-evaluate-number-text').text("("+data.evaluateCount+")");
      $('.goods-evaluate-ratio').text(data.good);
      $(".goods-evaluate-ul").empty();
      console.log(data);
      for(var i=0;i<data.evaluateList.length;i++)
      {
        var li = $("<li class='goods-evaluate-list-li'>");
        var clear = $("<div class='goods-evaluate-clear'>");
        var toggle = $("<div class='goods-evaluate-li-toggle'>");
        var collection = $("<div class='goods-evaluate-li-collection'>");
        var name = $("<span class='goods-evaluate-li-name'>");
        var time = $("<span class='goods-evaluate-li-time'>");
        var said = $("<div class='goods-evaluate-li-said'>");
        collection.append(name);
        collection.append(time);
        clear.append(collection);
        clear.append(toggle);
        li.append(clear);
        li.append(said);
        $(".goods-evaluate-ul").append(li);
        name.text(data.evaluateList[i].usernick);
        time.text(data.evaluateList[i].commentdate);
        said.text(data.evaluateList[i].commentdata);
        for(j=0;j<data.evaluateList[i].commentscore;j++)
        {
          var star = $("<div class='goods-evaluate-li-star icomoon-star'>");
          toggle.append(star);
        }
        for(j=0;j<(5-data.evaluateList[i].commentscore);j++)
        {
          var star = $("<div class='goods-evaluate-li-star-no icomoon-starunclick'><div>");
          toggle.append(star);
        }

      };
      }
    },

    render: function(){
        this.$el.empty();
        /*var template=this.model.findWhere({goodsid:"5670db0895f73e7e773bb9f4"})
        if(template){
            this.$el.html(template.get("detailInfo"));
        }*/
      var header = library.getTemplate('product-detail-comment.html');
      this.$el.append(header);
      return this;
    },

    refresh: function(){
      this.render();
    }
  });
});
