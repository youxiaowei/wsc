define(['require','./PageView'], function(require,PageView) {
    return PageView.extend({
       events:{
           "click .goback":"goBack",
           "click .pwd-security":"goModifyPwd",
           "click .phone-security":"goBindPhone",
       },
        onRender:function(){
            this.userinfo = application.getUserInfo();
            this.userinfo.phoneNumber = "123";  //假装有手机号
            //this.userinfo.phoneNumber = "";     //假装没有手机号
        },
        goModifyPwd:function(){
            Backbone.history.navigate('#my-navigate/modify-pwd', {
                trigger: true
            });
        },
        goBindPhone:function(){
            if(this.userinfo.phoneNumber){
                Backbone.history.navigate('#my-navigate/bind-mobile', {
                    trigger: true
                });
            }
            else{
                Backbone.history.navigate('#my-navigate/bind-new', {
                    trigger: true
                });
            }
        },
        goBack:function(){
            window.history.back();
        },
    });
});