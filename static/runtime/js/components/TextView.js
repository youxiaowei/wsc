// # TextView

// #author 李文奇

// 文本显示标签

// className: TextView

// ## 配置

// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// collapse | bool | false | 是否折叠
// text | string | false | 显示内容

// 例子：

// ```js
// {
//   type: 'SearchView',
//   options: {
//     collapse:false,
//     text:"text"
//   }
// }
// ```

// ## 样式
define([
  'underscore',
  './BaseView'
], function(_, BaseView){

  /*
   * collapse: 是否折叠
   */
  return BaseView.extend({

    // 对应到css
    type: 'TextView',

    // 默认值
    defaults: {
      collapse: false
    },

    initialize: function(options){
      this.render();
    },

    render: function(){

      this.$el.empty();

      // 文本容器
      var text_el = this.text_el = document.createElement('div');
      text_el.classList.add('text');
      this.el.appendChild(text_el);

      // 文本节点
      // this.textNode = document.createTextNode('');
      // text_el.appendChild(this.textNode);

      if (this.options.collapse) {
        // 展开按钮
        var collapse_el = document.createElement('div');
        this.el.appendChild(collapse_el);
        this.$el.css({ height: '100px' });
      }

      if (this.options.text) {
        var value = this.options.text
        .split('\n')
        .map(function(each){
          return "<p>" + each + "</p>";
        })
        .join('');

        this.$('.text').append(value);
      }

      if (this.options.text && this.options.text != "") {
        this.$el.removeClass('empty');
      } else {
        this.$el.addClass('empty');
      }

      return this;
    }

  });
});
