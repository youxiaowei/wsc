define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        events: {
            "click .header-icon-back": "goback",
            "click .filters-item": "select",
            "click .history-clear": "clear",
            "click .goods-collector-li": "toDetail",
            "click li": "toLogiDetail"
        },
        collection: null,
        onRender: function() {
            this.userInfo = window.application.getUserInfo();
            this.$('.default-item')
                .addClass("theme-color");
            this.collection = this.findComponent(
                    "LogisticListView")
                .collection;
        },
        goback: function(e) {
            window.history.back();
        },
        clear: function(e) {},
        onResume: function() {
            this.toggleBar && this.toggleBar('hide');
            this.initData();
        },
        toLogiDetail: function(e) {
            var logisId = $(e.currentTarget).attr("data-id");
            var sendId = "12345";
            var model = this.collection.find({
                logisId: logisId
            });
            localStorage.setItem("logisId",logisId);
            localStorage.setItem("sendId",sendId);
            app.logisInfo = model.get("logis");
            Backbone.history.navigate(
                '#my-navigate/logiticsDetail', {
                    trigger: true
                });
        },
        initData: function() {
            var userInfo = application.getUserInfo();
            if(!userInfo) {
                return;
            }
            var options = {
                path: "/getLogisticList",
                type: "POST",
                data: {
                    userId: userInfo.userid
                },
                showLoading: true,
                needReset: true,
                success: this.onSuccess.bind(this),
            }
            this.collection.loadData(options);
        },
        toDetail: function(e) {},
        onSuccess: function(res) {
        	if(res.data.length>0){  
        		//测试数据格式
//        	console.log(res)
//            var data = [{
//                logisId: "xxx",
//                logisCode: "xxx",
//                logisInfo: [{
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, {
//                    logisMessage: "xxx",
//                    messageTime: "2016-03-23 11:20:11",
//                }, ],
//                orderId: "xxx",
//                productInfo: [{
//                    name: "商品名称",
//                    image: "xxx.png",
//                    specInfo: "颜色：黑色；尺码 37",
//                    number: 1
//                },{
//                    name: "商品名称",
//                    image: "xxx.png",
//                    specInfo: "颜色：黑色；尺码 37",
//                    number: 1
//                },{
//                    name: "商品名称",
//                    image: "xxx.png",
//                    specInfo: "颜色：黑色；尺码 37",
//                    number: 1
//                }]
//            }];
        		this.collection.reset(res.data);
        	}else{
        		 var blankicon = $(
                         "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>还没有相关的物流信息~</div>"
                     );
        		 $("#show_nodata_div").html(blankicon).show();
        	}
        }
    });
});
