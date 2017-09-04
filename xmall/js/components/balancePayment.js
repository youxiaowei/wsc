define(['./BaseView'], function(BaseView) {
    return BaseView.extend({
        type: "balancePayment",
        events: {

        },

        callBack: null,
        render: function(){
            var template = library.getTemplate('balancePayment.html');
            this.$el.append(template);
            return this;
        },

    })
})
