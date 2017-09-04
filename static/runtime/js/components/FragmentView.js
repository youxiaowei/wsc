// # FragmentView
// ##author xurz
// 显示模板页面，绑定数据，利用text插件读取模板数据，默认是读取字符串
//在根目录skeleton下建立/skeleton/js/templates/test.html
// className: FragmentView
//
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// fragment | string | false | 读取模版页面的路径，位于/skeleton/js/templates/目录下
// data | object | false | 绑定的数据对象
//
// 例子：
//
// ```js
// {
//     type: "FragmentView",
//     fragment: "test.html",
//     data: "{data:"FragmentView"}",
// }
// ```
////

define(function(require){

  var BaseView = require('./BaseView');
  var loader = require('../loader');

  return BaseView.extend({

    type: 'FragmentView',

    configure: function(options){
      // 异步加载
      loader.getTemplate(options.fragment)
      .then(function(template){
        this.$el.empty().append( template(options.data) );
      }.bind(this))
      .catch(function(){
        this.$el.text('Failed to load fragment: ' + options.fragment);
      }.bind(this));
    }
  });
});
