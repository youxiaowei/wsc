define(['./StaticCollection'], function(StaticCollection) {
    return StaticCollection.extend({
        url: function() {
            return window.app.api;
        },

        allDataLoaded: false, //用于分页
        ajaxOptions: {}, //options做缓存，在获取下一页数据时可以直接使用

        isLoading: false,

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
         * needReset 加载完成后是否需要重置collection数据
         */
        loadData: function(options) {
            isLoading = true;
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
            console.log(options);
            var success = function(res) {
                isLoading = false;
                console.log(res);
                if (options.showLoading) {
                    library.DismissLoadingBar();
                }
                if (res.status == "0" || res.status == 0) {

                    //处理翻页
                    if(options.data && options.data.size){
                      var index = options.data.index;
                      var size = options.data.size;
                      if(res.data.pageCount){
                        _this.allDataLoaded = res.data.pageCount == index;
                      }else if(res.data.length < size){
                        _this.allDataLoaded = true;
                      }
                    }
                    if (options.needReset) {
                      // 判断 data对象
                      if(res.data&&res.data.list){
                        if (options.data.index && options.data.index > 1) {
                            _this.add(res ? res.data.list : []);
                        } else {
                            _this.reset(res ? res.data.list : []);
                        }
                      }else{
                        if (options.data.index && options.data.index > 1) {
                            _this.add(res ? res.data : []);
                        } else {
                            _this.reset(res ? res.data : []);
                        }
                      }
                    }
                    options.success && options.success(res);
                } else {
                    options.error && options.error(res);
                }
            };
            var error = function(e) {
                isLoading = false;
                //请求出错处理
                if (options.showLoading) {
                    library.DismissLoadingBar();
                }
                _this.allDataLoaded = true;
                options.error && options.error(e);
            }
            application.ajax(options.type, url, data, success, error);
        },

        hasNextPage: function() {
            return !this.allDataLoaded;
        },
        getNextPage: function() {
            this.ajaxOptions.data.index++;
            console.log(this.ajaxOptions.data);
            this.loadData(this.ajaxOptions);
        }

    });
});
