/**
 * louis
 * tabbarView路由,当页面请求到这个页面时候,会执行route方法,具体原因请看application.js
 * 执行完route方法,有两个概念,已经消费的路由和未消费的路由,已经消费的路由会记录在stack里面
 */
define(function(require){

  var BaseView = require('../components/BaseView');
  var PageView = require('./PageView');

  /*
   * 路由规则：
   * tabbar.html            tabbar页面，默认的tab
   * tabbar.html#tab1       tabbar页面，特定的tab，如果tab1是一个navigationview，显示rootview
   * tabbar.html#tab1/page2 tabbar页面，特定的tab，如果tab1是一个navigationview，显示page2
   */

  // 配置：
  // {
  //   type: "TabBarView",
  //   items: [
  //     {label: "main", href: "#main", icon: "glyphicon glyphicon-asterisk"}
  //   ]
  // }
  return BaseView.extend({

    type: 'TabBarView',

    defaultAnim:{
      front:{// 前进动画
        currentPageOrigin:{"transform":"translate3d(0,0,0)","-webkit-transform":"translate3d(0,0,0)"},
        currentPageFinal:{"-webkit-backface-visibility":"hidden","position":"fixed","top":"0px","transition":"all .7s ease","-webkit-transition":"all .7s ease","-webkit-transform":"translate3d(-100%,0,0)","transform":"translate3d(-100%,0,0)"},
        nextPageOrigin:{"transform":"translate3d(100%,0,0)","-webkit-transform":"translate3d(100%,0,0)"},
        nextPageFinal:{"-webkit-backface-visibility":"hidden",display:"block","position":"relative","transition":"all .7s ease","-webkit-transition":"all .7s ease","transform":"translate3d(0,0,0)","-webkit-transform":"translate3d(0,0,0)"},
        nextPageNone:{"transform":"none","-webkit-transform":"none"}
      },
      back:{// 后退动画
        currentPage:{"position":"fixed","top":"0px","transform":"translate3d(100%,0,0)","-webkit-transform":"translate3d(100%,0,0)"},
        backPage:{"position":"relative","transform":"translate3d(0,0,0)","-webkit-transform":"translate3d(0,0,0)"},
        pageNone:{"transform":"none","-webkit-transform":"none"}
      }
    },

    initialize: function() {
      // initialize instance variable
      this.tabs = {};
      this.currentTab = null;
    },

    render: function(){
      // .bar-tab
      var tab = '<nav class="bar bar-tab"></nav>';
      this.$el.append(tab);

      this.configure(this.options);
      return this;
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

    route: function(path, queryString){
      // 依此使用：1.路由路径，2.默认页面，3.第一个爷们
      path = path || this.options.defaultPage || this.options.items[0].href.substr('1');

      var paths = this.getPaths(path);
      console.log("NavigationView: current path: %s, rest path: %s", paths.current, paths.remains);
      // 激活tab，默认为第一个tab
      this.setActive(paths.current, paths.remains, queryString);
    },

    // 创建一个Tab项
    _createItem: function(item){

      var a = document.createElement('a');
      a.classList.add('tab-item');

      if (item.image) {
        var img = document.createElement('img');
        img.src = item.image;
        a.appendChild(img);
      } else {
        var icon = document.createElement('span');
        $(icon).attr('class', item.icon);
        a.appendChild(icon);
      }

      var label = document.createElement('span');
      label.classList.add('tab-label');
      a.appendChild(label);

      a.href = item.href;

      label.innerText = item.label;

      return a;
    },

    configure: function(options){
      if (options.items) {
        var fragment = document.createDocumentFragment();
        fragment = options.items.reduce(_.bind(function(fragment, item){
          fragment.appendChild( this._createItem(item) );
          return fragment;
        }, this), fragment);

        this.$('nav').empty().append(fragment);
      }

      // TODO: 考虑支持右置，左置等
      if (options.barPosition == 'top') {
        this.$('.bar').addClass('bar-tab-top');
      } else {
        this.$('.bar').removeClass('bar-tab-top');
      }

    },

    // id: 页面ID，可为字符串ID，或数字序号
    // rest_path: 剩余的路由
    // queryString: 查询字符串
    setActive: function(id, rest_path, queryString){

      console.log("TabBarView: setActive: %s", id);

      if (!this.options.items) return;

      // 统一转变成为序号
      if (_.isString(id)) {
        id = _.findIndex(this.options.items, function(each){
          return each.href.substr(1) == id;
        });
        if (id == -1) {
          console.warn('page not found.');
          return;
        }
      }
      if (id == -1) {
        // id not in the tabs
        return;
      }

      var enter;
      if (this.currentTab && id > this.currentTabIndex) {
        enter = true;
      } else {
        enter = false;
      }
      console.log('TabBarView: switch tab at: %s', enter ? 'right' : 'left');

      this.createTab(id)
      .then(function(page){
        var previousTab = this.currentTab; //要消失的tab
        this.currentTab = page; //要显示的tab
        this.currentTabIndex = id;
        // bind a special self varialble
        window.self = page; // current page
        // 消化剩余路由
        this.currentTab.route && this.currentTab.route(rest_path, queryString);
        var isAnime = application.getQueryString('isAnime');
        if (previousTab && this.options.animate) {
          // switch tab using animation
          previousTab.$el.addAnimate(enter ? 'slideOutLeft' : 'slideOutRight');
          this.currentTab.$el.addAnimate(enter ? 'slideInRight' : 'slideInLeft');
        } else if (previousTab && previousTab != this.currentTab) {
          // switch tab using show/hide only when tab realy switched
            //previousTab.$el.addAnimate(enter ? 'slideOutLeft' : 'slideOutRight');
           // this.currentTab.$el.addAnimate(enter ? 'slideInRight' : 'slideInLeft');
            //previousTab.remove();
            this.currentTab.$el.show();
            previousTab.$el.hide();
        }
        // change active style
        this.$('.tab-item.active').removeClass('active');
        this.el.querySelector('nav').children[id].classList.add('active');
        this.setIconStatus(id);
      }.bind(this))
      .catch(function(err){
        console.error(err)
        alert("页面加载失败")
      });
    },

    // tabbar底部的图标切换，临时方案
    setIconStatus:function(id){
      for(var index = 0 ; index < this.options.iconsDefault.length; index++){
        var tab = this.$('.tab-item')[index];
        $(tab).find('.icon').removeClass(this.options.iconsSelected[index]).removeClass(this.options.iconsDefault[index]);
        if(id == index){
          $(this.$('.tab-item')[id]).find('.icon').addClass(this.options.iconsSelected[id]);
        }else{
          $(tab).find('.icon').addClass(this.options.iconsDefault[index]);
        }

      }
    },

    createTab: function(id){
      // 兼容id和下标，如果是下标，则需要截掉href的#
      id = _.isString(id) ? id : this.options.items[id].href.substr(1);

      if (!this.tabs[id]) {
        // 没有缓存
        return loader.createPage(id)
        .then(function(page){
          // send toggleBar to PageView
          page.setToggleBar && page.setToggleBar(this.toggleBar.bind(this));
          this.tabs[id] = page.render();
          this.tabs[id].$el.appendTo(this.el);
          return this.tabs[id];
        }.bind(this));
      } else {
        // 有缓存
        //this.tabs[id].onResume && this.tabs[id].onResume();//,由于缓存调用时不会再走render，所以先调用PageView的onResume对象。
        return Promise.resolve(this.tabs[id]);
      }
    },

    toggleBar: function(cmd) {
      if (cmd == 'show' || cmd == 'on') {
        this.$('.bar').show();
      } else if (cmd == 'hide' || cmd == 'off') {
        this.$('.bar').hide();
      } else {
        this.$('.bar').toggle();
      }
    }

  });
});
