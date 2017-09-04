define(['./PageView', 'require'], function (PageView, require) {

  return PageView.extend({

    events: {
      "click .header-icon-back": "goback",
      "click .address-view-li": "cellClickChange",
      "click .address-actionBtn": "addClick",
      "click .icomoon-moremore": "menuMore"
    },

    notifyEdit: null,
    _this: null,
    isDefault: null,
    defaultTarget: null,
    defaultCurrentTarget: null,
    addresscollection: null,
    initialize: function () {
      this.listenTo(this.findComponent('PopupMenu'), "toSearch", this.toSearch.bind(this));
      this.addresscollection = this.findComponent('AddressListView').getCollection();
    },

    menuMore: function (e) {
      this.findComponent("PopupMenu").show();
    },
    toSearch: function (e) {
      this.findComponent("SearchMidPageView").show();
    },
    cellClickChange: function (e) {

      var index = $(e.currentTarget).index();
      var addresscollection = this.findComponent('AddressListView').getCollection();
      var addressInfo = addresscollection.models[index];
      var addressId = addressInfo.get('addressId');
      var _this = this;
      if (e.target.dataset.name === 'delete') {
        if ($(e.currentTarget).attr('default') != 'true1') {
          library.MessageBox("提示信息", "删除地址后，将不可恢复，确认删除？", [{
            leftText: "确定",
            callback: function () {
              //同时删除数据库数据
              var _Model = require("../models/BaseModel");
              var model = new _Model();
              var options = {
                url: window.app.api + '/my-address/delete',
                type: "POST",
                needReset: true,
                data: {
                  addressId: addressId
                },
                datatype: "json",
                success: function (res) {
                  if (res.status == "0") {
                    library.Toast("删除成功");
                    addresscollection.loadData();
                  } else {
                    library.Toast("删除失败，请稍后再试！");
                  }
                },
                error: function () {
                  //请求出错处理
                }
              }
              model.loadData(options);
            }
          }, {
            rightText: "取消",
            callback: function () { }
          }]);
        } else {
          library.Toast('默认地址不能删除');
        }
      } else if (e.target.dataset.name === 'edit') {
        if (this.notifyEdit != null) {
          this.notifyEdit.remove();
        }
        var notifyEdit = require("../components/EditAddressView");
        this.notifyEdit = new notifyEdit({
          addressInfo: addressInfo.toJSON(),
          pageStatus: 'edit',
          callback: this.notifySaveResult.bind(this)
        });
        this.$el.append(this.notifyEdit.render().el);
        this.notifyEdit.$el.addClass('addressEdit-view');
        var _this = this;
        setTimeout(function () {
          _this.notifyEdit.$el.addClass('addressEdit-view-show');
        }, 50);

      } else if (e.target.dataset.name === "defaultSet") {
        //设置为默认地址
        if ($(e.currentTarget).attr('default') == 'true') {
          return;
        }
        var options = {
          url: window.app.api + '/my-address/setDefault',
          type: "POST",
          needReset: true,
          data: {
            userId: JSON.parse(localStorage.getItem('userinfo')).userid,
            addressId: addressId
          },
          datatype: "json",
          success: function (res) {
            console.log(res);
            //更新default属性
            if (res.status == "0") {
              library.Toast('设置默认地址成功', 1000);
              _this.addresscollection.loadData({
                path: '/my-address/list',
                type: 'POST',
                needReset: true,
                showLoading: true,
                data: {
                  userId: application.getUserInfo().userid,
                  index: 1,
                  size: 100
                }
              });
            } else {
              library.Toast(res.message, 1000);
            }

          },
          error: function () {
            //请求出错处理
          }
        }
        addresscollection.loadData(options);
      }
    },
    addClick: function (e) {
      if (this.addresscollection.length > 9) {
        library.Toast("最多建立10个收获地址哦");
        return;
      }
      if (this.notifyEdit.pageStatus != 'add') {
        this.notifyEdit.remove();


        var notifyEdit = require("../components/EditAddressView");
        this.notifyEdit = new notifyEdit({
          userid: JSON.parse(localStorage.getItem('userinfo')).userid,
          pageStatus: 'add',
          callback: this.notifySaveResult.bind(this)
        });

        this.$el.append(this.notifyEdit.render().el);
        this.notifyEdit.$el.addClass('addressEdit-view');
      }
      var _this = this;
      this.notifyEdit.$el.addClass('addressEdit-view-show');
      this.$(".aName").val("");
      this.$(".aLink").val("");
      this.$(".aDetail").val("");
      $(".province > option:first").attr("selected", true);
      $(".city > option:first").attr("selected", true);
      $(".area > option:first").attr("selected", true);
      /* this.$("select").find("option").val("-1");*/

    },
    goback: function (e) {
      window.history.back();
    },
    onRender: function () {
      this.findComponent('AddressListView').itemRenderFinished = this.itemRenderFinished.bind(this);
      this.$el.css("background-color", "whitesmoke");
      if (this.notifyEdit == null) {
        var notifyEdit = require("../components/EditAddressView");
        this.notifyEdit = new notifyEdit({
          userid: JSON.parse(localStorage.getItem('userinfo')).userid,
          pageStatus: 'add',
          callback: this.notifySaveResult.bind(this)
        });

        this.$el.append(this.notifyEdit.render().el);
        this.notifyEdit.$el.addClass('addressEdit-view');
      }
    },
    itemRenderFinished: function () {
      if (this.findComponent('AddressListView').getCollection().models.length == 0) {
        $(".component_container").hide();
        $(".blank_tips").show();
      } else {
        $(".blank_tips").hide();
        $(".component_container").show();
      }
    },
    onResume: function () {
      //数据填入和选项变化。
      PageView.prototype.onResume.apply(this, arguments);
      this.addresscollection.loadData({
        path: '/my-address/list',
        type: 'POST',
        needReset: true,
        showLoading: true,
        data: {
          userId: application.getUserInfo().userid,
          index: 1,
          size: 100
        }
      });
      window.scrollTo(0, 0);
      if (window.app.address) {
        this.addressHandle(window.app.address);
        window.app.address = null;
      }
    },
    addressHandle: function (address) {
      var type = address.type;
      switch (type) {
        case "1":
          $("#city select[name='address.idP']").val(address.id);
          $("#city select[name='address.idP']").trigger('change', [true]);

          break;
        case "2":
          $("#city select[name='address.idCity']").val(address.id);
          $("#city select[name='address.idCity']").trigger('change', [true]);
          break;
        case "3":
          $("#city select[name='address.idArea']").val(address.id);
          $("#city select[name='address.idArea']").trigger('change', [true]);
          break;
        default:
          break;
      }
    },
    notifySaveResult: function (param) {
      this.addresscollection.loadData();
      library.Toast('保存成功', 1000);
    },
  });
});
