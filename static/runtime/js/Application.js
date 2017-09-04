define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var loader = require('./loader');
  var PageView = require('./pages/PageView');
  //
  // app: app model (from app.js)
  var Application = function(model, options) {

    this.model = model;
    this.options = options;

    this.initialize.apply(this, arguments);
  };

  _.extend(Application.prototype, Backbone.Events, {

    initialize: function(){},

    launch: function() {
      this._initCollections();
      loader.createPage( this.getPageId() )
      .then(function(page){
        this.rootPage = page;
        // 渲染页面
        page.render().$el.appendTo(document.body);

        this._initRouter();

        // 通知factory，页面已加载完成
        window.dispatchEvent( new CustomEvent('application:load', {
          detail: {application: this}
        }) );
      }.bind(this));
    },

    _initRouter: function(){
      var Router = Backbone.Router.extend({
        routes: {
          "*path(?*queryString)": "any"
        }
      });
      var router = new Router();
      this.listenTo(router, 'route:any', this.route);

      // launch history
      var pathname = window.location.pathname;
      var rootPath = pathname;//.substr(0, pathname.lastIndexOf('/'));
      Backbone.history.start({pushState: false, root: rootPath});
      console.log("start history with root: [%s]", rootPath);
    },

    route: function(path, queryString){

      this.rootPage.route && this.rootPage.route(path, queryString);
    },

    // 从URL路径获取要访问的页面ID
    getPageId: function(){
      // 从URL获取页面ID，例如index.html则页面ID为index，register.html则ID为register
      var page_id = _.last(window.location.pathname.split('/')).replace(".html", "");

      // 如果page_id为index，且存在defaultPage配置，则ID为defaultPage属性的值
      // 如果page_id为index，但不存在defaultPage配置，则ID为index
      // 如果page_id不为index，则还是原来的值
      page_id = (page_id == 'index') ? (window.app.defaultPage || 'index') : page_id;
      return page_id;
    },
    // FIXME cann't make sure custom collection has been loaded yet
    _initCollections: function() {
      var collections = window.app.collections;
      for (var key in collections) {
        _Collection = require('./models/' + collections[key].type);
        if (_Collection) {
          this.collectionPool[key] = new _Collection([], null, collections[key]);
        }
      }
    },

    collectionPool: {},

    getCollection: function(name, models) {
      var collection = this.collectionPool[name];
      if (!collection) {
        var _Collection = library.getCollection(name);
        if (_Collection) {
          collection = this.collectionPool[name] = new _Collection;
        }
      }
      if (models)
        collection.models = models;
      return collection;
    },

    //用户信息对象获取
    getUserInfo: function(){
      var userInfo = window.localStorage['userinfo'];
      if(userInfo && userInfo != 'undefined'){
        userInfo = JSON.parse(userInfo);
      }
      return userInfo;
    },

    setUserInfo:function(userInfo){
      this.setLocalStorage("userinfo",userInfo);
    },

    setLocalStorage: function(key,value){
      try{
        if(typeof value != 'string'){
          value = JSON.stringify(value);
        }
        window.localStorage.setItem(key, value);
      }catch(e){
        console.log(e);
      }
    },
    getLocalStorage: function(key,isObject){
      var value = window.localStorage[key];
      if(value && isObject){
        value = JSON.parse(value);
      }
      return value;
    },

    //获取URL中的参数
    getQueryString: function(name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var href = window.location.href;
      if(href.indexOf('?') > -1){
        var queryString = href.substr(href.indexOf('?'));
        if(queryString){
          var r = queryString.substr(1).match(reg);
          if(r) return unescape(r[2]);
        }
      }
      return null;
    },

    ajax: function(type,url,data,success,error){
      data = this.getSignData(data);// 签名
      console.log(JSON.stringify(data));
      var optionData = JSON.stringify(data);
      var ajaxOption = {
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: url,
        //提交的数据
        data: optionData,
        // cross domain
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        // 超时
        timeout: 5000*60,
        //返回数据的格式
        dataType: "json", //"xml", "html", "script", "json", "jsonp", "text".
        //成功返回之后T调用的函数
        success: success,
        //调用出错执行的函数
        error: error
      }
      $.ajax(ajaxOption);
    },
    getSignData: function(mainData){
      // FIXME 这里的平台数据暂时用的死的，后期再完善。
      var ios = navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
      var platform = "IOS";
      if(!ios){
         platform = "Android";
      }
      var data = {
        data:mainData,
        ipAddress:"192.168.1.1",
        platform:platform,//platform:device.platform,  //cordova 获取设备名称方法
				timestamp:new Date().getTime().toString(),
        version:app.version,
			}
      data.sign = this.getSignString(data);
			return data;
	  },
    getSignString: function(data){
      var temp = "";
      for(key in data){
        var value = data[key];
        if(key == "data"){
          value = JSON.stringify(value);
        }
        temp = temp + key + "=" + value;
        temp = temp + "&";
      }
      temp = temp.substr(0,temp.length-1);
      return md5(this.enUnicodeString(temp));
  },
  enUnicodeString : function(str) {
      var res=[];
      for(var i=0;i < str.length;i++)
          res[i]=(str.charCodeAt(i).toString(16)).slice(-4);
      return "\\u"+res.join("\\u");
  },
  deUnicodeString : function(str) {
      str=str.replace(/\\/g,"%");
      return unescape(str);
  }

  });


  Application.extend = Backbone.Model.extend;
  return Application;
});
