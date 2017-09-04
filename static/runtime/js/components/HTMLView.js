// # HTMLView
//
// HTML组件，用于在page中嵌入html
//
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
//    html | string | true | 需要嵌入的html代码
//
// 例子：
//
//
// ```js
// {"type":"HTMLView","html":"Hello World!!!"}
// ```
// ## 事件
//
// ### 此组件监听的事件
// 事件 | 描述
// ----|------
// |
//
// ### 此组件发出的事件
// 事件 | 描述
// ----|-----
// |
define([
  'underscore',
  './BaseView'
], function(_, BaseView){

  return BaseView.extend({

    // 对应到css
    type: 'HtmlView',

    // 默认值
    defaults: {
      html: "<p>请输入HTML内容</p>"
    },

    configure: function(options) {
      this.$el.empty();
      this.$el.append(options.html);
    },

    render: function(){
      this.$el.append(this.options.html);
      return this;
    }

  });
});
