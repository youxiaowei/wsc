// ButtonView  按钮控件
// ---
//
// className:ButtonView
// author: Vicent
//
// 配置
//
// | 变量 | 类型 | required | 描述 |
// |----|------|----------|-----|
// | id | string | true |控件id，当按钮配置有事件信息时必须与事件触发器中的target一致 |
// | triggers | array | false | 事件触发器,配置按钮事件在这个对象里 |
// | title | string | false | 按钮文本 |
// | btnStyle | string | false | 样式 |
// | outlined | boolean | false | 边框 |
// | block | boolean | 锁定样式 | 锁定样式 |
//
// ```js
//
// {
//  id: "testbtn",
// type: "ButtonView",
// title: "提交",
// triggers: [{
//   target: "testbtn",
//   action: "call",
//   event: "click",
//   method: "btnclick",
//   arguments: {
//     arg1: "arg1",
//     arg2: "arg2"
//   }
// }]
// }
// ```
define(['./BaseView'], function(BaseView){

  /*
  * outlined: 空心样式
  */
  return BaseView.extend({

    type: 'ButtonView',

    events: {
      "click a": "onClick"
    },

    // 默认值
    defaults: {
      title: '按钮',
      btnStyle: '',
      outlined: false,
      block: true,
      icon: null,
      badge: null,
      href: "javascript: void(0)"
    },

    configure: function(options){
      this.render();
    },

    render: function(){

      this.$el.empty();

      var a = document.createElement('a');
      a.href = this.options.href;
      this.el.appendChild(a);

      var button = document.createElement('button');
      var styles = ['btn', 'btn-' + this.options.btnStyle, (this.options.outlined ? 'btn-outlined' : ''), (this.options.block ? 'btn-block' : '')];
      button.classList.add.apply(button.classList, _.compact(styles));
      a.appendChild(button);

      button.innerText = this.options.title;

      if (this.options.badge) {
        var span = document.createElement('span');
        span.classList.add('badge', 'badge-' + this.options.btnStyle);
        button.appendChild(span);
      }

      return this;
    },

    onClick: function(){
      this.triggerEvent("click");
    }

  });
});
