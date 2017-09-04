define(['./BaseView', '../models/CommentCollection', 'underscore'], function(BaseView, CommentCollection, _) {
    return BaseView.extend({
        CommentCollection:new CommentCollection(),
        commentData: null,
        events:{

        },
        initialize: function() {
            this.commentData = this.CommentCollection.toJSON();
        },
        render: function(){
            var template = library.getTemplate('goodsCommentsListView.html');
            var commentList= this.commentData[0].comments;
            var commentDom = [
                '<div class="theme-comment">',
                '<ul class="comment-list">',
                '</ul>',
                '</div>'
            ].join(''), $commentDom = $(commentDom);
            for(var i = 0; i < commentList.length; i++){
                var itemDom = $(template(commentList[i]));
                $commentDom.find('.comment-list').append(itemDom);
            }
            this.$el.append($commentDom);
            return this;
        }
    });
});
