// 支付model，银联支付入口，所有支付都调用这个类
// Vicent

define(['./BaseModel'], function(BaseModel) {
  return BaseModel.extend({

    payCallback: null,

    // 银联支付
    startPay: function(orderNo,userId,payWapayId,sendWayId,callback, path) {
      this.payCallback = callback;
      var options = {
        //path:"/pay/testTn", //测试环境银联支付工单生成地址
        path: path, // 正式环境
        type: "POST",
        needReset: false,
        showLoading: true,
        data: {
          userId : userId,
          payWayId: payWapayId,
          sendWayId:sendWayId,
          orderId:orderNo
        },
        success: function(res) {
          if (res) {
            //res = JSON.parse(res);
            if (res.data && res.data.payInfo &&res.data.payInfo.prePayId) {
               this.toPay(res.data.payInfo.prePayId);
             } else {
               library.Toast("调起银联失败，请重试");
             }
          } else {
            library.Toast("调起银联失败 获取prePayId失败");
          }
        }.bind(this),
        error: function(res) {
          console.log(res);
          library.Toast("调起银联失败，请重试 ");
        }
      };
      this.loadData(options);
    },

    startBalancePay:function(data,callback,path){
      var options = {
        path: path,
        showLoading:true,
        data:data,
        success:callback,
        error:callback
      }
      this.loadData(options);
    },

    // 微信服务号支付
    startWXInnerPay: function() {
			var response = function(res) {
				if (res.err_msg == "ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
			}
      // WeixinJSBridge.invoke(
      //   'getBrandWCPayRequest', {
      //     "appId":
      //     "wx2421b1c4370ec43b", //公众号名称，由商户传入
      //     "timeStamp"：
      //     " 1395712654", //时间戳，自1970年以来的秒数
      //     "nonceStr"：
      //     "e61463f8efa94090b1f366cccfbbb444", //随机串
      //     "package"：
      //     "prepay_id=u802345jgfjsdfgsdg888",
      //     "signType"：
      //     "MD5", //微信签名方式：
      //     "paySign"：
      //     "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
      //   },
      //   response
      // );
    },

    // 掉漆银联支付
    toPay: function(code, callback) {
      if (cordova && cordova.plugins) {
        //发起支付，code为银联订单流水号，00表示正式支付环境，01表示测试环境
        // TODO 后期正式部署时改成00
        cordova.plugins.yypay.pay(code, '01', this.payCallback, this.payCallback);
      } else {
        console.log("支付插件初始化失败");
      }
    },

  });
});
