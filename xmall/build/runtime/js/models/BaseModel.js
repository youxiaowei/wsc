// model 基类，主要解决model更新失败的问题
// author Vicent
define(['backbone','underscore'], function(Backbone,_){
	return Backbone.Model.extend({

    url: function(){
      return window.app ? window.app.api :"";
    },
    // 该属性的设置能使Backbone的Model使用ajax请求时操作方法的判断更准确
    idAttribute: '_id',

    initialize: function(){
      // 这里解决Model使用save更新时不能成功的问题
      var _sync = Backbone.sync;
      Backbone.sync = function(method, model, options) {
        if (method == 'update') {
          options.contentType = 'application/json';
          options.data = JSON.stringify(_.omit(model.toJSON(), '_id'));
        }
        // then use Backbone's sync
        _sync(method, model, options);
      }
    },

		ajaxOptions: {},
		/*
		* 加载数据的方法
		* options: 参数对象，回调，配置参数都在这里
		* options可接收参数：
		* url 请求地址，全部地址
		* path: 相对路径，url前缀在Model的url中配置
		* data 需要传的数据
		* type 请求方式
		* showLoading 是否显示菊花
		* loadingMessage 菊花提示文字
		* success 请求成功回调
		* error 请求失败回调
		*/
		loadData: function(options) {
      options = options || this.ajaxOptions;
			this.ajaxOptions = options;
      var mUrl = this.url;
      if (mUrl && typeof mUrl != 'string') { //如果是个function
        mUrl = mUrl();
      }
      var url = options.url || (mUrl + options.path);
      var data = options.data || {};
      if (options.showLoading) {
        library.LoadingBar(options.loadingMessage);
      }
      var _this = this;
			var success = function(res) {
				console.log(res);
				if (options.showLoading) {
					library.DismissLoadingBar();
				}
				options.needReset && _this.set(res ? res.data : {});
				options.success && options.success(res);
			};
			var error = function(e) {
				//请求出错处理
				if (options.showLoading) {
					library.DismissLoadingBar();
				}
				options.error && options.error(e);
			}
			application.ajax(options.type,url,data,success,error);
    }
	});
});
