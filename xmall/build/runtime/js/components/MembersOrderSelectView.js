// 会员订单日期筛选
// author ColinYeah
define(['./BaseView'], function(BaseView){
    return BaseView.extend({


        events: {
            "click .drawBack": "goBack",
            "click .notify-sex-mile": "selectMile",
            "click .notify-sex-femile": "selectFemile",
            "click .notify-sex-unknown": "selectUnknown",
        },

        initialize: function(){

        },
        render: function(){
            this.$el.empty();
            var template = library.getTemplate("MembersOrderSelect.html");
            this.$el.append(template);
            return this;
        },



        goBack: function(){
            var _this = this;
            $(".member-order-view").removeClass("member-order-view-show");

            setTimeout(function(){_this.remove()},300);
            $(".full-mask").hide();
        },
        remove: function(){
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });
});
