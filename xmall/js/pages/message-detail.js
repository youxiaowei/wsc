define(['./PageView'], function(PageView){
  return PageView.extend({
    type:'message-detail',
    events: {
      'click .icomoon-back': 'onBack',
      "click .icomoon-moremore":"menuMore",
    },
    data:null,
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },

    onResume: function(){
      PageView.prototype.onResume.apply(this,arguments);
      /*console.log(window.app.msgData.attributes.messageContent);*/
      this.data = window.app.msgData.attributes;
      this.updateUI();
    },

    updateUI: function(){
      if(this.data){
        this.$(".mc-name").text(this.data.messageTitle);
        this.$(".mc-time").text(this.data.messageTime);
        this.$(".mc-desc-detail").text(this.data.messageContent);
      }
    },

    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },

    onBack:function(){
      window.history.back();
    },
  });
});
