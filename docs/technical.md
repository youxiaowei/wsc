# Runtime核心技术栈


## 开源框架

核心HTML5框架及组件库，使用如下技术：

Name | Description
-----|------------
`requirejs` | 模块化框架，结合其插件，处理js模块依赖和异步加载
`Backbone.js` | MVC框架，我们整个框架的核心
`jquery/Zepto` | DOM操作库
`underscore.js` | 函数式库
`ratchet` | 移动端样式库
`iScroll` | iOS滑动回弹效果模拟
`slick.js` | 跑马灯基础库
`fastclick` | 移除移动端HTML5点击300ms延迟

## Build in web server（开发服务器）

Name | Description
-----|------------
`node.js` | N/A
`coffee-script` | js编译语言，提供更优雅的语法
`mongodb` | 用于存储应用的数据
`mongo-rest` | 基于mongodb提供快速的JSON RESTful API实现
