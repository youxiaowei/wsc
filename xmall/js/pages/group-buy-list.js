define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'group-buy-list',
    events:{
      'click .goback': 'goback',
      'click .header-menu':'menuMore',
      'click .group-list-item':'itemClick'
    },
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    goback: function(e) {
      window.history.back();
    },
    itemClick: function(e){
       var id = this.$(e.currentTarget).attr('data-id');
       Backbone.history.navigate("#home-navigate/group-buy-detail?goodsid="+id,{
        trigger:true
       })
    },
    onResume: function(){
      this.toggleBar && this.toggleBar("hide");
      var model = this.findComponent("GroupBuyListView").collection;
      //var Model = require('../models/GroupBuyListCollection');
          //var model = new Model();
          _this = this;
          var options = {
              path: "/getGroupList",
              type: "POST",
              needReset: true,
              data:{
                index: '1',
                size: '10'
              },
              showLoading: true,
              datatype: "json",
              success: function(res) {
                _this.dealTime(res);
                _this.changeDisplay(res);
              },
              error: function() {
              }
          };
       model.loadData(options);
    },
    changeDisplay : function(res){

    	  if(res.data.pageCount==0 || !res.data.pageCount){
				this.$(".loadmore").hide();
				this.$(".table-view").hide();
			}else{
				this.$("#picturehavent").hide();
				this.$(".add-blank-leaving-words").hide();
			}
		},
    dealTime:function(res){



    },
  });
});
