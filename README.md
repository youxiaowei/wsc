#ymall
# 移动＋运行时框架

本项目为移动＋开发平台的移动端开发框架，它基于流行的开源框架，使用组件化的架构思想进行设计，能够支持IDE开发和编码开发两种需求。

## 相关资料
* [技术框架](docs/technical.md) - 开源技术框架介绍
* [开发指南](docs/dev-guide.md) - 开发指南
* [组件文档](docs/components/)
* [架构介绍](docs/architecture.md) - 架构介绍和扩展开发
* [编码规范](docs/javascript-es5-code-style.md) - Javascript编码规范

## 快速启动
* 安装node
windows直接下载安装包，如果是Mac系统，建议先安装brew，
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
然后通过brew安装node
```
brew install node
```
* 安装coffee-script
```
npm install -g coffee-script
```
* 安装依赖
```
npm install
```
* 安装mongodb并且运行（可选）,windows使用安装包安装
```
brew install mongodb
```
* 转到本工程目录，运行，启动默认项目
```
coffee runtime-server.coffee
```
如果需要启动其它demo项目，加-p参数，如
```
coffee runtime-server -p todo-demo
```
* 浏览器打开
```
http://localhost:3000/index.html
```

