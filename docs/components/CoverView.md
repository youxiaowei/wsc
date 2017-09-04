CoverView  覆盖物控件
---

className:CoverView
author: Vicent

配置

| 变量 | 类型 | required | 描述 |
|----|------|----------|-----|
| id | string | true |控件id，|
| triggers | array | false | 事件触发器|
| backgroundImage | string | false | 背景图片 |
| theme | string | false | 样式 |
| backgroundColor | string | false | 背景颜色 |
| items | array |  | 子元素 |

```js

{
 id: "coverview",
type: "CoverView",
backgroundColor: "#ccccc"
backgroundImage: "url"
items:[
    {label: '面板', href: '#dashboard', icon: 'icon icon-home'}
]
triggers: [{
  target: "testbtn",
  action: "call",
  event: "click",
  method: "btnclick",
  arguments: {
    arg1: "arg1",
    arg2: "arg2"
  }
}]
}
```
