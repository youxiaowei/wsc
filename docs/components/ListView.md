   ListView  列表数据

className:ListView
# ListView
展示列表
## 配置
变量 | 类型 | required | 描述
----|------|----------|-----
    template | string | true | 列表项模板，对应到js/templates下的文件名
collection | object | true | 通过type属性指定自定义数据源，对应到js/models下模块名
iscroll | boolean | false | 是否使用IScroll
autoload | boolean | false | 是否自动加载数据，默认为true
style | string | false | 继承了BaseView的公有属性，针对此组建el的样式
paging | boolean | false | 分页
templateType | string | false | 模板类型 分别为mustache,underscore
filterKey  | string | false | 数据源过滤值
filterValue | string | false | filterKey 和 filterValue 需要同时用
events |  obj | false | 事件指定events: {"click .loadmore": "onLoadMore","click li": "onRowSelect" }



例子：
自定义数据源
```
{
  type: 'ListView',
     options: {
 collection: {
   type: 'MyCollection'
 }
}
}
```
动态数据源（需要配合app-bricks使用）
```
{
  type: 'ListView',
      options: {
  collection: {
    type: 'RemoteCollection',
        id: '{{动态数据源id}}'
  }
}
}
```
## 事件
### 此组件监听的事件
事件 | 描述
----|------
    reset | 重新加载列表
filter | 过滤列表
### 此组件发出的事件
事件 | 描述
----|-----
    |
## API
refresh
setEditing
reset
filter
## data-action API
当列表项内有可点击元素，可以使用data-action API分别监控这些元素的点击事件。
只需要在可点击元素上添加data-action属性，
就可以通过监听ListView的"action:{{name}}"，响应某个内部按钮事件。
```html
<li>
<div>
{{name}}
</div>
<button data-action="delete">Delete</button>
    <div data-action="update">Update</div>
    </li>
```
```js
var listView = this.find('my-listview');
this.listenTo(listView, 'action:delete', this.onDelete);
```
## FAQ
Q: 我需要在ListView展现之前，处理一下数据
A: 例如我们需要将年龄大于等于18的会员，标记为成年，成年的会员展示联系按钮，否则显示“不能联系”，以下为伪代码：
app.js
```
{
  pages: {
    'myView': {
      components: [
        {
          id: 'memberListView',
          type: 'ListView', options: {
          template: 'member_tpl.mustache',
          collection: {
            type: 'Members'
          }
        }
        }
      ]
    }
  }
}
```
member_tpl.mustache
模板
```
<div>
<div>{{name}}</div>
{{#adult}}
<button>Contact</button>
{{/adult}}
{{^adult}}
<div>could not contact</div>
{{/adult}}
</div>
```
Members.js
```
BaseCollection.extend({
  // json_models为一个json数组
  postParse: function(json_models){
    return json_models;
  },
  parse: function(response){
取出结果数组
    var result = response;
后处理
    result = this.postParse(result);
最终结果
    return result;
  }
});
```
MyPageView.js
```js
var collection = this.find("memberListView").collection;
collection.postParse = function(json_models){
  return _.map(json_models, function(each){
    each.adult = each.age >= 18;
    return each;
  });
}
collection.fetch();
```
