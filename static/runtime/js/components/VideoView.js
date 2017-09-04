// VideoView
// ============
// **TODO 此组件没有完成，对于可能的视频配置路径是写死的，需要完成此组件**
//
// 视频显示视图，配置参数如下：
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// src | string | true | 来源
// type | string | true | 视频格式类型
// autoplay | boolean | false | 是否自动播放，默认为false
// controls | boolean | false | 是否显示播放控件，默认为true
// height | number | true | 视频控件的高度
// width | number | false | 视频空间的宽度，默认为100%
define(['./BaseView'], function(BaseView){

  return BaseView.extend({

    type: 'VideoView',

    // 默认值
    defaults: {
    },

    /**
    * 重新配置参数
    */
    configure: function(options){

    },

    /**
    * 此实现方式，性能比较好，但要写很多代码
    */
    render: function(){

      var video = document.createElement('video');
      video.controls = true;
      video.autoplay = false;
      video.height = 140;
      $(video).css({width: '100%'});
      this.el.appendChild(video);

      var source = document.createElement('source');
      source.src = "/video_sample/mov_bbb.mp4";
      source.type = "video/mp4";
      video.appendChild(source);

      var source2 = document.createElement('source');
      source2.src = "/video_sample/mov_bbb.ogg";
      source2.type = "video/ogg";
      video.appendChild(source2);

      var warning = document.createTextNode("抱歉，您的浏览器不支持视频播放。");
      video.appendChild(warning);

      return this;
    }

  });
});
