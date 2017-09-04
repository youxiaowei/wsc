// # SearchView

// #author 李文奇

// 搜索输入框

// className: SearchView

// ## 配置

// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// autoTrigger | bool | false | 未定议
// filterKey | string | false | 未定议
// placeholder | string | false | 输入框无输入时提示信息

// 例子：

// ```js
// {
//   type: 'SearchView',
//   options: {
//     autoTrigger:false,
//     filterKey:"",
//     placeholder:"请输入搜索内容"
//   }
// }
// ```

// ## 样式
define(['./BaseView'], function(BaseView){

  return BaseView.extend({

    type: 'SearchView',

    defaults:{
      autoTrigger:false,
      filterKey:""
    },

    initialize:function(){

    },
    render: function(){
      var input = document.createElement('input');
      input.type = 'search';
      this.el.appendChild(input);

      return this;
    },

    configure: function(options) {
      this.$('input').attr('placeholder', options.placeholder || '');
      var self = this;
      var input = this.$el[0].children[0];
      $(input).on('change',function(){
        options.filterValue = this.value;
        //TODO   组件间事件绑定: 未来直接绑定到List
        // self.trigger("filter",options);
        var query={};
        query[options.filterKey] = options.filterValue;
        if(this.value != null && this.value != ""){
          Backbone.trigger("search",query);
        }else {
          Backbone.trigger('search',null);
        }
      });
    }
  });
});
