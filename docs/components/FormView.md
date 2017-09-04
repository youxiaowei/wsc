# FormView

表单组件，通过表单组件提交，修改数据
## 配置

变量 | 类型 | required | 描述
----|------|----------|-----
    forms | object | true | 表单对各个字段
collection | string | false | form提交对应的数据集id
url | string | false | form提交对应的url

例子：

 ```js
{
    type: 'FormView',
        collection:'55dbd0c02c75e9750622142e',
    forms:[{label:'label',name:'c1',type:'text',key:0},
     {label:'label2',name:'c2',type:'search',key:1}]
}
 ```

数据源
表单数据源分为两种类型：

 1.在数据中心中创建数据模型，在app设计器中选择对应数据模型名称

 2.输入参数定义对应url

## 事件

### 此组件监听的事件
事件 | 描述
----|------
|

### 此组件发出的事件
事件 | 描述
----|-----
表单提交 | 提交表单时发出的事件
