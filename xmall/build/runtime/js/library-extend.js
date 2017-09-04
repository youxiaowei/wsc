(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['exports', 'underscore', './library'], function(exports, _, library) {
      return factory(root, _, library);
    });

  }

})(this, function(root, _, library) {

  /*Toast begin*/
  var Toast = function() {}
  Toast.prototype = {
    destroy: function() {
      if (this.timeoutid) {
        window.clearTimeout(this.timeoutid);
        this.timeoutid = null;
      }
      if (this.backCover) {
        document.body.removeChild(this.backCover);
      }
      if (this.TitleWraper) {
        document.body.removeChild(this.TitleWraper);
      }
    },
    create: function() {
      this.destroy();
      this.backCover = document.createElement("DIV");
      this.backCover.classList.add("common-toast-bk");
      this.TitleWraper = document.createElement("DIV");

      //this.dom.addEventListener("click",function());
      this.TitleWraper.classList.add("common-toast-titlewraper");
      this.Title = document.createElement("DIV");
      this.Title.classList.add("common-toast-title");
      this.TitleWraper.appendChild(this.Title);
      document.body.appendChild(this.TitleWraper);
      document.body.appendChild(this.backCover);
    },
    timeoutid: null,
    show: function(title, showtimes) {
      if (this.timeoutid) {
        return;
      }
      showtimes = !showtimes || isNaN(showtimes) ? 2000 : showtimes;
      this.create();
      this.Title.innerHTML = title || "";
      var _this = this;

      window.setTimeout(function() {
        _this.backCover.classList.add("common-toast-show");
        _this.TitleWraper.classList.add("common-toasttitle-show");
      }, 1);
      this.timeoutid = window.setTimeout(function() {
        _this.backCover.classList.remove("common-toast-show");
        _this.TitleWraper.classList.remove("common-toasttitle-show");
        _this.timeoutid = null;
      }, showtimes);

    }
  }

  var ToastInstance = null;

  /*Toast end*/

  /*MessageBox begin*/
  // param json
  // [{leftText:"确定",callback:this.leftCallBack},{rightText:"取消",callback:this.rightCallBack}]
  // [{leftText:"确定",callback:this.leftCallBack}]
  // {leftText:"确定",callback:this.leftCallBack}
  var MessageBox = function() {}
  MessageBox.prototype = {
    destroy: function() {
      if (this.bgCover) {
        document.body.removeChild(this.bgCover);
        this.bgCover=null;
      }
      if(this.msg){
        document.body.removeChild(this.msg);
        this.msg=null;
      }
    },

    create: function(title, content,param) {
      this.destroy();
      this.bgCover  = document.createElement('div');
      this.bgCover.classList.add('common-message-cover');
      document.body.appendChild(this.bgCover);

      this.msg = document.createElement('div');
      this.msg.classList.add('common-message-center');

    /*  this.titleDiv = document.createElement('div');
      this.titleDiv.classList.add('common-message-title');
      this.titleDiv.innerHTML = title;
      this.msg.appendChild(this.titleDiv);
*/
      this.contentDiv = document.createElement('div');
      this.contentDiv.classList.add('common-message-content');
      this.contentDiv.innerHTML = content;
      this.msg.appendChild(this.contentDiv);

      var _this = this;

      //如果是以数组的方式传入
      if (param instanceof Array) {
        if (param.length > 1) {
          this.createLeftBtn(_this,'common-message-buttom',param[0]);

          this.btnRight = document.createElement('span');
          this.btnRight.classList.add('common-message-buttom');
          this.btnLeft.classList.add('between');
          this.btnRight.innerHTML = param[1].rightText;
          this.btnRight.addEventListener("click",function(){_this.rightEvent(param[1].callback);});
          this.msg.appendChild(this.btnRight);
        }else {
          this.createLeftBtn(_this,'common-message-single',param[0]);
        }
      }else {//以字典的方式传入
        this.createLeftBtn(_this,'common-message-single',param);
      }
      document.body.appendChild(this.msg);
    },
    show: function(title, content,param) {
      this.create(title, content,param);
    },
    leftEvent:function(e){
      this.destroy();
      e();
    },
    rightEvent:function(e){
    this.destroy();
      e();
    },
    createLeftBtn:function(_this,messageStyle,param){
      _this.btnLeft = document.createElement('span');
      _this.btnLeft.classList.add(messageStyle);
      _this.btnLeft.innerHTML = param.leftText;
      _this.btnLeft.addEventListener("click",function(){_this.leftEvent(param.callback);});
      _this.msg.appendChild(_this.btnLeft);
    }

  }
  var MessageBoxInstance = null;
  /*MessageBox end*/

  /*MessageBox begin*/
  // param json
  // [{leftText:"确定",callback:this.leftCallBack},{rightText:"取消",callback:this.rightCallBack}]
  var DialogInput = function() {}
  DialogInput.prototype = {
    destroy: function() {
      if (this.DialogInputbgCover) {
        document.body.removeChild(this.DialogInputbgCover);
        this.DialogInputbgCover=null;
      }
      if(this.DialogInputmsg){
        document.body.removeChild(this.DialogInputmsg);
        this.DialogInputmsg=null;
      }
    },
    create: function(title,content,param) {
      this.destroy();
      this.DialogInputbgCover  = document.createElement('div');
      this.DialogInputbgCover.classList.add('common-message-cover');
      document.body.appendChild(this.DialogInputbgCover);

      this.DialogInputmsg = document.createElement('div');
      this.DialogInputmsg.classList.add('common-message-center');

      this.titleDiv = document.createElement('div');
      this.titleDiv.classList.add('common-message-title');
      this.titleDiv.innerHTML = title;
      this.DialogInputmsg.appendChild(this.titleDiv);
      this.center =document.createElement('center');
      this.contentInput = document.createElement('input');
      this.center.appendChild(this.contentInput);

      this.contentInput.classList.add('input-text');
      this.contentInput.setAttribute('type','text');
      this.contentInput.setAttribute('style','margin-top: 10px;width: 90%;');
      //this.contentDiv.innerHTML = content;
      this.DialogInputmsg.appendChild(this.center);

      this.btnLeft = document.createElement('span');
      this.btnLeft.classList.add('common-message-buttom');
      this.btnLeft.classList.add('between');

      this.btnLeft.innerHTML = param[0].leftText;

      this.btnRight = document.createElement('span');
      this.btnRight.classList.add('common-message-buttom');

      this.btnRight.innerHTML = param[1].rightText;
      var _this = this;
      this.btnLeft.addEventListener("click",function(){_this.leftEvent(param[0].callback);});
      this.btnRight.addEventListener("click",function(){_this.rightEvent(param[1].callback);});
      this.DialogInputmsg.appendChild(this.btnLeft);
      this.DialogInputmsg.appendChild(this.btnRight);

      document.body.appendChild(this.DialogInputmsg);

    },
    show: function(title, content,param) {
      this.create(title, content,param);
    },
    leftEvent:function(e){
      this.destroy();
      e(this);
    },
    rightEvent:function(e){
      this.destroy();
      e(this);
    }

  }
  var DialogInputInstance = null;
  /*MessageBox end*/



    /*ActionSheet begin*/
    // param json
    // [{text: "button",type:"button",callback:function(){}},{text: "label",type:"label"},{text: "",color:"red",type:"button",callback:function(){}}]
    var ActionSheet = function() {};
    ActionSheet.prototype = {
      destroy: function() {
        if (this.ActionSheetbgCover) {
          document.body.removeChild(this.ActionSheetbgCover);
          this.ActionSheetbgCover=null;
        }
        if(this.ActionSheetmodal){
          document.body.removeChild(this.ActionSheetmodal);
          this.ActionSheetmodal=null;
        }
      },
      create: function(paramOne,paramTwo) {
        this.destroy();
        this.ActionSheetbgCover  = document.createElement('div');
        this.ActionSheetbgCover.classList.add('common-message-cover');


        this.ActionSheetmodal = document.createElement('div');
        this.ActionSheetmodal.classList.add('actions-modal');
        var _this = this;
        if(paramOne){
          //actions-modal-group
          this.modalGroupOne = document.createElement('div');
          this.modalGroupOne.classList.add('actions-modal-group');
          for(var i=0;i<paramOne.length;i++){

            (function(me,_param,index){
              var li = document.createElement('div');
              li.classList.add("actions-modal-"+_param[index].type);
              li.innerHTML = _param[index].text;
              if(_param[index].color){
                li.classList.add("actions-modal-color-red");
              }
              if(_param[index].type!="label"){
                li.addEventListener("click",function(){_param[index].callback();me.destroy()});
              }
              me.modalGroupOne.appendChild(li);
            })(_this,paramOne,i);

          }
          this.ActionSheetmodal.appendChild(this.modalGroupOne);
        }
        if(paramTwo){
          this.modalGroupTwo = document.createElement('div');
          this.modalGroupTwo.classList.add('actions-modal-group');
          for(var i=0;i<paramTwo.length;i++){

            (function(me,_param,index){
              var li = document.createElement('div');
              li.classList.add("actions-modal-"+_param[index].type);
              li.innerHTML = _param[index].text;
              if(_param[index].color){
                li.classList.add("actions-modal-color-red");
              }
              if(_param[index].type!="label"){
                li.addEventListener("click",function(){_param[index].callback();me.destroy()});
              }
              me.modalGroupTwo.appendChild(li);
            })(_this,paramTwo,i);

          }
          this.ActionSheetmodal.appendChild(this.modalGroupTwo);
        }
        if(paramOne||paramTwo){

          document.body.appendChild(this.ActionSheetbgCover);
          document.body.appendChild(this.ActionSheetmodal);
        }
      },
      show: function(paramOne,paramTwo) {
        this.create(paramOne,paramTwo);
      }

    }
    var ActionSheetInstance = null;
    /*ActionSheet end*/

    // loading bar start
    var LoadingBarInstance = null;
    LoadingBar = function(){};
    LoadingBar.prototype = {
      destroy: function() {
        if (this.MessageCover) {
          document.body.removeChild(this.MessageCover);
          this.MessageCover=null;
        }
        if(this.LoadingBox){
          document.body.removeChild(this.LoadingBox);
          this.LoadingBox=null;
        }
      },
      create: function(message) {
        this.destroy();
        this.MessageCover  = document.createElement('div');
        this.MessageCover.classList.add('common-message-cover');
        document.body.appendChild(this.MessageCover);

        this.LoadingBox = document.createElement('div');
        this.LoadingBox.classList.add('loading-center');
        var loadingBar = document.createElement('div');
        loadingBar.classList.add('icomoon-load');
        loadingBar.classList.add('loading-bar');
        /*for(var index = 1; index < 13; index ++){
          var path = document.createElement('span');
          path.classList.add('path'+index);
          loadingBar.appendChild(path);
        }*/
        this.LoadingBox.appendChild(loadingBar);
        if(message){
          var loadingMsg = document.createElement('div');
          loadingMsg.classList.add('loading-message');
          loadingMsg.innerHTML = message;
          this.LoadingBox.appendChild(loadingMsg);
        }
        document.body.appendChild(this.LoadingBox);
      },
      show: function(message){
        this.create(message);
      }
    };

    /*
    接口地址
    */
    var BaseUrl = "http://10.1.71.21:8080/ymall_1.0_app/";
  //
  // Backbone View Hierachy extension
  //
  var api = {

    // getter method
    Toast: function(title, showtimes) {
      if (ToastInstance == null) {
        ToastInstance = new Toast();
      }
      ToastInstance.show(title, showtimes);
    },
    MessageBox:function(title,content,param){
      if (MessageBoxInstance == null) {
        MessageBoxInstance = new MessageBox();
      }
      MessageBoxInstance.show(title, content,param);
    },
    ActionSheet:function(paramOne,paramTwo){
      if (ActionSheetInstance == null) {
        ActionSheetInstance = new ActionSheet();
      }
      ActionSheetInstance.show(paramOne,paramTwo);
    },
    DialogInput:function(title,content,param){
      if (DialogInputInstance == null) {
        DialogInputInstance = new DialogInput();
      }
      DialogInputInstance.show(title, content,param);
    },
    LoadingBar: function(message){
      if(LoadingBarInstance == null) {
        LoadingBarInstance = new LoadingBar();
      }
      LoadingBarInstance.show(message);
    },
    DismissLoadingBar: function(){
      if(LoadingBarInstance != null){
        LoadingBarInstance.destroy();
      }
    },
    wechatLoad: function(url_arr,model){   //微信下登录
        var parms = url_arr[1];
        var p={};
        if(parms){
          var param_arr = parms.split("&");
          for(var i=0,j=param_arr.length;i<j;i++){
            var keyvalue_arr = param_arr[i].split("=");
            p[keyvalue_arr[0]]=keyvalue_arr[1];
          }
        }
        var openid = p["wxopenid"];

        if(openid){
            sessionStorage.setItem("userOpenid", openid);
            data = {
                openId: openid
            };
        var options = {
          path: "/getWxUserInfo",
          type: "POST",
          needReset: true,
          data: data,
          datatype: "json",
          success: function(res) {
            application.setLocalStorage('userinfo',res.data);
          },
          error: function() {

          }
        };
        model.loadData(options);
      }
    }

 }
  _.extend(library, api);
});
