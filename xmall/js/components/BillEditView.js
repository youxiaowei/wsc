// 发票编辑信息组件
define(['./BaseView', 'require'], function(BaseView, require) {
  return BaseView.extend({

    switchView: null,

    events: {
      "click .bill-submit": "submit",
      "click .bill-info-back": "onFinish"
    },

    initialize: function() {
      var SwitchView = require('./SwitchView');
      this.switchView = new SwitchView();
      this.switchView.callBack = this.billEnabled.bind(this);
    },

    render: function() {
      this.$el.empty();
      this.$el.append(library.getTemplate('bill-edit.html'));
      this.$(".bill-switch-view").append(this.switchView.render().el);
      this.switchView.setBgBland();
      return this;
    },

    setBillInfo: function(options) {
      if (options) {
        this.switchView.setStatus(true);
        $(".bill-title").val(options.title);
        $(".bill-content").val(options.content);
      } else {
        this.switchView.setStatus(false);
      }
      this.billEnabled(options);
    },

    submit: function(e) {
      result = {};
      result.title = $('.bill-title').val();
      result.content = $('.bill-content').val();
      if (!result.title) {
        library.Toast("请填写发票标题", 2000);
        return;
      }
      if (!result.content) {
        library.Toast("请填写发票内容", 2000);
        return;
      }
      this.onFinish();
      this.callBack && this.callBack(result);
    },

    billEnabled: function(status) {
      if (status) {
        $('.bill').show();
      } else {
        $('.bill').hide();
      }
    },
    onFinish: function() {
      this.billEnabled();
      this.$el.removeClass('bill-root-view-show');
    },
  });
});
