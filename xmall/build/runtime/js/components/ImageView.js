// # ImageView
// ##author pengpanting
// 显示图片，包括显示图片标题（在图片的左下角），点击图片跳转到到链接
//
// className: ImageView
//
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// src | string | false | 显示的图片
// title | string | false | 左下角显示的标题
// href | string | false | 点击图片，跳转的链接
//
// 例子：
//
// ```js
// {
//     type: "ImageView",
//     src: "./images/hello.png",
//     title: "terry",
//     href: "http://www.baidu.com"
// }
// ```
////
define(['./BaseView'], function(BaseView){

  /*
   * 使用div+background-image方式显示图片，以便保持图片比例
   */
  return BaseView.extend({

    // 对应到css
    type: 'ImageView',

    // 默认值
    defaults: {
      href: 'javascript: void 0;'
    },

    configure: function(options){
      // 图片连接
      this.a.href = options.href;
      // 图片标题
      if (options.title) {
        this.title.innerText = options.title;
        this.title.classList.remove('hide');
      } else {
        this.title.classList.add('hide');
      }

      // 使用css显示图片
      var image = new Image();

      if (options.src) {
        image.src = options.src;
      } else {
        // 如果没有图片，使用默认图片
        image.src = "data:image/png;base64,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";
      }

      image.onload = (function(_this){
        return function(){
          // 兼容 hybird app, 绝对路径，不处理，相对路径，加上window.app.url
          var should_prefix = this.src.indexOf("http") == -1 && this.src.indexOf("data:image") == -1;
          var prefix = should_prefix && window.app ? window.app.url : "";
          _this._setImageWithStyle({
            src: prefix + this.src,
            width: this.width,
            height: this.height
          });
        }
      })(this);
    },

    // 使用css显示图片
    // options.src 图片地址
    // options.width 图片实际宽度，用于计算比例
    // options.height 图片实际高度，用于计算比例
    _setImageWithStyle: function(options){
      $(this.img).css({
        'background-image': 'url(' + options.src + ')',
        'padding-top': (options.height / options.width) * 100 + '%'
      });
    },

    render: function(){

      // 链接
      var a = this.a = document.createElement('a');
      // 图片容器
      var img = this.img = document.createElement('div');
      img.classList.add('image');

      // 文本容器
      var title = this.title = document.createElement('div');
      title.classList.add('title');

      this.el.appendChild(a);
      a.appendChild(img);
      a.appendChild(title);

      return this;
    }

  });
});
