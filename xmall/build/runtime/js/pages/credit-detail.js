define(['./PageView', 'require', '../libs/canlendar' ], function(PageView, require, canlendar){
    return PageView.extend({
        events:{
            'click .goback': 'onBack',
            "click .header-menu":"menuMore",
            "click .member-order-start": "startTimeSelect",
            "click .member-order-end": "endTimeSelect",
            "click .time-filter-btn": "timeFilterList",
            "click a": "setActive",
            "click #nlistViewLoadMore":"loadMore",
            "click .orderNumber":"rowclick"
        },
        orderSelect: null,
        model: null,
        calendarInstance0: null,
        calendarInstance1: null,
        startFlag: 0,
        endFlag: 0,
        currentPageNum: 1,
        eachPageListNum : 10,
        beginTime: "",
        endTime: "",

        initialize: function(){
            this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
        },
        menuMore: function(e){
            this.findComponent("PopupMenu").show();
        },
        rowclick:function (e) {
           var str = e.currentTarget.innerText;
           var orderId = str.substring(4);
            var logisId = undefined;
            var type  = e.currentTarget.attributes.billuserid.value;
            Backbone.history.navigate(
                "#my-navigate/order-detail?orderId=" +orderId+"&logisId="+ logisId+"&type="+type, {
                    trigger: true
                });
        },
        loadMore:function (e) {
            if(e.target.innerText == "已加载全部"||e.target.innerText == "未查询到相关数据"){
                return;
            }
            this.currentPageNum += 1;
            var queryData = {
                userId: application.getUserInfo().userid,
                startTime: this.beginTime,
                endTime: this.endTime,
                currentPage: this.currentPageNum,
                pageSize : this.eachPageListNum
            };
            this.sendData("/getCreditDetail",queryData,this.callback);
        },
        toSearch: function(e){
            this.findComponent("SearchMidPageView").show();
        },
        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onBack:function(){
            window.history.back();
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
                var oldData = nowData;
                switch (index) {
                    case '1':
                        oldData = nowData;

                        break;
                    case '2':
                        oldData = this.addDate(myDate, -7);

                        break;
                    case '3':
                        oldData = this.addDate(myDate, -30);

                        break;
                }
                this .beginTime = oldData + " 00:00:00";
                this.endTime = nowData + " 23:59:59";
                this.currentPageNum = 1;
                $("#creditdetaillistviewDiv").html(" ");
                queryData = {
                    userId: application.getUserInfo().userid,
                    startTime: this .beginTime,
                    endTime: this.endTime,
                    currentPage:this.currentPageNum,
                    pageSize :this.eachPageListNum
                };
                this.sendData("/getCreditDetail",queryData,this.callback);
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
                $("#creditdetaillistviewDiv").html(" ");
                this.currentPageNum = 1;
                var queryData = {};
                queryData = {
                    userId: application.getUserInfo().userid,
                    startTime: startTime+" 00:00:00",
                    endTime: endTime+" 23:59:59",
                    currentPage: this.currentPageNum,
                    pageSize : this.eachPageListNum
                };

                this.sendData("/getCreditDetail",queryData,this.callback);
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
        addDate: function(date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            return d.getFullYear() + '-' + this.zeroAdd(m) + '-' + this.zeroAdd(d.getDate());
        },
        zeroAdd : function(s) {
            return s < 10 ? '0' + s: s;
        },
        showGetIntegralDetail: function(json){
            $("#showLoadingMore").remove();
            for(var i=0; i<json.length; i++) {
                var jsonRow = json[i];
                var inlType = "";
                var srcsys = ""
                    ;                switch(jsonRow.srcsys){
                    case "1":
                        srcsys ="零售";
                        break;
                    case "2":
                        srcsys ="官方商城";
                        break;
                    case "3":
                        srcsys ="呼叫中心";
                        break;
                    case "4":
                        srcsys ="京东";
                        break;
                    case "5":
                        srcsys ="淘宝";
                        break;
                    case "6":
                        srcsys ="微信";
                        break;
                    case "7":
                        srcsys ="QQ";
                        break;
                    case "8":
                        srcsys ="新浪微博";
                        break;
                    default:
                        srcsys ="零售";
                        break;
                }

                switch (jsonRow.desc){
                    case "1":
                        inlType = "消费返利";
                        break;
                    case "2":
                        inlType = "消费抵扣";
                        break;
                    case "3":
                        inlType = "兑付消耗";
                        break;
                    case "4":
                        inlType = "晋级扣减";
                        break;
                    case "5":
                        inlType = "失效";
                        break;
                    case "6":
                        inlType = "奖励积分";
                        break;
                    case "7":
                        inlType = " 系统调整";
                        break;
                    case "8":
                        inlType = "日常奖励";
                        break;
                    case "9":
                        inlType = "消费抵扣-退还";
                        break;
                    case "10":

                        if(Number(jsonRow.point)>0){
                            inlType = "转入";
                        }else {
                            inlType = "转出";
                        }
                        break;
                    case "11":
                        inlType = "消费抵扣-退还";
                        break;
                    case "12":
                        inlType = "消费返利-扣回";
                        break;
                    default:
                        inlType= "消费返利";
                        break;

                }
                var creditdetaillistviewDivHtml = '<div>'
                    + '<ul>'
                    + '<li class="ListViewRow">' +'<div class="MyHTMLView">'+ '<div class="credit-detaillistview1row">'+' <div>';
                //
                if (jsonRow.point != undefined) {
                    creditdetaillistviewDivHtml += '<p align="center"><span>' + jsonRow.point + '</span>积分</p>';
                }
                creditdetaillistviewDivHtml += '<p align="center"><span>' + inlType + '</span></p>'
                    + '</div>'
                    + '<div>';

                if (jsonRow.srcbillno != undefined) {
                    if(srcsys == '官方商城'){
                        if(inlType == '兑付消耗'){
                            creditdetaillistviewDivHtml += '<p class="orderNumber" billUserId="2">订单号:<span style="border-bottom:#666666  solid 1px;">' + jsonRow.srcbillno + '</span></p>';

                        }else{
                            creditdetaillistviewDivHtml += '<p class="orderNumber" billUserId="1">订单号:<span style="border-bottom:#666666  solid 1px;">' + jsonRow.srcbillno + '</span></p>';
                        }
                    }else {
                        creditdetaillistviewDivHtml += '<p>订单号:<span>' + jsonRow.srcbillno + '</span></p>';
                    }
                }
                if (jsonRow.srcsys != undefined) {
                    creditdetaillistviewDivHtml += '<p align="center"><span>' + srcsys + '</span></p>';
                }
                if (jsonRow.trader != undefined) {
                    creditdetaillistviewDivHtml += '<p>交易人:<span>' + jsonRow.trader + '</span></p>';
                }
                if (jsonRow.sourceMember != undefined) {
                    creditdetaillistviewDivHtml += '<p>来源:<span>' + jsonRow.sourceMember + '</span></p>';
                }
                if (jsonRow.receiveMember != undefined) {
                    creditdetaillistviewDivHtml += '<p>接受人:<span>' + jsonRow.receiveMember + '</span></p>';
                }
                if (jsonRow.oldLevel != undefined &&jsonRow.newLevel != undefined) {
                    creditdetaillistviewDivHtml += '<p><span>' + jsonRow.oldLevel+'->'+'jsonRow.newLevel ' + '</span></p>';
                }
                if (jsonRow.behaviorName != undefined ) {
                    creditdetaillistviewDivHtml += '<p><span>' + jsonRow.behaviorName + '</span></p>';
                }

                if (jsonRow.money != undefined) {
                    var point = jsonRow.money;
                    var pointFloor  = Math.floor(Number(point)*100)/100;
                    var myPoints = pointFloor.toFixed(2).toString();
                    if(inlType == "消费返利") {
                        creditdetaillistviewDivHtml += '<p>消费金额:<span>' + '￥'+myPoints + '</span></p>';
                    }else{
                        creditdetaillistviewDivHtml += '<p>交易金额:<span>' + '￥'+ myPoints + '</span></p>';

                    }
                }
                creditdetaillistviewDivHtml += '<p>时间:<span>' + jsonRow.time + '</span></p>' + ' </div>'+'</div>'
                    +'</div>'
                    +'<div class="yy-listrow-cover"></div></li>' +'</ul>';
                $("#creditdetaillistviewDiv").append(creditdetaillistviewDivHtml)
            }
            var showLoadingMoreBtnHtml = "<div id='showLoadingMore'>"
                +"<div class='nlistview-addmore' id='nlistViewLoadMore'></div>"
                +"</div>";
            $("#creditdetaillistviewDiv").append(showLoadingMoreBtnHtml)
            if(json.length>0 && json.length < this.eachPageListNum){
                $("#nlistViewLoadMore").html('<button class="loadmore" style="display: inline-block;">'+'<div class="label">'+'已加载全部'+'</div><span class="loading-icon"></span></button>');

            }else{
                $("#nlistViewLoadMore").html('<button class="loadmore" style="display: inline-block;">'+'<div class="label">'+'加载更多'+'</div><span class="loading-icon"></span></button>');
            }

        },
        onResume: function() {

            PageView.prototype.onResume.apply(this,
                arguments);
            this.toggleBar && this.toggleBar('hide');
            var myDate = new Date();
            var Month = this.zeroAdd(myDate.getMonth() + 1);
            var nowData = myDate.getFullYear() + '-' +  Month + '-' + this.zeroAdd(myDate.getDate());
            var oldData = nowData;
            this.beginTime = oldData + " 00:00:00";
            this.endTime = nowData + " 23:59:59";
            // $("#creditdetaillistviewDiv").html(" ");
            var queryData = {
                userId: application.getUserInfo().userid,
                startTime: oldData + " 00:00:00",
                endTime: nowData + " 23:59:59",
                currentPage: this.currentPageNum,
                pageSize : this.eachPageListNum
            };
            this.sendData("/getCreditDetail",queryData,this.callback);
        },
        sendData: function (url, queryData, callback) {
            var _this = this;
            var BaseModel = require('../models/BaseModel');
            var baseModel = new BaseModel();
            var options = {
                type: "POST",
                path: url,
                data: queryData,
                datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
                success: function (data) {

                    if (data.status == '0') {
                        $("#showLoadingMore").remove();
                        if(data.data.pointList!= undefined && data.data.pointList.length > 0){
                            //
                            var json = data.data.pointList;
                            _this.showGetIntegralDetail(json);
                            // me.list.collection.reset(res.data);
                        }else{
                            if (this.currentPageNum == 1){
                                var showLoadingMoreBtnHtml = "<div id='showLoadingMore'>"
                                    +"<div class='nlistview-addmore' id='nlistViewLoadMore'></div>"
                                    +"</div>";
                                $("#creditdetaillistviewDiv").append(showLoadingMoreBtnHtml)

                                $("#nlistViewLoadMore").html('<button class="loadmore" style="display: inline-block;">'+'<div class="label">'+'未查询到相关数据'+'</div><span class="loading-icon"></span></button>');

                            }else{
                                var showLoadingMoreBtnHtml = "<div id='showLoadingMore'>"
                                    +"<div class='nlistview-addmore' id='nlistViewLoadMore'></div>"
                                    +"</div>";
                                $("#creditdetaillistviewDiv").append(showLoadingMoreBtnHtml)

                                $("#nlistViewLoadMore").html('<button class="loadmore" style="display: inline-block;">'+'<div class="label">'+'已加载全部'+'</div><span class="loading-icon"></span></button>');

                            }
                        }
                    } else {
                        var showLoadingMoreBtnHtml = "<div id='showLoadingMore'>"
                            +"<div class='nlistview-addmore' id='nlistViewLoadMore'></div>"
                            +"</div>";
                        $("#creditdetaillistviewDiv").append(showLoadingMoreBtnHtml)

                        $("#nlistViewLoadMore").html('<button class="loadmore" style="display: inline-block;">'+'<div class="label">'+'未查询到相关数据'+'</div><span class="loading-icon"></span></button>');

                    }
                }

            }
            baseModel.loadData(options);
        },

        initData: function(queryData) {
            /*this.listCollection = this.findComponent('myMembersOrderList').collection;
             this.userInfo = window.application.getUserInfo();
             if(!this.userInfo) {
             library.Toast("您尚未登录，请前往登录", 2000);
             window.history.back();
             }

             this.listCollection.loadData({
             //url: this.listCollection.allServiceUrl,
             url:window.app.api+"/getCreditDetail",
             data:queryData,
             needReset: true,
             showLoading: true,
             success: this.onSuccess.bind(this),
             error: this.onError.bind(this)
             });*/

        },
        callback: function( data ) {
            // var _this = this;
            // var ohtml = "";
            if (data.data.pointList.length > 0) {
                var json = data.data.pointList;
                this.showGetIntegralDetail(json);
                // $("#show_nodata_div").hide();
                // for ( var i in data.data.pointList) {
                //     ohtml += "<div class='cdt-detail-cell'><div class='cdt-detail-desc'>"+data.data.pointList[i].desc+"</div><div class='cdt-detail-time'>"+data.data.pointList[i].time+"</div><span class='cdt-detail-point' style='color:#FF6525'>"+data.data.pointList[i].point+"</span></div>"
                // }
                // $("#newdata").html(ohtml);
            }
        },

        /*onError: function() {
         var blankicon = $(
         "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>获取积分失败~</div>"
         );
         $("#show_nodata_div").html("").html(blankicon).show();
         },*/

        /*onResume: function() {
         PageView.prototype.onResume.apply(this,
         arguments);
         this.toggleBar && this.toggleBar('hide');
         this.initData();
         this.toggleBar && this.toggleBar('hide');
         this.$('.bar').show();
         var userinfo = window.application.getUserInfo();
         this.findComponent("creditdetaillistview").collection.loadData({
         //path:"/getCreditDetail",
         path:"/CreditDetailController",
         type:"POST",
         needReset:false,
         data: {
         userId:userinfo.userid,//暂时默认这个号码
         index:1,
         size:10
         },
         success:this.loadSuccess.bind(this),
         error:this.loadError.bind(this)
         });
         },
         loadSuccess:function(data){
         if(data.data.pointList.length > 0){
         $("#show_nodata_div").hide();
         this.findComponent("creditdetaillistview").collection.set(data.data.pointList);
         }else{
         var blankicon = $(
         "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还没有相关积分哟~</div>"
         );
         $("#show_nodata_div").html(blankicon).show();
         }

         },
         loadError:function(){

         }
         }*/
    });
});
