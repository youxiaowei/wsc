/**
 * luois
 * 当这个页面初始化的时候会触发route方法,如果被嵌入在tabbarview当中,她的path来自与tabbar未消化的路由
 * 这个组件实现的原理分析如下
 * 1.获取path,path有暂时有两种来源,一种是tabbar过来的,一种是url过来的.
 * 2.getPaths 函数会分析#后面的url,
 * 3.当第一次加载的时候加进去,记录path路径和对应的view,
 * 4.返回也会触发route,然后对应的路径找view,然后将其显示出来(内存可能存在变大的问题)
 *
 */
define(['require', '../components/BaseView', './PageView'], function(require, BaseView, PageView){

  return BaseView.extend({

    type: "NavigationView",

    // stack to store the views, [{path: 'a', view: a}, {path: 'b', view: b}]
    stack: [],

    toggleBar: null,
    // 页面切换动画
    defaultAnim:{
      front:{// 前进动画
        currentPageOrigin:{"transform":"translate3d(0,0,0)","-webkit-transform":"translate3d(0,0,0)"},
        currentPageFinal:{"-webkit-backface-visibility":"hidden","position":"absolute","transition":"all .4s cubic-bezier(0, 0, 0.25, 1)","-webkit-transition":"all .4s cubic-bezier(0, 0, 0.25, 1)","-webkit-transform":"translate3d(-100%,0,0)","transform":"translate3d(-100%,0,0)"},
        nextPageOrigin:{"transform":"translate3d(100%,0,0)","-webkit-transform":"translate3d(100%,0,0)","position":"absolute","top":"0px","left":"0px"},
        nextPageFinal:{"-webkit-backface-visibility":"hidden",display:"block","position":"fixed","transition":"all .4s cubic-bezier(0, 0, 0.25, 1)","-webkit-transition":"all .4s cubic-bezier(0, 0, 0.25, 1)","transform":"translate3d(0,0,0)","-webkit-transform":"translate3d(0,0,0)"},
        nextPageNone:{"position":"relative","transform":"none","-webkit-transform":"none"}
      },//"transform":"none","-webkit-transform":"none"
      back:{// 后退动画
        currentPage:{"position":"fixed","top":"0px","transform":"translate3d(100%,0,0)","-webkit-transform":"translate3d(100%,0,0)"},
        backPage:{"position":"relative","transform":"translate3d(0,0,0)","-webkit-transform":"translate3d(0,0,0)"},
        pageNone:{"position":"relative","transform":"none","-webkit-transform":"none"}
      }
    },

    setToggleBar: function(toggleBar){
      this.toggleBar = toggleBar;
    },
    prePageScrollTop:0,
    initialize: function(options){
      BaseView.prototype.initialize.apply(this, arguments);

      this.rootPage = options.rootPage;
      // stack to store the views, [{path: 'a', view: a}, {path: 'b', view: b}]
      this.stack = [];
    },

    render: function(){
      return this;
    },

    remove: function(){
      BaseView.prototype.remove.apply(this, arguments);
    },

    /**
     * 分析路径
     * @param  {String} path 全路径
     * @return {Object}      {current: 当前路径, remains: 剩余未消化的路径}
     */
    getPaths: function(path){
      var segments = path.split('/');
      // 所有可能的页面路径
      // 例如path为：a/b/c，那么可能的路径（paths）有：['a/b/c', 'a/b', 'a']
      // 从长到短排序
      var paths = segments.map(function(each, index){
        return segments.slice(0, index + 1).join('/');
      }).reverse();
      // 查找匹配的路径，最长路径优先
      var current_path = _.find(paths, function(each){
        return loader.hasPage(each);
      });
      // 剩余路径
      var remains_path = path.slice(current_path.length + 1);

      return {current: current_path, remains: remains_path};
    },
    //louis
//分析:每次请求url的时候,都会调用这个回调的实现,要实现二级路由,原理就是把截取#获取的参数,然后再根据'/'分离出路径,每
    route: function(path, queryString){
      // 配置的默认页面
      //获取配置里面的root页面
      var _this = this;

      path = path || this.options.rootPage;

      if (!path) {
        return;
      }
      //获取
      var paths = this.getPaths(path);

      // 是否回腿
      var goingBack = this.stack.length > 1 && (this.stack[this.stack.length - 2].path == path);

      // 当前页面，栈顶
      var currentPage = this.stack[this.stack.length - 1] && this.stack[this.stack.length - 1].view;
      if (goingBack) {

        window.setTimeout(function(){
          document.body.scrollTop = _this.prePageScrollTop ||0;
        },20);
        // 回退

        var backPage = this.stack[this.stack.length - 2].view;
        if(this.options.animate) {
          currentPage.$el.css({display:"block"});
          currentPage.$el.addAnimate('slideOutRight')
          .then(function(){
            currentPage.remove();
          });
          backPage.$el.css({display:"block"});
        } else {
          currentPage.$el.css(this.defaultAnim.back.currentPage);
          backPage.$el.css(this.defaultAnim.back.backPage);
          window.setTimeout(function(){
            currentPage.remove();
            backPage.$el.css(_this.defaultAnim.back.pageNone);
            window.setTimeout(function(){
              backPage.$el.css(_this.defaultAnim.back.pageNone);
              var fixeds = backPage.$el.find(".yyfixed");
              for(var i =0,j=fixeds.length;i<j;i++){
                fixeds[i].style["visibility"]="visible";
                fixeds[i].style["position"]="fixed";
              }//为了解决fixed元素跳动
            },400);
          },400);
        }
        this.stack.pop();
        //bind to self varialble
        window.self = backPage;
        // call PageView's onResume
        // 从缓存种调用时不会再走render，因此这里要调用onResume
        backPage.onResume && backPage.onResume();
      } else {

        this.prePageScrollTop = document.body.scrollTop;
        // not always push to stack, check the last page
        if (this.stack.length == 0 || this.stack[this.stack.length - 1].path != paths.current) {
          // 追加
          loader.createPage(paths.current).then(function(nextPage){
            // assurance, don't let the stack too large, only keep the last three
            // max 50 items in the stack, only keep last 10 items
            if (this.stack.length > 50) {
              this.stack = this.stack.slice(-10);
              this.$el.empty(); //FIXME may be re-render the page in the stack?
            }
            nextPage.setToggleBar && nextPage.setToggleBar(this.toggleBar);
            this.$el.append(nextPage.render().el);
            // 消化剩余路由
            nextPage.route && nextPage.route(path.remains, queryString);
            // bind current page to window.self
            window.self = nextPage;
            if (this.stack.length > 0 && this.options.animate) {
              // currentPage.$el.addAnimate('slideOutLeft');
              // nextPage.$el.addAnimate('slideInRight');
            }
            if(currentPage){
                var fixeds = currentPage.$el.find(".yyfixed");
                for(var i =0,j=fixeds.length;i<j;i++){
                  fixeds[i].style["visibility"]="hidden";
                  fixeds[i].style["position"]="static";
                }
               currentPage.$el.css(this.defaultAnim.front.currentPageOrigin);
            }
            if(this.stack.length==0){
              nextPage.$el.css(this.defaultAnim.front.currentPageOrigin);
            }else{
              nextPage.$el.css(this.defaultAnim.front.nextPageOrigin);
            }
            document.body.scrollTop=document.body.scrollTop;
            if(currentPage){
              currentPage.$el.css(this.defaultAnim.front.currentPageFinal);
            }
            nextPage.$el.css(this.defaultAnim.front.nextPageFinal);
           window.setTimeout(function(){
              currentPage&&currentPage.$el.css({"position":"fixed"});
              document.body.scrollTop = 0;
              nextPage.$el.css(_this.defaultAnim.front.nextPageNone);
            },400);

            this.stack.push({path: paths.current, view: nextPage});

          }.bind(this))
          .catch(function(err){
            console.warn("NavigationView: page [%s] not found, fail to navigate", paths.current);
            console.error(err);
          });
        }else{
          // call PageView's onResume
          // 从缓存种调用时不会再走render，因此这里要调用onResume
          currentPage.onResume && currentPage.onResume();
        }
      }
    }

  });
});
