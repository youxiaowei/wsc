// # FormView
//
// 表单组件，通过表单组件提交，修改数据
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
//     forms | object | true | 表单对各个字段
// collection | string | false | form提交对应的数据集id
// url | string | false | form提交对应的url
//
// 例子：
//
//  ```js
// {
//     type: 'FormView',
//         collection:'55dbd0c02c75e9750622142e',
//     forms:[{label:'label',name:'c1',type:'text',key:0},
//      {label:'label2',name:'c2',type:'search',key:1}]
// }
//  ```
//
// 数据源
// 表单数据源分为两种类型：
//
//  1.在数据中心中创建数据模型，在app设计器中选择对应数据模型名称
//
//  2.输入参数定义对应url
//
// ## 事件
//
// ### 此组件监听的事件
// 事件 | 描述
// ----|------
// |
//
// ### 此组件发出的事件
// 事件 | 描述
// ----|-----
// 表单提交 | 提交表单时发出的事件


define(['./BaseView'], function(BaseView){

  return BaseView.extend({

    type: 'FormView',

    events: {
      "submit form": "onSubmit"
    },

    elements:{
              names:[],
              inputEL:""
            },
    render: function(){
      this.elements = {names:[],inputEL:""};
      return this;
    },

    // 提交的URL
    url: function(){
      if (this.options.collection && this.options.collection != '') {
        return '/api/collections/' + this.options.collection;
      } else {
        return this.options.url;
      }
    },

    onSubmit: function(e){
      var params = this.$('form').serializeArray().reduce(function(all, pair){
        all[pair.name] = pair.value; // eg: {'key': 'value', ...}
        return all;
      }, {});

      this.collection.create(params);
    },

    configure: function(options){
      var form = document.createElement("form");
      form.method = "POST";
      form.action = _.result(this, 'url');  //设置上传url

      var inputs = this.el.getElementsByTagName("input");
      if(options.forms){
        for(var i = 0; i < options.forms.length; i++){
          var input;
          var isExited = false;
          if(_.contains(this.elements.names,options.forms[i].name)){
            input = this.$el.find("input[ name='"+options.forms[i].name+"']")[0];
            isExited = true;
          }else{
            input = this.createInput(options.forms[i],form);
          }

          if(!isExited){
            $(form).append(input);
            this.elements.names.push(input.name);
          }
        }
      }
      this.$el.append(form);
      this.$el.find("button").remove();
      var btn = '<button id="submitBtn" type="submit" style="margin-top:7px" class="btn btn-primary btn-block">提交</button>';
      $(form).append(btn);
    },

    createInput:function(form,formview){
      var template;
      var placeholder = "";
      if(form.placeholder)
        placeholder = form.placeholder;
      if(form.label){
        //  formview.className += "input-group";
         template =  '<div class="input-row">'+
                          '<label>'+form.label+'</label>'+
                          '<input type="'+form.type+'" name="'+form.name+'" placeholder="'+placeholder+'">'+
                        '</div>';
      }else{
         template = '<input type="'+form.type+'" name="'+form.name+'" placeholder="'+placeholder+'">';
      }
      return template;
    }
  });
});
