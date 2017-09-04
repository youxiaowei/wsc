define(['require', './PageView'], function(require, PageView) {
  return PageView.extend({

    defaults: {
      toastTime: null
    },

    events:{
      "click .header-icon-back":"goBack"
    },
    initialize: function(options) {
      var count_time = 3;
      PageView.prototype.initialize.apply(this, arguments);
      var int = window.setInterval(function() {
        if (count_time == 0) {
          count_time = 3;
          window.clearInterval(int);
          this.onBack();//youxw5
        } else {
          count_time--;
          this.$el.find('#countdown').html(count_time + "秒钟后自动跳转>>");
        }
      }.bind(this), 1000);
    },
    onBack: function() {//youxw5
        Backbone.history.navigate("#my-navigate",{
          trigger:true
        });
    },
    goBack: function() {
      window.history.back(-3);//youxw5
    }

  });
});
