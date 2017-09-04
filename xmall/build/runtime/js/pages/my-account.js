define( [ './PageView', 'require', '../libs/canlendar' ,'../libs/wechat'],
function( PageView,  require, canlendar ,wechat) {
    return PageView.extend( {
        events: {
            "click .my-head": "notifyHead",
            "click .item-birthday": "notifyBirthday",
            "click .item-address": "goSetAddress",
            "click .notify-name": "notifyUserName",
            "click .notify-sex": "notifyUserSex",
            "click .item-security": "goSecurityView",
            "change .trigger-calendar": "changeBirthday",
            "click .goback": "goback"
        },
        model: null,
        canlendarInstance: null,
        isDialogShow: false,
        notifyName: null,
        notifySex: null,
        _this: null,
        initialize: function() {
            this.toggleBar && this.toggleBar( "hide" );
            $( '.bar' )
                .hide();
            var userinfo = JSON.parse( localStorage.getItem(
                'userinfo' ) );
            if( userinfo.sex == 0 ) {
                userinfo.sex = '男';
            } else if( userinfo.sex == 1 ) {
                userinfo.sex = '女';
            } else {
                userinfo.sex = '保密';
            }
            var Model = require( '../models/MyAccountModel' );
            this.model = new Model( {
                account: userinfo.nickName,
                name: userinfo.nickName,
                sex: userinfo.sex,
                birthday: userinfo.birthday,
                headurl: userinfo.headImage,
                phoneNum: userinfo.phoneNumber,
            } );
            _this = this;

            if(this.isWeiXin()){//初始化微信签名
                this.initWechat();
            }
        },
        initWechat: function(){
            var Model = require('../models/BaseModel');
            var wechatModel = new Model();
            var options = {
                url: window.app.api+'/getSignUrl',
                type: "POST",
                needReset:true,
                data:{
                    url: document.location.origin + document.location.pathname
                },
                success:function(res) {
                    if (res.status == '0') {
                        wechat.init(res.data);
                    }else{
                        library.Toast('JS-SDK签名失败');
                    }
                },
                error:function () {
                    library.Toast('JS-SDK签名失败');
                }
            };
            wechatModel.loadData(options);
        },
        render: function() {
            this.$el.empty();
            loader.getPageTemplate( this.options.template )
                .then( function( template ) {
                    var _model = this.model ? this.model
                        .toJSON() : {};
                    var $template = $( template( _model ) );
                    this.$el.append( $template );
                    this.onRender();
                }.bind( this ) );
            return this;
        },
        notifyNameResult: function( name ) {
            var Model = require('../models/BaseModel');
            var userModel = new Model();
            var userinfo = JSON.parse( localStorage.getItem(
                'userinfo' ) );
            var options = {
                url: window.app.api+'/modifyUserInfo',
                type: "POST",
                needReset:true,
                data:{
                    userid : userinfo.userid ,
                    key : 'nickname',
                    value : name
                },
                success:function(res) {
                    if (res.status == '0') {
                        _this.model.set( {
                            name: name
                        } );
                        _this.$el.find( ".account-user-name" )
                            .empty()
                            .append( name );
                        library.Toast( "保存成功" );
                    }else{
                        library.Toast( "保存失败" );
                    }
                },
                error:function () {
                    library.Toast( "保存失败" );
                }
            };
            userModel.loadData(options);
            _this.notifyName = null;
        },
        notifySexResult: function( sex ) {
            var value = sex == '男' ? 0 : 1;
            var Model = require('../models/BaseModel');
            var userModel = new Model();
            var userinfo = JSON.parse( localStorage.getItem( 'userinfo' ) );
            var options = {
                url: window.app.api+'/modifyUserInfo',
                type: "POST",
                needReset:true,
                data:{
                    userid : userinfo.userid ,
                    key : 'gender',
                    value : value
                },
                success:function(res) {
                    if (res.status == '0') {
                        _this.model.set( {
                            sex: sex
                        } );
                        _this.$el.find( ".account-user-sex" )
                            .empty()
                            .append( sex );
                    }else{
                        library.Toast( "保存失败" );
                    }
                },
                error:function () {
                    library.Toast( "保存失败" );
                }
            };
            userModel.loadData(options);
            _this.notifySex = null;
        },
        notifyUserName: function( e ) {
            if( this.notifyName != null ) {
                this.notifyName.remove();
            }
            var NotifyName = require(
                "../components/NotifyUserInfoView" );
            this.notifyName = new NotifyName( {
                name: this.model.get( 'name' ),
                callback: this.notifyNameResult
            } );
            this.$el.append( this.notifyName.render() .el );
            setTimeout( function() {
                $( ".nofity-name-info" ) .addClass( "nofity-name-info-show" )
            }, 100 );
        },
        notifyUserSex: function( e ) {
            if( this.notifySex != null ) {
                this.notifySex.remove();
            }
            var NotifySex = require(
                "../components/NotifyUserSexView" );
            this.notifySex = new NotifySex( {
                sex: this.model.get( 'sex' ),
                callback: this.notifySexResult
            } );
            this.$el.append( this.notifySex.render()
                .el );
            setTimeout( function() {
                $( ".nofity-sex-info" )
                    .addClass(
                        "nofity-sex-info-show" )
            }, 100 );
        },
        notifyBirthday: function( e ) {
            //原本日历
            if (this.canlendarInstance == null) {
              var type = "年月日";
              var _this = this;
              this.canlendarInstance = new canlendar.Calendar({
                container: _this.el
              }).bind("ok", function(valStr) {
                var arr = valStr.split('-');
                var birthday = arr[0] + "-" + arr[1] + "-" + arr[2] + "";
                _this.model.set({
                  birthday: birthday
                });
                _this.$el.find('.birthday-content').empty().append(birthday);

              }).setModal(type);
            }
            this.canlendarInstance.show(this.model.get('birthday'));
            /*$( '.trigger-calendar' )
                .focus();*/
        },
        changeBirthday: function() {
            var dateData = $( '.trigger-calendar' )
                .val();
            var _this = this;
            _this.$el.find( '.birthday-content' )
                .empty()
                .append( dateData );
        },
        isWeiXin: function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        notifyHead: function( e ) {
            if( this.isDialogShow ) {
                return;
            }
            this.uploadDoc = 'fileToUpload';
            var _this = this;
            //cordova 内
            if( !( typeof cordova == "undefined" )){
                param1 = [ {
                    text: "拍照",
                    type: "button",
                    callback: function() {
                        _this.getPhotoFromCamera();
                        _this.isDialogShow = false;
                    }
                }, {
                    text: "从手机相册选择",
                    type: "button",
                    callback: function() {
                        _this.getPhotoFromMediaLib();
                        _this.isDialogShow = false;
                    }
                } ];
            }else if(this.isWeiXin()){
                param1 = [ {
                    text: "从微信相册选择",
                    type: "button",
                    callback: function() {
                        _this.getPhotoFromMediaLib();
                        _this.isDialogShow = false;
                    }
                } ];
            }else{
                param1 = [ {
                    text: "从文件浏览器选择",
                    type: "button",
                    callback: function() {
                        _this.getPhotoFromMediaLib();
                        _this.isDialogShow = false;
                    }
                } ];
                var userinfo = JSON.parse( localStorage.getItem( 'userinfo' ) );
                //FIXM上传组件还不完善，需要继续修改
                //弹出菜单的时候就监听点击事件
                $.ajaxSelectFile({
                    url: window.app.api + '/uploadImage?userId=' + userinfo.userid,//处理图片脚本
                    //url : 'http://api.gootese.com/uploadImage?userId=' + userinfo.userid,
                    secureuri :false,
                    fileElementId : this.uploadDoc,//file控件id
                    dataType : 'json',
                    name: 'image',
                    //点击提交
                    onSubmit: function(file, ext) {
                        if (!(ext && /^(jpg|JPG|png|PNG|gif|GIF|jpeg|JPEG)$/.test(ext))) {
                            library.Toast('您上传的图片格式不对，请重新选择！');
                            return false;
                        }
                    },
                    success : function (data, status){
                        library.Toast('上传成功');
                        //对应逻辑处理
                        $('.actions-modal-button').click();
                    },
                    error: function(data, status, e){
                        library.Toast('上传失败');
                        $('.actions-modal-button').click();
                    }
                });
            }
            param2 = [ {
                text: "取消",
                type: "button",
                callback: function() {
                    $('#' + _this.uploadDoc).remove();
                    _this.isDialogShow = false;
                }
            } ];
            //library.ActionSheet( param1, param2 );
            if(!this.isWeiXin()){
                library.ActionSheet( param1, param2 );
             //  _this.getPhotoFromMediaLib();
              //  _this.isDialogShow = false;
            }else{

                _this.getPhotoFromMediaLib();
                _this.isDialogShow = false;
            }

        },
        getPhotoFromCamera: function() { // TODO 拍照获取图片
            if( !( typeof cordova == "undefined" ) &&
                navigator && navigator.camera ) {
                navigator.camera.getPicture( this.onSuccess,
                    this.onFail, {
                        quality: 100,
                        sourceType: Camera.PictureSourceType
                            .CAMERA,
                        destinationType: Camera.DestinationType
                            .FILE_URI,
                        allowEdit: 'YES'
                    } );
            }else{
                library.Toast('不支持拍照上传');
            }
        },
        getPhotoFromMediaLib: function() { // TODO 从媒体库选择图片
            if( !( typeof cordova == "undefined" ) &&
                navigator && navigator.camera ) {
                navigator.camera.getPicture( this.onSuccess,
                    this.onFail, {
                        quality: 100,
                        sourceType: Camera.PictureSourceType
                            .PHOTOLIBRARY,
                        destinationType: Camera.DestinationType
                            .FILE_URI,
                        allowEdit: 'YES'
                    } );
            }else if(this.isWeiXin()){//TODO 从微信选择上传
                var Model = require('../models/BaseModel');
                var wechatModel = new Model();
                var userinfo = JSON.parse( localStorage.getItem( 'userinfo' ) );
                wechat.chooseImage(function(localIds){
                    library.LoadingBar('正在上传');
                    //选择图片后马上上传
                    wechat.uploadImage(localIds.toString(), 0,function(serverId){
                        var options = {
                            url: window.app.api+'/uploadImageWfx',
                            type: "POST",
                            needReset:true,
                            data:{
                                mediaId :  serverId,
                                userId: userinfo.userid
                            },
                            success:function(res) {
                                library.DismissLoadingBar();
                                if (res.status == '0') {
                                    var image = _this.$el.find('#head-image-user-head' );
                                    $(image).attr('src',res.data.imageurl );
                                    //上传成功，处理显示照片
                                    //FIXME
                                }else{
                                    library.Toast(res && res.message ? res.message : "上传失败" );
                                }
                            },
                            error:function () {
                                library.DismissLoadingBar();
                                library.Toast('网络错误');
                            }
                        };
                        wechatModel.loadData(options);
                    });
                });
            }
        },
        onSuccess: function( imageData ) {
            var image = _this.$el.find( '.head-image' );
            $( image ) .attr( 'src', imageData );
        },
        onFail: function( message ) {
            alert( 'Failed because: ' + message );
        },
        goback: function( e ) {
            window.history.back();
        },
        goSetAddress: function() {
            var userinfo = JSON.parse( localStorage.getItem(
                'userinfo' ) );
            Backbone.history.navigate(
                '#my-navigate/my-address?userid=' +
                userinfo.userid, {
                    trigger: true
                } );
        },
        goSecurityView: function() {
            Backbone.history.navigate(
                '#my-navigate/mySecurity', {
                    trigger: true
                } );
        },
        onResume: function() {
            this.toggleBar && this.toggleBar( "hide" );
        }
    } );
} );
