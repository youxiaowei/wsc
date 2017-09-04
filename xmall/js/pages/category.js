/**
 * Created by liuqingling on 15/11/28.
 */
define(['./PageView', '../models/CatelogListCollection', '../models/CatelogDetailListCollection'], function(PageView, CatelogListCollection, CatelogDetailListCollection) {

  function simpleScroller(wrapper, innerWraper) {
    var _this = this;
    var testStyle = document.createElement("DIV").style;
    this.wrapper = wrapper;
    this.innerWraper = innerWraper;
    this.area_height = this.wrapper.offsetHeight;
    this.scroller_height = this.innerWraper.offsetHeight;
    this.canScrollHeight = this.scroller_height - this.area_height;
    if ("-webkit-transform" in testStyle) {
      this.transitionend = "webkitTransitionEnd";
      this.transform = "-webkit-transform";
      this.transition = "-webkit-transition";
    } else {
      this.transitionend = "transitionend";
      this.transform = "transform";
      this.transition = "transition";
    }
    this.leftTouchPara = {
      "startY": 0,
      "offsetY": 0,
      "midOffset": 0
    };

    wrapper.addEventListener("touchstart", function(e) {
      var touches = e.touches[0];
      this.start_time = new Date();
      _this.leftTouchPara.startY = touches.pageY;
      _this.leftTouchPara.midOffset = 0;
      _this.diff = 0;
    }, false);
    wrapper.addEventListener("touchmove", function(e) {
      e.preventDefault();
      var touches = e.touches[0];
      _this.diff = touches.pageY - _this.leftTouchPara.startY;
      if (_this.diff > 0) { //下
        _this.leftTouchPara.midOffset = _this.leftTouchPara.offsetY + _this.diff;
        _this.leftTouchPara.midOffset = _this.leftTouchPara.midOffset > 0 ? _this.leftTouchPara.midOffset / 3 : _this.leftTouchPara.midOffset;
      } else {
        var tem = _this.canScrollHeight < 0 ? 0 : _this.canScrollHeight;
        if ((0 - _this.leftTouchPara.midOffset - 110) > tem) {} else {
          _this.leftTouchPara.midOffset = _this.leftTouchPara.offsetY + _this.diff;
        }
      }
      innerWraper.style[_this.transition] = "none";
      innerWraper.style[_this.transform] = "translate3d(0, " + _this.leftTouchPara.midOffset + "px, 0px)";
    }, false);
    wrapper.addEventListener("touchend", function(e) {
      if (_this.diff == 0) {
        return;
      }
      var endTime = new Date();
      var diffTime = endTime - this.start_time;
      var canMoreScroll = 0;
      _this.leftTouchPara.offsetY = _this.leftTouchPara.midOffset;
      if (diffTime < 300) {
        if (_this.diff > 0) { //下
          _this.leftTouchPara.offsetY = _this.leftTouchPara.midOffset + 200;
        } else {
          _this.leftTouchPara.offsetY = _this.leftTouchPara.midOffset - 200;
        }
      }

      innerWraper.style[_this.transition] = _this.transform + " ease 0.6s";
      innerWraper.style[_this.transform] = "translate3d(0, " + (_this.leftTouchPara.offsetY) + "px, 0px)";

      if (_this.leftTouchPara.offsetY > 0) {
        _this.leftTouchPara.offsetY = 0;
        innerWraper.style[_this.transition] = _this.transform + " ease 0.4s";
        innerWraper.style[_this.transform] = "translate3d(0, 0px, 0px)";
      }
      if ((0 - _this.leftTouchPara.offsetY) > _this.canScrollHeight) {
        _this.leftTouchPara.offsetY = _this.canScrollHeight < 0 ? 0 : 0 - _this.canScrollHeight;
        innerWraper.style[_this.transition] = _this.transform + " ease 0.4s";
        innerWraper.style[_this.transform] = "translate3d(0, " + _this.leftTouchPara.offsetY + "px, 0px)";
      }
    }, false);
  }

  simpleScroller.prototype = {
    refresh: function() {
      this.area_height = this.wrapper.offsetHeight;
      this.leftTouchPara.offsetY = 0;
      this.scroller_height = this.innerWraper.offsetHeight;
      this.canScrollHeight = this.scroller_height - this.area_height;
      this.innerWraper.style[this.transform] = "translate3d(0, 0, 0)";
    },
    scrollTo: function(value) {
      this.leftTouchPara.offsetY = value;
      this.innerWraper.style[this.transition] = this.transform + " ease 0.4s";
      this.innerWraper.style[this.transform] = "translate3d(0, " + value + "px, 0px)";
    }
  };
  return PageView.extend({
    leftArea: null,
    leftItemHeight: 49,
    leftUL: null,
    curID:null,
    area_height: 0,
    sortType:21,
    colorChangeDivId: 'sortOrderAll',
    events: {
      "click .common-search-right": "goMessageCenter",
      'click .common-search-left-inner': "toSearch",
      'click .order-all': 'orderAll',
      'click .order-sales': 'orderSales',
      'click .order-price': 'orderPrice',
      'click .loadmore': 'loadmore'
    },
    loadmore:function(){
      library.Toast("已加载全部",1000);
    },
    orderAll:function(){
      this.sortType=21;
      this.colorChangeDivId='sortOrderAll';
      this.createDetailById(this.curID);
    },
    orderSales:function(){
      this.sortType=20;
      this.colorChangeDivId='sortOrderSales';
      this.createDetailById(this.curID);
    },
    orderPrice:function(){
      if(this.sortType==31){
          this.sortType=30;
      }else{
        this.sortType=31;
      }
      this.colorChangeDivId='sortOrderPrice';
      this.createDetailById(this.curID);
    },
    toSearch: function() {
      this.findComponent("cate_search_midpage").show();
    },
    initLayout: function(me, data) {
      var demoData = data;
      me.C_Detail_Col = new CatelogDetailListCollection();
      var _this = me;
      me.leftArea = me.$el.find("#cate_left");
      me.leftArea[0].addEventListener("click", function(e) {
        var target = e.target;
        if (target.tagName == "LI") {
          var dataIndex = target.getAttribute("data-index");
          var dataid = target.getAttribute("data-id");
          var dataIndex_int = parseInt(dataIndex);
          var itemHeight = target.offsetHeight;
          if (Math.abs(dataIndex_int * target.offsetHeight) < _this.leftScroller.canScrollHeight + itemHeight) {
            _this.leftScroller.scrollTo(0 - dataIndex_int * itemHeight);
          }
          _this.leftArea.find(".cate-left-li-cur").removeClass("cate-left-li-cur").removeClass("theme-color");
          target.classList.add("cate-left-li-cur");
          target.classList.add("theme-color");
          _this.createDetailById(dataid);
        }
      }, false);
      me.rightArea = me.$el.find("#cate_right");
      me.rightInnerArea = $("<div></div>");
      me.rightArea.append(me.rightInnerArea);
      me.leftArea.html("");
      me.leftUL = $("<ul></ul>");
      for (var i = 0, j = demoData.length; i < j; i++) {
        var selectedclass = 'cate-left-li-cur theme-color';
        if (i == 0) {
          this.curID = demoData[i].id
        }
        if (i != 0) {
          selectedclass = "";
        }
        me.leftUL.append($("<li data-id='" + demoData[i].id + "' data-index='" + i + "' class='" + selectedclass + "'>" + demoData[i].name + "</li>"));
      }
      me.leftArea.append(me.leftUL);
      me.leftScroller = new simpleScroller(me.leftArea[0], me.leftUL[0]);
      me.createDetailById(this.curID);
    },
    leftScroller: null,
    rightScroller: null,
    createDetailById: function(_id) {
      var _this = this;
          this.curID=_id;
    	var data = {
                      size: 1000,
                      index: 1,
                      sortType: _this.sortType,
                      brand:"",
    		              category: _id
                    }
      this.C_Detail_Col.loadData({

             path:'/getProductList',
                      data:data,
                      type:'POST',
                      needReset:true,
                      showLoading:true,
        success: function(data) {
          if (data && data.status == "0") {
            Data = data.data;
          } else {
            library.Toast("加载数据失败");
            return;
          }
              var groupDiv = $("<div class='cate-right-group'><div>");
              var goodsFilter=$("<div class='goodsfilter goodsfilter1'></div>");
              var orderAllFilter=$("<div id='sortOrderAll' class='order-all filter'><span>综合排序</span></div>");
              var orderSalesFilter=$("<div id='sortOrderSales' class='order-sales filter'><span>销量优先</span></div>");
              var orderPriceFilter=$("<div id='sortOrderPrice' class='order-price filter'><span>价格</span></div>");
              var filterPriceIcon=$("<span class='filter-icon filter-price-icon'><div class='icomoon icomoon-pullup filter-icon-up' id='sortOrderPriceUp'></div><div class='icomoon icomoon-pulldown filter-icon-down' id='sortOrderPriceDown'></div></span>");
              orderPriceFilter.append(filterPriceIcon);
              goodsFilter.append(orderAllFilter).append(orderSalesFilter).append(orderPriceFilter);
              groupDiv.append(goodsFilter);
          _this.rightInnerArea.html("");
                var groupUL = $("<ul class='table-view'></ul>");
    			for (var n = 0, m = Data.length; n < m; n++) {

                  var groupitem = $("<li class='table-view-cell media favorite-item list-content' id='list"+n+"'></li>");
                  var listItem = $("<div id='listItem"+n+"' class='list-item'></div>");
                  var listTextContext=$("<input id='listTextContext"+n+"' type='hidden'></input>");
                  var img = $("<img id='salesImg"+n+"' class='item-media-object media-object pull-left item-media-object-single-line'>");
                  var itemMediaBody = $("<div id='itemMediaBody"+n+"' class='media-body item-media-body'></div>");

    		var itemMediaTitle=$("<div class='item-media-title'><span id='salesName"+n+"'></span</div>");

    		var itemMediaMark=$("<div class='item-media-mark'><span class='price-unit'>￥</span><span class='price'><span id='salesPrice"+n+"'></span</span></div>");

    		var itemMediaDes=$("<div class='item-media-des'><span>销量: <span id='salesNumber"+n+"'></span></span></div>");
                  itemMediaBody.append(itemMediaTitle).append(itemMediaMark).append(itemMediaDes);
                  listItem.append(img).append(itemMediaBody);

    		            groupitem.append(listItem);
                    groupitem.append(listTextContext);
                  groupUL.append(groupitem);
                  groupDiv.append(groupUL);
            _this.rightInnerArea.append(groupDiv);


    	      $('#salesImg'+n).attr('src',Data[n].image);
            $('#listTextContext'+n).val(Data[n].id);
            $('#salesPrice'+n).text(Data[n].price);
            $('#salesNumber'+n).text(Data[n].salesNumber);
            $('#salesName'+n).text(Data[n].name);
            $('.goodsfilter1').css({
              'margin-top':'-15px',
              'position': 'relative'
                  });


            $('.actived').css({
              'color':'#F63'
                 });

            $('#list'+n).click(function(clickData){
              var idNum = clickData.currentTarget.id.replace(/[^0-9]/ig,"");
              var goodsId=$('#listTextContext'+idNum).val();
              Backbone.history.navigate("#category-navigate/itemdetail?goodsid="+goodsId,{
                trigger: true
              });
                  });
            $("#"+_this.colorChangeDivId).siblings().removeClass("actived");
            $("#"+_this.colorChangeDivId).addClass("actived");
              if(_this.colorChangeDivId=='sortOrderPrice')
              {
                if(_this.sortType==31)
                {
                  $('#sortOrderPriceUp').css({
                    'color':'#F63'
                  });
                }else{
                  $('#sortOrderPriceDown').css({
                    'color':'#F63'
                  });
}
              }
                }
                var loadMore=$("<button class='loadmore'><div class='label'>已加载全部</div><span class='loading-icon'></span></button>");
              _this.rightInnerArea.append(loadMore).append($("<div class='cate-group-empty'></div>"));

          if (!_this.rightScroller) {
            _this.rightScroller = new simpleScroller(_this.rightArea[0], _this.rightInnerArea[0]);
          } else {
            _this.rightScroller.refresh();
          }

        },
        error: function() {

        }

      });

    },
    onRender: function() {
      var C_List = new CatelogListCollection();
      var _this = this;
      C_List.loadData({
        success: function(data) {
          if (data.status == "0") {
            _this.initLayout(_this, data.data);
            window.application.setLocalStorage('category',data.data);
          } else {
            library.Toast("数据出错");
          }
        },
        path: '/getCategory',
        type: 'POST',
        error: function() {

        }
      });
    },
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onResume: function() {
      this.toggleBar && this.toggleBar("show");
    },
    goMessageCenter:function(){
      var userInfo = application.getUserInfo();
      if(!userInfo || !userInfo.userid){
        Backbone.history.navigate('#category-navigate/login/login', {
          trigger: true
        });
      }else{
        Backbone.history.navigate('#category-navigate/messageCenter', {
          trigger: true
        })
      }
    }
  });

});
