/**
 * Created by liuqingling on 15/11/28.
 */
define(['./PageView'], function(PageView) {
    return PageView.extend({

        data:[
            {id:1,name:"1"},
            {id:2,name:"11"},
            {id:3,name:"1111"},
            {id:4,name:"111"},
            {id:5,name:"1"},
        ],

        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onRender:function(){
            this.$('.goodscategory').on('click','li',this.onItemSelect.bind(this));
        },
        onItemSelect:function(e){
            alert(e.currentTarget.innerHTML);
        }

    });

});
