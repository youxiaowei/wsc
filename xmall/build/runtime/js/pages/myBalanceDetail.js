define(['./PageView'], function(PageView){
    return PageView.extend({
    events:{
      'click .icomoon-back': 'onBack',
      "click .icomoon-moremore":"menuMore"
    },
    initialize: function(){
      // this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onBack:function(){
      window.history.back();
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      // this.$('.bar').show();

      this.findComponent("mybalancedetail").collection.loadData({
        path:"/getBalanceDetail",
        type:"POST",
        needReset:false,
        data: {
          userId:"010081K073B616AFV1SU",//暂时默认这个号码
          index:1,
          size:10
        },
        success:this.loadSuccess.bind(this),
        error:this.loadError.bind(this)
      });
    },
    loadSuccess:function(data){
      this.findComponent("mybalancedetail").collection.set(data.data.balanceList);
    },
    loadError:function(){

    }
  });
});
