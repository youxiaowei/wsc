define(['./BaseView', './HomePushView', '../models/PushCollection'], function(BaseView, HomePushView, PushCollection) {

  return BaseView.extend({
    type: "PushForYouView",

    events: {
      "click .home-goods-discount": "itemClick"
    },

    itemClick: function(e) {
      var itemView = $(e.currentTarget);
      var goodsId = itemView.attr("data-pid");
      console.log(e.currentTarget);
      if (goodsId) {
        Backbone.history.navigate("#shopingcart-navigate/itemdetail?goodsid=" + goodsId, {
          trigger: true
        });
      }
    },

    render: function() {
      var template = library.getTemplate('push-for-you.html');
      this.$el.append(template);
      this.initContent();
      return this;
    },
    pushList: null,
    initContent: function() {
      var options = {
        "template": "push-for-you-item.html",
        "collection": "AjaxCollection",
        "type": "ListView"
      }
      this.pushList = this.getListView(options);
      this.$('.pfy-content').append(this.pushList.$el);
			//this.pushList.collection.reset(this.testData);
      var _this = this;
      var all = new PushCollection();
      all.loadData(_this.getOption());
    },

    testData: [{
      "id": "010011JZA8F10OQZQ17Y",
      "unit": "套       ",
      "price": 188,
      "sales": 0,
      "name": "Zespri佳沛有机奇异果36个（95g,+-10g）",
      "image": "http://bmall.yonyou.com/2016/03/02/0100J1K0P1Q818SZ352R.png"
    }, {
      "id": "010051JZC8KQ0PHB41PZ",
      "unit": "包       ",
      "price": 6,
      "sales": 0,
      "name": "精选延庆生态西红柿600g",
      "image": "http://bmall.yonyou.com/2016/03/02/010011K001QT19VIM9RX.jpg"
    }, {
      "id": "0100Y1JZS8MV153RI72A",
      "unit": "件       ",
      "price": 13999,
      "sales": 0,
      "name": "【TECO東元】42型 全民電唱LCD顯示器 (TL4270TR+TS0903TRA / TS1010TRA)",
      "image": "http://bmall.yonyou.com/2016/03/03/0100I1K0U1RN0P6V64YH.png"
    }, {
      "id": "010021JZT8IO1187PQII",
      "unit": "件       ",
      "price": 188,
      "sales": 0,
      "name": "越南红心火龙果1.2kg",
      "image": "http://bmall.yonyou.com/2016/03/02/0100T1K091Q418JR97NF.png"
    }],

    getOption: function() {
	    var options = {
	      path: "/getPushInfo",
	      type: "POST",
	      data: {},
	      success: this.onSuccess.bind(this),
	      error: this.onError.bind(this)
	    }
	    return options;
    },
    onSuccess: function(data) {
      var list = data.data;
      this.pushList.collection.reset(list);
    },
    onError: function(e) {

    },
    getListView: function(cfg) {
      var Component = window.library.getComponent(cfg.type);
      if (!Component) throw new Error('Component ' + cfg.type + ' Not Exists.');
      var component = new Component(cfg).render();
      component.setOptions(cfg); // TODO: should be removed ?
      return component;
    },
  });
});
