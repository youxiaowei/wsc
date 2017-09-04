define(['./jweixin'], function(wx){
    var wechat = {
        //初始化js-sdk
        init: function(data) {
            this.setlocalStorage('wscWechatSign', data);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId.toString(), // 公众号的唯一标识
                timestamp: data.timestamp.toString(), // 生成签名的时间戳
                nonceStr: data.nonceStr.toString(), // 生成签名的随机串
                signature: data.signature.toString(),// 签名
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'chooseImage',
                    'scanQRCode',
                    'uploadImage',
                    'chooseWXPay'
                ] // 需要使用的JS接口列表
            });
        },
        //调用扫一扫
        scanQRCode:function(needResult, success){
            wx.scanQRCode({
                needResult: needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    (success && typeof(success) === "function") && success(result);
                }
            });
        },
        //分享到朋友圈
        onMenuShareTimeline: function(success, cancel){
            var wscWechatSign = this.getlocalStorage('wscWechatSign');
            wx.onMenuShareTimeline({
                title: wscWechatSign.title, // 分享标题
                link:  wscWechatSign.link, // 分享链接
                imgUrl: wscWechatSign.imgUrl,
                success: function () {
                    (success && typeof(success) === "function") && success();
                },
                cancel: function () {
                    (cancel && typeof(cancel) === "function") && cancel();
                }
            });
        },
        //分享给朋友
        onMenuShareAppMessage: function(success, cancel){
            var wscWechatSign = this.getlocalStorage('wscWechatSign');
            wx.onMenuShareAppMessage({
                title: wscWechatSign.title, // 分享标题
                link:  wscWechatSign.link, // 分享链接
                imgUrl: wscWechatSign.imgUrl,
                desc:  wscWechatSign.desc, // 分享描述
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    (success && typeof(success) === "function") && success();
                },
                cancel: function () {
                    (cancel && typeof(cancel) === "function") && cancel();
                }
            });
        },
        //分享到QQ
        onMenuShareQQ: function(success, cancel){
            var wscWechatSign = this.getlocalStorage('wscWechatSign');
            wx.onMenuShareQQ({
                title: wscWechatSign.title, // 分享标题
                link:  wscWechatSign.link, // 分享链接
                imgUrl: wscWechatSign.imgUrl,
                desc:  wscWechatSign.desc, // 分享描述
                success: function () {
                    (success && typeof(success) === "function") && success();
                },
                cancel: function () {
                    (cancel && typeof(cancel) === "function") && cancel();
                }
            });
        },
        //选择图片
        chooseImage: function(success){
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds;
                    (success && typeof(success) === "function") && success(localIds);
                }
            });
        },
        //上传图片
        uploadImage: function(localId,isShowProgress,success){
            wx.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: isShowProgress, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    (success && typeof(success) === "function") && success(serverId);
                }
            });
        },
        //下载图片
        downloadImage: function(serverId,success){
            wx.downloadImage({
                serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var localId = res.localId; // 返回图片下载后的本地ID
                    (success && typeof(success) === "function") && success(localId);
                }
            });
        },
        onBridgeReady: function(){

        },
        chooseWXPay: function(option){
            //新版支付
            //查询是否在微信当中
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId" : option.config.appId,     //公众号名称，由商户传入
                    "timeStamp":option.config.timeStamp,         //时间戳，自1970年以来的秒数
                    "nonceStr": option.config.nonceStr, //随机串
                    "package": option.config.package,
                    "signType": "MD5",         //微信签名方式：
                    "paySign" : option.config.paySign //微信签名
                },
                function(res){
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        //支付成功回调
                        (option.success && typeof(option.success) === "function") && option.success(res);
                    }else{
                        (option.error && typeof(option.error) === "function") && option.error(res);
                    }
                }
            );
            // 旧版支付
            // wx.chooseWXPay({
            //     timestamp: option.config.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            //     nonceStr: option.config.nonceStr, // 支付签名随机串，不长于 32 位
            //     package: option.config.package , // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            //     signType: option.config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            //     paySign: option.config.paySign, // 支付签名
            //     success: function (res) {
            //         // 支付成功后的回调函数
            //         (option.success && typeof(option.success) === "function") && option.success(res);
            //     }
            // });
        },

        closeWindow: function(){
            wx.closeWindow();
        },
        getLocation: function(){
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                }
            });
        },
        getlocalStorage: function(name){
            var data = localStorage.getItem(name);
            if(data && data != 'null' && data != 'undefined'){
                return JSON.parse(data);
            }else{
                return false;
            }

        },
        setlocalStorage: function(name,data){
            return localStorage.setItem(name,JSON.stringify(data));
        }
    };
    return wechat;
});
