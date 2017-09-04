// 储粮通宝确认订单页
// author Vicent
define(['./PageView', 'require'], function(PageView, require) {
  return PageView.extend({
    type: 'create-order-for-point',

    events: {
      "click #AddressInOrderView": "onChangeAddress",
      "click .header-icon-back": "goback",
      "click .pay-method": "paySelector",
      "click .send-method-order": "sendSelector",
      "click .bill-order-info": "setOrderBillInfo",
      "click .order-submit": "orderSubmit"
    },

    addressModel: null,
    productInfo: null,
    // 订单所需数据集
    orderMap: {},
    initialize: function() {

    },
    onRender: function() {
      /*this.$(".address-in-order").css({
        "padding-top": "1.5rem"
      });*/
    },
    onResume: function() {
         this.toggleBar && this.toggleBar('hide');
      if (window.app.param1) {
        this.addressModel = window.app.param1;
        this.setAddressModel(this.addressModel);
      }else{
        var _this = this;
        var Address = require('../models/AjaxCollection');
        var address = new Address();
        address.loadData({
          path:'/my-address/list',
          type:"POST",
          needReset:true,
          data: {userId:JSON.parse(localStorage.getItem('userinfo')).userid,index:1,size:10},
          success:function(res){
            var Model = address.findWhere({isdefault:"true"});
            _this.addressModel = Model;
            _this.setAddressModel(Model);
          }
        });
      }
      this.productInfo = window.app.shopsOrder;
      this.initData();
      if(window.app.paymode){
          this.$('.pay-method-value').text(window.app.paymode.payWayName);
          console.log(window.app.paymode.payWayName);
      }
      if(window.app.sendmode)
          this.$('.send-method-value').text(window.app.sendmode.sendWayName);
      if(window.app.invoice){
          this.$('.bill-method-value.psb-selector-value').text(window.app.invoice);
      }
      this.$(".address-in-order").css({
      });
    },
    initData: function() {
      if (!this.productInfo) {
        library.Toast("信息出错", 2000);
        window.history.back();
      }
      this.findComponent('OrderShopListView').collection.reset(null);
      this.findComponent('OrderShopListView').collection.reset(this.productInfo);
      this.setShopInfo(this.productInfo);
      console.log(this.productInfo);
    },
    setShopInfo: function(shopInfo) {
      if(!shopInfo){
        library.Toast("订单失效，请重新下单");
        window.history.back();
        return;
      }
      this.setAddressModel(this.addressModel);
      var fee = 0;
      _.each(shopInfo, function(list) {
        for (var i = 0; i < list.items.length; i++) {
          fee = fee + list.items[i].point;
        }
      });
      this.$(".order-fee-info-points-value").text(fee+"分");
      this.$(".order-total-fee-fee").text(fee);
      this.orderMap.orderFee = fee;
    },

    setAddressModel: function(addModel) {
      if(!addModel) return;
      var Model = require('../models/BaseModel');
      var temp = addModel.toJSON();
      var model = new Model(temp);
      model.set('receiverDetailAddress',model.get('receiverProvince')+model.get('receiverCity')+model.get('receiverRegion')+model.get('receiverAddr'));
      this.findComponent('AddressInOrderView').setModel(model,"afterPayment");
      /*$(".address-in-order").css({
        "padding-top": "1.5rem"
      });*/
      console.log(this.addressModel);
    },

    onChangeAddress: function() {
      Backbone.history.navigate('#my-navigate/addressSelect', {
        trigger: true
      });
    },

    goback: function() {
      window.history.back();
    },

    orderOptionsSelector1: null,
    orderOptionsSelector2: null,

    paySelector: function() {
      if (!this.orderOptionsSelector1) {
        var OptionsSelector = require('../components/OrderOptionsSelectorView');
        this.orderOptionsSelector1 = new OptionsSelector();
        this.$el.append(this.orderOptionsSelector1.render().el);
        this.$el.append(this.orderOptionsSelector1.el);
      }
      console.log(this);
      this.orderOptionsSelector1.setOrderOptinos("支付方式",this.orderMap.paySelected,'payselector');
      this.orderOptionsSelector1.callBack = this.paySelectorHandle.bind(this);
      this.orderOptionsSelector1.$el.find('.common-message-cover').show();
      this.orderOptionsSelector1.$el.find('.order-options-content').addClass('order-options-content-show');
    },
    paySelectorHandle: function(selector) {
      $('.pay-method-value').empty().append(selector.name);
      if(!this.orderMap.payInfo) this.orderMap.payInfo = {};
      this.orderMap.payInfo.paywayId = selector.id;
    },

    sendSelectorIndex: null,//选择店铺对应的配送方式
    sendCurrentTarget: null,
    sendSelector: function(e) {
      /*this.sendCurrentTarget = this.$(e.currentTarget);
      this.sendSelectorIndex = this.sendCurrentTarget.parent().index()
      if (!this.orderOptionsSelector2) {
        var OptionsSelector = require('../components/OrderOptionsSelectorView');
        this.orderOptionsSelector2 = new OptionsSelector();
        this.$el.append(this.orderOptionsSelector2.render().el);
      };
        console.log(this.productInfo);
        console.log(this.sendSelectorIndex);
      var shopId = this.productInfo[0].shopId;
      this.orderOptionsSelector2.setOrderOptinos("配送方式", this.productInfo[0].sendwayId, shopId);
      this.orderOptionsSelector2.callBack = this.sendSelectorHandle.bind(this);
      this.orderOptionsSelector2.$el.find('.common-message-cover').show();
      this.orderOptionsSelector2.$el.find('.order-options-content').addClass('order-options-content-show');*/
        Backbone.history.navigate('#my-navigate/paySelector?type=points', {
            trigger: true
        });
    },
    /*sendSelectorHandle: function(selector) {
      $(this.sendCurrentTarget.find('.send-method-value')).empty().append(selector.name);
        console.log(this.productInfo);
      this.productInfo[0].sendwayId = selector.id;
    },
*/
    // 发票信息填写组件
    BillSetting: null,
    setOrderBillInfo: function(e) {
      /*if (!this.BillSetting) {
        var Bill = require('../components/BillEditView');
        this.BillSetting = new Bill();
        this.$el.append(this.BillSetting.render().el);
        this.BillSetting.callBack = this.billHandle.bind(this);
        this.BillSetting.$el.addClass('bill-root-view');
      }
      this.BillSetting.setBillInfo(this.billOptions);
      this.BillSetting.$el.addClass('bill-root-view-show');*/
      // var _this = this;
      // setTimeout(function(){
      //   _this.BillSetting.setBillInfo(this.billOptions);
      //   _this.BillSetting.$el.addClass('bill-root-view-show');
      // },10)
      Backbone.history.navigate('#my-navigate/invoice', {
          trigger: true
      });
    },

    //发票信息结果
    /*billOptions: null,*/
    /*billHandle: function(result) {
      this.billOptions = result;
      if (result) {
        $(".bill-method-value").empty();
        var title = $("<div class='bill-result-title'></div>");
        var content = $("<div class='bill-result-content'></div>");
        var resTitle = result.title;
        if (resTitle && resTitle.length > 4) {
          resTitle = resTitle.substring(0, 4) + "...";
        }
        var resContent = result.content;
        if (resContent && resContent.length > 4) {
          resContent = resContent.substring(0, 4) + "...";
        }
        title.append(resTitle);
        content.append(resContent);
        $(".bill-method-value").append(title).append(content);
      }
    },*/

    /*getMemberInfo: function(){
      var userInfo = window.application.getUserInfo();
      var data = {
        memberId: userInfo ? userInfo.userid : ''
      };
      return data;
    },*/

    /*getShopInfo: function(){
      var shopInfo = this.productInfo;
      for (var i = 0; i <  shopInfo.length; i++) {
        shopInfo[i].sendwayId =  shopInfo[i].sendwayId || "1";
        shopInfo[i].postage = "0";
        shopInfo[i].goodsAmount = this.orderMap.orderFee;
        shopInfo[i].orderAmount = this.orderMap.orderFee;
        shopInfo[i].finallyAmount = this.orderMap.orderFee;
        shopInfo[i].deductionFlag = "0";
        shopInfo[i].remark = this.$('.message').val();
      }
      return shopInfo;
    },*/

    getMemberAddressInfo: function(){
     return {
        "consignee" : this.addressModel.attributes.receiver || "",// 收货人
        "tel" : this.addressModel.attributes.receiverPhone || "",// 电话
        "mobile" : this.addressModel.attributes.receiverPhone,// 手机
        "postCode": this.addressModel.attributes.postCode || "", // 邮编
        "country": "86", // 国家码
        "province": this.addressModel.attributes.receiverProvinceId || "",//省id
        "city": this.addressModel.attributes.receiverCityId || "",// 城市id
        "district": this.addressModel.attributes.receiverRegionId || "",// 县id
        "address" : this.addressModel.attributes.receiverAddr || "" // 街道地址
      }
    },

    orderInfo: null,
    orderSubmit: function(e) {

      //页面上的确认
      // TODO
      // 支付信息
     /* if(!this.orderMap.payInfo || !this.orderMap.payInfo.paywayId){
        library.Toast("请选择支付方式");
      }*/
      // 配送信息检查
      /*for(var i = 0; i < this.productInfo.length; i++){
        if(!this.productInfo[i].sendwayId){
          library.Toast("请选择配送方式");
          return;
        }
      }*/

      // 发票信息
      /*if(this.billOptions){
        this.orderMap.inviceInfo = {
          inviceTitle: this.billOptions.title,
          inviceContent: this.billOptions.content
        }
      }else{// 这里必须要判空，否则后台接口会报错。
        this.orderMap.inviceInfo = {
          inviceTitle: "",
          inviceContent: ""
        }
      }*/

      /*
       * 用户需要填写收货地址
      */
      /*if (this.addressModel) {
        this.orderMap.memberAddressInfo = this.getMemberAddressInfo();
      } else {
        library.Toast('请选择收货地址！',2000);
        return;
      }*/
      /*//店铺信息
      this.orderMap.shopInfo= this.getShopInfo();
      // 用户信息
      this.orderMap.memberInfo = this.getMemberInfo();
       */
      // 初始化请求对象
      if (!this.orderInfo) {
        var OrderInfoModel = require('../models/BaseModel');
        this.orderInfo = new OrderInfoModel();
      }
      // 请求数据
      var receiveId;
      var orderFee;
      var productId = this.productInfo[0].items[0].goodsId;
      var number = this.productInfo[0].items[0].itemNumber;

      if(!window.app.sendmode){
          library.Toast("请选择配送方式！");
          return;
      }
      var sendWayId = window.app.sendmode.sendWayId;

      if (this.addressModel) {
          receiveId = this.addressModel.attributes["addressId"];
          if(!receiveId){
              library.Toast('请选择收货地址！',2000);
              return;
          }
      } else {
          library.Toast('请选择收货地址！',2000);
          return;
      }
      var mark = this.$el.find(".message").val();
      orderFee = this.orderMap.orderFee;
      var data={
          userId : application.getUserInfo().userid,
          productId : productId,
          number : number,
          receiveId : receiveId,
          sendWay : sendWayId,
          mark : mark,
          totalFee : orderFee
      }

      var options = {

        path: "/createPointOrder",
        type: "POST",
        data: data,
        success: this.createOrderSuccess.bind(this),
        error: this.createOrderError,

      };
      this.orderInfo.loadData(options);
    },

    createOrderResult: null,
    createOrderSuccess: function(data) {
      if(data.status == "1" && data.data.notFound){
        library.Toast("请在【会员中心-账户信息】完善身份证信息后使用储粮通宝!");
      }else if(data && data.status == '0'){
        library.Toast('下单成功', 2000);
        this.createOrderResult = data.data;
        Backbone.history.navigate('#home-navigate', {
            trigger: true
        });
        /*this.preparePay();*/
      }else{
        library.Toast(data ? data.message : '下单失败，请稍后再试', 2000);
      }
    },
    createOrderError: function() {
      library.Toast('下单失败，请稍后再试', 2000);
    },

    // 准备支付，获取支付工单--银联订单流水号
   /* preparePay: function(){
      var Model = require('../models/PayModel');
      var payModel = new Model();
      payModel.startPay(this.createOrderResult.parentOrderCode,this.payHandle.bind(this),"/pay/getTradeNoByParent");
    },*/
    // 支付成功回调
    // res ： {code:0,msg:'支付成功'}
    // code: 0表示支付成功，其他表示失败
    /*payHandle: function(res){
      if(res){
        if(res.code == 0){
          library.Toast("支付成功");
        }else{
          library.Toast(res ? res.msg : "支付失败");
        }
      }else{
        library.Toast("支付失败");
      }
      var orderId = this.createOrderResult.orderIds[0];
      Backbone.history.navigate("#my-navigate/order-detail?" + orderId, {
        trigger: true
      });
    },*/

  });
});
