// 确认订单页
// author Vicent
define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        type: 'create-order',
        events: {
            "click #AddressInOrderView": "onChangeAddress",
            "click .header-icon-back": "goback",
            "click .pay-method": "paySelector",
            "click .send-method-order": "sendSelector",
            "click .bill-order-info": "setOrderBillInfo",
            "click .order-submit": "orderSubmit",
            'click .coupon-selector': "couponSelector",
            'click .credit-card': "creditSelector",
            'click .credit-card2': "creditSelector",
            "click .icomoon-moremore": "menuMore",
            "focus .message": "mesFocus",
            "click .icomoon-plus": "plusClick",
            "click .icomoon-minus": "reduceClick",
            //积分使用是和取消
            "click .usePointD": "usePointD",
            "click .canclePonitD": "canclePonitD",
        },
        usePoint:0,
        addressModel: null,
        productInfo: null,
        pointInfo: null, //积分信息
        gcfNum:1,
        dealerintegral:null,
        htintegral:null,
        integrall:null,
        flag:null,
        mesFocus: function(e) {
        	//console.log(this.$(".create-order")[0]);
            this.$(".create-order")[0].scrollTop = e.target
                .offsetTop;
        },
        // 订单所需数据集
        orderMap: {},
        initialize: function() {
            //监听
            this.listenTo(this.findComponent('PopupMenu'), "toSearch", this.toSearch.bind(this));
        },
        
        //使用积分抵扣项
        
        usePointD:function(){
        	
        	if(this.flag == undefined){
        		this.flag=0;
        	}
        	this.flag--;     	
        	///$(this).css("border","1px solid red")
        	console.log(this.productInfo);
        	var totalPriceNum=this.productInfo.totalPrice;
        	if(totalPriceNum==undefined){
        		
        		totalPriceNum=this.productInfo[0].items[0].totalPrice;
        	}
        	console.log(totalPriceNum);
        	
        	var usePd= this.pointInfo.m;
        	console.log(this.pointInfo);
        	
        	var useRd=this.pointInfo.n;
        	console.log(useRd);
        	
        	var reduceMoney=this.$el.find("#thisUsePoint").val();
        	console.log(reduceMoney);
        	if(reduceMoney == null){
        		reduceMoney = 0;
        	}
        	if(!reduceMoney){
                library.Toast('请输入您需要使用的积分');
                return;
            } else if(reduceMoney>window.app.availableIntegral){
          		 library.Toast("不能大于可使用积分");
                this.$el.find("#thisUsePoint").val('');
                $(".order-total-fee-fee")
                   .text(window.app.totalprice);
          		 return;
          	} /*else if(reduceMoney%1000!=0 && reduceMoney!=0){
        		library.Toast("使用积分必须是1000的倍数");
                this.$el.find("#thisUsePoint").val('');
        		return;
        	}*/else {
                this.usePoint=reduceMoney;
            }
        	var usePointD=((reduceMoney/usePd)*useRd);
        	console.log(usePointD);
        	
        	var tp=(totalPriceNum-usePointD).toFixed(3).toString();
        	console.log(tp);
        	
        	window.app.totalprice = this.productInfo.totalPrice;
        	if(tp.indexOf('.')>0){
        		$(".order-total-fee-fee").text(tp.substr(0,tp.indexOf('.')+3));
        		window.app.orderFee = tp.substr(0,tp.indexOf('.')+3);
        	}else{
        		$(".order-total-fee-fee").text(tp);
        		window.app.orderFee = tp;
        	};
        	this.orderMap.orderFee= window.app.orderFee;
        	console.log(tp.substr(0,tp.indexOf('.')+3));
        	//this.jifen2Data();

        },
                
      //不使用积分抵扣项
        canclePonitD:function(){
        	if(this.flag == undefined){
        		this.flag=0;
        	}
        	this.flag--;
        	//this.$el.find(".acquirePointDetail").empty();
        	$(".thisUsePoint").val("");
            this.usePoint=0;
        	//var totalPriceNum=this.$el.productInfo[0].totalPrice.toString();
        	window.app.totalprice = this.productInfo.totalPrice;
        	window.app.orderFee = window.app.totalprice;
        	$(".order-total-fee-fee").text(window.app.totalprice);
        	/*if(totalPriceNum.indexOf('.')>0){
        		$(".order-total-fee-fee").text(totalPriceNum.substr(0,totalPriceNum.indexOf('.')+3));
        		this.productInfo[0].totalPrice = totalPriceNum.substr(0,totalPriceNum.indexOf('.')+3);
        	}else{
        		$(".order-total-fee-fee").text(totalPriceNum);
        		this.productInfo[0].totalPrice = tptotalPriceNum;
        	};*/
        	//this.jifen2Data();
        },
        //点击更多
        menuMore: function(e) {
            this.findComponent("PopupMenu").show();
        },
        //点击搜索
        toSearch: function(e) {
            this.findComponent("SearchMidPageView").show();
        },

        plusClick: function() {
            if(this.gcfNum > 1) {
                return;
            }
            this.gcfNum++;
            this.gcfChange();
        },
        reduceClick: function() {
            if(this.gcfNum > 1) {
                this.gcfNum--;
            }
            this.gcfChange();
        },
        // 团购众筹份数变化
        gcfChange: function() {
            console.log(this.gcfNum);
            this.$(".group-cf-text").text(this.gcfNum);
            this.productInfo[0].items[0].itemNumber = this.gcfNum;
            this.setProductInfo();
            this.setOrderFee();
        },
        onResume: function() {
        	//本次使用积分
        	this.$el.find("#thisUsePoint").val('');
        	//清空本单获得积分
        	//this.$el.find(".acquirePointDetail").empty();
        	this.$('.confirm-order-goods').hide();
            this.toggleBar && this.toggleBar("hide");
            var sendwayname=localStorage.getItem('sendwayName');
            var sendwayid=localStorage.getItem('sendwayId');
            console.log(window.app.param1);
            // 收货地址选择
            if(window.app.param1) {
            	console.log(window.app.param1);
                this.addressModel = window.app.param1;
                this.setAddressModel(this.addressModel);
                console.log(this.setAddressModel(this.addressModel));
            } else {
                // 获取默认地址
                var info = window.application.getUserInfo();
                console.log(info);
                var _this = this;
                var Address = require('../models/AjaxCollection');
                var address = new Address();
                address.loadData({
                    path: '/my-address/list',
                    type: "POST",
                    needReset: true,
                    data: {
                        userId: JSON.parse( localStorage.getItem( 'userinfo')) .userid,
                        //userId: info.userid;
                        index: 1,
                        size: 10
                    },
                    success: function(res) {
                        var Model = address.findWhere({
                            isdefault: "true"
                        }) || address.models[
                            0];
                        _this.addressModel = Model;
                        _this.setAddressModel(Model);
                    }
                });
            }
            console.log(window.app);
            //从上个页面传递订单信息过来
            this.productInfo = window.app.shopsOrder;
            //订单类型
            this.orderType = window.app.createOrderType;
            if(this.orderType == "10200"){
            	this.setPackageInfo();
            }
            // 支付方式
            /*if(window.app.paymode) {
                this.orderMap.paymode = window.app.paymode
                this.$('.pay-method-value')
                    .text(window.app.paymode.payWayName);
                window.app.paymode = null;
            }*/
            // 配送方式
            if(window.app.sendmode) {
            	console.log(window.app.sendmode);
                this.orderMap.sendmode = window.app.sendmode;
                this.$('.send-method-value').text(window.app.sendmode.sendWayName);
                window.app.sendmode = null;
            }
            //this.$('#point-send-value').text(sendwayname);
            // 发票信息
            if(window.app.invoice) {
                this.orderMap.invoice = window.app.invoice;
                this.billHandle(window.app.invoice);
                window.app.invoice = null;
            } else {
                this.orderMap.invoice = {};
                this.billHandle();
            }
            //初始化数据
            this.initData();
            //积分
            this.$(".thisUsePoint").val("");
            this.usePoint=0;
            window.app.totalprice = this.productInfo[0].totalPrice;
			window.app.orderFee = window.app.totalprice;
			$(".order-total-fee-fee").text(window.app.totalprice);
            
            this.jifenData();
            
            
        },
        
        useBackjifen:function(){
        	var reduceMoney=$(".thisUsePoint").val();
        	if(reduceMoney>0){
        		this.usePointD();
        	}
        },
        
        jifenData:function(){
        	console.log(window.app.shopsOrder);
        	console.log(window.app.shopsOrder.length);
        	console.log(window.application.getUserInfo());
        	console.log(window.app.shopsOrder[0].packageNumber);
          	 //积分抵扣
              //不同商品传入不同id   
          	var _this = this;
              var goodsIds ="";
              var goodsNums ="";
              for(var i = 0; i < window.app.shopsOrder.length; i++) {
            	  if(window.app.shopsOrder[i].items){
            		  var inputSuitNumber=window.app.shopsOrder[i].items[0].inputSuitNumber ?window.app.shopsOrder[i].items[0].inputSuitNumber : "";
            		  goodsIds+=","+window.app.shopsOrder[i].items[0].goodsId;
            		  goodsNums+=","+window.app.shopsOrder[i].items[0].itemNumber;
            	  }else{
            		  var  suitsId=window.app.shopsOrder[0].packageId;
            		  var  suitsNum=window.app.shopsOrder[0].packageNumber;
            	  }             	                                                   
              }
              var Models = require('../models/BaseModel');
              var rechargeModel = new Models();
              var memberID=window.application.getUserInfo().userid;
              console.log(this.addressModel);
              var receiverRegionId=localStorage.getItem('receiverRegionId');
              goodsIds=goodsIds.slice(1,goodsIds.length);
              goodsNums=goodsNums.slice(1,goodsNums.length);
              console.log(goodsIds);
              console.log(goodsNums);
             //积分抵扣请求
              var option = {
                  path: '/integralDeduction',//queryIntegralrule
                  type: 'POST',
                  showLoading:true,
                  data: {
                	  goodsId:goodsIds,
                	  goodsNum:goodsNums,
                       memberId:memberID,
                       suitsId:suitsId,
                       suitsNum:suitsNum,
                     districtId:receiverRegionId
                     
                  },
                  success: function (res) {
                	  console.log(res.data);
                	  if(res.data.integralFlag=="N"){
                		  $(".aboutPoint").hide();
                	  }else{
                		  $(".aboutPoint").show();
                	  }
                	  console.log(res);
                	  console.log(res.data[0]);
                	  
                      _this.pointInfo = res.data;
                      var aboutPointCurrent=res.data;
                      var reduceMoney=$(".thisUsePoint").val();
                      //var useReduce=reduceMoney/aboutPointCurrent.m;
                     $(".currentPoint").text(aboutPointCurrent.integral);//您有积分
                      $(".usePointMoney").text(aboutPointCurrent.availableIntegral);//本次可用积分                      
                      window.app.availableIntegral=aboutPointCurrent.availableIntegral;
                      if(aboutPointCurrent.availableIntegral==0){
                      	$(".thisUsePoint").attr("disabled", "true");
                      }else{
                      	$(".thisUsePoint").attr("disabled", false);
                      };
                      $(".rdMoney").text(aboutPointCurrent.availableMoney);//可抵扣钱数                   
                      $(".thisUsePoint").val();//本次使用积分                    
                      $(".aboutPointUse").text(aboutPointCurrent.m);//每m积分                    
                      $(".aboutMoneyReduce").text(aboutPointCurrent.n);//每m积分可以抵扣钱数
                      if(aboutPointCurrent.n==0){
                      	 $(".order-total-fee-fee").text(aboutPointCurrent.orderTotalMoney);
                      }
                      //_this.jifen2Data();
                      
                  },
                  error: function () {                   
                      library.Toast("错误");
                     // _this.jifen2Data();
                  }
              }
              console.log(JSON.stringify(option));
              rechargeModel.loadData(option);
              
          },
          
          jifen2Data:function(){
           	 //积分抵扣请求
           	//if(this.flag==0){
           	//   return;
           	//}
     			//this.flag--;
           	var _this = this;
           	 var goodsList=[]
                for(var i = 0; i < window.app.shopsOrder.length; i++) {
                	
                    var inputSuitNumber=window.app.shopsOrder[i].items[0].inputSuitNumber ?window.app.shopsOrder[i].items[0].inputSuitNumber : '';
                    
                    var listItem = {};
                    listItem.cartId=window.app.shopsOrder[i].items[0].cartId;
                    listItem.goodsId=window.app.shopsOrder[i].items[0].goodsId;
                    listItem.itemNumber=window.app.shopsOrder[i].items[0].itemNumber;
                    listItem.goodsSn = window.app.shopsOrder[i].items[0].goodsSn;
                    listItem.tradePrice = window.app.shopsOrder[i].items[0].tradePrice;
                    listItem.totalPrice = window.app.shopsOrder[i].items[0].totalPrice;
                    goodsList.push(listItem);
                }
           	var Models = require('../models/BaseModel');
               var rechargeModel = new Models();
               var userID=window.application.getUserInfo().userid;
               //var PayFee= $(".order-total-fee-fee")[0].innerText;
               var PayFee = window.app.orderFee;
               var GoodsAmount= $(".total-price-num")[0].innerText
               var option1 = {
                   path: '/queryIntegral',
                   type: 'POST',
                   showLoading:true,
                   data: {
                       userId:userID ,
                       goodsList:goodsList,
                       GoodsAmount:GoodsAmount,
                       PayFee:PayFee
                   },
                   success: function (res) {
                   	
                       if(res.status=="0"){
                          //console.log( res.data[0]);
                          var integralldata=res.data[0];
                          _this.dealerintegral = integralldata.dealerintegral;
                          _this.htintegral = integralldata.htintegral;
                          _this.integrall = integralldata.integrall;
                         
                          _this.$el.find(".acquirePointDetail").text(integralldata.integrall);//当前积分
                          $("#loading").hide();
                       }
                   },
                   error: function () {                   
                       library.Toast("错误");
                       number=2;
                       $("#loading").hide();
                   }
               }
               //console.log(JSON.stringify(option1));
               rechargeModel.loadData(option1);
           },
        
        initData: function() {
            //订单数据为空
            if(!this.productInfo) {
                library.Toast("信息出错", 2000);
                window.history.back();
                return;
            }
            //设置地址
            this.setAddressModel(this.addressModel);
            //设置商品信息
            this.setProductInfo();
        },
        setPackageInfo:function(){
        	this.$(".package-hidden").hide();
        	this.$("#packageImg").attr("src",this.productInfo[0].IMG_URL);
        	this.$(".package-list-title").text(this.productInfo[0].SUIT_TITLE);
        	this.$("#desc").text(this.productInfo[0].REMARK);
        	this.$(".package-list-money").text("￥"+this.productInfo[0].SALE_PRICE);
        	this.$(".goods-order-number").text("x"+this.productInfo[0].packageNumber);
        	this.$('.confirm-order-goods').show();
        },
        
        setProductInfo: function() {
            var _this = this;
            //修改为接口请求
            var packageList = [];
            var goodsList = [];
            for(var i = 0; i < _this.productInfo.length; i++) {
                //可能是套餐，可能是购物车
                var item = _this.productInfo[i]
                    //存在套餐ID，是套餐
                if(item.packageId) {
                    var packageItem = {};
                    packageItem.packageId = item.packageId;
                    packageItem.number = item.packageNumber;
                    packageList.push(packageItem);
                } else {
                    var goodsItem = {};
                    for(var j = 0; j < item.items.length; j++) {
                        var goods = item.items[j];
                        goodsItem.goodsId = goods.goodsId;
                        goodsItem.number = goods.itemNumber;
                        if(goods.cartId) {
                            goodsItem.cartId = goods.cartId;
                        }
                        goodsList.push(goodsItem);
                    }
                }
            }
            var productInfo = {};
            productInfo.packageList = packageList;
            productInfo.goodsList = goodsList;
            var userinfo = JSON.parse(localStorage.getItem( 'userinfo'));
            productInfo.userId = userinfo.userid;
            var Model = require('../models/BaseModel');
            var productModel = new Model();
            var options = {
                url: window.app.api + '/preOrderInfo',
                type: "POST",
                needReset: true,
                data: productInfo,
                success: function(res) {
                    library.DismissLoadingBar();
                    if(res.status == '0') {
                        _this.productInfo = res.data;
                        //console.log(_this.productInfo)
                        //套餐商品
                        if(productInfo.packageList.length) {
                            var list = [];
                            var listItem = {};
                            listItem.items = res.data .goodsList;
                            list.push(listItem);
                            //不是套餐商品
                        } else {
                            var list = [];
                            for(var i = 0; i < res.data .goodsList.length; i++ ) {
                                var listItem = {
                                    items: []
                                };
                                listItem.items.push(res.data.goodsList[i]);
                                list.push(listItem);
                            }
                        }
                        //重置给列表
                        _this.findComponent('CreateOrderListView').collection.reset(list);
                        //设置订单类型
                        _this.setOrderType();
                        _this.setOrderFee();
                    } else {
                        library.Toast(res && res.message ?
                            res.message :
                            "获取商品信息失败");
                    }
                },
                error: function() {
                    library.DismissLoadingBar();
                    library.Toast('网络错误');
                }
            };
            productModel.loadData(options);
        },
        setOrderType: function() {
            //屏蔽优惠券
            this.$(".order-discount-info-view").hide();
            if(this.orderType == 5) { // 团购
                this.$(".group-cf-operation") .show();
                this.$(".roup-cf-left") .text("份数（限购2份）");
                this.$(".cf-reward-info") .hide();
                this.$(".order-message") .hide();
                this.$(".goods-details-description") .hide();
                this.$(".goods-details-price") .hide();
                this.$(".goods-details-title") .css({ "margin-right": "1rem" });
                this.$(".goods-details-listitem")
                    .append(
                        "<span style='position:absolute;right:10px;top:0.37333333rem;'>" +
                        this.$(".goods-details-number")
                        .text() + "</span>")
                    .append(
                        "<div style='position:absolute;left:3.30666667rem;top:1.97333333rem;font-size:0.37666667rem;color:#666666;margin-right:10px'>感谢您的支持,您将用低于商品原价的价格购买</div>"
                    );
                this.setDiscountStatus();
            } else if(this.orderType == 6) { // 众筹
                this.$(".group-cf-operation") .show();
                this.$(".roup-cf-left") .text("数量");
                this.$(".cf-reward-info").show();
                this.setDiscountStatus();
            } else {
                //普通商品商品
                if(this.productInfo.isSuit != '1'){
                    this.initDiscountInfo();
                    this.$(".order-discount-info-view").show();
                }
                this.$(".group-cf-operation") .hide();
                this.$(".cf-reward-info") .hide();
                this.$(".pay-send-selector") .show();
                this.setDiscountStatus(true);
            }
        },
        //初始化优惠券
        initDiscountInfo: function() {
            collection = this.findComponent("CouponView") .collection;
            // FIXME userid
            var options = {
                path: "/getCouponList",
                type: "POST",
                needReset: false,
                data: {
                    userId: application.getUserInfo() .userid,
                    type: "2",
                    index: 1,
                    size: 10
                },
                success: function(data) {
                    if(data.status == "0" && data.data .pageCount > 0) {
                        collection.reset(data.data.couponList);
                        this.$( ".order-discount-info-view" ) .show();
                    }
                }.bind(this),
                error: function(e) {}
            }
            collection.loadData(options);
        },
        setDiscountStatus: function(status) {
            if(status) {
                //优惠信息
                this.$(".discount-detail") .show();
                //使用优惠券
                this.$(".use-coupon-item") .show();
                //使用礼品卡
                this.$(".use-credit-card") .show();
            } else {
                this.$(".discount-detail") .hide();
                this.$(".use-coupon-item") .hide();
                this.$(".use-credit-card") .hide();
            }
        },
        //设置订单金额
        setOrderFee: function() {

            //console.log( this.productInfo);
            var fee=0;
            //合计等于商品金额减去优惠价加上运费
            var fee =Number(this.productInfo.totalPrice)-Number(this.productInfo.discountPrice)+ Number(this.productInfo.freightPrice)
            	/*parseInt(this.productInfo.totalPrice)
                    - parseInt(this.productInfo.discountPrice)
                    + parseInt(this.productInfo.freightPrice);*/
            //设置合计
            $(".order-total-fee-fee").text(fee);
            //设置商品金额
            $(".total-price-num").text('¥' + this.productInfo.totalPrice + '');
            //设置运费
            var a=this.productInfo.freightPrice;
            if(a>0){
            	$('.total-freight').text('¥' + a).fixed();
            }else{
            	var b=parseInt(a);
            $('.total-freight').text('¥' + b);}
            //设置活动这块
            $('.total-discount').text('-¥' + this.productInfo.discountPrice);
            //设置活动信息
            $('.discount-detail').text(this.productInfo.discountInfo);
            this.orderMap.orderFee = fee;
        },
        setAddressModel: function(addModel) {
            if(!addModel) return;
            var Model = require('../models/BaseModel');
            var temp = addModel.toJSON();
            localStorage.setItem('receiverRegionId',temp.receiverRegionId);
            var model = new Model(temp);
            model.set('receiverDetailAddress', model.get(
                'receiverProvince') + model.get(
                'receiverCity') + model.get(
                'receiverRegion') + model.get(
                'receiverAddr'));
            this.findComponent('AddressInOrderView')
                .setModel(model, "afterPayment");
        },
        onChangeAddress: function() {
            Backbone.history.navigate(
                '#home-navigate/addressSelect', {
                    trigger: true
                });
        },
        goback: function() {
            window.history.back();
        },
        //选择配送方式
        sendSelector: function(e) {
            Backbone.history.navigate(
                '#home-navigate/distributionMode', {
                    trigger: true
                });
        },
        // 发票信息填写组件
        BillSetting: null,
        setOrderBillInfo: function(e) {
            Backbone.history.navigate(
                '#home-navigate/invoice', {
                    trigger: true
                });
        },
        billHandle: function(result) {
            if(result && result.title) {
                $(".bill-method-value")
                    .empty();
                var title = $(
                    "<div class='bill-result-title'></div>"
                );
                var content = $(
                    "<div class='bill-result-content'></div>"
                );
                var resTitle = result.title;
                /*if (resTitle && resTitle.length > 4) {
                  resTitle = resTitle.substring(0, 4) + "...";
                }*/
                var resContent = result.content;
                /*if (resContent && resContent.length > 4) {
                  resContent = resContent.substring(0, 4) + "...";
                }*/
                title.append(resTitle);
                content.append(resContent);
                $(".bill-method-value")
                    .append(title)
                    .append(content);
            } else {
                $(".bill-method-value")
                    .text("不需要")
            }
        },
        //使用优惠券
        couponSelector: function(e) {
            var view = $(e.currentTarget);
            var str = "theme-color";
            var className = view.find(".order-checkbox")
                .attr("class");
            /*var couCollec = this.findComponent("CouponView").collection.models[0];*/
            var inNum = parseFloat(view.find(
                    ".order-money-num")
                .attr("favor-num"));
            var cid = view.find(".order-money-num")
                .attr("data-index");
            /*if(className.indexOf(str)>=0){
              view.find(".order-checkbox")
                .removeClass("theme-color")
                .removeClass("icomoon-choice")
                .addClass("icomoon-choicebox");
              this.orderMap.orderFee += inNum;
              if(!this.orderMap.coupon){
                this.orderMap.coupon = [];
              }
              var index = this.orderMap.coupon.indexOf(cid);
              if(index > -1){
                this.orderMap.coupon.splice(index,1);
              }

            }
            else{
              view.find(".order-checkbox")
                .addClass("theme-color")
                .addClass("icomoon-choice")
                .removeClass("icomoon-choicebox");
              this.orderMap.orderFee -= inNum;
              if(!this.orderMap.coupon){
                this.orderMap.coupon = [];
              }
              this.orderMap.coupon.push(cid);
            }*/
            //优惠券只能用一张
            if(className.indexOf(str) >= 0) {
                view.find(".order-checkbox")
                    .removeClass("theme-color")
                    .removeClass("icomoon-choice")
                    .addClass("icomoon-choicebox");
                this.orderMap.orderFee += inNum;
                if(!this.orderMap.coupon) {
                    this.orderMap.coupon = [];
                }
                var index = this.orderMap.coupon.indexOf(
                    cid);
                if(index > -1) {
                    this.orderMap.coupon.splice(index, 1);
                }
            } else {
                if($(".order-checkbox")
                    .hasClass("theme-color")) {
                    var obj = this.$el.find(
                            ".icomoon-choice")
                        .parent()
                        .find('.order-money-num');
                    var lastCount = parseFloat(obj.attr(
                        'favor-num'));
                    var lastCid = obj.attr("data-index");
                    if(!this.orderMap.coupon) {
                        this.orderMap.coupon = [];
                    }
                    var index = this.orderMap.coupon.indexOf(
                        lastCid);
                    if(index > -1) {
                        this.orderMap.coupon.splice(index,
                            1);
                    }
                    this.orderMap.orderFee += lastCount;
                }
                /*if(inNum>this.orderMap.orderFee){
                    library.Toast("此商品不能使用该优惠券！");
                    return;
                }*/
                $(".order-checkbox")
                    .removeClass("theme-color")
                    .removeClass("icomoon-choice")
                    .addClass("icomoon-choicebox");
                view.find(".order-checkbox")
                    .addClass("theme-color")
                    .addClass("icomoon-choice")
                    .removeClass("icomoon-choicebox");
                var temp = this.orderMap.orderFee - inNum;
                this.orderMap.orderFee = parseFloat(temp.toFixed(
                    1));
                if(!this.orderMap.coupon) {
                    this.orderMap.coupon = [];
                }
                this.orderMap.coupon.push(cid);
            }
            if(this.orderMap.orderFee < 0) {
                $(".order-total-fee-fee")
                    .empty()
                    .append(0);
            } else {
                $(".order-total-fee-fee")
                    .empty()
                    .append(this.orderMap.orderFee);
            }
        },
        //使用礼品卡
        creditSelector: function(e) {
            var view = $(e.currentTarget);
            var str = "theme-color";
            var creCollec = this.findComponent(
                    "CreditCardView")
                .collection;
            var className = view.find(".order-checkbox")
                .attr("class");
            var inNum = parseFloat(view.find(
                    ".order-money-num")
                .attr("card-value"));
            var cid = view.find(".order-money-num")
                .attr("data-index");
            if(className.indexOf(str) >= 0) {
                view.find(".order-checkbox")
                    .removeClass("theme-color")
                    .removeClass("icomoon-choice")
                    .addClass("icomoon-choicebox");
                this.orderMap.orderFee += inNum;
            } else {
                view.find(".order-checkbox")
                    .addClass("theme-color")
                    .addClass("icomoon-choice")
                    .removeClass("icomoon-choicebox");
                this.orderMap.orderFee -= inNum;
                var index = this.orderMap.coupon.indexOf(
                    cid);
                if(index > -1) {
                    this.orderMap.coupon.splice(index, 1);
                }
            }
            $(".order-total-fee-fee")
                .empty()
                .append(this.orderMap.orderFee);
        },
        getMemberInfo: function() {
            var userInfo = window.application.getUserInfo();
            var data = {
                memberId: userInfo ? userInfo.userid : ''
            };
            return data;
        },
        getShopInfo: function() {
            var shopInfo = this.productInfo;
            for(var i = 0; i < shopInfo.length; i++) {
                shopInfo[i].sendwayId = shopInfo[i].sendwayId ||
                    "1";
                shopInfo[i].postage = "0";
                shopInfo[i].goodsAmount = this.orderMap.orderFee;
                shopInfo[i].orderAmount = this.orderMap.orderFee;
                shopInfo[i].finallyAmount = this.orderMap.orderFee;
                shopInfo[i].deductionFlag = "0";
                shopInfo[i].remark = this.$('.message')
                    .val();
            }
            return shopInfo;
        },
        getMemberAddressInfo: function() {
            return {
                "consignee": this.addressModel.attributes.receiver ||
                    "", // 收货人
                "tel": this.addressModel.attributes.receiverPhone ||
                    "", // 电话
                "mobile": this.addressModel.attributes.receiverPhone, // 手机
                "postCode": this.addressModel.attributes.postCode ||
                    "", // 邮编
                "country": "86", // 国家码
                "province": this.addressModel.attributes.receiverProvinceId ||
                    "", //省id
                "city": this.addressModel.attributes.receiverCityId ||
                    "", // 城市id
                "district": this.addressModel.attributes.receiverRegionId ||
                    "", // 县id
                "address": this.addressModel.attributes.receiverAddr ||
                    "" // 街道地址
            }
        },
        toPaySelector: function() {
            if(!this.createOrderResult) {
                return;
            }
            this.createOrderResult.addressModel = this.addressModel;
            this.createOrderResult.productInfo = this.productInfo;
            // FIXME
            this.orderMap.orderInfo = this.createOrderResult;
            window.app.createOrderResult = this.orderMap;
            //if(this.orderMap.paymode.payWayId == "线下支付"){
            //   var orderid = this.createOrderResult.orderIds[0];
            //   Backbone.history.navigate("#home-navigate/afterPayment?orderid="+orderid, {
            //     trigger: true
            //   });
            //   return;
            // }
            console.log($(".order-total-fee-fee").text());
            var intNumAbout=Math.ceil(Number($("#order-total-fee-fee-sum").text()))
            console.log(intNumAbout);
           // 如果金额为零，直接跳转支付成功页面
            if(intNumAbout=="0"){
            	window.app.createOrderResult = this.orderMap;              
              Backbone.history.navigate("#home-navigate/afterPayment",{
       	       trigger:true
                  });
            }else{
            	Backbone.history.navigate(
                        '#my-navigate/payMode', {
                            trigger: true,
                            replace: true
                        });
            }
            
            
            /*//type=1时是普通商品
            Backbone.history.navigate(
                '#my-navigate/payMode', {
                    trigger: true,
                    replace: true
                });*/
        },
        onRemove: function() {
            this.orderMap = {};
            this.createOrderResult = null;
        },
        orderInfo: null,
        isWeiXin: function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        orderSubmit: function(e) {
            var receiveId;
            var orderFee;
            var source;
            console.log(this.addressModel);
            if(this.addressModel) {
                receiveId = this.addressModel.attributes[
                    "addressId"];
                if(!receiveId) {
                    library.Toast('请选择收货地址！', 2000);
                    return;
                }
            } else {
                library.Toast('请选择收货地址！', 2000);
                return;
            }
            // if(!this.orderMap.paymode){
            //   library.Toast("请选择支付方式");
            //   return;
            // }
             if(!this.orderMap.sendmode){
	               library.Toast("请选择配送方式");
	               return;
             }
            if(!this.orderMap.invoice) {
                this.orderMap.invoice = {};
            }
            if(this.orderMap.orderFee < 0) {
                orderFee = 0;
            } else {
                orderFee = this.orderMap.orderFee;
            }
            if(this.isWeiXin()){
                source = 3;
            }else{
                source = 2;
            }
            var data = {
                userId: application.getUserInfo().userid,
                createrId: application.getUserInfo().userid,
                createrType: 2,
                orderSource: source,
                receiveId: receiveId,
                payWay: "",
                sendWayId:this.orderMap.sendmode.sendWayId,
                billInfo: {
                    billTitle: this.orderMap.invoice.title,
                    billContent: this.orderMap.invoice.content
                },
                mark: this.$(".message") .val(),
                giftCartIds: "",
                points: this.$("#thisUsePoint").val(),
                totalFee: orderFee
            };
            if(this.orderMap.coupon) {
                data.discountIds = this.orderMap.coupon.join(",");
            }
            if(this.productInfo.suitId) { //套餐订单
                data.packageId = this.productInfo.suitId;
                data.packageNumber = this.productInfo.suitNumber;
            } else { //普通订单
                var productList = [];
                var goodsArr = this.productInfo.goodsList;
                for(var i = 0, j =  goodsArr.length; i < j; i++) {
                    var _item = goodsArr[i];
                    productList.push({
                        productId: _item.goodsId,
                        number: _item.number,
                        cartId: _item.cartId || "",
                        specId: ""
                    });
                }
                
                data.productList = productList;
            }
            // 初始化请求对象
            if(!this.orderInfo) {
                var OrderInfoModel = require(
                    '../models/OrderInfoModel');
                this.orderInfo = new OrderInfoModel();
            }
            var options = {
                path: "/ceateOrder",
                type: "POST",
                data: data,
                showLoading: true,
                success: this.createOrderSuccess.bind(this),
                error: this.createOrderError.bind(this)
            }
            this.orderInfo.loadData(options);
        },
        createOrderResult: null,
        createOrderSuccess: function(data) {
        	//console.log(data);
            if(data && data.status == '0') {
                library.Toast('下单成功', 2000);
                this.createOrderResult = data.data;
                this.toPaySelector();
            } else {
                library.Toast(data ? data.message : '下单失败，请稍后再试', 2000);
            }
        },
        createOrderError: function(e) {
            library.Toast('下单失败，请稍后再试', 2000);
        },
        //测试使用
        getTestOrderResult: function() {
            this.createOrderResult = {
                orderIds: ["0100F1K0E2V80VN3EHRQ"],
                parentOrderCode: "010071K092VX0VN3SHRI"
            };
        }
    });
});
