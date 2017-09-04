# GalleryView
##author pengpanting
跑马灯形式显示图片

className: GalleryView

## 配置

变量 | 类型 | required | 描述
----|------|----------|-----
items | array，arrya里面包含src属性 | true | 显示的图片数组

例子：

```js
{
    type: "GalleryView",
    items: [
        {
            src:"/runtime/images/1.png"
        },
        {
            src:"/runtime/images/2.png"
        }
    ]
}
```
