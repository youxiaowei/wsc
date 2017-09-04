define(['require','./PageView'], function(require,PageView) {
    return PageView.extend({

        events: {
            'click #modify-pwd': 'onPwdClick',
            'click #modify-mobile': 'onMobile',
            'click .header-icon-back': 'onBack'
        },
        model: null,
        type:'security',
        initialize: function() {
            var userinfo=JSON.parse(localStorage.getItem('userinfo'));
            if(userinfo.sex==0){
                userinfo.sex='男';
            }else if(userinfo.sex==1){
                userinfo.sex='女';
            }else{
                userinfo.sex='保密';
            }
            var Model = require('../models/MyAccountModel');
            //this.model = new Model();
            //var Model = require('../models/MyAccountModel');
            this.model = new Model({
                account: userinfo.nickname,
                name: userinfo.username,
                sex: userinfo.sex,
                birthday: userinfo.birthday,
                headurl: userinfo.usericon,
                phoneNum:userinfo.mobile,
            });
        },
        //render: function() {
        //    PageView.prototype.render.apply(this, arguments);
        //    return this;
        //},

        render: function() {
            this.$el.empty();
            if (this.options.header) {
                this.$el.addClass("page-with-header");
                var header = this.getHeaderView(this.options.header);
                this.$el.append(header);
            }
            loader.getPageTemplate('security.html')
                .then(function(template) {
                        var _model = this.model ? this.model.toJSON() : {};
                        var $template = $(template(_model));
                        this.$el.append($template);
                }.bind(this));
            return this;
        },
        onPwdClick: function(e) {
            Backbone.history.navigate('#my-navigate/modify-pwd', {
                trigger: true
            })
        },

        onMobile: function(e) {
            Backbone.history.navigate('#my-navigate/bind-mobile', {
                trigger: true
            })
        },

        onResume: function() {
            this.toggleBar && this.toggleBar('hide');
            this.$('.bar').show();

        },
        onBack:function(){
            window.history.back();
        },

    });
});

