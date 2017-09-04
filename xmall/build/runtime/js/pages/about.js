define(['./PageView','require'], function(PageView,require){
    return PageView.extend({
    events:{
      'click .header-icon-back': 'onBack',
      "click .icomoon-moremore":"menuMore"
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
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onBack:function(){
      window.history.back();
    },
    onResume: function() {
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();

      var checkUpdateModel = require('../models/BaseModel');
      var checkUpdate = new checkUpdateModel();
      checkUpdate.loadData({
        path:"/checkVersionUpdate",
        type:"POST",
        data:{},
        success:function(){},
        error:function(){

        }
      });

    }
  });
});
