// # CarouselView
// ##author pengguangzong
// 继承slickView组件，图片轮播
//
//
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// item  | 数组 | true    | 数组元素：str str是图片路径
// lazyLoad | string | false| 是否按需加载，在触发事件时加载图片，ondemand为延时加载
// dots | boolean | false | 是否需要轮播图片的小圆点，小圆点可以切换图片
// swipeToSlide| boolean | false |  是否通过平滑的方式
// autoplay | boolean | false | 是否能够自动播放
// speed       | boolean | false |轮播的切换速度，单位为毫秒
// 例子：
//
// ```js
// {
//   type: "CarouselView",
//   slickOptions: {lazyLoad:'ondemand',dots:true,autoplay:true,swipeToSlide: true,speed:1000},
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
  './SlickView'
], function(SlickView){

  return SlickView.extend({

    type: 'CarouselView',

    slickOptions: {
      lazyLoad: 'ondemand',
      autoplay: true,
      swipeToSlide: true,
      dots: true,
      speed: 1000,
      adaptiveHeight: true //开启高度自动适配
    },

    render: function(){
      SlickView.prototype.render.apply(this, arguments);

      var title_el = $('<div class="carousel-title"></div>');
      this.$el.append(title_el);

      return this;
    },

    configure: function(options){
      SlickView.prototype.configure.apply(this, arguments);

      if (options.title) {
        this.$('.carousel-title').show()
        .text(options.title);
      } else {
        this.$('.carousel-title').hide();
      }
    }

  });

});
