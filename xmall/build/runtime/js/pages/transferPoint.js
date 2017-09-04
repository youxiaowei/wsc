define(['./PageView', 'require'], function(PageView, require) {
  return PageView.extend({
    type:"transferPoint",
    events: {
      "click .searchReceiver": "searchTransfer",
      "click .hide-search": "hideSearchview",
      "click .goback": "goBack",
      "click .pointTrans": "InputTransPoints",
      "blur  #transPointsInput": "changeTrans",
      "focus #transPointsInput": "clearInputHolder",
      "keydown #searchTransfer": "searchUser",
        "click .search-right": "tosearchUser",
      "click .transfer-btn": "transferSubmit"
    },

    searchPhone:null,
    transferId:null,
    onRender: function() {
      this.toggleBar && this.toggleBar("hide");
      var Template = library.getTemplate('searchReceiverView.html');
      var $searchTrans = $(Template());
      this.$el.append($searchTrans);
    },
    onResume: function() {
        var userinfo = window.application.getUserInfo();
        var point = userinfo.myPoints;
        var pointFloor  = Math.floor(Number(point));
        var num = pointFloor .toString();
        this.$el.find('#transPointsInput').attr('placeholder','最多可转出' + num );

        console.log(userinfo);
        //myPoints

    },
    searchTransfer: function() {
      $('.search-transfer-view').addClass('search-transfer-view-show');
    },
    hideSearchview: function() {
      $('.search-transfer-view').removeClass('search-transfer-view-show');
      $('#searchTransfer').val("");
    },
    InputTransPoints: function() {
      $('#transPointsInput').focus();
    },
    clearInputHolder: function() {
      $('#transPointsInput').attr("placeholder", "");
    },
      tosearchUser: function(e){
              var searchValue = $("#searchTransfer").val().trim();
              this.searchPhone = searchValue;
              if(!this.checkPhone(searchValue)){
                  library.Toast("请输入正确的手机号码格式");
                  return;
              }
              //查询用户请求
              var BaseModel = require('../models/BaseModel');
              var baseModel = new BaseModel();
              var data = {
                  searchKey: searchValue
              };
              var options = {
                  type: "POST",
                  path: "/getReceiverList",
                  data: data,
                  showLoading:true,  //显示加载图
                  datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
                  success: this.searchSuccess.bind(this),
                  error: function(){
                      library.Toast("网络错误");
                  }
              }
              baseModel.loadData(options);
      },
    searchUser: function(e){
        if(e.keyCode==13){
            this.tosearchUser(e);
        }
    },
    searchSuccess: function(res){
        console.log(res.data);
        if(res.status==0){
            //跳回上一页面
            library.Toast("查找用户成功");
            this.transferId = res.data.userId;
            if(res.data.name){
               this.$el.find('.row-right-describe').text(res.data.name + ' ' + '(' + this.searchPhone + ')');
            }else{
                this.$el.find('.row-right-describe').text(this.searchPhone);
                this.searchPhone = null;
            }
            this.hideSearchview();
        }
        else if(res.message){
            library.Toast(res.message);
        }else if(!res.message){
            library.Toast("用户不是会员，无法转移");
        }

    },
    checkPhone: function(phone) {
        var pattern = /^1[0-9]{10}$/;
        return pattern.test(phone);
    },
    changeTrans: function() {
      var userinfo = window.application.getUserInfo();
        var point = userinfo.myPoints;
        var pointFloor  = Math.floor(Number(point));
        var num = pointFloor .toString();
      var reg = /^[0-9]*$/;
      var inputValue = $('#transPointsInput').val();
      //$('#transPointsInput').val("");
      if (inputValue) {
        // if (!reg.test(inputValue)) {
        //   library.Toast("请输入数字");
        //   $('#transPointsInput').val("");
        //   $('#transPointsInput').attr("placeholder", "最多可转出"+num);
        // }
      } else {
        $('#transPointsInput').val("");
        $('#transPointsInput').attr("placeholder", "最多可转出"+num);
      }
    },

    transferSubmit: function(){
    	//获取输入的积分
    	var GetInputPoints=$("#transPointsInput").val();
        var userinfo = window.application.getUserInfo();
        var transPoint = parseFloat(this.$el.find("#transPointsInput").val());
        if(!(transPoint && this.transferId)){
            library.Toast("请选择接收人和转移积分！");
            return;
        }
        if(transPoint>parseFloat(userinfo.myPoints)){
            library.Toast("超过可转移积分上限，请重新输入！");
            return;
        }
        this.cutPoints = transPoint;  //记录转移分数
        var BaseModel = require('../models/BaseModel');
        var baseModel = new BaseModel();
        var data = {
            fromUserId: userinfo.userid,
            userId: this.transferId,
            point: transPoint

        };
        var options = {
            type: "POST",
            path: "/transferPoint",
            data: data,
            showLoading:true,  //显示加载图
            datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
            success: this.transferSuccess.bind(this),
            error: function(){
                library.Toast("网络错误");
            }
        }
        baseModel.loadData(options);

    },
    transferSuccess:function(res){
    	
        if(res.status==0){
        	//积分跨页面更新
        	var userInfo = application.getUserInfo();
        	userInfo.myPoints = userInfo.myPoints - $('#transPointsInput').val();
        	application.setLocalStorage('userinfo',userInfo);
        	library.Toast("积分转出成功！");
            Backbone.history.navigate(
      	          '#my-navigate/credit', {
      	              trigger: true
      	       });
        }else if(res.data.isSame){
        	
        	library.Toast("积分不能转移给自己");
        }
        else if(res.data.notFound){
          library.Toast("请在【会员中心-账户信息】完善身份证信息后使用积分!");
        }  
        
    },

    goBack: function() {
      var userinfo = window.application.getUserInfo();
      var fixedMyPoints = parseInt(userinfo.myPoints);
      $('#transPointsInput').val("");
      $('#transPointsInput').attr("placeholder", "最多可转出"+fixedMyPoints);
      $('.row-right-describe').text("搜索");
      this.searchPhone=null,
      this.transferId=null,
      window.history.back();
    }
  });
});
