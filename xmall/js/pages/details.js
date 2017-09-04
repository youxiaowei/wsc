/**
 * Created by Terence on 15/12/04.
 */
define(['./PageView'], function(PageView){
    return PageView.extend({
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    events:{
      'click .icomoon-back': 'onBack',
    },
    onBack:function(){
      window.history.back();
    }
  });
});
