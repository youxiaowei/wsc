/*
 * 组件库
 * 此模块是单例对象，Backbone.Collection的实例
 * library的命名灵感源于xcode的xib builder
 */
define(function(require){

  require('./components/FragmentView');

  require('./components/NavView');
  require('./components/TextView');
  require('./components/TitleView');
  require('./components/ImageView');
  require('./components/VideoView');
  require('./components/ButtonView');
  require('./components/HTMLView');
  require('./components/CarouselView');
  require('./components/GalleryView');
  require('./components/PosterView');
  require('./components/SegmentedView');
  require('./components/ListView');
  require('./components/SearchView');
  require('./components/FormView');
  require('./components/MenuView');

  require('./pages/PageView');
  require('./pages/TabBarView');
  require('./pages/NavigationView');

  // 模型
  require('./models/StaticCollection');
  require('./models/RemoteCollection');

  // 引入扩展类库：导入用户自定义资源
  require('./extension-library');

  //NOTE: 创建一个新的变量指向require
  //原因是下面直接写require('./' + id)，运行正常
  //但优化时会误认为('./' + id)是一个依赖性，导致报错
  var _require = require;

  String.prototype.endsWith = function(s) {
    return s === '' || this.slice(-s.length) === s;
  };

  return {

    isExists: function(id){
      return _require.defined('./components/' + id);
    },

    // 利用text插件读取模板数据，默认是读取字符串
    getTemplate: function(name) {
      var requirePath;
      if (name && name.endsWith(".html")) {
        requirePath = 'text!./templates/' + name;
        var text = require.defined(requirePath) ? _require(requirePath) : null;
        return text ? _.template(text): null;
      } else if (name && name.endsWith(".mustache")) {
        requirePath = 'hgn!./templates/' + name.replace('.mustache', '');
        return require.defined(requirePath) ? _require(requirePath) : null;
      } else {
        return null;
      }
    },

    getComponent: function(name) {
      var requirePath = './components/' + name;
      return require.defined(requirePath) ? _require(requirePath) : null;
    },

    getModel: function(name) {
      var requirePath = './models/' + name;
      return require.defined(requirePath) ? _require(requirePath) : null;
    },

    getCollection: function(name){
      var requirePath = './models/' + name;
      return require.defined(requirePath) ? _require(requirePath) : null;
    },

    register: function(id, instance) {

    }
  };
});
