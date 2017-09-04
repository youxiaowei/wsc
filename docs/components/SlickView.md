# SlickView
##author pengguangzong
多张图片通过滑动左右切换


## 配置

变量 | 类型 | required | 描述
----|------|----------|-----
item  | 数组 | true    | 数组元素：str str是图片路径
lazyLoad | string | false| 是否按需加载，在触发事件时加载图片，ondemand为延时加载
例子：

```js
{
  type: "SlickView",
  slickOptions: {lazyLoad:"ondemand"},
  items:[
  {
    src: "/runtime/images/56.jpg"
  },
  {
    src: "/runtime/images/uu.jpg"
  }
 ]
}
```
/
