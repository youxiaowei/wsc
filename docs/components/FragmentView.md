# FragmentView
##author xurz
显示模板页面，绑定数据，利用text插件读取模板数据，默认是读取字符串
根目录skeleton下建立/skeleton/js/templates/test.html
className: FragmentView

## 配置

变量 | 类型 | required | 描述
----|------|----------|-----
fragment | string | false | 读取模版页面的路径，位于/skeleton/js/templates/目录下
data | object | false | 绑定的数据对象

例子：

```js
{
    type: "FragmentView",
    fragment: "test.html",
    data: "{data:"FragmentView"}",
}
```
/
