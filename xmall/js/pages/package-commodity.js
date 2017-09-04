/**
 * Created by Administrator on 2016/6/15.
 */
define(['./PageView','require'], function(PageView,require) {
    return PageView.extend({
    	type:'GroupBuyListView',
        events:{
          'click .goback': 'goback',
          'click .header-menu':'menuMore',
          'click .list-content':'toDetail'
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
        onResume: function() {
          this.toggleBar && this.toggleBar("hide");
        	_this = this;
        	var model = this.findComponent("GroupBuyListView").collection;
            var options={
                path: '/getGoodsSetList',
                type: "POST",
                needReset: true,
                data: {
                	size:10,
                	index:1,
                	sortStyle:'',
                	sortOrder:''
                },
                success: function(res) {
                    if(res.data.suitList.length>0){
                		$("#show_nodata_div").hide();
                	}else{
                		 $(".loadmore").hide();
                		 var blankicon = $(
                                 "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>还没有相关的众筹，请耐心等待，惊喜马上到来~</div>"
                             );
                		 $("#show_nodata_div").html(blankicon).show();
                	}
                },
                error:function(){

                }
            };
           model.loadData(options);
        },
        toDetail:function(e){
        	var packageId = this.$(e.currentTarget).find(".package-list-id").text();
        	console.log(packageId)
        	Backbone.history.navigate(
                    '#my-navigate/packagedetail?packageId=' + packageId, {
                        trigger: true
                    });
        }
    });
});