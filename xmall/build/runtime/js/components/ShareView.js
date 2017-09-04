define(['./BaseView'], function(BaseView){
  return BaseView.extend({
    type:'ShareView',

    events: {
      "click .common-message-cover-no" : "hide",
      "click .cancel-share": "hide"
    },

    render: function(){
      var template = library.getTemplate("shareview.html");
      this.$el.append(template);
      return this;
    },
    show: function(){
      $('.share-popup-view').show();
      setTimeout(function(){
          $('.share-popup-view').addClass('share-popup-view-show');
      },100);
      $('.common-message-cover-no').show();
    },
    hide: function(){
      $(".common-message-cover-no").hide();
      $('.share-popup-view').removeClass('share-popup-view-show');
    },
  });
});
