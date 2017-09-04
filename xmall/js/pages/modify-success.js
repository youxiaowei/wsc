
define(['require', './PageView'], function(require, PageView){
    return PageView.extend({

        defaults:{
            toastTime:null
        },

        initialize: function(options) {
            var count_time = 3;
            PageView.prototype.initialize.apply(this, arguments);
            var int = window.setInterval(function(){
                if(count_time==0){
                    count_time = 3;
                    window.clearInterval(int);
                    this.goBack();
                }
                else{
                    count_time--;
                    this.$el.find('#countdown').html(count_time+"秒钟后自动跳转>>");

                }
            }.bind(this), 1000);
        },
        onResume: function(){
            this.toggleBar && this.toggleBar('hide');
            this.$('.bar').show();
        },

        onBack:function(){
            window.history.back();
        },
        goBack:function(){
            window.localStorage.setItem('userinfo',"");
            var url = "#my-navigate/my";
            Backbone.history.navigate(url, {
                trigger: true
            });
        }

    });
});
