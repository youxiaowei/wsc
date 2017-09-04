BaseView
================
所有组件的基类，所有继承它的组件都具有相同的可配置参数，它提供了如下的可配置参数：

变量 | 类型 | required | 描述
----|------|----------|-----
id | string | false  | 组件id，组件需要响应事件时，必须具备id，在生成的dom中，id也是Dom的id、
type | string | true | 组件类型，见组件清单
triggers | array | false | 事件触发器

事件触发器具备如下的属性：

变量 | 类型 | required | 描述
----|------|----------|-----
event | string | true | 此触发器需要响应的事件名
target | string | true | 响应该事件的组件ID
action | string | true | 响应事件的行为，有script, set, call, navigate, hide, show
method | string | false | 当action为call时，要调用的方法名
script | string | false | 当action为script时，eval的javascript代码片段
arguments | json string | false | 调用方法的参数的json string
用于跨组件的事件响应时，只有页面内的响应事件组件的id和此触发器target所指定的id一致时，事件才会被触发
