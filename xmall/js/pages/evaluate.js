/**
 * Created by Terence on 15/12/14.
 */
define(['require','./PageView'], function(require,PageView){
    return PageView.extend({
    defaults:{
       toastTime:null
    },

    events:{
      'click .icomoon-back': 'onBack',
      'click .evaluate-goods-comment-button-share':'shareClick',
      'click .evaluate-star': 'makeStar',
      'click .evaluate-goods-comment-button-submit': 'makeComment'
    },
    commentCollection: null,
    userInfo: null,
    shareClick:function(e){
       // to-fix：数据绑定到数据库后记得切换成数据源
       //方式略挫，因为这里的uL里面木有用li,或者采用点击范围扩增，然后判断点击的属性是不是该按钮
      //  var index = $(e.currentTarget).parent().parent().parent().parent().index();
      var currentItem = $(e.currentTarget).parents('.evaluate-item');
      var orderId = currentItem.data('oid');
      var productIndex = currentItem.data('index');
      var orderInfo = this.commentCollection.findWhere({orderId:orderId});
      var productItem = orderInfo.get('items')[productIndex];
      var productName = productItem.name;
      if(productName){
        if(prouctName.length > 15){
          productName = productName.substr(0,15);
        }
      }else{
        productName = '欢迎您的选购';
      }
      return;
      var message = {
           title: "ymall商城-" + productName,
           content: productItem.name,
           url: window.app.shareUrl,
           imagePath: productItem.imgurl
       };
       ShareSDK.share(message,null,null);
   },
    onBack:function(){
      //获取评论内容
      var _textarea = $('.evaluate-goods-comment-textarea').val();
      //获取星标
      var _stars = $('.evaluate-goods-comment').attr('data-star');

      if(_textarea.trim().length>1||_stars){
        library.MessageBox("提示信息","评价未提交，是否离开？",[{leftText:"确定",callback:function(){
          window.history.back();
        }},{rightText:"取消",callback:function(){
        }}]);
      }else if(_textarea.trim().length<1||!_stars){
        library.MessageBox("提示信息","评价未完成，是否离开？",[{leftText:"确定",callback:function(){
          window.history.back();
        }},{rightText:"取消",callback:function(){
        }}]);
      }else{
        window.history.back();
      }

    },
    toastHide:function(){
      $('.evaluate-toast').removeClass('evaluate-toast-active');
    },
    toastPop:function(tip,Callback){
      if(this.toastTime!=null){
        clearTimeout(this.toastTime);
      }
      this.$el.find('.evaluate-toast-p').html(tip);
      this.$el.find('.evaluate-toast').addClass('evaluate-toast-active');
      this.toastTime=setTimeout(Callback,1000);
    },
    makeStar: function(e){
      var _this = this;
      //返回父元素
      var _parent = $(e.currentTarget).parent();
      var _parents = $(e.currentTarget).parents('.evaluate-goods-marking').next('.evaluate-goods-comment');
      var _star = $(e.currentTarget).data('star');
      //设置星标值
      _parents.attr('data-star',_star);
      //移除所有选中元素
      _parent.find('.evaluate-star').removeClass('click icomoon-star').addClass('unclick icomoon-starunclick');
      //当前元素添加选中
      $(e.currentTarget).removeClass('unclick icomoon-starunclick').addClass('click icomoon-star');
      //遍历前面的元素添加选中
      $(e.currentTarget).prevAll().each(function(){
        $(this).removeClass('unclick icomoon-starunclick').addClass('click icomoon-star');
      });
    },


    commentModel: null,
    makeComment: function(e){
      //获取订单号
      //var _ordersn = $(this).data('id');
      //获取评论内容
      var _textarea = $(e.currentTarget).parent().prev('.evaluate-goods-comment-textarea').val();
      //获取星标
      var _stars = $(e.currentTarget).parents('.evaluate-goods-comment').attr('data-star');
      if(!_stars){
        library.Toast("请打分后提交评价",1000);
        return;
      }
      if(_textarea.trim().length<1){
        _textarea = '好评';
      }
      //准备评论数据
      var currentItem = $(e.currentTarget).parents('.evaluate-item');
      var orderId = currentItem.data('oid');
      var productIndex = currentItem.data('index');
      var orderInfo = this.commentCollection.findWhere({orderId:orderId});
      var productItem = orderInfo.get('items')[productIndex];

      library.Toast("评价商品成功",1000);
      if(!this.commentModel){
        var CommentModel = require('../models/BaseModel');
        this.commentModel = new CommentModel();
        var path = '/commentorder';
        var data = {
          userid: this.getUserId(),
        };
        var options = {
          path: path,
          data: data,
          showLoading:true,
          success:this.commentSuccess.bind(this),
          error:this.commentError.bind(this)
        };
      }else{
        var options = this.commentModel.ajaxOptions;
      }
      options.data.content = _textarea;
      options.data.grade = _stars;
      options.data.goodsid = productItem.id,
      options.data.orderId = orderInfo.get('orderId'),
      console.log(options);
      this.commentModel.loadData(options);
    },

    commentSuccess: function(data){
      console.log(data);
      if(data){
        library.Toast(data.message || "评论成功",2000);
      }else{
        library.Toast("评论失败，网络错误",2000);
      }
      $('.add-blank-leaving-icon').removeClass("icomoon-without").removeClass("add-blank-leaving-icon");
      $('.add-blank-leaving-words').text("").removeClass("add-blank-leaving-words");
      $("#AllOrderListView").show();
      this.initData();
    },

    commentError: function() {
      library.Toast("网络出错", 2000);
    },
    getUserId: function(){
      this.userInfo = window.application.getUserInfo();
      if(!this.userInfo){
        library.Toast("您尚未登录，请前往登录");
        window.history.back();
      }
    },

    onRender:function(){
      this.commentCollection = this.findComponent('EvaluatePushView').collection;
      this.initData();
    },
    initData: function(){
      var userInfo = window.localStorage['userinfo'];
      this.userInfo = JSON.parse(userInfo);
      if(!this.userInfo){
        library.Toast("您尚未登录，请前往登录");
        window.history.back();
      }
      this.commentCollection.queryData = {
        userid:this.userInfo.userid,
        isComment: '0',
        orderStatus: '1',
        pageindex:1,
        pagesize:10
      }
      this.commentCollection.loadData({
        url:this.commentCollection.commentOrderUrl,
        data:this.commentCollection.queryData,
        needReset: true,
        showLoading:true,
        success:this.onSuccess.bind(this),
        error: this.onError.bind(this)
      });
    },
    onSuccess: function(data){
      if(data && data.status == 'ok'){

      }else{
        library.Toast("网络错误，请稍后再试",2000);
      }
      this.setPageStatus();
    },

    onError: function(){
      library.DismissLoadingBar();
      library.Toast("抱歉，网络错误",2000);
      this.setPageStatus();
    },
    setPageStatus: function(){
      if (!this.commentCollection.length || this.commentCollection.length == 0) {
        library.Toast("您还没有待评论的订单");
        window.history.back();
      }
    },
  });
});
