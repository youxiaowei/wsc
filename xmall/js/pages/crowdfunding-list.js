define(['./PageView'], function(PageView){
  return PageView.extend({
    type:'crowdfunding-list',
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
      // Backbone.history.navigate("#home-navigate/crowdfunding-detail",{
      //   trigger:true
      // })
    },
  });
});
