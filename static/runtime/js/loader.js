define(function(require){

  //NOTE: 创建一个新的变量指向require
  //原因是下面直接写require('./' + id)，运行正常
  //但优化时会误认为('./' + id)是一个依赖性，导致报错
  var _require = require;

  // wrap require api into promise
  var requirePromise = function(path){
    return new Promise(function(resolve, reject){
      _require(path, resolve, reject);
    });
  }

  // AMD Promise API
  return {
    getTemplate: function(name){
      var requirePath;
      if (name && name.endsWith(".html")) {
        // underscore template
        requirePath = 'text!./templates/' + name;

        return requirePromise([requirePath])
        .then(function(text){
          return _.template(text);
        });
      } else if (name && name.endsWith(".mustache")) {
        // mustache template
        requirePath = 'hgn!./templates/' + name.replace('.mustache', '');

        return requirePromise([requirePath]);
      }
    },
    get: function(type, name){
      var path = './' + type + 's/' + name;
      return requirePromise([path]);
    },
    getComponent: function(name){
      return this.get('component', name);
    },
    getModel: function(name){
      return this.get('model', name);
    },

    // async API for page loading
    // Login.json, Login.js, Login.css, Login.html
    createPage: function(name){
      console.log("create page: %s", name);

      return requirePromise(['text!./pages/' + name + '.json'])
      .then(function(config){
        config = JSON.parse(config);

        var requires = _.compact([
          './pages/' + (config.type || 'PageView'),
          config.template ? 'text!./pages/' + config.template : null,
          config.css ? 'css!./pages/' + config.css : null
        ])

        return requirePromise(requires)
        .then(function(PageClass){
          return new PageClass(config);
        });
      });

    },

    /**
     * load underscore template from 'pages/' folder
     * @param  {[type]} name template name
     * @return {Promise}     require promise
     */
    getPageTemplate: function(name){
      requirePath = 'text!./pages/' + name;

      return requirePromise([requirePath])
      .then(function(text){
        return _.template(text);
      });
    },

    /**
     * detect the resource represent by the path in this application exists
     *
     * using 'application index' in lazy mode
     * using 'require.defined' in full-loaded mode by 'extension-library'
     *
     * @param  {String} path resource path, AMD or CMD
     * @return {Boolean}      true | false
     */
    has: function(path){
      return require.defined(path);
    },

    hasPage: function(name) {
      return this.has('text!./pages/' + name + '.json');
    }
  }
});
