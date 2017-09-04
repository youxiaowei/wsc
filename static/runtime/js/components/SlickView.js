// # SlickView
// ##author pengguangzong
// 多张图片通过滑动左右切换
//
//
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// item  | 数组 | true    | 数组元素：str str是图片路径
// lazyLoad | string | false| 是否按需加载，在触发事件时加载图片，ondemand为延时加载
// 例子：
//
// ```js
// {
//   type: "SlickView",
//   slickOptions: {lazyLoad:"ondemand"},
//   items:[
//   {
//     src: "/runtime/images/56.jpg"
//   },
//   {
//     src: "/runtime/images/uu.jpg"
//   }
//  ]
// }
// ```
////
define([
  './BaseView',
  'slick'
], function(BaseView, Slick) {

  return BaseView.extend({

    type: 'SlickView',

    remove: function() {
      if (this.slick) this.$('.slick-container').slick('unslick');
      BaseView.prototype.remove.call(this, arguments);
    },
    createItem: function(item) {
      var carouselItem = document.createElement('div');

      carouselItem.classList.add('image');
      var a = document.createElement('a');
      var url = '';
      if(typeof item == "string"){
        url = item;
      }else{
        url = item.get('src');
      }
      var img = document.createElement('img');
      if (this.slickOptions.lazyLoad == 'ondemand') {
        img.setAttribute('data-lazy', url);
      } else {
        img.src = url;
      }
      a.appendChild(img);
      carouselItem.appendChild(a);

      return carouselItem;
    },

    configure: function(options) {

      if (this.slick) this.$('.slick-container').slick('unslick').empty();

      //获取数据源
      if (options.collection) {
        if (typeof options.collection == 'string') {
          //根据ID在application获取collection实例
          this.collection = window.application.getCollection(options.collection);
        } else if (options.collection instanceof Backbone.Collection) {
          this.collection = options.collection;
        } else if (options.collection.type) {
          _Collection = require('../models/' + options.collection.type);
          // 第一个参数为初始数据，第二个参数为个性配置
          this.collection = new _Collection(options.collection.items || [], options.collection);
        }
      }
      this.listenTo(this.collection, 'reset', this.onReset);

    },
    onReset: function() {
      this.$el.empty();
      var slick_el = document.createElement('div');
      slick_el.classList.add('slick-container');
      this.el.appendChild(slick_el);
      var models = this.collection.models;
      if (models.length > 0) {
        models.forEach(_.bind(function(item) {
          this.$('.slick-container').append(this.createItem(item));
        }, this));
        var slickOpts = _.extend({}, this.slickOptions, this.options.slickOptions);
        setTimeout(_.bind(function() {
          this.slick = this.$('.slick-container').slick(slickOpts);
        }, this), 0);
      } else {
        if (this.slick) this.$('.slick-container').slick('unslick').empty();

      }
    }
  });
});
