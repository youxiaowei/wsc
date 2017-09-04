//
// app运行时启动脚本
//
require.config({
  // 不在这里指定，requirejs会根据本文件的路径决定
  // baseUrl: './js',
  paths: {
    // require.js plugins
    domReady: '../../vendor/requirejs-domready/domReady',
    css: '../../vendor/require-css/css.min',
    text: '../../vendor/requirejs-text/text',
    i18n: '../../vendor/requirejs-i18n/i18n',
    hogan: '../../vendor/requirejs-hogan-plugin/hogan',
    hgn: '../../vendor/requirejs-hogan-plugin/hgn',
    // lib
    jquery: '../../vendor/jquery/dist/jquery',
    underscore: '../../vendor/underscore/underscore',
    backbone: '../../vendor/backbone/backbone',
    "backbone.paginator": "../../vendor/backbone.paginator/lib/backbone.paginator",
    md5: '../../vendor/md5/md5',
    promise: '../../vendor/es6-promise/promise',
    fastclick: '../../vendor/fastclick/lib/fastclick',
    moment: '../../vendor/moment/moment',
    spin: '../../vendor/spinjs/spin',
    iscroll: '../../vendor/iscroll/build/iscroll',

    // component dependency
    slick: '../../vendor/slick.js/slick/slick'
  },
  shim: {
   "iscroll": {
     "exports": "IScroll"
   },
  },
  waitSeconds: 15
});

require([
  'domReady!',
  'promise',
  './libs/fastclick-custom',
  'jquery',
  'backbone',
  './Application',
  './library',
  './loader',
  './md5',
  './view-hierachy',
  './view-modal',
  './jquery.animate',
  './library-extend'
], function(domReady, ES6Promise, FastClick, $, Backbone, Application, library, loader,md5){
  // Promise补丁
  ES6Promise.polyfill();

  //enable fastclick
	FastClick.attach(document.body);

  window.library = library;
  window.loader = loader;
  // TODO:
  // app定义直接通过模板直接写在html上，保存在window.app变量里
  // 考虑做成独立的requirejs模块，Configuration

  // 页面加载完成，去除spinner
  //$(".spinner").remove();
  $(".loading-pic").remove();
  // 加载应用实例
  var AppType = require(window.app.type ? ('./' + window.app.type) : './Application');
  window.application = new AppType(window.app); // 应用级别共享app数据
  window.application.launch();

}, function(err){
  console.log("err: " + err.message + "\r\n" + JSON.stringify(err));

  if (document.querySelector('.error')) return; // 只报错一次

  var spinner = document.querySelector('.spinner');
  if (spinner) spinner.parentNode.removeChild(spinner);

  var b = document.createElement('div');
  b.classList.add('error');

  if (err.requireType == 'timeout') {
    b.innerText = "加载超时，请刷新重试"; //timeout hints
  } else {
    b.innerText = "加载错误，请联系管理员"; //error hints
  }
  b.setAttribute('style', 'position: fixed; top: 30%; width: 100%; height:auto; overflow:hidden; text-align: center; background: url("../images/loading/outages.png") no-repeat center top; background-size: 50% auto; line-height: 10rem;');
  document.body.appendChild(b);

});
