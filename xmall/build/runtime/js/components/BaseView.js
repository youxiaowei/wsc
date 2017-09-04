// BaseView
// ================
// 所有组件的基类，所有继承它的组件都具有相同的可配置参数，它提供了如下的可配置参数：
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// id | string | false  | 组件id，组件需要响应事件时，必须具备id，在生成的dom中，id也是Dom的id、
// type | string | true | 组件类型，见组件清单
// triggers | array | false | 事件触发器
//
// 事件触发器具备如下的属性：
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// event | string | true | 此触发器需要响应的事件名
// target | string | true | 响应该事件的组件ID
// action | string | true | 响应事件的行为，有script, set, call, navigate, hide, show
// method | string | false | 当action为call时，要调用的方法名
// script | string | false | 当action为script时，eval的javascript代码片段
// arguments | json string | false | 调用方法的参数的json string
// 用于跨组件的事件响应时，只有页面内的响应事件组件的id和此触发器target所指定的id一致时，事件才会被触发
define(['underscore', 'backbone'], function(_, Backbone){

  /*
   * View lifycycles:
   * initialize: 做初始化操作，解析options，监听事件，初始化变量等操作
   * render: 通过模板或DOM API操作this.el进行组件渲染，必须返回this。如果继承别的组件，可能需要调用父类render以保证父类的render逻辑得到执行。
   * onRender: 渲染后的回调，为避免干扰父类原本的渲染逻辑，可以通过覆盖此方法实现二次渲染逻辑
   * onShow: 组件显示
   * onHide: 组件隐藏
   * onRemove: 组件销毁的回调，可以避免直接覆盖remove方法
   */
  return Backbone.View.extend({

    type: 'BaseView',

    // 默认与type一致
    className: function(){ return this.type; },

    // 默认值
    defaults: {},

    /*
     * override constructor to remember 'options'
     */
    constructor: function(options){
      //remember options
      this.options = _.defaults(options, this.defaults) || {};
      //call super, this will call initialize
      Backbone.View.apply(this, arguments);
    },

    remove: function(){
      Backbone.View.prototype.remove.apply(this, arguments);
      // add lifycycle support
      this.onRemove();
    },

    //
    // view lifycycle callbacks
    //
    onRender: function(){},

    onShow: function(){},

    onHide: function(){},

    onRemove: function(){},

    /**
     * modify options, and trigger configure()
     * options是一个对象，但它的属性的值，可以为变量值，也可以是一个函数，以支持动态运算
     * 此特性需要组件自身支持，组件可以通过underscore的result函数同时支持这两种值类型
     */
    setOptions: function(options, override){
      if (override) {
        this.options = _.defaults(options, this.defaults);
      } else {
        this.options = _.extend(this.options || {}, options);
      }
      // for all the triggers, register the event listener
      this.stopListening(Backbone, "all"); // stop listening all
      // for all the triggers declaration, register listener to it
      if (this.options.triggers) {
        this.options.triggers.forEach(function(trigger){
          this.listenTo(Backbone, trigger.event, this.onEvent.bind(this, trigger));
        }.bind(this));
      }

      // 写在此处，免得子类覆盖configure方式时要调用super
      if (this.options.style) {
        var style = this.options.style;
        if (_.isObject(style)) {
          var styleArr = [];
          _.keys(this.options.style).forEach(function(key){
            styleArr.push(key + ":" + this.options.style[key] + ";");
          }.bind(this));
          style = styleArr.join("");
        }
        // set style to the element
        this.$el.attr('style', style);
      } else {
        this.$el.removeAttr('style');
      }

      this.configure(this.options);

      return this;
    },

    /*
     * configure this view by options, trigger by setOptions()
     * subclass should override this method
     */
    configure: function(options) {},

    // 事件触发API
    triggerEvent: function(event, options) {
      // a inner function to trim options
      var trimArgs = function(args, _arguments) {
        // passed more then 2 argument, just push them to the args
        if (_arguments.length > 2) {
          for (var i = 1; i < _arguments.length; i++) {
            args[i - 1] = _arguments[i]; // copy arguments
          }
        } else {
          // test the options
          if (_.isArray(options)) { // options is a array
            _.each(options, function(e, i) {
              args[i] = e; // array args passed from app.js may be overwrited, it's un-evitable
            });
          } else if (_.isObject(options)) {
            args = _.extend(args, options); // options is a hash
          } else if (options) {
            args[0] = options; // singluar arguments
          }
        }
        return args;
      }

      var _arguments = _.toArray(arguments); // keep the out function arguments
      var args = trimArgs(args || {}, _arguments);
      // all arguments: static or passed are unified to a {sender: this, arguments:{}} stucture
      // finally, fire event on `Backbone` bus
      Backbone.trigger(event, {sender: this, arguments: args});
    },

    // 触发事件动作
    onEvent: function(trigger, options) {
      var event = trigger.event;
      // only responde to specific component
      if (trigger.target && options.sender
         && trigger.target != options.sender.id) {
        return;
      }
      var sender = options.sender ? options.sender.id : "unknown";
      console.log ("got event:%s from component:#%s", event, sender);
      var action = trigger.action;
      // if no action, auto mapping to onMethod call
      // have to make sure the trigger cann't be the event handler
      // TODO even it is a Single Page Application,
      // make sure only components in the same page can handle the events
      if (!action && event
         && options.sender && options.sender.id != this.id) {
        action = 'call'; // default to method call
        options.method = 'on' + event.substr(0, 1).toUpperCase() + event.substr(1);
      }
      // fail fast
      if (!action) {
        return; // still no action, return directly
      }
      if (action == "script") {
        new Function(trigger.script).apply(this);
      } else if (action == "set") {
        this.setOptions(JSON.parse(trigger.options));
      } else if (action == "call") {
        var method = this[trigger.method];
        if (method) {
          // determine arguments of method
          // all the event handler has the same method signature {sender:xxx, arguments:xxx}
          method.call(this, options.sender, options.arguments);
        }
      } else if (action == "navigate") {
        var href = trigger.href || options.href;
        // append query params
        if (options.arguments) {
          var params = querystring.stringify(options.arguments);
          href += ("?" + params);
        }
        if (href && href[0] == "#") {
          Backbone.history.navigate(href, {
            trigger: true
          });
        } else {
          window.location.href = href;
        }
      } else if (action == "show") {
        this.$el.show();
      } else if (action == "hide") {
        this.$el.hide();
      }
    }

  });
});
