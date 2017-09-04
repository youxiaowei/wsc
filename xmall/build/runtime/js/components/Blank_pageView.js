define(['./BaseView', 'require'], function(BaseView, require) {
    return BaseView.extend({

        type: 'blank_page',
        render:function(){

           var html = '<div class="blank_div" style="display: none"><div class="blank_div_ico  icomoon-without"></div><div class="blank_div_label">啥都木有</div></div>';

           this.$el.html(html);
           return this;
        }
    });
});