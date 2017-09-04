({
  baseUrl: "static/runtime/js",
  name: 'bootstrap',
  out: 'static/runtime/js/bootstrap.min.js',
  exclude: ["./extension-library"], // 结合paths.runtime 拦截到新路径
  excludeShallow: ["text"],
  paths: {
    // require.js plugins
    text: '../../vendor/requirejs-text/text',
    domReady: '../../vendor/requirejs-domready/domReady',
    i18n: '../../vendor/requirejs-i18n/i18n',
    css: '../../vendor/require-css/css',
    hogan: '../../vendor/requirejs-hogan-plugin/hogan',
    hgn: '../../vendor/requirejs-hogan-plugin/hgn',
    // libs
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
    // component dependencies
    slick: '../../vendor/slick.js/slick/slick',
  },

  shim: {
    iscroll: {exports: 'IScroll'},
    fastclick: {exports: 'FastClick'}
  },

  optimize: "uglify",
	preserveLicenseComments: false
})
