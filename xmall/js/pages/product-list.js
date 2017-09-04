define(['./PageView','require'], function(PageView,require) {

  function FilterView(wrapper,categoryId){
    var _this = this;
    this.selected_categoryids = [];
    this.categoryId=categoryId;
    this.R = "filter_"+ parseInt(Math.random()*1000);
    this.ctl_bk = $("<div class='xm-filter-wrapper-bk'></div>");
    this.ctl_wrapper = $("<div class='xm-filter-wrapper'></div>");
    var ctl_header = $("<div class='xm-filter-header'></div>");
    this.OkBtn =  $("<button class='xm-filter-ok-btn'>确定</button>");
    var title =  $("<span class='xm-filter-title'>筛选</span>");
    var header_back_wrapper = $("<div class='xm-filter-back-wrapper'></div>")
    var header_back =  $("<span class='xm-filter-back'></span>");
    this.ctl_body = $("<div class='xm-filter-body'></div>");
    header_back_wrapper.append(header_back);
    ctl_header.append(header_back_wrapper).append(title).append(this.OkBtn);
    this.ctl_wrapper.append(ctl_header).append(this.ctl_body);

    wrapper.append(this.ctl_wrapper);
    wrapper.append(this.ctl_bk);
    this.ctl_bk.bind("click",function(){
      _this.hide();
    });

    this.OkBtn.bind("click",function(){
      _this.hide();
    });

    header_back_wrapper.bind("click",function(){
      _this.hide();
    });

  }

  FilterView.prototype={
    initLayout:function(demoData){
      var _this = this;
      this.ctl_body.empty();
      var all = $("<div class='xm-filter-item xm-filter-item-all xm-filter-item-selected'>全部</div>");
      all.bind("click",function(e){
        _this.selected_categoryids=[];
        e.target.className = "xm-filter-item xm-filter-item-all xm-filter-item-selected";
        var items = $(".xm-filter-sl-item");
        for(var i=0,j=items.length;i<j; i++ ){
          $(items[i]).removeClass("xm-filter-item-selected");
        }
      });
      this.ctl_body.append(all);
      var item_wrapper = $("<div class='xm-filter-item-wrapper'></div>");
      for(var i =0,j=demoData.length;i<j;i++){
        var item = demoData[i];
        var group_dom_id = this.R + i;
        var filter_item =$("<div data-second-ref='"+group_dom_id+"' class='xm-filter-item'><span>"+item["categoryName"]+"</span><div class='xm-filter-filter-icon'></div></div>");
        item_wrapper.append(filter_item);
        filter_item.bind("click",function(e){
          var filter_item_select = e.target;
          var data_second_id = filter_item_select.getAttribute("data-second-ref");
          if(!data_second_id){
            filter_item_select = e.target.parentNode;
            data_second_id = filter_item_select.getAttribute("data-second-ref");
              if(!data_second_id){
                return;
              }
          };
          if(_this.selectgdid){
            document.getElementById(_this.selectgdid).style["display"] = "none";
          }
          if(_this.filter_item_select){
            _this.filter_item_select.removeClass("xm-filter-group-selected");
          }
          if(_this.selectgdid == data_second_id){
            _this.filter_item_select = null;
            _this.selectgdid = null;
            return;
          }
          document.getElementById(data_second_id).style["display"] = "block";
          $(filter_item_select).addClass("xm-filter-group-selected");
          _this.selectgdid = data_second_id;
          _this.filter_item_select = $(filter_item_select);
        });
        var second_level_wrapper = $("<div id='"+(group_dom_id)+"' class='xm-filter-sedlv-wrapper'></div>");
        var second_items = item["categories"];
        for(var n=0,m = second_items.length;n<m;n++){
          var second_item = second_items[n];//
          var second_dom_item = $("<div data-categoryid='"+second_item["brandId"]+"' class='xm-filter-item xm-filter-sl-item'><span>"+second_item["brandName"]+"</span></div>");
          second_dom_item.bind("click",function(e){
            var category_select = e.target;
            var category_id = category_select.getAttribute("data-categoryid");
            if(!category_id){
              category_select = e.target.parentNode;
              category_id = category_select.getAttribute("data-categoryid");
                if(!category_id){
                  return;
                }
            };
            var index = _this.selected_categoryids.indexOf(category_id);
            if(index<0){
              $(category_select).addClass("xm-filter-item-selected");
              _this.selected_categoryids.push(category_id);
            }else{
              $(category_select).removeClass("xm-filter-item-selected");
              _this.selected_categoryids.splice(index,1);
            }//xm-filter-sl-item
            _this.selected_categoryids.length>0?all.removeClass("xm-filter-item-selected"):all.addClass("xm-filter-item-selected");
          });
          second_level_wrapper.append(second_dom_item);
        }
        item_wrapper.append(second_level_wrapper);
      }
      this.ctl_body.append(item_wrapper);
    },
    hide:function(){
      this.ctl_wrapper.removeClass("xm-filter-show");
      this.ctl_bk.css({"display":"none"});
    },
    show:function(){
      var _this = this;
      window.setTimeout(function(){
        _this.ctl_wrapper.addClass("xm-filter-show");
        _this.ctl_bk.css({"display":"block"});
      },2);

      var ProductParameterCollection = require('../models/ProductParameterCollection');
      var pM = new ProductParameterCollection();
      var options = {
        path:'/getFilterParam',
        data:{
          categoryId:this.categoryId
        },
        type:'POST',
        needReset:true,
        showLoading:true,
        success:this.onSuccess.bind(this),
        error:this.onError.bind(this)
      }
      pM.loadData(options);
    },
    onSuccess:function(data){
      if(data.data){
        this.initLayout(data.data);
      }
    },
    onError:function(){

    }

  };


  return PageView.extend({
    $pagename:"productlist",
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
    isFirstLoad : true,
    events: {
        'click .header-box-mid-inner': 'toSearch',
        'click .nav-left': 'toBack',
        'click .nav-right': 'onListTypeChange',
        'click .filter-filter': 'onFilter',
        'click .order-all': 'orderAll',
        'click .order-sales': 'orderSales',
        'click .order-price': 'orderPrice'
    },
    listview:null,
    initialize: function() {
      this.listview = this.findComponent('ProductListView');
      this.categoryColletion = this.listview .getCollection();
      this.listview.setCallBack(this.clickRowListener.bind(this));
      //var FilterControl = this.findComponent('FilterControlView');
      //this.listenTo(FilterControl, 'filterResult', this.filterResult);
    },
    clickRowListener: function(data) {
      var itemModel = this.categoryColletion.models[data.index];
      if(itemModel && itemModel.get('id')){
        Backbone.history.navigate("#category-navigate/itemdetail?goodsid="+itemModel.get('id'),{
          trigger: true
        });
      }else{
        library.Toast("该产品可能已下架");
      }

    },

    render: function() {
      PageView.prototype.render.apply(this, arguments);
      this.$el.css({
        'background-color': '#f5f5f5'
      });
      this.blankwords = $("<div class ='icomoon-withoutsearch add-blank-leaving-icon' style='position:absolute;top: 150px;display:none;'>  <div class = 'add-blank-leaving-words' > 搜索结果不存在~ </div></div>");
      this.$el.append(this.blankwords);
      return this;
    },
    categoryId: null,
    keyword: null,
    onResume: function(){
      this.isFirstLoad = true;
      PageView.prototype.onResume.apply(this,arguments);
      this.categoryId = window.application.getQueryString('id');
      this.keyword = window.app.searchKey;
      //window.app.searchKey = null;
      this.initData();
      window.app.searchKey = null;
    },
    // initData: function(){
    //   window.app.searchKey="";
    //   this.listview.removeAllItems();
    //   if(this.categoryId){
    //     //this.findComponent('FilterControlView').initFilterData(this.categoryId);
    //     this.$('.filter-filter').removeClass('filter-filter-none');
    //   }else{
    //    // this.$('.filter-filter').addClass('filter-filter-none');
    //   }
    //   var data = {
    //     size: 10,
    //     index: 1,
    //     sortType: '',
    //   }
    //   if(this.categoryId){
    //     data.category = this.categoryId;
    //   };
    //   if(this.keyword){
    //     data.searchKey = this.keyword;
    //   };
    //   this.categoryColletion.ajaxOptions = {
    //     path:'/getProductList',
    //     data:data,
    //     type:'POST',
    //     needReset:true,
    //     showLoading:true,
    //     success:this.onSuccess.bind(this),
    //     error:this.onError.bind(this)
    //   }
    //
    //   this.categoryColletion.loadData(this.categoryColletion.ajaxOptions);
    // },

    initData: function(){
      if(this.categoryId){
        //this.findComponent('FilterControlView').initFilterData(this.categoryId);
        this.$('.filter-filter').removeClass('filter-filter-none');
      }else{
        this.$('.filter-filter').addClass('filter-filter-none');
      }
      var sortType = (this.keyword || this.categoryId) ? 5 : 1;
      var data = {
        size: 10,
        index: 1,
        sortType: 21,
        brand:"",
      }
      if(this.categoryId){
        data.category = this.categoryId;
      };
      if(this.keyword){
        data.searchKey = this.keyword;
      };
     console.log(data);
      this.categoryColletion.ajaxOptions = {
        path:'/getProductList',
        data:data,
        type:'POST',
        needReset:true,
        showLoading:true,
        success:this.onSuccess.bind(this),
        error:this.onError.bind(this)
      }
      this.categoryColletion.loadData(this.categoryColletion.ajaxOptions);
    },

    onSuccess: function(data){
      if(data.data.length == 0)
      {
        $('.add-blank-leaving-icon').show();
      }else{
        this.categoryColletion.add(data.data);
        $('.add-blank-leaving-icon').hide();
      }
      this.$('.common-search-holder').text(this.keyword||"请输入商品");

      this.notifyListType();
      if(this.isFirstLoad){
        this.clearAllSelectStyle();
        this.$(".order-all").addClass("theme-color");
        this.isFirstLoad = false;
      }
    },
    onError: function(){
       library.Toast("请求出错啦");
    },

    filterResult: function(sender) {
      this.categoryColletion.onFilter(sender.data);
      this.resetFilterUI();
    },

    toSearch: function(e) {
      this.findComponent("SearchMidPageView").callback = this.startSearch.bind(this);
      this.findComponent("SearchMidPageView").show();
    },

    startSearch:function(){
      this.onResume();
    },

    toBack: function(e) {
      window.app.searchKey = null;
      window.history.back();
    },

    onListTypeChange: function(e) {
      this.listType = this.listType == 'simple' ? 'double' : 'simple';
      console.log(this.listType);
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
          'padding-top': "2.5rem"
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
        $('.item-media-title').addClass('single-line-control');
      } else {
        $('#ProductListView').css({
          'padding': '0px',
          'padding-top': "2.4rem"
        });
        line.css({
          'border-bottom': '1px solid #ddd'
        });
        $('.table-view').css({
          'border-top': '1px solid #ddd',
          'border-bottom': '1px solid #ddd',
          'margin-bottom': '5px',
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
        $('.item-media-title').removeClass('single-line-control');
      }
    },

    orderType: 'down',
    filterStatus: 0,

    orderAll: function() {
      this.onOrder({sortType: 21,pageindex:1});
      this.resetFilterUI('all');
    },
    orderSales: function() {
      this.onOrder({sortType:20,pageindex:1});
      this.resetFilterUI('sales');
    },
    orderPrice: function() {
      this.orderType = this.orderType == "up" ? "down" : "up";
      if(this.orderType == 'up'){
        this.onOrder({sortType: 31,pageindex:1});
      }else{
        this.onOrder({sortType:30,pageindex:1});
      }
      this.resetFilterUI('price');
    },
    filterView:null,
    onFilter: function(e) {
      /*alert(this.categoryId)*/
      if(!this.filterView){
        this.filterView = new FilterView(this.$el,this.categoryId);
      }else{
        this.filterView.categoryId = this.categoryId;
      }
      this.filterView.show();
      this.$(".goodsfilter .typeselected").removeClass('typeselected');
      this.$(e.currentTarget).addClass('typeselected');
      this.resetFilterUI('filter');
    },
    onOrder: function(options) {
      if(options){
        for(key in options){
          this.categoryColletion.ajaxOptions.data[key] = options[key];
        }
      }
      this.categoryColletion.loadData();
    },

    onChangeFilter: function() {
      if (this.filterStatus == 1) {
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
    clearAllSelectStyle:function(){
      $('.order-all').removeClass("theme-color");
      $('.order-sales').removeClass("theme-color");
      $('.order-price').removeClass("theme-color");
      $('.filter-filter').removeClass("theme-color");
      $('.filter-icon-down').removeClass("theme-color");
      $('.filter-icon-up').removeClass("theme-color");
      $('.icomoon-screen').removeClass("theme-color");
    },
    resetFilterUI: function(type) {
      if (type != 'filter') {
        this.filterStatus = 0;
      }
      if(type){
        this.clearAllSelectStyle();
      }
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
      // this.onChangeFilter();
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

        //this.data.brand.(this.$(e.currentTarget).attr('data-id'));
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

    }

  });
});
