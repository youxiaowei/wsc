# ImageView
##author pengpanting
显示图片，包括显示图片标题（在图片的左下角），点击图片跳转到到链接

className: ImageView

## 配置

变量 | 类型 | required | 描述
----|------|----------|-----
src | string | false | 显示的图片
title | string | false | 左下角显示的标题
href | string | false | 点击图片，跳转的链接

例子：

```js
{
    type: "ImageView",
    src: "./images/hello.png",
    title: "terry",
    href: "http://www.baidu.com"
}
```
/
