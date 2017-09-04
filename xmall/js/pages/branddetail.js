define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'branddetail',

     //------------------
    // 筛选器相关
    categoryColletion: null,
    demo: {
      goodslistmenu: [{
        title: "综合",
        isdefault: false
      }, {
        title: "销量",
        isdefault: false
      }, {
        title: "价格",
        isdefault: false
      }, {
        title: "筛选",
        isdefault: true
      }, ],
    },

    data: {
      brand: [],
      price: {
        min: 10,
        max: 20
      },
      category: []
    },

    productListView:null,
    initialize: function(){

      var header = library.getTemplate('branddetail-head.html');
      this.$el.append(header);
      this.productListView = this.findComponent('ProductListView');

      this.categoryColletion = this.productListView.getCollection();
        this.productListView.setCallBack(this.clickRowListener.bind(this));
      var FilterControl = this.findComponent('FilterControlView');
      //this.listenTo(FilterControl, 'filterResult', this.filterResult);
    },

    clickRowListener: function(result) {

      var itemModel = this.categoryColletion.models[result.index];
      if(itemModel && itemModel.get('id')){
        Backbone.history.navigate("#home-navigate/itemdetail?goodsid="+itemModel.get('id'),{
          trigger: true
        });
      }else{
        library.Toast("该产品可能已下架");
      }
      /*Backbone.history.navigate("#brand-navigate/itemdetail?goodsid=010041JZJ8PO163VELGJ",{
        trigger: true
      });*/
    },

    onRender:function(){
      this.setInfo();
      this.$('.goodsfilter').css({
        'margin-top':"0px",
        'border-bottom': "solid 1px #c8c8c8",
      });
      this.$('#ProductListView').css({
        'padding-top':"1.33333333rem",
        'border-top': "solid 0px #c8c8c8",
      })
    },
    initData:function(){
      var data = {
        pagesize: 10,
        pageindex: 1,
        sorttype: 1,
        id: window.application.getQueryString('id'),
      }
      this.categoryColletion.ajaxOptions = {
        path:'/branddetaillist',
          data:data,
          type:'GET',
          needReset:true,
          showLoading:true,
          success:this.onSuccess.bind(this),
          error:this.onError.bind(this)
      }
      $(".order-all").trigger('click');
      var _this = this;
      window.setTimeout(function(){
        _this.categoryColletion.loadData(_this.categoryColletion.ajaxOptions);
      },300);
    },
    onSuccess: function(data){
        if(this.categoryColletion.ajaxOptions.data.pageindex == 1){
          this.isListEmpty(data);
        }

    },
    onError: function(){

    },
    onResume:function(){
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();
      this.initData();
    },
    setInfo:function(){
      var _this = this;
      var Info = require('../models/BaseModel');

      var info = new Info();
      info.loadData({
        path:'/branddetail',
        type:"GET",
        data: {id:window.application.getQueryString('id')},
        success:function(res){
          if(res.status=="ok"){
            console.log(res.data.branddes);
            //_this.$('.branddetail-introduce').append(res.data.branddes);
            _this.$('.branddetail-name').append(res.data.brandname);
            _this.$('.title').append(res.data.brandtitle);
            _this.$('.branddetail-head-left-picture').attr("src", res.data.brandlogo);
          }

        }

      });

    },


    onBack:function(){
      window.history.back();
    },


    oncategoryColletionReset: function(collection, options) {
      var me = this;
      var result = [];

      for (var i = 0; i < collection.models.length;) {
        var s = i + 3;
        if (s < collection.models.length) {
          result.push(collection.models.slice(i, i + 3));
        } else {
          result.push(collection.models.slice(i, collection.models.length));
        }
        i = s;
      }
      var rows = "";
      result.forEach(function(it, index) {
        var item = "";

        it.forEach(function(it, index) {

          item += '<div category-id="' + it.get('id') + '" class="filtercondition-category-item" > <div>' + it.get('text') + '</div> </div>';
          //item+='<div class="condition-item condition-item-mid" > <a href="'+it.get('url')+'"><img src="'+it.get('image')+'"></a> </div>';

        });

        rows += '<div class="filtercondition-category-row " >' + item + '</div>';
      });

      this.$('.filtercondition-category').empty();
      this.$('.filtercondition-category').append(rows);

    },

    //-------------------

    listType: 'simple',

    events: {
      'click .header-box-mid-inner': 'toSearch',
      'click .nav-left': 'toBack',
      'click .nav-right': 'onListTypeChange',
      'click .filter-filter': 'onFilter',
      'click .header-icon-back': 'onBack',
      'click .branddetail-head': 'toBrandIntroduce',
      'click .order-all': 'orderAll',
      'click .order-sales': 'orderSales',
      'click .order-price': 'orderPrice'
    },





    filterResult: function(sender) {
      this.categoryColletion.onFilter(sender.data);
      this.resetFilterUI();
    },

    toSearch: function(e) {
      this.findComponent("SearchMidPageView").show();
    },

    toBack: function(e) {
      window.history.back();
    },

    toBrandIntroduce:function(){
      //   Backbone.history.navigate('#brand-navigate/brandintroduce?id='+window.application.getQueryString('id'), {
      //   trigger: true
      // });
    },
    onListTypeChange: function(e) {
      this.listType = this.listType == 'simple' ? 'double' : 'simple';
      this.resetFilterUI();
    },

    notifyListType: function() {
      var icon = this.$el.find('.menu-list-type');
      var line = this.$el.find('li');
      var mediaObj = this.$el.find('.media-object');
      var mediaBody = this.$el.find('.media-body');
      if (this.listType == 'double') {
        $('#ProductListView').css({
          'padding': '0px 15px',
          'padding-top': "1.33333333rem",
        });
        icon.removeClass('icomoon-list').addClass('icomoon-class_click');
        line.css({
          'border-bottom': '0px solid #ddd'
        });
        $('.table-view').css({
          'border-top': '0px solid #ddd',
          'border-bottom': '0px solid #ddd',
          'margin-bottom': '0px',
          'background-color': '#f5f5f5'
        });
        line.addClass('list-row-control');
        $('.list-item').addClass('item-double-inline');
        mediaObj.removeClass('pull-left');
        mediaObj.removeClass('item-media-object-single-line');
        mediaBody.addClass('list-row-media-body-control');
        $('.item-media-des').css({
          display: 'none'
        });
      } else {
        $('#ProductListView').css({
          'padding': '0px',
          'padding-top': "1.33333333rem",
        });
        line.css({
          'border-bottom': '1px solid #ddd'
        });
        $('.table-view').css({
          'border-top': '1px solid #ddd',
          'border-bottom': '1px solid #ddd',
          'margin-bottom': '15px',
          'background-color': '#fff'
        });
        icon.removeClass('icomoon-class_click').addClass('icomoon-list');
        line.removeClass('list-row-control');
        $('.list-item').removeClass('item-double-inline');
        mediaObj.addClass('pull-left');
        mediaObj.addClass('item-media-object-single-line');
        mediaBody.removeClass('list-row-media-body-control');
        $('.item-media-des').css({
          display: 'block'
        });
      }
    },

    orderType: 'down',
    filterStatus: 0,

    orderAll: function() {
      this.onOrder({sorttype: '1',pageindex:1});
      this.resetFilterUI('all');
    },
    orderSales: function() {
      this.onOrder({sorttype: '2',pageindex:1});
      this.resetFilterUI('sales');
    },
    orderPrice: function() {
      this.orderType = this.orderType == "up" ? "down" : "up";
      if(this.orderType == 'up'){
        this.onOrder({sorttype: '4',pageindex:1});
      }else{
        this.onOrder({sorttype: '3',pageindex:1});
      }
      this.resetFilterUI('price');
    },
    onFilter: function(e) {
      this.$(".goodsfilter .typeselected").removeClass('typeselected');
      this.$(e.currentTarget).addClass('typeselected');
      this.resetFilterUI('filter');
      this.$("#FilterControlView").css({
        'top': "",
        'margin-top': "1.9333333333rem"

      });

    },
    onOrder: function(options) {
      if(options){
        for(key in options){
          this.categoryColletion.ajaxOptions.data[key] = options[key];
        }
      }
      var _this = this;
      this.categoryColletion.loadData();
    },

    onChangeFilter: function() {
      if (this.filterStatus == 1) {
        console.log();
        $('#ProductListView').css({
          "display": "none"
        });
        $('.filtercondition ').css({
          "display": "block"
        });

      } else {
        $('#ProductListView').css({
          "display": "block"
        });
        $('.filtercondition ').css({
          "display": "none"
        });
      }
    },

    resetFilterUI: function(type) {
      if (type != 'filter') {
        this.filterStatus = 0;
      }
      $('.order-all').removeClass("theme-color");
      $('.order-sales').removeClass("theme-color");
      $('.order-price').removeClass("theme-color");
      $('.filter-filter').removeClass("theme-color");
      $('.filter-icon-down').removeClass("theme-color");
      $('.filter-icon-up').removeClass("theme-color");
      $('.icomoon-screen').removeClass("theme-color");
      if (type == 'all') {
        $('.order-all').addClass("theme-color");
      } else if (type == 'sales') {
        $('.order-sales').addClass("theme-color");
      } else if (type == 'price') {
        $('.order-price').addClass("theme-color");
        if (this.orderType == 'down') {
          $('.filter-icon-down').addClass("theme-color");
        } else {
          $('.filter-icon-up').addClass("theme-color");
        }
      } else if (type == 'filter') {
        $('.filter-filter').addClass("theme-color");
        $('.icomoon-screen').addClass("theme-color");
        this.filterStatus = this.filterStatus == 1 ? 0 : 1;
      };
      this.onChangeFilter();
      this.notifyListType();
    },

    comfirm: function() {
      alert(JSON.stringify(this.data));
    },
    categorySelect: function(e) {
      e.preventDefault();
      var me = this;
      var hasEl = this.data.category.find(function(it) {
        if (this.$(e.currentTarget).attr('category-id') == it) {
          return it;
        }
      });
      if (!hasEl) {
        this.$(e.currentTarget).find('div').addClass('filtercondition-category-selected');
        this.data.category.push(this.$(e.currentTarget).attr('category-id'));
      } else {
        this.data.category.find(function(it, index, arr) {
          if (this.$(e.currentTarget).attr('category-id') == it) {
            me.data.category.splice(index, 1);
          }
        });

        // this.data.brand.(this.$(e.currentTarget).attr('data-id'));
        this.$(e.currentTarget).find('div').removeClass('filtercondition-category-selected');
      }
      return false;
    },
    inputPrice: function(e) {
      if (this.$(e.currentTarget).attr('inputprice') == "min") {
        this.data.price.min = this.$(e.currentTarget).val();
      } else {
        this.data.price.max = this.$(e.currentTarget).val();
      }

    },

   isListEmpty: function(data){

      if(data && data.data && data.data.length<1){
          console.log(this.productListView);
          this.productListView.$el.hide();
          console.log($('.blank_tips'));
          $('.blank_div').show();
      }
       else{
          this.productListView.$el.show();
          $('.blank_div').hide();
      }

   },
  });
});
