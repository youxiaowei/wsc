define(['./PageView'], function(PageView){
    return PageView.extend({
    events:{
      'click .icomoon-back': 'onBack',
      "click .icomoon-moremore":"menuMore",
      'click .gotodetail':"gotoDetail",
      'click #goHome':"goHome"
    },
    initialize: function(){
      // this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    goHome:function(){
      Backbone.history.navigate('#home-navigate', {
        trigger: true
      });
    },
    gotoDetail:function(){
      Backbone.history.navigate('#my-navigate/myBalanceDetail', {
        trigger: true
      });
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
      this.$(".my-balance-num").text(application.getUserInfo().myBalance);
    }
  });
});
