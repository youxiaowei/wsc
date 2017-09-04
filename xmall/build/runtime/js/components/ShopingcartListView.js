/**
 * Created by liuqingling on 15/12/18.
 */
define(['./BaseView', 'backbone', '../loader', '../models/AjaxCollection', '../models/BaseModel'], function(BaseView, Backbone, loader, AjaxCollection, BaseModel) {
  var collections = AjaxCollection.extend({
    model: BaseModel

  });

  return BaseView.extend({
    type: 'ShopingcartListView',
    collection: new collections(),
    events: {
      "click .shopingcart-choicebox-goods": "onCilckgoods",
      "click .shopingcart-goods-edit-btn-minus": "onCilckminus",
      "click .shopingcart-goods-edit-btn-plus": "onCilckplus",
      "blur .shopingcart-goods-edit-input": "onBlurinput",
      "change .shopingcart-goods-edit-input": "onChangevalue",
    },
    initialize: function() {
      var _this = this;
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.onAdd);
      this.listenTo(this.collection, "change", this.onChange);
    },

    isListEdit:false,

    initData: function(isListEdit){
      this.isListEdit = isListEdit;
      var userInfo = window.application.getUserInfo();
      if(!userInfo){
        $('.shopingcartlist_empty').hide();
        $('.ShopingcartListView').hide();
        $('.shopingcart-footer').hide();
        $('.unlogin_tips').show();
        $('.shopingcart-ed').hide();
       // $('.shopingcart-back').hide();
        return;
      }
      else{
        $('.unlogin_tips').hide();
        $('.shopingcart-ed').show();
        $('.ShopingcartListView').show();
        $('.shopingcart-back').show();
        this.collection.ajaxOptions = {
          path: '/getCartList',
          type: "POST",
          data: {userId:userInfo.userid},
          showLoading:true,
          needReset:false,
          success:this.onSuccess.bind(this),
          error:this.onError.bind(this)
        }
        this.collection.loadData();
      }
    },
    cartListData:null,
    onSuccess: function(res){
      if(res && res.status == '0'){
        var list = res.data;

        this.cartListData = list;
        this.collection.reset(this.cartListData);
        window.application.setLocalStorage('cartnumber',this.cartListData.length);
        if(res.data.length<1){
            $('.shopingcartlist_empty').show();
            $('.shopingcart-footer').hide();
            $(".shopingcart-manage").hide(); 
        }
        else{
            $('.shopingcartlist_empty').hide();
            $('.shopingcart-footer').show();
        }
        this.setTotal();
        if(this.isListEdit){
        	  $('.shopingcart-goods-edit').show();
              //$('.shopingcart-goods-details-info-show').hide();
        	  if(res.data.length<1){
                  $('.shopingcart-manage').hide();
                  $(".shoping-cart-menu").hide(); 
        	  }else{
                  $('.shopingcart-manage').show();
                  $(".shoping-cart-menu").show(); 
        	  }
              $('.shopingcart-footer').hide();
        }
      }else{
        library.Toast(res ? res.message : "抱歉网络不太给力");
      }
      // this.initDataFinished && this.initDataFinished();
    },
    onError: function(res){
      library.Toast(res ? res.message : "抱歉网络不太给力");
    },

    onChange: function(mod) {
    },
    render: function() {
      return this;
    },
    //点击商品
    onCilckgoods: function(_this) {
      if ($(_this.target).hasClass('icomoon-choice')) {
        $(_this.target).removeClass('icomoon-choice').removeClass('theme-color'); //取消当前
        $(_this.target).parents('.shopingcart-item').find('.shopingcart-choicebox-store').removeClass('icomoon-choice').removeClass('theme-color'); //取消商店
      } else {
        $(_this.target).addClass('icomoon-choice').addClass('theme-color'); //选择当前
      }
      this.setTotal();
      var listView = $("#shopingcartlistview");
      var choicelength = listView.find(".icomoon-choice").length;
      var alllength = listView.find(".shopingcart-choicebox-goods").length;
      if(choicelength < alllength)
      {
        $('.shopingcart-choicebox-manage').removeClass('icomoon-choice').removeClass('theme-color'); //取消全选
        $('.shopingcart-choicebox-all').removeClass('icomoon-choice').removeClass('theme-color');
      }
      else {
        $('.shopingcart-choicebox-all').addClass('icomoon-choice').addClass('theme-color');
        $('.shopingcart-choicebox-manage').addClass('icomoon-choice').addClass('theme-color');
      }
    },

    cartInfo:{},
    //点击减
    onCilckminus: function(_this) {
      var itemView = $(_this.target).parents(".shopingcart-goods-listitem");
      var cid = itemView.attr("data-cid"); //获取当前collection 的 id
      var index = itemView.attr("data-index"); //获取当前model的id
      var minimum = parseInt($(_this.currentTarget).attr('data-minimum')); //获取操作的最小值
      var mod = this.collection.find({cartId:index}); //通过model的id获取获取当前collection对象
      var goods = mod; //通过collection对象获取model数据
      //根据model id 操作数组
      var newn = goods.get("number");
      if (newn <= minimum) {
        library.Toast("商品数量不能小于最小起批量！", 1000);
        $(_this.currentTarget).parent().find('.shopingcart-goods-edit-input').val(minimum);
      } else {
        newn = goods.get("number") - 1;
          goods.set("number",newn);
        $(_this.currentTarget).next().val(newn);
      }
      var cartId =  goods.get("cartId");
      this.cartInfo[cartId] = {
        cartId:cartId,
        number:newn
      }
      this.setNember($(_this.currentTarget).parents('.shopingcart-goods-listitem'), goods.get("number"));
      this.setTotal();
    },
    //修改数值
    onChangevalue: function(_this) {
      var itemView = $(_this.target).parents(".shopingcart-goods-listitem");
      var cid = itemView.attr("data-cid"); //获取当前collection 的 id
      var index = itemView.attr("data-index"); //获取当前model的id
      var minimum = parseInt($('.shopingcart-goods-edit-btn-minus').attr('data-minimum')); //获取操作的最小值
      var maximum = parseInt($('.shopingcart-goods-edit-btn-plus').attr('data-maximum')); //获取操作的最大值
      var mod = this.collection.find({cartId:index});
      var goods = mod;
      var newn = $('.shopingcart-goods-edit-input').val();
      if (newn <= minimum) {
        library.Toast("商品数量不能小于最小起批量！", 1000);
        newn = minimum;
        $(_this.currentTarget).val(newn);
      }
      if (newn >= maximum) {
        library.Toast("商品数量不能大于最存货量！", 1000);
        newn = maximum;
        $(_this.currentTarget).val(newn);
      }
      var cartId = goods.get("cartId");
      this.cartInfo[cartId] = {
        cartId:cartId,
        number:newn
      }
      this.setTotal();
    },
    //点击加
    onCilckplus: function(_this) {
      var itemView = $(_this.target).parents(".shopingcart-goods-listitem");
      var cid = itemView.attr("data-cid"); //获取当前collection 的 id
      var index = itemView.attr("data-index"); //获取当前model的id
      var maximum = parseInt($(_this.currentTarget).attr('data-maximum')); //获取操作的最大值
      var mod = this.collection.find({cartId:index}); //通过model的id获取获取当前collection对象
      var goods = mod; //通过collection对象获取model数据
      //根据model id 操作数组
      var newn = goods.get("number");
      if (newn >= maximum) {
        library.Toast("商品数量不能大于最存货量！", 1000);
        $(_this.currentTarget).parent().find('.shopingcart-goods-edit-input').val(maximum);
      } else {
        var newn = goods.get("number") + 1;
        goods.set("number",newn);
        $(_this.currentTarget).prev().val(newn);
      }
      var cartId = goods.get("cartId");
      this.cartInfo[cartId] = {
        cartId:cartId,
        number:newn
      }
      this.setNember($(_this.currentTarget).parents('.shopingcart-goods-listitem'), goods.get("number"));
      this.setTotal();
    },
    onBlurinput: function(_this) {
      var minimum = parseInt($(_this.currentTarget).prev().attr('data-minimum')); //获取最小数字
      var maximum = parseInt($(_this.currentTarget).next().attr('data-maximum')); //获取最大数字
      var number = parseInt($(_this.currentTarget).val()); //获取当前输入数字
      if (number >= maximum) {
        number = maximum;
      }
      if (number <= minimum || !number) {
        number = minimum;
      }
      var itemView = $(_this.target).parents(".shopingcart-goods-listitem");
      var cid = itemView.attr("data-cid"); //获取当前collection 的 id
      var index = itemView.attr("data-index"); //获取当前model的id
      var maximum = parseInt($(_this.currentTarget).attr('data-maximum')); //获取操作的最大值
      var mod = this.collection.find({cartId:index}); //通过model的id获取获取当前collection对象
      var goods = mod; //通过collection对象获取model数据
      //根据model id 操作数组
      goods.set("number",number);
      //mod.unset('goods', {silent:true});
      //mod.set('goods',goods);
      $(_this.currentTarget).val(number);
      this.setNember($(_this.currentTarget).parents('.shopingcart-goods-listitem'), number);
      this.setTotal();
    },
    //传店铺父级Item对象
    setTotal: function() {
      var total = 0;
      $('.shopingcart-choicebox-goods.icomoon-choice').each(function() {
        //获取价钱
        var price = parseFloat($(this).parent().find('.shopingcart-goods-details-unit-price').attr("data-price"));

        //获取数量
        var number = parseInt($(this).parent().find('.shopingcart-goods-edit-input').val());
        total += (price * 100) * number;
      });
        total = total / 100.0;
      $('.shopingcart-info-total-price').text("¥" + total);
    },
    setNember: function(_this, nember) {
      _this.find('.shopingcart-goods-details-number').text('x' + nember);
    },
    onReset: function(data) {
      this.$el.empty();
      var _this = this;
      data.models.forEach(function(it, index) {
        _this.onAdd(it);
      });
      if($('.shopingcart-ed').text()=="完成"){
          $('.shopingcart-goods-edit').show();
      }
      else{
          $('.shopingcart-goods-edit').hide();
      }
    },
    allGoodsTemplate: null,
    onAdd: function(data) {
      if (!this.allGoodsTemplate) {
        this.allGoodsTemplate = library.getTemplate('shopingcart-allgoods.html');
      }
      var json = data.toJSON();
      // var item = json.productList[0];
      // item.cartId = item.cartid;
      // item.productId = item.goodsid;
      // item.cid = data.cid;
      // item.image = item.imgurl;
      // item.mark = "";
      json.mark=json.mark||"";
      // item.specParamInfo = "颜色：黑色；尺码：37";
      // console.log(item);
      this.$el.append(this.allGoodsTemplate(json));
    }
  });
});
