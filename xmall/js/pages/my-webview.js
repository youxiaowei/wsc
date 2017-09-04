define(['./PageView'], function(PageView){
  return PageView.extend({
    type:'my-webview',

    events:{
      "click .goback": "goback"
    },

    onResume: function(){
      PageView.prototype.onResume.apply(this,arguments);
      var url = application.getQueryString("weburl");
      var title = application.getQueryString("webname");
      this.$(".iframe-web").attr("src",url);
      this.$(".ad-title").text(title);
    },

    goback: function(){
      window.history.back();
    },
  });
});
