//支付配送页
define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'paySelector',
    events:{
          'click .header-icon-back': 'onBack',
          'click .btn-sure': 'onSave',
          'click .icomoon-moremore': 'menuMore',
          //'click .sender-select-item': 'itemChoose',
          'click .h-span-left': 'goBack',
          'click .send-mode':'sendMode',
          'click .send-list-mode':'sendListMode'
    },
    paymode : {},
    sender : null,
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    onRender:function(){
      var urlStr = location.href;
      var type = urlStr.substr(urlStr.indexOf("=")+1,urlStr.length-urlStr.indexOf("="));
      if(type=="points"){
          this.$('.title').text("选择配送方式");
      }
      else{
          this.$('.title').text("选择配送方式");
          this.$(".points-only").hide();
      }

    },
    onResume: function(){
    	var _this=this;
    	this.$(".send-service").hide();
    	var userInfo = window.application.getUserInfo();
		var userid = userInfo ? userInfo.userid : "";
        var chtml="",
            ohtml="",
            lhtml="";
    //var receiverRegionid=localStorage.getItem('receiverRegionId');
        var options={
            //district:receiverRegionid,//receiverRegionid
            userid:userid
        }
         $.ajax({
                url: window.app.api + "/getAgency?t=" + new Date().getTime(),
                data: JSON.stringify(application.getSignData(options)),
                type: "POST",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    console.log(data);
                    $.each(data.data,function(i,item){
                    	 if(data.data[i].sendWayName == "商城配送"){
                    		 var sendmode={};
                             sendmode.sendWayName=data.data[i].sendWayName;
                             sendmode.sendWayId=data.data[i].sendWayId;
                             window.app.sendmode=sendmode;
                    		 chtml+="<div class='send-mode theme-color theme-border-color' data-id='"+data.data[i].sendWayId+"'>"+data.data[i].sendWayName+"</div>";
                    	 }else{
                    		 chtml+="<div class='send-mode' data-id='"+data.data[i].sendWayId+"'>"+data.data[i].sendWayName+"</div>";
                    	 }
                        if(data.data[i].dealerList){
                            var arr=data.data[i].dealerList[0];
                            _this.$(".send-name-phone").text(arr.recommended+"("+arr.referenceidentity+")"+"  "+arr.referencephone)
                            _this.$(".send-name-address").text(arr.referenceaddress)
                        }
                        
                    })
                    //$(".send-list").html(lhtml);
                    $(".send-select").html(chtml);
                },
                error: function () {
                    library.Toast("网络请求出错，请重试！")
                }
            })
     /* this.$(".main-payment").show();
      this.$("#SenderSelect").hide();     //渠道机构配送
      this.toggleBar && this.toggleBar("hide");
      this.$('.bar').show();
      if(this.sender){
        this.$(".sender-choose").text(this.sender);
      }
      if(window.app.paymode && window.app.sendmode){
        if(window.app.paymode == "线上支付"){
          this.$("#online-payment").addClass("theme-color")
            .addClass("theme-border-color");
          this.$("#offline-payment").removeClass("theme-color")
            .removeClass("theme-border-color");
        }
        else{
          this.$("#offline-payment").addClass("theme-color")
            .addClass("theme-border-color");
          this.$("#online-payment").removeClass("theme-color")
            .removeClass("theme-border-color");
        }
        if(window.app.sendmode == "商城配送"){
          this.$("#mall-sendness").addClass("theme-color")
            .addClass("theme-border-color");
          this.$("#other-sendness").removeClass("theme-color")
            .removeClass("theme-border-color");
        }
        else{
          this.$("#other-sendness").addClass("theme-color")
            .addClass("theme-border-color");
          this.$("#mall-sendness").removeClass("theme-color")
            .removeClass("theme-border-color");
        }
      }*/
      //this.initData();
    },
      sendMode:function(e){
          //localStorage.setItem('sendwayName',$(e.target).text());
          //localStorage.setItem('sendwayId',$(e.target).attr('data-id'));
          var sendmode={};
          sendmode.sendWayName=$(e.target).text();
          sendmode.sendWayId=$(e.target).attr('data-id');
          window.app.sendmode=sendmode;
          $(e.target).addClass("theme-color").addClass("theme-border-color").siblings().removeClass("theme-color").removeClass("theme-border-color");
        if($(e.target).text()=="服务者配送"){
             //$(".sender-selector").show();
             this.$(".send-service").show();
             this.$(".send-information").hide();
        }else{
        	this.$(".send-service").hide();
        	this.$(".send-information").show();
            //$(".sender-selector").hide();
            //$(".choice-send-mode").css({"display":"none"});
        }
          /*$(".sender-selector").on('click',function(){
              $(".choice-send-mode").css({"display":"block"});
          })*/
      },
      /*sendListMode:function(e){
          $(e.target).addClass("theme-color").addClass("theme-border-color").siblings().removeClass("theme-color").removeClass("theme-border-color");
          $(".enter-send").html($(e.target).text());
           $(".choice-send-mode").css({"display":"none"});
      },*/
      menuMore: function(e){
      console.log(this.findComponent("PopupMenu"));
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    onBack: function(){
      window.history.back();
    },
    onSave: function(){
        window.history.back();
    },
      goBack: function(){
      this.$(".main-payment").show();
     this.$("#SenderSelect").hide();
      this.$(".sender-select-header").remove();
      this.$(".sender-sellect-container").removeClass("sender-transform");
    }
    //initData:function(){
      //配送方式
      //this.initSendWayData();

      //支付方式
      /*var paywayModel = require('../models/BaseModel');
      var payway = new paywayModel();
      payway.loadData({
        path: "/getPayWay",
        type:"POST",
        success:function (data) {
          if(data.status == "0"){
            payList = data.data;
            this.setPayWayInfo(payList);
          }else{
            library.Toast("数据出错");
          }
        }.bind(this),
        error:function(){
          library.Toast("数据出错");
        }
      });*/

      /*var sendUniteModel = require('../models/BaseModel');
      var sendUnite = new sendUniteModel();
      sendUnite.loadData({
        path: "/getSendWay",
        type:"POST",
        data:{
          *//*sendWayId:"73d796c2bab14a97978522e8bcdf103c"*//*
        },
        success:function (data) {
          if(data.status == "0" && data.data.length > 0){

          }else{
            this.$(".sender-selector").hide();
          }
        }.bind(this),
        error:function(){

        }
      });*/
    //},
    /*setPayWayInfo:function(payList){
      var view = this.$(".pay-select");
      view.empty();
      for(var i = 0; i < payList.length; i++){
        var payView = $("<div></div>");
        payView.addClass("pay-way-selector");
        if(i == 0){
          payView.addClass("span-left");
          payView.addClass("theme-color");
          payView.addClass("theme-border-color");
        }
        payView.text(payList[i].payWayName);
        payView.attr("data-id",payList[i].payWayId);
        view.append(payView);
        view.bind("click",function(e){
          var view = $(e.target);
          var id = view.attr("data-id");
          if(id != this.paymode.payWayId){
            this.paymode.payWayName = view.text();
            this.paymode.payWayId = id;
            this.$(".pay-way-selector").removeClass("theme-color").removeClass("theme-border-color");
            view.addClass("theme-color").addClass("theme-border-color");
            this.initSendWayData(id);
          }

        }.bind(this));
      }
      this.paymode = payList[0];
      this.initSendWayData(payList[0].payWayId);
    },*/
    /*initSendWayData:function(){
      var sendWayModel = require('../models/BaseModel');
      var sendWay = new sendWayModel();
      sendWay.loadData({
        path: "/getSendWay",
        type:"POST",
        data:{
        },
        success:function (data) {
          if(data.status == "0"){
            var view = this.$(".send-select");
            view.empty();
            var sendList = data.data;
            var sendList = [
                {
                    sendWayName: "商城配送",
                    sendWayId: "12"
                },
                {
                    sendWayName: "渠道机构配送",
                    sendWayId: "123"
                }
            ];
            for(var i = 0; i < sendList.length; i++){
              var sendView = $("<div></div>");
              sendView.addClass("send-way-selector");
              if(i == 0){
                sendView.addClass("span-left");
                sendView.addClass("theme-color");
                sendView.addClass("theme-border-color");
              }
              sendView.text(sendList[i].sendWayName);
              sendView.attr("data-id",sendList[i].sendWayId);
              view.append(sendView);
              view.bind("click",function(e){
                var view = $(e.target);
                var id = view.attr("data-id");
                if(id != this.sendmode.sendWayId){
                  this.sendmode.sendWayName = view.text();
                  this.sendmode.sendWayId = id;
                  this.$(".send-way-selector").removeClass("theme-color").removeClass("theme-border-color");
                  view.addClass("theme-color").addClass("theme-border-color");
                }
                  
                  if(id==123){
                      $(".sender-selector").show();
                  }else{
                      $(".sender-selector").hide();
                  }
              }.bind(this));
            }
            this.sendmode = sendList[0];
          }

        }.bind(this),
        error:function(){
           library.Toast("网络请求出错，请重试！")
        }
      });
    },*/
    
   /* toSender: function(){
        var Model = require('../models/BaseModel');
        var payModel=new Model;
        this.findComponent('senderCollection');
      _this = this;
      var sender_head = $("<div class='sender-select-header'/>");
      var span_left = $("<span class='icomoon-back h-span-left'/>");
      var span_middle = $("<h1 class='h-span-middle'/>");
      span_middle.text("选择渠道机构");
      sender_head.append(span_left);
      sender_head.append(span_middle);
      this.$(".sender-sellect-container").append(sender_head);
      setTimeout(function(){
            _this.$(".sender-sellect-container").addClass("sender-transform");
        },50);
      this.$("#SenderSelect").show();
        console.log(this.$("#SenderSelect").html());
      this.$(".main-payment").hide();

    },*/
/*    itemChoose: function(e){
      var content = $(e.currentTarget).text();
      this.$(".main-payment").show();
     this.$("#SenderSelect").hide();
      this.$(".sender-select-header").remove();
      this.sender = content;
      this.$(".sender-choose").text(content);
      this.$(".sender-sellect-container").removeClass("sender-transform");
    },*/
  });
});
