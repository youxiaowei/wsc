#如何使用rem
先贴上网址
https://github.com/amfe/lib-flexible
举个栗子
我们的设计稿是iPhone6,然后,我们打开chrome调试工具会发现html 有个front-size:75px,这个就是我们定的一个基准
设计稿的头部高为90px,那么我们转换成rem就是1.2rem,计算如下
h=90px;
z=75px
rem=h/z;
在less文件夹下面我写了一个common.less 里面有一个px2rem的一个方法...
h1{
    .px2rem(width:750);
}
编译的结果为
h1{
    width:10rem;
}


#样式命名规范:
common.less
主要是放一些less的函数,和一些变量
pagename-modlename
举个栗子:
首页的页面名称home,
然后我们在less文件夹下面新建一个home.less
里面的样式:
.home-tile{
     h1{

     }
     span{

     }
}
这样一定程度上避免了命名重复的问题.