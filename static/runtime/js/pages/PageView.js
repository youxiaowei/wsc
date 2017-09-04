define(function(require) {

  var Backbone = require('backbone');
  var _ = require('underscore');
  var BaseView = require('../components/BaseView');
  var querystring = require('../libs/querystring');

  return BaseView.extend({

    type: 'PageView',

    toggleBar: null,
    //
    className: function() { return "PageView"},
    params: {}, // hold the parsed parameter from queryString
    // ref: http://benmccormick.org/2015/01/05/marionette-view-life-cycles/
    // initialize is the suggested function for defining behavior on View setup.
    // It's a great place for setting up event listeners, and allows workings directly with the options passed to the View on creation.
    // 解析otions，此处options为页面的定义JSON
    constructor: function(options) {

      // convert components option into Backbone Views
      this.components = _.chain(options.components || [])
      .map(function(each){
        var com = this.createComponent(each);
        com.pageview = this;
        return com;
      }.bind(this))
      .compact()
      .value();
      // call super
      BaseView.apply(this, arguments);
    },

    setToggleBar: function(toggleBar){
      this.toggleBar = toggleBar;
    },

    // Application可能直接加载页面，所以做个函数在这，维持和TarbarView等的一致性
    // 同时解析传递过来的参数供其他部分使用
    route: function(path, queryString){
      if (queryString) {
        this.params = querystring.parse(queryString);
      }
      // also try to get path parameter, simple path parameter can be get here
      // can never override queryString parameter
      if (path && !_.has(this.params, 'path')) {
        this.params.path = path; // get path parameter
      }
      // call post route callback
      this.postRoute();
    },
    // 路由完成之后执行的方法，在这里参数已经获取成功，可以在这里获取参数执行初始化填充动作
    postRoute: function() { },
    remove: function() {
      // cleanup all components
      this.components && this.components.forEach(function(component) {
        component.remove();
      });
      // clean this params
      this.params = {};
      this.onRemove && this.onRemove();
      Backbone.View.prototype.remove.call(this);
    },

    render: function(){
      // header
      if (this.options.header) {
        this.$el.addClass("page-with-header");
        var header = this.getHeaderView(this.options.header);
        this.$el.append(header);
      }

      if (this.options.template) {

        loader.getPageTemplate(this.options.template)
        .then(function(template){
          var $template = $(template());

          // insert components into template
          _.chain(this.components)
          .filter(function(each){ return !!each.id; })
          .each(_.bind(function(each){//FIXME if template is not a single node, there is a problem
            $template.find('component#' + each.id).replaceWith(each.el);
          }, this));

          this.$el.append($template);
          this.onRender && this.onRender();
          this.onResume();
        }.bind(this));

      } else {
        // components
        this.components.reduce(function($el, component) {
          return $el.append(component.el);
        }, this.$el);
        this.onRender && this.onRender();
        this.onResume();
      }
      // bind to event handler
      this.setOptions(this.options);
      for(var i=0,j=this.components.length;i<j;i++){
        var c = this.components[i];
        c.onRender &&  c.onRender();
      }
      return this;
    },

    // 在页面创建和恢复时调用
    onResume: function(){
      this.toggleBar && this.toggleBar("hide");
    },
    getHeaderView: function(header){
      var header_el = $('<header class="bar bar-nav"></header>');

      function createNavItem(cfg) {
        if (cfg.type == "button" && cfg.text) {
          // 按钮风格，内有文字
          return $('<button class="btn">').text(cfg.text);
        } else if (cfg.type == "link" && !cfg.text) {
          // ios7链接风格，只有图标
          return $('<a></a>').addClass(cfg.icon);
        } else if (cfg.type == "link") {
          // ios7链接风格，有图标和文字
          var item = $('<button class="btn btn-link btn-nav">')
          if (cfg.icon) $('<span></span>').addClass(cfg.icon).appendTo(item);
          item.append(cfg.text);
          return item;
        }
      }

      if (_.isArray(header.items)) {
        header.items.forEach(function(item, index){
          var index_class = 'item-' + index;
          var item_el = createNavItem(item);
          item_el.addClass(index_class).addClass('pull-' + item.pull).appendTo(header_el);
          this.undelegate('click', '.' + index_class, this.onNavButtonClick.bind(null, item));
          this.delegate('click', '.' + index_class, this.onNavButtonClick.bind(null, item));
        }, this);
      }

      if (header.title) {
        var title = $('<h1 class="title"></h1>').text(header.title);
        header_el.append(title);
      }

      return header_el;
    },

    // 导航栏按钮事件响应
    onNavButtonClick: function(cfg){
      if (cfg.href && cfg.href[0] == '#') {
        Backbone.history.navigate(cfg.href, {trigger: true});
      } else if (cfg.href) {
        window.location.href = cfg.href;
      } else if (cfg.event) {
        Backbone.trigger(cfg.event);
      }
    },

    createComponent: function(cfg) {

      var Component = window.library.getComponent(cfg.type);
      if (!Component) throw new Error('Component ' + cfg.type + ' Not Exists.');

      var component = new Component(cfg).render();
      component.el.setAttribute('data-type', cfg.type);
      component.setOptions(cfg); // TODO: should be removed ?
      return component;
    },

    addComponent: function(component){
      if (component instanceof Backbone.View) {
        this.components.push(component);
        this.$el.append(component.el);
      } else {
        this.addComponent(this.createComponent(component));
      }
    },

    insertComponent: function(component, index){
      if (component instanceof Backbone.View) {

        if (index < this.components.length) {
          // mark anchor component for insertAfter operation before splice
          var anchor_component = this.components[index];
          this.components.splice(index, 0, component);
          component.$el.insertBefore(anchor_component.el);
        } else {
          this.components.splice(index, 0, component);
          component.$el.appendTo(this.el);
        }

      } else {
        this.insertComponent(this.createComponent(component), index);
      }
    },

    removeComponent: function(index){
      var component = this.components[index];
      this.components.splice(index, 1);
      component.remove();
    },

    findComponent: function(id) {
      var child = _.findWhere(this.components, {id: id});
      if (!child) console.warn('child not found: ' + id);
      return child;
    }
  });
});
