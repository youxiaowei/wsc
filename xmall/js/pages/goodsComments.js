define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'logiticsDetail',

    events:{
      'click .left-right': 'onBack',
      "click .icomoon-moremore":"menuMore",
      "click .evaluate-tab":"filterComment"
    },
    initialize: function(){
    },
    onRender:function(){
    },
    onResume: function(){
        var goodsid=window.application.getQueryString('goodsid');
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
      this.commentInfo = window.app.commentInfo;
      console.log(window.app.commentInfo);
      window.app.commentInfo = null;
      if(this.commentInfo.comments.data == undefined ){
    	  this.$('#allComNum').text("0");
      }else{
    	  this.$('#allComNum').text(this.commentInfo.comments.data.length);
      }
    	  this.$('#goodComNum').text(this.commentInfo.goodComment.length);
    	  this.$('#comComNum').text(this.commentInfo.commonComment.length);
    	  this.$('#badComNum').text(this.commentInfo.badComment.length);
      this.setCommentList(this.commentInfo.comments.data);
    },
    onBack:function(){
      window.history.back();
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    setCommentList:function(list){
      this.findComponent("CommentListView").collection.reset(list);
    },
    filterComment:function(e){
      $('.evaluate-tab').removeClass('evaluate-tab-active');
      $(e.currentTarget).addClass('evaluate-tab-active');
      var index = this.$(e.currentTarget).attr("data-index");
      if(index == 0){
        this.setCommentList(this.commentInfo.comments.data);
      }else if(index == 1){
        this.setCommentList(this.commentInfo.goodComment);
      }else if(index == 2){
        this.setCommentList(this.commentInfo.commonComment);
      }else if(index == 3){
        this.setCommentList(this.commentInfo.badComment);
      }
    },

  });
});
