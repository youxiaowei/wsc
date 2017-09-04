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
    area_height: 0,
    events: {
      "click .common-search-right": "goMessageCenter",
      'click .common-search-left-inner': "toSearch",
    },
    toSearch: function() {
      this.findComponent("cate_search_midpage").show();
    },
    initLayout: function(me, data) {
      var demoData = data;
      me.C_Detail_Col = new CatelogDetailListCollection();
      var _this = me;
      var curID;
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
          curID = demoData[i].id
        }
        if (i != 0) {
          selectedclass = "";
        }
        me.leftUL.append($("<li data-id='" + demoData[i].id + "' data-index='" + i + "' class='" + selectedclass + "'>" + demoData[i].name + "</li>"));
      }
      me.leftArea.append(me.leftUL);
      me.leftScroller = new simpleScroller(me.leftArea[0], me.leftUL[0]);
      me.createDetailById(curID);
    },
    leftScroller: null,
    rightScroller: null,
    createDetailById: function(_id) {
      var _this = this;
      this.C_Detail_Col.loadData({

        path: '/getCategoryDetail',
        data: {id:_id},
        success: function(data) {
          if (data && data.status == "0") {
            Data = data.data;
          } else {
            library.Toast("加载数据失败");
            return;
          }
          _this.rightInnerArea.html("");
          for (var i = 0, j = Data.length; i < j; i++) {
            var group = Data[i];
            // if (group.head) {
            //   var groupAdDiv = $("<div class='cate-right-group-ad'><div>");
            //   var AdImg = $("<img src='" + group.head.imageurl + "'/>");
            //   groupAdDiv.append(AdImg);
            //   _this.rightInnerArea.append(groupAdDiv);
            // }
            var groupDiv = $("<div class='cate-right-group'><div>");
            var grouplist = group.list || [];
            var groupUL = $("<ul></ul>");
            for (var n = 0, m = grouplist.length; n < m; n++) {
              var groupitem = $("<li></li>");
              var groupitemdata = grouplist[n];
              var a = $("<a href='#category-navigate/product-list?id=" + groupitemdata.id + "'></a>");
              var img = $("<img src='" + groupitemdata.image + "'/>");
              var span = $("<span>" + groupitemdata.name + "</span>");
              a.append(img).append(span);
              groupitem.append(a);
              groupUL.append(groupitem);
            }
            groupDiv.append($("<div class='cate-right-group-title'>"+group.cName+"</div>"));
            groupDiv.append(groupUL);
            _this.rightInnerArea.append(groupDiv);
          }
          _this.rightInnerArea.append($("<div class='cate-group-empty'></div>"));

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
