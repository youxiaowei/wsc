
define(['require', './PageView'], function(require, PageView){
    return PageView.extend({

        defaults:{
            toastTime:null
        },
        // 如果想在页面载入时完成工作
        route: function(options){
            PageView.prototype.route.apply(this, arguments);

        },
        events:{
            'click .goback': 'onBack',
            'click #switchView':'switchClick',
            'click #switchView2':'switch2Click',
            'click .psw-get-code':"getCode",
            'click .modifyPsw':"modifyPsw"
        },
        initialize: function(options) {
            PageView.prototype.initialize.apply(this, arguments);

            //监听来自组件的点击切换
            //this.listenTo(this.findComponent('switchView'), 'switchClick', this.switchClick);

        },
        sessionID:null,
        checkCode:null,
        getCode:function(){

          var GetCodeModel = require('../models/BaseModel');
          var _GetCodeModel = new GetCodeModel();
          var _this = this;
          var options = {
            path:"/getModifyCheckCode",
            type:"POST",
            data:{userPhone:JSON.parse(localStorage.getItem('userinfo')).phoneNumber,}
             ,showLoading:true,
            success:function(data){
              if(data.status=="0"){
                _this.sessionID=data.data.sessionId;
                _this.checkCode = data.data.checkCode;
              }else{
                _this.sessionID=null;
                alert("获取失败");
              }
            },
            error:function(){
              _this.sessionID=null;
              alert("获取失败");
            }
          }
          _GetCodeModel.loadData(options);
        },
        modifyPsw:function(){
          var _this = this;
          if(!this.sessionID){
            alert("请输入验证码");
            return;
          }//todo.. 验证验证码是否一致
          var ModifyPswModel = require('../models/BaseModel');
          var _ModifyPswModel = new ModifyPswModel();

          var options = {
            path:"/resetPassword",
            type:"POST",
            data:{userPhone:JSON.parse(localStorage.getItem('userinfo')).phoneNumber,
            sessionId:this.sessionID,
            password:"222222"
            }
             ,showLoading:true,
            success:function(data){
              _this.sessionID=null;
              console.log(data);
            },
            error:function(){

              alert("获取失败");
            }
          }
          _ModifyPswModel.loadData(options);

        },
        onResume: function(){
            this.toggleBar && this.toggleBar('hide');
            this.$('.bar').show();
        },
        valueChange:function(){
            var btnNext = this.$el.find('.btnNext');
            var old_pwd = this.$el.find('.pwd-old');
            var new_pwd = this.$el.find('.pwd-new');
            if (old_pwd.val().trim().length>0 && new_pwd.val().trim().length>0) {
                btnNext.removeAttr("disabled");
                btnNext.addClass('active').removeClass('theme-backgorund-color-contrast').removeClass('theme-border-color-contrast').addClass('theme-border-color').addClass('theme-backgorund-color');
            }else {
                btnNext.attr("disabled","disabled");
                btnNext.removeClass('active').addClass('theme-backgorund-color-contrast').addClass('theme-border-color-contrast').removeClass('theme-border-color').removeClass('theme-backgorund-color');
            }
        },
        newpwdChange:function(){
            this.valueChange();
        },
        oldpwdChange:function(){
            this.valueChange();
        },
        pwdTypeChange:function(type){
            if(type==1){
                if($('.pwd-old').attr('type')=="password"){
                    $('.pwd-old').attr('type','text');
                    var pwd_eye = this.$el.find('#eye1');
                    pwd_eye.removeClass('icomoon-conceal');
                    pwd_eye.addClass('icomoon-display');
                }
                else{
                    $('.pwd-old').attr('type','password');
                    var pwd_eye = this.$el.find('#eye1');
                    pwd_eye.removeClass('icomoon-display');
                    pwd_eye.addClass('icomoon-conceal');
                }
            }

            else{
                if($('.pwd-new').attr('type')=="password"){
                    $('.pwd-new').attr('type','text');
                    var pwd_eye = this.$el.find('#eye2');
                    pwd_eye.removeClass('icomoon-conceal');
                    pwd_eye.addClass('icomoon-display');
                }
                else{
                    $('.pwd-new').attr('type','password');
                    var pwd_eye = this.$el.find('#eye2');
                    pwd_eye.removeClass('icomoon-display');
                    pwd_eye.addClass('icomoon-conceal');
                }
            }
        },
        /*pwdHide:function(){
            this.$el.find('.input-pwd').attr('type','password');
            var pwd_eye = this.$el.find('.icomoon-display');
            pwd_eye.removeClass('icomoon-display');
            pwd_eye.addClass('icomoon-conceal');
        },*/
        onBack:function(){
            window.history.back();
        },
        btnNext:function(){
            var old_pwd = this.$el.find('.pwd-old').val().trim();
            var new_pwd = this.$el.find('.pwd-new').val().trim();
            if(!old_pwd||!new_pwd){
                library.Toast("必须输入密码");
                return;
            }
            if(new_pwd.length>4&&new_pwd.length<20) {
                if (old_pwd != new_pwd) {
                    var options = {
                        url:window.app.api + '/modifyPassword',
                        type: "POST",
                        needReset:true,
                        data:{
                            userId: JSON.parse(localStorage.getItem('userinfo')).userid,
                            newPassword: new_pwd,
                            oldPassword: old_pwd
                        },
                        datatype: "json",
                        success:function (res) {
                                    console.log(res);
                                    if(res.status=='0'){
                                        var url = "#my-navigate/modify-success";
                                        Backbone.history.navigate(url, {
                                            trigger: true
                                        });
                                    }else{
                                        library.Toast(res.message);
                                    }
                                },
                        error:function () {
                            library.Toast('网络错误');
                            //请求出错处理
                        }
                      }

                      if (!this.baseModel) {
                        var BaseModel = require('../models/BaseModel');
                        this.baseModel = new BaseModel();
                      }
                      this.baseModel.loadData(options);
                   /* $.ajax({
                        //提交数据的类型 POST GET
                        type: "POST",
                        //提交的网址
                        url: window.app.api + '/modify-pwd',
                        //提交的数据
                        data: {
                            userid: JSON.parse(localStorage.getItem('userinfo')).userid,
                            newpassword: new_pwd,
                            oldpassword: old_pwd
                        },
                        //返回数据的格式
                        datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".

                        //在请求之前调用的函数
                        beforeSend: function () {
                            console.log(this.data);
                        },
                        //成功返回之后调用的函数
                        success: function (res) {
                            console.log(res);
                            if(res.status=='ok'){
                                var url = "#my-navigate/modify-success";
                                Backbone.history.navigate(url, {
                                    trigger: true
                                });
                            }else{
                                library.Toast(res.message);
                            }

                        },
                        //调用执行后调用的函数
                        complete: function (XMLHttpRequest, textStatus) {

                            //HideLoading();
                        },
                        //调用出错执行的函数
                        error: function () {
                            //请求出错处理
                        }
                    });*/
                } else {
                    library.Toast('相同密码不可以修改');
                }


            }else{
                library.Toast('密码长度必须是大于4位小于20位');
            }
        }
    });
});
