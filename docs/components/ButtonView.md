ButtonView  按钮控件
---

className:ButtonView
author: Vicent

配置

| 变量 | 类型 | required | 描述 |
|----|------|----------|-----|
| id | string | true |控件id，当按钮配置有事件信息时必须与事件触发器中的target一致 |
| triggers | array | false | 事件触发器,配置按钮事件在这个对象里 |
| title | string | false | 按钮文本 |
| style | string | false | 样式 |
| outlined | boolean | false | 边框 |
| block | boolean | 锁定样式 | 锁定样式 |

```js

{
 id: "testbtn",
type: "ButtonView",
title: "提交",
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
