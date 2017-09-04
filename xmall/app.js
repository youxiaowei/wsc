window.app = {
    "name" : "微商城",
    "alias" : "xmall",
    "mode" : "development",   //development开发模式 production生产模式
    "defaultPage" : "index",
    "isDebug":false, // 接口为imall时要设置为true
    "api":"/testapi",//本地调试地址
    //"api":"http://shopc.yonyou.com",
    // "api":"http://szlapi.gootese.com", //远程调试
     "api":"http://localhost:8080",
//  "api":"http://api.gootese.com", //远程调试
//    "api" : "http://napi.chinasanzhuliang.com",  //正式环境地址
  //   "api" : "http://szlapi.yonyou.com",
    "version":"1.1",
    "proxy" : {
      // "/testapi/*" :"http://shopc.yonyou.com", //远程调试
      //"/testapi/*":"http://api.gootese.com/*",
      //"/testapi/*":"http://wxshop.chinasanzhuliang.com/*",
      // "/testapi/*":"http://61.142.172.204:3030/*",//海天
      //"/testapi/*": "http://bmall.yonyou.com/wfx/*"
    }
}
