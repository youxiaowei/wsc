define(['./PageView', 'require', '../libs/canlendar' ], function(PageView, require, canlendar) {
    return PageView.extend({
        events: {
            'click .goback': 'onBack',
            "click .icomoon-moremore": "menuMore",
            "click .member-order-start": "startTimeSelect",
            "click .member-order-end": "endTimeSelect",
            "click .time-filter-btn": "timeFilterList",
            "click a": "setActive"
        },
        orderSelect: null,
        model: null,
        calendarInstance0: null,
        calendarInstance1: null,
        startFlag: 0,
        endFlag: 0,
        initialize: function() {
            // this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
        },
        menuMore: function(e) {
            this.findComponent("PopupMenu").show();
        },
        setActive: function(e) {
            var target = $(e.target);
            var index = target.attr("data-index");
            if(index == 4) {
                this.showMore();
            } else {
                this.$('.control-item')
                    .removeClass("theme-color");
                target.addClass("theme-color");
                var myDate = new Date();
                var Month = this.zeroAdd(myDate.getMonth() + 1);
                var nowData = myDate.getFullYear() + '-' +  Month + '-' + this.zeroAdd(myDate.getDate());
                console.log(index);
                var queryData = {};
                switch (index) {
                    case '1':
                        var oldData = this.addDate(myDate, -30);
                        queryData = {
                            userId: application.getUserInfo()
                                .userid,
                            startTime: oldData,
                            endTime: nowData
                        };
                        break;
                    case '2':
                        var oldData = this.addDate(myDate, -90);
                        queryData = {
                            userId: application.getUserInfo()
                                .userid,
                            startTime: oldData,
                            endTime: nowData
                        };
                        break;
                    case '3':
                        var oldData = this.addDate(myDate, -365);
                        queryData = {
                            userId: application.getUserInfo()
                                .userid,
                            startTime: oldData,
                            endTime: nowData
                        };
                        break;
                }
                this.listCollection.filterData(queryData);
            }
        },
        showMore: function() {
            if(this.orderSelect != null) {
                this.orderSelect.remove();
            }
            var orderSelectView = require(
                "../components/MembersOrderSelectView");
            this.orderSelect = new orderSelectView();
            this.$el.append(this.orderSelect.render()
                .el);
            setTimeout(function() {
                $('.full-mask')
                    .show();
                $(".member-order-view")
                    .addClass(
                        "member-order-view-show")
            }, 100);
        },
        toSearch: function(e) {
            this.findComponent("SearchMidPageView")
                .show();
        },

        startTimeSelect:function(e){
            var targetObj = $(e.target);
            if (this.canlendarInstance0 == null) {
                var type = "年月日";
                var _this = this;
                this.canlendarInstance0 = new canlendar.Calendar({
                    container: _this.el
                }).bind("ok", function(valStr) {
                        var arr = valStr.split('-');
                        var birthday = arr[0] + "-" + arr[1] + "-" + arr[2] + "";
                        targetObj.text(birthday);
                        targetObj.empty().append(birthday);
                        _this.startFlag = 1;
                    }).setModal(type);
            }
            this.canlendarInstance0.show(targetObj.innerHTML);
        },
        endTimeSelect:function(e){
            var targetObj = $(e.target);
            if (this.canlendarInstance1 == null) {
                var type = "年月日";
                var _this = this;
                this.canlendarInstance1 = new canlendar.Calendar({
                    container: _this.el
                }).bind("ok", function(valStr) {
                        var arr = valStr.split('-');
                        var birthday = arr[0] + "-" + arr[1] + "-" + arr[2] + "";
                        targetObj.text(birthday);
                        targetObj.empty().append(birthday);
                        _this.endFlag = 1;

                    }).setModal(type);
            }
            this.canlendarInstance1.show(targetObj.innerHTML);
        },

        timeFilterList:function(){
            console.log("end="+this.endFlag);
            console.log("start="+this.startFlag);
            if(this.endFlag==1&&this.startFlag==1){
                var startTime = $('.member-order-start').text();
                var endTime = $('.member-order-end').text();
                var start = Date.parse(new Date(startTime));
                var end = Date.parse(new Date(endTime));
                if(start>end){
                    library.Toast("开始时间必须早于结束时间！");
                    return;
                }

                var queryData = {};
                queryData = {
                    userId: application.getUserInfo().userid,
                    startTime: startTime,
                    endTime: endTime
                };
                this.listCollection.filterData(queryData);

                $(".member-order-view").removeClass("member-order-view-show");
                setTimeout(function(){$(".member-order-view").remove()},300);
                $(".full-mask").hide();
                this.canlendarInstance1 = null;
                this.canlendarInstance0 = null;
                this.endFlag=0;
                this.startFlag=0;
            }
            else{
                library.Toast("请选择开始日期和结束日期！");
            }
        },

        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onBack: function() {
            window.history.back();
        },
        onResume: function() {
            PageView.prototype.onResume.apply(this,
                arguments);
            this.toggleBar && this.toggleBar('hide');
            this.initData();
        },
        addDate: function(date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            return d.getFullYear() + '-' + this.zeroAdd(m) + '-' + this.zeroAdd(d.getDate());
        },
        zeroAdd : function(s) {
            return s < 10 ? '0' + s: s;
        },
        initData: function() {
            this.listCollection = this.findComponent(
                    'myMembersOrderList')
                .collection;
            this.userInfo = window.application.getUserInfo();
            if(!this.userInfo) {
                library.Toast("您尚未登录，请前往登录", 2000);
                window.history.back();
            }
            var myDate = new Date();
            var Month = this.zeroAdd(myDate.getMonth() + 1);
            var nowData = myDate.getFullYear() + '-' +  Month + '-' + this.zeroAdd(myDate.getDate());
            var oldData = this.addDate(myDate, -30);
            this.listCollection.queryData = {
                userId: application.getUserInfo()
                    .userid,
                startTime: oldData,
                endTime: nowData
            };
            $("#myMembersOrderList")
                .show();
            this.listCollection.loadData({
                url: this.listCollection.allServiceUrl,
                data: this.listCollection.queryData,
                needReset: true,
                showLoading: true,
                success: this.onSuccess.bind(this),
                error: this.onError.bind(this)
            });
        },
        onSuccess: function( data ) {
            if( data && data.status != '0' ) {
                library.Toast( "网络错误，请稍后再试", 2000 );
            }
            this.setPageStatus();
        },
        onError: function() {
            library.Toast( "抱歉，网络错误", 2000 );
            this.setPageStatus();
        },
        setPageStatus: function() {
            if( !this.listCollection.length || this.listCollection
                .length == 0 ) {
                $( "#myMembersOrderList" )
                    .hide();
                var blankicon = $(
                    "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还没有相关售后服务哟~</div>"
                );
                $( ".table-view" )
                    .append( blankicon );
            } else {
                $( "#myMembersOrderList" )
                    .show();
                $( ".icomoon-without" )
                    .remove();
                $( ".add-blank-leaving-words" )
                    .remove();
            }
            //this.setActive( this.indexTab );
        },
        // onResume: function() {
        //
        //
        //   var ServiceModel = require('../models/BaseModel');
        //   var _ServiceModel = new ServiceModel();
        //
        //   var options = {
        //     path:"/getMembersOrders",
        //     type:"POST",
        //     data:{
        //       userId:application.getUserInfo().userid,
        //       startTime:"2016-01-01",
        //       endTime:"2016-11-01"
        //     },
        //     success:function(data){
        //       console.log("---getMembersOrders---");
        //       console.log(data);
        //     },
        //     error:function(){
        //
        //     }
        //   }
        //   _ServiceModel.loadData(options);
        // }
    });
});
