define(['./PageView'], function(PageView){
  return PageView.extend({
    type:'feedback',

    events:{
          'click .goback': 'onBack',
          'click .btnfeedback': 'commit',
          "click .header-menu":"menuMore"
    },
    initialize: function(){
       this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    render:function(){
      PageView.prototype.render.apply(this,arguments);
      return this;
    },
    onResume: function(){
      this.toggleBar && this.toggleBar("hide");
      this.$('.bar').show();
    },

    onBack:function(){
      window.history.back();
    },
    commit:function(){
      var content = this.$(".user-feedback-text").val();
      if(content){
        window.history.back();
       library.Toast("提交成功",1000);
      }else{
         library.Toast("提交内容不能为空",1000);
      }
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    }
  });
});
