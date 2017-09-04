define(['./PageView'], function(PageView) {
  return PageView.extend({


    render: function() {
      PageView.prototype.render.apply(this, arguments);
      this.$('.MySegmentedView').addClass('detail-page-segmented');

      return this;
    },
    onRender: function() {
      this.$el.find('.goods-label-collection-link').click(function() {
        window.history.back();
      });
    }
  });

});
